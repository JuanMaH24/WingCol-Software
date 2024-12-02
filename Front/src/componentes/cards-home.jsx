import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Madrid from "../imagenes/Madrid.jpg";
import NewYork from "../imagenes/New-York.jpg";
import Londres from "../imagenes/Londres.jpg";
import "../hojas-de-estilo/CardStyles.css";

const cityData = [
  {
    image: Madrid,
    title: "Madrid, España",
    description:
      "Descubre la vibrante capital española, con su rica cultura, arquitectura histórica y deliciosa gastronomía.",
  },
  {
    image: NewYork,
    title: "Nueva York, EE.UU.",
    description:
      "La ciudad que nunca duerme te espera con sus rascacielos icónicos, diversidad cultural y entretenimiento sin fin.",
  },
  {
    image: Londres,
    title: "Londres, Reino Unido",
    description:
      "Sumérgete en la historia y modernidad de una de las ciudades más influyentes del mundo.",
  },
];

export default function ImgMediaCard() {
  return (
    <div className="cards-container">
      {cityData.map((city, index) => (
        <Card key={index} className="travel-card">
          <CardMedia
            component="img"
            alt={city.title}
            height="200"
            image={city.image}
            className="card-image"
          />
          <CardContent className="card-content">
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="card-title"
            >
              {city.title}
            </Typography>
            <Typography variant="body2" className="card-description">
              {city.description}
            </Typography>
          </CardContent>
          <CardActions className="card-actions"></CardActions>
        </Card>
      ))}
    </div>
  );
}
