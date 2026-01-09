'use client';

import { useState, useMemo } from 'react';
import { MdReceiptLong, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { DeudaPorImpuesto } from '../types/deudas';

type Props = {
    data: DeudaPorImpuesto[];
};

export default function TablaImpuestos({ data }: Props) {
    const [open, setOpen] = useState(true);

    const totalGeneral = useMemo(
        () =>
            data.reduce(
                (acc, item) => acc + Number(item.total ?? 0),
                0
            ),
        [data]
    );

    return (
        <div className="h-full min-h-[360px] rounded-xl bg-white shadow-md border border-gray-200">
            {/* HEADER */}
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between border-b p-4"
            >
                <h3 className="flex items-center gap-2 font-semibold text-gray-700">
                    <MdReceiptLong className="text-green-600" />
                    Deudas por Impuesto
                </h3>
                {open ? <MdExpandLess /> : <MdExpandMore />}
            </button>

            {/* BODY */}
            {open && (
                <div className="h-[calc(100%-56px)] overflow-auto p-4">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="p-2 text-left">Impuesto</th>
                                <th className="p-2 text-center">Registros</th>
                                <th className="p-2 text-right">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map(row => (
                                <tr
                                    key={row.impuesto}
                                    className="border-b last:border-0 hover:bg-gray-50"
                                >
                                    <td className="p-2">{row.impuesto}</td>
                                    <td className="p-2 text-center">
                                        {row.cantidad}
                                    </td>
                                    <td className="p-2 text-right font-medium">
                                        $ {Number(row.total).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot>
                            <tr className="border-t bg-gray-50">
                                <td
                                    colSpan={2}
                                    className="p-2 text-right font-semibold text-gray-700"
                                >
                                    Total General
                                </td>
                                <td className="p-2 text-right text-base font-bold text-green-700">
                                    $ {totalGeneral.toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}
