import { NextResponse } from 'next/server';

export async function GET() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;

    return NextResponse.json({
        num1,
        num2,
        resultado: num1 + num2, // solo para validación interna
    });
}
