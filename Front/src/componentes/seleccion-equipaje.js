import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Cabina from "../imagenes/cabina.jpg";
import Bodega from "../imagenes/bodega.jpg";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme, selected }) => ({
  maxWidth: 345,
  flex: 1,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
  ...(selected && {
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
  }),
}));

export function SeleccionEquipaje() {
  const [selectedLuggage, setSelectedLuggage] = useState(null);
  const navigate = useNavigate();

  const luggageOptions = [
    {
      type: "cabina",
      title: "Equipaje de cabina",
      image: Cabina,
      description:
        "Un equipaje de mano de máximo 10 kg y 55x40x20 cm. Puedes llevarlo en la cabina del avión.",
      buttonText: "Seleccionar equipaje",
    },
    {
      type: "bodega",
      title: "Equipaje de bodega",
      image: Bodega,
      description:
        "Un equipaje de máximo 23 kg y 158 cm lineales. Se lleva en la bodega del avión.",
      buttonText: "Seleccionar equipaje (10% valor agregado a su tiquete)",
    },
  ];

  const handleContinue = () => {
    navigate("/seleccionar-asientos");
    console.log("Continuando con la selección de asientos");
  };

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ my: 4 }}
      >
        Selección de Equipaje
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {luggageOptions.map((option) => (
          <StyledCard
            key={option.type}
            selected={selectedLuggage === option.type}
          >
            <CardMedia
              component="img"
              alt={option.title}
              height="140"
              image={option.image}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {option.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                fullWidth
                variant={
                  selectedLuggage === option.type ? "contained" : "outlined"
                }
                onClick={() => setSelectedLuggage(option.type)}
              >
                {option.buttonText}
              </Button>
            </CardActions>
          </StyledCard>
        ))}
      </Box>
      {selectedLuggage && (
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 4, fontWeight: "bold", color: "white" }}
        >
          Has seleccionado el equipaje de {selectedLuggage}
        </Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleContinue}
          disabled={!selectedLuggage}
        >
          Continuar con la selección de asientos
        </Button>
      </Box>
    </Container>
  );
}
