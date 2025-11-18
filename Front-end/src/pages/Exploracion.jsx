import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import FormularioValoracion from "../components/FormularioValoracion";
import "../styles/exploracion.css";


// Página de exploración de juegos
function Exploracion() {
  const navigate = useNavigate(); // Hook para navegación
  const [juegos, setJuegos] = useState([]); // Todos los juegos
  const [juegosFiltrados, setJuegosFiltrados] = useState([]); // Juegos después de aplicar filtros
  const [filtroCategoria, setFiltroCategoria] = useState("Todos"); // Categoría seleccionada
  const [busqueda, setBusqueda] = useState(""); // Término de búsqueda
  const [modalAbierto, setModalAbierto] = useState(false); // Estado del modal
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null); // Juego seleccionado para valorar
  const [cargando, setCargando] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  const categorias = ["Acción", "Aventura", "RPG", "Estrategia", "Simulación", "Metroidvania"];

  // Obtener todos los juegos
  useEffect(() => {
    obtenerJuegos();
  }, []);

  const obtenerJuegos = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/api/juegos");
      if (!res.ok) throw new Error("Error al cargar juegos");
      
      const data = await res.json();
      setJuegos(data); // Guardar todos los juegos
      setJuegosFiltrados(data); // Inicialmente, todos los juegos están filtrados
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar por categoría y búsqueda, cada vez que cambian se actualiza la lista
  useEffect(() => {
    let resultado = juegos;

    if (filtroCategoria !== "Todos") { // Si se selecciona una categoría específica
      resultado = resultado.filter(j => 
        j.categorias?.includes(filtroCategoria) // Filtrar por categoría
      );
    }

    if (busqueda.trim()) { // Si hay un término de búsqueda
      const busquedaLower = busqueda.toLowerCase(); // Convertir a minúsculas para comparación
      resultado = resultado.filter(j =>  // Filtrar por nombre 
        j.nombre?.toLowerCase().includes(busquedaLower) 
      );
    }

    setJuegosFiltrados(resultado); // Actualizar la lista de juegos filtrados
  }, [filtroCategoria, busqueda, juegos]);

  // Modal - abrir
  const abrirModal = (juego) => {
    setJuegoSeleccionado(juego);
    setModalAbierto(true);
    document.body.style.overflow = 'hidden';
  };

  // Modal - cerrar
  const cerrarModal = () => {
    setModalAbierto(false);
    setJuegoSeleccionado(null);
    document.body.style.overflow = 'auto';
  };

  const handleGuardarValoracion = async () => {
    await obtenerJuegos(); // Recargar juegos, cuando se guarda una valoración
  };

  if (cargando) {
    return (
      <>
        <Navbar />
        <div className="exploracion-page">
          <div className="cargando-container">
            <h2>Cargando juegos...</h2>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="exploracion-page">
          <div className="error-container">
            <h2>Error al cargar juegos</h2>
            <p>{error}</p>
            <button onClick={obtenerJuegos} className="btn-reintentar">Reintentar</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="exploracion-page">
        <div className="exploracion-header">
          <h1>Explora Nuestra Colección</h1>
          <p>Descubre juegos increíbles y comparte tu opinión</p>
        </div>

        {/* Controles de búsqueda y filtrado */}
        <div className="controles-exploracion">
          <div className="barra-busqueda">
            <input
              type="text"
              placeholder="Buscar juegos por nombre..."
              value={busqueda} // Valor del input de búsqueda
              onChange={(e) => setBusqueda(e.target.value)}  // Actualizar estado de búsqueda
            />
            {busqueda && (
              <button 
                className="btn-limpiar" 
                onClick={() => setBusqueda("")}
              >
                ✕
              </button> // Botón para limpiar la búsqueda
            )}
          </div>

          <div className="filtro-categorias">
            <label>Categoría:</label>
            <select 
              value={filtroCategoria}  // Valor del select de categorías
              onChange={(e) => setFiltroCategoria(e.target.value)} // Actualizar estado de categoría
            >
              <option value="Todos">Todas</option>
              {categorias.map((cat, i) => ( // recorre las categorías
                <option key={i} value={cat}>{cat}</option> // Opciones de categorías
              ))}
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="info-resultados">
          <p>
            {juegosFiltrados.length === 0  // Si no hay juegos encontrados
              ? "No se encontraron juegos" 
              : `${juegosFiltrados.length} juego${juegosFiltrados.length !== 1 ? 's' : ''} encontrado${juegosFiltrados.length !== 1 ? 's' : ''}` // Contador con pluralización adecuada
            }
          </p>
        </div>

        {/* Grid de juegos */}
        <div className="grid-juegos">
          {juegosFiltrados.length === 0 ? ( // Si no hay juegos filtrados
            <div className="sin-resultados">
              <h3>No se encontraron juegos</h3>
              <p>Intenta con otra búsqueda o categoría</p>
            </div>
          ) : (
            juegosFiltrados.map((juego) => ( // Recorrer los juegos filtrados y crea una tarjeta para cada uno
              <div 
                key={juego._id}
                className="tarjeta-juego"
                onClick={() => abrirModal(juego)}
              >
                <div className="imagen-juego">
                  <img 
                    src={juego.portada || '/Front-end/images/placeholder.jpg'} 
                    alt={juego.nombre}
                    onError={(e) => e.target.src = '/Front-end/images/placeholder.jpg'}
                  />
                  {juego.tieneDescuento && (
                    <div className="badge-descuento">
                      -{juego.porcentajeDescuento}%
                    </div>
                  )}
                  {juego.valoracionUsuario?.fechaValoracion && (
                    <div className="badge-biblioteca">
                      En biblioteca
                    </div>
                  )}
                </div>

                <div className="contenido-juego">
                  <h3>{juego.nombre}</h3>
                  
                  <div className="categorias-juego">
                    {juego.categorias?.slice(0, 2).map((cat, i) => ( // Muestra hasta 2 categorías
                      <span key={i} className="categoria-tag">{cat}</span>
                    ))}
                    {juego.categorias?.length > 2 && ( // Si hay más de 2 categorías, muestra un indicador de cuantas más
                      <span className="categoria-tag">+{juego.categorias.length - 2}</span>
                    )}
                  </div>

                  {juego.valoracionUsuario?.estrellas > 0 && ( // Mostrar valoración previa si existe
                    <div className="valoracion-previa">
                      <span>Tu valoración:</span>
                      <div className="estrellas-mini">
                        {'★'.repeat(juego.valoracionUsuario.estrellas)}
                        {'☆'.repeat(5 - juego.valoracionUsuario.estrellas)}
                      </div>
                    </div>
                  )}

                  <div className="precio-juego">
                    {juego.tieneDescuento ? ( // Mostrar precio con descuento si tiene
                      <>
                        <span className="precio-original">${juego.precio.toFixed(2)}</span>
                        <span className="precio-actual">
                          ${(juego.precio * (1 - juego.porcentajeDescuento / 100)).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="precio-normal">${juego.precio.toFixed(2)}</span> // Precio normal
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL CON COMPONENTE REUTILIZABLE */}
      {modalAbierto && juegoSeleccionado && (
        <FormularioValoracion 
          juegoSeleccionado={juegoSeleccionado}
          onCerrar={cerrarModal}
          onGuardar={handleGuardarValoracion}
        />
      )}
    </>
  );
}

export default Exploracion;