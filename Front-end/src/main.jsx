import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/global.css';

// Páginas
import App from './pages/App.jsx';
import Biblioteca from './pages/biblioteca.jsx';
import Explora from './pages/explora.jsx';
import Exploracion from './pages/Exploracion.jsx';
import Sobrenosotros from './pages/sobre-nosotros.jsx';

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);