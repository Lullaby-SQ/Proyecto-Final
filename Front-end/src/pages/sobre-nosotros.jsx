import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import '../styles/sobre-nosotros.css';
import '../styles/global.css';

function SobreNosotros() {
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(true);
    const [about, setAbout] = useState(null);

    if (cargando) {
        return (
            <>
                <Navbar />
                <div className="container-sobre-nosotros">
                    <h2 className="title-sobre-nosotros">Cargando la historia de origen de L & L Games...</h2>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container-sobre-nosotros">
                <h2 className="title-sobre-nosotros">Sobre Nosotros</h2>
                <section className= "sobre-nosotros-equipo">
                    <h3 className= "subtitle-sobre-nosotros">Nuestro Equipo</h3>
                </section>
                <section className= "sobre-nosotros-tarea">
                    <h3 className="subtitle-sobre-nosotros">Por qué lo hicimos</h3>
                </section>
            </div>
        </>
    );
}

export default SobreNosotros;