'use client';

import { useState } from "react";
import { consultarDeudas } from "../servicios/deudas.service";
import { RespuestaConsulta } from "../types/deudas";
import Captcha from "./Captcha";

type Props = {
    onResult: (data: RespuestaConsulta) => void;
    onReset?: () => void;
};

export default function ConsultaForm({ onResult, onReset }: Props) {
    const [identificacion, setIdentificacion] = useState("");
    const [tipo, setTipo] = useState("CEDULA");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [captchaOk, setCaptchaOk] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!captchaOk) {
            setError("Captcha incorrecto");
            return;
        }

        try {
            setLoading(true);
            const response = await consultarDeudas(identificacion, tipo);
            onResult(response);
        } catch {
            setError("No se pudo realizar la consulta");
            onReset?.();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
            {/* TIPO */}
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Tipo</label>
                <select
                    value={tipo}
                    onChange={e => setTipo(e.target.value)}
                    className="rounded-lg border px-3 py-2"
                >
                    <option value="CEDULA">Cédula</option>
                    <option value="CIU">Ciu</option>
                </select>
            </div>

            {/* IDENTIFICACIÓN */}
            <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs text-gray-500">Identificación</label>
                <input
                    value={identificacion}
                    onChange={e => setIdentificacion(e.target.value)}
                    placeholder="Ej: 0102030405"
                    className="rounded-lg border px-3 py-2"
                    required
                />
            </div>

            {/* CAPTCHA */}
            <div className="w-40">
                <Captcha onValidate={setCaptchaOk} />
            </div>

            {/* BOTÓN */}
            <button
                type="submit"
                disabled={loading || !captchaOk}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white disabled:opacity-50"
            >
                {loading ? "Consultando..." : "Consultar"}
            </button>

            {/* ERROR */}
            {error && (
                <p className="text-sm text-red-600 sm:w-full">
                    {error}
                </p>
            )}
        </form>
    );
}
