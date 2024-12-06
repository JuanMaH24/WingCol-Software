import React from "react";

export function SeatLegend() {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      margin: "20px 0",
    },
    legendItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    box: {
      width: "20px",
      height: "20px",
      borderRadius: "4px",
    },
    text: {
      fontSize: "14px",
      color: "#fff",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.legendItem}>
        <div style={{ ...styles.box, backgroundColor: "green" }}> </div>
        <span style={styles.text}>Disponible</span>
      </div>
      <div style={styles.legendItem}>
        <div style={{ ...styles.box, backgroundColor: "yellow" }}> </div>
        <span style={styles.text}>Reservado</span>
      </div>
      <div style={styles.legendItem}>
        <div style={{ ...styles.box, backgroundColor: "red" }}> </div>
        <span style={styles.text}>Ocupado</span>
      </div>
      <div style={styles.legendItem}>
        <div style={{ ...styles.box, backgroundColor: "blue" }}> </div>
        <span style={styles.text}>Mi asiento</span>
      </div>
    </div>
  );
}