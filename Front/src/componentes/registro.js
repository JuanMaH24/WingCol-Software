import React, { useState } from "react";
import "../hojas-de-estilo/registro.css";
import logocompleto from "../imagenes/WingcolName.png";
import Select from "react-select";
import { getNames, getCode } from "country-list";
import { Link, useNavigate, Navigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";


export function Registro() {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    lastName: "",
    secondLastName: "",
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
    selectedCountry: null,
    profilePicture: null,
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const countryOptions = getNames().map((country) => ({
    value: getCode(country),
    label: country, // Muestra el nombre del país y su código
  }));
  const [documentPattern, setDocumentPattern] = useState("");

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

  const handlePhoneNumberChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      phoneNumber: value,
    }));
  };

  const handleCountryChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      selectedCountry: selectedOption,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      profilePicture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    setErrorMessage("");

    const dataToSend = {
      nombre: formData.firstName,
      segundo_nombre: formData.secondName,
      apellido: formData.lastName,
      segundo_apellido: formData.secondLastName,
      telefono: formData.phoneNumber,
      genero: formData.gender,
      email: formData.email,
      tipo_documento: formData.documentType,
      user_id: formData.documentNumber,
      direccion: formData.address,
      direccion_facturacion: formData.billingAddress,
      fecha_nacimiento: formData.birthDate,
      password: formData.password,
      // Si quieres incluir la foto de perfil, necesitarías usar FormData
      pais: formData.selectedCountry["label"], // Si también lo necesitas
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/users/client/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.nombre);
        setErrorMessage(errorData.nombre || errorData.user_id || errorData.email || "Error al registrar el usuario.");
        return;

      }else{
        navigate("/", { state: { successMessage: "Usuario registrado correctamente." } });
      }

      // Si el registro es exitoso, puedes redirigir al usuario o mostrar un mensaje
      console.log("Usuario registrado exitosamente.");
      
      // Redireccionar o mostrar un mensaje de éxito aquí
    } catch (error) {
      console.error(error);
      setErrorMessage("Hubo un problema con el registro. Intenta más tarde.");
    }
  };

  return (
    <form className="registro-principal" onSubmit={handleSubmit}>
      <img className="logo-completo" src={logocompleto} alt="Logo" />
      <h1>Registro de usuario</h1>

      <div className="input-box">
        <input
          type="text"
          name="firstName"
          placeholder="Primer nombre"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$"
          required
          title="El nombre no puede tener espacios o números"
          maxLength={50}
          onChange={handleChange}
        />
      </div>

      <div className="input-box">
        <input
          type="text"
          name="secondName"
          placeholder="Segundo nombre"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$"
          title="El campo no puede tener espacios o números"
          maxLength={50}
          onChange={handleChange}
        />
      </div>

      <div className="input-box">
        <input
          type="text"
          name="lastName"
          placeholder="Primer apellido"
          maxLength={50}
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$"
          required
          title="El campo no puede tener espacios o números"
          onChange={handleChange}
        />
      </div>

      <div className="input-box">
        <input
          type="text"
          name="secondLastName"
          placeholder="Segundo apellido"
          maxLength={50}
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$"
          required
          title="El campo no puede tener espacios o números"
          onChange={handleChange}
        />
      </div>

      <div className="input-box">
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
      </div>

      <select
        name="gender"
        className="multiples-opciones"
        onChange={handleChange}
        required
      >
        <option value="">Género</option>
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
        <option value="O">Otro</option>
      </select>

      <div className="input-box">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          required
          maxLength={50}
          onChange={handleChange}
        />
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
      </div>

      <div className="input-box">
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          maxLength={50}
          onChange={handleChange}
        />
      </div>

      <div className="input-box">
        <input
          type="text"
          name="billingAddress"
          placeholder="Dirección de facturación"
          maxLength={50}
          onChange={handleChange}
        />
      </div>

      <div className="input-box">
        <input
          className="fecha-nacimiento"
          type="date"
          name="birthDate"
          min={"1940-01-01"}
          max={"2006-12-31"}
          required
          onChange={handleChange}
        />
      </div>

      <div className="input-box">
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          maxLength={20}
          minLength={8}
          pattern="^[^\s]+$"
          title="La contraseña no puede tener espacios en blanco"
          required
          onChange={handleChange}
        />
      </div>

      <div className="input-box">
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          maxLength={20}
          minLength={8}
          pattern="^[^\s]+$"
          title="La contraseña no puede tener espacios"
          required
          onChange={handleChange}
        />
      </div>

      <div className="selector-paises">
        <Select
          value={formData.selectedCountry}
          onChange={handleCountryChange}
          options={countryOptions}
          placeholder="Seleccionar país de nacimiento."
          isSearchable={true}
          className="react-select-container"
          classNamePrefix="react-select"
          required
        />
      </div>

      <div className="error">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      <div className="foto-de-perfil">
        <label htmlFor="file">Elija una imagen de perfil </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="boton-registro">
        <button type="submit">Registrarse</button>
      </div>
    </form>
  );
}
