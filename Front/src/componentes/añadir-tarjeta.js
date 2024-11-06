import React, { useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/lib/styles.scss";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/jwt-decode";
import Navbar from "./navbar";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export function PaymentForm() {
  const apiHost = process.env.REACT_APP_API_HOST;
  const currentUser = getUser();
  const jwtToken = localStorage.getItem("access");
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
    cardtype: "",
    currencycard: "",
  });

  const [errors, setErrors] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    cardtype: "",
    currencycard: "",
  });

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    validateForm();
  }, [state]);

  const validateForm = () => {
    let newErrors = { ...errors };

    if (state.number && !/^\d{16}$/.test(state.number)) {
      newErrors.number = (
        <span style={{ fontSize: "12px", color: "white" }}>
          El número de tarjeta debe tener 16 dígitos.
        </span>
      );
    } else {
      newErrors.number = "";
    }

    if (state.cvc && !/^\d{3}$/.test(state.cvc)) {
      newErrors.cvc = (
        <span style={{ fontSize: "12px", color: "white" }}>
          El CVC debe tener 3 dígitos.
        </span>
      );
    }

    if (
      state.name &&
      !/^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ\s]*$/.test(state.name) // Eliminamos '\s' para no aceptar espacios
    ) {
      newErrors.name = (
        <span style={{ fontSize: "12px", color: "white" }}>
          El nombre no puede contener números o caracteres especiales
        </span>
      );
    } else {
      newErrors.name = "";
    }
    setErrors(newErrors);
  };

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

  const handleListatarjeta = () => {
    navigate("/");
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
    const { number, expiry, cvc, name, cardtype, currencycard } = state;

    try {
      console.log({
        id_tarjeta: number,
        fecha_expiracion: expiry,
        vvc: cvc,
        nombre: name,
        tipo_tarjeta: cardtype,
        saldo: currencycard,
        user_id: currentUser.user_id,
      });
      const response = await fetch(`${apiHost}/card/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          id_tarjeta: number,
          fecha_expiracion: expiry,
          vvc: cvc,
          nombre: name,
          tipo_tarjeta: cardtype,
          saldo: currencycard,
          user_id: currentUser.user_id,
        }),
      });
      // {
      //   "id_tarjeta": 2222222222222222,
      //   "user_id": 1004778421,
      //   "tipo_tarjeta": "D",
      //   "vvc": 2921,
      //   "fecha_expiracion": "2025-10-24"
      // }

      if (response.ok) {
        setAlertInfo({
          show: true,
          message: "Tarjeta añadida exitosamente",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/home-cliente");
        }, 2000);
      } else {
        setAlertInfo({
          show: true,
          message: "Hubo un error al añadir la tarjeta. Inténtalo nuevamente.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error al añadir la tarjeta:", error);
      setAlertInfo({
        show: true,
        message: "Error en la conexión. Inténtalo nuevamente.",
        severity: "error",
      });
    }
  };

  return (
    <div className="contenedor-principal-home">
      {/* <Navbar/> */}
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
          expiry={`${state.expiry.slice(5, 7)}${state.expiry.slice(2, 4)}`}
          cvc={state.cvc}
          name={state.name}
          focused={state.focus}
        />
        <form onSubmit={handleSubmit}>
          <select
            className="tipo-tarjeta"
            name="cardtype"
            value={state.cardtype}
            onChange={handleInputChange}
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
          <div>
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
            {errors.number && <p className="error-message">{errors.number}</p>}
          </div>

          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={state.name}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              pattern="[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$"
              title="El campo no puede tener números"
              required
              maxLength={40}
              style={{
                width: "100%",
                marginTop: "20px",
                marginBottom: "20px",
                alignItems: "center",
                display: "block",
                margin: "auto",
              }}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

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
              marginTop: "20px",
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
              marginTop: "20px",
              marginBottom: "10px",
              alignItems: "center",
              display: "block",
              margin: "auto",
            }}
          />
          {errors.cvc && <p className="error-message">{errors.cvc}</p>}

          <input
            type="number"
            name="currencycard"
            min={0}
            onChange={handleInputChange}
            placeholder="Saldo/Cupo de la tarjeta"
            value={state.currencycard}
            required
          />
          {alertInfo.show && (
            <Stack sx={{ width: "100%", marginBottom: 2 }} spacing={2}>
              <Alert
                severity={alertInfo.severity}
                onClose={() => setAlertInfo({ ...alertInfo, show: false })}
              >
                {alertInfo.message}
              </Alert>
            </Stack>
          )}
          <div className="botones-tarjetas">
            <button
              type="submit"
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              Añadir tarjeta
            </button>
            <button onClick={handleListatarjeta}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
