import React, { useState, useMemo } from "react";
import { RowRadioButtonsGroup } from "./Botones-buscador";
import "../hojas-de-estilo/buscador.css";
import { useNavigate } from "react-router-dom";
import { BarraDePrecios } from "./barra-de-precios";
import { BarraDeDuracion } from "./barra-duracion";

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
  { value: "Bueno s Aires", label: "Buenos Aires (Argentina)" },
  { value: "Miami", label: "Miami (Estados Unidos)" },
];

export function Buscador() {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [resultados, setResultados] = useState([]);
  const [fechaSalida, setFechaSalida] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [precioMin, setPrecioMin] = useState(100000);
  const [precioMax, setPrecioMax] = useState(1000000);
  const [duracion, setDuracion] = useState(0);
  const navigate = useNavigate();
  const apiHost = process.env.REACT_APP_API_HOST;

  const availableDestinos = useMemo(() => {
    if (!origen) return Destinos;

    if (origenesInternacionales.some((city) => city.value === origen)) {
      return [
        ...destinosInternacionales,
        ...Destinos.filter((ciudad) => ciudad.value !== origen),
      ];
    }

    return Destinos.filter((ciudad) => ciudad.value !== origen);
  }, [origen]);

  const handleOrigenChange = (event) => {
    const selectedOrigen = event.target.value;
    setOrigen(selectedOrigen);

    if (destino === selectedOrigen) {
      setDestino("");
    }
  };

  // Maneja el cambio de selección de destino
  const handleDestinoChange = (event) => {
    const selectedDestino = event.target.value;

    // Check international destination restrictions
    if (
      destinosInternacionales.some((city) => city.value === selectedDestino)
    ) {
      const validInternationalOrigins = origenesInternacionales.map(
        (city) => city.value
      );
      if (!validInternationalOrigins.includes(origen)) {
        alert(
          "Solo puedes viajar a destinos internacionales desde Cali, Pereira, Bogotá, Medellín o Cartagena"
        );
        return;
      }
    }

    setDestino(selectedDestino);
  };

  const handleFechaSalida = (event) => {
    setFechaSalida(event.target.value);
  };

  const handleBuscarClick = async () => {
    try {
      const params = new URLSearchParams({
        ciudad_origen: origen,
        ciudad_destino: destino,
        fecha_salida: fechaSalida,
        hora_salida: horaSalida,
        precio_min: precioMin,
        precio_max: precioMax,
        duracion: duracion,
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
      <div className="fila-superior">
        <div className="Contenedor-filtros">
          {/* Selector de Origen */}
          <select
            value={origen}
            onChange={handleOrigenChange}
            style={{
              color: "black",
              borderColor: "black",
              width: "60%",
            }}
          >
            <option value="">Selecciona un origen</option>
            {Origen.map((ciudad) => (
              <option key={ciudad.value} value={ciudad.value}>
                {ciudad.label}
              </option>
            ))}
          </select>

          <select
            value={destino}
            onChange={handleDestinoChange}
            style={{ color: "black", borderColor: "black", width: "60%" }}
          >
            <option value="">Selecciona un destino</option>
            {availableDestinos.map((ciudad) => (
              <option key={ciudad.value} value={ciudad.value}>
                {ciudad.label}
              </option>
            ))}
          </select>
          <div className="fechas" style={{ width: "58%" }}>
            <label>Fecha de ida:</label>
            <input
              type="date"
              id="fechaSalida"
              name="fechaSalida"
              onChange={handleFechaSalida}
              value={fechaSalida}
            />
          </div>
        </div>
      </div>
      <div className="fila-inferior">
        <div
          className="precio"
          style={{ width: "5%", paddingRight: "30px", marginBottom: "-20px" }}
        >
          <label>Precio:</label>
          <BarraDePrecios
            onPrecioMinChange={setPrecioMin}
            onPrecioMaxChange={setPrecioMax}
          />
        </div>
        <div className="duracion" style={{ width: "5%", paddingRight: "30px" }}>
          <label>Duración:</label>
          <BarraDeDuracion onDuracionChange={setDuracion} />
        </div>
        <div
          className="input-vuelo"
          style={{ paddingBottom: "10px", width: "30px" }}
        >
          <h3 style={{ color: "black", fontWeight: "bold" }}>Hora de salida</h3>
          <input type="time" name="horaSalida" />
        </div>
      </div>
      <div className="Boton-buscar">
        <button onClick={handleBuscarClick}>Buscar</button>
      </div>
    </div>
  );
}
