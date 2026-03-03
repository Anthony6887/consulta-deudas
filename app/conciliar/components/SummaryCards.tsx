"use client";

import React from "react";
import type { ApiResponse } from "../lib/types";
import { money } from "../lib/utils";
import { sx } from "./styles";

export default function SummaryCards({
    data,
    totalValorFiltrado,
}: {
    data: ApiResponse | null;
    totalValorFiltrado: number;
}) {
    if (!data) return null;

    const cards = [
        { k: "Total", v: String(data.resumen.total_excel) },
        { k: "OK", v: String(data.resumen.ok) },
        { k: "Múltiples", v: String(data.resumen.multiple) },
        { k: "No encontrado", v: String(data.resumen.no_encontrado) },
        { k: "Total monto (filtrado)", v: money(totalValorFiltrado) },
    ];

    return (
        <div
            style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                gap: 10,
            }}
        >
            {cards.map((x) => (
                <div key={x.k} style={{ ...sx.card, padding: 12, borderRadius: 16 }}>
                    <div style={sx.muted}>{x.k}</div>
                    <div style={{ fontSize: 18, fontWeight: 950 }}>{x.v}</div>
                </div>
            ))}
        </div>
    );
}