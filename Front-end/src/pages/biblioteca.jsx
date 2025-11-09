import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/biblioteca.css';
import '../styles/global.css';

function Biblioteca() {
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
  const [valorEstrellas, setValorEstrellas] = useState(0);

  // Datos de ejemplo (en el futuro vendrán de la API)
  const juegos = [
    {
      id: 1,
      nombre: "Hollow Knight",
      imagen: "/Front-end/images/Hollow_Knight.png",
      estado: "Completado",
      horas: "140 Horas",
      descripcion: "Enfrenta los misterios del reino de Hallownest, un mundo vasto e interconectado lleno de criaturas y secretos.",
      categorias: ["Acción", "Metroidvania", "Aventura"]
    },
    {
      id: 2,
      nombre: "Hollow Knight: Silksong",
      imagen: "/Front-end/images/silksong.jpg",
      estado: "Incompleto",
      horas: "45 Horas",
      descripcion: "La esperada secuela de Hollow Knight.",
      categorias: ["Acción", "Metroidvania", "Aventura"]
    }
  ];

  const abrirModal = (juego) => {
    setJuegoSeleccionado(juego);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const datos = {
      valoracion: valorEstrellas,
      horas: formData.get('horas'),
      completado: formData.get('completado'),
      reseña: formData.get('reseña')
    };
    
    console.log('Datos de valoración:', datos);
    alert('¡Gracias por tu valoración!');
    cerrarModal();
  };

  return (
    <>
      <Navbar />
      
      <div className="container-title-biblioteca">
        <h2 className="title-biblioteca">Estadísticas y Reseñas</h2>
      </div>

      <div className="container-subtitle-biblioteca">
        <h3 className="subtitle-biblioteca">Todos tus juegos:</h3>
        <select>
          <option value="todos">Todos</option>
          <option value="completados">Completados</option>
          <option value="incompletos">Incompletos</option>
        </select>
      </div>

      <div className="container-biblioteca">
        {juegos.map((juego) => (
          <div 
            className="card-biblioteca" 
            key={juego.id}
            onClick={() => abrirModal(juego)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-image-biblioteca">
              <img src={juego.imagen} alt={juego.nombre} />
              <div className="estado">{juego.estado}</div>
            </div>
            <div className="card-content-biblioteca">
              <h2 className="card-title">{juego.nombre}</h2>
              <div className="price-container">
                <span className="tiempo">{juego.horas}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="card-biblioteca" onClick={() => navigate('/explora')} style={{ cursor: 'pointer' }}>
          <div className="card-content-biblioteca">
            <h2 className="card-title">Explora Nuevos juegos</h2>
          </div>
        </div>

        <div className="card-biblioteca">
          <div className="card-content-biblioteca">
            <h2 className="card-title">Añadir juego</h2>
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
                  <img src={juegoSeleccionado.imagen} alt={juegoSeleccionado.nombre} />
                </div>
              </div>

              <div className="section-valoracion">
                <h3>Descripción:</h3>
                <p>{juegoSeleccionado.descripcion}</p>

                <div className="categorias">
                  <h3>Categorías:</h3>
                  <ul>
                    {juegoSeleccionado.categorias.map((cat, index) => (
                      <li key={index}>{cat}</li>
                    ))}
                  </ul>
                </div>

                <form className="form-valoracion" onSubmit={handleSubmit}>
                  <h2>Tus Datos</h2>

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
                  />

                  <label htmlFor="completado">¿Completaste el juego?</label>
                  <select id="completado" name="completado">
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="si">Sí, lo completé</option>
                    <option value="no">No, todavía no</option>
                  </select>

                  <label htmlFor="reseña">Reseña:</label>
                  <textarea 
                    id="reseña" 
                    name="reseña" 
                    rows="4"
                    placeholder="Escribe aquí tu opinión sobre el juego..."
                  />

                  <button type="submit" className="btn-enviar">Editar Valoración</button>
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