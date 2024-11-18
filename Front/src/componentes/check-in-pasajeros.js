import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import { useNavigate } from "react-router-dom";
import "../hojas-de-estilo/check-in-pasajeros.css";

export function CheckInPasajeros() {
  const [documentPattern, setDocumentPattern] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    Nombres: "",
    Apellidos: "",
    phoneNumber: "",
    gender: "",
    email: "",
    documentType: "",
    documentNumber: "",
  });

  const [formData, setFormData] = useState({
    Nombres: "",
    Apellidos: "",
    phoneNumber: "",
    gender: "",
    email: "",
    documentType: "",
    documentNumber: "",
    address: "",
    billingAddress: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    country: "",
    state: "",
    city: "",
    profilePicture: null,
  });

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    let newErrors = { ...errors };

    // Validate firstName
    // Validate firstName
    if (
      formData.Nombres &&
      !/^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$/.test(formData.Nombres) // Eliminamos '\s' para no aceptar espacios
    ) {
      newErrors.Nombres = (
        <span style={{ fontSize: "12px", color: "white" }}>
          El nombre no puede contener espacios, números o caracteres especiales
        </span>
      );
    } else {
      newErrors.Nombres = "";
    }

    if (
      formData.Apellidos &&
      !/^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$/.test(formData.Apellidos) // Eliminamos '\s' para no aceptar espacios
    ) {
      newErrors.Apellidos = (
        <span style={{ fontSize: "12px", color: "white" }}>
          Los Apellidos no pueden contener espacios, números o caracteres
          especiales
        </span>
      );
    } else {
      newErrors.Apellidos = "";
    }

    if (
      formData.email && // Verifica que haya al menos un carácter ingresado
      (formData.email.trim() === "" || // Verifica si solo hay espacios en blanco
        formData.email.trim() !== formData.email || // Verifica que no tenga espacios al inicio o al final
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          formData.email
        ))
    ) {
      newErrors.email = (
        <span style={{ fontSize: "12px", color: "white" }}>
          Por favor, introduce un correo electrónico válido sin espacios
        </span>
      );
    } else {
      newErrors.email = "";
    }

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

  const handleChekcIn = () => {
    navigate("/check-in");
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "birthDate") {
      const age = calculateAge(value);
      if (age < 18) {
        setWarningMessage(
          <span style={{ fontSize: "12px", color: "white" }}>
            Los menores de 18 años deben viajar con un acompañante adulto.
          </span>
        );
      } else {
        setWarningMessage("");
      }
    }
  };

  const handleDocumentTypeChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      documentType: value,
      documentNumber: "",
    }));

    if (value === "CC") {
      setDocumentPattern("^[0-9]+$");
    } else if (value === "PA") {
      setDocumentPattern("^[A-Za-z]{3}[0-9]{6}$");
    } else {
      setDocumentPattern("");
    }
  };

  const handlePhoneNumberChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      phoneNumber: value,
    }));
  };

  return (
    <form className="contenedor-principal-pasajeros">
      <h1>Bienvenido a tu check-in online</h1>
      <div className="Nombres-check-in">
        <input
          type="text"
          name="Nombres"
          placeholder="Nombres"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$"
          required
          title="Los nombres no pueden tener espacios o números"
          maxLength={50}
          onChange={handleChange}
          value={formData.Nombres}
        />
        {errors.Nombres && <p className="error-message">{errors.Nombres}</p>}
      </div>

      <div className="Apellidos-check-in">
        <input
          type="text"
          name="Apellidos"
          placeholder="Apellidos"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$"
          required
          title="Los apellidos no pueden tener espacios o números"
          maxLength={50}
          onChange={handleChange}
          value={formData.Apellidos}
        />
        {errors.Apellidos && (
          <p className="error-message">{errors.Apellidos}</p>
        )}
      </div>
      <div className="Telefono-check-in">
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          value={formData.phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="Número de teléfono"
          minLength={10}
          maxLength={18}
          required
        />
        <select
          name="gender"
          className="genero-check-in"
          onChange={handleChange}
          required
          value={formData.gender}
        >
          <option value="">Género</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="N">Prefiero no decirlo</option>
          <option value="O">Otro</option>
        </select>
        <div className="correo-check-in">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            required
            maxLength={50}
            onChange={handleChange}
            value={formData.email}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="fecha-de-nacimiento-pasajeros">
          <input
            type="date"
            name="birthDate"
            placeholder="Fecha de nacimiento"
            min={"1940-01-01"}
            max={"2024-8-30"}
            required
            onChange={handleChange}
            value={formData.birthDate}
          />
          {warningMessage && (
            <p className="warning-message">{warningMessage}</p>
          )}
        </div>

        <select
          name="documentType"
          className="tipo-de-documento-check-in"
          onChange={handleDocumentTypeChange}
          required
          value={formData.documentType}
        >
          <option value="">Tipo de documento</option>
          <option value="CC">Cédula</option>
          <option value="CE">C. Extranjería</option>
          <option value="PA">Pasaporte</option>
        </select>
        <div className="numero-de-documento-check-in">
          <input
            type="text"
            name="documentNumber"
            placeholder="Número de documento"
            pattern={documentPattern}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.documentNumber}
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
        <div className="botones-check-in">
          <button type="submit">Siguiente</button>
          <button onClick={handleChekcIn}>Cancelar</button>
        </div>
      </div>
    </form>
  );
}
