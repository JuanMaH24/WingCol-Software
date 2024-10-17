import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [role, setRole] = React.useState(3); // Cambia el rol aquí para probar (1: cliente, 2: admin, 3: root)
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

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
    navigate("/");
    handleClose();
  };

  const handleCrearTarjeta = () => {
    navigate("/añadir-tarjeta");
    handleClose();
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
        <span className="perfil">Perfil</span> {/* Texto al lado del icono */}
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
            <MenuItem onClick={handleCerrarSesion}>Cerrar sesión</MenuItem>
          </>
        )}

        {role === 2 && (
          <>
            <MenuItem onClick={handleEditar}>Editar perfil</MenuItem>
            <MenuItem onClick={handleCrearVuelo}>Crear vuelo</MenuItem>
            <MenuItem onClick={handleEditarVuelo}>Editar vuelo</MenuItem>
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
