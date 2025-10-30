import { useEffect, useRef, useState } from "react";
import axios from "../api";
import logoBBS from "../../assets/Logo-BBS-Colori.png";

const useAdvertisingVideos = () => {
    const [data, setData] = useState(null);
    const videoRefs = useRef([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isSingleVideo, setIsSingleVideo] = useState(false);
    const currentLanguage = localStorage.getItem('lang');

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/advertising-video`)
            .then((response) => {
                setData(response.data);
                setIsSingleVideo(response.data?.rows?.length === 1);
            })
            .catch((error) => console.error("Errore fetch advertising video:", error));
    }, []);

    useEffect(() => {
        if (!data || !data.rows?.length) return;

        const currentVideo = videoRefs.current[currentVideoIndex];
        if (currentVideo) {
            currentVideo.addEventListener("ended", handleVideoEnd);
            currentVideo.play().catch(() => {});
        }

        return () => {
            if (currentVideo) {
                currentVideo.removeEventListener("ended", handleVideoEnd);
                currentVideo.pause();
            }
        };
    }, [currentVideoIndex, data]);

    const handleVideoEnd = () => {
        if (!isSingleVideo) {
            setCurrentVideoIndex((prev) => (prev + 1) % data.rows.length);
        } else {
            const currentVideo = videoRefs.current[currentVideoIndex];
            if (currentVideo) {
                currentVideo.currentTime = 0;
                currentVideo.play().catch(() => {});
            }
        }
    };

    return { data, videoRefs, currentVideoIndex, isSingleVideo };
};

const HeaderTotem = () => {
    const { data, videoRefs, currentVideoIndex, isSingleVideo } = useAdvertisingVideos();

    return (
        <div className="flex flex-wrap h-[20vh] content-center items-center p-8 relative overflow-hidden">
            {/* Logo sopra i video */}
            <img
                className="w-[150px] h-auto m-auto relative z-10"
                src={logoBBS}
                alt="Fano Logo"
            />

            {/* Video background */}
            {data?.rows?.map((item, index) => (
                <video
                    key={index}
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={`${import.meta.env.VITE_APP_BACKEND_URL}${item.video}`}
                    autoPlay={index === 0}
                    muted
                    loop={isSingleVideo} // 🔹 usa loop se c'è un solo video
                    className="w-full h-full object-cover absolute top-0 left-0 z-0"
                    style={{ display: index === currentVideoIndex ? "block" : "none" }}
                />
            ))}
        </div>
    );
};

export default HeaderTotem;
