import React, { useState } from "react";
import "../hojas-de-estilo/seleccionar-asientos.css";
import Cajas from "./colores";

export default function AsientosInternacionales() {
  const [asientoSeleccionado, setAsientoSeleccionado] = useState(null); // Solo un asiento seleccionado

  const filas = 27; // Número de filas
  const columnas = 9; // Número de columnas por fila (A-J)

  const toggleAsiento = (asientoId) => {
    // Si el asiento ya está seleccionado, lo deselecciona. Si no, lo selecciona.
    setAsientoSeleccionado((prevSeleccionado) =>
      prevSeleccionado === asientoId ? null : asientoId
    );
  };

  return (
    <div className="selector-asientos">
      <div className="contenedor-principal-asientos">
        <h2 className="titulo">Selecciona tus asientos</h2>
        <div className="contenedor-asientos-horizontal">
          {Array.from({ length: filas }, (_, i) => i + 1).map((fila) => (
            <div key={`fila-${fila}`} className="fila-horizontal">
              {["A", "B", "C"].map((letra, index) => {
                const asientoId = `${fila}${letra}`;
                const asientoNumero = (fila - 1) * columnas + index + 1;
                return (
                  <button
                    key={asientoId}
                    className={`asiento ${
                      asientoNumero <= 50 ? "primera-clase" : ""
                    } ${
                      asientoSeleccionado === asientoId ? "seleccionado" : ""
                    }`}
                    onClick={() => toggleAsiento(asientoId)}
                  >
                    {asientoId}
                  </button>
                );
              })}
              <div className="espacio-grupos" />
              {["D", "E", "F"].map((letra, index) => {
                const asientoId = `${fila}${letra}`;
                const asientoNumero = (fila - 1) * columnas + index + 4; // +4 para compensar columnas A-C
                return (
                  <button
                    key={asientoId}
                    className={`asiento ${
                      asientoNumero <= 50 ? "primera-clase" : ""
                    } ${
                      asientoSeleccionado === asientoId ? "seleccionado" : ""
                    }`}
                    onClick={() => toggleAsiento(asientoId)}
                  >
                    {asientoId}
                  </button>
                );
              })}
              <div className="espacio-grupos" />
              {["H", "I", "J"].map((letra, index) => {
                const asientoId = `${fila}${letra}`;
                const asientoNumero = (fila - 1) * columnas + index + 7; // +7 para compensar columnas A-F
                return (
                  <button
                    key={asientoId}
                    className={`asiento ${
                      asientoNumero <= 50 ? "primera-clase" : ""
                    } ${
                      asientoSeleccionado === asientoId ? "seleccionado" : ""
                    }`}
                    onClick={() => toggleAsiento(asientoId)}
                  >
                    {asientoId}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="asientos-seleccionados">
          <p>
            Asiento seleccionado:{" "}
            {asientoSeleccionado ? asientoSeleccionado : "Ninguno"}
          </p>
        </div>
        <div className="cajas-colores">
          <Cajas />
        </div>
      </div>
    </div>
  );
}
