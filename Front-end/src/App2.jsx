import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const URL_API = "https://69067edbee3d0d14c135f0a0.mockapi.io/product";

  //const URL_API = "http://localhost:2500/product";

  const [productos, setProductos] = useState([]);
  const [precio, setPrecio] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [editando, setEditando] = useState(null);

  //Forma de leer del back
  useEffect(() => {
    fetch(URL_API)
      .then((response) => response.json())
      .then((data) => setProductos(data));

    /* fetch(URL_API, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setProductos(data)); */
  }, []);

  //Forma de crear un recurso en el back
  const crearProducto = () => {
    const nuevoProducto = {
      name: nombre,
      price: precio,
      category: categoria,
    };

    fetch(URL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProducto),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Producto creado:");
        console.log(data);
        setProductos([...productos, data]);
        // Limpiar formulario
        setNombre("");
        setPrecio("");
        setCategoria("");
      });
  };

  //Forma de eliminar un recurso en el back
  const eliminarProducto = (id) => {
    fetch(`${URL_API}/${id}`, {
      method: "DELETE",
    }).then(() => {
      // Quitar de la lista
      setProductos(productos.filter((p) => p.id !== id));
    });
  };

  const prepararEdicion = (producto) => {
    setEditando(producto.id);
    setNombre(producto.name);
    setPrecio(producto.price);
    setCategoria(producto.category);
  };

  // 👇 Función para actualizar
  const actualizarProducto = () => {
    const productoActualizado = {
      name: nombre,
      price: precio,
      category: categoria,
    };

    fetch(`${URL_API}/${editando}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productoActualizado),
    })
      .then((res) => res.json())
      .then((data) => {
        // Actualizar en la lista
        setProductos(productos.map((p) => (p.id === editando ? data : p)));
        // Limpiar
        setEditando(null);
        setNombre("");
        setPrecio("");
        setCategoria("");
      });
  };

  return (
    <div className="app">
      <h1>🛒 CRUD de Productos</h1>

      <div className="formulario">
        <h2>{editando ? "Editar Producto" : "Crear Producto"}</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />

        {/* 👇 Botón condicional */}
        {editando ? (
          <button onClick={actualizarProducto}>Actualizar</button>
        ) : (
          <button onClick={crearProducto}>Crear</button>
        )}

        {editando && (
          <button
            onClick={() => {
              setEditando(null);
              setNombre("");
              setPrecio("");
              setCategoria("");
            }}
          >
            Cancelar
          </button>
        )}
      </div>

      <div className="lista">
        <h2>Lista de Productos</h2>

        {productos.map((xyz) => (
          <div key={xyz.id} className="producto">
            <h3>{xyz.name}</h3>
            <p>Precio: ${xyz.price}</p>
            <p>Categoría: {xyz.category}</p>
            <button onClick={() => prepararEdicion(xyz)}>Editar</button>
            <button onClick={() => eliminarProducto(xyz.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

