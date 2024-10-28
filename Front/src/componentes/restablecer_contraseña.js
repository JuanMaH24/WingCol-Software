import React, { useState } from "react";
import "../hojas-de-estilo/restablecer_contraseña.css";
import { useNavigate, useSearchParams } from "react-router-dom";

export function RestablecerContraseña() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Para obtener el token de la URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const apiHost = process.env.REACT_APP_API_HOST;
  // Obtener el token de la URL
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!token) {
      setError("El token no es válido.");
      return;
    }

    // Lógica para enviar la nueva contraseña junto con el token
    try {
      const response = await fetch(
        `${apiHost}/password_reset/confirm/token=/` + token,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
            token: token,
          }),
        }
      );

      if (response.ok) {
        alert("Contraseña restablecida con éxito.");
        navigate("/inicio-de-sesion"); // Redirige al inicio de sesión si todo es correcto
      } else {
        const data = await response.json();
        setError(data.error || "Hubo un error al restablecer la contraseña.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setError("Error de red. Intente de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="contenedor-principal">
        <h1>Restablecer contraseña</h1>
        <div className="input-box">
          <input
            type="text"
            name="codigo"
            placeholder="Ingrese el token suministrado en el correo"
            value={token || ""}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            name="nueva-contraseña"
            placeholder="Nueva contraseña"
            maxLength={20}
            minLength={8}
            pattern="^[^\s]+$"
            title="La contraseña no puede tener espacios en blanco"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            name="confirmar-contraseña"
            placeholder="Confirmar contraseña"
            maxLength={20}
            minLength={8}
            pattern="^[^\s]+$"
            title="La contraseña no puede tener espacios en blanco"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}{" "}
        {/* Mensaje de error si las contraseñas no coinciden o el token es inválido */}
        <div className="boton-confirmar">
          <button type="submit">Confirmar</button>
        </div>
      </div>
    </form>
  );
}
