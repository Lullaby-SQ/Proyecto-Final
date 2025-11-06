import { useNavigate } from 'react-router-dom';

function App() {
const navigate = useNavigate();

  return (
    <div className="estructura">
    esfdsdfsdfsdf
      <section className="bienvenida">
        <h1 className="app-titulo">Hola Bienvenido a GamerTracker</h1>
        <button className="btn-iniciar" onClick={() => navigate('/index')}>Iniciar Experiencia</button>
      </section>
    </div>
  );
}

export default App;