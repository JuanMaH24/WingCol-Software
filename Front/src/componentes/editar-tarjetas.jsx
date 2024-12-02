import React, { useState, useEffect } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/lib/styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../services/jwt-decode";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

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
  const [errors, setErrors] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    cardtype: "",
    currencycard: "",
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
      !/^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ\s]*$/.test(state.name) // Eliminamos '\s' para no aceptar espacios
    ) {
      newErrors.name = (
        <span style={{ fontSize: "12px", color: "white" }}>
          El nombre no puede contener espacios, números o caracteres especiales
        </span>
      );
    } else {
      newErrors.name = "";
    }
    setErrors(newErrors);
  };

  const apiHost = import.meta.env.VITE_API_HOST;
  const jwtToken = localStorage.getItem("access");
  const currentUser = getUser();
  const [minDate, setMinDate] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    severity: "info",
  });

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
        const param = new URLSearchParams({ id_tarjeta: id });
        const response = await fetch(
          `${apiHost}/card/get/?${param.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        const data = await response.json();
        setState({
          number: data.id_tarjeta,
          expiry: data.fecha_expiracion,
          cvc: data.vvc,
          name: data.nombre,
          focus: "",
          cardtype: data.tipo_tarjeta,
          currencycard: data.saldo,
        });
        setOriginalState({
          number: data.id_tarjeta,
          expiry: data.fecha_expiracion,
          cvc: data.vvc,
          name: data.nombre,
          focus: "",
          cardtype: data.tipo_tarjeta,
          currencycard: data.saldo,
        });
      } catch (error) {
        console.error("Error al cargar la tarjeta:", error);
        setAlertInfo({
          show: true,
          message: "Error al cargar la información de la tarjeta.",
          severity: "error",
        });
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
        const response = await fetch(`${apiHost}/card/delete/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ id_tarjeta: id }),
        });

        if (response.ok) {
          setAlertInfo({
            show: true,
            message: "Tarjeta eliminada exitosamente.",
            severity: "success",
          });
          setTimeout(() => {
            navigate("/home-cliente");
          }, 2000);
        } else {
          setAlertInfo({
            show: true,
            message:
              "Hubo un error al eliminar la tarjeta. Inténtalo nuevamente.",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error al eliminar la tarjeta:", error);
        setAlertInfo({
          show: true,
          message: "Error en la conexión. Inténtalo nuevamente.",
          severity: "error",
        });
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
    const { number, expiry, cvc, name, cardtype, currencycard } = state;
    if (hasChanges()) {
      try {
        const response = await fetch(`${apiHost}/card/update/`, {
          method: "PUT",
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

        if (response.ok) {
          setAlertInfo({
            show: true,
            message: "Tarjeta actualizada exitosamente.",
            severity: "success",
          });
          setTimeout(() => {
            navigate("/home-cliente");
          }, 2000);
        } else {
          setAlertInfo({
            show: true,
            message:
              "Hubo un error al actualizar la tarjeta. Inténtalo nuevamente.",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error al actualizar la tarjeta:", error);
        setAlertInfo({
          show: true,
          message: "Error en la conexión. Inténtalo nuevamente.",
          severity: "error",
        });
      }
    } else {
      setAlertInfo({
        show: true,
        message: "No se han realizado cambios.",
        severity: "info",
      });
      setTimeout(() => {
        navigate("/home-cliente");
      }, 2000);
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
          name="cardtype"
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
            maxLength={16}
            style={{
              width: "100%",
              marginTop: "20px",
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
            maxLength={40}
            pattern="[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ\s]*$"
            style={{
              width: "100%",
              marginTop: "20px",
              marginBottom: "10px",
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

        <div>
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
              marginTop: "20px",
              marginBottom: "10px",
              alignItems: "center",
              display: "block",
              margin: "auto",
            }}
          />
          {errors.cvc && <p className="error-message">{errors.cvc}</p>}
        </div>

        <input
          type="number"
          min={0}
          name="currencycard"
          onChange={handleInputChange}
          placeholder="Saldo de la tarjeta"
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
