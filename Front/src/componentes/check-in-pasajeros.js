import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getUser } from "../services/jwt-decode";
import "../hojas-de-estilo/check-in-pasajeros.css";

export function CheckInPasajeros() {
  const apiHost = process.env.REACT_APP_API_HOST;
  const jwtToken = localStorage.getItem("access");
  const { id_item } = useParams();
  const user = getUser();
  const [documentPattern, setDocumentPattern] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const { itemIndex } = state || {};

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
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    flightId: "",
    phoneNumber: "",
    contactPhoneNumber: "",
    contactName: "",
    gender: "",
    email: "",
    birthDate: "",
    documentType: "",
    documentNumber: "",
    seatClass: "",
    typeEquipement: "",
  });

  useEffect(() => {
    validateForm();
  }, [formData]);

  useEffect(() => {
    // Aquí deberías hacer una llamada al backend para obtener los datos del usuario
    async function fetchItemData() {
      try {
        const params = new URLSearchParams({ id_item: id_item });
        const response = await fetch(
          `${apiHost}/cart/item/?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        const itemData = await response.json();
        setFormData({
          primerNombre: itemData.nombre_viajero || "",
          segundoNombre: itemData.segundo_nombre_viajero || "",
          flightId: itemData.id_vuelo || "",
          primerApellido: itemData.apellido_viajero || "",
          segundoApellido: itemData.segundo_apellido_viajero || "",
          phoneNumber: itemData.telefono_viajero || "",
          contactPhoneNumber: itemData.telefono_contacto || "",
          contactName: itemData.nombre_contacto || "",
          gender: itemData.genero_viajero || "",
          email: "",
          birthDate: itemData.fecha_nacimiento_viajero || "",
          documentType: itemData.tipo_documento_viajero || "",
          documentNumber: itemData.id_viajero || "",
          seatClass: itemData.clase || "",
          typeEquipement: itemData.tipo_equipaje || "",
        });
      } catch (error) {
        console.error("Error al cargar el perfil", error);
      }
    }

    fetchItemData();
  }, []);

  const validateForm = () => {
    const newErrors = { ...errors };
    // Validaciones simplificadas
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhoneNumberChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      phoneNumber: value,
    }));
  };

  const handleContactPhoneNumberChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      contactPhoneNumber: value,
    }));
  };

  const handleDocumentTypeChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      documentType: value,
      documentNumber: "",
    }));
    setDocumentPattern(
      value === "CC"
        ? "^[0-9]+$"
        : value === "PA"
        ? "^[A-Za-z]{3}[0-9]{6}$"
        : ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload according to the specified JSON structure
    const payload = {
      id: id_item,
      user_id: user.user_id,
      id_vuelo: formData.flightId,
      nombre_viajero: formData.primerNombre,
      segundo_nombre_viajero: formData.segundoNombre || "",
      id_viajero: parseInt(formData.documentNumber),
      apellido_viajero: formData.primerApellido,
      segundo_apellido_viajero: formData.segundoApellido || "",
      tipo_documento_viajero: formData.documentType,
      fecha_nacimiento_viajero: formData.birthDate,
      genero_viajero: formData.gender,
      telefono_viajero: formData.phoneNumber.replace(/\D/g, ""), // Remove non-digit characters
      nombre_contacto: formData.contactName,
      telefono_contacto: formData.contactPhoneNumber.replace(/\D/g, ""), // Remove non-digit characters
      clase: formData.seatClass,
      tipo_equipaje: formData.typeEquipement,
    };

    try {
      //checkin/identify/
      const response = await fetch(`${apiHost}/cart/item/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers like authorization if needed
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      // Navigate to cart or next page
      navigate("/carrito");
    } catch (error) {
      console.error("Error updating passenger registration:", error);
      // Handle error (show error message to user)
      setWarningMessage(
        "Error al actualizar el registro. Por favor, inténtelo de nuevo."
      );
    }
  };

  const handleCarrito = (e) => {
    e.preventDefault();
    navigate("/carrito");
  };

  return (
    <form className="contenedor-principal-pasajeros" onSubmit={handleSubmit}>
      <h1>Registro de pasajeros</h1>

      <div className="campo-primer-nombre">
        <input
          type="text"
          name="primerNombre"
          placeholder="Primer nombre"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$"
          required
          maxLength={50}
          onChange={handleChange}
          value={formData.primerNombre}
        />
      </div>

      <div className="campo-segundo-nombre">
        <input
          type="text"
          name="segundoNombre"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$"
          placeholder="Segundo nombre"
          maxLength={50}
          onChange={handleChange}
          value={formData.segundoNombre}
        />
      </div>

      <div className="campo-primer-apellido">
        <input
          type="text"
          name="primerApellido"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$"
          placeholder="Primer apellido"
          required
          maxLength={50}
          onChange={handleChange}
          value={formData.primerApellido}
        />
      </div>

      <div className="campo-segundo-apellido">
        <input
          type="text"
          name="segundoApellido"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$"
          placeholder="Segundo apellido"
          maxLength={50}
          onChange={handleChange}
          value={formData.segundoApellido}
        />
        {errors.Apellidos && (
          <p className="error-message">{errors.Apellidos}</p>
        )}
      </div>

      <div className="campo-telefono">
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          placeholder="Número de teléfono"
          required
          value={formData.phoneNumber}
          onChange={handlePhoneNumberChange}
        />
      </div>

      <div className="campo-telefono-contacto">
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          placeholder="Número de contacto"
          required
          value={formData.contactPhoneNumber}
          onChange={(value) =>
            handleContactPhoneNumberChange(value, "contactPhoneNumber")
          }
        />
      </div>

      <div className="campo-nombre-contacto">
        <input
          type="text"
          name="contactName"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚüÜņŅ][a-zA-ZáéíóúÁÉÍÓÚüÜņŅ]*$"
          placeholder="Nombre de contacto"
          required
          maxLength={50}
          onChange={handleChange}
          value={formData.contactName}
        />
      </div>

      <div className="campo-genero">
        <select
          name="gender"
          required
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Género</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="N">Prefiero no decirlo</option>
          <option value="O">Otro</option>
        </select>
      </div>

      <div className="campo-correo">
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

      <div className="campo-fecha-nacimiento">
        <input
          type="date"
          name="birthDate"
          min="1940-01-01"
          max="2024-12-31"
          required
          onChange={handleChange}
          value={formData.birthDate}
        />
        {warningMessage && <p className="warning-message">{warningMessage}</p>}
      </div>

      <div className="campo-tipo-documento">
        <select
          name="documentType"
          required
          value={formData.documentType}
          onChange={handleDocumentTypeChange}
        >
          <option value="">Tipo de documento</option>
          <option value="CC">Cédula</option>
          <option value="CE">C. Extranjería</option>
          <option value="PA">Pasaporte</option>
        </select>
      </div>

      <div className="campo-numero-documento">
        <input
          type="text"
          name="documentNumber"
          placeholder="Número de documento"
          required
          pattern={documentPattern}
          maxLength={20}
          onChange={handleChange}
          value={formData.documentNumber}
        />
        {errors.documentNumber && (
          <p className="error-message">{errors.documentNumber}</p>
        )}
      </div>

      <div className="botones-formulario">
        <button type="submit" className="boton-aceptar">
          Aceptar
        </button>
        <button onClick={handleCarrito} className="boton-volver">
          Volver
        </button>
      </div>
    </form>
  );
}
