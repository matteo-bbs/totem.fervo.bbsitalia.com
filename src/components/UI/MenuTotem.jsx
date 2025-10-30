import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Menu.css";
import axios from "../api";
import LanguageButtons from "../LanguageButtons.jsx";

const Menu = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const currentLanguage = localStorage.getItem('lang');

    // funzione per caricare i dati
    const fetchMenu = () => {
        setLoading(true);
        setError(false);
        axios
            .get(`${import.meta.env.VITE_APP_BACKEND_URL}/${currentLanguage}/api/menu`)
            .then((response) => setData(response.data))
            .catch((error) => {
                console.error("Errore caricamento menu:", error);
                setError(true);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchMenu(); // primo caricamento

        // ogni 5 minuti (300000 ms) ricontrolla
        const interval = setInterval(() => {
            fetchMenu();
        }, 300000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-center z-20 relative border-t-4 border-[#335083] bg-white">
            {loading && <p className="text-gray-500 p-4">Caricamento menu...</p>}

            {error && (
                <div className="flex flex-col items-center gap-3 p-4">
                    <p className="text-[#335083] font-semibold">Errore nel caricamento del menu</p>
                    <button
                        onClick={fetchMenu}
                        className="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                    >
                        Riprova
                    </button>
                </div>
            )}

            {data && (
                <ul className="z-10 relative items-center align-middle content-center justify-start flex flex-wrap duration-300 p-5 w-full">
                    {data.map((item, index) => (
                        <li className="flex w-1/3 h-38 mb-[34px] pb-3 px-7" key={index}>
                            <Link
                                className="bg-white border-2 border-gray-300 w-full h-full flex justify-center items-center rounded-2xl"
                                to={
                                    item.tipologia_pagina === "pagina-sezione"
                                        ? `${item.tipologia_pagina}`
                                        : `/pagina-singola/${item.id_contenuto}`
                                }
                                state={item.tipologia_pagina === "pagina-sezione" ? { id: item.id_contenuto } : undefined}
                            >
                                <img
                                    src={`${import.meta.env.VITE_APP_BACKEND_URL}${item.icona}`}
                                    className="w-[60px] ml-5"
                                    alt={item.titolo}
                                />
                                <span className="font-roboto_slab text-[23px] font-bold leading-8 text-start ml-4 px-3 w-2/3">
        {item.titolo}
    </span>
                            </Link>
                        </li>
                    ))}
                        <LanguageButtons/>
                </ul>
            )}
        </div>
    );
};

export default Menu;
