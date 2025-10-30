import React, { useState, useEffect, useRef, useCallback } from 'react';

const VideoPlayer = ({ videoData, onVideoEnd }) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [allVideosPlayed, setAllVideosPlayed] = useState(false);
    const videoRefs = useRef([]);
    const shouldLoop = videoData.length === 1; // aggiunta

    useEffect(() => {
        const currentVideo = videoRefs.current[currentVideoIndex];
        if (currentVideo) {
            currentVideo.addEventListener("ended", handleVideoEnd);
            currentVideo.play();
            console.log("video started, currentVideoIndex:", currentVideoIndex);
        }

        return () => {
            if (currentVideo) {
                currentVideo.removeEventListener("ended", handleVideoEnd);
                currentVideo.pause();
                console.log("video paused, currentVideoIndex:", currentVideoIndex);
            }
        };
    }, [currentVideoIndex, videoRefs, videoData]);

    const handleVideoEnd = useCallback(() => {
        if (currentVideoIndex === videoData.length - 1) {
            setAllVideosPlayed(true);
        } else {
            setCurrentVideoIndex(currentVideoIndex + 1);
        }
    }, [currentVideoIndex, videoData]);

    useEffect(() => {
        if (allVideosPlayed) {
            setCurrentVideoIndex(0);
            setAllVideosPlayed(false);
            onVideoEnd();
        }
    }, [allVideosPlayed, setCurrentVideoIndex, onVideoEnd]);

    useEffect(() => {
        if (videoData && videoData.every((row) => videoRefs.current[row.id])) {
            const loadVideos = async () => {
                await Promise.all(
                    videoRefs.current.map((video) => {
                        return new Promise((resolve) => {
                            video.addEventListener("loadedmetadata", () => {
                                resolve();
                            });
                        });
                    })
                );
            };
            loadVideos();
        }
    }, [videoData, videoRefs]);

    console.log(videoData)
    return (
        <>
            {videoData &&
                videoData.map((item, index) => (
                    <video
                        key={index}
                        ref={(element) => (videoRefs.current[index] = element)}
                        src={`${import.meta.env.VITE_APP_API_URL}${item.media_video_file}`}
                        autoPlay={index === 0}
                        muted
                        className="w-full h-full absolute top-0 start-0"
                        style={{
                            objectFit: "cover",
                            display: index === currentVideoIndex ? "block" : "none",
                            zIndex: "auto",
                        }}
                        duration={item.duration}
                        preload="auto"
                        loop={shouldLoop}
                    />
                ))}
        </>
    );
};

export default VideoPlayer;
