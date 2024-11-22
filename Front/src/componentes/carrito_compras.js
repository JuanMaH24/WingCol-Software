import React, { useState, useEffect } from "react";
import "../hojas-de-estilo/carrito-compras.css";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/jwt-decode";
import { CheckInPasajeros } from "./check-in-pasajeros";

export default function CarritoCompras({ userId, onRemoveFromCart }) {
  const user = getUser();
  const apiHost = process.env.REACT_APP_API_HOST;
  const jwtToken = localStorage.getItem("access");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${apiHost}/cart/?user_id=${user.user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,

          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Transform the data and check registration status
      const processedItems = data.map((item) => ({
        ...item,
        registrado: item.id_viajero !== null, // Check if traveler ID is not null
        referencia: item.referencia || `Vuelo ${item.id_vuelo}`, // Fallback reference
        precioUnitario: item.precio_unitario,
        precioTotal: item.precio_total,
        ciudad_origen: item.ciudad_origen,
        ciudad_destino: item.ciudad_destino,
        fecha_salida: item.fecha_salida,
        equipajeBodega: item.tipo_equipaje === "M", // Assuming 'M' means bodega
        seatClass: item.clase,
        quantity: 1, // Assuming single ticket per item
      }));

      setItems(processedItems);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const calculateTotalPrice = (item) => {
    // if (!selectedVuelo) return 0;
    let basePrice = item.precio;
    if (item.tipo_equipaje === "B") {
      basePrice *= 1.1;
    }
    if (item.clase === "P") {
      basePrice *= 1.3;
    }
    return basePrice;
  };

  const calculateTotal = () => {
    return items
      .reduce((total, item) => total + parseFloat(calculateTotalPrice(item)), 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="carrito-container">
        <h1 className="carrito-title">Carrito de Compras</h1>
        <p>Cargando items del carrito...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carrito-container">
        <h1 className="carrito-title">Carrito de Compras</h1>
        <p>Error al cargar los items: {error}</p>
      </div>
    );
  }

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
    // Verifica si todos los tiquetes están registrados
    if (items.every((item) => item.registrado)) {
      navigate("/pasarela-de-pagos", {
        state: {
          total: calculateTotal(),
        },
      });
    } else {
      alert("Por favor, registre todos los pasajeros antes de continuar.");
    }
  };

  const handleRegister = (index) => {
    // const item = items[index];
    navigate(`/registro-pasajeros/${index}`);
  };

  const handleRemoveFromCart = async (index) => {
    try {
      // Implement cart item removal logic here
      // You might want to call a backend endpoint to remove the item
      const itemToRemove = items[index];
      const response = await fetch(`${apiHost}/cart/remove/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          id: itemToRemove.id,
          user_id: user.user_id,
        }),
      });

      if (!response.ok) {
        console.log(`${response.status} ${response}`);
        throw new Error("Failed to remove item from cart");
      }

      // Remove the item from local state
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("No se pudo eliminar el item del carrito");
    }
  };

  return (
    <div className="carrito-container">
      <Navbar/>      
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
                  <strong>Precio por boleto:</strong> ${item.precio}
                </p>
                <p>
                  <strong>Subtotal:</strong> ${calculateTotalPrice(item)}
                </p>
                <button
                  onClick={() => handleRemoveFromCart(index)}
                  className="remove-button"
                >
                  Eliminar
                </button>
                {!item.registrado && (
                  <button
                    className="boton-registro-pasajeros-carrito"
                    onClick={() => handleRegister(item.id)}
                  >
                    Hacer registro de pasajeros
                  </button>
                )}
                {item.registrado && (
                  <p className="registro-completado">Registro completado</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="carrito-total">
          <h2>Total: ${calculateTotal()}</h2>
          <button
            className="checkout-button"
            onClick={handlePay}
            disabled={items.every((item) => item.registrado) ? false : true}
          >
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
