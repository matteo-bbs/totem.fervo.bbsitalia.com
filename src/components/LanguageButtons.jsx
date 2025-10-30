import { useState, useEffect } from "react";
import i18n from "i18next";
import itaFlag from "../assets/italian_flag.png";
import enFlag from "../assets/english_flag.png";

const LanguageToggleButton = () => {
    const [lang, setLang] = useState(localStorage.getItem("lang") || "it");

    useEffect(() => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
    }, [lang]);

    const toggleLang = () => {
        const newLang = lang === "it" ? "en" : "it";
        setLang(newLang);
        localStorage.setItem("lang", newLang);
        window.location.reload(); // 🔄 forza ricarica per rifare le chiamate API
    };

    return (
        <li className="flex w-1/3 h-38 mb-[34px] pb-3 px-7">
            <button
                onClick={toggleLang}
                className="bg-white border-2 border-gray-300 w-full h-full flex justify-center items-center rounded-2xl"
            >
                {lang === "it" ? (
                    <>
                        <img src={enFlag} className="w-[60px] ml-5" alt="English flag" />
                        <span className="font-roboto_slab text-[23px] font-bold leading-8 text-start ml-4 px-3 w-2/3">
                            English
                        </span>
                    </>
                ) : (
                    <>
                        <img src={itaFlag} className="w-[60px] ml-5" alt="Italian flag" />
                        <span className="font-roboto_slab text-[23px] font-bold leading-8 text-start ml-4 px-3 w-2/3">
                            Italiano
                        </span>
                    </>
                )}
            </button>
        </li>
    );
};

export default LanguageToggleButton;
