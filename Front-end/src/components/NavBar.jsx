import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="div-navbar">
        <h1 className="title">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            L & L Games
          </a>
        </h1>
        <ul>
          <li><a href="/sobre-nosotros" onClick={(e) => { e.preventDefault(); navigate('/sobre-nosotros'); }}>Sobre Nosotros</a></li>
          <li><a href="/biblioteca" onClick={(e) => { e.preventDefault(); navigate('/explora'); }}>Agrega Juegos</a></li>
          <li><a href="/estadisticas" onClick={(e) => { e.preventDefault(); navigate('/biblioteca'); }}>Estadísticas</a></li>
          <li><a href="/usuario" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Juegos</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;