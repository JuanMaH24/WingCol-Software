import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../hojas-de-estilo/pasarela-de-pagos.css";
import { getUser } from "../services/jwt-decode";

export function PasarelaDePagos() {
  const [cardData, setCardData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const total = location.state?.total || 0;
  const ticketId = location.state?.ticketId;

  // Movemos estas variables fuera del cuerpo del componente
  const apiHost = process.env.REACT_APP_API_HOST;
  const jwtToken = localStorage.getItem("access");
  const currentUser = getUser();

  // Memoizamos la función fetchCards
  const fetchCards = useCallback(async () => {
    if (!currentUser?.user_id) return;

    try {
      const param = new URLSearchParams({ user_id: currentUser.user_id });
      const response = await fetch(`${apiHost}/card/?${param.toString()}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const allCards = await response.json();
      if (Array.isArray(allCards)) {
        setCardData(allCards);
      }
    } catch (error) {
      console.error("Error al cargar las tarjetas", error);
      setError("Error al cargar las tarjetas");
    }
  }, [apiHost, currentUser?.user_id, jwtToken]);

  // Optimizamos el useEffect
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Memoizamos la función handleCardSelection
  const handleCardSelection = useCallback((cardId) => {
    setSelectedCard(cardId);
  }, []);

  // Memoizamos la función formatCardInfo
  const formatCardInfo = useCallback((card) => {
    if (!card) return "";

    const idTarjeta = card.id_tarjeta
      ? String(card.id_tarjeta)
      : "XXXXXXXXXXXX";
    const lastFour = idTarjeta.length >= 4 ? idTarjeta.slice(-4) : "XXXX";

    let cardType = "Desconocido";
    if (card.tipo_tarjeta) {
      cardType = card.tipo_tarjeta.toUpperCase() === "D" ? "Débito" : "Crédito";
    }

    return `**** **** **** ${lastFour} - ${cardType}`;
  }, []);

  // Memoizamos la función handlePayment
  const handlePayment = useCallback(async () => {
    if (!selectedCard) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiHost}/cart/pay/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          user_id: currentUser.user_id,
          id_tarjeta: selectedCard,
          id_tiquete: ticketId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const result = await response.json();
      alert("Pago procesado con éxito");
      navigate("/confirmacion");
    } catch (error) {
      console.error("Error al procesar el pago", error);
      setError("Error al procesar el pago. Por favor, intente de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, [
    apiHost,
    currentUser?.user_id,
    jwtToken,
    selectedCard,
    ticketId,
    navigate,
  ]);

  return (
    <div className="pasarela-container">
      <h1>Pasarela de Pagos</h1>
      <h2>Total a pagar: ${total}</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="tarjetas-container">
        {cardData.map((card) => (
          <label
            key={card.id_tarjeta}
            className={`tarjeta-item ${
              selectedCard === card.id_tarjeta ? "selected" : ""
            }`}
            htmlFor={`card-${card.id_tarjeta}`}
          >
            <input
              type="radio"
              id={`card-${card.id_tarjeta}`}
              name="tarjeta"
              checked={selectedCard === card.id_tarjeta}
              onChange={() => handleCardSelection(card.id_tarjeta)}
            />
            <span className="card-info">{formatCardInfo(card)}</span>
          </label>
        ))}
        {cardData.length === 0 && <p>No hay tarjetas registradas</p>}
      </div>

      <button
        onClick={handlePayment}
        className="pagar-button"
        disabled={isLoading || selectedCard === null}
      >
        {isLoading ? "Procesando..." : "Pagar"}
      </button>
      <button onClick={() => navigate("/carrito")} className="volver-button">
        Volver al Carrito
      </button>
    </div>
  );
}
