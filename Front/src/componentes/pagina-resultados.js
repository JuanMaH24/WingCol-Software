// ResultadosPage.js
import React from "react";
import { useLocation } from "react-router-dom";
import ResultadosVuelos from "./resultados-busqueda";
import Navbar from "./navbar";

export function ResultadosPage() {
  const location = useLocation();
  const { vuelos } = location.state || { vuelos: [] };

  return (
    <div className="contenedor-principal-home">
        <Navbar/>
      <div className="resultados-page">
        <ResultadosVuelos vuelos={vuelos} />
      </div>
    </div>
  );
}
