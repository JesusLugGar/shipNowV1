import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("ShipNow API V1 - Bienvenido a la API de ShipNow");
});

app.listen(3000, () => {
  console.log("Servidor esta corriendo en puerto 3000");
});