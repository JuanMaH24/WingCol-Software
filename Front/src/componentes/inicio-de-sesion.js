import React, { useState } from "react";
import "../hojas-de-estilo/inicio-de-sesion.css";
import { FaRegUserCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { getUser } from "../services/jwt-decode";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logo from "../imagenes/logo.png";
import Alert from "@mui/material/Alert";

export function Formulario({ setUser }) {
  // State para el usuario y la contraseña
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(""); // Cambiado a cadena para mostrar mensajes específicos
  const location = useLocation();
  const successMessage = location.state?.successMessage || "";
  // useNavigate para redireccionar después del inicio de sesión exitoso
  const navigate = useNavigate();

  // Función para manejar el submit
  const handleSubmit = async (e) => {
    const apiHost = process.env.REACT_APP_API_HOST;
    e.preventDefault();
    if (usuario === "" || contraseña === "") {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      // Realiza la petición al backend
      const response = await fetch(`${apiHost}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: usuario,
          password: contraseña,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guarda el token en localStorage
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        
        // Guarda el usuario en el estado de la app
        const user = getUser();
        
        // Redirigir según el rol del usuario
        if (user.roles === 1) {
          navigate("/home-cliente");
        } else if (user.roles === 2) {
          navigate("/home-cliente");
        } else if (user.roles === 3) {
          navigate("/home-root");
        }
      } else {
        // Muestra el error devuelto por el backend
        setError(data.message || "Error en el inicio de sesión");
      }
    } catch (error) {
      setError("Error de conexión, por favor intenta de nuevo.");
    }
  };

  // Retorno del componente
  return (
    <section>
      <form className="formulario" onSubmit={handleSubmit}>
        <img className="imagen-logo" src={logo} alt="Logo" />
        <h1>Iniciar sesión</h1>
        <div className="input-box">
          <input
            type="email"
            placeholder="Usuario"
            required
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <FaRegUserCircle className="icono" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
          <FaLock className="icono" />
        </div>
        <div className="recordar-contraseña">
          <Link to="/recuperar-contraseña" variant="#">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <button>Iniciar sesión</button>
        <div className="link-registrarse">
          <p>
            ¿No tienes ninguna cuenta?{" "}
            <Link to="/registro" variant="#">
              Registrarse
            </Link>
          </p>
        </div>
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Mostrar mensajes de error */}
      </form>
    </section>
  );
}
