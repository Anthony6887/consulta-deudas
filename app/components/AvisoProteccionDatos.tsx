'use client';

import { MdPrivacyTip } from 'react-icons/md';

export default function AvisoProteccionDatos() {
    return (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900">
            <div className="mb-2 flex items-center gap-2 font-semibold">
                <MdPrivacyTip size={22} />
                Aviso de Protección de Datos Personales
            </div>

            <ul className="list-disc space-y-1 pl-5">
                <li>
                    Esta consulta cumple con la{' '}
                    <strong>Ley Orgánica de Protección de Datos Personales</strong>.
                </li>
                <li>
                    El sistema mostrará únicamente la información mínima necesaria
                    relacionada con obligaciones pendientes.
                </li>
                <li>
                    El uso indebido de la información obtenida puede conllevar
                    responsabilidades legales.
                </li>
            </ul>
        </div>
    );
}
