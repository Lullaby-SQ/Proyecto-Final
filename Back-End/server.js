// ===========================
//  IMPORTACIONES Y CONFIG
// ===========================
const express = require("express"); // Es un framework que facilita la creación de servidores en Node.js
const mongoose = require("mongoose"); // Permite la conexión con MongoDB
const cors = require("cors"); // Permite la comunicación entre el front-end y back-end con diferentes puertos
require('dotenv').config(); // Carga variables de entorno desde un archivo .env, (información sensible)

const app = express(); // Crear la aplicación Express
const PORT = 3001; // Puerto donde correrá el servidor

// Middleware
app.use(cors()); // Permite conexión entre frontend y backend
app.use(express.json({limit: '50mb'})); // Permite que el backend reciba datos desde los formularios en formato json con un limite aumentado
app.use(express.urlencoded({limit: '50mb', extended: true})); // Permite que el backend reciba datos desde los formularios en formato urlencoded con un limite aumentado

//  CONEXIÓN A MONGO ATLAS
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/juegosdb'; // Usar URI de .env o local por defecto

if (!process.env.MONGO_URI) {
  console.warn('No se ha encontrado MONGO_URI en .env: se usará la URI local por defecto.');
} // En caso de que no se encuentre el .env, te envia un mensaje con consola

mongoose 
  .connect(uri)
  .then(() => console.log("Conectado a MongoDB")) // Mensaje de conexión exitosa
  .catch((err) => console.error("Error al conectar con MongoDB:", err)); // Mensaje de error en caso de fallo

//  Modelo de datos - Juego, se determinan los datos que puede tener un juego y su estructura.
const juegoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, default: "" },
  portada: { type: String, default: "" },
  categorias: [String],
  
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

// Calcula el precio si el juego tiene descuento
juegoSchema.virtual('precioFinal').get(function() {
  if (this.tieneDescuento && this.porcentajeDescuento > 0) {
    return this.precio * (1 - this.porcentajeDescuento / 100);
  }
  return this.precio;
});

// Método para saber si un juego está en la biblioteca del usuario (o sea, si ha sido valorado)
juegoSchema.virtual('enBiblioteca').get(function() {
  return this.valoracionUsuario.fechaValoracion !== null;
});

juegoSchema.set('toJSON', { virtuals: true });
juegoSchema.set('toObject', { virtuals: true });
//activa los campos virtuales en las respuestas JSON

const Juego = mongoose.model("Juego", juegoSchema);
//permite que podamos interactuar con la colección de juegos en la base de datos

// ===========================
//  RUTAS API
// ===========================

app.get("/api/juegos", async (req, res) => {
  try {
    const juegos = await Juego.find();
    res.json(juegos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los juegos" });
  }
}); // obtiene todos los juegos de la base de datos y los guarda en un json, en caso de error manda un mensaje 500

app.get("/api/juegos/descuentos", async (req, res) => {
  try {
    const juegosConDescuento = await Juego.find({ 
      tieneDescuento: true,
      porcentajeDescuento: { $gt: 0 }
    }).limit(10);
    
    res.json(juegosConDescuento);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener juegos con descuento" });
  }
}); //obtiene todos los juegos que tengan descuento, con un limite de hasta 10 juegos

app.get("/api/juegos/biblioteca", async (req, res) => {
  try {
    const juegosBiblioteca = await Juego.find({ 
      'valoracionUsuario.fechaValoracion': { $ne: null } 
    });
    
    res.json(juegosBiblioteca);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener biblioteca" });
  }
}); // obtiene todos los juegos que el usuario ha valorado (en su biblioteca)

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
}); // obtiene un juego específico por su ID

app.post("/api/juegos", async (req, res) => {
  try {
    const nuevoJuego = new Juego(req.body);
    const guardado = await nuevoJuego.save();
    res.json(guardado);
  } catch (err) {
    res.status(500).json({ error: "Error al crear el juego", details: err.message });
  }
}); // Crea un nuevo juego con los datos enviados mediante un formulario

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
}); // Actualiza un juego existente con los datos enviados mediante un formulario

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
}); // Elimina un juego específico por su ID

app.post("/api/juegos/:id/valorar", async (req, res) => {
  try {
    const { estrellas, horasJugadas, completado, reseña } = req.body;
    
    let estadoCompletado = false;
    if (completado === 'si' || completado === true || completado === 'true') {
      estadoCompletado = true;
    }
    
    const juegoActualizado = await Juego.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          'valoracionUsuario.estrellas': estrellas || 0,
          'valoracionUsuario.horasJugadas': horasJugadas || 0,
          'valoracionUsuario.completado': estadoCompletado, 
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
}); // GUARDAR VALORACIÓN DEL USUARIO PARA UN JUEGO ESPECÍFICO

// ELIMINAR VALORACIÓN
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