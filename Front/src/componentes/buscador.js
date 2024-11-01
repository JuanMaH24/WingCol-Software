import React, { useState } from "react";
import { RowRadioButtonsGroup } from "./Botones-buscador";
import "../hojas-de-estilo/buscador.css";
import { useNavigate } from "react-router-dom";

const Origen = [
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

const Destinos = [
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
  { value: "Madrid", label: "Madrid (España)" },
  { value: "Londres", label: "Londres (Inglaterra)" },
  { value: "New York", label: "New York (Estados Unidos)" },
  { value: "Buenos Aires", label: "Buenos Aires (Argentina)" },
  { value: "Miami", label: "Miami (Estados Unidos)" },
];

export function Buscador() {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [resultados, setResultados] = useState([]);
  const [fechaSalida, setFechaSalida] = useState("");
  const navigate = useNavigate();
  const apiHost = process.env.REACT_APP_API_HOST;

  // Maneja el cambio de selección de origen
  const handleOrigenChange = (event) => {
    setOrigen(event.target.value);
  };

  // Maneja el cambio de selección de destino
  const handleDestinoChange = (event) => {
    setDestino(event.target.value);
  };
  
  const handleBuscarClick = async () => {
    try {
      const params = new URLSearchParams({
        ciudad_origen: origen,
        ciudad_destino: destino,
        fecha_salida: fechaSalida,
      });
      const response = await fetch(
        `${apiHost}/flight/search/?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener los vuelos");
      }
      const vuelosFiltrados = await response.json();
      console.log(vuelosFiltrados);
      // Redirigir a la página de resultados con los vuelos obtenidos
      navigate("/resultados", { state: { vuelos: vuelosFiltrados } });
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <div className="Contenedor-buscador">
      <div className="Contenedor-filtros">
        {/* Selector de Origen */}
        <select value={origen} onChange={handleOrigenChange}>
          <option value="">Selecciona un origen</option>
          {Origen.map((ciudad) => (
            <option key={ciudad.value} value={ciudad.value}>
              {ciudad.label}
            </option>
          ))}
        </select>

        {/* Selector de Destino */}
        <select value={destino} onChange={handleDestinoChange}>
          <option value="">Selecciona un destino</option>
          {Destinos.map((ciudad) => (
            <option key={ciudad.value} value={ciudad.value}>
              {ciudad.label}
            </option>
          ))}
        </select>
        <div className="fechas">
          <label>Fecha de ida:</label>
          <input type="date" id="fecha-ida" name="fecha-ida" />
        </div>
      </div>
      <div className="Boton-buscar">
        <button onClick={handleBuscarClick}>Buscar</button>
      </div>
    </div>
  );
}
