import React from "react";
import { useNavigate } from "react-router-dom";
import logo_wingcol from "../imagenes/WingcolName.png";
// import "../hojas-de-estilo/home-cliente.css";
import ImgMediaCard from "./cards-home";
import Navbar from "./navbar";
import { Buscador } from "./buscador";

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
      <Navbar/>
      <Buscador />
      <div className="cards-home">
        <ImgMediaCard />
        <ImgMediaCard />
        <ImgMediaCard />
      </div>
    </div>
  );
}
