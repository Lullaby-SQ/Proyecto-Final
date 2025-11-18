import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import FormularioValoracion from '../components/FormularioValoracion';
import '../styles/biblioteca.css';
import '../styles/global.css';

function Biblioteca() {
  // Estados y navegación
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false); // Estado para controlar el modal
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null); // Juego seleccionado para valorar
  const [juegos, setJuegos] = useState([]); // Lista de juegos en la biblioteca
  const [cargando, setCargando] = useState(true); // Estado de carga
  const [filtro, setFiltro] = useState('todos'); // Estado para el filtro de juegos

  // Obtener juegos de la biblioteca
  useEffect(() => {
    obtenerBiblioteca();
  }, []);

  const obtenerBiblioteca = async () => {
    setCargando(true);
    try {
      const res = await fetch('http://localhost:3001/api/juegos/biblioteca'); // Endpoint para obtener la biblioteca del usuario, segun el back-end
      if (!res.ok) throw new Error('Error al cargar biblioteca');
      
      const data = await res.json(); 
      setJuegos(data); 
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar la biblioteca');
    } finally {
      setCargando(false);
    }
  };

  const juegosFiltrados = juegos.filter(juego => {
    if (filtro === 'todos') return true;
    if (filtro === 'completos') return juego.valoracionUsuario?.completado === true;
    if (filtro === 'incompletos') return juego.valoracionUsuario?.completado === false;
    return true;
  });

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
    await obtenerBiblioteca(); // Recargar biblioteca
  };

  // Eliminar juego de la biblioteca
  const eliminarDeBiblioteca = async (juegoId) => {
    if (!window.confirm('¿Eliminar este juego de tu biblioteca?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/juegos/${juegoId}/valorar`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar');

      alert('Juego eliminado de tu biblioteca');
      await obtenerBiblioteca();
      cerrarModal();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el juego');
    }
  };

  if (cargando) {
    return (
      <>
        <Navbar />
        <div className="container-title-biblioteca">
          <h2 className="title-biblioteca">Cargando biblioteca...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="container-title-biblioteca">
        <h2 className="title-biblioteca">Mis Juegos</h2>
      </div>

      <div className="container-subtitle-biblioteca">
        <h3 className="subtitle-biblioteca">Todos tus juegos:</h3>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="todos">Todos ({juegos.length})</option>
          <option value="completos">
            Completos ({juegos.filter(j => j.valoracionUsuario?.completado === true).length})
          </option>
          <option value="incompletos">
            Incompletos ({juegos.filter(j => j.valoracionUsuario?.completado === false).length})
          </option>
        </select>
      </div>

      <div className="container-biblioteca">
        {juegosFiltrados.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '1.2em', color: '#b8c5d6' }}>
              {filtro === 'todos' 
                ? 'No hay juegos en tu biblioteca. ¡Valora juegos desde la página principal!'
                : `No hay juegos ${filtro}`}
            </p>
            <button 
              className="feature-btn" 
              onClick={() => navigate('/')}
              style={{ marginTop: '20px' }}
            >
              Explorar Juegos
            </button>
          </div>
        ) : (
          juegosFiltrados.map((juego) => (
            <div 
              className="card-biblioteca" 
              key={juego._id}
              onClick={() => abrirModal(juego)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-image-biblioteca">
                <img 
                  src={juego.portada || '/Front-end/images/placeholder.jpg'} 
                  alt={juego.nombre}
                  onError={(e) => e.target.src = '/Front-end/images/placeholder.jpg'}
                />
               
                <div className={`estado ${juego.valoracionUsuario?.completado ? 'completado' : 'incompleto'}`}>
                  {juego.valoracionUsuario?.completado ? '✓ Completo' : '⏳ Incompleto'}
                </div>
              </div>
              <div className="card-content-biblioteca">
                <h2 className="card-title">{juego.nombre}</h2>
                <div className="price-container">
                  <span className="tiempo">
                    {juego.valoracionUsuario?.horasJugadas || 0} Horas
                  </span>
                </div>
              </div>
            </div>
          ))
        )}

        <div 
          className="card-biblioteca card-agregar" 
          onClick={() => navigate('/explora')} 
          style={{ cursor: 'pointer' }}
        >
          <div className="card-content-biblioteca">
            <h2 className="card-title">+ Explora Nuevos Juegos</h2>
          </div>
        </div>
      </div>

      {modalAbierto && juegoSeleccionado && (
        <div style={{ position: 'relative' }}>
          <FormularioValoracion 
            juegoSeleccionado={juegoSeleccionado}
            onCerrar={cerrarModal}
            onGuardar={handleGuardarValoracion}
          />
          
          {/* Botón de eliminar (se superpone al formulario) */}
          <button 
            className="btn-eliminar-biblioteca"
            onClick={() => eliminarDeBiblioteca(juegoSeleccionado._id)}
            style={{
              position: 'fixed',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2001,
              background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
              border: 'none',
              color: 'white',
              padding: '12px 30px',
              borderRadius: '12px',
              fontSize: '1em',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 5px 20px rgba(231, 76, 60, 0.5)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(-50%) scale(1.05)';
              e.target.style.boxShadow = '0 8px 30px rgba(231, 76, 60, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(-50%) scale(1)';
              e.target.style.boxShadow = '0 5px 20px rgba(231, 76, 60, 0.5)';
            }}
          >
            Eliminar de Biblioteca
          </button>
        </div>
      )}
    </>
  );
}

export default Biblioteca;