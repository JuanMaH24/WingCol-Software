import React from "react";
import { BsSuitcase } from "react-icons/bs";

export function SeleccionEquipaje() {
  return (
    <div className="contenedor-principal-equipaje">
      <h1>Selecciona tu equipaje</h1>
      <form className="seleccion-equipaje">
        <div className="equipaje-cabina">
          <input type="checkbox" id="equipaje-cabina" name="equipaje-cabina" />
          <label for="equipaje-cabina">Equipaje de cabina</label>
        </div>
        <div className="equipaje-facturado">
          <input
            type="checkbox"
            id="equipaje-facturado"
            name="equipaje-facturado"
          />
          <BsSuitcase />
        </div>
        <div className="botones-seleccion-equipaje">
          <button
            type="submit"
            style={{ color: "white", backgroundColor: "black" }}
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
}
