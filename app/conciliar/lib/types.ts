export type ExcelRow = {
    fecha: string;
    referencia: string;
    valor: number | null;
    franquicia: string;
    autorizacion: string;
    banco: string;

    cliente?: string;
    documento?: string;
    tarjeta?: string;
    usuario?: string;

    iva?: number | null;
    base?: number | null;
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

export type ApiResponse = {
    resumen: {
        total_excel: number;
        ok: number;
        multiple: number;
        no_encontrado: number;
    };
    conciliado: ConciliadoItem[];
};

export type Filter = "TODOS" | "OK" | "MULTIPLE" | "NO_ENCONTRADO";