import React, { useState } from "react";
import "../hojas-de-estilo/recuperar-contraseña.css";
import { useNavigate } from "react-router-dom";

export function RecuperarContraseña() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Hook para redirigir a otra página

  // Función para enviar el email
  const handleSendEmail = async () => {
    const apiHost = import.meta.env.VITE_API_HOST;
    try {
      const response = await fetch(`${apiHost}/password_reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("Correo enviado. Verifique su bandeja de entrada.");
        navigate("/restablecer-contraseña");
      } else {
        alert("Error al enviar el correo. Intente de nuevo.");
      }
    } catch (error) {
      console.error("Error en la solicitud de correo:", error);
      alert("Hubo un problema al enviar el correo.");
    }
  };

  return (
    <form>
      <div className="contenedor-principal-recuperar-contraseña">
        <h1>Recuperar Contraseña</h1>
        <p>
          Se le enviará a su correo un código con el cual podrá cambiar su
          contraseña.
        </p>
        <div className="correo-registrado">
          <input
            type="email"
            placeholder="Ingrese su correo registrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="boton-correo">
          <button type="button" onClick={handleSendEmail}>
            Enviar correo
          </button>
        </div>
      </div>
    </form>
  );
}
