import { RespuestaDeudas } from "../types/deudas";

export async function consultarDeudas(
    identificacion: string,
    tipo: string
): Promise<RespuestaDeudas> {

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deudas`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identificacion, tipo })
        }
    );

    if (!res.ok) {
        throw new Error("Error al consultar deudas");
    }

    return res.json();
}
