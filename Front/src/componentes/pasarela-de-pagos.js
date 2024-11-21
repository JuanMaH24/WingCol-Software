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
  const cartItems = location.state?.cartItems || [];

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
    if (!selectedCard || cartItems.length === 0) {
      setError(
        "No hay items en el carrito o no se ha seleccionado una tarjeta"
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Procesar el pago
      const paymentResponse = await fetch("http://127.0.0.1:8000/cart/pay/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          user_id: currentUser.user_id,
          id_tarjeta: selectedCard,
          total: total,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Error en el pago");
      }

      // 2. Crear tiquetes para cada item del carrito
      const createdTickets = [];
      for (const item of cartItems) {
        const ticket = await createTicket(item);
        createdTickets.push(ticket);
      }

      // 3. Verificar que todos los tiquetes se crearon correctamente
      if (createdTickets.length !== cartItems.length) {
        throw new Error("No se pudieron crear todos los tiquetes");
      }

      alert("Pago procesado y tiquetes creados con éxito");
      navigate("/confirmacion", {
        state: {
          tickets: createdTickets,
          total: total,
        },
      });
    } catch (error) {
      console.error("Error en el proceso:", error);
      setError(
        error.message ||
          "Error al procesar el pago o crear los tiquetes. Por favor, intente de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedCard,
    cartItems,
    total,
    currentUser?.user_id,
    jwtToken,
    navigate,
  ]);

  const createTicket = async (cartItem) => {
    try {
      console.log("Creando ticket para:", cartItem); // Para debugging

      const response = await fetch("http://127.0.0.1:8000/ticket/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          id_vuelo: cartItem.id_vuelo,
          user_id: currentUser.user_id,
          id_viajero: cartItem.id_viajero,
          nombre_viajero: cartItem.nombre_viajero,
          segundo_nombre_viajero: cartItem.segundo_nombre_viajero || "",
          apellido_viajero: cartItem.apellido_viajero,
          segundo_apellido_viajero: cartItem.segundo_apellido_viajero || "",
          tipo_documento_viajero: cartItem.tipo_documento_viajero,
          fecha_nacimiento_viajero: cartItem.fecha_nacimiento_viajero,
          telefono_viajero: cartItem.telefono_viajero,
          genero_viajero: cartItem.genero_viajero,
          nombre_contacto: cartItem.nombre_contacto,
          telefono_contacto: cartItem.telefono_contacto,
          precio: cartItem.precioTotal,
          clase: cartItem.clase,
          tipo_equipaje: cartItem.tipo_equipaje,
          estado: "R",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el tiquete");
      }

      const ticketData = await response.json();
      return ticketData;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  };

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
        disabled={isLoading || selectedCard === null || cartItems.length === 0}
      >
        {isLoading ? "Procesando..." : "Pagar"}
      </button>
      <button onClick={() => navigate("/carrito")} className="volver-button">
        Volver al Carrito
      </button>
    </div>
  );
}
