import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../hojas-de-estilo/check-in-ingreso.css";
import { CompletarCheckin } from "./completar-checkin"; // Importa el componente donde se usará id_tiquete

export function CheckInIngreso() {
  const apiHost = import.meta.env.VITE_API_HOST;
  const [codigoReserva, setCodigoReserva] = useState("");
  const jwtToken = localStorage.getItem("access");
  const [idTiquete, setIdTiquete] = useState(null);
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/home-visitante");
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Realiza el fetch al backend
      console.log(codigoReserva)
      const response = await fetch(`${apiHost}/checkin/fast/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          verificacion: codigoReserva, // Enviar el código de reserva
        }),
      });

      if (!response.ok) {
        throw new Error("Error al comunicarse con el backend");
      }

      const data = await response.json();
      // Extrae el id_tiquete del JSON de respuesta
      const id_tiquete = data.id_tiquete;
      if (id_tiquete) {
        setIdTiquete(id_tiquete); // Guarda el id_tiquete en el estado
        console.log(id_tiquete)
        navigate("/completar-checkin", { state: { id_tiquete: id_tiquete } }); // Navega al componente con el prop
      } else {
        alert("No se encontró el id_tiquete en la respuesta");
      }
    } catch (error) {
      console.error("Error en el proceso de fetch:", error);
      alert("Hubo un error procesando tu solicitud, intenta de nuevo.");
    }
  };

  return (
    <div className="contenedor-principal-check-in">
      <h1>Haz tu check-in online ahora</h1>
      <form className="ingreso-check-in" onSubmit={handleSubmit}>
        <div className="codigo-de-reserva">
          <input
            type="text"
            placeholder="Código de reserva"
            value={codigoReserva}
            onChange={(e) => setCodigoReserva(e.target.value)}
            required
            pattern="^[a-zA-Z]{3}\d{3}$"
            title="El código de reserva debe tener 3 letras mayúsculas seguidas de 3 dígitos"
            maxLength={6}
          />
        </div>
        {/* <p>O ingresa con:</p>
        <div className="documento-check-in">
          <input
            type="text"
            placeholder="Número de documento"
            required
            maxLength={13}
          />
        </div> */}

        <div className="botones-ingreso-check-in">
          <button
            type="submit"
            style={{ color: "white", backgroundColor: "black" }}
          >
            Empezar check-in
          </button>
          <button type="button" onClick={handleHome}>
            Volver a la pagina de inicio
          </button>
        </div>
      </form>
    </div>
  );
}
