import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/biblioteca.css';
import '../styles/global.css';

function Biblioteca() {
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
  const [valorEstrellas, setValorEstrellas] = useState(0);
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  //Obtener juegos de la biblioteca
  useEffect(() => {
    obtenerBiblioteca();
  }, []);

  const obtenerBiblioteca = async () => {
    setCargando(true);
    try {
      const res = await fetch('http://localhost:3001/api/juegos/biblioteca');
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

  //Filtrar juegos según el estado
  const juegosFiltrados = juegos.filter(juego => {
    if (filtro === 'todos') return true;
    if (filtro === 'completados') return juego.valoracionUsuario?.completado === true;
    if (filtro === 'incompletos') return juego.valoracionUsuario?.completado === false;
    return true;
  });

  const abrirModal = (juego) => {
    setJuegoSeleccionado(juego);
    setValorEstrellas(juego.valoracionUsuario?.estrellas || 0);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setJuegoSeleccionado(null);
    setValorEstrellas(0);
  };

  const handleEstrellaClick = (valor) => {
    setValorEstrellas(valor);
  };

  const handleSubmit = async (e) => {
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

      if (!response.ok) throw new Error('Error al actualizar valoración');

      alert('¡Valoración actualizada correctamente!');
      await obtenerBiblioteca(); // Recargamos la biblioteca
      cerrarModal();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar los cambios');
    }
  };

  //Eliminar juego de la biblioteca
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
        <h2 className="title-biblioteca">Mi Biblioteca</h2>
      </div>

      <div className="container-subtitle-biblioteca">
        <h3 className="subtitle-biblioteca">Todos tus juegos:</h3>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="completados">Completados</option>
          <option value="incompletos">Incompletos</option>
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
                <div className="estado">
                  {juego.valoracionUsuario?.completado ? 'Completado' : 'Incompleto'}
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

        <div className="card-biblioteca" onClick={() => navigate('/explora')} style={{ cursor: 'pointer' }}>
          <div className="card-content-biblioteca">
            <h2 className="card-title">Explora Nuevos juegos</h2>
          </div>
        </div>
      </div>

      {modalAbierto && juegoSeleccionado && (
        <div className="overlay-biblioteca" style={{ display: 'flex', opacity: '1' }}>
          <div className="popup">
            <button className="btn-cerrar" onClick={cerrarModal}>✕</button>

            <div className="div-popup">
              <div className="section-valoracion">
                <h2 className="title-valoracion">{juegoSeleccionado.nombre}</h2>
                <div className="img-valoracion">
                  <img 
                    src={juegoSeleccionado.portada || '/Front-end/images/placeholder.jpg'} 
                    alt={juegoSeleccionado.nombre}
                    onError={(e) => e.target.src = '/Front-end/images/placeholder.jpg'}
                  />
                </div>
              </div>

              <div className="section-valoracion">
                <h3>Descripción:</h3>
                <p>{juegoSeleccionado.descripcion || 'Sin descripción'}</p>

                <div className="categorias">
                  <h3>Categorías:</h3>
                  <ul>
                    {juegoSeleccionado.categorias?.map((cat, index) => (
                      <li key={index}>{cat}</li>
                    )) || <li>Sin categoría</li>}
                  </ul>
                </div>

                <form className="form-valoracion" onSubmit={handleSubmit}>
                  <h2>Editar Valoración</h2>

                  <div className="valoracion-estrellas">
                    <h3>Valoración:</h3>
                    <div className="estrellas">
                      {[1, 2, 3, 4, 5].map((valor) => (
                        <span
                          key={valor}
                          className={`estrella ${valorEstrellas >= valor ? 'active' : ''}`}
                          onClick={() => handleEstrellaClick(valor)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <label htmlFor="horas">Horas jugadas:</label>
                  <input 
                    type="number" 
                    id="horas" 
                    name="horas" 
                    min="0" 
                    placeholder="Ingresa horas jugadas"
                    defaultValue={juegoSeleccionado.valoracionUsuario?.horasJugadas || 0}
                  />

                  <label htmlFor="completado">¿Completaste el juego?</label>
                  <select 
                    id="completado" 
                    name="completado"
                    defaultValue={juegoSeleccionado.valoracionUsuario?.completado ? 'si' : 'no'}
                  >
                    <option value="si">Sí, lo completé</option>
                    <option value="no">No, todavía no</option>
                  </select>

                  <label htmlFor="reseña">Reseña:</label>
                  <textarea 
                    id="reseña" 
                    name="reseña" 
                    rows="4"
                    placeholder="Escribe aquí tu opinión sobre el juego..."
                    defaultValue={juegoSeleccionado.valoracionUsuario?.reseña || ''}
                  />

                  <button type="submit" className="btn-enviar">Actualizar Valoración</button>
                  <button 
                    type="button" 
                    className="btn-eliminar"
                    onClick={() => eliminarDeBiblioteca(juegoSeleccionado._id)}
                    style={{
                      background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                      marginTop: '10px',
                      width: '100%'
                    }}
                  >
                    Eliminar de Biblioteca
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

export default Biblioteca;