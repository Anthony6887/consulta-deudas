"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import type { ApiResponse, ConciliadoItem, Filter } from "./lib/types";
import {
    bankKey,
    brandKey,
    clamp,
    getErrorMessage,
    money,
    parseExcelDate,
    toDatetimeLocalValue,
} from "./lib/utils";
import { sx } from "./components/styles";

import FileDrop from "./components/FileDrop";
import SummaryCards from "./components/SummaryCards";
import FiltersBar from "./components/FiltersBar";
import DateRangeFilter from "./components/DateRangeFilter";
import ResultsTable from "./components/ResultsTable";
import Paginator from "./components/Paginator";

/** Tipos mínimos sin any (jspdf + autotable) */
type AutoTableOptions = {
    head: string[][];
    body: (string | number)[][];
    startY?: number;
    styles?: Record<string, unknown>;
    headStyles?: Record<string, unknown>;
    columnStyles?: Record<number, Record<string, unknown>>;
};
type AutoTableFn = (doc: unknown, options: AutoTableOptions) => void;

function isAutoTableDefault(mod: unknown): mod is { default: AutoTableFn } {
    return typeof mod === "object" && mod !== null && "default" in mod && typeof (mod as { default: unknown }).default === "function";
}
function isAutoTableFn(mod: unknown): mod is AutoTableFn {
    return typeof mod === "function";
}

