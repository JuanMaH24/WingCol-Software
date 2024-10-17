import React from "react";
import "../hojas-de-estilo/añadir-tarjeta.css";

export function AñadirTarjeta() {
  return (
    <form>
      <div className="contenedor-principal-añadir-tarjeta">
        <h1>Añadir tarjeta</h1>
        <select className="tipo-tarjeta">
          <option value="tipo de tarjeta">Tipo de tarjeta</option>
          <option value="D">Tarjeta de debito</option>
          <option value="C">Tarjeta de credito</option>
        </select>
        <div className="numero-tarjeta">
          <input
            type="text"
            name="numero-tarjeta"
            placeholder="Número de tarjeta"
            required
          />
        </div>
        <select className="mes-vencimiento" required>
          <option value="mes de vencimiento">mes de vencimiento</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        <select className="año-vencimiento" required>
          <option value="año de vencimiento">año de vencimiento</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
          <option value="2028">2028</option>
          <option value="2029">2029</option>
          <option value="2030">2030</option>
          <option value="2031">2031</option>
          <option value="2032">2032</option>
        </select>
        <div className="CVV">
          <input type="text" placeholder="Código de seguridad (CVV)" required />
        </div>
        <div className="boton-crear-tarjeta">
          <button type="submit">Añadir tarjeta</button>
        </div>
      </div>
    </form>
  );
}
