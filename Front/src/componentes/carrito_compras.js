import React from "react";
import "../hojas-de-estilo/carrito-compras.css";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";

export default function CarritoCompras({ items, onRemoveFromCart }) {
  const navigate = useNavigate();

  const calculateTotal = () => {
    return items
      .reduce((total, item) => total + parseFloat(item.precioTotal), 0)
      .toFixed(2);
  };

  if (items.length === 0) {
    return (
      <div className="carrito-container">
        <h1 className="carrito-title">Carrito de Compras</h1>
        <p>No hay items en el carrito</p>
      </div>
    );
  }

  const handleBack = () => {
    navigate("/home-cliente");
  };

  const handlePay = () => {
    navigate("/pasarela-de-pagos", { state: { total: calculateTotal() } });
  };

  return (
    <div className="carrito-container">
      <h1 className="carrito-title">Carrito de Compras</h1>
      <div className="carrito-items">
        {items.map((item, index) => (
          <div key={index} className="carrito-item">
            <div className="item-header">
              <h2>{item.referencia}</h2>
            </div>
            <div className="item-content">
              <div className="item-details">
                <p>
                  <strong>Origen:</strong> {item.ciudad_origen}
                </p>
                <p>
                  <strong>Destino:</strong> {item.ciudad_destino}
                </p>
                <p>
                  <strong>Fecha:</strong> {item.fecha_salida.split("T")[0]}
                </p>
                <p>
                  <strong>Hora:</strong>{" "}
                  {item.fecha_salida.split("T")[1]?.replace("Z", "")}
                </p>
                <p>
                  <strong>Equipaje:</strong>{" "}
                  {item.equipajeBodega
                    ? "Equipaje de bodega"
                    : "Solo equipaje de cabina"}
                </p>
                <p>
                  <strong>Clase de asiento:</strong>{" "}
                  {item.seatClass === "P" ? "Primera clase" : "Clase Económica"}
                </p>
              </div>
              <div className="item-pricing">
                <p>
                  <strong>Cantidad:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Precio por boleto:</strong> ${item.precioUnitario}
                </p>
                <p>
                  <strong>Subtotal:</strong> ${item.precioTotal}
                </p>
                <button
                  onClick={() => onRemoveFromCart(index)}
                  className="remove-button"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="carrito-total">
          <h2>Total: ${calculateTotal()}</h2>
          <button className="checkout-button" onClick={handlePay}>
            Finalizar Compra
          </button>
          <button className="boton-volver-carrito" onClick={handleBack}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
