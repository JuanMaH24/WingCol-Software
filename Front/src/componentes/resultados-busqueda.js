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
  const [equipaje, setEquipaje] = useState("0");
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
    setSelectedVuelo(vuelo);
    setModalVisible(true);
    setQuantity(1);
    setEquipaje("0");
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVuelo(null);
    setQuantity(1);
    setEquipaje("0");
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
    let basePrice = selectedVuelo.precio * quantity;
    if (equipaje === "B") {
      basePrice *= 1.1; // Increase price by 10% for checked baggage
    }
    return basePrice.toFixed(2);
  };

  const handleAddToCart = () => {
    if (!selectedVuelo || !onAddToCart) {
      console.error(
        "Error: No hay vuelo seleccionado o onAddToCart no está definida"
      );
      return;
    }

    try {
      const precioTotal = parseFloat(calculateTotalPrice());
      const precioUnitario = precioTotal / quantity;

      const itemToAdd = {
        ...selectedVuelo,
        quantity: quantity,
        equipaje: equipaje,
        precioUnitario: precioUnitario.toFixed(2),
        precioTotal: precioTotal.toFixed(2),
        equipajeBodega: equipaje === "B",
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

            <div className="selección de equipaje">
              <select
                className="opciones-equipaje"
                value={equipaje}
                onChange={(e) => setEquipaje(e.target.value)}
              >
                <option value="0">Seleccione equipaje</option>
                <option value="C">Solo equipaje de cabina</option>
                <option value="B">Añadir equipaje de bodega</option>
              </select>
            </div>

            <p>
              <strong>Precio Total:</strong> ${calculateTotalPrice()}
              {equipaje === "B" && (
                <span className="precio-info">
                  {" "}
                  (Incluye 10% adicional por equipaje de bodega)
                </span>
              )}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVuelo || !onAddToCart || equipaje === "0"}
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
