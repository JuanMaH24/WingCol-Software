import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function TicketDisplay({ userId }) {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiHost = process.env.REACT_APP_API_HOST;

  useEffect(() => {
    fetchPurchasedTickets();
  }, [userId]);

  const fetchPurchasedTickets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${apiHost}/ticket/user/?user_id=${userId}`, // Asegúrate de usar comillas invertidas
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al hacer fetch");
      }

      const data = await response.json();

      const processedTickets = data.map((ticket) => ({
        ...ticket,
        referencia: ticket.referencia || `Vuelo ${ticket.id_vuelo}`,
        equipajeBodega: ticket.tipo_equipaje === "M",
        seatClass: ticket.clase === "P" ? "Primera clase" : "Clase Económica",
      }));

      setTickets(processedTickets);
      setIsLoading(false);
    } catch (error) {
      console.error(
        "Error fetching. Error al obtener los ticketes comprados:",
        error
      );
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/check-in");
  };

  const handleCheckIn = () => {
    navigate("/check-in");
  };

  if (isLoading) {
    return (
      <div className="tickets-container">
        <h1 className="tickets-title">Mis Boletos</h1>
        <p>Cargando boletos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tickets-container">
        <h1 className="tickets-title">Mis Boletos</h1>
        <p>Error al cargar los boletos: {error}</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="tickets-container">
        <h1 className="tickets-title">Mis Boletos</h1>
        <p>No has comprado boletos aún</p>
        <button className="boton-volver" onClick={handleBack}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="tickets-container">
      <h1 className="tickets-title">Mis Boletos</h1>
      <div className="tickets-list">
        {tickets.map((ticket, index) => (
          <div key={index} className="ticket-item">
            <div className="ticket-header">
              <h2>{ticket.referencia}</h2>
            </div>
            <div className="ticket-content">
              <div className="ticket-details">
                <p>
                  <strong>Origen:</strong> {ticket.ciudad_origen}
                </p>
                <p>
                  <strong>Destino:</strong> {ticket.ciudad_destino}
                </p>
                <p>
                  <strong>Fecha:</strong> {ticket.fecha_salida.split("T")[0]}
                </p>
                <p>
                  <strong>Hora:</strong>{" "}
                  {ticket.fecha_salida.split("T")[1]?.replace("Z", "")}
                </p>
                <p>
                  <strong>Equipaje:</strong>{" "}
                  {ticket.equipajeBodega
                    ? "Equipaje de bodega"
                    : "Solo equipaje de cabina"}
                </p>
                <p>
                  <strong>Clase de asiento:</strong> {ticket.seatClass}
                </p>
                <p>
                  <strong>Precio:</strong> ${ticket.precio_total}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <butto className="boton-ir-check-in" onClick={handleCheckIn}>
        Ir a check-in
      </butto>
      <button className="boton-volver" onClick={handleBack}>
        Volver
      </button>
    </div>
  );
}
