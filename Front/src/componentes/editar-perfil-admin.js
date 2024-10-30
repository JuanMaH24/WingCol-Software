import React, { useState, useEffect } from "react";
import "../hojas-de-estilo/registro.css";
import logocompleto from "../imagenes/WingcolName.png";
import Select from "react-select";
import { getNames, getCode } from "country-list";
import { Link, useNavigate, Navigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import { getUser } from "../services/jwt-decode";
import "react-phone-number-input/style.css";
import LocationSelector from "./ciudades";

export function EditarPerfilAdmin() {
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

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [documentPattern, setDocumentPattern] = useState("");
  const currentUser = getUser();
  const jwtToken = localStorage.getItem('access');
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Cargar datos del perfil del usuario al cargar el componente
  useEffect(() => {
    // Aquí deberías hacer una llamada al backend para obtener los datos del usuario
    async function fetchProfileData() {
      try {
        const params = new URLSearchParams({user_id: currentUser.user_id});
        const response = await fetch(
          `${apiHost}/users/admin/?${params.toString()}`,
          {
            headers: {
              "Authorization": `Bearer ${jwtToken}`
            }
          }
        );
        const userData = await response.json();
        console.log(userData);
        console.log("pais:", userData.pais);
        // Rellenar los campos con los datos actuales del usuario
        setFormData({
          firstName: String(userData.nombre) || "",
          secondName: userData.segundo_nombre || "",
          lastName: userData.apellido || "",
          secondLastName: userData.segundo_apellido || "",
          phoneNumber: String(userData.telefono) || "",
          gender: userData.genero || "",
          email: userData.email || "",
          documentType: userData.tipo_documento || "",
          documentNumber: userData.user_id || "",
          address: userData.direccion || "",
          billingAddress: userData.direccion_facturacion || "",
          birthDate: userData.fecha_nacimiento || "",
          selectedCountry: userData.pais
            ? { value: getCode(userData.pais), label: userData.pais }
            : null,
          profilePicture: null, // Este campo lo manejará el usuario si sube una nueva imagen
        });
      } catch (error) {
        console.error("Error al cargar el perfil", error);
      }
    }

    fetchProfileData();
  }, []);

  const countryOptions = getNames().map((country) => ({
    value: getCode(country),
    label: country,
  }));

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

    if (value === "CC") {
      setDocumentPattern("^[0-9]+$");
    } else if (value === "pasaporte") {
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

  const handleCheckboxChange = (e) => {
    setShowPasswordFields(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    setErrorMessage("");

    // Utilizamos FormData para enviar archivos (la foto de perfil)
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
    dataToSend.append("pais", formData.country);
    dataToSend.append("departamento", formData.state);
    dataToSend.append("ciudad", formData.city);

    // Solo enviar la contraseña si el usuario la cambió
    if (formData.password) {
      dataToSend.append("password", formData.password);
    }

    // Incluir la foto de perfil solo si se ha subido una nueva
    if (formData.profilePicture) {
      dataToSend.append("user_pic", formData.profilePicture);
    }

    try {
      const response = await fetch(
        `${apiHost}/users/admin/update/`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${jwtToken}`
          },
          body: dataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(
          errorData.nombre ||
            errorData.user_id ||
            errorData.email ||
            "Error al actualizar el perfil."
        );
        return;
      } else {
        navigate("/", {
          state: { successMessage: "Perfil actualizado correctamente." },
        });
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Hubo un problema con la actualización. Intenta más tarde."
      );
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
    );
    if (isConfirmed) {
      try {
        const response = await fetch(
          `${apiHost}/users/admin/delete/`,
          {
            method: "PUT", //
            headers: {
              "Content-Type": "application/json",
              // Asegúrate de incluir el token de autenticación si es necesario
              // "Authorization": "Bearer " + yourAuthToken
            },
            body: JSON.stringify({ action: "delete_account" }), // Incluye el cuerpo si el backend espera algún dato
          }
        );

        if (response.ok) {
          alert("Tu cuenta ha sido eliminada exitosamente.");
          navigate("/inicio-de-sesion");
        } else {
          const errorData = await response.json();
          alert(
            "Error al eliminar la cuenta: " +
              (errorData.message || "Por favor, intenta de nuevo más tarde.")
          );
        }
      } catch (error) {
        console.error("Error al eliminar la cuenta:", error);
        alert(
          "Hubo un problema al intentar eliminar tu cuenta. Por favor, intenta de nuevo más tarde."
        );
      }
    }
  };

  return (
    <form className="registro-principal" onSubmit={handleSubmit}>
      <img className="logo-completo" src={logocompleto} alt="Logo" />
      <h1>Editar perfil administrador</h1>

      <div className="input-box">
        <input
          type="text"
          name="firstName"
          placeholder="Primer nombre"
          value={formData.firstName}
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ][a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$"
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
          value={formData.secondName}
          placeholder="Segundo nombre"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ][a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$"
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
          value={formData.lastName}
          maxLength={50}
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ][a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$"
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
          value={formData.secondLastName}
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ][a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$"
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
        value={formData.gender}
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
          value={formData.email}
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
        value={formData.documentType}
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
          value={formData.documentNumber}
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
      
      {showPasswordFields && (
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
      )}

      {showPasswordFields && (
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
      )}

      <div class="form-check">
        <input class="form-check-input" 
        checked={showPasswordFields}
        onChange={handleCheckboxChange} 
        type="radio" 
        name="flexRadioDefault" 
        id="flexRadioDefault1"/>
        <label class="form-check-label" for="flexRadioDefault1">
          Cambiar contraseña
        </label>
      </div>

      <div className="error">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      <div className="foto-de-perfil">
        <label htmlFor="file">Elija una imagen de perfil </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="boton-registro">
        <button type="submit">Guardar cambios</button>
      </div>
      <div className="boton-eliminar">
        <button type="button" onClick={handleDelete}>
          Eliminar cuenta
        </button>
      </div>
    </form>
  );
}
