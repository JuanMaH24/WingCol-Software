import React from "react";
import "../hojas-de-estilo/resultados-busqueda.css"; // Asegúrate de tener un archivo CSS para los estilos

export default function ResultadosVuelos({ vuelos }) {
  return (
    <div className="resultados-vuelos">
      <h1>Resultados de la Búsqueda</h1>
      {vuelos.length > 0 ? (
        <div className="vuelos-contenedor">
          {vuelos.map((vuelo, index) => (
            <div key={index} className="vuelo-item">
              <div className="vuelo-detalles">
                <p>
                  <strong>Origen:</strong> {vuelo.ciudad_origen}
                </p>
                <p>
                  <strong>Destino:</strong> {vuelo.ciudad_destino}
                </p>
                <p>
                  <strong>Fecha de Salida:</strong> {vuelo.fecha_salida}
                </p>
                <p>
                  <strong>Fecha de Llegada:</strong> {vuelo.fecha_llegada}
                </p>
                <p>
                  <strong>Precio:</strong> ${vuelo.precio}
                </p>
                <div className="botones-container">
                  <button>Reservar</button>
                  <button>Comprar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron vuelos.</p>
      )}
    </div>
  );
}
