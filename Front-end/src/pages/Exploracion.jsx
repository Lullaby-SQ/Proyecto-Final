import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import FormularioValoracion from "../components/FormularioValoracion";
import "../styles/exploracion.css";

function Exploracion() {
  const navigate = useNavigate();
  const [juegos, setJuegos] = useState([]);
  const [juegosFiltrados, setJuegosFiltrados] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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
      setJuegos(data);
      setJuegosFiltrados(data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar por categoría y búsqueda
  useEffect(() => {
    let resultado = juegos;

    if (filtroCategoria !== "Todos") {
      resultado = resultado.filter(j => 
        j.categorias?.includes(filtroCategoria)
      );
    }

    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(j => 
        j.nombre?.toLowerCase().includes(busquedaLower) ||
        j.descripcion?.toLowerCase().includes(busquedaLower)
      );
    }

    setJuegosFiltrados(resultado);
  }, [filtroCategoria, busqueda, juegos]);

  // Modal
  const abrirModal = (juego) => {
    setJuegoSeleccionado(juego);
    setModalAbierto(true);
    document.body.style.overflow = 'hidden';
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setJuegoSeleccionado(null);
    document.body.style.overflow = 'auto';
  };

  const handleGuardarValoracion = async () => {
    await obtenerJuegos(); // Recargar juegos
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
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button 
                className="btn-limpiar" 
                onClick={() => setBusqueda("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="filtro-categorias">
            <label>Categoría:</label>
            <select 
              value={filtroCategoria} 
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="Todos">Todas</option>
              {categorias.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="info-resultados">
          <p>
            {juegosFiltrados.length === 0 
              ? "No se encontraron juegos" 
              : `${juegosFiltrados.length} juego${juegosFiltrados.length !== 1 ? 's' : ''} encontrado${juegosFiltrados.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Grid de juegos */}
        <div className="grid-juegos">
          {juegosFiltrados.length === 0 ? (
            <div className="sin-resultados">
              <h3>No se encontraron juegos</h3>
              <p>Intenta con otra búsqueda o categoría</p>
            </div>
          ) : (
            juegosFiltrados.map((juego) => (
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
                      ✓ En biblioteca
                    </div>
                  )}
                </div>

                <div className="contenido-juego">
                  <h3>{juego.nombre}</h3>
                  
                  <div className="categorias-juego">
                    {juego.categorias?.slice(0, 2).map((cat, i) => (
                      <span key={i} className="categoria-tag">{cat}</span>
                    ))}
                    {juego.categorias?.length > 2 && (
                      <span className="categoria-tag">+{juego.categorias.length - 2}</span>
                    )}
                  </div>

                  {juego.valoracionUsuario?.estrellas > 0 && (
                    <div className="valoracion-previa">
                      <span>Tu valoración:</span>
                      <div className="estrellas-mini">
                        {'★'.repeat(juego.valoracionUsuario.estrellas)}
                        {'☆'.repeat(5 - juego.valoracionUsuario.estrellas)}
                      </div>
                    </div>
                  )}

                  <div className="precio-juego">
                    {juego.tieneDescuento ? (
                      <>
                        <span className="precio-original">${juego.precio.toFixed(2)}</span>
                        <span className="precio-actual">
                          ${(juego.precio * (1 - juego.porcentajeDescuento / 100)).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="precio-normal">${juego.precio.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ MODAL CON COMPONENTE REUTILIZABLE */}
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