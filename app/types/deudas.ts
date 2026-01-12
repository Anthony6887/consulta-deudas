/** ===============================
 *  PERSONA
 *  =============================== */
export type Persona = {
    nombres: string;
    cedula_ruc: string;
    ciu: number;
};

/** ===============================
 *  RESUMEN GENERAL
 *  =============================== */
export type ResumenDeudas = {
    totalGeneral: number;
    totalAnios: number;
};

/** ===============================
 *  POR IMPUESTO
 *  =============================== */
export interface PorImpuesto {
    impuesto: string;     // nombre del impuesto
    total: number;        // total adeudado
    cantidad: number;    // cantidad de registros
    historicoAnterior?: number; // opcional
}


/** ===============================
 *  POR AÑO
 *  =============================== */
export type PorAnio = {
    anio: number;
    total: number;
};

/** ===============================
 *  RESPUESTA COMPLETA API
 *  =============================== */
export type RespuestaDeudas = {
    ok: true;
    message: string;
    persona: Persona;
    resumen: ResumenDeudas;
    porImpuesto: PorImpuesto[];
    porAnio: PorAnio[];
};


export type RespuestaSinDeuda = {
    ok: false;
    message: string;
};

export type RespuestaConsulta = RespuestaDeudas | RespuestaSinDeuda;
