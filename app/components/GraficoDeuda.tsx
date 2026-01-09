'use client';

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';

type Props = {
    deudaActual: number;
    deudaAnterior: number;
};

type PieData = {
    name: string;
    value: number;
    color: string;
};

export default function GraficoDeuda({
    deudaActual,
    deudaAnterior,
}: Props) {

    const data: PieData[] = [
        {
            name: 'Año actual',
            value: deudaActual,
            color: '#2563eb', // azul
        },
        {
            name: 'Años anteriores',
            value: deudaAnterior,
            color: '#dc2626', // rojo
        },
    ].filter(item => item.value > 0);

    const total = data.reduce((acc, cur) => acc + cur.value, 0);

    const money = (value: number) => `$ ${value.toFixed(2)}`;

    return (
        <div className="rounded-xl bg-white/95 shadow-md">

            {/* HEADER */}
            <div className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
                Distribución de la Deuda
            </div>

            {/* CONTENIDO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 items-center">

                {/* GRAFICO */}
                <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={50}
                                paddingAngle={3}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* INDICADORES */}
                <div className="space-y-3 text-sm">
                    {data.map(item => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-gray-700 font-medium">
                                    {item.name}
                                </span>
                            </div>

                            <span className="font-semibold text-gray-800">
                                {money(item.value)}
                            </span>
                        </div>
                    ))}

                    {/* TOTAL */}
                    <div className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2 font-semibold">
                        <span className="text-gray-700">Total</span>
                        <span className="text-gray-900">
                            {money(total)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
