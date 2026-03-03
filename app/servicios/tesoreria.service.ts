export type ExcelRow = {
    fecha: string;
    referencia: string;
    valor: number | null;
    iva: number | null;
    base: number | null;
    franquicia: string;
    tarjeta: string;
    autorizacion: string;
    cliente: string;
    documento: string;
    usuario: string;
};

export type PagoLinea = {
    ID: number;
    REFERENCIA: string | null;
    FECHAPAGO: string | null;
    FECHATRANSACCION: string | null;
    AUTORIZACION: string | null;
    ESTADO: string | null;
    PARCIAL: number | null;
    PAGOTOTAL: number | null;
    GEN01CODI: number | null;
    NROPAGO: string | null;
    CLAVE: string | null;
    RUC: string | null;
};

export type ConciliadoItem = {
    excel: ExcelRow;
    status: "OK" | "MULTIPLE" | "NO_ENCONTRADO";
    matches: PagoLinea[];
};

export type ConciliarResponse = {
    resumen: {
        total_excel: number;
        ok: number;
        multiple: number;
        no_encontrado: number;
    };
    conciliado: ConciliadoItem[];
};

export type ByReferenciaResponse = {
    referencia: string;
    total: number;
    rows: PagoLinea[];
};

export type ByAutorizacionResponse = {
    autorizacion: string;
    total: number;
    rows: PagoLinea[];
};

type ApiErrorShape = { message?: unknown };

function getErrorMessage(u: unknown): string {
    if (u && typeof u === "object") {
        const msg = (u as ApiErrorShape).message;
        if (typeof msg === "string") return msg;
    }
    return "Error del servidor.";
}

/**
 * ✅ Fuerza 3000
 * Si mañana tu UI arranca en 3001, igual pegará a 3000.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000";
const TES_BASE = `${API_BASE}/api/tes/pagos`;

export async function conciliarExcel(file: File): Promise<ConciliarResponse> {
    const form = new FormData();
    form.append("file", file); // key correcta

    const resp = await fetch(`${TES_BASE}/conciliar`, {
        method: "POST",
        body: form,
    });

    const json: unknown = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(getErrorMessage(json));

    return json as ConciliarResponse;
}

export async function pagosByReferencia(ref: string): Promise<ByReferenciaResponse> {
    const resp = await fetch(`${TES_BASE}/by-referencia/${encodeURIComponent(ref)}`);
    const json: unknown = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(getErrorMessage(json));
    return json as ByReferenciaResponse;
}

export async function pagosByAutorizacion(aut: string): Promise<ByAutorizacionResponse> {
    const resp = await fetch(`${TES_BASE}/by-autorizacion/${encodeURIComponent(aut)}`);
    const json: unknown = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(getErrorMessage(json));
    return json as ByAutorizacionResponse;
}