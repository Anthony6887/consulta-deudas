"use client";

import React from "react";
import { sx } from "./styles";
import { toDatetimeLocalValue } from "../lib/utils";

type Props = {
    from: string;
    to: string;
    setFrom: (v: string) => void;
    setTo: (v: string) => void;
    onClear: () => void;
};

/**
 * Problema típico del filtro datetime-local:
 * - El usuario elige "Hasta" con hora 00:00 o sin segundos
 * - Tú comparas con `t > toD.getTime()` y terminas excluyendo filas del mismo día/hora.
 *
 * Solución:
 * - Al cambiar "Hasta", si viene sin segundos, forzamos :59 para incluir todo el minuto.
 * - Para el botón "Hoy", ponemos end 23:59:59.
 *
 * Esto hace que el filtro sea inclusivo y consistente.
 */
function normalizeFrom(v: string): string {
    // datetime-local suele venir "YYYY-MM-DDTHH:mm"
    // lo dejamos como está (inicio exacto)
    return v;
}

function normalizeTo(v: string): string {
    // Si viene vacío, no tocamos
    if (!v) return v;

    // Si viene sin segundos ("YYYY-MM-DDTHH:mm"), lo convertimos a "YYYY-MM-DDTHH:mm:59"
    // para incluir el minuto completo.
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) return `${v}:59`;

    // Si viene con segundos, lo dejamos.
    return v;
}

export default function DateRangeFilter({ from, to, setFrom, setTo, onClear }: Props) {
    return (
        <div style={{ marginTop: 10 }}>
            <div style={{ ...sx.muted, marginBottom: 6, fontWeight: 900 }}>Filtro por fecha (rango)</div>

            <div style={sx.dateRow}>
                <div style={{ display: "grid", gap: 6 }}>
                    <div style={sx.muted}>Desde</div>
                    <input
                        type="datetime-local"
                        value={from}
                        onChange={(e) => setFrom(normalizeFrom(e.target.value))}
                        style={sx.inputDate}
                    />
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                    <div style={sx.muted}>Hasta</div>
                    <input
                        type="datetime-local"
                        value={to}
                        onChange={(e) => setTo(normalizeTo(e.target.value))}
                        style={sx.inputDate}
                    />
                </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                <button type="button" style={sx.btn} onClick={onClear}>
                    Quitar filtro fecha
                </button>

                <button
                    type="button"
                    style={sx.btn}
                    onClick={() => {
                        const now = new Date();
                        const startD = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                        const endD = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                        setFrom(toDatetimeLocalValue(startD));
                        // Asegura segundos para que el filtro "Hasta" sea inclusivo
                        setTo(normalizeTo(toDatetimeLocalValue(endD)));
                    }}
                >
                    Hoy
                </button>
            </div>
        </div>
    );
}