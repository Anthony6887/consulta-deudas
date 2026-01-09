'use client';

import { useRef, useState } from 'react';
import Captcha from './Captcha';
import Loader from './Loader';
import { consultarDeudas } from '../servicios/deudas.service';
import { RespuestaDeudas } from '../types/deudas';

type Props = {
    onResult: (data: RespuestaDeudas) => void;
    onReset?: () => void; // Para limpiar la tabla en la página principal
};

export default function ConsultaForm({ onResult, onReset }: Props) {
    const formRef = useRef<HTMLFormElement | null>(null);

    const [loading, setLoading] = useState(false);
    const [captchaOk, setCaptchaOk] = useState(false);
    const [captchaKey, setCaptchaKey] = useState(0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!captchaOk) {
            alert('CAPTCHA incorrecto.');
            return;
        }

        const form = e.currentTarget;

        try {
            setLoading(true);

            const data = await consultarDeudas(
                form.identificacion.value,
                form.tipo.value
            );

            onResult(data);

            // Limpiar formulario después de consultar
            formRef.current?.reset();
            setCaptchaOk(false);
            setCaptchaKey(k => k + 1);
        } finally {
            setLoading(false);
        }
    };

    const handleNuevaConsulta = () => {
        // Limpiar formulario
        formRef.current?.reset();
        setCaptchaOk(false);
        setCaptchaKey(k => k + 1);

        // Limpiar resultados en la página principal
        onReset?.();
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">


            <div className="grid gap-4 md:grid-cols-3 items-end">
                {/* SELECT TIPO */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">
                        Tipo
                    </label>
                    <select
                        name="tipo"
                        required
                        className="h-[44px] rounded-md border border-gray-300 px-3
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        defaultValue="cedula"
                    >
                        <option value="cedula">Cédula</option>
                        <option value="ciu">CIU</option>
                    </select>
                </div>

                {/* INPUT IDENTIFICACIÓN */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">
                        Identificación
                    </label>
                    <input
                        name="identificacion"
                        placeholder="Ej: 0102030405"
                        required
                        inputMode="numeric"
                        className="h-[44px] rounded-md border border-gray-300 px-3
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                {/* CAPTCHA */}
                <div className="flex flex-col">
                    <Captcha key={captchaKey} onValidate={setCaptchaOk} />
                </div>
            </div>

            {/* BOTONES */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={handleNuevaConsulta}
                    className="flex-1 rounded-lg bg-green-300 py-3 font-semibold text-gray-800 hover:bg-green-400"
                >
                    Nueva Consulta
                </button>
                <button
                    type="submit"
                    className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    Consultar
                </button>
            </div>

            {/* LOADER */}
            {loading && <Loader />}
        </form>
    );
}
