import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { useNavigate } from "react-router-dom";
import "../hojas-de-estilo/check-in-pasajeros.css";

export function CheckInPasajeros() {
  const [documentPattern, setDocumentPattern] = useState("");
  const navigate = useNavigate();

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

  const handleChekcIn = () => {
    navigate("/check-in");
  };

  const handleDocumentTypeChange = (e) => {
    const { value } = e.target;
    /*
    setFormData((prevState) => ({
      ...prevState,
      documentType: value,
      documentNumber: "", // Reset document number when type changes
    }));
    */

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
        />
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
        />
      </div>
      <div className="Telefono-check-in">
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          // value={formData.phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="Número de teléfono"
          minLength={10}
          maxLength={18}
          required
        />
        <select
          name="gender"
          className="genero-check-in"
          //onChange={handleChange}
          required
          //value={formData.gender}
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
            //onChange={handleChange}
            //value={formData.email}
          />
        </div>

        <select
          name="documentType"
          className="tipo-de-documento-check-in"
          onChange={handleDocumentTypeChange}
          required
          //value={formData.documentType}
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
            //onChange={handleChange}
            //value={formData.documentNumber}
            // title={
            //formData.documentType === "CC"
            // ? "Solo números"
            //: "3 letras y 6 números"
            //}
          />
        </div>
        <div className="botones-check-in">
          <button type="submit">Siguiente</button>
          <button onClick={handleChekcIn}>Cancelar</button>
        </div>
      </div>
    </form>
  );
}
