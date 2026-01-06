import { RespuestaDeudas } from "../types/deudas";

const cache = new Map<string, RespuestaDeudas>();

export async function consultarDeudas(identificacion: string, tipo: string) {
    const key = `${tipo}-${identificacion}`;
    if (cache.has(key)) return cache.get(key)!;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deudas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identificacion, tipo }),
    });

    if (!res.ok) throw new Error("Error al consultar deudas");

    const data = await res.json();
    cache.set(key, data);
    return data;
}
