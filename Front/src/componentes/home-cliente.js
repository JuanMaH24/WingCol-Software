import React from "react";
import { useNavigate } from "react-router-dom";
import logo_wingcol from "../imagenes/WingcolName.png";
import "../hojas-de-estilo/home-cliente.css";
import ImgMediaCard from "./cards";
import BasicMenu from "./menu-desplegable";

export function HomeCliente() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  const handleRegister = () => {
    navigate("/registro");
  };

  return (
    <div className="contenedor-principal-home">
      <div className="barra-navegacion">
        <div className="contenedor-logo">
          <img src={logo_wingcol} alt="logo" />
        </div>
        <div className="barra-de-busqueda">
          <input type="text" placeholder="Buscar vuelos" />
        </div>
        <div className="menu-desplegable">
          <BasicMenu />
        </div>
      </div>
      <div className="cards-home">
        <ImgMediaCard />
        <ImgMediaCard />
        <ImgMediaCard />
      </div>
    </div>
  );
}
