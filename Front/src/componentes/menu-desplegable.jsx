import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { getUser } from "../services/jwt-decode";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../hojas-de-estilo/menu-style.css";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [role, setRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = () => {
    try {
      setLoading(true);
      const data = getUser();
      console.log(data);
      setRole(data.roles);
    } catch (err) {
      setError("Error al obtener el rol del usuario");
      console.error("Error al obtener el rol del usuario:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event) => {
    console.log("Abriendo menú...", event.currentTarget);
    setAnchorEl(event.currentTarget);
    console.log("anchorEl después de abrir:", anchorEl);
  };

  const handleClose = () => {
    console.log("Cerrando menú...");
    setAnchorEl(null);
    console.log("anchorEl después de cerrar:", anchorEl);
  };

  const handleEditar = () => {
    navigate("/editar-perfil");
    handleClose();
  };

  const handleCrearVuelo = () => {
    navigate("/crear-vuelos");
    handleClose();
  };

  const handleEditarVuelo = () => {
    navigate("/editar-vuelos");
    handleClose();
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.reload();
    setAnchorEl(null);
  };

  const handleCrearTarjeta = () => {
    navigate("/añadir-tarjetas");
    handleClose();
  };

  const handleVerTarjetas = () => {
    navigate("/lista-tarjetas");
    handleClose();
  };

  const handleEditarPerfilAdmin = () => {
    navigate("/editar-perfil-admin");
    handleClose();
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleCheckIn = () => {
    navigate("/check-in");
  };

  const handleCarritoCompras = () => {
    navigate("/carrito");
  };

  return (
    <div className="menu-desplegable">
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => {
          console.log("Botón clickeado", e.currentTarget);
          handleClick(e);
        }}
      >
        <FaUser />
        <span className="perfil">Opciones</span>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          console.log("onClose activado");
          handleClose();
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          onMouseLeave: handleClose,
        }}
      >
        {role === 1 && [
          <MenuItem key="editar-perfil" onClick={handleEditar}>
            Editar perfil
          </MenuItem>,
          <MenuItem key="añadir-tarjeta" onClick={handleCrearTarjeta}>
            Añadir tarjeta
          </MenuItem>,
          <MenuItem key="ver-tarjetas" onClick={handleVerTarjetas}>
            Ver tarjetas
          </MenuItem>,
          <MenuItem key="check-in" onClick={handleCheckIn}>
            Realizar check-in
          </MenuItem>,
          <MenuItem key="carrito-compras" onClick={handleCarritoCompras}>
            Carrito de compras
          </MenuItem>,
          <MenuItem key="cerrar-sesion" onClick={handleCerrarSesion}>
            Cerrar sesión
          </MenuItem>,
        ]}

        {role === 2 && [
          <MenuItem key="editar-perfil-admin" onClick={handleEditarPerfilAdmin}>
            Editar perfil
          </MenuItem>,
          <MenuItem key="crear-vuelo" onClick={handleCrearVuelo}>
            Crear vuelo
          </MenuItem>,
          <MenuItem key="cerrar-sesion-admin" onClick={handleCerrarSesion}>
            Cerrar sesión
          </MenuItem>,
        ]}

        {role === 3 && (
          <MenuItem key="cerrar-sesion-rol3" onClick={handleCerrarSesion}>
            Cerrar sesión
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
