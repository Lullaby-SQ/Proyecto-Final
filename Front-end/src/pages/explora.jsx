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
    id: "",
    titulo: "",
    imagen: "",
    descripcion: "",
    categorias: [],
  });

  const categorias = ["Acción", "Aventura", "RPG", "Estrategia", "Simulación", "Metroidvania"];

  // 🔹 Obtener juegos desde la API
  const obtenerJuegos = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/juegos");
      const data = await res.json();
      const adaptados = data.map(j => ({
        id: j._id,
        titulo: j.nombre || j.titulo,
        descripcion: j.descripcion,
        imagen: j.portada || j.imagen || "/Front-end/images/placeholder.jpg",
        categorias: j.categorias || ["Sin categoría"],
      }));
      setJuegos(adaptados);
    } catch (err) {
      console.error("Error al obtener juegos:", err);
    }
  };

  useEffect(() => {
    obtenerJuegos();
  }, []);

  // 🔹 Filtrado por categoría
  const filtrarJuegos = () => {
    if (filtroCategoria === "Todos") return juegos;
    return juegos.filter(j => j.categorias.includes(filtroCategoria));
  };

  // 🔹 Abrir / Cerrar modales
  const abrirModalDetalles = (juego) => {
    setJuegoSeleccionado(juego);
    setModalDetalles(true);
  };

  const cerrarModalDetalles = () => {
    setModalDetalles(false);
    setJuegoSeleccionado(null);
  };

  const abrirModalEditar = (juego) => {
    setNuevoJuego(juego);
    setModalDetalles(false);
    setModalEditar(true);
  };

  const cerrarModalEditar = () => {
    setModalEditar(false);
    setNuevoJuego({ id: "", titulo: "", imagen: "", descripcion: "", categorias: [] });
  };

  // 🔹 Manejo de formularios
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoJuego(prev => ({ ...prev, [name]: value }));
  };

  const manejarCategorias = (e) => {
    const valor = e.target.value;
    setNuevoJuego(prev => ({
      ...prev,
      categorias: prev.categorias.includes(valor)
        ? prev.categorias.filter(c => c !== valor)
        : [...prev.categorias, valor],
    }));
  };

  // 🟢 Crear juego
  const agregarJuego = async (e) => {
    e.preventDefault();
    try {
      const nuevo = {
        nombre: nuevoJuego.titulo,
        descripcion: nuevoJuego.descripcion,
        portada: nuevoJuego.imagen,
        categorias: nuevoJuego.categorias,
      };

      const res = await fetch("http://localhost:3001/api/juegos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      });

      if (!res.ok) throw new Error("Error al crear el juego");

      await obtenerJuegos();
      setModalAgregar(false);
      setNuevoJuego({ id: "", titulo: "", imagen: "", descripcion: "", categorias: [] });
    } catch (err) {
      console.error(err);
      alert("Error al agregar el juego");
    }
  };

  // 🟣 Editar juego
  const guardarCambios = async (e) => {
    e.preventDefault();
    try {
      const actualizado = {
        nombre: nuevoJuego.titulo,
        descripcion: nuevoJuego.descripcion,
        portada: nuevoJuego.imagen,
        categorias: nuevoJuego.categorias,
      };

      const res = await fetch(`http://localhost:3001/api/juegos/${nuevoJuego.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actualizado),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      await obtenerJuegos();
      cerrarModalEditar();
    } catch (err) {
      console.error(err);
      alert("Error al guardar los cambios");
    }
  };

  // 🔴 Eliminar juego
  const eliminarJuego = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este juego?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/juegos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      await obtenerJuegos();
      cerrarModalDetalles();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el juego");
    }
  };

  return (
    <>
      <Navbar />
      <div className="explora-page">
        {/* Filtro de categorías */}
        <div className="filtros">
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="Todos">Todos</option>
            {categorias.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Lista de juegos */}
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

        {/* Botón "+" para agregar */}
        <button
          className="btn-agregar"
          onClick={(e) => {
            e.stopPropagation();
            setModalAgregar(true);
          }}
        >
          +
        </button>

        {/* Modal Agregar */}
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

                <div className="input-imagen">
                  <label htmlFor="imagen-agregar">Imagen del juego</label>
                  <input
                    type="file"
                    id="imagen-agregar"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const previewURL = URL.createObjectURL(file);
                        setNuevoJuego(prev => ({ ...prev, imagen: previewURL }));
                      }
                    }}
                  />
                  {nuevoJuego.imagen && (
                    <img src={nuevoJuego.imagen} alt="Previsualización" className="preview-imagen" />
                  )}
                </div>

                <textarea
                  name="descripcion"
                  placeholder="Descripción"
                  value={nuevoJuego.descripcion}
                  onChange={manejarCambio}
                  required
                />

                <div className="categorias-checkbox">
                  {categorias.map(c => (
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

        {/* Modal Detalles */}
        {modalDetalles && juegoSeleccionado && (
          <div className="modal-overlay" onClick={cerrarModalDetalles}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <img src={juegoSeleccionado.imagen} alt={juegoSeleccionado.titulo} />
              <h2>{juegoSeleccionado.titulo}</h2>
              <p>{juegoSeleccionado.descripcion}</p>
              <p><strong>Categorías:</strong> {juegoSeleccionado.categorias.join(", ")}</p>
              <div className="modal-buttons">
                <button onClick={() => abrirModalEditar(juegoSeleccionado)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminarJuego(juegoSeleccionado.id)}>Eliminar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Editar */}
        {modalEditar && (
          <div className="modal-overlay" onClick={cerrarModalEditar}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Editar Juego</h2>
              <form onSubmit={guardarCambios}>
                <input
                  type="text"
                  name="titulo"
                  value={nuevoJuego.titulo}
                  onChange={manejarCambio}
                  required
                />

                <div className="input-imagen">
                  <label htmlFor="imagen-editar">Imagen del juego</label>
                  <input
                    type="file"
                    id="imagen-editar"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const previewURL = URL.createObjectURL(file);
                        setNuevoJuego(prev => ({ ...prev, imagen: previewURL }));
                      }
                    }}
                  />
                  {nuevoJuego.imagen && (
                    <img src={nuevoJuego.imagen} alt="Previsualización" className="preview-imagen" />
                  )}
                </div>

                <textarea
                  name="descripcion"
                  value={nuevoJuego.descripcion}
                  onChange={manejarCambio}
                  required
                />

                <div className="categorias-checkbox">
                  {categorias.map(c => (
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
    </>
  );
}

export default Explora;