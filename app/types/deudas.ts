// types/deudas.ts

export interface Persona {
    cedula_ruc: string | null;
    ciu: string | null;
    nombres: string;
    apellidos: string;
    nombreCompleto: string;
    razonSocial?: string;
    nombre?: string;
}

export interface DeudaPorImpuesto {
    impuesto: string;
    cantidad: number;
    total: string;
}

export interface DeudaPorAnio {
    anio: number;
    total: string;
}

export type ResumenDeudas = {
    totalAdeudado: number;
    totalGeneral: string;   // 👈 STRING
    totalAnios: string;     // 👈 STRING
    cantidadAnios: number;
};


export interface RespuestaDeudas {
    persona: Persona;
    resumen: ResumenDeudas;
    porImpuesto: DeudaPorImpuesto[];
    porAnio: DeudaPorAnio[];
}

