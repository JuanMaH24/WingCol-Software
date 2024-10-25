import React from "react";
import { useNavigate } from "react-router-dom";
import logo_wingcol from "../imagenes/WingcolName.png";
import "../hojas-de-estilo/home-visitante.css";
import ImgMediaCard from "./cards-home";
import { Buscador } from "./buscador";

export function HomeVisitante() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/inicio-de-sesion");
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
        <div className="contenedor-opciones-usuario">
          <button className="boton-iniciar-sesion" onClick={handleLogin}>
            Iniciar sesión
          </button>
          <button className="boton-registrarse" onClick={handleRegister}>
            Registrarse
          </button>
        </div>
      </div>
      <Buscador />
      <div className="cards-home">
        <ImgMediaCard />
        <ImgMediaCard />
        <ImgMediaCard />
      </div>
    </div>
  );
}
