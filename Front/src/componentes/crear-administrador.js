import React, { useState, useEffect } from "react";
import "../hojas-de-estilo/registro.css";
import logocompleto from "../imagenes/WingcolName.png";
import Select from "react-select";
import { getNames, getCode } from "country-list";
import { Link, useNavigate, Navigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import LocationSelector from "./ciudades";

export function CrearAdministrador() {
  const apiHost = process.env.REACT_APP_API_HOST;
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
  const jwtToken = localStorage.getItem("access");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const countryOptions = getNames().map((country) => ({
    value: getCode(country),
    label: country, // Muestra el nombre del país y su código
  }));
  const [documentPattern, setDocumentPattern] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    secondName: "",
    lastName: "",
    email: "",
    documentNumber: "",
    password: "",
    confirmPassword: "",
    secondLastName: "",
  });

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
      newErrors.firstName = (
        <span style={{ fontSize: "12px", color: "white" }}>
          El nombre no puede contener espacios, números o caracteres especiales
        </span>
      );
    } else {
      newErrors.firstName = "";
    }

    if (
      formData.secondName &&
      !/^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$/.test(formData.secondName)
    ) {
      newErrors.secondName = (
        <span style={{ fontSize: "12px", color: "white" }}>
          El nombre no puede contener espacios, números o caracteres especiales
        </span>
      );
    } else {
      newErrors.secondName = "";
    }

    // Validate lastName
    if (
      formData.lastName &&
      !/^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$/.test(formData.lastName) // Eliminamos '\s' para no aceptar espacios
    ) {
      newErrors.lastName = (
        <span style={{ fontSize: "12px", color: "white" }}>
          El apellido no puede contener espacios, números o caracteres
          especiales
        </span>
      );
    } else {
      newErrors.lastName = "";
    }

    if (
      formData.secondLastName &&
      !/^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$/.test(formData.secondLastName) // Eliminamos '\s' para no aceptar espacios
    ) {
      newErrors.secondLastName = (
        <span style={{ fontSize: "12px", color: "white" }}>
          El apellido no puede contener espacios, números o caracteres
          especiales
        </span>
      );
    } else {
      newErrors.secondLastName = "";
    }

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

    // Validate password
    if (formData.password && formData.password.length < 8) {
      newErrors.password = (
        <span style={{ fontSize: "12px", color: "white" }}>
          La contraseņa debe tener al menos 8 caracteres
        </span>
      );
    } else if (formData.password && /\s/.test(formData.password)) {
      newErrors.password = (
        <span style={{ fontSize: "12px", color: "white" }}>
          La contraseņa no puede contener espacios en blanco
        </span>
      );
    } else {
      newErrors.password = "";
    }

    // Validate confirmPassword
    if (
      formData.confirmPassword &&
      formData.confirmPassword !== formData.password
    ) {
      newErrors.confirmPassword = (
        <span style={{ fontSize: "12px", color: "white" }}>
          Las contraseņas no coinciden
        </span>
      );
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
  const handleLocationChange = (locationType, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [locationType]: value,
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
    dataToSend.append("pais", formData.country);
    dataToSend.append("departamento", formData.state);
    dataToSend.append("ciudad", formData.city);

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
    <form className="registro-principal" onSubmit={handleSubmit}>
      <img className="logo-completo" src={logocompleto} alt="Logo" />
      <h1>Crear administrador</h1>

      <div className="input-box">
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
        {errors.firstName && (
          <p className="error-message">{errors.firstName}</p>
        )}
      </div>

      <div className="input-box">
        <input
          type="text"
          name="secondName"
          placeholder="Segundo nombre"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ][a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$"
          title="El campo no puede tener espacios o números"
          maxLength={50}
          onChange={handleChange}
        />
        {errors.secondName && (
          <p className="error-message">{errors.secondName}</p>
        )}
      </div>

      <div className="input-box">
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
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}
      </div>

      <div className="input-box">
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
        {errors.secondLastName && (
          <p className="error-message">{errors.secondLastName}</p>
        )}
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

      {/* <div className="input-box">
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
      </div> */}

      {/* <div className="input-box">
        <input
          className="fecha-nacimiento"
          type="date"
          name="birthDate"
          min={"1940-01-01"}
          max={"2006-12-31"}
          required
          onChange={handleChange}
        />
      </div> */}

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
        {errors.password && <p className="error-message">{errors.password}</p>}
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
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}
      </div>

      <LocationSelector onLocationChange={handleLocationChange} />

      <div className="error-admin">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      <div className="boton-registro">
        <button type="submit">Crear administrador</button>
      </div>
      <div className="boton-vuelo">
        <button type="button" onClick={() => navigate("/home-root")}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
