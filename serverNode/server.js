const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Función para leer el archivo JSON de juegos
const leerJuegos = () => {
    try {
        const dataPath = path.join(__dirname, 'juegos.json');
        const jsonData = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error al leer el archivo juegos.json:', error);
        return { juegos: [] };
    }
};

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: '🎮 API de Juegos - Servidor funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            'GET /api/juegos': 'Obtener todos los juegos',
            'GET /api/juegos/:id': 'Obtener un juego específico por ID',
            'GET /health': 'Verificar estado del servidor'
        }
    });
});

// ========== ENDPOINTS PARA JUEGOS ==========

// Endpoint para obtener todos los juegos
app.get('/api/juegos', (req, res) => {
    try {
        const data = leerJuegos();
        res.json({
            success: true,
            count: data.juegos.length,
            data: data.juegos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// Endpoint para obtener un juego específico por ID
app.get('/api/juegos/:id', (req, res) => {
    try {
        const data = leerJuegos();
        const juegoId = parseInt(req.params.id);
        const juego = data.juegos.find(j => j.id === juegoId);
        
        if (!juego) {
            return res.status(404).json({
                success: false,
                error: 'Juego no encontrado',
                message: `No se encontró un juego con ID ${juegoId}`
            });
        }
        
        res.json({
            success: true,
            data: juego
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message
        });
    }
});

// Endpoint para verificar el estado del servidor
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: 'Servidor funcionando correctamente'
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint no encontrado',
        message: `La ruta ${req.originalUrl} no existe`,
        availableEndpoints: [
            'GET /',
            'GET /api/juegos',
            'GET /api/juegos/:id',
            'GET /health'
        ]
    });
});

// Manejo global de errores
app.use((error, req, res, next) => {
    console.error('Error no controlado:', error);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'Algo salió mal en el servidor'
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log('🚀 ======================================');
    console.log(`🎮 Servidor de Juegos iniciado`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📡 API Juegos: http://localhost:${PORT}/api/juegos`);
    console.log('🚀 ======================================');
    
    // Verificar que los archivos JSON existen

    const dataJuegos = leerJuegos();
    console.log(`🎮 Cargados ${dataJuegos.juegos.length} juegos en la base de datos`);
});