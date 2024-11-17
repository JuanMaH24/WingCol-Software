import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Crear un tema completo
const theme = createTheme({
  palette: {
    primary: {
      main: "#007FFF",
      dark: "#0066CC",
    },
  },
});

export default function BoxSx({
  textoAmarillo = "Asiento primera clase",
  textoRojo = "Asiento ocupado",
  textoVerde = "Asiento seleccionado",
  textoBlanco = "Asiento libre",
  textoGris = "Asiento reservado",
}) {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "", gap: 2, p: 2 }}>
        {/* Caja Amarilla */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 1,
              backgroundColor: "#FFD700",
              border: "1px solid #ccc",
            }}
          />
          <Typography variant="body1">{textoAmarillo}</Typography>
        </Box>

        {/* Caja Roja */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 1,
              backgroundColor: "#FF0000",
            }}
          />
          <Typography variant="body1">{textoRojo}</Typography>
        </Box>

        {/* Caja Verde */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 1,
              backgroundColor: "#00FF00",
            }}
          />
          <Typography variant="body1">{textoVerde}</Typography>
        </Box>

        {/* Caja Blanca */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 1,
              backgroundColor: "#FFFFFF",
              border: "1px solid #ccc",
            }}
          />
          <Typography variant="body1">{textoBlanco}</Typography>
        </Box>

        {/* Caja Gris */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 1,
              backgroundColor: "#484848",
              border: "1px solid #ccc",
            }}
          />
          <Typography variant="body1">{textoGris}</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
