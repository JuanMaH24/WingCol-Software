import React, { useState } from "react";

export function SelectorAsientos() {
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);

  // Configuración del avión
  const filas = 10;
  const asientosPorFila = 6;

  const toggleAsiento = (fila, asiento) => {
    const asientoId = `${fila}${asiento}`;
    setAsientosSeleccionados((prevSeleccionados) => {
      if (prevSeleccionados.includes(asientoId)) {
        return prevSeleccionados.filter((id) => id !== asientoId);
      } else {
        return [...prevSeleccionados, asientoId];
      }
    });
  };

  const renderAsientos = () => {
    const asientos = [];
    for (let i = 1; i <= filas; i++) {
      const fila = [];
      for (let j = 0; j < asientosPorFila; j++) {
        const letra = String.fromCharCode(65 + j);
        const asientoId = `${i}${letra}`;
        const estaSeleccionado = asientosSeleccionados.includes(asientoId);
        fila.push(
          <button
            key={asientoId}
            onClick={() => toggleAsiento(i, letra)}
            className={`m-1 w-10 h-10 border ${
              estaSeleccionado ? "bg-blue-500 text-white" : "bg-white"
            } ${j === 3 ? "ml-4" : ""}`}
          >
            {asientoId}
          </button>
        );
      }
      asientos.push(
        <div key={i} className="flex justify-center my-1">
          {fila}
        </div>
      );
    }
    return asientos;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Selecciona tus asientos
      </h2>
      <div className="mb-4">{renderAsientos()}</div>
      <div className="text-center">
        <p>Asientos seleccionados: {asientosSeleccionados.join(", ")}</p>
      </div>
    </div>
  );
}
