import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import "../styles/exploracion.css";

function Exploracion() {
  const navigate = useNavigate();
  const [juegos, setJuegos] = useState([]);
  const [juegosFiltrados, setJuegosFiltrados] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
  const [valorEstrellas, setValorEstrellas] = useState(0);
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

    // Filtrar por categoría
    if (filtroCategoria !== "Todos") {
      resultado = resultado.filter(j => 
        j.categorias?.includes(filtroCategoria)
      );
    }

    // Filtrar por búsqueda
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
    setValorEstrellas(juego.valoracionUsuario?.estrellas || 0);
    setModalAbierto(true);
    document.body.style.overflow = 'hidden';
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setJuegoSeleccionado(null);
    setValorEstrellas(0);
    document.body.style.overflow = 'auto';
  };

  const handleEstrellaClick = (valor) => {
    setValorEstrellas(valor);
  };

  // Enviar valoración
  const handleSubmitValoracion = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const datos = {
      estrellas: valorEstrellas,
      horasJugadas: parseFloat(formData.get('horas')) || 0,
      completado: formData.get('completado'),
      reseña: formData.get('reseña')
    };
    
    try {
      const response = await fetch(`http://localhost:3001/api/juegos/${juegoSeleccionado._id}/valorar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      if (!response.ok) throw new Error('Error al guardar valoración');

      alert(`¡Reseña de "${juegoSeleccionado.nombre}" guardada en tu biblioteca!`);
      await obtenerJuegos();
      cerrarModal();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la reseña. Por favor intenta de nuevo.');
    }
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

      {/* Modal de valoración */}
      {modalAbierto && juegoSeleccionado && (
        <div className="modal-exploracion-overlay">
          <div className="modal-exploracion">
            <button className="btn-cerrar-modal" onClick={cerrarModal}>✕</button>

            <div className="modal-contenido">
              {/* Información del juego */}
              <div className="seccion-info">
                <h2>{juegoSeleccionado.nombre}</h2>
                
                <div className="imagen-modal">
                  <img 
                    src={juegoSeleccionado.portada || '/Front-end/images/placeholder.jpg'} 
                    alt={juegoSeleccionado.nombre}
                    onError={(e) => e.target.src = '/Front-end/images/placeholder.jpg'}
                  />
                </div>

                <div className="precio-modal">
                  {juegoSeleccionado.tieneDescuento ? (
                    <>
                      <span className="precio-original-modal">
                        ${juegoSeleccionado.precio.toFixed(2)}
                      </span>
                      <span className="precio-actual-modal">
                        ${(juegoSeleccionado.precio * (1 - juegoSeleccionado.porcentajeDescuento / 100)).toFixed(2)}
                      </span>
                      <span className="descuento-badge-modal">
                        -{juegoSeleccionado.porcentajeDescuento}%
                      </span>
                    </>
                  ) : (
                    <span className="precio-normal-modal">
                      ${juegoSeleccionado.precio.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="descripcion-modal">
                  <h3>Descripción</h3>
                  <p>{juegoSeleccionado.descripcion || "Sin descripción disponible"}</p>
                </div>

                <div className="categorias-modal">
                  <h3>Categorías</h3>
                  <div className="lista-categorias">
                    {juegoSeleccionado.categorias?.map((cat, i) => (
                      <span key={i} className="cat-badge">{cat}</span>
                    )) || <span>Sin categorías</span>}
                  </div>
                </div>
              </div>

              {/* Formulario de valoración */}
              <div className="seccion-valoracion-form">
                <h2>
                  {juegoSeleccionado.valoracionUsuario?.fechaValoracion 
                    ? "Editar tu reseña" 
                    : "Agrega tu reseña"
                  }
                </h2>

                <form onSubmit={handleSubmitValoracion}>
                  {/* Estrellas */}
                  <div className="campo-estrellas">
                    <label>Tu calificación:</label>
                    <div className="estrellas-selector">
                      {[1, 2, 3, 4, 5].map((valor) => (
                        <span
                          key={valor}
                          className={`estrella-select ${valorEstrellas >= valor ? 'activa' : ''}`}
                          onClick={() => handleEstrellaClick(valor)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Horas jugadas */}
                  <div className="campo-form">
                    <label htmlFor="horas-modal">Horas jugadas:</label>
                    <input 
                      type="number" 
                      id="horas-modal" 
                      name="horas" 
                      min="0" 
                      step="0.5"
                      placeholder="¿Cuántas horas has jugado?"
                      defaultValue={juegoSeleccionado.valoracionUsuario?.horasJugadas || 0}
                      required
                    />
                  </div>

                  {/* Completado */}
                  <div className="campo-form">
                    <label htmlFor="completado-modal">Estado del juego:</label>
                    <select 
                      id="completado-modal" 
                      name="completado"
                      defaultValue={juegoSeleccionado.valoracionUsuario?.completado ? 'si' : 'no'}
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="si">✓ Completado</option>
                      <option value="no">⏳ En progreso</option>
                    </select>
                  </div>

                  {/* Reseña */}
                  <div className="campo-form">
                    <label htmlFor="reseña-modal">Tu reseña:</label>
                    <textarea 
                      id="reseña-modal" 
                      name="reseña" 
                      rows="5"
                      placeholder="Comparte tu experiencia con este juego..."
                      defaultValue={juegoSeleccionado.valoracionUsuario?.reseña || ''}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-guardar-resena">
                    {juegoSeleccionado.valoracionUsuario?.fechaValoracion 
                      ? "Actualizar Reseña" 
                      : "Guardar Reseña"
                    }
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Exploracion;