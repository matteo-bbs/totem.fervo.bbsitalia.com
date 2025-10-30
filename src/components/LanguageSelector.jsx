import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import i18n from "i18next";
import logobbs from "../assets/Logo-BBS-Colori.png";
import itaFlag from "../assets/italian_flag.png";
import enFlag from "../assets/english_flag.png";

const LanguageSelector = ({ onLanguageSelected }) => {
    const { t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    const handleChangeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
        setSelectedLanguage(lang);
    };

    const handleSubmit = () => {
        if (selectedLanguage) {
            onLanguageSelected(selectedLanguage); // 🔥 callback verso Home
        }
    };

    return (
        <div className="absolute inset-0 flex flex-col w-full h-[75vh] bg-[#335083]">
            {/* LOGO */}
            {/*<div className="absolute top-0 w-full flex justify-center bg-white px-2 min-h-[200px] max-h-[200px] z-50 overflow-hidden">*/}
            {/*    <img*/}
            {/*        className="mx-auto bg-white"*/}
            {/*        src={logobbs}*/}
            {/*        alt="Logo Parco"*/}
            {/*        style={{ width: "220px", height: "auto", objectFit: "contain" }}*/}
            {/*    />*/}
            {/*</div>*/}

            {/* Contenuto centrale */}
            <div className="flex flex-col flex-grow justify-center items-center text-white text-center">
                <h1 className="font-bold text-[100px] mb-20">{t("benvenuto")}</h1>

                <p className="text-[50px] mb-12">{t("select_language")}</p>

                <hr className="bg-white w-[200px] h-[4px] mb-8" />

                {/* Selezione lingue */}
                <div className="flex gap-6">
                    <button
                        onClick={() => handleChangeLanguage("it")}
                        className={`flex items-center rounded-xl px-4 py-2 transition ${
                            selectedLanguage === "it"
                                ? "bg-white text-black"
                                : "text-white hover:bg-white/20"
                        }`}
                    >
                        <img
                            src={itaFlag}
                            alt="Italian flag"
                            className="w-[100px] h-auto mr-4"
                        />
                        <span className="font-semibold text-[50px]">Italiano</span>
                    </button>

                    <button
                        onClick={() => handleChangeLanguage("en")}
                        className={`flex items-center rounded-xl px-4 py-2 transition ${
                            selectedLanguage === "en"
                                ? "bg-white text-black"
                                : "text-white hover:bg-white/20"
                        }`}
                    >
                        <img
                            src={enFlag}
                            alt="English flag"
                            className="w-[100px] h-auto mr-4"
                        />
                        <span className="font-semibold text-[50px]">English</span>
                    </button>
                </div>

                {/* Pulsante conferma */}
                <div className="flex justify-center">
                    <button
                        onClick={handleSubmit}
                        type="button"
                        className={`mt-12 px-8 py-4 text-[50px] rounded-xl transition ${
                            selectedLanguage
                                ? "bg-white text-black cursor-pointer"
                                : "bg-white text-black opacity-50 cursor-not-allowed"
                        }`}
                        disabled={!selectedLanguage}
                    >
                        {t("confirm")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LanguageSelector;
