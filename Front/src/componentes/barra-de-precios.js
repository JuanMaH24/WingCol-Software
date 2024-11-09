import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

const MAX = 20000000;
const MIN = 100000;
const marks = [
  {
    value: MIN,
    label: "",
    style: { color: "black" },
  },
  {
    value: MAX,
    label: "",
    style: { color: "black" },
  },
];

export function BarraDePrecios() {
  const [val, setVal] = React.useState(MIN);
  const handleChange = (_, newValue) => {
    setVal(newValue);
  };

  return (
    <Box sx={{ width: 250 }}>
      <Slider
        style={{ color: "black" }}
        marks={marks}
        step={100000}
        value={val}
        valueLabelDisplay="auto"
        min={MIN}
        max={MAX}
        onChange={handleChange}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          style={{ color: "black" }}
          variant="body2"
          onClick={() => setVal(MIN)}
          sx={{ cursor: "pointer" }}
        >
          {MIN} min
        </Typography>
        <Typography
          style={{ color: "black" }}
          variant="body2"
          onClick={() => setVal(MAX)}
          sx={{ cursor: "pointer" }}
        >
          {MAX} max
        </Typography>
      </Box>
    </Box>
  );
}
