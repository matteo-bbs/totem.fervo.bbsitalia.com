import React, { useEffect, useState } from "react";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";
import axios from "../api";

const VideoGallery = ({ videos }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const currentLanguage = localStorage.getItem('lang');

    // --- Carica i video dal backend
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/media/video/${videos}`)
            .then((response) => {
                setData(response.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Errore caricamento video:", err);
                setError(true);
                setIsLoading(false);
            });
    }, [videos]);

    // --- Masonry layout
    useEffect(() => {
        if (data.length === 0) return;
        const container = document.querySelector(".masonry-video-gallery");
        if (container) {
            const msnry = new Masonry(container, {
                itemSelector: ".gallery-item",
                columnWidth: ".grid-sizer",
                percentPosition: true,
            });
            imagesLoaded(container).on("progress", function () {
                msnry.layout();
            });
        }
    }, [data]);

    // --- Stati caricamento/errore ---
    if (isLoading) {
        return <p className="text-center p-6">Caricamento video...</p>;
    }

    if (error) {
        return (
            <div className="w-full flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#335083] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 5a7 7 0 00-7 7v5h14v-5a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Errore</h2>
                <p className="text-gray-600">Impossibile caricare i video. Riprova più tardi.</p>
            </div>
        );
    }

    return (
        <div className="gallery-wrapper relative">
            <div id="video-gallery" className="masonry-video-gallery flex flex-wrap">
                <div className="grid-sizer"></div>

                {data.map((video, i) => (
                    <div
                        key={i}
                        className="gallery-item w-72 cursor-pointer relative me-5 mb-5"
                        onClick={() =>
                            setSelectedVideo(
                                `${import.meta.env.VITE_APP_BACKEND_URL}${video.video}`
                            )
                        }
                    >
                        <img
                            className="object-cover w-full h-48 rounded-lg shadow-xl bg-black"
                            src={`${import.meta.env.VITE_APP_BACKEND_URL}${video.immagine_anteprima_video}`}
                            alt={`video-${i}`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-16 h-16 text-white opacity-80"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal custom */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="relative max-w-4xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video
                            src={selectedVideo}
                            controls
                            autoPlay
                            className="w-full max-h-[80vh] bg-black rounded-lg"
                        />
                    </div>

                    {/* Barra in fondo come Gallery */}
                    <div className="pswp__custom-bar pswp__hide-on-close">
                        <button
                            className="pswp__custom-btn"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 49 49">
                                <g transform="translate(-28 -83.202)">
                                    <g transform="translate(28 83.202)" fill="none" stroke="#335083" strokeWidth="1">
                                        <rect width="49" height="49" rx="6" stroke="none"/>
                                        <rect x="0.5" y="0.5" width="48" height="48" rx="5.5" fill="none"/>
                                    </g>
                                    <g transform="translate(-4373.164 -3482.057)">
                                        <g transform="translate(4420.5 3584.5)">
                                            <line x2="10.328" y2="10.518" fill="none" stroke="#335083" strokeLinecap="round" strokeWidth="3"/>
                                            <path d="M10.328,0,0,10.518" fill="none" stroke="#335083" strokeLinecap="round" strokeWidth="3"/>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <style>{`
.pswp__custom-bar.pswp__hide-on-close {
    width: 100%;
    bottom: 0px;
    position: absolute;
    display: flex;
    justify-content: center;
    background: white;
    padding: 10px 0;
}

.pswp__custom-bar.pswp__hide-on-close * {
    color: black;
}

.pswp__custom-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
            `}</style>
        </div>
    );
};

export default VideoGallery;
