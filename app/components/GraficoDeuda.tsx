'use client';

type Props = {
    deudaActual: number;
    deudaAnterior: number;
};

export default function GraficoDeuda({
    deudaActual,
    deudaAnterior,
}: Props) {
    const total = deudaActual + deudaAnterior;

    const pctActual = total > 0 ? (deudaActual / total) * 100 : 0;

    return (
        <div className="flex flex-col items-center space-y-3">
            {/* DONUT */}
            <div className="relative h-33 w-33">
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `conic-gradient(
                            #2563eb 0% ${pctActual}%,
                            #c7d2fe ${pctActual}% 100%
                        )`,
                    }}
                />

                {/* CENTRO */}
                <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-[10px] text-gray-500">Total</div>
                        <div className="text-sm font-semibold">
                            ${total.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            {/* DESGLOSE */}
            <div className="w-full space-y-1 text-xs">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                        <span>Año actual</span>
                    </div>
                    <strong>${deudaActual.toFixed(2)}</strong>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-200" />
                        <span>Años anteriores</span>
                    </div>
                    <strong>${deudaAnterior.toFixed(2)}</strong>
                </div>
            </div>
        </div>
    );
}
