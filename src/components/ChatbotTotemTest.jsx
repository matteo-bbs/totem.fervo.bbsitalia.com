import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import giphy from "../assets/giphy.gif";
import rimuovi from "../assets/deleteTest.svg"
import microphone from "../assets/microphoneTest.svg"
import {useNavigate} from "react-router-dom";

import "./Chatbot.css";
import i18n from "i18next";
import {useTranslation} from "react-i18next";

const ChatbotTotemTest = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState(""); // Testo manuale dell'utente
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isRecordingStart, setIsRecordingStart] = useState(false);
    const [transcript, setTranscript] = useState(""); // Testo trascritto (solo per visualizzazione)
    const [error, setError] = useState("");
    const [recordingTime, setRecordingTime] = useState(0);
    const messagesEndRef = useRef(null); // Scroll verso l'ultimo messaggio
    const { t } = useTranslation();
    const [lingua, setSavedLanguage] = useState();
    const [loaded, setLoaded] = useState(false);

    // Ref per il transcript, per evitare problemi di aggiornamento asincrono
    const transcriptRef = useRef("");

    // Riferimenti per il riconoscimento e il timeout
    const recognitionRef = useRef(null);
    const isStoppingRef = useRef(false);
    const silenceTimeoutRef = useRef(null);

    useEffect(() => {
        const savedLang = localStorage.getItem("lang") || "it"; // lingua di default
        i18n.changeLanguage(savedLang);
        setSavedLanguage(savedLang);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Ascolta il messaggio di Unity che segnala che l'avatar è attivo

    useEffect(() => {
        const handleUnityMessage = (event) => {
            // Se necessario, controlla anche event.origin per assicurarti che provenga dal dominio Unity
            console.log("Messaggio ricevuto da Unity:", event.data);
            if (typeof event.data === "string" && event.data === "UnityReady") {
                console.log("Unity è avviato!");
                // Qui puoi eseguire la logica che ti serve, per esempio:
                sendMessage(t('comeusoiltotem')); // ✅ solo stringa
            }
        };

        window.addEventListener("message", handleUnityMessage);
        return () => {
            window.removeEventListener("message", handleUnityMessage);
        };
    }, []);

    // sendMessage invia il messaggio al chatbot
    const sendMessage = async (msg) => {
        const messageToSend = msg ? msg.trim() : (input.trim() || transcript.trim());
        console.log("Messaggio da inviare:", messageToSend);
        setIsRecordingStart(true);
        setIsRecording(false);
        if (!messageToSend) {
            setIsRecordingStart(false);
            return;
        }

        const userMessage = { role: "user", content: messageToSend, isDataset: undefined };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        const lang = localStorage.getItem("lang") || "it";

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: messageToSend,
                    language: lang,
                }),
            });

            const data = await response.json();
            const botMessage = {
                role: "bot",
                content: data.answer,
                isDataset: data.isDataset,
            };

            setMessages((prev) => [...prev, botMessage]);
            setIsSpeaking(true);
            playAudio(data.answer).then(() => setIsSpeaking(false));
        } catch (error) {
            console.error("Errore:", error);
        } finally {
            setIsLoading(false);
            setIsRecordingStart(false);
            setInput("");
            setTranscript("");
            transcriptRef.current = "";
        }
    };

    // playAudio chiama l'API per ottenere l'audio e lo invia all'iframe Unity
    const playAudio = async (text, language) => {
        setIsRecordingStart(true);
        try {
            const lang = localStorage.getItem('lang') || 'it';
            const response = await fetch(`${import.meta.env.VITE_API_URL}/speak`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, language: lang }),
            });
            const data = await response.json();
            const audioUrl = `https://api.assistente.bbsitalia.com/public${data.audioUrl}`;
            const unityFrame = document.getElementById("unityFrame");
            if (unityFrame) {
                unityFrame.contentWindow.postMessage({ type: "sendAudioURL", url: audioUrl }, "*");
                unityFrame.contentWindow.sendAudioURL(audioUrl);
                console.log("Messaggio inviato all'iframe con URL audio:", audioUrl);
            } else {
                console.error("Impossibile trovare l'iframe con ID 'unityFrame'.");
            }
        } catch (error) {
            console.error("Errore durante la riproduzione dell'audio:", error);
        }
    };

    const stopAudio = () => {
        const unityFrame = document.getElementById("unityFrame");
        if (unityFrame && unityFrame.contentWindow) {
            unityFrame.contentWindow.postMessage({ type: "stopAudio" }, "*");
            unityFrame.contentWindow.stopAudio();
        } else {
            console.error("Funzione stopAudio non trovata nell'iframe o l'iframe non è ancora caricato.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    const toggleFullScreen = () => {
        const doc = document.documentElement;
        if (!document.fullscreenElement) {
            doc.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const clearChat = () => {
        setMessages([]);
        stopAudio()
    };

    const handleStartRecording = () => {
        setError("");
        console.log("isloadin", isLoading);

        if (isSpeaking === false) {
            console.log("Sta parlando", isSpeaking);
            stopAudio();
            setIsSpeaking(false);
            console.log("isloadin speaking false", isLoading);
            setIsLoading(true);
        }

        if (isRecording && recognitionRef.current && !isStoppingRef.current) {
            console.log("isloadin interruption", isLoading);
            console.log("Interruzione registrazione");
            isStoppingRef.current = true;
            setIsLoading(true);
            recognitionRef.current.stop();
            return;
        }

        setTranscript("");
        setInput("");
        transcriptRef.current = "";
        setIsRecording(true);
        setIsRecordingStart(true);

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError("Il tuo browser non supporta il riconoscimento vocale.");
            setIsRecording(false);
            setIsRecordingStart(false);
            console.log("isloadin !speech", isLoading);
            return;
        }

        const recognitionInstance = new SpeechRecognition();
        recognitionRef.current = recognitionInstance;
        recognitionInstance.lang = `${lingua}-${lingua ? lingua.toUpperCase() : "IT"}`;
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;

        recognitionInstance.onstart = () => {
            console.log("Avviata registrazione");
            if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
            console.log("isloadin onstart", isLoading);
        };

        recognitionInstance.onresult = (event) => {
            console.log("isloadin onresult", isLoading);
            const lastResult = event.results[event.results.length - 1];
            const isFinal = lastResult.isFinal;
            if (isFinal) {
                const text = lastResult[0].transcript.trim();
                console.log("Testo finale trascritto:", text);
                if (text.length > 0) {
                    const newTranscript = (transcriptRef.current + " " + text).trim();
                    transcriptRef.current = newTranscript;
                    setTranscript(newTranscript);
                }
                console.log("isloadin onfinal", isLoading);
                if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
                silenceTimeoutRef.current = setTimeout(() => {
                    recognitionInstance.stop();
                    console.log("isloadin onsilence", isLoading);
                    setIsLoading(true);
                }, 500);
            }
        };

        recognitionInstance.onerror = (event) => {
            console.error("Errore:", event.error);
            setError("Errore nella registrazione.");
            setIsRecording(false);
            setIsRecordingStart(false);
            console.log("isloadin onerror", isLoading);
            setIsLoading(false);
            isStoppingRef.current = false;
        };

        recognitionInstance.onend = () => {
            console.log("Fine registrazione");
            console.log("isloadin onend", isLoading);
            const messageToSend = transcriptRef.current.trim();
            setIsLoading(false);
            if (messageToSend) {
                console.log("isloadin onmessagesend", isLoading);
                setIsLoading(true);
                sendMessage(messageToSend);
            }
            setIsRecording(false);
            setIsRecordingStart(false);
            isStoppingRef.current = false;
            transcriptRef.current = "";
        };

        recognitionInstance.start();
    };

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [recognitionRef]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
        setTranscript("");
    };


    const navigator = useNavigate()

    const goToHome = () => {
        navigator('/')
    }
    return (
        <div className={"overflow-hidden"} style={{height: "75vh", position: 'relative'}}>
                <div
                    className="w-full overflow-hidden"
                    style={{
                        height: "75vh",
                        marginTop: "0px",
                        backgroundColor: "#f5f5f5",
                    }}
                >
                    {!loaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
                            <p>Caricamento avatar...</p>
                        </div>
                    )}

                    <iframe
                        id="unityFrame"
                        src="/avatar/index.html"
                        title="Unity App"
                        onLoad={() => setLoaded(true)}
                        style={{ width: "100%", height: "100%", marginTop: '-60px', transform: 'scale(1.09)' }}
                    />
                </div>

                <div className="flex flex-col w-full absolute bottom-[30px] pb-4" style={{height: "30vh", overflowY: "auto"}}>
                    <div className="flex-1 p-4" style={{overflowY: "auto", height: "calc(100% - 240px)"}}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-4 py-3 rounded-md ${msg.role === "user" ? "bg-custom-grey text-white" : "bg-bbs text-white"}`}
                                >
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({node, ...props}) => <p className="mb-0 font-chat" {...props} />,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start overflow-hidden">
                                <div className="px-4 py-2 rounded-md max-w-xs bg-bbs text-center items-center flex text-sm animate__animated animate__pulse text-white">
                                    Sto pensando...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef}/>
                    </div>

                    <div className="p-4 flex w-full gap-4 content-center items-center relative overflow-hidden h-[200px]">
                        <div className="w-full relative input-container overflow-hidden">
                            <input
                                className="hidden w-full border rounded-full input-text"
                                value={input || transcript}
                                disabled={false}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                            />
                            {error && <p className="text-[#335083]">{error}</p>}
                        </div>

                        {/*<button*/}
                        {/*    onClick={goToHome}*/}
                        {/*    className="bg-transparent absolute bottom-0 px-0 mx-0"*/}
                        {/*    style={{left: 15}}*/}
                        {/*>*/}
                        {/*    <img src={home}/>*/}
                        {/*</button>*/}

                        <button
                            onClick={clearChat}
                            className="bg-transparent absolute bottom-0 px-0 mx-0"
                            style={{right: 15}}
                        >
                            <img src={rimuovi}/>
                        </button>

                        {isRecording ? (
                            <div>
                                <button onClick={handleStartRecording} className="bg-transparent button-microphone">
                                    <img src={giphy} style={{width: "10rem", backgroundColor: '#434242'}} className="p-2 rounded-full"/>
                                </button>
                            </div>
                        ) : (
                            <div>
                                <button onClick={handleStartRecording} disabled={isRecordingStart} className="bg-transparent button-microphone">
                                    <img src={microphone} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
    );
};

export default ChatbotTotemTest;
