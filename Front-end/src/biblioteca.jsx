import { useNavigate } from 'react-router-dom';

function Biblioteca() { 
  const navigate = useNavigate();

  return (
    <div>
      <div className="container-title-biblioteca">
        <h2 className="title-biblioteca">Estadisticas y Reseñas</h2>
      </div>
      <div className="container-subtitle-biblioteca">
        <h3 className="subtitle-biblioteca">Todos tus juegos:</h3>
        <select>
          <option value="1">Completados</option>
          <option value="2">Incompleto</option>
        </select>
      </div>
      <div className="container-biblioteca">
        <div className="card-biblioteca btn-abrir">
          <div className="card-image-biblioteca">
            <img src="/Front-end/images/Hollow_Knight.png" alt="Hollow Knight" />
            <div className="estado">Completado</div>
          </div>
          <div className="card-content-biblioteca">
            <h2 className="card-title">Hollow Knight</h2>
            <div className="price-container">
              <span className="tiempo">140 Horas</span>
            </div>
          </div>
        </div>

        <div className="card-biblioteca">
          <div className="card-image-biblioteca">
            <img src="/Front-end/images/silksong.jpg" alt="Silksong" />
            <div className="estado">incompleto</div>
          </div>
          <div className="card-content-biblioteca">
            <h2 className="card-title">Hollow Knight: Silksong</h2>
            <div className="price-container">
              <span className="tiempo">140 Horas</span>
            </div>
          </div>
        </div>

        <div className="card-biblioteca">
          <div className="card-image-biblioteca">
            <img src="/Front-end/images/silksong.jpg" alt="Silksong" />
            <div className="estado">Completado</div>
          </div>
          <div className="card-content-biblioteca">
            <h2 className="card-title">Hollow Knight: Silksong</h2>
            <div className="price-container">
              <span className="tiempo">140 Horas</span>
            </div>
          </div>
        </div>

        <div className="card-biblioteca">
          <div className="card-image-biblioteca">
            <img src="/Front-end/images/silksong.jpg" alt="Silksong" />
            <div className="estado">Completado</div>
          </div>
          <div className="card-content-biblioteca">
            <h2 className="card-title">Hollow Knight: Silksong</h2>
            <div className="price-container">
              <span className="tiempo">140 Horas</span>
            </div>
          </div>
        </div>

        <div className="card-biblioteca">
          <div className="card-image-biblioteca">
            <img src="/Front-end/images/silksong.jpg" alt="Silksong" />
            <div className="estado">Completado</div>
          </div>
          <div className="card-content-biblioteca">
            <h2 className="card-title">Hollow Knight: Silksong</h2>
            <div className="price-container">
              <span className="tiempo">140 Horas</span>
            </div>
          </div>
        </div>

        <div className="card-biblioteca">
          <div className="card-content-biblioteca">
            <h2 className="card-title">Explora Nuevos juegos</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Biblioteca;