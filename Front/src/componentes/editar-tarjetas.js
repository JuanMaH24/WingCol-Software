import React, { useState, useEffect } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/lib/styles.scss";
import { useNavigate } from "react-router-dom";

export function PaymentFormEditarTarjeta() {
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
    cardtype: "",
    currencycard: "",
  });
  const apiHost = process.env.REACT_APP_API_HOST;

  const [minDate, setMinDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const formattedDate = formatDate(today);
    setMinDate(formattedDate);
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [originalState, setOriginalState] = useState(null);

  // Cargar la información de la tarjeta al cargar el componente
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await fetch(`${apiHost}/cards/`);
        const data = await response.json();
        setState({
          number: data.number,
          expiry: data.expiry,
          cvc: data.cvc,
          name: data.name,
          focus: "",
          cardtype: data.cardtype,
          currencycard: data.currencycard,
        });
      } catch (error) {
        console.error("Error al cargar la tarjeta:", error);
      }
    };

    fetchCardData();
  }, []);

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  // Función para eliminar la tarjeta
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta tarjeta?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`${apiHost}/cards/delete/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ number: state.number }), // Enviar la información necesaria para identificar la tarjeta
        });

        if (response.ok) {
          alert("Tarjeta eliminada exitosamente.");
          navigate("/home-cliente");
        } else {
          alert("Hubo un error al eliminar la tarjeta. Inténtalo nuevamente.");
        }
      } catch (error) {
        console.error("Error al eliminar la tarjeta:", error);
        alert("Error en la conexión. Inténtalo nuevamente.");
      }
    }
  };

  // Función para cancelar y confirmar la acción
  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "¿Estás seguro de que deseas cancelar? Se eliminará la información de la tarjeta."
    );
    if (confirmCancel) {
      handleDelete();
    }
  };

  const handleListaTarjeta = () => {
    navigate("/lista-tarjetas");
  };

  const hasChanges = () => {
    return (
      state.number !== originalState.number ||
      state.expiry !== originalState.expiry ||
      state.cvc !== originalState.cvc ||
      state.name !== originalState.name ||
      state.cardtype !== originalState.cardtype ||
      state.currencycard !== originalState.currencycard
    );
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (hasChanges()) {
      try {
        const response = await fetch(`${apiHost}/cards/update/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(state),
        });

        if (response.ok) {
          alert("Tarjeta actualizada exitosamente.");
          navigate("/home-cliente");
        } else {
          alert(
            "Hubo un error al actualizar la tarjeta. Inténtalo nuevamente."
          );
        }
      } catch (error) {
        console.error("Error al actualizar la tarjeta:", error);
        alert("Error en la conexión. Inténtalo nuevamente.");
      }
    } else {
      alert("No se han realizado cambios.");
      navigate("/home-cliente");
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
      <h1 style={{ fontFamily: "Poppins" }}>Editar tarjeta de pago</h1>
      <Cards
        number={state.number}
        expiry={`${state.expiry.slice(5, 7)}${state.expiry.slice(2, 4)}`}
        cvc={state.cvc}
        name={state.name}
        focused={state.focus}
      />
      <form onSubmit={handleSubmit}>
        <select
          className="tipo-tarjeta"
          value={state.cardtype}
          style={{ marginTop: "10px" }}
          required
        >
          <option value="tipo de tarjeta" style={{ color: "black" }}>
            Tipo de tarjeta
          </option>
          <option value="D" style={{ color: "black" }}>
            Tarjeta de debito
          </option>
          <option value="C" style={{ color: "black" }}>
            Tarjeta de credito
          </option>
        </select>
        <input
          type="tel"
          name="number"
          placeholder="Card Number"
          value={state.number}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
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
          type="date"
          name="expiry"
          placeholder="Expiry"
          value={state.expiry}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          title="Formato inválido. Usa MMDD, donde MM es el mes (01-12) y DD es el día (01-31)."
          min={minDate}
          required
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
        <input
          type="number"
          min={0}
          placeholder="Saldo de la tarjeta"
          value={state.currencycard}
          required
        />
        <div className="botones-tarjetas">
          <button
            type="submit"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            Guardar cambios
          </button>
          <button type="button" onClick={handleListaTarjeta}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            style={{ marginTop: "10px", marginBottom: "10px", color: "red" }}
          >
            Eliminar tarjeta
          </button>
        </div>
      </form>
    </div>
  );
}
