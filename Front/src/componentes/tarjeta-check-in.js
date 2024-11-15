import React from "react";
import FotoMuestra from "../imagenes/foto-check-in.jpg";
import "../hojas-de-estilo/tarjeta-check-in.css";
import { useNavigate } from "react-router-dom";

export function CheckInBanner() {
  const navigate = useNavigate();

  const handleCheckIn = () => {
    navigate("/check-in");
  };

  return (
    <div className="contenedor-principal">
      <div className="parte-izquierda">
        <div className="imagen-muestra">
          <img src={FotoMuestra} />
        </div>
        <div className="parte-derecha">
          <div className="titulo">
            <h3>Check-in</h3>
          </div>
          <div className="informacion">
            <p>Te recomendamos que lo hagas 48 horas antes de tu vuelo</p>
          </div>
          <div className="boton-check-in">
            <button onClick={handleCheckIn}>Check-in</button>
          </div>
        </div>
      </div>
    </div>
  );
}
