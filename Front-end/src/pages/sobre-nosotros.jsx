import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import '../styles/sobre-nosotros.css';
import '../styles/global.css';

function SobreNosotros() {
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        setCargando(false);
    }, []);

    if (cargando) {
        return (
            <>
                <Navbar />
                <div className="container-sobre-nosotros">
                    <h2 className="title-sobre-nosotros">
                        Cargando la historia de origen de L & L Games...
                    </h2>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container-sobre-nosotros">

                <h2 className="title-sobre-nosotros">Sobre Nosotros</h2>

                {/* --- EQUIPO --- */}
                <section className="sobre-nosotros-equipo">
                    <h3 className="subtitle-sobre-nosotros">Nuestro Equipo</h3>

                    <div className="equipo-cards">
                        <div className="equipo-card">
                            <h4 className="equipo-nombre">Lucía Silva</h4>
                            <p className="equipo-rol">Desarrolladora Web</p>
                            <p className="equipo-desc">
                                Apasionada por el diseño gráfico y los videojuegos.
                                "Hay apoyo, falta talento".
                            </p>
                        </div>

                        <div className="equipo-card">
                            <h4 className="equipo-nombre">Lautaro Cardozo</h4>
                            <p className="equipo-rol">Desarrollador Web</p>
                            <p className="equipo-desc">
                                Gran entusiasta del desarrollo web y los videojuegos.
                                Amante de los gatos.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- MOTIVACIÓN --- */}
                <section className="sobre-nosotros-tarea">
                    <h3 className="subtitle-sobre-nosotros">Por qué lo hicimos</h3>

                    <p className="sobre-nosotros-texto">
                        Este proyecto surgió por un proyecto final de un curso de desarrollo web, nuestro interés por el mundo de los videojuegos y
                        la idea de crear una plataforma moderna para organizar, llevar registro y
                        analizar los títulos que jugamos. Debíamos aplicar todo lo aprendido en el
                        curso en un proyecto real que combine diseño, usabilidad
                        y funcionalidad.
                    </p>
                </section>

            </div>
        </>
    );
}

export default SobreNosotros;
