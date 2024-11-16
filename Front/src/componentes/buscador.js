import React, { useState } from "react";
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
  { value: "Bogotá", label: "Bogotá (Cundinamarca)" },
  { value: "Medellín", label: "Medellín (Antioquia)" },
  { value: "Cartagena", label: "Cartagena (Bolívar)" },
];

const Destinos = [
  { value: "Medellín", label: "Medellín (Antioquia)" },
  { value: "Cartagena", label: "Cartagena (Bolívar)" },
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

  const handleOrigenChange = (event) => {
    setOrigen(event.target.value);
  };

  const handleDestinoChange = (event) => {
    setDestino(event.target.value);
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
            {Destinos.map((ciudad) => (
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
