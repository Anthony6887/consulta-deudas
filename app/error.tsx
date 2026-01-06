"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Error capturado:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                    Ocurrió un error
                </h2>

                <p className="text-gray-700 mb-6">
                    Hubo un problema al procesar la consulta.
                    Por favor intente nuevamente.
                </p>

                <button
                    onClick={() => reset()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Reintentar
                </button>
            </div>
        </div>
    );
}
