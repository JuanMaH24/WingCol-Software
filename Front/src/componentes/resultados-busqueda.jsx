import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/jwt-decode";
import Fondo_sesion from "../imagenes/fondo-inicio-sesion.jpg";

import "../hojas-de-estilo/resultados-busqueda.css";

export default function ResultadosVuelos({
  vuelos,
  onAddToCart,
  onAddToReserve, // New prop for reservation
  cartItems = [],
}) {
  const apiHost = import.meta.env.VITE_API_HOST;
  const jwtToken = localStorage.getItem("access");
  const [role, setRole] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVuelo, setSelectedVuelo] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [equipaje, setEquipaje] = useState("0");
  const [seatClass, setSeatClass] = useState("0");
  const [modalMode, setModalMode] = useState("compra"); // New state to track modal mode
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

  const handleComprar = async (vuelo) => {
    const currentTickets = calculateCurrentTicketsForFlight(vuelo.id_vuelo);

    if (currentTickets >= 5) {
      alert("No puede comprar más de 5 tiquetes para este vuelo.");
      return;
    }

    setSelectedVuelo(vuelo);
    setModalVisible(true);
    setModalMode("compra");
    setQuantity(1);
    setEquipaje("0");
    setSeatClass("0");
  };

  const handleReservar = async (vuelo) => {
    const currentTickets = calculateCurrentTicketsForFlight(vuelo.id_vuelo);

    if (currentTickets >= 5) {
      alert("No puede reservar más de 5 tiquetes para este vuelo.");
      return;
    }

    setSelectedVuelo(vuelo);
    setModalVisible(true);
    setModalMode("reserva");
    setQuantity(1);
    setEquipaje("0");
    setSeatClass("0");
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVuelo(null);
    setQuantity(1);
    setEquipaje("0");
    setSeatClass("0");
    setModalMode("compra");
  };

  const incrementQuantity = () => {
    const currentTickets = calculateCurrentTicketsForFlight(
      selectedVuelo.id_vuelo
    );
    const availableSlots = 5 - currentTickets;

    if (quantity < availableSlots) {
      setQuantity(quantity + 1);
    } else {
      alert(
        "No puede " +
          (modalMode === "compra" ? "comprar" : "reservar") +
          " más de 5 tiquetes para este vuelo."
      );
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
      basePrice *= 1.1;
    }
    if (seatClass === "P") {
      basePrice *= 1.3;
    }
    return basePrice;
  };

  const calculateCurrentTicketsForFlight = (flightId) => {
    const items = Array.isArray(cartItems) ? cartItems : [];
    return items
      .filter((item) => item.id_vuelo === flightId)
      .reduce((total, item) => total + item.quantity, 0);
  };

  const handleAddToCart = async (vuelo) => {
    if (!selectedVuelo || !onAddToCart) {
      console.error(
        "Error: No hay vuelo seleccionado o onAddToCart no está definida"
      );
      return;
    }

    const currentTickets = calculateCurrentTicketsForFlight(
      selectedVuelo.id_vuelo
    );

    if (currentTickets + quantity > 5) {
      alert("No puede comprar más de 5 tiquetes para este vuelo.");
      return;
    }

    try {
      const precioUnitario = parseFloat(calculateTotalPrice()) / quantity;

      // Crear entradas individuales para cada tiquete
      const itemsToAdd = Array.from({ length: quantity }, () => ({
        ...selectedVuelo,
        quantity: 1, // Cada tiquete es individual
        equipaje: equipaje,
        precioUnitario: precioUnitario.toFixed(2),
        precioTotal: precioUnitario.toFixed(2),
        equipajeBodega: equipaje === "B",
        primeraClase: seatClass === "P",
      }));

      try {
        const userID = getUser().user_id;
        const flightId = vuelo.id_vuelo
        const response = await fetch(`${apiHost}/cart/add/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            user_id: userID,
            id_vuelo: flightId,
            // quantity: quantity,
            tipo_equipaje: equipaje,
            clase: seatClass,
            precio_modificado: calculateTotalPrice(),
          }),
        });
        if(!response.ok){
          console.log(`${response.status} - ${response}`);
          throw new Error("Error de red al agregar al carrito");
        }
  
        const responseData = await response.json();
        console.log("Tiquete agregado al carrito:", responseData);
        itemsToAdd.forEach((item) => onAddToCart(item));
        closeModal();
        alert("¡Tiquetes agregados al carrito!");
      } catch(error){
        console.error("Error al agregar al carrito:", error);
      }
      // Llamar a onAddToCart para cada entrada
      
    } catch (error) {
      console.error("Error específico al agregar al carrito:", error);
    }
  };

  const handleAddToReserve = () => {
    if (!selectedVuelo || !onAddToReserve) {
      console.error(
        "Error: No hay vuelo seleccionado o onAddToReserve no está definida"
      );
      return;
    }

    const currentTickets = calculateCurrentTicketsForFlight(
      selectedVuelo.id_vuelo
    );

    if (currentTickets + quantity > 5) {
      alert("No puede reservar más de 5 tiquetes para este vuelo.");
      return;
    }

    try {
      const precioTotal = parseFloat(calculateTotalPrice());
      const precioUnitario = precioTotal / quantity;

      const itemToReserve = {
        ...selectedVuelo,
        quantity: quantity,
        equipaje: equipaje,
        precioUnitario: precioUnitario.toFixed(2),
        precioTotal: precioTotal.toFixed(2),
        equipajeBodega: equipaje === "B",
        primeraClase: seatClass === "P",
      };

      onAddToReserve(itemToReserve);
      closeModal();
      alert("¡Vuelo agregado a reservas!");
    } catch (error) {
      console.error("Error específico al agregar a reservas:", error);
    }
  };

  const renderBotonesUsuario = (vuelo) => (
    <>
      <button onClick={() => handleReservar(vuelo)}>Reservar</button>
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
                <option value="P">Equipaje de mano</option>
                <option value="M">Solo equipaje de cabina</option>
                <option value="B">Añadir equipaje de bodega</option>
              </select>
            </div>

            <div className="clase-silla">
              <select
                className="opciones-clase"
                value={seatClass}
                onChange={(e) => setSeatClass(e.target.value)}
              >
                <option value="0">Seleccione clase de silla</option>
                <option value="E">Clase Económica</option>
                <option value="P">Primera clase</option>
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
              {seatClass === "P" && (
                <span className="precio-info">
                  {" "}
                  (Incluye 30% adicional por primera clase)
                </span>
              )}
            </p>

            <button
              onClick={
                () => handleAddToCart(selectedVuelo)
                // modalMode === "compra" ? handleAddToCart(selectedVuelo) : handleAddToReserve
              }
              disabled={
                !selectedVuelo ||
                (!onAddToCart && !onAddToReserve) ||
                equipaje === "0" ||
                seatClass === "0"
              }
            >
              {modalMode === "compra"
                ? "Agregar al Carrito"
                : "Agregar a Reservas"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
