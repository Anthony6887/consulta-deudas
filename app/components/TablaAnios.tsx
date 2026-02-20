'use client';

import { useState } from 'react';
import { PorAnio } from '../types/deudas';
import { paginate } from '../utils/pagination';

type Props = {
    data: PorAnio[];
};

const PAGE_SIZE = 6;

export default function TablaAnios({ data }: Props) {
    const [page, setPage] = useState(1);

    const { slice, totalPages } = paginate(data, page, PAGE_SIZE);

    return (
        <div>
            <ul className="divide-y text-sm">
                {slice.map((a, i) => (
                    <li key={i} className="flex justify-between px-2 py-2">
                        <span>{a.anio}</span>
                        <span>${a.total.toFixed(2)}</span>
                    </li>
                ))}
            </ul>

            {/* PAGINADOR */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Deuda por año</span>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="rounded px-2 py-1 disabled:opacity-40"
                    >
                        Anterior
                    </button>

                    <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">
                        {page}
                    </span>

                    <button
                        onClick={() =>
                            setPage(p => Math.min(p + 1, totalPages))
                        }
                        disabled={page === totalPages}
                        className="rounded px-2 py-1 disabled:opacity-40"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}
