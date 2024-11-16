import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../hojas-de-estilo/pasarela-de-pagos.css";

export function PasarelaDePagos() {
  const [cardData, setCardData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const total = location.state?.total || 0;

  useEffect(() => {
    async function fetchCards() {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const jwtToken = localStorage.getItem("jwtToken");
        const param = new URLSearchParams({ user_id: currentUser.user_id });
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/card/?${param.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        const allCards = await response.json();
        if (Array.isArray(allCards)) {
          setCardData(allCards);
        }
      } catch (error) {
        console.error("Error al cargar las tarjetas", error);
      }
    }

    fetchCards();
  }, []);

  const handlePayment = async () => {
    if (!selectedCard) {
      alert("Por favor, seleccione una tarjeta");
      return;
    }

    try {
      // Simular una llamada a la API para procesar el pago
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Pago procesado con éxito");
      navigate("/confirmacion");
    } catch (error) {
      console.error("Error al procesar el pago", error);
      alert("Error al procesar el pago. Por favor, intente de nuevo.");
    }
  };

  return (
    <div className="pasarela-container">
      <h1>Pasarela de Pagos</h1>
      <h2>Total a pagar: ${total}</h2>
      <div className="tarjetas-container">
        {cardData.map((card) => (
          <div key={card.id} className="tarjeta-item">
            <input
              type="radio"
              id={`card-${card.id}`}
              name="card"
              value={card.id}
              onChange={() => setSelectedCard(card.id)}
            />
            <label htmlFor={`card-${card.id}`}>
              {card.card_number.slice(-4).padStart(16, "*")} - {card.card_type}
            </label>
          </div>
        ))}
      </div>
      <button onClick={handlePayment} className="pagar-button">
        Pagar
      </button>
      <button onClick={() => navigate("/carrito")} className="volver-button">
        Volver al Carrito
      </button>
    </div>
  );
}
