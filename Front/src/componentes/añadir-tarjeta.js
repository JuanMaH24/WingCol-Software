import React, { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/lib/styles.scss";
import { useNavigate } from "react-router-dom";

export function PaymentForm() {
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/home-cliente");
  };

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const { number, expiry, cvc, name } = state;

    try {
      const response = await fetch("http://tu-api-url.com/api/tarjetas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number,
          expiry,
          cvc,
          name,
        }),
      });

      if (response.ok) {
        alert("Tarjeta añadida exitosamente");
        navigate("/home-cliente");
      } else {
        alert("Hubo un error al añadir la tarjeta. Inténtalo nuevamente.");
      }
    } catch (error) {
      console.error("Error al añadir la tarjeta:", error);
      alert("Error en la conexión. Inténtalo nuevamente.");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        width: "500px",
        backgroundColor: "#0c056d",
        background: "transparent",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(50px)",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        color: "white",
        borderRadius: "10px",
        padding: "30px 40px",
      }}
    >
      <h1 style={{ fontFamily: "Poppins" }}>Añadir tarjeta de pago</h1>
      <Cards
        number={state.number}
        expiry={state.expiry}
        cvc={state.cvc}
        name={state.name}
        focused={state.focus}
      />
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          name="number"
          placeholder="Card Number"
          value={state.number}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          required
          maxLength={16}
          style={{
            width: "100%",
            marginTop: "10px",
            marginBottom: "10px",
            alignItems: "center",
            display: "block",
            margin: "auto",
          }}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={state.name}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          required
          maxLength={40}
          style={{
            width: "100%",
            marginTop: "10px",
            marginBottom: "10px",
            alignItems: "center",
            display: "block",
            margin: "auto",
          }}
        />
        <input
          type="tel"
          name="expiry"
          placeholder="Expiry"
          value={state.expiry}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          required
          maxLength={4}
          pattern="\d*"
          style={{
            width: "100%",
            marginTop: "10px",
            marginBottom: "10px",
            alignItems: "center",
            display: "block",
            margin: "auto",
          }}
        />
        <input
          type="tel"
          name="cvc"
          placeholder="CVC"
          value={state.cvc}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          required
          maxLength={3}
          pattern="\d*"
          style={{
            width: "100%",
            marginTop: "10px",
            marginBottom: "10px",
            alignItems: "center",
            display: "block",
            margin: "auto",
          }}
        />
        <div className="botones-tarjetas">
          <button
            type="submit"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            Añadir tarjeta
          </button>
          <button onClick={handleHome}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
