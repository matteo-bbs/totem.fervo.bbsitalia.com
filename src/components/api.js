import axios from "axios";
const currentLanguage = localStorage.getItem("lang");

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_APP_BACKEND_URL}/${currentLanguage}/api`,
});

export default axiosInstance;
