import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo_wingcol from "../imagenes/WingcolName.png";
// import "../hojas-de-estilo/home-cliente.css";
import ImgMediaCard from "./cards-home";
import Navbar from "./navbar";
import { Buscador } from "./buscador";
import { CheckInBanner } from "./tarjeta-check-in";
import { getUser } from "../services/jwt-decode";

export function HomeCliente() {
  const currentUser = getUser();
  const jwtToken = localStorage.getItem("access");
  
  useEffect(() => {
    // Aquí deberías hacer una llamada al backend para obtener los datos del usuario
    async function fetchShoppingCart() {
      try {
        const params = new URLSearchParams({ user_id: currentUser.user_id });
        const response = await fetch(
          `${import.meta.env.VITE_API_HOST}/cart/?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        const shoppingcartData = await response.json();
        console.log(shoppingcartData);

        if (!response.ok) {
          console.log("Carrito de compras no encontrado, creando uno nuevo.");
          const createCartResponse = await fetch(
            `${import.meta.env.VITE_API_HOST}/cart/create/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`, // Asegúrate también de envolver esta parte correctamente.
              },
              body: JSON.stringify({ user_id: currentUser.user_id }),
            }
          );

          if (!createCartResponse.ok) {
            throw new Error("Error al crear un nuevo carrito de compras");
          }

          const newShoppingCartData = await createCartResponse.json();
          console.log("Nuevo carrito de compra creado:", newShoppingCartData);
          return newShoppingCartData;
        }
      } catch (error) {
        console.error("Error al cargar el carrito de compras", error);
        throw error;
      }
    }

    fetchShoppingCart();
  }, []);

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  const handleRegister = () => {
    navigate("/registro");
  };

  return (
    <div className="contenedor-principal-home">
      <Navbar />
      <Buscador />
      <div className="cards-home">
        <ImgMediaCard />
      </div>
      <div className="tarjeta-check-in">
        <CheckInBanner />
      </div>
    </div>
  );
}
