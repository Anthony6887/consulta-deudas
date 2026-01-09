'use client';

import { useState } from 'react';
import { MdTimeline, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { DeudaPorAnio } from '../types/deudas';

type Props = {
    data?: DeudaPorAnio[];
};

export default function TablaAnios({ data = [] }: Props) {
    const [open, setOpen] = useState(true);

    return (
        <div className="h-full min-h-[360px] rounded-xl bg-white shadow-md border border-gray-200">
            {/* HEADER */}
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between border-b p-4"
            >
                <h3 className="flex items-center gap-2 font-semibold text-gray-700">
                    <MdTimeline className="text-blue-600" />
                    Histórico por Año
                </h3>
                {open ? <MdExpandLess /> : <MdExpandMore />}
            </button>

            {/* BODY */}
            {open && (
                <div className="h-[calc(100%-56px)] overflow-auto p-4">
                    {!data.length ? (
                        <p className="text-center text-sm text-gray-500">
                            No existe información por año
                        </p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-gray-100 text-gray-600">
                                <tr>
                                    <th className="p-2 text-left">Año</th>
                                    <th className="p-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(row => (
                                    <tr
                                        key={row.anio}
                                        className="border-b last:border-0 hover:bg-gray-50"
                                    >
                                        <td className="p-2">{row.anio}</td>
                                        <td className="p-2 text-right font-medium">
                                            $ {Number(row.total).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
