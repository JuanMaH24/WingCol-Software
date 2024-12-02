import React from "react";
import Foto from "../imagenes/fondo-inicio-sesion.jpg";

export function informacionVuelo() {
  return (
    <div className="contenedor-principal-info-vuelo">
      <div className="parte-derecha">
        <img src={Foto} />
      </div>
      <div className="parte-izquierda-info"></div>
    </div>
  );
}
