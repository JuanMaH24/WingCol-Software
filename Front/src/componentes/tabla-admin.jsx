import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../hojas-de-estilo/lista-admins.css";

export default function BasicTable() {
  const apiHost = import.meta.env.VITE_API_HOST;
  const [userData, setUserData] = useState([]);
  const jwtToken = localStorage.getItem("access");

  useEffect(() => {
    // Aquí deberías hacer una llamada al backend para obtener los datos del usuario
    async function fetchUsers() {
      try {
        // const params = new URLSearchParams({user_id: currentUser.user_id});
        const response = await fetch(`${apiHost}/allusers/`);
        const allUsers = await response.json();
        if (Array.isArray(allUsers)) {
          setUserData(allUsers);
        }
      } catch (error) {
        console.error("Error al cargar el perfil", error);
      }
    }

    fetchUsers();
  }, []);

  const handleDelete = async (e) => {
    const { name } = e.target;
    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar este administrador? Esta acción no se puede deshacer."
    );
    if (isConfirmed) {
      try {
        const response = await fetch(`${apiHost}/users/admin/delete/`, {
          method: "PUT", //
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
            // Asegúrate de incluir el token de autenticación si es necesario
            // "Authorization": "Bearer " + yourAuthToken
          },
          body: JSON.stringify({ user_id: name }), // Incluye el cuerpo si el backend espera algún dato
        });

        if (response.ok) {
          window.location.reload();
        } else {
          const errorData = await response.json();
          alert(
            "Error al eliminar la cuenta: " +
              (errorData.message || "Por favor, intenta de nuevo más tarde.")
          );
        }
      } catch (error) {
        console.error("Error al eliminar la cuenta:", error);
        alert(
          "Hubo un problema al intentar eliminar tu cuenta. Por favor, intenta de nuevo más tarde."
        );
      }
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Id</TableCell>
            <TableCell align="right">Correo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userData.map((user) =>
            user.roles == 2 ? (
              <TableRow
                key={user.user_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{user.user_id}</TableCell>
                <TableCell align="right">{user.email}</TableCell>
                <TableCell align="right">
                  <button
                    type="submit"
                    name={user.user_id}
                    onClick={handleDelete}
                    className="btn btn-danger"
                  >
                    X
                  </button>
                </TableCell>
              </TableRow>
            ) : (
              <div></div>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
