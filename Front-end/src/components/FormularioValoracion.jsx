import { useState } from 'react';
import '../styles/formulario-valoracion.css';

/**
 * Componente reutilizable para valorar juegos
 * Usado en App.jsx, Exploracion.jsx y biblioteca.jsx
 */
function FormularioValoracion({  
  juegoSeleccionado, 
  onCerrar, // Función para cerrar el modal
  onGuardar // Función para manejar el guardado de la valoración
}) { // Manejar estado de estrellas seleccionadas
  const [valorEstrellas, setValorEstrellas] = useState(
    juegoSeleccionado?.valoracionUsuario?.estrellas || 0
  );
  // Manejar clic en estrella, actualiza el estado de la misma
  const handleEstrellaClick = (valor) => {
    setValorEstrellas(valor);
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); // Obtener datos del formulario
    
    // Construir objeto de datos a enviar
    const datos = {
      estrellas: valorEstrellas,
      horasJugadas: parseFloat(formData.get('horas')) || 0,
      completado: formData.get('completado'),  
      reseña: formData.get('reseña')
    };
    
    try {
      const response = await fetch( // Enviar datos al servidor
        `http://localhost:3001/api/juegos/${juegoSeleccionado._id || juegoSeleccionado.id}/valorar`, // Endpoint para valorar juego 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        }
      );

      if (!response.ok) throw new Error('Error al guardar valoración');

      const resultado = await response.json();
      alert(`¡Valoración de "${juegoSeleccionado.nombre || juegoSeleccionado.titulo}" guardada correctamente!`);
      
      if (onGuardar) onGuardar(resultado); // Llamar a la función onGuardar si se proporciona
      if (onCerrar) onCerrar();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la valoración. Por favor intenta de nuevo.');
    }
  };

  // Si no hay juego seleccionado, no renderiza nada
  if (!juegoSeleccionado) return null;


  // Renderizar el formulario de valoración
  return (
    <div className="overlay-valoracion" style={{ display: 'flex', opacity: '1' }}>
      <div className="popup-valoracion">
        <button className="btn-cerrar" onClick={onCerrar}>✕</button> {/* Botón para cerrar el modal */}
        <div className="div-popup">
          {/* LADO IZQUIERDO (imagen y nombre) */}
          <div className="section-valoracion">
            <h2 className="title-valoracion">
              {juegoSeleccionado.nombre || juegoSeleccionado.titulo}
            </h2>
            <div className="img-valoracion">
              <img
                src={juegoSeleccionado.portada || juegoSeleccionado.imagen || '/Front-end/images/placeholder.jpg'}
                alt={juegoSeleccionado.nombre || juegoSeleccionado.titulo}
                onError={(e) => e.target.src = '/Front-end/images/placeholder.jpg'}
              />
            </div>
            
            {/* Precio (si existe) */}
            {juegoSeleccionado.precio !== undefined && (
              <div className="precio-modal">
                {juegoSeleccionado.tieneDescuento ? (
                  <>
                    <span className="precio-original-modal">${juegoSeleccionado.precio.toFixed(2)}</span>
                    <span className="precio-actual-modal">
                      ${(juegoSeleccionado.precio * (1 - juegoSeleccionado.porcentajeDescuento / 100)).toFixed(2)}
                    </span>
                    <span className="descuento-badge-modal">-{juegoSeleccionado.porcentajeDescuento}%</span>
                  </>
                ) : (
                  <span className="precio-actual-modal">${juegoSeleccionado.precio.toFixed(2)}</span>
                )}
              </div>
            )}
          </div>

          {/* LADO DERECHO (descripción y formulario) */}
          <div className="section-valoracion">
            <h3>Descripción:</h3>
            <p>{juegoSeleccionado.descripcion || "Sin descripción disponible"}</p>

            {/* Categorías del juego */}
            <div className="categorias">
              <h3>Categorías:</h3>
              <ul>
                {juegoSeleccionado.categorias?.map((cat, index) => ( // Renderizar categorías o mensaje si no hay categorías
                  <li key={index}>{cat}</li> // Renderizar cada categoría
                )) || <li>Sin categorías</li>}
              </ul>
            </div>

            {/* Formulario de valoración */}
            <form className="form-valoracion" onSubmit={handleSubmit}>
              <h2>
                {juegoSeleccionado.valoracionUsuario?.fechaValoracion  // titulo dinámico según si ya hay una valoración previa
                  ? "Editar tu Valoración" 
                  : "Agrega tu Valoración"
                }
              </h2>

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

              <label htmlFor="horas-form">Horas jugadas:</label>
              <input
                type="number"
                id="horas-form"
                name="horas"
                min="0"
                step="0.5"
                placeholder="Ingresa horas jugadas"
                defaultValue={juegoSeleccionado.valoracionUsuario?.horasJugadas || 0}
                required
              />

              <label htmlFor="completado-form">¿Completaste el juego?</label>
              <select 
                id="completado-form" 
                name="completado"
                defaultValue={juegoSeleccionado.valoracionUsuario?.completado ? 'si' : 'no'}
                required
              >
                <option value="" disabled>Selecciona una opción</option>
                <option value="si">Sí, lo completé</option>
                <option value="no">No, todavía no</option>
              </select>

              <label htmlFor="reseña-form">Reseña:</label>
              <textarea
                id="reseña-form"
                name="reseña"
                rows="4"
                placeholder="Escribe aquí tu opinión sobre el juego..."
                defaultValue={juegoSeleccionado.valoracionUsuario?.reseña || ''}
                required
              />

              <button type="submit" className="btn-enviar">
                {juegoSeleccionado.valoracionUsuario?.fechaValoracion  // texto dinámico del botón según si ya hay valoración previa
                  ? "Actualizar Valoración" 
                  : "Guardar Valoración"
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioValoracion;