import React, {useCallback, useEffect, useRef, useState} from "react";
import {Routes, Route, useNavigate} from "react-router-dom";
import Screensaver from "./components/utilities/Screensaver.jsx";
import Home from "./pages/Home.jsx";
import { PaginaSezione } from "./pages/PaginaSezione.jsx";
import { DetailPage } from "./components/subpage/DetailPage.jsx";
import {DetailSinglePage} from "./pages/DetailSinglePage.jsx";
import {BackButtonWhite} from "./components/UI/BackButtonWhite.jsx";

function App() {
    // 🔹 Verifica lingua in localStorage
    useEffect(() => {
        const storedLang = localStorage.getItem("lang");
        if (!storedLang) {
            localStorage.setItem("lang", "it"); // default italiano
        }
    }, []);

    console.log(localStorage.getItem("lang"));
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            window.location.reload(); // Ricarica quando torna internet
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const navigate = useNavigate();
    const timeoutRef = useRef();

    const resetTimeout = useCallback(() => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            navigate("/screensaver");
        }, 120000); // 2 minuti
    }, [navigate]);

    useEffect(() => {
        const handleInteraction = () => resetTimeout();

        document.addEventListener("click", handleInteraction);
        document.addEventListener("touchstart", handleInteraction);

        resetTimeout();

        return () => {
            document.removeEventListener("click", handleInteraction);
            document.removeEventListener("touchstart", handleInteraction);
            clearTimeout(timeoutRef.current);
        };
    }, [resetTimeout]);

    if (!isOnline) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
                {/* Icona Wi-Fi Off */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 text-[#335083] mb-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25a15.75 15.75 0 0119.5 0m-3.182 3.182a10.5 10.5 0 00-13.136 0m3.182 3.182a5.25 5.25 0 016.772 0M12 20.25h.008v.008H12v-.008z"
                    />
                </svg>

                {/* Titolo */}
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    Sei offline
                </h1>

                {/* Messaggio */}
                <p className="text-lg text-gray-600 max-w-md">
                    Controlla la tua connessione a Internet.
                    L’app tornerà disponibile automaticamente non appena la
                    connessione verrà ristabilita.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="app overflow-hidden" style={{ height: "100vh" }}>
                <div style={{ height: "93vh" }}>
                    <Routes>
                        {/* Pagine pubbliche */}
                        <Route path="/" element={<Home />} />
                        <Route path="/pagina-sezione" element={<PaginaSezione />} />
                        <Route path="/contenuto/:id" element={<DetailPage />} />
                        <Route path="/pagina-singola/:id" element={<DetailSinglePage />} />
                        <Route path="/screensaver" element={<Screensaver />} />

                        {/* Catch-all: qualsiasi altro path */}
                        <Route
                            path="*"
                            element={
                                <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
                                    <h1 className="text-3xl font-bold text-gray-800 mb-3">Pagina non trovata</h1>
                                    <p className="text-lg text-gray-600 max-w-md">
                                        L’indirizzo inserito non esiste o non è disponibile.
                                    </p>
                                    <div className={'bg-white absolute bottom-0 w-full shadow border h-[10vh] b-t-l-r-15 border-gray-300 content-center flex flex-wrap items-center p-8'}>
                                        <BackButtonWhite sfondo={'true'}/>
                                    </div>
                                </div>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;
