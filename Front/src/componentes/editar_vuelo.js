import React, { useState, useEffect } from "react";
import LogoCompleto from "../imagenes/WingcolName.png";
import "../hojas-de-estilo/editar-vuelo.css";
import CurrencyInput from "react-currency-input-field";
import { Link, useNavigate, Navigate, useParams } from "react-router-dom";

export function EditarVuelo() {
  const apiHost = process.env.REACT_APP_API_HOST;
  const [formData, setFormData] = useState({
    vueloNumero: "",
    tipoVuelo: "", // Nacional o Internacional
    selectedOrigen: "",
    selectedDestino: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const jwtToken = localStorage.getItem("access");
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

  useEffect(() => {
    // Simulación de una llamada a la API para obtener los datos del vuelo
    const obtenerDatosVuelo = async () => {
      try {
        const params = new URLSearchParams({id_vuelo: id});
        const response = await fetch(
          `${apiHost}/flight/get/?${params.toString()}`,
          {
            headers: {
              "Authorization": `Bearer ${jwtToken}`
            }
          }
        ); // Reemplaza con la URL real de la API
        const data = await response.json();
        console.log(data);
        setFormData({
          estado: data.estado,
          tipoVuelo: data.tipo,
          selectedOrigen: data.ciudad_origen,
          selectedDestino: data.ciudad_destino,
          fechaSalida: data.fecha_salida.split("T")[0], // Para separar la fecha y hora
          horaSalida: data.fecha_salida.split("T")[1].slice(0, 5),
          duracion: data.duracion,
          precio: data.precio,
          idVuelo: data.id_vuelo
        });
      } catch (error) {
        console.error("Error al obtener los datos del vuelo:", error);
      }
    };

    obtenerDatosVuelo();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSend = new FormData();

    dataToSend.append("estado", formData.estado);
    dataToSend.append("tipo", formData.tipoVuelo);
    dataToSend.append("ciudad_origen", formData.selectedOrigen);
    dataToSend.append("ciudad_destino", formData.selectedDestino);
    dataToSend.append(
      "fecha_salida",
      `${formData.fechaSalida}T${formData.horaSalida}:00Z`
    );
    dataToSend.append("id", formData.idVuelo);
    dataToSend.append("precio", formData.precio);

    try {
      const params = new URLSearchParams({id_vuelo: id});
      const respuesta = await fetch(`${apiHost}/flight/update/?${params.toString()}`, {
        method: "PUT", // Método de actualización
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
        },
        body: dataToSend,
      });

      if (respuesta.ok) {
        navigate("/home-cliente"); // Redirigir al usuario a /home-cliente si la actualización fue exitosa
      } else {
        console.error("Error al editar el vuelo.");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const handleTipoVueloChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      tipoVuelo: event.target.value,
      selectedOrigen: "", // Resetear la selección
      selectedDestino: "",
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

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres cancelar el vuelo? Esta acción no se puede deshacer."
    );
    if (isConfirmed) {
      try {
        const response = await fetch(
          `${apiHost}/flight/delete/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwtToken}`,
              // Asegúrate de incluir el token de autenticación si es necesario
              // "Authorization": "Bearer " + yourAuthToken
            },
            body: JSON.stringify({id_vuelo: id}),
          }
        );

        if (response.ok) {
          alert("El vuelo ha sido cancelado exitosamente.");
          navigate("/home-cliente");
        } else {
          const errorData = await response.json();
          alert(
            "Error al cancelar vuelo: " +
              (errorData.message || "Por favor, intenta de nuevo más tarde.")
          );
        }
      } catch (error) {
        console.error("Error al cancelar vuelo:", error);
        alert(
          "Hubo un problema al intentar cancelar el vuelo. Por favor, intenta de nuevo más tarde."
        );
      }
    }
  };

  return (
    <form className="contenedor-principal-vuelos" onSubmit={handleSubmit}>
      <img src={LogoCompleto} alt="Logo de WingColombia" className="logo" />
      <h1>Editar vuelo</h1>

      {/* <div className="input-vuelo">
        <input
          type="text"
          name="vueloNumero"
          value={formData.vueloNumero}
          onChange={handleInputChange}
          placeholder="Número de vuelo"
          maxLength={10}
          required
        />
      </div> */}

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
          {formData.tipoVuelo === "N"
            ? getOrigenOptions().map((origen) => (
                <option key={origen.value} value={origen.value}>
                  {origen.label}
                </option>
              ))
            : origenesInternacionales.map((origen) => (
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
          {formData.tipoVuelo === "N"
            ? getDestinoOptions().map((destino) => (
                <option key={destino.value} value={destino.value}>
                  {destino.label}
                </option>
              ))
            : destinosInternacionales.map((destino) => (
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
          value={formData.precio}
          onChange={handleInputChange}
          placeholder="Precio tiquete"
          required
        />
      </div>


      <div className="input-vuelo">
        <h3>Fecha de salida</h3>
        <input
          type="date"
          name="fechaSalida"
          value={formData.fechaSalida}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="input-vuelo">
        <h3>Hora de salida</h3>
        <input
          type="time"
          name="horaSalida"
          value={formData.horaSalida}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="input-vuelo">
        <h3>Tiempo de vuelo (min)</h3>
        <input
          type="number"
          name="duracion"
          value={formData.duracion}
          min={0}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="boton-vuelo-container">
        <div className="boton-vuelo">
          <button type="submit">Guardar cambios</button>
        </div>
      </div>
      <div className="Boton-cancelar-vuelo">
        <button type="button" onClick={handleDelete}>
          Cancelar vuelo
        </button>
      </div>
    </form>
  );
}
