import React from "react";
import { useNavigate } from "react-router-dom";
import "../hojas-de-estilo/check-in-ingreso.css";

export function CheckInIngreso() {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/home-visitante");
  };
  return (
    <div className="contenedor-principal-check-in">
      <h1>Haz tu check-in online ahora</h1>
      <form className="ingreso-check-in">
        <div className="codigo-de-reserva">
          <input
            type="text"
            placeholder="Código de reserva"
            required
            maxLength={6}
          />
        </div>
        <div className="apellidos-ingreso-check-in">
          <input type="text" placeholder="Apellidos" required />
        </div>
        <div className="botones-ingreso-check-in">
          <button
            type="submit"
            style={{ color: "white", backgroundColor: "black" }}
          >
            Empezar check-in
          </button>
          <button onClick={handleHome}>Volver a la pagina de incio</button>
        </div>
      </form>
    </div>
  );
}
