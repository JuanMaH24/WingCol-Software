import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // Importa Navigate
import { Formulario } from "./componentes/inicio-de-sesion";
import { Home } from "./componentes/home";
import { Registro } from "./componentes/registro";
import { RestablecerContraseña } from "./componentes/restablecer_contraseña";
import { EditarPerfil } from "./componentes/editar-perfil";
import { CrearAdministrador } from "./componentes/crear-administrador";
import { EditarPerfilAdmin } from "./componentes/editar-perfil-admin";
import { CrearVuelos } from "./componentes/crear-vuelos";
import { HomeVisitante } from "./componentes/home-visitante";
import "bootstrap/dist/css/bootstrap.min.css";
import { HomeCliente } from "./componentes/home-cliente";
import CssBaseline from "@mui/material/CssBaseline";
import { HomeRoot } from "./componentes/home-root";
import { EditarVuelo } from "./componentes/editar_vuelo";

export default function App() {
  const [user, setUser] = useState(null); // Inicializa el estado

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirige la ruta raíz (/) a /home-visitante */}
          <Route path="/" element={<Navigate to="/home-visitante" />} />
          <Route
            path="/home"
            element={<Home user={user} setUser={setUser} />}
          />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/restablecer_contraseña"
            element={<RestablecerContraseña />}
          />
          <Route path="/editar-perfil" element={<EditarPerfil />} />
          <Route path="/crear-administrador" element={<CrearAdministrador />} />
          <Route path="/editar-perfil-admin" element={<EditarPerfilAdmin />} />
          <Route path="/crear-vuelos" element={<CrearVuelos />} />
          <Route path="/home-visitante" element={<HomeVisitante />} />
          <Route path="/home-cliente" element={<HomeCliente />} />
          <Route path="/home-root" element={<HomeRoot />} />
          <Route path="/editar-vuelos" element={<EditarVuelo />} />
          <Route path="/inicio-de-sesion" element={<Formulario />} />
        </Routes>
      </div>
    </Router>
  );
}
