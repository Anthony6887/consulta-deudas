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
    const [consultado, setConsultado] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 🔁 SI YA CONSULTÓ → RESET
        if (consultado) {
            setIdentificacion("");
            setTipo("CEDULA");
            setCaptchaOk(false);
            setConsultado(false);
            onReset?.();
            return;
        }

        if (!captchaOk) {
            setError("Captcha incorrecto");
            return;
        }

        try {
            setLoading(true);
            const response = await consultarDeudas(identificacion, tipo);
            onResult(response);
            setConsultado(true); // ✅ MARCAMOS QUE YA CONSULTÓ
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
                    disabled={consultado}
                    className="rounded-lg border px-3 py-2 disabled:bg-gray-100"
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
                    disabled={consultado}
                    placeholder="Ej: 0102030405"
                    className="rounded-lg border px-3 py-2 disabled:bg-gray-100"
                    required
                />
            </div>

            {/* CAPTCHA */}
            {!consultado && (
                <div className="w-40">
                    <Captcha onValidate={setCaptchaOk} />
                </div>
            )}

            {/* BOTÓN ÚNICO */}
            <button
                type="submit"
                disabled={loading || (!captchaOk && !consultado)}
                className={`
                    rounded-lg px-6 py-2 text-white transition
                    ${consultado
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"}
                    disabled:opacity-50
                `}
            >
                {loading
                    ? "Consultando..."
                    : consultado
                        ? "Nueva consulta"
                        : "Consultar"}
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
