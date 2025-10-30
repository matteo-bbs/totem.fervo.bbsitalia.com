import React, { useState } from "react";
import PDFViewer from "./PDFViewer.jsx";
import { LucidePaperclip } from "lucide-react";

const Documenti = ({ pdfs }) => {
    const [selectedPdf, setSelectedPdf] = useState(null);

    const closeModal = () => setSelectedPdf(null);

    return (
        <div>
            {/* 🔹 Pulsanti per aprire i PDF */}
            <div className="flex flex-wrap gap-4">
                <div
                    onClick={() => setSelectedPdf(pdfs?.documenti)}
                    className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 cursor-pointer transition"
                >
                    <LucidePaperclip className="w-6 h-6 text-[#335083]" />
                    <span className="text-gray-800 font-medium">
                        {pdfs?.documenti?.description ?? pdfs?.name_export}
                    </span>
                </div>
            </div>

            {/* 🔹 Modale */}
            {selectedPdf && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white w-11/12 h-5/6 rounded-lg shadow-lg relative overflow-hidden">
                        {/* Viewer con il tuo componente */}
                        <PDFViewer pdfUrl={selectedPdf} onClose={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Documenti;
