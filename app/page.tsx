'use client';

import { useMemo, useState } from 'react';
import {
  MdAccountBalance,
  MdPerson,
  MdAttachMoney,
  MdPieChart,
  MdListAlt,
  MdHistory,
} from 'react-icons/md';

import ConsultaForm from './components/ConsultaForm';
import AvisoProteccionDatos from './components/AvisoProteccionDatos';
import TablaImpuestos from './components/TablaImpuestos';
import TablaAnios from './components/TablaAnios';
import GraficoDeuda from './components/GraficoDeuda';
import { RespuestaDeudas } from './types/deudas';

export default function Page() {
  const [data, setData] = useState<RespuestaDeudas | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const { totalAdeudado, deudaActual, deudaAnterior } = useMemo(() => {
    if (!data) return { totalAdeudado: 0, deudaActual: 0, deudaAnterior: 0 };

    const total = data.resumen.totalGeneral;
    const anteriores = data.porAnio
      .filter(a => a.anio !== new Date().getFullYear())
      .reduce((acc, a) => acc + a.total, 0);

    return {
      totalAdeudado: total,
      deudaActual: total - anteriores,
      deudaAnterior: anteriores,
    };
  }, [data]);

  const maskNombre = (nombre?: string) =>
    nombre
      ? nombre.split(' ').map(p => p[0].toUpperCase() + '*****').join(' ')
      : '*****';

  const maskCedula = (cedula?: string) =>
    cedula ? cedula.slice(0, 2) + '******' + cedula.slice(-2) : '**********';

  return (
    <div className="page-bg">
      <div className="page-overlay" />

      <main className="page-container">
        {/* ================= HEADER ================= */}
        <header className="card header">
          <div className="header-left">
            <MdAccountBalance size={36} />
            <div>
              <h1>Consulta de Deudas</h1>
              <p>GAD Municipal</p>
            </div>
          </div>

          <ConsultaForm
            onResult={(response) => {
              if (!response.ok) {
                setData(null);
                setMensaje('NO_TIENE_DEUDA');
                return;
              }
              setMensaje(null);
              setData(response);
            }}
            onReset={() => {
              setData(null);
              setMensaje(null);
            }}
          />
        </header>

        <AvisoProteccionDatos />

        {mensaje === 'NO_TIENE_DEUDA' && (
          <div className="card no-debt-card">
            <div className="no-debt-icon">😊</div>

            <div className="no-debt-content">
              <h3>No tiene deudas pendientes</h3>
              <p>
                El contribuyente no registra obligaciones económicas pendientes.
              </p>
            </div>
          </div>

        )}

        {data && (
          <section className="main-grid">
            {/* ========== COLUMNA IZQUIERDA ========== */}
            <div className="left-column">
              {/* FILA SUPERIOR (CONTRIBUYENTE + TOTAL) */}
              <div className="left-top-grid">
                <div className="card">
                  <h4 className="card-title">
                    <MdPerson /> Contribuyente
                  </h4>
                  <p className="name">{maskNombre(data.persona.nombres)}</p>
                  <p className="label">Cédula</p>
                  <p className="value">{maskCedula(data.persona.cedula_ruc)}</p>
                </div>

                <div className="card total-card">
                  <h4 className="card-title">
                    <MdAttachMoney /> Total a pagar
                  </h4>
                  <p className="amount">${totalAdeudado.toFixed(2)}</p>
                  <p className="label">Obligaciones pendientes</p>
                </div>
              </div>

              {/* DETALLE POR IMPUESTO */}
              <div className="card detalle-card">
                <h4 className="card-title">
                  <MdListAlt /> Detalle por impuesto
                </h4>

                <TablaImpuestos data={data.porImpuesto} />
              </div>


            </div>

            {/* ========== COLUMNA DERECHA ========== */}
            <div className="right-column">
              <div className="card">
                <h4 className="card-title">
                  <MdPieChart /> Distribución de la deuda
                </h4>
                <GraficoDeuda
                  deudaActual={deudaActual}
                  deudaAnterior={deudaAnterior}
                />
              </div>

              <div className="card">
                <h4 className="card-title">
                  <MdHistory /> Histórico por año
                </h4>
                <TablaAnios data={data.porAnio} />
              </div>
            </div>
          </section>
        )}


        {!data && !mensaje && (
          <div className="card empty">
            Ingrese su identificación para consultar sus obligaciones
          </div>
        )}

        <footer className="footer">
          © {new Date().getFullYear()} GAD Municipal
        </footer>
      </main>
    </div>
  );
}
