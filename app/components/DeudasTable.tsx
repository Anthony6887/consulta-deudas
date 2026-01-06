'use client';

import { MdPerson, MdBadge, MdPayments } from 'react-icons/md';
import type { Deuda, Persona } from '../types/deudas';

type DeudasTableProps = {
    persona: Persona;
    deudas: Deuda[];
    totalGeneral: string;
};

const ocultarIdentificacion = (id?: string) => {
    if (!id || id.length < 4) return '***';
    return `${id.slice(0, 2)}${'*'.repeat(id.length - 4)}${id.slice(-2)}`;
};

const ocultarNombre = (nombre: string) => {
    return nombre
        .split(' ')
        .map(p =>
            p.length > 1
                ? p[0] + '*'.repeat(p.length - 1)
                : p
        )
        .join(' ');
};

export default function DeudasTable({
    persona,
    deudas,
    totalGeneral,
}: DeudasTableProps) {

    if (!deudas || deudas.length === 0) {
        return (
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
                No se encontraron deudas registradas.
            </div>
        );
    }

    return (
        <section className="space-y-6">
            {/* CONTRIBUYENTE */}
            <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                    <MdPerson size={26} />
                </div>

                <div>
                    <p className="text-xs uppercase tracking-wide text-blue-700">
                        Contribuyente
                    </p>

                    <p className="text-lg font-semibold text-gray-900">
                        {ocultarNombre(persona.NOMBRES)}
                    </p>

                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MdBadge />
                        {ocultarIdentificacion(persona.CEDULA_RUC || persona.CIU)}
                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div className="overflow-hidden rounded-xl border shadow-sm">
                <table className="min-w-full text-sm">
                    <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                Impuesto / Servicio
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-gray-700">
                                Cant.
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">
                                Total ($)
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {deudas.map((d, index) => (
                            <tr key={index} className="transition hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium text-gray-800">
                                    {d.IMPUESTO}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                                        {d.CANTIDAD}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                    ${Number(d.TOTAL).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                    <tfoot>
                        <tr className="bg-slate-100">
                            <td colSpan={2} className="px-4 py-4 text-right">
                                <span className="flex items-center justify-end gap-2 font-semibold text-gray-800">
                                    <MdPayments size={20} />
                                    Total General
                                </span>
                            </td>
                            <td className="px-4 py-4 text-right text-lg font-bold text-green-700">
                                ${Number(totalGeneral).toFixed(2)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>
    );
}
