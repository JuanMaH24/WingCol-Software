// import React from "react";
// import Nacionales from "./asientos-nacionales";
// import Internacionales from "./asientos-internacionales";
import React, { useState, useEffect } from "react";
import { getUser } from "../services/jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { CambioSillas } from "./cambio-sillas";
import { SeatLegend } from "./colores";
import "../hojas-de-estilo/completar-checkin.css"

export function CompletarCheckin() {
  const [selectedSeat, setSelectedSeat] = useState(null);
  // const [changeSeat, setChangeSeat] = useState(false);
  const [globalSeats, setGlobalSeats] = useState([]);
  // const [previousSeat, setPreviousSeat] = useState("");
  const currentUser = getUser();
  const location = useLocation();
  const navigate = useNavigate();
  const id_tiquete = location.state?.id_tiquete
  const apiHost = import.meta.env.VITE_API_HOST;
  const jwtToken = localStorage.getItem("access");

  const [formData, setFormData] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    phoneNumber: "",
    contactPhoneNumber: "",
    contactName: "",
    gender: "",
    email: "",
    birthDate: "",
    documentType: "",
    documentNumber: "",
    flightId: "",
    seatId: "",
    typeEquipement:"",
    seatClass:""
  });

  useEffect(() => {
    // Simulación de una llamada a la API para obtener los datos del vuelo
    const fetchTicketData = async () => {
      try {
        const params = new URLSearchParams({ id_tiquete: id_tiquete});
        const response = await fetch(
          `${apiHost}/ticket/?${params.toString()}`,
          {
            headers: {
              // Authorization: `Bearer ${jwtToken}`,
            },
          }
        ); // Reemplaza con la URL real de la API
        const itemData = await response.json();
        console.log("Response");
        console.log(itemData);
        setFormData({
          primerNombre: itemData.nombre_viajero || "",
          segundoNombre: itemData.segundo_nombre_viajero || "",
          flightId: itemData.id_vuelo || "",
          primerApellido: itemData.apellido_viajero || "",
          segundoApellido: itemData.segundo_apellido_viajero || "",
          phoneNumber: itemData.telefono_viajero || "",
          contactPhoneNumber: itemData.telefono_contacto || "",
          contactName: itemData.nombre_contacto || "",
          gender: itemData.genero_viajero || "",
          email_viajero: itemData.email_viajero || "",
          precio: itemData.precio || 0,
          birthDate: itemData.fecha_nacimiento_viajero || "",
          documentType: itemData.tipo_documento_viajero || "",
          documentNumber: itemData.id_viajero || "",
          seatClass: itemData.clase || "",
          seatId: itemData.id_silla || "",
          typeEquipement: itemData.tipo_equipaje || "",
        });
        setSelectedSeat(itemData.id_silla);
      } catch (error) {
        console.error("Error al obtener los datos del vuelo:", error);
      }
    };

    fetchTicketData();
  }, [id_tiquete]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const dataToSend = {
      id_tiquete: id_tiquete,
      id_silla: selectedSeat.id_silla,
      user_id: currentUser.user_id,
      id_vuelo: formData.flightId,
      nombre_viajero: formData.primerNombre,
      segundo_nombre_viajero: formData.segundoNombre || "",
      id_viajero: parseInt(formData.documentNumber),
      apellido_viajero: formData.primerApellido,
      segundo_apellido_viajero: formData.segundoApellido || "",
      tipo_documento_viajero: formData.documentType,
      fecha_nacimiento_viajero: formData.birthDate,
      genero_viajero: formData.gender,
      telefono_viajero: formData.phoneNumber, // Remove non-digit characters
      nombre_contacto: formData.contactName,
      telefono_contacto: formData.contactPhoneNumber, // Remove non-digit characters
      clase: selectedSeat.clase,
      precio: formData.precio,
      email_viajero: formData.email_viajero,
      tipo_equipaje: formData.typeEquipement,
      verificado: 1
    };

    try {
      console.log(dataToSend)
      const response = await fetch(`${apiHost}/ticket/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${jwtToken}`,
        },body: JSON.stringify(dataToSend)
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
      }else{
        console.log("Check-In Correcto");
      }
    } catch (error) {
      console.error(error);
    }
    
    const updatePreviousSeat = {
      id_silla: formData.seatId,
      estado: "L"
    }
    try{
      const response = await fetch(`${apiHost}/checkin/seat/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatePreviousSeat),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
      }else{
        console.log("Check-In Correcto");
      }
    }catch (error) {
      console.error(error);
    }
    const updateCurrentSeat = {
      id_silla: dataToSend.id_silla,
      estado: "O"
    }
    try{
      const response = await fetch(`${apiHost}/checkin/seat/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updateCurrentSeat),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
      }else{
        console.log("Check-In Correcto");
      }
    }catch (error) {
      console.error(error);
    }
    navigate("/");
  };

  return (
    <>
      <CambioSillas 
        className="seats"
        selectedSeat={selectedSeat} 
        setSelectedSeat={setSelectedSeat}
        setGlobalSeats={setGlobalSeats} 
        id_vuelo={formData.flightId} 
      />
      <SeatLegend />
      <div className="seleccion-equipaje">
        <select
          className="opciones-equipaje"
          name="typeEquipement"
          value={formData.typeEquipement}
          onChange={handleChange}
        >
          <option value="P">Equipaje Personal</option>
          <option value="M">Equipaje de Mano</option>
          <option value="B">Equipaje de bodega</option>
        </select>
      </div>
      <button type="submit" onClick={handleSubmit}>Completar Check-in</button>
    </>
  );
}
