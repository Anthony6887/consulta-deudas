'use client';

import { useState, useMemo } from 'react';
import ConsultaForm from './components/ConsultaForm';
import TablaImpuestos from './components/TablaImpuestos';
import TablaAnios from './components/TablaAnios';
import ResumenCards from './components/ResumenCards';
import AvisoProteccionDatos from './components/AvisoProteccionDatos';
import GraficoDeuda from './components/GraficoDeuda';
import { MdAccountBalance } from 'react-icons/md';
import { RespuestaDeudas } from './types/deudas';

export default function Home() {
  const [data, setData] = useState<RespuestaDeudas | null>(null);

  /** ===============================
   *  CÁLCULOS SEGUROS DE DEUDA
   *  =============================== */
  const { totalAdeudado, deudaActual, deudaAnterior } = useMemo(() => {
    if (!data) {
      return {
        totalAdeudado: 0,
        deudaActual: 0,
        deudaAnterior: 0,
      };
    }

    // 🔹 Total desde backend o calculado
    const total =
      typeof data.resumen?.totalAdeudado === 'number'
        ? data.resumen.totalAdeudado
        : data.porImpuesto?.reduce(
          (acc, cur) => acc + Number(cur.total ?? 0),
          0
        ) ?? 0;

    // 🔹 Deuda de años anteriores
    const anteriores =
      data.porAnio?.filter(a => a.anio !== new Date().getFullYear())
        .reduce((acc, cur) => acc + Number(cur.total ?? 0), 0) ?? 0;

    // 🔹 Deuda actual
    const actual = Math.max(total - anteriores, 0);

    return {
      totalAdeudado: total,
      deudaActual: actual,
      deudaAnterior: anteriores,
    };
  }, [data]);

  return (
    <div className="relative min-h-screen">
      {/* ===== FONDO ===== */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/fondo.jpg')" }}
      />
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />

      {/* ===== CONTENIDO ===== */}
      <main className="relative z-10 p-4">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* ===== HEADER COMPACTO CON BUSCADOR ===== */}
          <header className="grid grid-cols-1 gap-3 rounded-lg bg-white/95 px-4 py-3 shadow-md lg:grid-cols-12 lg:items-center">

            {/* IZQUIERDA: TÍTULO */}
            <div className="flex items-center gap-3 lg:col-span-5">
              <MdAccountBalance className="text-blue-600" size={32} />
              <div className="leading-snug">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  Consulta de Deudas
                </h1>
                <p className="text-base font-semibold text-gray-600">
                  GAD Municipal
                </p>
              </div>

            </div>

            {/* DERECHA: BUSCADOR */}
            <div className="lg:col-span-7">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <ConsultaForm
                  onResult={setData}
                  onReset={() => setData(null)}
                />
              </div>
            </div>
          </header>


          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <AvisoProteccionDatos />
          </div>

          {/* ===== GRID PRINCIPAL ===== */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ===== FORMULARIO + GRÁFICO ===== */}
            <aside className="lg:col-span-4">
              <div className="sticky top-6 space-y-6 rounded-xl bg-white/95 p-5 shadow-lg">
                <h2 className="border-b pb-2 text-sm font-semibold text-gray-700">
                  Datos de Consulta
                </h2>



                {data && (
                  <GraficoDeuda
                    deudaActual={deudaActual}
                    deudaAnterior={deudaAnterior}
                  />
                )}
              </div>
            </aside>

            {/* ===== RESULTADOS ===== */}
            <div className="lg:col-span-8 space-y-6">
              {!data && (
                <div className="flex h-[320px] items-center justify-center rounded-xl bg-white/70 text-sm text-gray-500">
                  Ingrese su identificación para visualizar la información
                </div>
              )}

              {data && (
                <>
                  {/* ===== RESUMEN ===== */}
                  <ResumenCards
                    resumen={{
                      totalAdeudado: Number(totalAdeudado), // este sí es number
                      totalGeneral: String(data.resumen.totalGeneral ?? totalAdeudado),
                      totalAnios: String(data.resumen.totalAnios ?? 0),
                      cantidadAnios: Number(data.resumen.cantidadAnios ?? 0),
                    }}
                    persona={data.persona}
                  />




                  {/* ===== TABLAS ===== */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="rounded-xl bg-white/95 shadow-md">
                      <div className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
                        Deudas por Impuesto
                      </div>
                      <div className="p-4 max-h-[350px] overflow-auto">
                        <TablaImpuestos data={data.porImpuesto} />
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/95 shadow-md">
                      <div className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
                        Histórico por Año
                      </div>
                      <div className="p-4 max-h-[350px] overflow-auto">
                        <TablaAnios data={data.porAnio} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ===== FOOTER ===== */}
          <footer className="text-center text-xs text-white/80">
            © {new Date().getFullYear()} GAD Municipal — Todos los derechos reservados
          </footer>

        </div>
      </main>
    </div>
  );
}
