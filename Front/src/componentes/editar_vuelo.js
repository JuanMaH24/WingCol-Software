import React, { useState } from "react";
import LogoCompleto from "../imagenes/WingcolName.png";
import "../hojas-de-estilo/editar-vuelo.css";
import CurrencyInput from "react-currency-input-field";
import { Link, useNavigate, Navigate } from "react-router-dom";

export function EditarVuelo() {
  const [formData, setFormData] = useState({
    vueloNumero: "",
    tipoVuelo: "", // Nacional o Internacional
    selectedOrigen: "",
    selectedDestino: "",
  });
  const navigate = useNavigate();

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

  const handleDelete = () => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres guardar los cambios realizados?"
    );
    if (isConfirmed) {
      console.log("cambios guardados");
      navigate("/home-cliente");
    }
  };

  return (
    <form className="contenedor-principal-vuelos">
      <img src={LogoCompleto} alt="Logo de WingColombia" className="logo" />
      <h1>Editar vuelos</h1>
      <div className="input-vuelo">
        <input
          type="text"
          name="numero-de-vuelo"
          placeholder="Número de vuelo"
          maxLength={10}
          required
        />
      </div>
      <div className="selector-vuelo">
        <select
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
        <h3>Fecha de salida</h3>
        <input
          type="date"
          name="fecha-de-salida"
          min={"2024-10-3"}
          max={"2026-12-31"}
          required
        />
      </div>

      <div className="input-vuelo">
        <h3>Hora de salida</h3>
        <input type="time" name="hora-de-salida" required />
      </div>
      <div className="input-vuelo">
        <input type="text" placeholder="Precio tiquete" required />
      </div>
      <div className="boton-vuelo-container">
        <div className="boton-vuelo">
          <button type="submit">Guardar cambios</button>
        </div>
        <div className="boton-vuelo">
          <button type="submit" onClick={handleDelete}>
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
