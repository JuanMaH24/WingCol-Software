import React, { useState } from "react";
import "../hojas-de-estilo/inicio-de-sesion.css";
import { FaRegUserCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { Link, useNavigate, Navigate } from "react-router-dom";
import logo from "../imagenes/logo.png";
import Alert from '@mui/material/Alert';

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
    e.preventDefault();
    if (usuario === "" || contraseña === "") {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      // Realiza la petición al backend
      const response = await fetch("http://127.0.0.1:8000/login/", {
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
        localStorage.setItem("token", data.token);

        // Guarda el usuario en el estado de la app
        setUser({
          name: data.name, // Por ejemplo, según lo que devuelva tu backend
        });

        // Redireccionar a la página principal
        navigate("/home");
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
          <a href="#">¿Olvidaste tu contraseña?</a>
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
        {successMessage && (
          <Alert severity="success">
            {successMessage}
          </Alert>
        )}
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Mostrar mensajes de error */}
      </form>
    </section>
  );
}
