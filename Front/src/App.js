import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { getUser } from "./services/jwt-decode";
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
import { RecuperarContraseña } from "./componentes/recuperar-contraseña";
import { PaymentForm } from "./componentes/añadir-tarjeta";
import { PaymentFormEditarTarjeta } from "./componentes/editar-tarjetas";
import { ResultadosPage } from "./componentes/pagina-resultados";
import { BasicTableTarjetas } from "./componentes/tabla-tarjetas";
import { ListaTarjetas } from "./componentes/lista-tarjetas";

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const location = useLocation();

    if (!user) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.roles)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  const PublicRoute = ({ children }) => {
    if (user) {
      if (user && user.roles === 3) {
        return <Navigate to="/home-root" replace />;
      }
      return <Navigate to="/home-cliente" replace />;
    }

    return children;
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);
        setIsLoading(false);
      } catch (err) {
        setUser(null);
        setIsLoading(false);
      }
    };
    getCurrentUser();
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  user
                    ? user.roles === 3
                      ? "/home-root"
                      : "/home-cliente"
                    : "/home-visitante"
                }
              />
            }
          />
          <Route
            path="/home-visitante"
            element={
              <PublicRoute>
                <HomeVisitante />
              </PublicRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="/inicio-de-sesion"
            element={
              <PublicRoute>
                <Formulario />
              </PublicRoute>
            }
          />
          <Route
            path="/registro"
            element={
              <PublicRoute>
                <Registro />
              </PublicRoute>
            }
          />
          <Route
            path="/recuperar-contraseña"
            element={<RecuperarContraseña />}
          />
          <Route
            path="/restablecer-contraseña"
            element={<RestablecerContraseña />}
          />

          {/* Rutas protegidas */}
          <Route
            path="/home-cliente"
            element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <HomeCliente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-perfil"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <EditarPerfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crear-administrador"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <CrearAdministrador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-perfil-admin"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <EditarPerfilAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crear-vuelos"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <CrearVuelos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home-root"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <HomeRoot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-vuelos/:id"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <EditarVuelo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/añadir-tarjetas"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <PaymentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-tarjetas/:id"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <PaymentFormEditarTarjeta />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tabla-tarjetas"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <BasicTableTarjetas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lista-tarjetas"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <ListaTarjetas />
              </ProtectedRoute>
            }
          />
          <Route path="/resultados" element={<ResultadosPage />} />
          <Route
            path="/unauthorized"
            element={<div>No tienes permiso para acceder a esta página.</div>}
          />
        </Routes>
      </div>
    </Router>
  );
}
