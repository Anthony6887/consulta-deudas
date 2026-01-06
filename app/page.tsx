'use client';

import { useState } from 'react';
import ConsultaForm from './components/ConsultaForm';
import DeudasTable from './components/DeudasTable';
import { RespuestaDeudas } from './types/deudas';
import { MdAccountBalance } from 'react-icons/md';

export default function Home() {
  const [resultado, setResultado] = useState<RespuestaDeudas | null>(null);

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      {/* TÍTULO */}
      <header>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-blue-700">
          <MdAccountBalance size={28} />
          Consulta de Deudas
        </h1>
      </header>

      {/* FORMULARIO */}
      <ConsultaForm onResult={setResultado} />

      {/* RESULTADOS */}
      {resultado && (
        <DeudasTable
          persona={resultado.persona}
          deudas={resultado.deudas}
          totalGeneral={resultado.totalGeneral}
        />
      )}
    </main>
  );
}
