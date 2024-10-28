import React from "react";
import { useNavigate } from "react-router-dom";
import logo_wingcol from "../imagenes/WingcolName.png";
import "../hojas-de-estilo/home-root.css";
import BasicMenu from "./menu-desplegable";
import DenseTable from "./tabla-admin";
import { CrearAdministrador } from "./crear-administrador";

export function HomeRoot() {
  const navigate = useNavigate();

  const handleCrearAdmin = () => {
    navigate("/crear-administrador");
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
        <DenseTable />
      </div>
      <div className="botones-root">
        <button type="submit" onClick={handleCrearAdmin}>
          Crear administrador
        </button>
        <button type="submit">Eliminar administrador</button>
      </div>
    </div>
  );
}
