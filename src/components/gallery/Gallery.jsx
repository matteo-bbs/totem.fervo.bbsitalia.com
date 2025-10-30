import React, { useEffect, useState } from "react";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

import axios from "../api";

const Gallery = (props) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const currentLanguage = localStorage.getItem('lang');

    // --- Fetch immagini ---
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/media/galleria/${props.images}`)
            .then((response) => {
                setData(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Errore caricamento galleria:", error);
                setError(true);
                setIsLoading(false);
            });
    }, [props.images]);

    // --- Masonry ---
    useEffect(() => {
        if (data.length === 0) return;
        const container = document.querySelector(".masonry-gallery-demo");
        if (container) {
            const msnry = new Masonry(container, {
                itemSelector: ".gallery-item",
                columnWidth: ".grid-sizer",
                percentPosition: true,
            });
            imagesLoaded(container).on("progress", () => msnry.layout());
        }
    }, [data]);

    // --- PhotoSwipe: barra unica + frecce custom ---
    useEffect(() => {
        if (data.length === 0) return;

        const lightbox = new PhotoSwipeLightbox({
            gallery: "#gallery",
            children: "a",
            pswpModule: () => import("photoswipe"),
            showHideAnimationType: "fade",
        });

        lightbox.on("uiRegister", () => {
            // Barra unica sotto (counter + chiudi + zoom)
            lightbox.pswp.ui.registerElement({
                name: "custom-bar",
                order: 9,
                appendTo: "root",
                onInit: (el, pswp) => {
                    el.classList.add("pswp__custom-bar");
                    el.innerHTML =
                        '<button class="pswp__custom-btn pswp__close-btn" type="button">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 49 49">\n' +
                        '  <g transform="translate(-28 -83.202)">\n' +
                        '    <g transform="translate(28 83.202)" fill="none" stroke="#335083" stroke-width="1">\n' +
                        '      <rect width="49" height="49" rx="6" stroke="none"/>\n' +
                        '      <rect x="0.5" y="0.5" width="48" height="48" rx="5.5" fill="none"/>\n' +
                        '    </g>\n' +
                        '    <g transform="translate(-4373.164 -3482.057)">\n' +
                        '      <g transform="translate(4420.5 3584.5)">\n' +
                        '        <line x2="10.328" y2="10.518" fill="none" stroke="#335083" stroke-linecap="round" stroke-width="3"/>\n' +
                        '        <path d="M10.328,0,0,10.518" fill="none" stroke="#335083" stroke-linecap="round" stroke-width="3"/>\n' +
                        '      </g>\n' +
                        '    </g>\n' +
                        '  </g>\n' +
                        '</svg>\n' +
                        '</button>' +
                        '<button class="pswp__custom-btn pswp__zoom-btn" type="button">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 49 49">\n' +
                        '  <g transform="translate(-28 -83.202)">\n' +
                        '    <g transform="translate(28 83.202)" fill="none" stroke="#335083" stroke-width="1">\n' +
                        '      <rect width="49" height="49" rx="6" stroke="none"/>\n' +
                        '      <rect x="0.5" y="0.5" width="48" height="48" rx="5.5" fill="none"/>\n' +
                        '    </g>\n' +
                        '    <g transform="translate(-2.168 -2.42)">\n' +
                        '      <line x2="11.782" y2="11.811" transform="translate(54.086 109.311)" fill="none" stroke="#335083" stroke-linecap="round" stroke-width="2"/>\n' +
                        '      <g transform="translate(43.168 98.622)" fill="#fff" stroke="#335083" stroke-width="1">\n' +
                        '        <circle cx="8.5" cy="8.5" r="8.5" stroke="none"/>\n' +
                        '        <circle cx="8.5" cy="8.5" r="8" fill="none"/>\n' +
                        '      </g>\n' +
                        '    </g>\n' +
                        '  </g>\n' +
                        '</svg>\n' +
                        '</button>' +
                        '<span class="pswp__custom-counter"></span>';

                    const counterEl = el.querySelector(".pswp__custom-counter");
                    const updateCounter = () => {
                        counterEl.textContent =
                            (pswp.currIndex + 1) + " / " + pswp.getNumItems();
                    };
                    pswp.on("change", updateCounter);
                    updateCounter();

                    el.querySelector(".pswp__close-btn").addEventListener("click", () => pswp.close());
                    el.querySelector(".pswp__zoom-btn").addEventListener("click", () => pswp.toggleZoom());
                },
            });

            // Frecce sinistra e destra
            lightbox.pswp.ui.registerElement({
                name: "custom-prev",
                order: 5,
                isButton: true,
                appendTo: "root",
                html: "⬅",
                onClick: (event, el, pswp) => pswp.prev(),
            });

            lightbox.pswp.ui.registerElement({
                name: "custom-next",
                order: 5,
                isButton: true,
                appendTo: "root",
                html: "➡",
                onClick: (event, el, pswp) => pswp.next(),
            });
        });

        lightbox.init();
        return () => {
            lightbox.destroy();
        };
    }, [data]);

    // --- Stati di caricamento/errore ---
    if (isLoading) {
        return <p className="text-center p-6">Caricamento galleria...</p>;
    }

    if (error) {
        return (
            <div className="text-center p-6 text-[#335083]">
                Errore nel caricamento della galleria. Riprova più tardi.
            </div>
        );
    }

    // --- Output normale ---
    return (
        <div className="gallery-wrapper position-relative z-index-0">
            <div id="gallery" className="masonry-gallery-demo flex flex-wrap gap-5">
                <div className="grid-sizer"></div>
                {data.map((item, i) => (
                    <a
                        key={i}
                        href={`${import.meta.env.VITE_APP_BACKEND_URL}/${item.field_media_image_export}`}
                        data-pswp-width={1600}
                        data-pswp-height={900}
                        className="gallery-item w-72 me-5 mb-5"
                    >
                        <img
                            className="object-cover w-full h-48 rounded-lg shadow-xl bg-white"
                            src={`${import.meta.env.VITE_APP_BACKEND_URL}/${item.field_media_image_export}`}
                            alt={`img-${i}`}
                            loading="lazy"
                        />
                    </a>
                ))}
            </div>

            {/* --- Stili --- */}
            <style>{`
                /* 🔹 Immagine viewer adattiva e proporzionata */
                .pswp__img {
                    // height: auto !important;
                    // max-height: 100vh !important;
                    // width: auto !important;
                    // max-width: 100vw !important;
                    object-fit: contain !important;
                }

                /* Nasconde i controlli default */
                .pswp__button--close,
                .pswp__button--zoom,
                .pswp__counter,
                .pswp__button--arrow--prev,
                .pswp__button--arrow--next {
                    display: none !important;
                }

                /* Barra unica in basso */
                .pswp__custom-bar {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: rgba(0,0,0,0.6);
                    padding: 10px 16px;
                    border-radius: 10px;
                    color: #fff;
                    font-size: 14px;
                    z-index: 50;
                    pointer-events: auto;
                }

                .pswp__custom-counter { font-weight: 600; }

                .pswp__custom-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    background: rgba(255,255,255,0.15);
                    border-radius: 8px;
                    cursor: pointer;
                    border: none;
                    color: #fff;
                }
                .pswp__custom-btn:hover { background: rgba(255,255,255,0.3); }

                /* Frecce custom */
                button.pswp__button--custom-prev,
                button.pswp__button--custom-next {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 48px;
                    height: 48px;
                    font-size: 28px;
                    color: #fff;
                    background: rgba(0,0,0,0.4);
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 60;
                    border: none;
                    pointer-events: auto;
                }
                button.pswp__button--custom-prev { left: 20px; }
                button.pswp__button--custom-next { right: 20px; }
                button.pswp__button--custom-prev:hover,
                button.pswp__button--custom-next:hover {
                    background: rgba(0,0,0,0.6);
                }
            `}</style>
        </div>
    );
};

export default Gallery;
