import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/explora.css";

function Explora() {
  const navigate = useNavigate();
  const [juegos, setJuegos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
  const [nuevoJuego, setNuevoJuego] = useState({
    titulo: "",
    imagen: "",
    descripcion: "",
    categorias: [],
  });

  const categorias = ["Acción", "Aventura", "RPG", "Estrategia", "Simulación", "Metroidvania"];

  useEffect(() => {
    // Simular llamada a API
    const juegosEjemplo = [
      {
        id: 1,
        titulo: "Hollow Knight",
        imagen: "/Front-end/images/Hollow_Knight.png",
        descripcion: "Un metroidvania oscuro con una ambientación increíble.",
        categorias: ["Acción", "Metroidvania", "Aventura"],
      },
      {
        id: 2,
        titulo: "Hollow Knight: Silksong",
        imagen: "/Front-end/images/silksong.jpg",
        descripcion: "La esperada secuela de Hollow Knight.",
        categorias: ["Acción", "Metroidvania", "Aventura"],
      },
    ];
    setJuegos(juegosEjemplo);
  }, []);

  const filtrarJuegos = () => {
    if (filtroCategoria === "Todos") return juegos;
    return juegos.filter((j) => j.categorias.includes(filtroCategoria));
  };

  const abrirModalDetalles = (juego) => {
    setJuegoSeleccionado(juego);
    setModalDetalles(true);
  };

  const eliminarJuego = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este juego?");
    if (confirmacion) {
      setJuegos(juegos.filter((j) => j.id !== id));
      setModalDetalles(false);
    }
  };

  const abrirModalEditar = (juego) => {
    setJuegoSeleccionado(juego);
    setNuevoJuego(juego);
    setModalEditar(true);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoJuego((prev) => ({ ...prev, [name]: value }));
  };

  const manejarCategorias = (e) => {
    const valor = e.target.value;
    setNuevoJuego((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(valor)
        ? prev.categorias.filter((c) => c !== valor)
        : [...prev.categorias, valor],
    }));
  };

  const agregarJuego = (e) => {
    e.preventDefault();
    const nuevo = { ...nuevoJuego, id: Date.now() };
    setJuegos([...juegos, nuevo]);
    setModalAgregar(false);
    setNuevoJuego({ titulo: "", imagen: "", descripcion: "", categorias: [] });
  };

  const guardarCambios = (e) => {
    e.preventDefault();
    setJuegos(juegos.map((j) => (j.id === nuevoJuego.id ? nuevoJuego : j)));
    setModalEditar(false);
  };

  return (
    <div className="explora-page">
      <Navbar />

      <div className="filtros">
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="Todos">Todos</option>
          {categorias.map((categoria, i) => (
            <option key={i} value={categoria}>{categoria}</option>
          ))}
        </select>

        <button className="btn-agregar" onClick={() => setModalAgregar(true)}>+</button>
      </div>

      <div className="juegos-lista">
        {filtrarJuegos().map((juego) => (
          <div
            key={juego.id}
            className="juego-card"
            onClick={() => abrirModalDetalles(juego)}
          >
            <img src={juego.imagen} alt={juego.titulo} />
            <h3>{juego.titulo}</h3>
            <p>{juego.categorias.join(", ")}</p>
          </div>
        ))}
      </div>

      {/* ===== Modal Agregar ===== */}
      {modalAgregar && (
        <div className="modal-overlay" onClick={() => setModalAgregar(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Agregar Juego</h2>
            <form onSubmit={agregarJuego}>
              <input
                type="text"
                name="titulo"
                placeholder="Título"
                value={nuevoJuego.titulo}
                onChange={manejarCambio}
                required
              />
              <input
                type="text"
                name="imagen"
                placeholder="URL de imagen"
                value={nuevoJuego.imagen}
                onChange={manejarCambio}
                required
              />
              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={nuevoJuego.descripcion}
                onChange={manejarCambio}
                required
              />
              <div className="categorias-checkbox">
                {categorias.map((c) => (
                  <label key={c}>
                    <input
                      type="checkbox"
                      value={c}
                      checked={nuevoJuego.categorias.includes(c)}
                      onChange={manejarCategorias}
                    />
                    {c}
                  </label>
                ))}
              </div>
              <button type="submit">Agregar</button>
            </form>
          </div>
        </div>
      )}

      {/* ===== Modal Detalles ===== */}
      {modalDetalles && juegoSeleccionado && (
        <div className="modal-overlay" onClick={() => setModalDetalles(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <img src={juegoSeleccionado.imagen} alt={juegoSeleccionado.titulo} className="modal-img" />
            <h2>{juegoSeleccionado.titulo}</h2>
            <p>{juegoSeleccionado.descripcion}</p>
            <p><strong>Categorías:</strong> {juegoSeleccionado.categorias.join(", ")}</p>
            <div className="modal-buttons">
              <button className="btn-editar" onClick={() => { setModalDetalles(false); abrirModalEditar(juegoSeleccionado); }}>Editar</button>
              <button className="btn-eliminar" onClick={() => eliminarJuego(juegoSeleccionado.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal Editar ===== */}
      {modalEditar && (
        <div className="modal-overlay" onClick={() => setModalEditar(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Juego</h2>
            <form onSubmit={guardarCambios}>
              <input
                type="text"
                name="titulo"
                value={nuevoJuego.titulo}
                onChange={manejarCambio}
              />
              <input
                type="text"
                name="imagen"
                value={nuevoJuego.imagen}
                onChange={manejarCambio}
              />
              <textarea
                name="descripcion"
                value={nuevoJuego.descripcion}
                onChange={manejarCambio}
              />
              <div className="categorias-checkbox">
                {categorias.map((c) => (
                  <label key={c}>
                    <input
                      type="checkbox"
                      value={c}
                      checked={nuevoJuego.categorias.includes(c)}
                      onChange={manejarCategorias}
                    />
                    {c}
                  </label>
                ))}
              </div>
              <button type="submit">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Explora;