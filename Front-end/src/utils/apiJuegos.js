// ============================================
// FUNCIONES CRUD PARA GESTIÓN DE JUEGOS
// ============================================
// Este archivo contiene todas las funciones necesarias para:
// - Crear juegos
// - Leer/Obtener juegos
// - Actualizar juegos
// - Eliminar juegos
//
// INSTRUCCIONES DE USO FUTURO:
// 1. Reemplaza 'URL_API' con tu endpoint real
// 2. Importa las funciones que necesites en tus componentes
// 3. Ejemplo: import { obtenerJuegos, crearJuego } from '../utils/apiJuegos'
// ============================================

const URL_API = "http://localhost:3000/api/juegos";

// ============================================
// OBTENER TODOS LOS JUEGOS (READ)
// ============================================
// Uso: const juegos = await obtenerJuegos();
export const obtenerJuegos = async () => {
  try {
    const response = await fetch(URL_API);
    const data = await response.json();
    return data.data || data; // Ajusta según tu estructura de respuesta
  } catch (error) {
    console.error("Error al obtener juegos:", error);
    return [];
  }
};

// ============================================
// OBTENER UN JUEGO POR ID (READ)
// ============================================
// Uso: const juego = await obtenerJuegoPorId("123abc");
export const obtenerJuegoPorId = async (id) => {
  try {
    const response = await fetch(`${URL_API}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al obtener juego ${id}:`, error);
    return null;
  }
};

// ============================================
// CREAR NUEVO JUEGO (CREATE)
// ============================================
// Uso: 
// const nuevoJuego = {
//   nombre: "Juego X",
//   descripcion: "Descripción",
//   genero: "Acción",
//   año: 2024,
//   completado: false,
//   horasJugadas: 0,
//   puntuacion: 0,
//   reseñas: []
// };
// await crearJuego(nuevoJuego);
export const crearJuego = async (juegoData) => {
  try {
    const response = await fetch(URL_API, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(juegoData)
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Juego creado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al crear juego:", error);
    throw error;
  }
};

// ============================================
// ACTUALIZAR JUEGO EXISTENTE (UPDATE)
// ============================================
// Uso:
// const datosActualizados = {
//   nombre: "Nuevo nombre",
//   horasJugadas: 50,
//   completado: true
// };
// await actualizarJuego("123abc", datosActualizados);
export const actualizarJuego = async (id, juegoData) => {
  try {
    const response = await fetch(`${URL_API}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(juegoData)
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Juego actualizado exitosamente:", data);
    return data;
  } catch (error) {
    console.error(`Error al actualizar juego ${id}:`, error);
    throw error;
  }
};

// ============================================
// ELIMINAR JUEGO (DELETE)
// ============================================
// Uso: await eliminarJuego("123abc");
export const eliminarJuego = async (id) => {
  try {
    // Confirmación opcional (puedes manejarla en el componente)
    const response = await fetch(`${URL_API}/${id}`, {
      method: "DELETE"
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    console.log(`Juego ${id} eliminado exitosamente`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar juego ${id}:`, error);
    throw error;
  }
};

// ============================================
// FILTRAR JUEGOS (BÚSQUEDA)
// ============================================
// Uso: const resultados = filtrarJuegos(juegos, "hollow");
export const filtrarJuegos = (juegos, textoBusqueda) => {
  if (!textoBusqueda) return juegos;
  
  const busqueda = textoBusqueda.toLowerCase();
  return juegos.filter(juego => 
    juego.nombre?.toLowerCase().includes(busqueda) ||
    juego.descripcion?.toLowerCase().includes(busqueda) ||
    juego.genero?.toLowerCase().includes(busqueda)
  );
};

// ============================================
// ORDENAR JUEGOS
// ============================================
// Uso: const ordenados = ordenarJuegos(juegos, "nombre");
export const ordenarJuegos = (juegos, criterio) => {
  const copiaJuegos = [...juegos];
  
  switch(criterio) {
    case "nombre":
      return copiaJuegos.sort((a, b) => 
        a.nombre.localeCompare(b.nombre)
      );
    case "año":
      return copiaJuegos.sort((a, b) => b.año - a.año);
    case "puntuacion":
      return copiaJuegos.sort((a, b) => 
        (b.puntuacion || 0) - (a.puntuacion || 0)
      );
    case "horas":
      return copiaJuegos.sort((a, b) => 
        (b.horasJugadas || 0) - (a.horasJugadas || 0)
      );
    default:
      return copiaJuegos;
  }
};

// ============================================
// EJEMPLO DE USO EN UN COMPONENTE
// ============================================
/*
import { useState, useEffect } from 'react';
import { 
  obtenerJuegos, 
  crearJuego, 
  actualizarJuego, 
  eliminarJuego,
  filtrarJuegos 
} from '../utils/apiJuegos';

function MiComponente() {
  const [juegos, setJuegos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Cargar juegos al montar el componente
  useEffect(() => {
    const cargarJuegos = async () => {
      const datos = await obtenerJuegos();
      setJuegos(datos);
    };
    cargarJuegos();
  }, []);

  // Agregar nuevo juego
  const handleAgregar = async (nuevoJuego) => {
    const juegoCreado = await crearJuego(nuevoJuego);
    setJuegos([...juegos, juegoCreado]);
  };

  // Editar juego
  const handleEditar = async (id, datosActualizados) => {
    await actualizarJuego(id, datosActualizados);
    const datosActualizados = await obtenerJuegos();
    setJuegos(datosActualizados);
  };

  // Eliminar juego
  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar este juego?")) {
      await eliminarJuego(id);
      setJuegos(juegos.filter(j => j._id !== id));
    }
  };

  // Filtrar juegos
  const juegosFiltrados = filtrarJuegos(juegos, busqueda);

  return (
    <div>
      <input 
        value={busqueda} 
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar..."
      />
      {juegosFiltrados.map(juego => (
        <div key={juego._id}>
          <h3>{juego.nombre}</h3>
          <button onClick={() => handleEditar(juego._id, {...})}>Editar</button>
          <button onClick={() => handleEliminar(juego._id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
*/