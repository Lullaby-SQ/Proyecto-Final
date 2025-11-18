import { StrictMode } from 'react'; // Ayuda a identificar problemas potenciales en la aplicación
import { createRoot } from 'react-dom/client'; // Método moderno para renderizar la aplicación en el DOM
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Manejo de rutas en la aplicación
import './styles/global.css';

// Páginas
//importamos las paginas 
import App from './pages/App.jsx';
import Biblioteca from './pages/biblioteca.jsx';
import Explora from './pages/explora.jsx';
import Exploracion from './pages/Exploracion.jsx';
import Sobrenosotros from './pages/sobre-nosotros.jsx';

//le asignamos a cada pagina importada una ruta especifica
const router = createBrowserRouter([
  { 
    path: '/', 
    element: <App /> 
  },
  { 
    path: '/biblioteca', 
    element: <Biblioteca /> 
  },
  {
    path: '/explora',
    element: <Explora />
  },
  { 
    path: '/exploracion',
    element: <Exploracion /> 
  },
  { 
    path: '/sobre-nosotros', 
    element: <Sobrenosotros /> 
  }
]);

// Renderizamos la aplicación en el elemento con id 'root' del HTML
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);