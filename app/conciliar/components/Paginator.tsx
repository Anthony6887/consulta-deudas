"use client";

import React, { useMemo } from "react";
import { sx } from "./styles";
import { makePageWindow } from "../lib/utils";

type Props = {
    safePage: number;
    totalPages: number;
    start: number;
    pageSize: number;
    totalRows: number;
    goTo: (n: number) => void;
};

export default function Paginator({ safePage, totalPages, start, pageSize, totalRows, goTo }: Props) {
    const pageWindow = useMemo(() => makePageWindow(safePage, totalPages), [safePage, totalPages]);

    return (
        <div style={sx.paginator}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontWeight: 950 }}>
                    {totalRows === 0 ? 0 : start + 1}–{Math.min(start + pageSize, totalRows)} de {totalRows}
                </span>
                <span style={sx.muted}>
                    • Página {safePage} / {totalPages}
                </span>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button
                    type="button"
                    style={{ ...sx.pagerBtn, ...(safePage <= 1 ? sx.pagerBtnDisabled : null) }}
                    disabled={safePage <= 1}
                    onClick={() => goTo(safePage - 1)}
                >
                    ←
                </button>

                {pageWindow.map((p, i) =>
                    p === "…" ? (
                        <span key={`dots-${i}`} style={{ padding: "0 6px", color: "#64748b", fontWeight: 950 }}>
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            type="button"
                            style={{ ...sx.pagerBtn, ...(p === safePage ? sx.pagerBtnActive : null) }}
                            onClick={() => goTo(p)}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    type="button"
                    style={{ ...sx.pagerBtn, ...(safePage >= totalPages ? sx.pagerBtnDisabled : null) }}
                    disabled={safePage >= totalPages}
                    onClick={() => goTo(safePage + 1)}
                >
                    →
                </button>
            </div>
        </div>
    );
}