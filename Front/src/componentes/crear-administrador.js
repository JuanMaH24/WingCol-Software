import React, { useState } from "react";
import "../hojas-de-estilo/crear-administrador.css";
import logocompleto from "../imagenes/WingcolName.png";
import Select from "react-select";
import { getNames, getCode } from "country-list";
import { Link, useNavigate, Navigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export function CrearAdministrador() {
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

    // Usamos FormData para enviar los datos
    const dataToSend = new FormData();
    dataToSend.append("nombre", formData.firstName);
    dataToSend.append("segundo_nombre", formData.secondName);
    dataToSend.append("apellido", formData.lastName);
    dataToSend.append("segundo_apellido", formData.secondLastName);
    dataToSend.append("telefono", formData.phoneNumber);
    dataToSend.append("genero", formData.gender);
    dataToSend.append("email", formData.email);
    dataToSend.append("tipo_documento", formData.documentType);
    dataToSend.append("user_id", formData.documentNumber);
    dataToSend.append("direccion", formData.address);
    dataToSend.append("direccion_facturacion", formData.billingAddress);
    dataToSend.append("fecha_nacimiento", formData.birthDate);
    dataToSend.append("password", formData.password);
    if (formData.profilePicture) {
      dataToSend.append("profilePicture", formData.profilePicture); // Enviamos la imagen si existe
    }
    dataToSend.append("pais", formData.selectedCountry?.label);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/users/client/create/",
        {
          method: "POST",
          body: dataToSend, // Enviamos FormData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(
          errorData.nombre ||
            errorData.user_id ||
            errorData.email ||
            "Error al registrar el administrador."
        );
        return;
      } else {
        // Redirigir al usuario a /home-root después de la creación exitosa
        navigate("/home-root", {
          state: { successMessage: "Administrador creado correctamente." },
        });
      }

      console.log("Administrador registrado exitosamente.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Hubo un problema con el registro. Intenta más tarde.");
    }
  };

  return (
    <form className="contenedor-principal-crear-admin" onSubmit={handleSubmit}>
      <img className="logo-completo" src={logocompleto} alt="Logo" />
      <h1>Crear administrador</h1>

      <div className="input-box-crear-admin">
        <input
          type="text"
          name="firstName"
          placeholder="Primer nombre"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ][a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$"
          required
          title="El nombre no puede tener espacios o números"
          maxLength={50}
          onChange={handleChange}
        />
      </div>

      <div className="input-box-crear-admin">
        <input
          type="text"
          name="secondName"
          placeholder="Segundo nombre"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ][a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$"
          title="El campo no puede tener espacios o números"
          maxLength={50}
          onChange={handleChange}
        />
      </div>

      <div className="input-box-crear-admin">
        <input
          type="text"
          name="lastName"
          placeholder="Primer apellido"
          maxLength={50}
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ][a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$"
          required
          title="El campo no puede tener espacios o números"
          onChange={handleChange}
        />
      </div>

      <div className="input-box-crear-admin">
        <input
          type="text"
          name="secondLastName"
          placeholder="Segundo apellido"
          maxLength={50}
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ][a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$"
          required
          title="El campo no puede tener espacios o números"
          onChange={handleChange}
        />
      </div>

      <div className="input-box-crear-admin">
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
        className="multiples-opciones-crear-admin"
        onChange={handleChange}
        required
      >
        <option value="">Género</option>
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
        <option value="O">Otro</option>
      </select>

      <div className="input-box-crear-admin">
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
        className="multiples-opciones-crear-admin"
        onChange={handleDocumentTypeChange}
        required
      >
        <option value="">Tipo de documento</option>
        <option value="CC">Cédula</option>
        <option value="CE">C. Extranjería</option>
        <option value="PA">Pasaporte</option>
      </select>

      <div className="input-box-crear-admin">
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

      <div className="input-box-crear-admin">
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          maxLength={50}
          onChange={handleChange}
        />
      </div>

      <div className="input-box-crear-admin">
        <input
          type="text"
          name="billingAddress"
          placeholder="Dirección de facturación"
          maxLength={50}
          onChange={handleChange}
        />
      </div>

      <div className="input-box-crear-admin">
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

      <div className="input-box-crear-admin">
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

      <div className="input-box-crear-admin">
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

      <div className="selector-paises-crear-admin">
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

      <div className="error-admin">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      <div className="foto-de-perfil-admin">
        <label htmlFor="file">Elija una imagen de perfil </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="boton-registro-crear-admin">
        <button type="submit">Crear administrador</button>
      </div>
    </form>
  );
}
