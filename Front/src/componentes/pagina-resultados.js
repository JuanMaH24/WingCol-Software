// ResultadosPage.js
import React from "react";
import { useLocation } from "react-router-dom";
import ResultadosVuelos from "./resultados-busqueda";

export function ResultadosPage() {
  const location = useLocation();
  const { vuelos } = location.state || { vuelos: [] };

  return (
    <div className="resultados-page">
      <ResultadosVuelos vuelos={vuelos} />
    </div>
  );
}
