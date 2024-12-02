import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import EditIcon from '@mui/icons-material/Edit';
import { getUser } from "../services/jwt-decode";
import { useNavigate } from "react-router-dom";
import "../hojas-de-estilo/lista-tarjetas.css";

export function BasicTableTarjetas() {
  const apiHost = import.meta.env.VITE_API_HOST;
  const [cardData, setCardData] = useState([]);
  const jwtToken = localStorage.getItem("access");
  const currentUser = getUser();
  const navigate = useNavigate();
  useEffect(() => {
    // Aquí deberías hacer una llamada al backend para obtener los datos del usuario
    async function fetchCards() {
      try {
        const param = new URLSearchParams({ user_id: currentUser.user_id });
        const response = await fetch(`${apiHost}/card/?${param.toString()}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }); //Ver si hay que modificar ruta
        const allCards = await response.json();
        console.log(allCards);
        if (Array.isArray(allCards)) {
          setCardData(allCards);
        }
      } catch (error) {
        console.error("Error al cargar el perfil", error);
      }
    }

    fetchCards();
  }, []);

  const handleDelete = async (e) => {
    const { name } = e.target;
    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar esta tarjeta? Esta acción no se puede deshacer."
    );
    if (isConfirmed) {
      try {
        const response = await fetch(`${apiHost}/card/delete/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ id_tarjeta: name }),
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

  const handleEditarTarjeta = (e) => {
    const { name } = e.target;
    navigate(`/editar-tarjetas/${name}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Tipo de tarjeta</TableCell>
            <TableCell align="right">Número de tarjeta</TableCell>
            <TableCell align="right">Saldo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cardData.map((card) => (
            <TableRow
              key={card.id_tarjeta}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">{card.tipo_tarjeta}</TableCell>
              <TableCell align="right">{card.id_tarjeta}</TableCell>
              <TableCell align="right">{card.saldo}</TableCell>
              <TableCell align="right">
                <button
                  type="submit"
                  name={card.id_tarjeta}
                  onClick={handleEditarTarjeta}
                  className="btn btn-primary"
                >
                  Editar
                </button>
              </TableCell>
              <TableCell align="right">
                <button
                  type="submit"
                  name={card.id_tarjeta}
                  onClick={handleDelete}
                  className="btn btn-danger"
                >
                  X
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
