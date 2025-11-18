import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import "../styles/explora.css";

function Explora() {
  const navigate = useNavigate();
  const [juegos, setJuegos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [nuevoJuego, setNuevoJuego] = useState({
    id: "",
    titulo: "",
    imagen: "",
    descripcion: "",
    categorias: [],
    precio: 0,
    tieneDescuento: false,
    porcentajeDescuento: 0,
  });

  const categorias = ["Acción", "Aventura", "RPG", "Estrategia", "Simulación", "Metroidvania"];

  //Obtener juegos desde la API
  const obtenerJuegos = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/api/juegos");
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      
      const data = await res.json();
      
      const adaptados = data.map(j => ({
        id: j._id,
        titulo: j.nombre || j.titulo || "Sin título",
        descripcion: j.descripcion || "Sin descripción",
        imagen: j.portada || j.imagen || "/Front-end/images/placeholder.jpg",
        categorias: j.categorias || ["Sin categoría"],
        precio: j.precio || 0,
        tieneDescuento: j.tieneDescuento || false,
        porcentajeDescuento: j.porcentajeDescuento || 0,
      }));
      
      setJuegos(adaptados);
    } catch (err) {
      console.error("Error al obtener juegos:", err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerJuegos();
  }, []);

  // Filtrado por categoría
  const filtrarJuegos = () => {
    if (filtroCategoria === "Todos") return juegos;
    return juegos.filter(j => j.categorias.includes(filtroCategoria));
  };

  //Abrir / Cerrar modales
  const abrirModalDetalles = (juego) => { // Al hacer click en una tarjeta de juego, se abre el modal de detalles de ese juego
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
    setNuevoJuego({ id: "", titulo: "", imagen: "", descripcion: "", categorias: [], precio: 0, tieneDescuento: false, porcentajeDescuento: 0 });
  };

  //Manejo de formularios
  const manejarCambio = (e) => { // Maneja cambios en inputs de texto y números
    const { name, value } = e.target;
    setNuevoJuego(prev => ({ ...prev, [name]: value }));
  };

  const manejarCategorias = (e) => { // Maneja selección de categorías 
    const valor = e.target.value;
    setNuevoJuego(prev => ({
      ...prev,
      categorias: prev.categorias.includes(valor)
        ? prev.categorias.filter(c => c !== valor)
        : [...prev.categorias, valor],
    }));
  };

  // Manejo de imágenes con selector de archivos
  const manejarImagen = (e) => { 
    const file = e.target.files[0];
    if (file) {
      // Convertir imagen a Base64 para guardar en MongoDB
      const reader = new FileReader(); // Crear un lector de archivos
      reader.onloadend = () => { 
        setNuevoJuego(prev => ({ ...prev, imagen: reader.result })); // Guarda la imagen en Base64
      };
      reader.readAsDataURL(file); // Lee el archivo como Data URL (Base64)
    }
  };

  // Crear juego
  const agregarJuego = async (e) => {
    e.preventDefault();
    try {
      const nuevo = {
        nombre: nuevoJuego.titulo,
        descripcion: nuevoJuego.descripcion,
        portada: nuevoJuego.imagen,
        categorias: nuevoJuego.categorias,
        precio: parseFloat(nuevoJuego.precio) || 0,
        tieneDescuento: nuevoJuego.tieneDescuento,
        porcentajeDescuento: parseFloat(nuevoJuego.porcentajeDescuento) || 0,
      };

      const res = await fetch("http://localhost:3001/api/juegos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      });

      if (!res.ok) throw new Error("Error al crear el juego");

      await obtenerJuegos();
      setModalAgregar(false);
      setNuevoJuego({ id: "", titulo: "", imagen: "", descripcion: "", categorias: [], precio: 0, tieneDescuento: false, porcentajeDescuento: 0 });
    } catch (err) {
      console.error(err);
      alert("Error al agregar el juego: " + err.message);
    }
  };

  // Editar juego
  const guardarCambios = async (e) => {
    e.preventDefault();
    try {
      const actualizado = {
        nombre: nuevoJuego.titulo,
        descripcion: nuevoJuego.descripcion,
        portada: nuevoJuego.imagen,
        categorias: nuevoJuego.categorias,
        precio: parseFloat(nuevoJuego.precio) || 0,
        tieneDescuento: nuevoJuego.tieneDescuento,
        porcentajeDescuento: parseFloat(nuevoJuego.porcentajeDescuento) || 0,
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
      alert("Error al guardar los cambios: " + err.message);
    }
  };

  // Eliminar juego
  const eliminarJuego = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este juego?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/juegos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      await obtenerJuegos();
      cerrarModalDetalles();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el juego: " + err.message);
    }
  };

  // Estados de carga y error
  if (cargando) {
    return (
      <>
        <Navbar />
        <div className="explora-page" style={{ textAlign: 'center', paddingTop: '150px' }}>
          <h2>Cargando juegos...</h2>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="explora-page" style={{ textAlign: 'center', paddingTop: '150px' }}>
          <h2>Error al cargar juegos</h2>
          <p>{error}</p>
          <button onClick={obtenerJuegos} className="feature-btn">Reintentar</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="explora-page">
        {/* Filtro de categorías */}
        <div className="filtros"> {/* Cambia el valor del select al cambiar la opción*/}
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="Todos">Todos</option>
            {categorias.map((c, i) => (
              <option key={i} value={c}>{c}</option> // Valor igual al nombre
            ))}
          </select>
        </div>

        {/* Lista de juegos */}
        <div className="juegos-lista">
          {filtrarJuegos().length === 0 ? ( // en caso de no recibir ningun juego en la categoría seleccionada
            <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>
              No hay juegos en esta categoría
            </p>
          ) : ( // Recorre los juegos y crea una tarjeta por cada uno con sus datos
            filtrarJuegos().map((juego) => (
              <div
                key={juego.id}
                className="juego-card"
                onClick={() => abrirModalDetalles(juego)}
              >
                <img 
                  src={juego.imagen} 
                  alt={juego.titulo}
                  onError={(e) => e.target.src = '/Front-end/images/placeholder.jpg'}
                />
                <h3>{juego.titulo}</h3>
                <p>{juego.categorias.join(", ")}</p>
              </div>
            ))
          )}
        </div>

        {/* Botón "+" para agregar */}
        <button
          className="btn-agregar"
          onClick={(e) => { // al hacer click en el botón, se abre el modal de agregar
            e.stopPropagation();
            setModalAgregar(true);
          }}
        >
          +
        </button>

        {/* Modal Agregar */}
        {modalAgregar && ( // Si el estado de modalAgregar es true, se muestra el modal
          <div className="modal-overlay" onClick={() => setModalAgregar(false)}> {/* Cerrar modal al hacer click fuera */}
            <div className="modal" onClick={(e) => e.stopPropagation()}> {/* Evitar cierre al hacer click dentro del modal */}
              <h2>Agregar Juego</h2> 
              <form onSubmit={agregarJuego}> {/* Formulario para agregar un nuevo juego, al hacer click en el boton agregar */}
                <input
                  type="text"
                  name="titulo"
                  placeholder="Título"
                  value={nuevoJuego.titulo}
                  onChange={manejarCambio}
                  required
                /> {/* Input para el título del juego - obligatorio */}

                <div className="input-imagen">
                  <label htmlFor="imagen-agregar">Imagen del juego</label>
                  <input
                    type="file"
                    id="imagen-agregar"
                    accept="image/*" // Acepta solo archivos de imagen
                    onChange={manejarImagen} // Al cambiar el archivo, se maneja con la función manejarImagen, la cual convierte la imagen a Base64
                  />
                  {nuevoJuego.imagen && (
                    <img 
                      src={nuevoJuego.imagen}  // Muestra la imagen seleccionada
                      alt="Previsualización" 
                      className="preview-imagen" 
                      onError={(e) => e.target.src = '/Front-end/images/placeholder.jpg'} 
                    />
                  )}
                </div>

                <textarea
                  name="descripcion"
                  placeholder="Descripción"
                  value={nuevoJuego.descripcion}
                  onChange={manejarCambio} // Al cambiar el texto, se maneja con la función manejarCambio
                  required
                />

                <div className="precio-section">
                  <label htmlFor="precio-agregar">Precio ($)</label>
                  <input
                    type="number"
                    id="precio-agregar"
                    name="precio"
                    placeholder="0.00"
                    value={nuevoJuego.precio} // Valor del precio
                    onChange={manejarCambio} // Al cambiar el valor, se maneja con la función manejarCambio
                    min="0"
                    step="0.01" 
                  />
                </div>

                <div className="descuento-section">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="tieneDescuento"
                      checked={nuevoJuego.tieneDescuento}
                      onChange={(e) => setNuevoJuego(prev => ({ 
                        ...prev, 
                        tieneDescuento: e.target.checked,
                        porcentajeDescuento: e.target.checked ? prev.porcentajeDescuento : 0
                      }))} // Al cambiar el checkbox, actualiza el estado de tieneDescuento y resetea porcentajeDescuento si se desmarca
                    />
                    ¿Tiene descuento?
                  </label>

                  {nuevoJuego.tieneDescuento && ( // Si tieneDescuento es true, muestra el input para el porcentaje de descuento
                    <input
                      type="number"
                      name="porcentajeDescuento"
                      placeholder="Porcentaje de descuento (%)" 
                      value={nuevoJuego.porcentajeDescuento} // Valor del porcentaje de descuento
                      onChange={manejarCambio} 
                      min="0"
                      max="100"
                      step="1"
                    />
                  )}
                </div>

                <div className="categorias-checkbox">
                  {categorias.map(c => (
                    <label key={c}> {/* Checkbox para cada categoría */}
                      <input
                        type="checkbox"
                        value={c}
                        checked={nuevoJuego.categorias.includes(c)} // Marca el checkbox si la categoría está en el array
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
        {modalDetalles && juegoSeleccionado && ( // Si el estado de modalDetalles es true, se muestra el modal de detalles
          <div className="modal-overlay" onClick={cerrarModalDetalles}> {/* Cerrar modal al hacer click fuera */}
            <div className="modal" onClick={(e) => e.stopPropagation()}> {/* Evitar cierre al hacer click dentro del modal */}
              <img 
                src={juegoSeleccionado.imagen} // Imagen del juego
                alt={juegoSeleccionado.titulo}
                onError={(e) => e.target.src = '/Front-end/images/placeholder.jpg'}
              />
              <h2>{juegoSeleccionado.titulo}</h2>
              <p>{juegoSeleccionado.descripcion}</p>
              <p><strong>Categorías:</strong> {juegoSeleccionado.categorias.join(", ")}</p> {/* Muestra las categorías separadas por comas por medio del join */}
              
              <div className="precio-info">
                {juegoSeleccionado.tieneDescuento ? ( // Si el juego tiene descuento, muestra el precio original tachado y el precio con descuento
                  <>
                    <span className="precio-original">${juegoSeleccionado.precio.toFixed(2)}</span> {/* Precio original tachado */}
                    <span className="precio-descuento">${(juegoSeleccionado.precio * (1 - juegoSeleccionado.porcentajeDescuento / 100)).toFixed(2)}</span> {/* Precio con descuento */}
                    <span className="badge-descuento">-{juegoSeleccionado.porcentajeDescuento}%</span> {/* Badge con el porcentaje de descuento */}
                  </>
                ) : (
                  <span className="precio-normal">${juegoSeleccionado.precio.toFixed(2)}</span> // Si no tiene descuento, muestra el precio normal
                )}
              </div>
              
              <div className="modal-buttons"> {/* Botones de editar y eliminar */}
                <button onClick={() => abrirModalEditar(juegoSeleccionado)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminarJuego(juegoSeleccionado.id)}>Eliminar</button> {/* Al hacer click, llama a la función eliminarJuego con el id del juego seleccionado ya que se le carga al mismo modal datos */}
              </div>
            </div>
          </div>
        )}

        {/* Modal Editar */}
        {modalEditar && (
          <div className="modal-overlay" onClick={cerrarModalEditar}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Editar Juego</h2>
              <form onSubmit={guardarCambios}> {/* Al hacer submit, llama a la función guardarCambios */}
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
                    onChange={manejarImagen}
                  />
                  {nuevoJuego.imagen && (
                    <img 
                      src={nuevoJuego.imagen} 
                      alt="Previsualización" 
                      className="preview-imagen"
                      onError={(e) => e.target.src = '/Front-end/images/placeholder.jpg'}
                    />
                  )}
                </div>

                <textarea
                  name="descripcion"
                  value={nuevoJuego.descripcion}
                  onChange={manejarCambio}
                  required
                />

                <div className="precio-section">
                  <label htmlFor="precio-editar">Precio ($)</label>
                  <input
                    type="number"
                    id="precio-editar"
                    name="precio"
                    placeholder="0.00"
                    value={nuevoJuego.precio}
                    onChange={manejarCambio}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="descuento-section">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="tieneDescuento"
                      checked={nuevoJuego.tieneDescuento}
                      onChange={(e) => setNuevoJuego(prev => ({  // Al cambiar el checkbox, actualiza el estado de tieneDescuento y resetea porcentajeDescuento si se desmarca
                        ...prev, 
                        tieneDescuento: e.target.checked,
                        porcentajeDescuento: e.target.checked ? prev.porcentajeDescuento : 0
                      }))}
                    />
                    ¿Tiene descuento?
                  </label>

                  {nuevoJuego.tieneDescuento && ( // Si tieneDescuento es true, muestra el input para el porcentaje de descuento
                    <input
                      type="number"
                      name="porcentajeDescuento"
                      placeholder="Porcentaje de descuento (%)"
                      value={nuevoJuego.porcentajeDescuento}
                      onChange={manejarCambio}
                      min="0"
                      max="100"
                      step="1"
                    />
                  )}
                </div>

                <div className="categorias-checkbox">
                  {categorias.map(c => (
                    <label key={c}>
                      <input
                        type="checkbox"
                        value={c} // Valor igual al nombre de la categoría
                        checked={nuevoJuego.categorias.includes(c)} // Marca el checkbox si la categoría está en el array
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