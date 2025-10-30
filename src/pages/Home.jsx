import { useState } from "react";
import ChatbotTotemTest from "../components/ChatbotTotemTest.jsx";
import MenuTotem from "../components/UI/MenuTotem";
import LanguageSelector from "../components/LanguageSelector.jsx";

function Home() {
    // const [lang, setLang] = useState(null);
    //
    // // callback dal LanguageSelector
    // const handleLanguageSelected = (selected) => {
    //     setLang(selected); // salvo solo nello stato, non nel localStorage
    // };
    //
    // if (!lang) {
    //     // Mostro sempre il selettore lingua al primo render
    //     return(
    //         <section id="homepage" className="overflow-hidden h-screen">
    //             <div className="h-[75vh] relative">
    //                 <LanguageSelector onLanguageSelected={handleLanguageSelected} />
    //             </div>
    //             <div className="h-[25vh] bg-white">
    //                 <MenuTotem />
    //             </div>
    //         </section>
    //     );
    // }

    return (
        <section id="homepage" className="overflow-hidden h-screen">
            <div className="h-[75vh] relative">
                <ChatbotTotemTest />
            </div>
            <div className="h-[25vh]">
                <MenuTotem />
            </div>
        </section>
    );
}

export default Home;
