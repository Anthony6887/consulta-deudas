type Props = {
    persona: {
        nombre: string;
        cedula: string;
    };
    resumen: {
        totalAdeudado: number;
        totalGeneral: number;
        totalAnios: number;
    };
};

export default function ResumenCards({ persona, resumen }: Props) {
    return (
        <div className="resumen-grid">
            {/* CONTRIBUYENTE */}
            <div className="card resumen-card">
                <h4>Contribuyente</h4>
                <p className="nombre">{persona.nombre}</p>
                <p className="sub">Cédula</p>
                <p className="valor">{persona.cedula}</p>
            </div>

            {/* TOTAL */}
            <div className="card resumen-card total">
                <h4>Total a pagar</h4>
                <p className="monto">
                    ${resumen.totalAdeudado.toFixed(2)}
                </p>
                <p className="sub">Obligaciones pendientes</p>
            </div>

            {/* AÑOS */}
            <div className="card resumen-card">
                <h4>Años registrados</h4>
                <p className="monto">{resumen.totalAnios}</p>
            </div>
        </div>
    );
}
