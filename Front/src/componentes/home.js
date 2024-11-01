import React from "react";
import "../hojas-de-estilo/home.css";
import { useNavigate, useParams } from "react-router-dom";

export function Home({ user, setUser }) {
  
  const navigate = useNavigate();
  return (
    <div className="home">
      <h1>Bienvenido</h1>
      <script>
        setTimeout(() => {
          window.location.reload()
        }, 10);
      </script>
    </div>
  );
}
