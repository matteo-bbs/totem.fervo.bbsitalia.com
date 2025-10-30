import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api";
import { BackButtonWhite } from "../UI/BackButtonWhite";
import Gallery from "../gallery/Gallery";
import { Loader } from "../UI/Loader.jsx";
import VideoGallery from "../gallery/VideoGallery.jsx";
import Documenti from "../UI/Documenti.jsx";

export const DetailPage = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [galleria, setGalleria] = useState([]);
    const [documentiData, setDocumenti] = useState([]);
    const [video, setVideo] = useState([]);

    const location = useLocation();
    const { id } = location.state || {};
    const currentLanguage = localStorage.getItem('lang');

    useEffect(() => {
        if (id) {
            fetchContentData();
        } else {
            setError(true);
            setIsLoading(false);
        }
    }, [id]);

    const fetchContentData = async () => {
        try {
            setIsLoading(true);

            // contenuto principale
            const res = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_URL}/${currentLanguage}/api/contenuti/${id}`
            );

            if (!res.data || res.data.length === 0) {
                throw new Error("No data");
            }

            setData(res.data[0]);

            // galleria
            const resGallery = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_URL}/${currentLanguage}/api/media/galleria/${id}`
            );
            setGalleria(resGallery.data);

            // video
            const resVideo = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_URL}/${currentLanguage}/api/media/video/${id}`
            );
            setVideo(resVideo.data);

            // documenti
            const resDocumenti = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_URL}/${currentLanguage}/api/media/documenti/${id}`
            );
            setDocumenti(resDocumenti.data);
        } catch (err) {
            console.error("Errore fetchContentData:", err);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const dateObj = new Date(dateString);
        if (dateObj.toString() === "Invalid Date") return "";
        const day = dateObj.getDate().toString().padStart(2, "0");
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObj.getFullYear().toString();
        return `${day}/${month}/${year}`;
    };

    const dataInizio = formatDate(data?.data_inizio);
    const dataFine = formatDate(data?.data_fine);

    return (
        <div className="h-screen overflow-hidden">
            {isLoading ? (
                <Loader />
            ) : error ? (
                <section id={'section-page'} className={'h-screen overflow-hidden'}>

                    <div className={'flex flex-wrap h-[50vh] content-center relative flex overflow-hidden z-10'}>
                        <div className={'bg-gray-100 h-64'}/>
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-start items-center pl-8 pr-8 z-20">
                            <div className="flex flex-wrap items-center w-full">
                                {/*<BackButton sfondo={'true'}/>*/}
                                <h1 className="text-white font-open-sans text-[40px] font-semibold w-full text-center">
                                    Errore nel caricamento della pagina
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className={'flex flex-wrap justify-start items-start mt-0 py-5 px-8 h-[40vh] w-full'}>
                        <div className="w-full flex items-center justify-center">
                            <p className="text-gray-600 text-xl">Contenuto non disponibile.</p>
                        </div>
                    </div>

                    <div className={' shadow border h-[10vh] b-t-l-r-15 border-gray-300 content-center flex flex-wrap items-center p-8'}>
                        <BackButtonWhite sfondo={'true'}/>
                    </div>
                </section>
            ) : (
                <>
                    <div className="h-50vh relative">
                        <div className="flex flex-wrap h-[28vh] content-center relative overflow-hidden top-0 z-10">
                            <div className="absolute inset-0 flex justify-start items-center pl-8 pr-8">
                                <div className="flex flex-wrap items-start -mt-10"></div>
                            </div>
                        </div>
                        {data?.immagine_anteprima && (
                            <img
                                src={`${import.meta.env.VITE_APP_BACKEND_URL}${data.immagine_anteprima}`}
                                className="w-full h-full object-cover absolute top-0 left-0"
                            />
                        )}
                    </div>

                    <div className="text-left p-8 h-[50vh] lg:h-[40vh] overflow-auto">
                        {data?.titolo && (
                            <h1 className="text-fanoBlue font-roboto_slab text-[40px] font-bold mb-3 border-b-2 border-[#335083] mb-10">
                                {data.titolo}
                            </h1>
                        )}

                        {dataInizio && dataFine && (
                            <p className="mb-2">
                                Dal {dataInizio} al {dataFine}
                            </p>
                        )}

                        {data?.body && (
                            <p dangerouslySetInnerHTML={{ __html: data.body }}></p>
                        )}

                        {galleria.some(img => img && img.field_media_image_export) && (
                            <>
                                <h1 className="mt-10 text-fanoBlue font-roboto_slab text-[40px] font-bold mb-3 border-b-2 border-[#335083] mb-10">
                                    Galleria Immagini
                                </h1>
                                <Gallery images={data.nodo} />
                            </>
                        )}
                        <div className="mb-10 mt-5">
                            {console.log(video)}
                            {video.filter(
                                (vid) => vid && vid.video !== null && vid.mid_export !== null
                            ).length > 0 && (
                                <>
                                    <h1 className="text-fanoBlue font-roboto_slab text-[40px] font-bold mb-3 border-b-2 border-[#335083] mb-10">
                                        Video
                                    </h1>
                                    <VideoGallery videos={data.nodo} />

                                </>
                            )}
                        </div>

                        <div className="mb-10 mt-5">
                            {console.log(documentiData)}
                            {documentiData.filter(
                                (doc) => doc && doc.documenti !== null && doc.mid_export !== null
                            ).length > 0 && (
                                <>
                                    <h1 className="text-fanoBlue font-roboto_slab text-[40px] font-bold mb-3 border-b-2 border-[#335083] mb-10">
                                        Documenti
                                    </h1>
                                    {documentiData
                                        .filter((doc) => doc && doc.documenti !== null && doc.mid_export !== null)
                                        .map((documento, i) => (
                                            <div className="mb-5" key={i}>
                                                <Documenti pdfs={documento} />
                                            </div>
                                        ))}
                                </>
                            )}
                        </div>
                    </div>

                    <div className={"shadow border h-[10vh] b-t-l-r-15 border-gray-300 content-center flex flex-wrap items-center p-8"}>
                        <BackButtonWhite sfondo={"true"} />
                    </div>
                </>
            )}
        </div>
    );
};
