"use client";

import React from "react";
import { money } from "../lib/utils";
import { sx } from "./styles";

export type BankReportRow = {
    banco: string;
    count: number;
    total: number;
};

type Props = {
    reporte: BankReportRow[];
    totalValorFiltrado: number;
};

export default function BankReportTable({ reporte, totalValorFiltrado }: Props) {
    return (
        <section style={{ ...sx.card, marginTop: 12 }}>
            <div style={{ ...sx.pad, paddingBottom: 10 }}>
                <div style={sx.sectionTitle}>
                    <div>Reporte por Banco</div>
                    <span style={sx.muted}>
                        Total filtrado: <b style={{ color: "#0f172a" }}>{money(totalValorFiltrado)}</b>
                    </span>
                </div>
            </div>

            <div style={sx.tableWrap}>
                <table style={sx.table}>
                    <thead>
                        <tr>
                            {["Banco", "Transacciones", "Total"].map((h) => (
                                <th key={h} style={sx.th}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {reporte.map((r) => (
                            <tr key={r.banco}>
                                <td style={{ ...sx.td, fontWeight: 950 }}>{r.banco}</td>
                                <td style={{ ...sx.td, whiteSpace: "nowrap" }}>{r.count}</td>
                                <td style={{ ...sx.td, whiteSpace: "nowrap", fontWeight: 950 }}>{money(r.total)}</td>
                            </tr>
                        ))}

                        {reporte.length === 0 && (
                            <tr>
                                <td colSpan={3} style={{ padding: 16, color: "#64748b", fontWeight: 900 }}>
                                    Sin datos para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}