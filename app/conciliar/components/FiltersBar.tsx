"use client";

import React from "react";
import type { Filter } from "../lib/types";
import { isFilter } from "../lib/utils";
import { sx } from "./styles";

type Props = {
    isMd: boolean;

    filter: Filter;
    setFilter: (v: Filter) => void;

    banco: string;
    setBanco: (v: string) => void;
    bancos: string[];

    franquicia: string;
    setFranquicia: (v: string) => void;
    franquicias: string[];

    q: string;
    setQ: (v: string) => void;

    pageSize: number;
    setPageSize: (n: number) => void;

    onResetSoft: () => void;
};

export default function FiltersBar({
    isMd,
    filter,
    setFilter,
    banco,
    setBanco,
    bancos,
    franquicia,
    setFranquicia,
    franquicias,
    q,
    setQ,
    pageSize,
    setPageSize,
    onResetSoft,
}: Props) {
    return (
        <>
            <div style={isMd ? sx.filtersBarMd : sx.filtersBar}>
                <select
                    value={filter}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (isFilter(v)) setFilter(v);
                    }}
                    style={sx.input}
                >
                    <option value="TODOS">Todos</option>
                    <option value="OK">OK</option>
                    <option value="MULTIPLE">Múltiple</option>
                    <option value="NO_ENCONTRADO">No encontrado</option>
                </select>

                <select value={banco} onChange={(e) => setBanco(e.target.value)} style={sx.input}>
                    <option value="TODOS">Todos los bancos</option>
                    {bancos.map((b) => (
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>

                <select value={franquicia} onChange={(e) => setFranquicia(e.target.value)} style={sx.input}>
                    <option value="TODAS">Todas las franquicias</option>
                    {franquicias.map((f) => (
                        <option key={f} value={f}>
                            {f}
                        </option>
                    ))}
                </select>

                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar: referencia, autorización, cliente, documento, banco, franquicia..."
                    style={sx.search}
                />

                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} style={sx.input}>
                    <option value={10}>10 / pág</option>
                    <option value={25}>25 / pág</option>
                    <option value={50}>50 / pág</option>
                    <option value={100}>100 / pág</option>
                </select>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                <button type="button" style={sx.btn} onClick={onResetSoft}>
                    Reset filtros (sin borrar fechas)
                </button>
            </div>
        </>
    );
}