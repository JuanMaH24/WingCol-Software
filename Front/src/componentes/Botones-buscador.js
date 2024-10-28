import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export function RowRadioButtonsGroup() {
  // Estado para almacenar el tipo de vuelo seleccionado
  const [tipoVuelo, setTipoVuelo] = React.useState("Ida");

  // Función para manejar los cambios en la selección
  const handleTipoVueloChange = (event) => {
    setTipoVuelo(event.target.value);
    console.log("Tipo de vuelo seleccionado:", event.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="tipo-vuelo-label">Selecciona el tipo de vuelo:</FormLabel>
      <RadioGroup
        row
        aria-labelledby="tipo-vuelo-label"
        name="tipo-vuelo-group"
        value={tipoVuelo} // Conecta el valor al estado
        onChange={handleTipoVueloChange} // Llama al manejador cuando cambia
      >
        <FormControlLabel value="Ida" control={<Radio />} label="Solo ida" />
        <FormControlLabel
          value="Ida y vuelta"
          control={<Radio />}
          label="Ida y vuelta"
        />
      </RadioGroup>
    </FormControl>
  );
}
