import React, { useState, useEffect } from "react";
import "../hojas-de-estilo/registro.css";
import logocompleto from "../imagenes/WingcolName.png";
import Select from "react-select";
import { getNames, getCode } from "country-list";
import { Link, useNavigate, Navigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import LocationSelector from "./ciudades";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export function CrearAdministrador() {
  const apiHost = import.meta.env.VITE_API_HOST;
  const [formData, setFormData] = useState({
    email: "",
    documentType: "",
    documentNumber: "",
  });
  const jwtToken = localStorage.getItem("access");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const countryOptions = getNames().map((country) => ({
    value: getCode(country),
    label: country, // Muestra el nombre del país y su código
  }));
  const [documentPattern, setDocumentPattern] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    documentNumber: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    let newErrors = { ...errors };

    // Validate email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = (
        <span style={{ fontSize: "12px", color: "white" }}>
          Por favor, introduce un correo electrónico válido
        </span>
      );
    } else {
      newErrors.email = "";
    }

    // Validate documentNumber
    if (formData.documentNumber) {
      if (
        formData.documentType === "CC" &&
        !/^[0-9]+$/.test(formData.documentNumber)
      ) {
        newErrors.documentNumber = (
          <span style={{ fontSize: "12px", color: "white" }}>
            El número de cédula debe contener solo números
          </span>
        );
      } else if (
        formData.documentType === "PA" &&
        !/^[A-Za-z]{3}[0-9]{6}$/.test(formData.documentNumber)
      ) {
        newErrors.documentNumber = (
          <span style={{ fontSize: "12px", color: "white" }}>
            El número de pasaporte debe tener 3 letras seguidas de 6 números
          </span>
        );
      } else {
        newErrors.documentNumber = "";
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDocumentTypeChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      documentType: value,
    }));

    // Actualizar el patrón según el tipo de documento seleccionado
    if (value === "CC") {
      setDocumentPattern("^[0-9]+$"); // Solo números
    } else if (value === "pasaporte") {
      setDocumentPattern("^[A-Za-z]{3}[0-9]{6}$"); // 3 letras y 6 números
    } else {
      setDocumentPattern(""); // Vacío si no hay selección
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    // Usamos FormData para enviar los datos
    const dataToSend = new FormData();
    dataToSend.append("email", formData.email);
    dataToSend.append("tipo_documento", formData.documentType);
    dataToSend.append("user_id", formData.documentNumber);

    try {
      const response = await fetch(`${apiHost}/users/admin/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: dataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        setErrorMessage(
          errorData.user_id ||
            errorData.email ||
            "Error al registrar el administrador."
        );
        setAlertSeverity("error");
        setShowAlert(true);
        return;
      } else {
        setErrorMessage("Administrador creado correctamente.");
        setAlertSeverity("success");
        setShowAlert(true);
        setTimeout(() => {
          navigate("/home-root", {
            state: { successMessage: "Administrador creado correctamente." },
          });
        }, 2000);
      }

      console.log("Administrador registrado exitosamente.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Hubo un problema con el registro. Intenta más tarde.");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };

  return (
    <form className="registro-principal" onSubmit={handleSubmit}>
      <img className="logo-completo" src={logocompleto} alt="Logo" />
      <h1>Crear administrador</h1>

      <div className="input-box">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico (usuario)"
          required
          maxLength={50}
          onChange={handleChange}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>

      <select
        name="documentType"
        className="multiples-opciones"
        onChange={handleDocumentTypeChange}
        required
      >
        <option value="">Tipo de documento</option>
        <option value="CC">Cédula</option>
        <option value="CE">C. Extranjería</option>
        <option value="PA">Pasaporte</option>
      </select>

      <div className="input-box">
        <input
          type="text"
          name="documentNumber"
          placeholder="Número de documento"
          pattern={documentPattern}
          minLength={10}
          required
          onChange={handleChange}
          title={
            formData.documentType === "CC"
              ? "Solo números"
              : "3 letras y 6 números"
          }
        />
        {errors.documentNumber && (
          <p className="error-message">{errors.documentNumber}</p>
        )}
      </div>

      {showAlert && (
        <Stack sx={{ width: "100%", marginBottom: 2 }} spacing={2}>
          <Alert severity={alertSeverity} onClose={() => setShowAlert(false)}>
            {errorMessage}
          </Alert>
        </Stack>
      )}

      <div className="boton-registro">
        <button type="submit" style={{ padding: "0 20px", color: "black" }}>
          Crear administrador
        </button>
      </div>
      <div className="boton-vuelo">
        <button
          style={{ height: "40px", padding: "0 20px" }}
          type="button"
          onClick={() => navigate("/home-root")}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
