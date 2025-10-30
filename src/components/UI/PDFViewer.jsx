import React, { useState } from "react";
import { Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import * as pdfjs from "pdfjs-dist";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import { zoomPlugin } from "@react-pdf-viewer/zoom";

// worker pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/thumbnail/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

import arrowleft from "../../assets/left.svg";
import arrowright from "../../assets/right.svg";

function PDFViewer({ pdfUrl, onClose }) {
    const [error, setError] = useState(false);

    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { CurrentPageLabel } = pageNavigationPluginInstance;

    const zoomPluginInstance = zoomPlugin();
    const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

    pdfUrl = pdfUrl.replaceAll("/velivoli/velivoli", "/velivoli");


    return (
        <>
                <div className="pdf-viewer-container h-[1600px] text-center m-auto flex relative">
                    <div className="flex flex-wrap w-1/6 bg-gray-100 p-4 overflow-y-auto overflow-hidden">
                        {!error && <Thumbnails />}
                    </div>
                    <div className="pdf-content w-5/6  h-[1540px] relative">
                        {!error ? (
                            <Viewer
                                defaultScale={SpecialZoomLevel.PageFit}
                                fileUrl={`${import.meta.env.VITE_APP_BACKEND_URL}${pdfUrl}`}
                                plugins={[
                                    thumbnailPluginInstance,
                                    pageNavigationPluginInstance,
                                    zoomPluginInstance,
                                ]}
                                onDocumentLoadFailed={() => setError(true)}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <h1 className="text-[#335083] font-bold text-2xl mb-3">
                                    Errore nel caricamento del documento
                                </h1>
                                <p className="text-gray-600">
                                    Il file non è disponibile o è corrotto.
                                </p>
                            </div>
                        )}

                        {!error && (
                            <div className={"flex justify-center items-center"}>
                                <div className="navigation-buttons">
                                    <button
                                        className={
                                            "me-10 ms-10 bg-custom-grey text-white p-4 bottom-10 right-10 z-10"
                                        }
                                        onClick={() =>
                                            pageNavigationPluginInstance.jumpToPreviousPage()
                                        }
                                    >
                                        <img src={arrowleft} alt="Previous" />
                                    </button>
                                    <CurrentPageLabel>
                                        {(props) => (
                                            <>{`${props.currentPage + 1} di ${props.numberOfPages}`}</>
                                        )}
                                    </CurrentPageLabel>
                                    <button
                                        className={
                                            "ms-10 bg-custom-grey text-white p-4 bottom-10 right-10 z-10"
                                        }
                                        onClick={() =>
                                            pageNavigationPluginInstance.jumpToNextPage()
                                        }
                                    >
                                        <img src={arrowright} alt="Next" />
                                    </button>
                                </div>
                                <div style={{ padding: "0px 2px" }}>
                                    <ZoomOutButton />
                                </div>
                                <div
                                    style={{ padding: "0px 2px", pointerEvents: "none" }}
                                >
                                    <ZoomPopover />
                                </div>
                                <div style={{ padding: "0px 2px" }}>
                                    <ZoomInButton />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* stile */}
                    <style>{`
                        .pdf-close-bar {
                            left: 0px;
                            width: 100%;
                            bottom: 0px;
                            position: fixed;
                            display: flex;
                            justify-content: center;
                            background: white;
                            padding: 10px 0;
                        }
                        .pdf-close-btn {
                          background: transparent;
                          border: none;
                          cursor: pointer;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        }
                    `}</style>
                </div>

            {/* Barra in basso con X SEMPRE visibile */}
            <div className="pdf-close-bar">
                <button className="pdf-close-btn" onClick={onClose}>
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
        </>
    );
}

export default PDFViewer;
