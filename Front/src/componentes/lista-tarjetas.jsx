import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import "../hojas-de-estilo/home-root.css";
import { BasicTableTarjetas } from "./tabla-tarjetas";

export function ListaTarjetas() {
  const navigate = useNavigate();

  const handleAñadirTarjeta = () => {
    navigate("/añadir-tarjetas");
  };

  return (
    <div className="contenedor-principal-home">
      <Navbar/>
      <div className="tabla-admins">
        <BasicTableTarjetas />
      </div>
      <div className="botones-root">
        <button onClick={handleAñadirTarjeta}>Añadir tarjetas</button>
      </div>
    </div>
  );
}
