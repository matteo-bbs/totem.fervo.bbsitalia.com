import { useEffect, useState } from "react";
import axios from "../api.js";
import { Link } from "react-router-dom";
import { Loader } from "../UI/Loader.jsx";

export const Card = ({ id }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [error, setError] = useState(false);

    const pageSize = 10;
    const currentLanguage = localStorage.getItem('lang');

    const fetchPage = async (page) => {
        const response = await axios.get(
            `/pagina-sezione/${id.id}/contenuti?page=${page}&limit=${pageSize}`
        );
        return response.data;
    };

    // 👉 primo caricamento
    useEffect(() => {
        setIsLoading(true);
        fetchPage(0)
            .then((response) => {
                if (!response || !response.rows) {
                    throw new Error("No data");
                }
                setData(response.rows);
                setTotalPages(response.pager.total_pages);
                setCurrentPage(1);
                if (response.pager.total_pages <= 1) {
                    setHasMoreData(false);
                }
            })
            .catch((err) => {
                console.error("Errore caricamento Card:", err);
                setError(true);
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    // 👉 load more
    const loadMore = () => {
        if (!hasMoreData || isLoading) return;

        setIsLoading(true);
        fetchPage(currentPage)
            .then((response) => {
                setData((prev) => [...prev, ...response.rows]);
                if (currentPage + 1 >= response.pager.total_pages) {
                    setHasMoreData(false);
                } else {
                    setCurrentPage((prev) => prev + 1);
                }
            })
            .catch((err) => {
                console.error("Errore loadMore:", err);
                setError(true);
            })
            .finally(() => setIsLoading(false));
    };

    if (error) {
        return (
            <div className="w-full flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#335083] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 5a7 7 0 00-7 7v5h14v-5a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Errore</h2>
                <p className="text-gray-600">Impossibile caricare i contenuti. Riprova più tardi.</p>
            </div>
        );
    }

    return (
        <div className={"flex flex-wrap overflow-auto h-full w-full pb-5"}>
            {/* 👉 Se non ci sono dati e non stai caricando */}
            {!isLoading && data.filter((item) => item && item.titolo && item.immagine_anteprima).length === 0 && (
                <div className="w-full flex flex-col items-center justify-center p-0 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        Nessun contenuto disponibile
                    </h2>
                    <p className="text-gray-600">
                        Al momento non ci sono contenuti da mostrare in questa sezione.
                    </p>
                </div>
            )}

            {/* 👉 Render solo se titolo e immagine non sono null */}
            {data
                .filter((item) => item && item.titolo && item.immagine_anteprima)
                .map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-wrap basis-1/2 lg:basis-1/3 rounded-[10px] p-2 mb-5"
                    >
                        {console.log(item)}
                        <Link
                            to={`/contenuto/${item.id}`}
                            state={{ id: item.id }}
                            className="block w-full"
                        >
                            <div className={"shadow rounded-[10px] w-full relative h-full"}>
                                <img
                                    src={`${import.meta.env.VITE_APP_BACKEND_URL}${item.immagine_anteprima}`}
                                    className="w-full h-[250px] lg:h-[20rem] object-cover rounded-t-[10px]"
                                    alt={item.titolo}
                                />
                                <div className="flex flex-col justify-center items-center px-4 py-2 text-center flex-1">
                                    <h1 className="text-[22px] font-roboto_slab font-bold pt-3 pb-3">
                                        {item.titolo}
                                    </h1>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}

            {isLoading && <Loader active={isLoading} />}

            {hasMoreData && !isLoading && data.length > 0 && (
                <div className="col-span-full flex justify-center w-full">
                    <button
                        onClick={loadMore}
                        className="px-10 py-6 border-[#335083] border-2 font-bold text-[#335083] rounded-lg text-2xl "
                    >
                        Carica altri
                    </button>
                </div>
            )}
        </div>
    );
};
