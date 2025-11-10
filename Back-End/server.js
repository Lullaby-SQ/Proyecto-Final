// ===========================
//  IMPORTACIONES Y CONFIG
// ===========================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ===========================
//  CONEXIÓN A MONGO ATLAS
// ===========================
// contraseña : iI4sE4BHf2DcOchh
const uri = "mongodb+srv://Lautaro:iI4sE4BHf2DcOchh@lau.fo9mnil.mongodb.net/juegosdb?retryWrites=true&w=majority&appName=Lau";


mongoose
  .connect(uri)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.error("Error al conectar con MongoDB:", err));

// ===========================
//  DEFINICIÓN DEL MODELO
// ===========================
const juegoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  portada: String,
  categorias: [String],
});

const Juego = mongoose.model("Juego", juegoSchema);

// ===========================
//  RUTAS API
// ===========================

// Obtener todos los juegos
app.get("/api/juegos", async (req, res) => {
  try {
    const juegos = await Juego.find();
    res.json(juegos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los juegos" });
  }
});

// Crear un nuevo juego
app.post("/api/juegos", async (req, res) => {
  try {
    const nuevoJuego = new Juego(req.body);
    const guardado = await nuevoJuego.save();
    res.json(guardado);
  } catch (err) {
    res.status(500).json({ error: "Error al crear el juego" });
  }
});

// Actualizar un juego
app.put("/api/juegos/:id", async (req, res) => {
  try {
    const actualizado = await Juego.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el juego" });
  }
});

// Eliminar un juego
app.delete("/api/juegos/:id", async (req, res) => {
  try {
    await Juego.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Juego eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el juego" });
  }
});

// ===========================
//  INICIAR SERVIDOR
// ===========================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});