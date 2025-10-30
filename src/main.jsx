import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import '/public/fonts/styles.css'


import {BrowserRouter} from "react-router-dom";
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationIT from './locales/it.json';
import translationEN from './locales/en.json';
i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: translationEN },
            it: { translation: translationIT },
        },
        lng: "it", // lingua di default
        fallbackLng: "en", // lingua di fallback
        interpolation: {
            escapeValue: false, // React già fa l'escaping per evitare XSS
        },
    });


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
)
