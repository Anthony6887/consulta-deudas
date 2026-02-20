import { RespuestaConsulta } from '../types/deudas';

export async function consultarDeudas(
    identificacion: string,
    tipo: string
): Promise<RespuestaConsulta> {

    //const res = await fetch('http://186.46.219.181:3000/api/deudas', {
    const res = await fetch('https://tics.pelileo.gob.ec/api/deudas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificacion, tipo }),
    });

    const data = await res.json();

    return data;
}
