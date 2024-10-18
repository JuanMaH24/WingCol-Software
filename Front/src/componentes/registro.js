import React, { useState, useEffect } from "react";
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

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    documentNumber: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const countryOptions = getNames().map((country) => ({
    value: getCode(country),
    label: country,
  }));
  const [documentPattern, setDocumentPattern] = useState("");

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    let newErrors = { ...errors };

    // Validate firstName
    // Validate firstName
    if (
      formData.firstName &&
      !/^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$/.test(formData.firstName) // Eliminamos '\s' para no aceptar espacios
    ) {
      newErrors.firstName =
        "El nombre no puede contener espacios, números o caracteres especiales";
    } else {
      newErrors.firstName = "";
    }

    // Validate lastName
    if (
      formData.lastName &&
      !/^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$/.test(formData.lastName) // Eliminamos '\s' para no aceptar espacios
    ) {
      newErrors.lastName =
        "El apellido no puede contener espacios, números o caracteres especiales";
    } else {
      newErrors.lastName = "";
    }

    // Validate email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Por favor, introduce un correo electrónico válido";
    } else {
      newErrors.email = "";
    }

    // Validate documentNumber
    if (formData.documentNumber) {
      if (
        formData.documentType === "CC" &&
        !/^[0-9]+$/.test(formData.documentNumber)
      ) {
        newErrors.documentNumber =
          "El número de cédula debe contener solo números";
      } else if (
        formData.documentType === "PA" &&
        !/^[A-Za-z]{3}[0-9]{6}$/.test(formData.documentNumber)
      ) {
        newErrors.documentNumber =
          "El número de pasaporte debe tener 3 letras seguidas de 6 números";
      } else {
        newErrors.documentNumber = "";
      }
    }

    // Validate password
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "La contraseņa debe tener al menos 8 caracteres";
    } else if (formData.password && /\s/.test(formData.password)) {
      newErrors.password = "La contraseņa no puede contener espacios en blanco";
    } else {
      newErrors.password = "";
    }

    // Validate confirmPassword
    if (
      formData.confirmPassword &&
      formData.confirmPassword !== formData.password
    ) {
      newErrors.confirmPassword = "Las contraseņas no coinciden";
    } else {
      newErrors.confirmPassword = "";
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
      documentNumber: "", // Reset document number when type changes
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

    // Check if there are any errors
    if (Object.values(errors).some((error) => error !== "")) {
      setErrorMessage(
        "Por favor, corrige los errores antes de enviar el formulario."
      );
      return;
    }

    setErrorMessage("");

    // Crea un nuevo objeto FormData
    const dataToSend = new FormData();

    // Agrega los datos del formulario a FormData
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
    dataToSend.append("pais", formData.selectedCountry?.label);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/users/client/create/",
        {
          method: "POST",
          body: dataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(
          errorData.nombre ||
            errorData.user_id ||
            errorData.email ||
            "Error al registrar el usuario."
        );
        return;
      } else {
        navigate("/", {
          state: { successMessage: "Usuario registrado correctamente." },
        });
      }

      console.log("Usuario registrado exitosamente.");
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
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$"
          required
          title="El nombre no puede tener espacios o números"
          maxLength={50}
          onChange={handleChange}
          value={formData.firstName}
        />
        {errors.firstName && (
          <p className="error-message">{errors.firstName}</p>
        )}
      </div>

      <div className="input-box">
        <input
          type="text"
          name="secondName"
          placeholder="Segundo nombre"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$"
          title="El campo no puede tener espacios o números"
          maxLength={50}
          onChange={handleChange}
          value={formData.secondName}
        />
      </div>

      <div className="input-box">
        <input
          type="text"
          name="lastName"
          placeholder="Primer apellido"
          maxLength={50}
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$"
          required
          title="El campo no puede tener espacios o números"
          onChange={handleChange}
          value={formData.lastName}
        />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}
      </div>

      <div className="input-box">
        <input
          type="text"
          name="secondLastName"
          placeholder="Segundo apellido"
          maxLength={50}
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$"
          required
          title="El campo no puede tener espacios o números"
          onChange={handleChange}
          value={formData.secondLastName}
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
        value={formData.gender}
      >
        <option value="">Género</option>
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
        <option value="N">Prefiero no decirlo</option>
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
          value={formData.email}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>

      <select
        name="documentType"
        className="multiples-opciones"
        onChange={handleDocumentTypeChange}
        required
        value={formData.documentType}
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

      <div className="input-box">
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          maxLength={50}
          onChange={handleChange}
          value={formData.address}
        />
      </div>

      <div className="input-box">
        <input
          type="text"
          name="billingAddress"
          placeholder="Dirección de facturación"
          maxLength={50}
          onChange={handleChange}
          value={formData.billingAddress}
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
          value={formData.birthDate}
        />
      </div>

      <div className="input-box">
        <input
          type="password"
          name="password"
          placeholder="Contraseņa"
          maxLength={20}
          minLength={8}
          pattern="^[^\s]+$"
          title="La contraseņa no puede tener espacios en blanco"
          required
          onChange={handleChange}
          value={formData.password}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
      </div>

      <div className="input-box">
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseņa"
          maxLength={20}
          minLength={8}
          pattern="^[^\s]+$"
          title="La contraseņa no puede tener espacios"
          required
          onChange={handleChange}
          value={formData.confirmPassword}
        />
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}
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
