import { RespuestaConsulta } from '../types/deudas';

export async function consultarDeudas(
    identificacion: string,
    tipo: string
): Promise<RespuestaConsulta> {

    const res = await fetch('http://192.168.69.53:3000/api/deudas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificacion, tipo }),
    });

    const data = await res.json();

    return data;
}
