import React, { useEffect } from "react";
import "../hojas-de-estilo/home.css";
import { useNavigate } from "react-router-dom";

export function Home({ user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    // El código para hacer un reload de la página después de un retraso de 10 ms
    setTimeout(() => {
      window.location.reload();
    }, 10);
  }, []); // El array vacío asegura que este efecto solo se ejecute una vez al montar el componente

  return (
    <div className="home">
      <h1>Bienvenido</h1>
    </div>
  );
}
