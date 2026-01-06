export interface Deuda {
    CANTIDAD: number;
    IMPUESTO: string;
    TOTAL: number | string;
}

export interface Persona {
    CEDULA_RUC?: string;
    CIU?: string;
    NOMBRES: string;
}

export interface RespuestaDeudas {
    message: string;
    persona: Persona;
    deudas: Deuda[];
    totalGeneral: string;
}
