'use client';

import { User, DollarSign, Calendar } from 'lucide-react';
import { ResumenDeudas, Persona } from '../types/deudas';

/* ===========================
   Helpers seguros (SIN any)
   =========================== */

function getString(
    obj: unknown,
    keys: string[],
    fallback = '—'
): string {
    if (typeof obj !== 'object' || obj === null) return fallback;

    for (const key of keys) {
        if (
            key in obj &&
            typeof (obj as Record<string, unknown>)[key] === 'string'
        ) {
            return (obj as Record<string, unknown>)[key] as string;
        }
    }

    return fallback;
}

function getNumber(
    obj: unknown,
    keys: string[],
    fallback = 0
): number {
    if (typeof obj !== 'object' || obj === null) return fallback;

    for (const key of keys) {
        const value = (obj as Record<string, unknown>)[key];
        if (typeof value === 'number') {
            return value;
        }
    }

    return fallback;
}

/* ===========================
   Component
   =========================== */

type Props = {
    resumen: ResumenDeudas;
    persona: Persona;
};

export default function ResumenCards({ resumen, persona }: Props) {
    const nombreContribuyente = getString(persona, [
        'nombreCompleto',
        'razonSocial',
        'nombre',
        'nombres',
    ]);

    const totalAdeudado = getNumber(resumen, [
        'totalAdeudado',
        'total',
        'montoTotal',
    ]);

    const aniosRegistrados = getNumber(resumen, [
        'cantidadAnios',
        'anios',
        'totalAnios',
    ]);

    const cards = [
        {
            id: 'persona',
            titulo: 'Contribuyente',
            valor: nombreContribuyente,
            icon: <User className="h-5 w-5" />,
            color: 'bg-blue-100 text-blue-700',
        },
        {
            id: 'total',
            titulo: 'Total Adeudado',
            valor: `$ ${totalAdeudado.toFixed(2)}`,
            icon: <DollarSign className="h-5 w-5" />,
            color: 'bg-red-100 text-red-700',
        },
        {
            id: 'anios',
            titulo: 'Años Registrados',
            valor: aniosRegistrados.toString(),
            icon: <Calendar className="h-5 w-5" />,
            color: 'bg-gray-100 text-gray-700',
        },
    ];

    return (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            {cards.map(card => (
                <div
                    key={card.id}
                    className="rounded-xl bg-white/95 p-4 shadow-md transition hover:shadow-lg"
                >
                    <div className="flex items-start gap-3">
                        <div className={`rounded-lg p-2 ${card.color}`}>
                            {card.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500">
                                {card.titulo}
                            </p>

                            <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                                {card.valor}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
