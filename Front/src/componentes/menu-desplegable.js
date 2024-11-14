import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { getUser } from "../services/jwt-decode";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
    navigate("/");
    // handleClose();
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

  return (
    <div className="menu-desplegable">
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <FaUser />
        <span className="perfil">Perfil</span>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {role === 1 && (
          <>
            <MenuItem onClick={handleEditar}>Editar perfil</MenuItem>
            <MenuItem onClick={handleCrearTarjeta}>Añadir tarjeta</MenuItem>
            <MenuItem onClick={handleVerTarjetas}>Ver tarjetas</MenuItem>
            <MenuItem onClick={handleCheckIn}>Realizar check-in</MenuItem>
            <MenuItem onClick={handleCerrarSesion}>Cerrar sesión</MenuItem>
          </>
        )}

        {role === 2 && (
          <>
            <MenuItem onClick={handleEditarPerfilAdmin}>Editar perfil</MenuItem>
            <MenuItem onClick={handleCrearVuelo}>Crear vuelo</MenuItem>
            {/* <MenuItem onClick={handleEditarVuelo}>Editar vuelo</MenuItem> */}
            <MenuItem onClick={handleCerrarSesion}>Cerrar sesión</MenuItem>
          </>
        )}

        {role === 3 && (
          <>
            <MenuItem onClick={handleCerrarSesion}>Cerrar sesión</MenuItem>
          </>
        )}
      </Menu>
    </div>
  );
}
