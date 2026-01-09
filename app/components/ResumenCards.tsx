'use client';

import { User, DollarSign } from 'lucide-react';
import { ResumenDeudas, Persona } from '../types/deudas';

type Props = {
    resumen: ResumenDeudas;
    persona: Persona;
};

/** ===============================
 *  PROTECCIÓN DE DATOS
 *  =============================== */
// Función para mostrar inicial + asteriscos
const getInicialesConAsteriscos = (text?: string): string => {
    if (!text) return '**';
    // Separar por espacios
    const palabras = text.trim().split(/\s+/);
    // Convertir cada palabra a "Inicial + ****"
    const protegidas = palabras.map(p => {
        const inicial = p[0].toUpperCase();
        const oculto = '*'.repeat(Math.max(p.length - 1, 1));
        return `${inicial}${oculto}`;
    });
    return protegidas.join(' ');
};

export default function ResumenCards({ resumen, persona }: Props) {
    /** ===============================
     *  CONTRIBUYENTE
     *  =============================== */
    const rawNombre =
        persona.nombreCompleto ??
        persona.nombres ??
        persona.nombre ??
        persona.razonSocial ??
        '';

    const nombreProtegido = getInicialesConAsteriscos(rawNombre);

    /** ===============================
     *  TOTAL ADEUDADO
     *  =============================== */
    const totalAdeudado =
        typeof resumen.totalAdeudado === 'number'
            ? resumen.totalAdeudado
            : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ===== CONTRIBUYENTE ===== */}
            <div className="rounded-xl bg-white/95 p-5 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                        <User className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500">
                            Contribuyente
                        </p>
                        <p className="mt-1 truncate text-lg font-semibold text-gray-800">
                            {nombreProtegido}
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== TOTAL A PAGAR (DESTACADO) ===== */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-600 to-red-700 p-6 text-white shadow-lg">

                {/* ICONO GRANDE DE FONDO */}
                <DollarSign className="absolute right-4 top-4 h-20 w-20 text-white/20" />

                <p className="text-sm font-medium uppercase tracking-wide text-red-100">
                    Total a Pagar
                </p>

                <p className="mt-2 text-3xl font-extrabold tracking-tight">
                    $ {totalAdeudado.toFixed(2)}
                </p>

            </div>
        </div>
    );
}
