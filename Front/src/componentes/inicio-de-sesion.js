import React, { useState, useEffect } from "react";
import "../hojas-de-estilo/inicio-de-sesion.css";
import { FaRegUserCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { getUser } from "../services/jwt-decode";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logo from "../imagenes/logo.png";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export function Formulario({ setUser }) {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    severity: "error",
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const successMessage = location.state?.successMessage;
    if (successMessage) {
      setAlertInfo({
        show: true,
        message: successMessage,
        severity: "success",
      });
      const timer = setTimeout(() => {
        setAlertInfo({ show: false, message: "", severity: "success" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiHost = process.env.REACT_APP_API_HOST;

    if (usuario === "" || contraseña === "") {
      setAlertInfo({
        show: true,
        message: "Todos los campos son obligatorios",
        severity: "error",
      });
      return;
    }

    try {
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
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        const user = getUser();
        setAlertInfo({
          show: true,
          message: "Inicio de sesión exitoso",
          severity: "success",
        });
        setTimeout(() => {
          if (user.roles === 1) {
            navigate("/home");
          } else if (user.roles === 2) {
            navigate("/home");
          } else if (user.roles === 3) {
            navigate("/home");
          }
        }, 1500);
      } else {
        setAlertInfo({
          show: true,
          message: data.message || "Error en el inicio de sesión",
          severity: "error",
        });
      }
    } catch (error) {
      setAlertInfo({
        show: true,
        message: "Error de conexión, por favor intenta de nuevo.",
        severity: "error",
      });
    }
  };

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
        {alertInfo.show && (
          <Stack sx={{ width: "100%", marginBottom: 2 }} spacing={2}>
            <Alert
              severity={alertInfo.severity}
              onClose={() => setAlertInfo({ ...alertInfo, show: false })}
            >
              {alertInfo.message}
            </Alert>
          </Stack>
        )}

        <button type="submit">Iniciar sesión</button>
        <div className="link-registrarse">
          <p>
            ¿No tienes ninguna cuenta?{" "}
            <Link to="/registro" variant="#">
              Registrarse
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
