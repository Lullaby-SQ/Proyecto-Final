import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/global.css';

// Páginas
import App from './pages/App.jsx';
import Biblioteca from './pages/Biblioteca.jsx';

const router = createBrowserRouter([
  { 
    path: '/', 
    element: <App /> 
  },
  { 
    path: '/biblioteca', 
    element: <Biblioteca /> 
  },
  // Rutas adicionales para futuro
  { 
    path: '/estadisticas', 
    element: <div style={{color: 'white', padding: '2rem'}}>Estadísticas - En desarrollo</div> 
  },
  { 
    path: '/usuario', 
    element: <div style={{color: 'white', padding: '2rem'}}>Usuario - En desarrollo</div> 
  },
  { 
    path: '/sobre-nosotros', 
    element: <div style={{color: 'white', padding: '2rem'}}>Sobre Nosotros - En desarrollo</div> 
  },
  { 
    path: '/registro', 
    element: <div style={{color: 'white', padding: '2rem'}}>Registro - En desarrollo</div> 
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);