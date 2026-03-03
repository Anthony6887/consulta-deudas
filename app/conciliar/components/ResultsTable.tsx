"use client";

import React from "react";
import type { ConciliadoItem } from "../lib/types";
import { money, parseExcelDate, formatDMYHM } from "../lib/utils";
import { sx } from "./styles";

type Props = {
    rows: ConciliadoItem[];
    startAbs: number;
    openKey: string | null;
    setOpenKey: (v: string | null) => void;
};

function getStatusStyle(status: string): React.CSSProperties {
    if (status === "OK") {
        return {
            background: "#e6f7ef",
            color: "#047857",
            border: "1px solid #10b981",
            padding: "4px 10px",
            borderRadius: 20,
            fontWeight: 900,
            fontSize: 12,
            display: "inline-block",
        };
    }

    if (status === "MULTIPLE") {
        return {
            background: "#fff7ed",
            color: "#b45309",
            border: "1px solid #f59e0b",
            padding: "4px 10px",
            borderRadius: 20,
            fontWeight: 900,
            fontSize: 12,
            display: "inline-block",
        };
    }

    if (status === "NO_ENCONTRADO") {
        return {
            background: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #ef4444",
            padding: "4px 10px",
            borderRadius: 20,
            fontWeight: 900,
            fontSize: 12,
            display: "inline-block",
        };
    }

    return {
        background: "#f3f4f6",
        color: "#374151",
        border: "1px solid #d1d5db",
        padding: "4px 10px",
        borderRadius: 20,
        fontWeight: 900,
        fontSize: 12,
        display: "inline-block",
    };
}

/** ✅ true si la autorización es válida (no 0, no "0000", no vacío) */
function isValidAuthorization(v: unknown): boolean {
    const s = String(v ?? "").trim();
    if (!s) return false;

    const n = Number(s.replace(",", "."));
    if (Number.isFinite(n) && n === 0) return false;

    if (/^0+$/.test(s)) return false;

    return true;
}

/** Para pintar autorización (siempre válida cuando se muestra fila) */
function displayAuthorization(v: unknown): string {
    const s = String(v ?? "").trim();
    return s;
}

export default function ResultsTable({ rows, startAbs, openKey, setOpenKey }: Props) {
    // ✅ FILTRAR AQUÍ: ocultar filas con autorización inválida,
    // pero mantenerlas si tienen referencia (conciliación por referencia).
    const visibleRows = React.useMemo(() => {
        return rows.filter((r) => {
            const hasRef = String(r.excel?.referencia ?? "").trim().length > 0;
            if (hasRef) return isValidAuthorization(r.excel?.autorizacion);
            return isValidAuthorization(r.excel?.autorizacion);
        });
    }, [rows]);

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={sx.table}>
                <thead>
                    <tr>
                        <th style={sx.th}>Estado</th>
                        <th style={sx.th}>Banco</th>
                        <th style={sx.th}>Franquicia</th>
                        <th style={sx.th}>Fecha</th>
                        <th style={sx.th}>Referencia</th>
                        <th style={sx.th}>Autorización</th>
                        <th style={sx.th}>Monto</th>
                        <th style={sx.th}>Documento</th>
                        <th style={sx.th}>Matches</th>
                        <th style={sx.th}></th>
                    </tr>
                </thead>

                <tbody>
                    {visibleRows.map((r, idx) => {
                        // OJO: idx aquí ya es del arreglo filtrado (visibleRows)
                        const key = `${startAbs + idx}-${r.excel.referencia ?? r.excel.autorizacion ?? "row"}`;
                        const isOpen = openKey === key;

                        const d = parseExcelDate(r.excel.fecha);
                        const fechaTxt = d ? formatDMYHM(d) : String(r.excel.fecha ?? "");

                        // Si la fila llegó aquí sin referencia, su autorización ya es válida.
                        const authTxt = isValidAuthorization(r.excel.autorizacion)
                            ? displayAuthorization(r.excel.autorizacion)
                            : ""; // si tiene referencia y auth 0, queda vacío

                        return (
                            <tr key={key}>
                                <td style={sx.td}>
                                    <span style={getStatusStyle(r.status)}>{r.status}</span>
                                </td>

                                <td style={{ ...sx.td, fontWeight: 900 }}>{r.excel.banco}</td>

                                <td style={sx.td}>{r.excel.franquicia ?? ""}</td>

                                <td style={{ ...sx.td, whiteSpace: "nowrap" }}>{fechaTxt}</td>

                                <td style={{ ...sx.td, fontWeight: 900 }}>{r.excel.referencia ?? ""}</td>

                                <td style={sx.td}>{authTxt}</td>

                                <td style={{ ...sx.td, whiteSpace: "nowrap", fontWeight: 900 }}>
                                    {money(r.excel.valor ?? 0)}
                                </td>

                                <td
                                    style={{
                                        ...sx.td,
                                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                                        fontSize: 12,
                                    }}
                                >
                                    {r.excel.documento ?? ""}
                                </td>

                                <td style={{ ...sx.td, textAlign: "center", fontWeight: 900 }}>
                                    {r.matches?.length ?? 0}
                                </td>

                                <td style={sx.td}>
                                    <button type="button" style={sx.btn} onClick={() => setOpenKey(isOpen ? null : key)}>
                                        {isOpen ? "Cerrar" : "Detalle"}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}

                    {visibleRows.length === 0 && (
                        <tr>
                            <td colSpan={10} style={{ padding: 16, color: "#64748b", fontWeight: 900 }}>
                                Sin filas para mostrar con los filtros actuales.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}