import React from "react";
import "../hojas-de-estilo/resultados-busqueda.css";
import Fondo_sesion from "../imagenes/fondo-inicio-sesion.jpg";

export function Reservas({ items = [], onRemoveFromReserves }) {
  const calculateTotalReservations = () => {
    return items
      .reduce((total, item) => total + parseFloat(item.precioTotal), 0)
      .toFixed(2);
  };

  return (
    <div className="resultados-vuelos">
      <h1>Mis Reservas</h1>
      {items.length === 0 ? (
        <p>No tienes reservas actuales.</p>
      ) : (
        <div className="vuelos-contenedor">
          {items.map((item, index) => (
            <div key={index} className="vuelo-item">
              <div className="vuelo-detalles">
                <img
                  className="imagen"
                  alt="Imagen del vuelo"
                  src={item.vuelos_pic || Fondo_sesion}
                />
                <p>
                  <strong>Nombre de Vuelo:</strong> {item.referencia}
                </p>
                <p>
                  <strong>Origen:</strong> {item.ciudad_origen}
                </p>
                <p>
                  <strong>Destino:</strong> {item.ciudad_destino}
                </p>
                <p>
                  <strong>Fecha de Salida:</strong>{" "}
                  {item.fecha_salida.split("T")[0]}
                </p>
                <p>
                  <strong>Hora de Salida:</strong>{" "}
                  {item.fecha_salida.split("T")[1]?.replace("Z", "")}
                </p>
                <p>
                  <strong>Cantidad de Personas:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Precio Unitario:</strong> ${item.precioUnitario}
                </p>
                <p>
                  <strong>Precio Total:</strong> ${item.precioTotal}
                </p>

                <div className="detalles-adicionales">
                  {item.equipajeBodega && <p>Equipaje de bodega incluido</p>}
                  {item.primeraClase && <p>Primera clase</p>}
                </div>

                <div className="botones-container">
                  <button onClick={() => onRemoveFromReserves(index)}>
                    Eliminar Reserva
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="resumen-reservas">
            <h2>Resumen de Reservas</h2>
            <p>
              <strong>Número Total de Reservas:</strong> {items.length}
            </p>
            <p>
              <strong>Total Reservado:</strong> ${calculateTotalReservations()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
