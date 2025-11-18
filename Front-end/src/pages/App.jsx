import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import FormularioValoracion from '../components/FormularioValoracion';
import '../styles/carrusel.css';
import '../styles/global.css';

function Index() {
  const navigate = useNavigate(); // Hook para navegación
  const [current, setCurrent] = useState(0); // Índice del juego actual en el carrusel
  const [juegosDescuento, setJuegosDescuento] = useState([]); // Juegos con descuento
  const [cargando, setCargando] = useState(true); // Estado de carga
  const [modalAbierto, setModalAbierto] = useState(false); // Estado del modal
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null); // Juego seleccionado para valorar

  // Obtener juegos con descuento desde la API
  useEffect(() => {
    const obtenerJuegosConDescuento = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/juegos/descuentos"); // Endpoint para juegos con descuento, petición GET a backend
        if (!res.ok) throw new Error("Error al cargar juegos");

        const data = await res.json();
        // Adaptar datos para el carrusel
        if (data.length > 0) {
          const adaptados = data.map(j => ({
            id: j._id,
            titulo: j.nombre,
            descripcion: j.descripcion || "Sin descripción disponible",
            imagen: j.portada || "/Front-end/images/placeholder.jpg",
            categorias: j.categorias || ["Sin categoría"],
            descuento: `-${j.porcentajeDescuento}%`,
            precioOriginal: `${j.precio.toFixed(2)}`,
            precioActual: `${(j.precio * (1 - j.porcentajeDescuento / 100)).toFixed(2)}`,
            // ✅ Añadimos los datos completos para el formulario
            _id: j._id,
            nombre: j.nombre,
            portada: j.portada,
            precio: j.precio,
            tieneDescuento: j.tieneDescuento,
            porcentajeDescuento: j.porcentajeDescuento,
            valoracionUsuario: j.valoracionUsuario
          }));
          setJuegosDescuento(adaptados);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerJuegosConDescuento(); // Llama a la función para obtener los juegos con descuento
  }, []);

  // Actualizar carrusel al cambiar el juego actual
  useEffect(() => {
    if (juegosDescuento.length > 0) { // Verifica que haya juegos antes de 
      updateCarousel();// Llama a la función para actualizar el carrusel
    }
  }, [current, juegosDescuento]);

  const updateCarousel = () => {
    const cards = document.querySelectorAll('.card'); // Selecciona todas las tarjetas del carrusel
    cards.forEach((card, i) => { // Itera sobre cada tarjeta
      const offset = (i - current + cards.length) % cards.length; // Calcula el desplazamiento relativo al juego actual
      card.style.zIndex = cards.length - offset; // Ajusta el z-index para superposición correcta


      // Aplica transformaciones CSS basadas en el desplazamiento y la posición de la tarjeta en el carrusel
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

  // Funciones para navegar en el carrusel, avanzar
  const nextSlide = () => {
    setCurrent((current + 1) % juegosDescuento.length);
  };

  // Funciones para navegar en el carrusel, retroceder
  const prevSlide = () => {
    setCurrent((current - 1 + juegosDescuento.length) % juegosDescuento.length);
  };

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

  const handleGuardarValoracion = () => {
    // Opcional: recargar juegos
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
                juegosDescuento.length > 0 ? "Ofertas Especiales" : "Agrega juegos con descuento"} {/* Título dinámico según estado de carga y disponibilidad de juegos */}
            </h1>

            {!cargando && juegosDescuento.length > 0 && ( // Renderiza el carrusel solo si no está cargando y hay juegos disponibles
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
                          <span className="original-price">${juego.precioOriginal}</span> {/* Precio original tachado */}
                          <span className="current-price">${juego.precioActual}</span> {/* Precio con descuento */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Botones de navegación del carrusel */}
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
          <button className="feature-btn" onClick={() => navigate('/Exploracion')}>
            Ver Biblioteca
          </button>
        </section>

        <section className="feature-card">
          <h2>Estadísticas de juego</h2>
          <p>Mantente al tanto de tu progreso y logros en los juegos que amas.</p>
          <button className="feature-btn" onClick={() => navigate('/biblioteca')}>
            Ver Estadísticas
          </button>
        </section>
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
      {/* Modal de valoración */}
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

export default Index;