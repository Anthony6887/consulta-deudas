import type { ConciliadoItem, Filter } from "./types";

export function isFilter(v: string): v is Filter {
    return v === "TODOS" || v === "OK" || v === "MULTIPLE" || v === "NO_ENCONTRADO";
}

export function getErrorMessage(u: unknown): string {
    if (u && typeof u === "object" && "message" in u) {
        const m = (u as { message?: unknown }).message;
        if (typeof m === "string") return m;
    }
    return "Error del servidor.";
}

export function money(n: number | null | undefined) {
    if (n === null || n === undefined) return "-";
    return n.toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Franquicia -> chip con icono */
export function normalizeBrand(raw: string | null | undefined) {
    const s = String(raw ?? "").trim().toLowerCase();
    if (!s) return { label: "Sin franquicia", icon: "🏷️" };
    if (s.includes("visa")) return { label: "VISA", icon: "💳" };
    if (s.includes("master")) return { label: "MasterCard", icon: "💳" };
    if (s.includes("diners")) return { label: "Diners", icon: "💳" };
    if (s.includes("amex") || s.includes("american")) return { label: "AmEx", icon: "💳" };
    if (s.includes("discover")) return { label: "Discover", icon: "💳" };
    if (s.includes("deb")) return { label: "Débito", icon: "🟦" };
    if (s.includes("cred")) return { label: "Crédito", icon: "🟪" };
    return { label: String(raw ?? "").trim(), icon: "💳" };
}

export function brandKey(raw: string | null | undefined) {
    return normalizeBrand(raw).label;
}

export function bankKey(raw: string | null | undefined) {
    const s = String(raw ?? "").trim();
    return s ? s : "Sin banco";
}

export function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v));
}

export function makePageWindow(current: number, total: number) {
    const out: (number | "…")[] = [];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) out.push(i);
        return out;
    }
    const left = Math.max(1, current - 2);
    const right = Math.min(total, current + 2);

    out.push(1);
    if (left > 2) out.push("…");
    for (let i = left; i <= right; i++) if (i !== 1 && i !== total) out.push(i);
    if (right < total - 1) out.push("…");
    out.push(total);

    const cleaned: (number | "…")[] = [];
    for (const v of out) if (cleaned.length === 0 || cleaned[cleaned.length - 1] !== v) cleaned.push(v);
    return cleaned;
}

export function parseExcelDate(v: unknown): Date | null {
    if (v === null || v === undefined || v === "") return null;

    // Ya es Date
    if (v instanceof Date && !isNaN(v.getTime())) return v;

    // Excel serial number (ej: 46027.4567...)
    if (typeof v === "number" && isFinite(v)) {
        // Excel (Windows) base 1899-12-30
        const ms = Math.round((v - 25569) * 86400 * 1000);
        const d = new Date(ms);
        return isNaN(d.getTime()) ? null : d;
    }

    if (typeof v !== "string") return null;

    const s = v.trim();
    if (!s) return null;

    // ISO string (si backend lo manda así)
    const iso = new Date(s);
    if (!isNaN(iso.getTime())) return iso;

    // "DD/MM/YYYY HH:mm" o "DD/MM/YYYY HH:mm:ss"
    const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (m) {
        const dd = Number(m[1]);
        const mm = Number(m[2]);
        const yyyy = Number(m[3]);
        const HH = m[4] ? Number(m[4]) : 0;
        const MI = m[5] ? Number(m[5]) : 0;
        const SS = m[6] ? Number(m[6]) : 0;

        const d = new Date(yyyy, mm - 1, dd, HH, MI, SS);
        return isNaN(d.getTime()) ? null : d;
    }

    return null;
}

export function formatDMYHM(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
export function toDatetimeLocalValue(d: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function statusMeta(status: ConciliadoItem["status"]) {
    if (status === "OK")
        return { bg: "rgba(16,185,129,.12)", bd: "rgba(16,185,129,.26)", fg: "#065f46", dot: "#10b981", label: "OK" };
    if (status === "MULTIPLE")
        return { bg: "rgba(245,158,11,.14)", bd: "rgba(245,158,11,.28)", fg: "#92400e", dot: "#f59e0b", label: "MÚLTIPLE" };
    return { bg: "rgba(239,68,68,.12)", bd: "rgba(239,68,68,.25)", fg: "#7f1d1d", dot: "#ef4444", label: "NO ENCONTRADO" };
}