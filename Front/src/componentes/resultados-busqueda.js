import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/jwt-decode";
import Fondo_sesion from "../imagenes/fondo-inicio-sesion.jpg";

import "../hojas-de-estilo/resultados-busqueda.css";

export default function ResultadosVuelos({ vuelos, onAddToCart }) {
  const [role, setRole] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVuelo, setSelectedVuelo] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = () => {
    try {
      const data = getUser();
      setRole(data?.roles || null);
    } catch (err) {
      console.error("Error al obtener el rol del usuario:", err);
    }
  };

  const handleEditarVuelo = (idVuelo) => {
    navigate(`/editar-vuelos/${idVuelo}`);
  };

  const handleComprar = (vuelo) => {
    console.log("Vuelo seleccionado:", vuelo); // Debug
    setSelectedVuelo(vuelo);
    setModalVisible(true);
    setQuantity(1);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVuelo(null);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    if (quantity < 5) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedVuelo) return 0;
    return selectedVuelo.precio * quantity;
  };

  const handleAddToCart = () => {
    console.log("Intentando agregar al carrito:"); // Debug
    console.log("selectedVuelo:", selectedVuelo); // Debug
    console.log("onAddToCart function:", onAddToCart); // Debug

    if (!selectedVuelo) {
      console.error("Error: No hay vuelo seleccionado");
      return;
    }

    if (!onAddToCart) {
      console.error("Error: onAddToCart no está definida");
      return;
    }

    try {
      const itemToAdd = {
        ...selectedVuelo,
        quantity: quantity,
      };

      onAddToCart(itemToAdd);
      closeModal();
      alert("¡Vuelo agregado al carrito!");
    } catch (error) {
      console.error("Error específico al agregar al carrito:", error);
    }
  };

  const renderBotonesUsuario = (vuelo) => (
    <>
      <button>Reservar</button>
      <button onClick={() => handleComprar(vuelo)}>Comprar</button>
    </>
  );

  const renderBotonesAdmin = (vuelo) => (
    <button
      name={vuelo.id_vuelo}
      onClick={() => handleEditarVuelo(vuelo.id_vuelo)}
    >
      Editar vuelo
    </button>
  );

  return (
    <div className="resultados-vuelos">
      <h1>Resultados de la Búsqueda</h1>
      {vuelos.length > 0 ? (
        <div className="vuelos-contenedor">
          {vuelos.map((vuelo, index) => (
            <div key={index} className="vuelo-item">
              <div className="vuelo-detalles">
                <img
                  className="imagen"
                  alt="Imagen del vuelo"
                  src={vuelo.vuelos_pic || Fondo_sesion}
                />
                <p>
                  <strong>Nombre de Vuelo:</strong> {vuelo.referencia}
                </p>
                <p>
                  <strong>Origen:</strong> {vuelo.ciudad_origen}
                </p>
                <p>
                  <strong>Destino:</strong> {vuelo.ciudad_destino}
                </p>
                <p>
                  <strong>Fecha de Salida:</strong>{" "}
                  {vuelo.fecha_salida.split("T")[0]}
                </p>
                <p>
                  <strong>Hora de Salida:</strong>{" "}
                  {vuelo.fecha_salida.split("T")[1]?.replace("Z", "")}
                </p>
                <p>
                  <strong>Duración:</strong> {vuelo.duracion}
                </p>
                <p>
                  <strong>Precio:</strong> ${vuelo.precio}
                </p>
                <div className="botones-container">
                  {role === 2
                    ? renderBotonesAdmin(vuelo)
                    : renderBotonesUsuario(vuelo)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron vuelos.</p>
      )}

      {modalVisible && selectedVuelo && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Detalles del Vuelo</h2>
            <p>
              <strong>Nombre de Vuelo:</strong> {selectedVuelo.referencia}
            </p>
            <p>
              <strong>Origen:</strong> {selectedVuelo.ciudad_origen}
            </p>
            <p>
              <strong>Destino:</strong> {selectedVuelo.ciudad_destino}
            </p>
            <p>
              <strong>Fecha de Salida:</strong>{" "}
              {selectedVuelo.fecha_salida.split("T")[0]}
            </p>
            <p>
              <strong>Hora de Salida:</strong>{" "}
              {selectedVuelo.fecha_salida.split("T")[1]?.replace("Z", "")}
            </p>
            <p>
              <strong>Duración:</strong> {selectedVuelo.duracion}
            </p>

            <div className="quantity-selector">
              <p>
                <strong>Número de Personas:</strong>
              </p>
              <div className="quantity-controls">
                <button
                  onClick={decrementQuantity}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="quantity-btn"
                  disabled={quantity >= 5}
                >
                  +
                </button>
              </div>
            </div>

            <p>
              <strong>Precio Total:</strong> ${calculateTotalPrice()}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVuelo || !onAddToCart}
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
