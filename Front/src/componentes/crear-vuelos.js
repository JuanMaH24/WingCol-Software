import React, { useState } from "react";
import LogoCompleto from "../imagenes/WingcolName.png";
import "../hojas-de-estilo/crear_vuelos.css";
import CurrencyInput from "react-currency-input-field";
import { Link, useNavigate, Navigate } from "react-router-dom";

export function CrearVuelos() {
  const [formData, setFormData] = useState({
    vueloNumero: "",
    tipoVuelo: "", // Nacional o Internacional
    selectedOrigen: "",
    selectedDestino: "",
  });
  const navigate = useNavigate();

  const distancias = {
    "Bogotá-Cali": 300,
    "Bogotá-Medellín": 230,
    "Bogotá-Cartagena": 650,
    "Bogotá-Madrid": 8000,
    "Bogotá-Miami": 2500,
    "Cali-Miami": 2700,
    // Añade más distancias según sea necesario
  };

  const averageSpeed = 850; // km/h

  const capitalesColombia = [
    { value: "Leticia", label: "Leticia (Amazonas)" },
    { value: "Medellín", label: "Medellín (Antioquia)" },
    { value: "Arauca", label: "Arauca (Arauca)" },
    { value: "Barranquilla", label: "Barranquilla (Atlántico)" },
    { value: "Cartagena", label: "Cartagena (Bolívar)" },
    { value: "Tunja", label: "Tunja (Boyacá)" },
    { value: "Manizales", label: "Manizales (Caldas)" },
    { value: "Florencia", label: "Florencia (Caquetá)" },
    { value: "Yopal", label: "Yopal (Casanare)" },
    { value: "Popayán", label: "Popayán (Cauca)" },
    { value: "Valledupar", label: "Valledupar (Cesar)" },
    { value: "Quibdó", label: "Quibdó (Chocó)" },
    { value: "Montería", label: "Montería (Córdoba)" },
    { value: "Bogotá", label: "Bogotá (Cundinamarca)" },
    { value: "Inírida", label: "Inírida (Guainía)" },
    {
      value: "San José del Guaviare",
      label: "San José del Guaviare (Guaviare)",
    },
    { value: "Neiva", label: "Neiva (Huila)" },
    { value: "Riohacha", label: "Riohacha (La Guajira)" },
    { value: "Santa Marta", label: "Santa Marta (Magdalena)" },
    { value: "Villavicencio", label: "Villavicencio (Meta)" },
    { value: "Pasto", label: "Pasto (Nariño)" },
    { value: "Cúcuta", label: "Cúcuta (Norte de Santander)" },
    { value: "Mocoa", label: "Mocoa (Putumayo)" },
    { value: "Armenia", label: "Armenia (Quindío)" },
    { value: "Pereira", label: "Pereira (Risaralda)" },
    { value: "San Andrés", label: "San Andrés (San Andrés y Providencia)" },
    { value: "Bucaramanga", label: "Bucaramanga (Santander)" },
    { value: "Sincelejo", label: "Sincelejo (Sucre)" },
    { value: "Ibagué", label: "Ibagué (Tolima)" },
    { value: "Cali", label: "Cali (Valle del Cauca)" },
    { value: "Mitú", label: "Mitú (Vaupés)" },
    { value: "Puerto Carreño", label: "Puerto Carreño (Vichada)" },
  ];

  const origenesInternacionales = [
    { value: "Cali", label: "Cali (Valle del Cauca)" },
    { value: "Pereira", label: "Pereira (Risaralda)" },
    { value: "Bogotá", label: "Bogotá (Cundinamarca)" },
    { value: "Medellín", label: "Medellín (Antioquia)" },
    { value: "Cartagena", label: "Cartagena (Bolívar)" },
  ];

  const destinosInternacionales = [
    { value: "Madrid", label: "Madrid (España)" },
    { value: "Londres", label: "Londres (Inglaterra)" },
    { value: "New York", label: "New York (Estados Unidos)" },
    { value: "Buenos Aires", label: "Buenos Aires (Argentina)" },
    { value: "Miami", label: "Miami (Estados Unidos)" },
  ];

  const handleTipoVueloChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      tipoVuelo: event.target.value,
      selectedOrigen: "", // Resetear la selección
      selectedDestino: "",
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOrigenChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      selectedOrigen: event.target.value,
    }));
  };

  const handleDestinoChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      selectedDestino: event.target.value,
    }));
  };

  // Obtener las opciones para el selector de origen
  const getOrigenOptions = () => {
    if (formData.tipoVuelo === "N") {
      return capitalesColombia;
    } else if (formData.tipoVuelo === "I") {
      return origenesInternacionales;
    }
    return [];
  };

  // Obtener las opciones para el selector de destino
  const getDestinoOptions = () => {
    if (formData.tipoVuelo === "N") {
      return capitalesColombia;
    } else if (formData.tipoVuelo === "I") {
      return destinosInternacionales;
    }
    return [];
  };

  // Función para calcular la duración del vuelo
  const calcularTiempoDeVuelo = () => {
    const origenDestino = `${formData.selectedOrigen}-${formData.selectedDestino}`;
    const distancia = distancias[origenDestino];
    if (!distancia) {
      return "Distancia no disponible";
    }

    const duracionVueloHoras = distancia / averageSpeed;
    const duracionVueloMinutos = duracionVueloHoras * 60;

    // Convertir a formato legible (HH:MM)
    const horas = Math.floor(duracionVueloHoras);
    const minutos = Math.round((duracionVueloHoras - horas) * 60);

    return `${horas} horas y ${minutos} minutos`;
  };

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres cancelar la creación del vuelo?"
    );
    if (isConfirmed) {
      console.log("creacion de vuelo cancelada");
      navigate("/home-cliente");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = new FormData();
    const apiHost = process.env.REACT_APP_API_HOST;
    const jwtToken = localStorage.getItem('access');

    // Agregamos los campos al FormData
    dataToSend.append("ciudad_origen", formData.selectedOrigen);
    dataToSend.append("ciudad_destino", formData.selectedDestino);
    dataToSend.append(
      "fecha_salida",
      `${formData.fechaSalida}T${formData.horaSalida}:00Z`
    );
    // dataToSend.append("fecha_llegada", "2024-10-14T15:00:00Z"); // Ajusta la fecha si es necesario
    dataToSend.append("precio", parseFloat(formData.precio)); // Convertimos a número decimal
    dataToSend.append("tipo", formData.tipoVuelo);
    dataToSend.append("estado", "P"); // Estado predeterminado

    // Si tienes una imagen, la puedes agregar usando el campo correspondiente
    // Supongamos que estás obteniendo la imagen de un campo en el formulario
    if (formData.flightPic) {
      dataToSend.append("flight_pic", formData.flightPic); // Añadimos la imagen al FormData
    } else {
      dataToSend.append("flight_pic", "imagen.jpg"); // Valor por defecto si no hay imagen
    }

    console.log(JSON.stringify(dataToSend))

    try {
      const response = await fetch(`${apiHost}/flight/create/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        console.log("Vuelo creado exitosamente");
        navigate("/home-cliente");
      } else {
        console.error("Error al crear el vuelo");
      }
    } catch (error) {
      console.error("Error al enviar la petición:", error);
    }
  };

  return (
    <form className="contenedor-principal-vuelos" onSubmit={handleSubmit}>
      <img src={LogoCompleto} alt="Logo de WingColombia" className="logo" />
      <h1>Crear vuelos</h1>

      <div className="selector-vuelo">
        <select
          name="tipoVuelo"
          value={formData.tipoVuelo}
          onChange={handleTipoVueloChange}
          required
        >
          <option value="" disabled>
            Seleccionar tipo de vuelo
          </option>
          <option value="N">Nacional</option>
          <option value="I">Internacional</option>
        </select>
      </div>
      <div className="selector-vuelo">
        <select
          name="selectedOrigen"
          value={formData.selectedOrigen}
          onChange={handleOrigenChange}
          required
        >
          <option value="" disabled>
            Seleccionar origen del vuelo
          </option>
          {getOrigenOptions().map((origen) => (
            <option key={origen.value} value={origen.value}>
              {origen.label}
            </option>
          ))}
        </select>
      </div>
      <div className="selector-vuelo">
        <select
          name="selectedDestino"
          value={formData.selectedDestino}
          onChange={handleDestinoChange}
          required
        >
          <option value="" disabled>
            Seleccionar destino del vuelo
          </option>
          {getDestinoOptions().map((destino) => (
            <option key={destino.value} value={destino.value}>
              {destino.label}
            </option>
          ))}
        </select>
      </div>
      <div className="input-vuelo">
        <input
          type="text"
          name="precio"
          placeholder="Precio tiquete"
          value={formData.precio}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-vuelo">
        <h3>Fecha de salida</h3>
        <input
          type="date"
          name="fechaSalida"
          value={formData.fechaSalida}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-vuelo">
        <h3>Hora de salida</h3>
        <input
          type="time"
          name="horaSalida"
          value={formData.horaSalida}
          onChange={handleChange}
          required
        />
      </div>

      <div className="boton-vuelo-container">
        <div className="boton-vuelo">
          <button type="submit">Crear vuelo</button>
        </div>
        <div className="boton-vuelo">
          <button type="button" onClick={() => navigate("/")}>
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
