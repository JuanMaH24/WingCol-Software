import React, { useState, useEffect } from "react";
import LogoCompleto from "../imagenes/WingcolName.png";
import "../hojas-de-estilo/crear_vuelos.css";
import CurrencyInput from "react-currency-input-field";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export function CrearVuelos() {
  const [formData, setFormData] = useState({
    tipoVuelo: "",
    selectedOrigen: "",
    selectedDestino: "",
    precio: "",
    fechaSalida: "",
    horaSalida: "",
    flightPic: null,
  });
  const [minDate, setMinDate] = useState("");
  const [minTime, setMinTime] = useState("");
  const navigate = useNavigate();
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const now = new Date();
    setMinDate(formatDate(now));
    updateMinTime(now);
  }, []);

  useEffect(() => {
    if (formData.fechaSalida === minDate) {
      updateMinTime(new Date());
    } else {
      setMinTime("00:00");
    }
  }, [formData.fechaSalida, formData.tipoVuelo, minDate]);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const updateMinTime = (now) => {
    const hoursToAdd = formData.tipoVuelo === "N" ? 1 : 3;
    now.setHours(now.getHours() + hoursToAdd);
    setMinTime(now.toTimeString().slice(0, 5));
  };

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

    if (name === "tipoVuelo" && formData.fechaSalida === minDate) {
      updateMinTime(new Date());
    }
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

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      flightPic: e.target.files[0],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiHost = process.env.REACT_APP_API_HOST;
    const jwtToken = localStorage.getItem("access");
    const dataToSend = new FormData();
    console.log(`${formData.fechaSalida}T${formData.horaSalida}:00Z`);

    // Agregamos los campos al FormData
    dataToSend.append("ciudad_origen", formData.selectedOrigen);
    dataToSend.append("ciudad_destino", formData.selectedDestino);
    dataToSend.append(
      "fecha_salida",
      `${formData.fechaSalida}T${formData.horaSalida}:00Z`
    );
    dataToSend.append("precio", formData.precio); // Convertimos a número decimal
    dataToSend.append("tipo", formData.tipoVuelo);
    dataToSend.append("estado", "P"); // Estado predeterminado
    // dataToSend.append("duracion", formData.duracion);

    // Si tienes una imagen, la puedes agregar usando el campo correspondiente
    // Supongamos que estás obteniendo la imagen de un campo en el formulario
    if (formData.flightPic) {
      dataToSend.append("vuelos_pic", formData.flightPic); // Añadimos la imagen al FormData
    }

    console.log(dataToSend);

    try {
      const response = await fetch(`${apiHost}/flight/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: dataToSend,
      });

      if (response.ok) {
        setAlertInfo({
          show: true,
          message: "Vuelo creado exitosamente",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/home-cliente");
        }, 2000);
      } else {
        const errorData = await response.json();
        setAlertInfo({
          show: true,
          message:
            errorData.message ||
            "Error al crear el vuelo. Por favor, intente de nuevo.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error al enviar la petición:", error);
      setAlertInfo({
        show: true,
        message: "Error de conexión. Por favor, intente de nuevo más tarde.",
        severity: "error",
      });
    }
  };

  return (
    <form className="contenedor-principal-vuelos" onSubmit={handleSubmit}>
      <img src={LogoCompleto} alt="Logo de WingCol" className="logo" />
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
          type="number"
          name="precio"
          placeholder="Precio COP"
          value={formData.precio}
          min={50000} 
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
          min={minDate}
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
          min={formData.fechaSalida === minDate ? minTime : undefined}
          onChange={handleChange}
          required
        />
      </div>

      {alertInfo.show && (
        <Stack sx={{ width: "100%", marginBottom: 2 }} spacing={2}>
          <Alert
            severity={alertInfo.severity}
            onClose={() => setAlertInfo({ ...alertInfo, show: false })}
          >
            {alertInfo.message}
          </Alert>
        </Stack>
      )}

      <div className="foto-de-perfil">
        <label htmlFor="file" style={{ color: "white" }}>
          Elija una imagen de vuelo{" "}
        </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="boton-vuelo-container">
        <div className="boton-vuelo">
          <button type="submit">Crear vuelo</button>
        </div>
        <div className="boton-vuelo">
          <button type="button" onClick={() => navigate("/home-cliente")}>
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
