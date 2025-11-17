import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import '../styles/carrusel.css';
import '../styles/global.css';

function Index() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [juegosDescuento, setJuegosDescuento] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
  const [valorEstrellas, setValorEstrellas] = useState(0);

  // Obtener juegos con descuento desde la API
  useEffect(() => {
    const obtenerJuegosConDescuento = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/juegos/descuentos");
        if (!res.ok) throw new Error("Error al cargar juegos");

        const data = await res.json();

        // Si hay juegos con descuento, los usamos
        if (data.length > 0) {
          const adaptados = data.map(j => ({
            id: j._id,
            titulo: j.nombre,
            descripcion: j.descripcion || "Sin descripción disponible",
            imagen: j.portada || "/Front-end/images/placeholder.jpg",
            categorias: j.categorias || ["Sin categoría"],
            descuento: `-${j.porcentajeDescuento}%`,
            precioOriginal: `${j.precio.toFixed(2)}`,
            precioActual: `${(j.precio * (1 - j.porcentajeDescuento / 100)).toFixed(2)}`
          }));
          setJuegosDescuento(adaptados);
        } else {
          // Si no hay juegos con descuento, mostramos ejemplos por defecto
          setJuegosDescuento(juegosEjemplo);
        }
      } catch (error) {
        console.error("Error:", error);
        // En caso de error, mostramos juegos de ejemplo
        setJuegosDescuento(juegosEjemplo);
      } finally {
        setCargando(false);
      }
    };

    obtenerJuegosConDescuento();
  }, []);


  useEffect(() => {
    if (juegosDescuento.length > 0) {
      updateCarousel();
    }
  }, [current, juegosDescuento]);

  const updateCarousel = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, i) => {
      const offset = (i - current + cards.length) % cards.length;
      card.style.zIndex = cards.length - offset;

      if (offset === 0) {
        card.style.transform = `translateX(-50%) scale(1) rotateY(0deg)`;
        card.style.opacity = '1';
        card.style.filter = 'blur(0)';
      } else if (offset === 1) {
        card.style.transform = `translateX(70%) scale(0.85) rotateY(-20deg)`;
        card.style.opacity = '0.7';
        card.style.filter = 'blur(1px)';
      } else if (offset === cards.length - 1) {
        card.style.transform = `translateX(-170%) scale(0.85) rotateY(20deg)`;
        card.style.opacity = '0.7';
        card.style.filter = 'blur(1px)';
      } else if (offset === 2) {
        card.style.transform = `translateX(140%) scale(0.7) rotateY(-30deg)`;
        card.style.opacity = '0.4';
        card.style.filter = 'blur(3px)';
      } else if (offset === cards.length - 2) {
        card.style.transform = `translateX(-240%) scale(0.7) rotateY(30deg)`;
        card.style.opacity = '0.4';
        card.style.filter = 'blur(3px)';
      } else {
        card.style.transform = `translateX(-50%) scale(0.5) rotateY(0deg)`;
        card.style.opacity = '0';
        card.style.filter = 'blur(5px)';
      }
    });
  };

  const nextSlide = () => {
    setCurrent((current + 1) % juegosDescuento.length);
  };

  const prevSlide = () => {
    setCurrent((current - 1 + juegosDescuento.length) % juegosDescuento.length);
  };

  // Funciones para el modal de valoración
  const abrirModal = (juego) => {
    setJuegoSeleccionado(juego);
    setModalAbierto(true);
    setValorEstrellas(0);
    document.body.style.overflow = 'hidden'; // Bloquear scroll del body
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setJuegoSeleccionado(null);
    setValorEstrellas(0);
    document.body.style.overflow = 'auto'; // Restaurar scroll
  };

  const handleEstrellaClick = (valor) => {
    setValorEstrellas(valor);
  };

  const handleSubmitValoracion = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const datos = {
      estrellas: valorEstrellas,
      horasJugadas: parseFloat(formData.get('horas')) || 0,
      completo: formData.get('completo'),
      reseña: formData.get('reseña')
    };

    try {
      const response = await fetch(`http://localhost:3001/api/juegos/${juegoSeleccionado.id}/valorar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      if (!response.ok) throw new Error('Error al guardar valoración');

      const resultado = await response.json();
      console.log('Valoración guardada:', resultado);

      alert(`¡Valoración de "${juegoSeleccionado.titulo}" guardada en tu biblioteca!`);
      cerrarModal();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la valoración. Por favor intenta de nuevo.');
    }
  };

  return (
    <>
      <div className="section-one">
        <Navbar />
        <header>
          <h1>¡Bienvenido!</h1>
          <h2>Tu plataforma personal para guardar y descubrir juegos que te gusten</h2>
        </header>

        <div className="div-width-carrusel">
          <div className="carousel-container">
            <h1>
              {cargando ? "Cargando ofertas..." :
                juegosDescuento.length > 0 ? "Ofertas Especiales" : "Agrega juegos con descuento"}
            </h1>

            {!cargando && juegosDescuento.length > 0 && (
              <>
                <button className="btn prev" onClick={prevSlide}>&#10094;</button>

                <div className="carousel" id="carousel">
                  {juegosDescuento.map((juego) => (
                    <div
                      className="card"
                      key={juego.id}
                      onClick={() => abrirModal(juego)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-image">
                        <img
                          src={juego.imagen}
                          alt={juego.titulo}
                          onError={(e) => e.target.src = '/Front-end/images/placeholder.jpg'}
                        />
                        <div className="discount-badge">{juego.descuento}</div>
                      </div>
                      <div className="card-content">
                        <h2 className="card-title">{juego.titulo}</h2>
                        <div className="price-container">
                          <span className="original-price">{juego.precioOriginal}</span>
                          <span className="current-price">{juego.precioActual}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn next" onClick={nextSlide}>&#10095;</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="features-container">
        <section className="feature-card">
          <h2>Explora nuestra biblioteca de juegos</h2>
          <p>Descubre nuevos títulos y guarda tus favoritos en tu colección personal.</p>
          <button className="feature-btn" onClick={() => navigate('/biblioteca')}>
            Ver Biblioteca
          </button>
        </section>

        <section className="feature-card">
          <h2>Estadísticas de juego</h2>
          <p>Mantente al tanto de tu progreso y logros en los juegos que amas.</p>
          <button className="feature-btn" onClick={() => navigate('/estadisticas')}>
            Ver Estadísticas
          </button>
        </section>
      </div>

      <div className="cta-section">
        <h2>¿Aún no tienes un usuario?</h2>
        <button className="cta-btn" onClick={() => navigate('/registro')}>
          ¡Crea uno!
        </button>
      </div>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>Colaboradores</h3>
            <ul>
              <li onClick={() => window.open('https://github.com/Lullaby-SQ', '_blank')}>Lucía Silva</li>
              <li onClick={() => window.open('https://github.com/MineAbel', '_blank')}>Lautaro Cardozo</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contacto</h3>
            <ul>
              <li onClick={() => navigate('/contacto')}>Contacto</li>
              <li onClick={() => window.open('https://instagram.com', '_blank')}>Instagram</li>
            </ul>
          </div>
        </div>
        <div className="footer-copy-right">
          <p>&copy; 2025 Game Library. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* 🎮 MODAL DE VALORACIÓN */}
      {modalAbierto && juegoSeleccionado && (
        <div className="overlay-valoracion" style={{ display: 'flex', opacity: '1' }}>
          <div className="popup-valoracion">
            <button className="btn-cerrar" onClick={cerrarModal}>✕</button>

            <div className="div-popup">
              {/* LADO IZQUIERDO (imagen y nombre) */}
              <div className="section-valoracion">
                <h2 className="title-valoracion">{juegoSeleccionado.titulo}</h2>
                <div className="img-valoracion">
                  <img
                    src={juegoSeleccionado.imagen}
                    alt={juegoSeleccionado.titulo}
                    onError={(e) => e.target.src = '/Front-end/images/placeholder.jpg'}
                  />
                </div>
                <div className="precio-modal">
                  <span className="precio-original-modal">{juegoSeleccionado.precioOriginal}</span>
                  <span className="precio-actual-modal">{juegoSeleccionado.precioActual}</span>
                  <span className="descuento-badge-modal">{juegoSeleccionado.descuento}</span>
                </div>
              </div>

              {/* LADO DERECHO (descripción y formulario) */}
              <div className="section-valoracion">
                <h3>Descripción:</h3>
                <p>{juegoSeleccionado.descripcion}</p>

                {/* Categorías del juego */}
                <div className="categorias">
                  <h3>Categorías:</h3>
                  <ul>
                    {juegoSeleccionado.categorias?.map((cat, index) => (
                      <li key={index}>{cat}</li>
                    ))}
                  </ul>
                </div>

                {/* Formulario de valoración */}
                <form className="form-valoracion" onSubmit={handleSubmitValoracion}>
                  <h2>Tu Valoración</h2>

                  {/* Valoración en estrellas */}
                  <div className="valoracion-estrellas">
                    <h3>Calificación:</h3>
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

                  <label htmlFor="horas-index">Horas jugadas:</label>
                  <input
                    type="number"
                    id="horas-index"
                    name="horas"
                    min="0"
                    placeholder="Ingresa horas jugadas"
                    required
                  />

                  <label htmlFor="completo-index">¿Completaste el juego?</label>
                  <select id="completo-index" name="completo" required>
                    <option value="" disabled selected>Selecciona una opción</option>
                    <option value="si">Sí, lo completé</option>
                    <option value="no">No, todavía no</option>
                  </select>

                  <label htmlFor="reseña-index">Reseña:</label>
                  <textarea
                    id="reseña-index"
                    name="reseña"
                    rows="4"
                    placeholder="Escribe aquí tu opinión sobre el juego..."
                    required
                  />

                  <button type="submit" className="btn-enviar">Guardar Valoración</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Index;