import React, { useState, useMemo } from "react";
import { RowRadioButtonsGroup } from "./Botones-buscador";
import "../hojas-de-estilo/buscador.css";
import { useNavigate } from "react-router-dom";
import { BarraDePrecios } from "./barra-de-precios";
import { BarraDeDuracion } from "./barra-duracion";

// Datos de vuelos simulados
const flightData = [
  {
    ciudad_origen: "Bogotá",
    ciudad_destino: "Medellín",
    fecha_salida: "2024-12-01",
    hora_salida: "10:00",
    precio: 150000,
    duracion: 1,
  },
  {
    ciudad_origen: "Bogotá",
    ciudad_destino: "Cartagena",
    fecha_salida: "2024-12-02",
    hora_salida: "15:00",
    precio: 300000,
    duracion: 2,
  },
];

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

const destinosInternacionales = [
  { value: "Madrid", label: "Madrid (España)" },
  { value: "Londres", label: "Londres (Inglaterra)" },
  { value: "New York", label: "New York (Estados Unidos)" },
  { value: "Buenos Aires", label: "Buenos Aires (Argentina)" },
  { value: "Miami", label: "Miami (Estados Unidos)" },
];

const origenesInternacionales = [
  { value: "Cali", label: "Cali (Valle del Cauca)" },
  { value: "Pereira", label: "Pereira (Risaralda)" },
  { value: "Bogotá", label: "Bogotá (Cundinamarca)" },
  { value: "Medellín", label: "Medellín (Antioquia)" },
  { value: "Cartagena", label: "Cartagena (Bolívar)" },
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

export function Buscador() {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [precioMin, setPrecioMin] = useState(100000);
  const [precioMax, setPrecioMax] = useState(1000000);
  const [duracion, setDuracion] = useState(0);
  const navigate = useNavigate();

  const availableDestinos = useMemo(() => {
    if (!origen) return Destinos;

    // If origin is an international departure city
    if (origenesInternacionales.some((city) => city.value === origen)) {
      // Combine both international and national destinations, excluding the origin
      return [
        ...destinosInternacionales,
        ...Destinos.filter((ciudad) => ciudad.value !== origen),
      ];
    }

    // Filter out the origin from possible destinations
    return Destinos.filter((ciudad) => ciudad.value !== origen);
  }, [origen]);

  const handleOrigenChange = (event) => {
    const selectedOrigen = event.target.value;
    setOrigen(selectedOrigen);

    // Reset destination if it's no longer valid
    if (destino === selectedOrigen) {
      setDestino("");
    }
  };

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

  const handleHoraSalida = (event) => {
    setHoraSalida(event.target.value);
  };

  const handleBuscarClick = () => {
    const vuelosFiltrados = flightData.filter(
      (vuelo) =>
        (!origen || vuelo.ciudad_origen === origen) &&
        (!destino || vuelo.ciudad_destino === destino) &&
        (!fechaSalida || vuelo.fecha_salida === fechaSalida) &&
        (!horaSalida || vuelo.hora_salida === horaSalida) &&
        vuelo.precio >= precioMin &&
        vuelo.precio <= precioMax &&
        (!duracion || vuelo.duracion <= duracion)
    );

    navigate("/resultados", { state: { vuelos: vuelosFiltrados } });
  };

  return (
    <div className="Contenedor-buscador">
      <div className="fila-superior">
        <div className="Contenedor-filtros">
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
          <h3 style={{ color: "black" }}>Hora de salida</h3>
          <input
            type="time"
            name="horaSalida"
            onChange={handleHoraSalida}
            value={horaSalida}
          />
        </div>
      </div>
      <div className="Boton-buscar">
        <button onClick={handleBuscarClick}>Buscar</button>
      </div>
    </div>
  );
}
