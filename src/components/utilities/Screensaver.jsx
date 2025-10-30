import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tap from "../../assets/tap.svg";
import VideoPlayer from "../UI/VideoPlayer.jsx";

function Screensaver() {
    const [videoData, setVideoData] = useState([]);
    const navigate = useNavigate();

    const fetchVideoTotem = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APP_API_URL}/video-totem`
            );
            const data = await response.json();
            if (response.ok) {
                console.log("Dataset ricevuto:", data);
                setVideoData(data);
            } else {
                console.error("Errore nel recupero del dataset:", data);
            }
        } catch (error) {
            console.error("Errore durante il caricamento del dataset:", error);
        }
    };

    // Carica SUBITO al mount + aggiorna ogni 2 minuti
    useEffect(() => {
        fetchVideoTotem();
        const interval = setInterval(fetchVideoTotem, 120000);
        return () => clearInterval(interval);
    }, []);

    function handleScreensaverClick() {
        navigate("/"); // Torna subito alla home
    }

    return (
        <div
            className="absolute top-0 left-0 w-full h-screen overflow-hidden"
            style={{ zIndex: 99999 }}
            onClick={handleScreensaverClick}
            onTouchStart={handleScreensaverClick}
        >
            {videoData.length > 0 && (
                <div
                    className="absolute top-0 left-0 w-full"
                    style={{ objectFit: "cover", height: "100vh" }}
                >
                    <VideoPlayer videoData={videoData[0].video} />
                </div>
            )}

            {/* Overlay nero trasparente con gradient */}
            <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)",
                    zIndex: 5,
                }}
            ></div>

            <div
                className="absolute bottom-20 w-full text-center flex justify-center"
                style={{ zIndex: 15 }}
            >
                <div className="m-auto p-4 rounded-xl flex justify-center items-center flex-wrap w-full text-center">
                    <img src={tap} width={200} className="mb-5" />
                    <p
                        className="text-white font-bold w-full"
                        style={{ lineHeight: "70px", fontSize: "90px" }}
                    >
                        Tocca e scopri
                    </p>
                    <p
                        className="text-white w-full mt-2"
                        style={{ lineHeight: "70px", fontSize: "60px" }}
                    >
                        Tap and discover
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Screensaver;