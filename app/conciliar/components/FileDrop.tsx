"use client";

import React from "react";
import { sx } from "./styles";

type Props = {
    inputRef: React.RefObject<HTMLInputElement | null>;
    selectedFile: File | null;
    loadedFile: File | null;
    isBusy: boolean;
    loadingUpload: boolean;
    onPick: (file: File | null) => void;
    onCargarArchivo: () => void;
    onLimpiar: () => void;
};

export default function FileDrop({
    inputRef,
    selectedFile,
    loadedFile,
    isBusy,
    loadingUpload,
    onPick,
    onCargarArchivo,
    onLimpiar,
}: Props) {
    return (
        <section style={{ ...sx.card, ...sx.pad }}>
            <div style={sx.sectionTitle}>
                <div>1) Archivo</div>
                <span style={sx.muted}>.xls / .xlsx / .csv</span>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept=".xls,.xlsx,.csv"
                style={{ display: "none" }}
                onChange={(e) => onPick(e.target.files?.[0] || null)}
            />

            <div
                style={sx.drop}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    onPick(e.dataTransfer.files?.[0] || null);
                }}
                title="Clic para seleccionar"
            >
                <div style={{ display: "grid", gap: 6, minWidth: 240 }}>
                    <div style={{ fontWeight: 950 }}>Arrastra tu archivo aquí o haz clic</div>
                    <div style={sx.muted}>
                        Luego presiona <b>Cargar</b>.
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                        <span style={sx.chip}>
                            Seleccionado:{" "}
                            <b>{selectedFile ? `${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)` : "-"}</b>
                        </span>
                        <span style={sx.chip}>
                            Listo: <b>{loadedFile ? loadedFile.name : "-"}</b>
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            inputRef.current?.click();
                        }}
                        disabled={isBusy}
                        style={{ ...sx.btnPrimary, ...(isBusy ? sx.disabled : null) }}
                    >
                        Seleccionar
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCargarArchivo();
                        }}
                        disabled={isBusy || !selectedFile}
                        style={{ ...sx.btn, ...((isBusy || !selectedFile) ? sx.disabled : null) }}
                    >
                        {loadingUpload ? "Cargando..." : "Cargar"}
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onLimpiar();
                        }}
                        disabled={isBusy}
                        style={{ ...sx.btn, ...(isBusy ? sx.disabled : null) }}
                    >
                        Limpiar
                    </button>
                </div>
            </div>
        </section>
    );
}