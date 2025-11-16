// ===========================
//  IMPORTACIONES Y CONFIG
// ===========================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// Cargamos variables de entorno desde .env
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({limit: '50mb'})); // Aumentamos límite para imágenes Base64
app.use(express.urlencoded({limit: '50mb', extended: true}));

// ===========================
//  CONEXIÓN A MONGO ATLAS (desde .env)
// ===========================
// Guardamos la URI de conexión en la variable de entorno MONGO_URI.
// Si no se especifica, hacemos fallback a una base local para desarrollo.
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/juegosdb';

if (!process.env.MONGO_URI) {
  console.warn('⚠️  No se ha encontrado MONGO_URI en .env: se usará la URI local por defecto.');
}

mongoose
  .connect(uri)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar con MongoDB:", err));

// ===========================
//  DEFINICIÓN DEL MODELO ACTUALIZADO
// ===========================
const juegoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, default: "" },
  portada: { type: String, default: "" },
  categorias: [String],
  
  // Campos de precio
  precio: { 
    type: Number, 
    default: 0,
    min: 0
  },
  tieneDescuento: { 
    type: Boolean, 
    default: false 
  },
  porcentajeDescuento: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100
  },
  
  //Campos de valoración del usuario
  valoracionUsuario: {
    estrellas: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    horasJugadas: {
      type: Number,
      min: 0,
      default: 0
    },
    completado: {
      type: Boolean,
      default: false
    },
    reseña: {
      type: String,
      default: ""
    },
    fechaValoracion: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Método virtual para calcular precio con descuento
juegoSchema.virtual('precioFinal').get(function() {
  if (this.tieneDescuento && this.porcentajeDescuento > 0) {
    return this.precio * (1 - this.porcentajeDescuento / 100);
  }
  return this.precio;
});

// Método virtual para saber si el juego está en la biblioteca
juegoSchema.virtual('enBiblioteca').get(function() {
  return this.valoracionUsuario.fechaValoracion !== null;
});

// Aseguramos que los virtuals se incluyan en JSON
juegoSchema.set('toJSON', { virtuals: true });
juegoSchema.set('toObject', { virtuals: true });

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

//Obtener solo juegos con descuento
app.get("/api/juegos/descuentos", async (req, res) => {
  try {
    const juegosConDescuento = await Juego.find({ 
      tieneDescuento: true,
      porcentajeDescuento: { $gt: 0 } // Mayor que 0
    }).limit(10); // Limitamos a 10 para el carrusel
    
    res.json(juegosConDescuento);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener juegos con descuento" });
  }
});

//Obtener solo juegos en la biblioteca (con valoración)
app.get("/api/juegos/biblioteca", async (req, res) => {
  try {
    const juegosBiblioteca = await Juego.find({ 
      'valoracionUsuario.fechaValoracion': { $ne: null } 
    });
    
    res.json(juegosBiblioteca);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener biblioteca" });
  }
});

//Obtener un juego por ID
app.get("/api/juegos/:id", async (req, res) => {
  try {
    const juego = await Juego.findById(req.params.id);
    if (!juego) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }
    res.json(juego);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el juego" });
  }
});

//Crear un nuevo juego
app.post("/api/juegos", async (req, res) => {
  try {
    const nuevoJuego = new Juego(req.body);
    const guardado = await nuevoJuego.save();
    res.json(guardado);
  } catch (err) {
    res.status(500).json({ error: "Error al crear el juego", details: err.message });
  }
});

// Actualizar un juego
app.put("/api/juegos/:id", async (req, res) => {
  try {
    const actualizado = await Juego.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!actualizado) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }
    
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el juego" });
  }
});

//Eliminar un juego
app.delete("/api/juegos/:id", async (req, res) => {
  try {
    const eliminado = await Juego.findByIdAndDelete(req.params.id);
    
    if (!eliminado) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }
    
    res.json({ mensaje: "Juego eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el juego" });
  }
});

// AGREGAR/ACTUALIZAR VALORACIÓN DE UN JUEGO
app.post("/api/juegos/:id/valorar", async (req, res) => {
  try {
    const { estrellas, horasJugadas, completado, reseña } = req.body;
    
    const juegoActualizado = await Juego.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          'valoracionUsuario.estrellas': estrellas || 0,
          'valoracionUsuario.horasJugadas': horasJugadas || 0,
          'valoracionUsuario.completado': completado === 'si' || completado === true,
          'valoracionUsuario.reseña': reseña || '',
          'valoracionUsuario.fechaValoracion': new Date()
        }
      },
      { new: true, runValidators: true }
    );
    
    if (!juegoActualizado) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }
    
    res.json(juegoActualizado);
  } catch (err) {
    res.status(500).json({ error: "Error al guardar valoración", details: err.message });
  }
});

// ELIMINAR VALORACIÓN (quitar de biblioteca)
app.delete("/api/juegos/:id/valorar", async (req, res) => {
  try {
    const juegoActualizado = await Juego.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          'valoracionUsuario.estrellas': 0,
          'valoracionUsuario.horasJugadas': 0,
          'valoracionUsuario.completado': false,
          'valoracionUsuario.reseña': '',
          'valoracionUsuario.fechaValoracion': null
        }
      },
      { new: true }
    );
    
    if (!juegoActualizado) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }
    
    res.json({ mensaje: "Valoración eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar valoración" });
  }
});

// ===========================
//  INICIAR SERVIDOR
// ===========================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});