import {useEffect, useState} from "react";
import axios from "axios";
import {Card} from "../components/subpage/Card.jsx";
import {BackButtonWhite} from "../components/UI/BackButtonWhite.jsx";
import {BackButton} from "../components/UI/BackButton.jsx";
import {useLocation} from "react-router-dom";

export const PaginaSezione = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const location = useLocation();
    const { id } = location.state || {}; // se non c’è state, rimane undefined
    const currentLanguage = localStorage.getItem('lang');

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_APP_BACKEND_URL}/${currentLanguage}/api/pagina-sezione/${id}`)
            .then(response => {
                if (response.data && response.data.length > 0) {
                    setData(response.data[0]);
                } else {
                    setError(true);
                }
            })
            .catch(err => {
                console.log(err);
                setError(true);
            });
    }, []);

    const idPagina = {id};

    return (
        <section id={'section-page'} className={'h-screen overflow-hidden'}>
            <div className={'flex flex-wrap h-[28vh] content-center relative flex overflow-hidden z-10'}>
                {
                    data && data.immagine_anteprima && !error ?
                        <img src={`${import.meta.env.VITE_APP_BACKEND_URL}${data.immagine_anteprima}`} alt={'sfondoHeaderImage'} className={'object-cover w-full'}/>
                        :
                        <div className={'bg-gray-100 h-64'}/>
                }
                <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-start items-center pl-8 pr-8 z-20">
                    <div className="flex flex-wrap items-center w-full">
                        {/*<BackButton sfondo={'true'}/>*/}
                        {data && data.titolo && !error &&
                            <h1 className="text-white font-open-sans text-[55px] font-semibold w-full text-center">
                                {data.titolo}
                            </h1>
                        }
                        {data && data.body && data.body.length > 0 && !error &&
                            <p className="text-white text-center text-[25px] w-full" dangerouslySetInnerHTML={{ __html: data.body }}></p>
                        }

                        {error &&
                            <h1 className="text-white font-open-sans text-[40px] font-semibold w-full text-center">
                                Errore nel caricamento della pagina
                            </h1>
                        }
                    </div>
                </div>
            </div>

            <div className={'flex flex-wrap justify-start items-start mt-0 py-5 px-8 h-[62vh] w-full'}>
                {!error ? (
                    <Card id={idPagina}/>
                ) : (
                    <div className="w-full flex items-center justify-center">
                        <p className="text-gray-600 text-xl">Contenuto non disponibile.</p>
                    </div>
                )}
            </div>

            <div className={' shadow border h-[10vh] b-t-l-r-15 border-gray-300 content-center flex flex-wrap items-center p-8'}>
                <BackButtonWhite sfondo={'true'}/>
            </div>
            :
            <div className={'hidden'}/>
        </section>
    )
}
