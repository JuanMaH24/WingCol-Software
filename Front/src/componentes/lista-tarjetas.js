import React from "react";
import { useNavigate } from "react-router-dom";
import logo_wingcol from "../imagenes/WingcolName.png";
import "../hojas-de-estilo/home-root.css";
import BasicMenu from "./menu-desplegable";
import { BasicTableTarjetas } from "./tabla-tarjetas";

export function ListaTarjetas() {
  const navigate = useNavigate();

  const handleAñadirTarjeta = () => {
    navigate("/añadir-tarjetas");
  };

  const handleEditarTarjeta = () => {
    navigate("/editar-tarjetas");
  };

  return (
    <div className="contenedor-principal-home">
      <div className="barra-navegacion">
        <div className="contenedor-logo">
          <img src={logo_wingcol} alt="logo" />
        </div>
        <div className="menu-desplegable">
          <BasicMenu />
        </div>
      </div>
      <div className="tabla-admins">
        <BasicTableTarjetas />
      </div>
      <div className="botones-root">
        <button onClick={handleAñadirTarjeta}>Añadir tarjetas</button>
        <button onClick={handleEditarTarjeta}>Editar Tarjeta</button>
      </div>
    </div>
  );
}
