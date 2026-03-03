import React from "react";

export const sx = {
    page: {
        minHeight: "100vh",
        padding: "18px 18px",
        background:
            "radial-gradient(1200px 600px at 10% 0%, rgba(59,130,246,.18), transparent 60%)," +
            "radial-gradient(900px 500px at 90% 10%, rgba(16,185,129,.14), transparent 60%)," +
            "linear-gradient(180deg, #f7f8fb, #ffffff)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        color: "#0f172a",
    } as React.CSSProperties,

    container: { width: "100%", maxWidth: 1600, margin: "0 auto" } as React.CSSProperties,

    header: {
        display: "flex",
        justifyContent: "space-between",
        gap: 14,
        alignItems: "flex-start",
        flexWrap: "wrap",
        marginBottom: 14,
        paddingLeft: 4,
        paddingRight: 4,
    } as React.CSSProperties,
    title: { fontSize: 24, fontWeight: 950, letterSpacing: -0.2, margin: 0 } as React.CSSProperties,
    subtitle: { margin: "6px 0 0", fontSize: 13, color: "#64748b", maxWidth: 980, lineHeight: 1.45 } as React.CSSProperties,

    card: {
        background: "rgba(255,255,255,.92)",
        border: "1px solid rgba(15,23,42,.08)",
        borderRadius: 18,
        boxShadow: "0 8px 30px rgba(15,23,42,.06)",
    } as React.CSSProperties,
    pad: { padding: 14 } as React.CSSProperties,

    gridTop: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 } as React.CSSProperties,
    gridTopMobile: { display: "grid", gridTemplateColumns: "1fr", gap: 12 } as React.CSSProperties,

    sectionTitle: {
        fontWeight: 950,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        flexWrap: "wrap",
        marginBottom: 10,
    } as React.CSSProperties,
    muted: { color: "#64748b", fontSize: 12, fontWeight: 750 } as React.CSSProperties,

    btn: {
        padding: "10px 12px",
        borderRadius: 14,
        border: "1px solid rgba(15,23,42,.14)",
        background: "white",
        cursor: "pointer",
        fontWeight: 950,
    } as React.CSSProperties,
    btnPrimary: {
        padding: "10px 12px",
        borderRadius: 14,
        border: "1px solid rgba(37,99,235,.35)",
        background: "linear-gradient(180deg, rgba(37,99,235,1), rgba(29,78,216,1))",
        color: "white",
        cursor: "pointer",
        fontWeight: 950,
        boxShadow: "0 10px 22px rgba(37,99,235,.22)",
    } as React.CSSProperties,
    btnSuccess: {
        padding: "10px 12px",
        borderRadius: 14,
        border: "1px solid rgba(16,185,129,.35)",
        background: "linear-gradient(180deg, rgba(16,185,129,1), rgba(5,150,105,1))",
        color: "white",
        cursor: "pointer",
        fontWeight: 950,
        boxShadow: "0 10px 22px rgba(16,185,129,.18)",
    } as React.CSSProperties,
    disabled: { opacity: 0.55, cursor: "not-allowed" } as React.CSSProperties,

    drop: {
        border: "1.5px dashed rgba(15,23,42,.22)",
        borderRadius: 18,
        padding: 14,
        background: "linear-gradient(180deg, rgba(248,250,252,1), rgba(255,255,255,1))",
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        cursor: "pointer",
    } as React.CSSProperties,

    chip: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 10px",
        borderRadius: 999,
        border: "1px solid rgba(15,23,42,.12)",
        background: "rgba(15,23,42,.03)",
        fontSize: 12,
        fontWeight: 800,
        color: "#334155",
        whiteSpace: "nowrap",
    } as React.CSSProperties,

    input: {
        padding: "9px 10px",
        borderRadius: 14,
        border: "1px solid rgba(15,23,42,.14)",
        outline: "none",
        background: "white",
        minWidth: 200,
        fontWeight: 800,
    } as React.CSSProperties,

    inputDate: {
        padding: "9px 10px",
        borderRadius: 14,
        border: "1px solid rgba(15,23,42,.14)",
        outline: "none",
        background: "white",
        fontWeight: 800,
        minWidth: 210,
    } as React.CSSProperties,

    error: {
        marginTop: 10,
        padding: 12,
        borderRadius: 16,
        border: "1px solid rgba(239,68,68,.25)",
        background: "rgba(239,68,68,.08)",
        color: "#7f1d1d",
        fontWeight: 900,
    } as React.CSSProperties,

    tableWrap: {
        marginTop: 10,
        overflowX: "auto",
        borderRadius: 18,
        border: "1px solid rgba(15,23,42,.08)",
        background: "white",
    } as React.CSSProperties,
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13 } as React.CSSProperties,
    th: {
        textAlign: "left",
        padding: 12,
        borderBottom: "1px solid rgba(15,23,42,.08)",
        background: "rgba(248,250,252,1)",
        fontWeight: 950,
        color: "#0f172a",
        whiteSpace: "nowrap",
        fontSize: 12,
    } as React.CSSProperties,
    td: { padding: 12, borderBottom: "1px solid rgba(15,23,42,.06)", verticalAlign: "top" } as React.CSSProperties,
    detailBox: { padding: 12, background: "rgba(248,250,252,1)", borderTop: "1px solid rgba(15,23,42,.08)" } as React.CSSProperties,

    paginator: {
        display: "flex",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        padding: 12,
        borderTop: "1px solid rgba(15,23,42,.08)",
        background: "rgba(248,250,252,1)",
    } as React.CSSProperties,
    pagerBtn: {
        padding: "8px 10px",
        borderRadius: 14,
        border: "1px solid rgba(15,23,42,.14)",
        background: "white",
        cursor: "pointer",
        fontWeight: 950,
        minWidth: 40,
    } as React.CSSProperties,
    pagerBtnActive: { border: "1px solid rgba(37,99,235,.35)", background: "rgba(37,99,235,.08)" } as React.CSSProperties,
    pagerBtnDisabled: { opacity: 0.5, cursor: "not-allowed" } as React.CSSProperties,

    filtersBar: {
        marginTop: 12,
        display: "grid",
        gridTemplateColumns:
            "minmax(220px, 260px) minmax(240px, 280px) minmax(220px, 260px) 1fr minmax(180px, 200px)",
        gap: 10,
        alignItems: "center",
    } as React.CSSProperties,
    filtersBarMd: {
        marginTop: 12,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        alignItems: "center",
    } as React.CSSProperties,

    search: {
        width: "100%",
        padding: "9px 10px",
        borderRadius: 14,
        border: "1px solid rgba(15,23,42,.14)",
        outline: "none",
        background: "white",
        fontWeight: 800,
    } as React.CSSProperties,

    dateRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignItems: "center" } as React.CSSProperties,
};