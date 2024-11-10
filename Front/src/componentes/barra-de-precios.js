import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `$${value.toLocaleString()}`;
}

export function BarraDePrecios() {
  const [value, setValue] = React.useState([100000, 1000000]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => "Rango de precios"}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        min={100000}
        max={20000000}
        step={10000}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <span>Mínimo: ${value[0].toLocaleString()}</span>
        <span>Máximo: ${value[1].toLocaleString()}</span>
      </Box>
    </Box>
  );
}
