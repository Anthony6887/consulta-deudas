'use client';

import { useState } from 'react';
import { PorImpuesto } from '../types/deudas';
import { paginate } from '../utils/pagination';

type Props = {
    data: PorImpuesto[];
};

const PAGE_SIZE = 10;

export default function TablaImpuestos({ data }: Props) {
    const [page, setPage] = useState(1);

    const { slice, totalPages, from, to, total } = paginate(
        data,
        page,
        PAGE_SIZE
    );

    return (
        <div className="tabla-wrapper">
            {/* ===== CONTENIDO (TABLA) ===== */}
            <div className="table-content">
                <table className="w-full text-sm">
                    <thead className="border-b bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-3 py-2 text-left">Impuesto</th>
                            <th className="px-3 py-2 text-center">Registros</th>
                            <th className="px-3 py-2 text-right">Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {slice.map((i, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                                <td className="px-3 py-2">{i.impuesto}</td>

                                <td className="px-3 py-2 text-center">
                                    {i.cantidad }
                                </td>

                                <td className="px-3 py-2 text-right">
                                    ${i.total.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ===== PAGINADOR (SIEMPRE ABAJO) ===== */}
            <div className="table-footer">
                <span>
                    {from}–{to} de {total} registros
                </span>

                <div className="pagination">
                    <button
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={page === 1}
                    >
                        ‹
                    </button>

                    <span className="page active">{page}</span>

                    <button
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
}