/** Normaliza texto para comparar (sin tildes y arreglando mojibake típico "CrÃ©dito") */
function normalizeForCompare(s: string): string {
    const raw = String(s ?? "").trim();
    const fixed = raw
        .replace(/Ã¡/g, "á")
        .replace(/Ã©/g, "é")
        .replace(/Ã­/g, "í")
        .replace(/Ã³/g, "ó")
        .replace(/Ãº/g, "ú")
        .replace(/Ã±/g, "ñ")
        .replace(/Ã/g, "Á")
        .replace(/Ã‰/g, "É")
        .replace(/Ã/g, "Í")
        .replace(/Ã“/g, "Ó")
        .replace(/Ãš/g, "Ú")
        .replace(/Ã‘/g, "Ñ");

    return fixed
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function isBancoInternacional(name: string): boolean {
    const up = normalizeForCompare(name);
    return up === "BANCO INTERNACIONAL S,A" || up === "BANCO INTERNACIONAL S.A." || up.includes("BANCO INTERNACIONAL");
}
function isBancoPichincha(name: string): boolean {
    const up = normalizeForCompare(name);
    return up === "BANCO PICHINCHA" || up.includes("PICHINCHA");
}
function isBancoGuayaquil(name: string): boolean {
    const up = normalizeForCompare(name);
    return up.includes("BANCO DE GUAYAQUIL");
}
function isCoopChibuleo(name: string): boolean {
    const up = normalizeForCompare(name);
    return up.includes("COOPERATIVA") && up.includes("CHIBULEO");
}

/** ✅ NO mostrar filas con autorización 0 / "0" / "0000" / "0.0" */
function hasValidAuthorization(v: unknown): boolean {
    const s = String(v ?? "").trim();
    if (!s) return false;

    // numérico 0 => inválido
    const n = Number(s.replace(",", "."));
    if (Number.isFinite(n) && n === 0) return false;

    // "0000"
    if (/^0+$/.test(s)) return false;

    return true;
}

/**
 * Reglas de agrupación (solo si están juntos en el filtrado):
 * 1) Si existe BANCO INTERNACIONAL => Pichincha + Internacional => una sola fila
 * 2) Si existen juntos Chibuleo + Banco de Guayaquil => una sola fila
 */
function normalizeBankForReport(
    original: string,
    flags: { hasInternacional: boolean; hasChibuleo: boolean; hasGuayaquil: boolean }
): string {
    const raw = String(original ?? "").trim();

    if (flags.hasInternacional && (isBancoPichincha(raw) || isBancoInternacional(raw))) {
        return "BANCO PICHINCHA + BANCO INTERNACIONAL";
    }

    if (flags.hasChibuleo && flags.hasGuayaquil && (isCoopChibuleo(raw) || isBancoGuayaquil(raw))) {
        return "CHIBULEO + BANCO DE GUAYAQUIL";
    }

    return raw;
}

export default function ConciliarClient() {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loadedFile, setLoadedFile] = useState<File | null>(null);

    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingConciliar, setLoadingConciliar] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ApiResponse | null>(null);

    const [filter, setFilter] = useState<Filter>("TODOS");
    const [q, setQ] = useState("");
    const [banco, setBanco] = useState<string>("TODOS");
    const [franquicia, setFranquicia] = useState<string>("TODAS");
    const [openKey, setOpenKey] = useState<string | null>(null);

    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    const [isMobile, setIsMobile] = useState(false);
    const [isMd, setIsMd] = useState(false);

    useEffect(() => {
        const check = () => {
            const w = window.innerWidth;
            setIsMobile(w < 900);
            setIsMd(w < 1200);
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const isBusy = loadingUpload || loadingConciliar;

    function resetResults() {
        setData(null);
        setOpenKey(null);
        setPage(1);
    }

    function handleFilePick(file: File | null) {
        setError(null);
        resetResults();
        setSelectedFile(file);
        setLoadedFile(null);
    }

    async function onCargarArchivo() {
        setError(null);
        resetResults();

        if (!selectedFile) return setError("Selecciona un archivo .xls, .xlsx o .csv");

        const lower = selectedFile.name.toLowerCase();
        const ok = lower.endsWith(".xlsx") || lower.endsWith(".xls") || lower.endsWith(".csv");
        if (!ok) return setError("Formato inválido. Debe ser .xls, .xlsx o .csv");

        try {
            setLoadingUpload(true);
            await new Promise((r) => setTimeout(r, 120));
            setLoadedFile(selectedFile);
        } finally {
            setLoadingUpload(false);
        }
    }

    async function onConciliar() {
        setError(null);
        resetResults();

        if (!loadedFile) return setError("Primero carga el archivo y luego concilia.");

        try {
            setLoadingConciliar(true);

            const form = new FormData();
            form.append("file", loadedFile);

            const TES_BASE = process.env.NEXT_PUBLIC_API_BASE
                ? `${process.env.NEXT_PUBLIC_API_BASE}/api/tes/pagos`
                : "http://localhost:3000/api/tes/pagos";

            const resp = await fetch(`${TES_BASE}/conciliar`, { method: "POST", body: form });
            const json: unknown = await resp.json().catch(() => ({}));
            if (!resp.ok) throw new Error(getErrorMessage(json));

            const parsed = json as ApiResponse;
            setData(parsed);

            // rango min/max por defecto (usando fecha excel)
            if (!from && !to) {
                let minD: Date | null = null;
                let maxD: Date | null = null;
                for (const r of parsed.conciliado) {
                    const d = parseExcelDate(r.excel.fecha);
                    if (!d) continue;
                    if (!minD || d.getTime() < minD.getTime()) minD = d;
                    if (!maxD || d.getTime() > maxD.getTime()) maxD = d;
                }
                if (minD && maxD) {
                    setFrom(toDatetimeLocalValue(minD));
                    setTo(toDatetimeLocalValue(maxD));
                }
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error inesperado");
        } finally {
            setLoadingConciliar(false);
        }
    }

    function onLimpiar() {
        setSelectedFile(null);
        setLoadedFile(null);
        setData(null);
        setError(null);
        setOpenKey(null);
        setFilter("TODOS");
        setQ("");
        setBanco("TODOS");
        setFranquicia("TODAS");
        setFrom("");
        setTo("");
        setPage(1);
        if (inputRef.current) inputRef.current.value = "";
    }

    // ✅ filtrado base: además elimina filas con autorización 0 (FRONT)
    const baseRowsNoAuthZero: ConciliadoItem[] = useMemo(() => {
        if (!data) return [];
        return data.conciliado.filter((r) => {
            const aut = r.excel?.autorizacion;
            // si tiene autorización inválida y NO tiene referencia, la eliminamos
            // (si tiene referencia, la dejamos porque puede conciliar por referencia)
            const hasRef = String(r.excel?.referencia ?? "").trim().length > 0;
            if (hasRef) return true;
            return hasValidAuthorization(aut);
        });
    }, [data]);

    // catálogos desde filas ya limpias
    const bancos = useMemo(() => {
        const set = new Set<string>();
        for (const item of baseRowsNoAuthZero) set.add(bankKey(item.excel.banco));
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [baseRowsNoAuthZero]);

    const franquicias = useMemo(() => {
        const set = new Set<string>();
        for (const item of baseRowsNoAuthZero) set.add(brandKey(item.excel.franquicia));
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [baseRowsNoAuthZero]);

    // filtrado completo
    const filtered: ConciliadoItem[] = useMemo(() => {
        let rows = baseRowsNoAuthZero;

        if (filter !== "TODOS") rows = rows.filter((r) => r.status === filter);
        if (banco !== "TODOS") rows = rows.filter((r) => bankKey(r.excel.banco) === banco);
        if (franquicia !== "TODAS") rows = rows.filter((r) => brandKey(r.excel.franquicia) === franquicia);

        const qq = q.trim().toLowerCase();
        if (qq) {
            rows = rows.filter((r) => {
                const x = r.excel;
                const has = (v?: string) => String(v ?? "").toLowerCase().includes(qq);
                return (
                    has(x.referencia) ||
                    has(x.autorizacion) ||
                    has(x.documento) ||
                    has(x.franquicia) ||
                    has(x.banco)
                );
            });
        }

        const fromD = from ? new Date(from) : null;
        const toD = to ? new Date(to) : null;

        if (fromD || toD) {
            rows = rows.filter((r) => {
                const d = parseExcelDate(r.excel.fecha);
                if (!d) return false;
                const t = d.getTime();
                if (fromD && t < fromD.getTime()) return false;
                if (toD && t > toD.getTime()) return false;
                return true;
            });
        }

        return rows;
    }, [baseRowsNoAuthZero, filter, banco, franquicia, q, from, to]);

    const totalValorFiltrado = useMemo(
        () => filtered.reduce((acc, r) => acc + (r.excel.valor ?? 0), 0),
        [filtered]
    );

    // flags para reglas "solo si están juntos"
    const bankFlags = useMemo(() => {
        let hasInternacional = false;
        let hasChibuleo = false;
        let hasGuayaquil = false;

        for (const r of filtered) {
            const b = String(r.excel.banco ?? "").trim();
            if (isBancoInternacional(b)) hasInternacional = true;
            if (isCoopChibuleo(b)) hasChibuleo = true;
            if (isBancoGuayaquil(b)) hasGuayaquil = true;
        }

        return { hasInternacional, hasChibuleo, hasGuayaquil };
    }, [filtered]);

    // reporte por banco (para PDF)
    const reportePorBanco = useMemo(() => {
        const map = new Map<string, { banco: string; count: number; total: number }>();

        for (const r of filtered) {
            const raw = bankKey(r.excel.banco);
            const groupBank = normalizeBankForReport(raw, bankFlags);

            const cur = map.get(groupBank) ?? { banco: groupBank, count: 0, total: 0 };
            cur.count += 1;
            cur.total += r.excel.valor ?? 0;
            map.set(groupBank, cur);
        }

        return Array.from(map.values()).sort((a, b) => b.total - a.total);
    }, [filtered, bankFlags]);

    // paginación
    const totalRows = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    const pageRows = filtered.slice(start, start + pageSize);

    useEffect(() => {
        if (page !== safePage) setPage(safePage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalPages]);

    function goTo(n: number) {
        const clamped = clamp(n, 1, totalPages);
        setOpenKey(null);
        setPage(clamped);
    }

    // PDF con datos (no captura HTML). Requiere:
    // npm i jspdf jspdf-autotable
    async function onExportBankReportPdf() {
        try {
            if (!data) return;

            if (reportePorBanco.length === 0) {
                setError("No hay datos para reporte con los filtros actuales.");
                return;
            }

            setError(null);

            const jsPdfMod: unknown = await import("jspdf");
            const autoTableMod: unknown = await import("jspdf-autotable");

            if (typeof jsPdfMod !== "object" || jsPdfMod === null || !("jsPDF" in jsPdfMod)) {
                throw new Error("No se pudo cargar jsPDF.");
            }
            const jsPDFCtor = (jsPdfMod as { jsPDF: new (...args: unknown[]) => unknown }).jsPDF;

            let autoTable: AutoTableFn | null = null;
            if (isAutoTableDefault(autoTableMod)) autoTable = autoTableMod.default;
            else if (isAutoTableFn(autoTableMod)) autoTable = autoTableMod;
            else if (
                typeof autoTableMod === "object" &&
                autoTableMod !== null &&
                "autoTable" in autoTableMod &&
                typeof (autoTableMod as { autoTable: unknown }).autoTable === "function"
            ) {
                autoTable = (autoTableMod as { autoTable: AutoTableFn }).autoTable;
            }
            if (!autoTable) throw new Error("No se pudo cargar jspdf-autotable.");

            const doc = new jsPDFCtor("p", "mm", "a4");

            const now = new Date();
            const pad = (n: number) => String(n).padStart(2, "0");
            const filename = `reporte-por-banco-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.pdf`;

            // Header
            (doc as { setFontSize: (n: number) => void }).setFontSize(14);
            (doc as { text: (t: string, x: number, y: number) => void }).text("Reporte por Banco", 14, 16);

            (doc as { setFontSize: (n: number) => void }).setFontSize(10);
            (doc as { text: (t: string, x: number, y: number) => void }).text(`Generado: ${now.toLocaleString()}`, 14, 22);
            (doc as { text: (t: string, x: number, y: number) => void }).text(`Total filtrado: ${money(totalValorFiltrado)}`, 14, 28);

            const notes: string[] = [];
            if (bankFlags.hasInternacional) notes.push("Regla: Pichincha + Banco Internacional se agrupan.");
            if (bankFlags.hasChibuleo && bankFlags.hasGuayaquil) notes.push("Regla: Chibuleo + Banco de Guayaquil se agrupan.");
            if (notes.length) {
                (doc as { text: (t: string, x: number, y: number) => void }).text(notes.join(" | "), 14, 34);
            }

            const body: (string | number)[][] = reportePorBanco.map((r) => [r.banco, r.count, money(r.total)]);

            autoTable(doc, {
                head: [["Banco", "Transacciones", "Total"]],
                body,
                startY: notes.length ? 40 : 34,
                styles: { fontSize: 10 },
                headStyles: { fontSize: 10 },
                columnStyles: {
                    0: { cellWidth: 95 },
                    1: { halign: "right" },
                    2: { halign: "right" },
                },
            });

            (doc as { save: (name: string) => void }).save(filename);
        } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo generar el PDF");
        }
    }

    const topGridStyle = isMobile ? sx.gridTopMobile : sx.gridTop;

    return (
        <div style={sx.page}>
            <div style={sx.container}>
                <header style={sx.header}>
                    <div>
                        <h1 style={sx.title}>Conciliación de Pagos</h1>
                        <p style={sx.subtitle}>
                            Se omiten automáticamente filas cuya <b>autorización</b> sea <b>0</b> (si no tienen referencia).
                        </p>
                    </div>
                </header>

                <div style={topGridStyle}>
                    <FileDrop
                        inputRef={inputRef}
                        selectedFile={selectedFile}
                        loadedFile={loadedFile}
                        isBusy={isBusy}
                        loadingUpload={loadingUpload}
                        onPick={handleFilePick}
                        onCargarArchivo={onCargarArchivo}
                        onLimpiar={onLimpiar}
                    />

                    <section style={{ ...sx.card, ...sx.pad }}>
                        <div style={sx.sectionTitle}>
                            <div>2) Conciliar</div>
                        </div>

                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                            <button
                                type="button"
                                onClick={onConciliar}
                                disabled={isBusy || !loadedFile}
                                style={{ ...sx.btnSuccess, ...((isBusy || !loadedFile) ? sx.disabled : null) }}
                            >
                                {loadingConciliar ? "Conciliando..." : "Conciliar ahora"}
                            </button>

                            <button
                                type="button"
                                onClick={onExportBankReportPdf}
                                disabled={!data || isBusy || reportePorBanco.length === 0}
                                style={{ ...sx.btn, ...((!data || isBusy || reportePorBanco.length === 0) ? sx.disabled : null) }}
                            >
                                Generar PDF (Reporte por Banco)
                            </button>
                        </div>

                        {error && <div style={sx.error}>{error}</div>}

                        <SummaryCards data={data ? { ...data, conciliado: baseRowsNoAuthZero } : null} totalValorFiltrado={totalValorFiltrado} />

                        {data && (
                            <>
                                <FiltersBar
                                    isMd={isMd}
                                    filter={filter}
                                    setFilter={(v) => {
                                        setFilter(v);
                                        setPage(1);
                                        setOpenKey(null);
                                    }}
                                    banco={banco}
                                    setBanco={(v) => {
                                        setBanco(v);
                                        setPage(1);
                                        setOpenKey(null);
                                    }}
                                    bancos={bancos}
                                    franquicia={franquicia}
                                    setFranquicia={(v) => {
                                        setFranquicia(v);
                                        setPage(1);
                                        setOpenKey(null);
                                    }}
                                    franquicias={franquicias}
                                    q={q}
                                    setQ={(v) => {
                                        setQ(v);
                                        setPage(1);
                                        setOpenKey(null);
                                    }}
                                    pageSize={pageSize}
                                    setPageSize={(n) => {
                                        setPageSize(n);
                                        setPage(1);
                                        setOpenKey(null);
                                    }}
                                    onResetSoft={() => {
                                        setFilter("TODOS");
                                        setBanco("TODOS");
                                        setFranquicia("TODAS");
                                        setQ("");
                                        setPage(1);
                                        setOpenKey(null);
                                    }}
                                />

                                <DateRangeFilter
                                    from={from}
                                    to={to}
                                    setFrom={(v) => {
                                        setFrom(v);
                                        setPage(1);
                                        setOpenKey(null);
                                    }}
                                    setTo={(v) => {
                                        setTo(v);
                                        setPage(1);
                                        setOpenKey(null);
                                    }}
                                    onClear={() => {
                                        setFrom("");
                                        setTo("");
                                        setPage(1);
                                        setOpenKey(null);
                                    }}
                                />
                            </>
                        )}
                    </section>
                </div>

                {data && (
                    <section style={{ ...sx.card, marginTop: 12 }}>
                        <div style={{ ...sx.pad, paddingBottom: 10 }}>
                            <div style={sx.sectionTitle}>
                                <div>Resultados</div>
                                <span style={sx.muted}>
                                    {totalRows} filas (filtrado) · Total monto:{" "}
                                    <b style={{ color: "#0f172a" }}>{money(totalValorFiltrado)}</b> · pág {safePage}/{totalPages}
                                </span>
                            </div>
                        </div>

                        <ResultsTable rows={pageRows} startAbs={start} openKey={openKey} setOpenKey={setOpenKey} />

                        <Paginator
                            safePage={safePage}
                            totalPages={totalPages}
                            start={start}
                            pageSize={pageSize}
                            totalRows={totalRows}
                            goTo={goTo}
                        />

                        <div style={{ padding: 12, color: "#64748b", fontSize: 12, fontWeight: 800 }}>
                            Leyenda: OK = 1 match, MULTIPLE = varios matches, NO_ENCONTRADO = no existe en TES_PAGOLINEA.
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}