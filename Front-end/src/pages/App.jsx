import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/carrusel.css';
import '../styles/global.css';

function Index() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const juegos = [
    {
      id: 1,
      titulo: "Hollow Knight",
      imagen: "/Front-end/images/Hollow_Knight.png",
      descuento: "-60%",
      precioOriginal: "$14.99",
      precioActual: "$5.99"
    },
    {
      id: 2,
      titulo: "Hollow Knight: Silksong",
      imagen: "/Front-end/images/silksong.jpg",
      descuento: "-45%",
      precioOriginal: "$29.99",
      precioActual: "$16.49"
    },
    {
      id: 3,
      titulo: "Sky: Children of the Light",
      imagen: "/Front-end/images/sky.jpg",
      descuento: "-75%",
      precioOriginal: "$19.99",
      precioActual: "$4.99"
    },
    {
      id: 4,
      titulo: "Valorant Premium Pass",
      imagen: "/Front-end/images/valorant.jpg",
      descuento: "-30%",
      precioOriginal: "$9.99",
      precioActual: "$6.99"
    },
    {
      id: 5,
      titulo: "Juego Especial",
      imagen: "/Front-end/images/background.jpg",
      descuento: "-80%",
      precioOriginal: "$49.99",
      precioActual: "$9.99"
    }
  ];

  useEffect(() => {
    updateCarousel();
  }, [current]);

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
    setCurrent((current + 1) % juegos.length);
  };

  const prevSlide = () => {
    setCurrent((current - 1 + juegos.length) % juegos.length);
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
            <h1>Ofertas Especiales</h1>
            <button className="btn prev" onClick={prevSlide}>&#10094;</button>
            
            <div className="carousel" id="carousel">
              {juegos.map((juego) => (
                <div className="card" key={juego.id}>
                  <div className="card-image">
                    <img src={juego.imagen} alt={juego.titulo} />
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
    </>
  );
}

export default Index;