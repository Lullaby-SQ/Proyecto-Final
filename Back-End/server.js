// ===========================
//  IMPORTACIONES Y CONFIG
// ===========================
const express = require("express"); // Framework para crear el servidor
const mongoose = require("mongoose"); // Conexión a MongoDB
const cors = require("cors"); // Permite recibir peticiones desde el front-end, permite conectarse desde otro dominio

const app = express(); // Crear la aplicación Express
const PORT = 3001; // Puerto del servidor

// Middleware
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json({limit: '50mb'})); // Aumentamos límite para imágenes Base64, interpretar JSON
app.use(express.urlencoded({limit: '50mb', extended: true})); // Para interpretar datos de formularios

// ===========================
//  CONEXIÓN A MONGO ATLAS    
// ===========================
//Usuario: Lautaro, Contraseña: iI4sE4BHf2DcOchh, Base de datos: juegosdb
const uri = "mongodb+srv://Lautaro:iI4sE4BHf2DcOchh@lau.fo9mnil.mongodb.net/juegosdb?retryWrites=true&w=majority&appName=Lau";

mongoose
  .connect(uri) // ejecuta la conexión con mongo db
  .then(() => console.log("Conectado a MongoDB Atlas")) // Si la conexión a la base de datos se dió correctamente muestra el siguiente mensaje en la terminal
  .catch((err) => console.error("Error al conectar con MongoDB:", err)); // En caso de error de conexión muestra el siguiente error

// =====================================
//  DEFINICIÓN DEL MODELO DE JUEGO
// =====================================
const juegoSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // Definimos que tenga un nombre de tipo string y que se necesario para el registro.
  descripcion: { type: String, default: "" }, // Definimos una descripción del juego
  portada: { type: String, default: "" }, // URL o Base64 de la imagen de portada
  categorias: [String], // Array de categorías que puede tener un juego
  
  // Campos de precio
  precio: { 
    type: Number, 
    default: 0,
    min: 0
  }, // Definimos el precio del juego, con un valor inicial de 0
  tieneDescuento: { 
    type: Boolean, 
    default: false 
  }, // Definimos el desceuunto del juego si es que tiene o no, por defecto los juegos vienen sin descuento.
  porcentajeDescuento: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100
  }, // en caso de descuento se le aplicara un porcentaje de descuento, por defecto 0, y con un maximo de 100%
  
  //Campos de valoración del usuario - solo para saber si el usuario tiene el juego en su biblioteca
  valoracionUsuario: {
    estrellas: { 
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }, // Definimos un puntaje de estrellas de 0 a 5
    horasJugadas: {
      type: Number,
      min: 0,
      default: 0
    }, // Definimos las horas jugadas, con un valor inicial de 0
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