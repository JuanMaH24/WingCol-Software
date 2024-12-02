import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

const MIN_MINUTES = 30;
const MAX_MINUTES = 600; // 10 hours in minutes

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins}min`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}min`;
  }
};

const marks = [
  { value: MIN_MINUTES, label: formatDuration(MIN_MINUTES) },
  { value: 120, label: formatDuration(120) },
  { value: 240, label: formatDuration(240) },
  { value: 360, label: formatDuration(360) },
  { value: 480, label: formatDuration(480) },
  { value: MAX_MINUTES, label: formatDuration(MAX_MINUTES) },
];

export function BarraDeDuracion({ onDuracionChange }) {
  const [duration, setDuration] = React.useState(MIN_MINUTES);

  const handleChange = (event, newValue) => {
    setDuration(newValue);
    if (onDuracionChange) onDuracionChange(newValue);
  };

  return (
    <Box sx={{ width: 300, margin: "0 auto" }}>
      <Slider
        aria-labelledby="flight-duration-slider"
        value={duration}
        min={MIN_MINUTES}
        max={MAX_MINUTES}
        marks={marks}
        step={15}
        valueLabelDisplay="auto"
        valueLabelFormat={formatDuration}
        onChange={handleChange}
      />
    </Box>
  );
}
