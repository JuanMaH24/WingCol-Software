import React from "react";
import "../hojas-de-estilo/resultados-busqueda.css"; // Asegúrate de tener un archivo CSS para los estilos
import { getUser } from "../services/jwt-decode";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Fondo_sesion from "../imagenes/fondo-inicio-sesion.jpg";

export default function ResultadosVuelos({ vuelos }) {
  const [role, setRole] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchUserRole();
  }, []);
  const fetchUserRole = () => {
    try {
      // setLoading(true);
      const data = getUser();
      console.log(data);
      setRole(data.roles);
    } catch (err) {
      // setError("Error al obtener el rol del usuario");
      console.error("Error al obtener el rol del usuario:", err);
    } finally {
      // setLoading(false);
    }
  };

  const handleEditarVuelo = (e) => {
    const { name } = e.target;
    navigate(`/editar-vuelos/${name}`);
    // handleClose();
  };

  return (
    <div className="resultados-vuelos">
      <h1>Resultados de la Búsqueda</h1>
      {vuelos.length > 0 ? (
        <div className="vuelos-contenedor">
          {vuelos.map((vuelo, index) => (
            <div key={index} className="vuelo-item">
              <div className="vuelo-detalles">
                <input type="image" className="imagen" src={vuelo.vuelos_pic} />
                <input type="" />
                <p>
                  <strong>Origen:</strong> {vuelo.ciudad_origen}
                </p>
                <p>
                  <strong>Destino:</strong> {vuelo.ciudad_destino}
                </p>
                <p>
                  <strong>Fecha de Salida:</strong> {vuelo.fecha_salida}
                </p>
                <p>
                  <strong>Fecha de Llegada:</strong> {vuelo.fecha_llegada}
                </p>
                <p>
                  <strong>Precio:</strong> ${vuelo.precio}
                </p>
                <div className="botones-container">
                  {(role != 2 || !role) && (
                    <>
                      <button>Reservar</button>
                      <button>Comprar</button>
                    </>
                  )}
                  {role === 2 && (
                    <>
                      <button name={1} onClick={handleEditarVuelo}>
                        Editar vuelo
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron vuelos.</p>
      )}
    </div>
  );
}
