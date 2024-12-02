// ResultadosPage.js
import React from "react";
import { useLocation } from "react-router-dom";
import ResultadosVuelos from "./resultados-busqueda";
import Navbar from "./navbar";

export function ResultadosPage({ onAddToCart }) {
  const location = useLocation();
  const { vuelos } = location.state || { vuelos: [] };
  console.log("onAddToCart en ResultadosPage:", onAddToCart);

  return (
    <div className="contenedor-principal-home">
      <Navbar />
      <div className="resultados-container">
        <ResultadosVuelos vuelos={vuelos} onAddToCart={onAddToCart} />
      </div>
    </div>
  );
}
