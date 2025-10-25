# 🥤 API de Jugos - Servidor Node.js

Servidor Express que expone una API REST con información de jugos y sus reseñas.

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn

## 🚀 Instalación y Ejecución

1. **Navegar a la carpeta del servidor:**
   ```bash
   cd serverNode
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   
   **O ejecutar en modo producción:**
   ```bash
   npm start
   ```

4. **El servidor estará disponible en:**
   ```
   http://localhost:3001
   ```

## 🛠️ Endpoints Disponibles

### `GET /`
- **Descripción:** Información general del servidor
- **Respuesta:** Información sobre la API y endpoints disponibles

### `GET /api/jugosAll`
- **Descripción:** Obtiene todos los jugos con sus reseñas
- **Respuesta:** Array con todos los jugos, incluyendo ID, nombre, descripción, precio y reseñas

### `GET /api/jugos/:id`
- **Descripción:** Obtiene un jugo específico por su ID
- **Parámetros:** `id` (número) - ID del jugo
- **Respuesta:** Objeto con la información del jugo específico

### `GET /health`
- **Descripción:** Verifica el estado del servidor
- **Respuesta:** Estado del servidor y información de tiempo de actividad

## 📊 Estructura de Datos

Cada jugo contiene la siguiente información:

```json
{
  "id": 1,
  "nombre": "Naranja Natural",
  "descripcion": "Jugo 100% natural de naranjas valencianas",
  "precio": 2.50,
  "reseñas": [
    {
      "usuario": "Ana García",
      "puntuacion": 5,
      "comentario": "¡Excelente! Sabor muy natural y refrescante."
    }
  ]
}
```

## 🧪 Ejemplos de Uso

### Obtener todos los jugos:
```bash
curl http://localhost:3001/api/jugosAll
```

### Obtener un jugo específico:
```bash
curl http://localhost:3001/api/jugos/1
```

### Verificar estado del servidor:
```bash
curl http://localhost:3001/health
```

## 📁 Estructura del Proyecto

```
serverNode/
├── server.js          # Servidor Express principal
├── jugos.json         # Base de datos de jugos
├── package.json       # Dependencias y scripts
└── README.md          # Documentación
```

## 🔧 Configuración

- **Puerto:** 3001 (configurable via variable de entorno PORT)
- **CORS:** Habilitado para todas las rutas
- **Formato de respuesta:** JSON

## 📝 Notas

- El servidor incluye manejo de errores
- Todas las respuestas están en formato JSON
- Los datos se cargan desde el archivo `jugos.json`
- Incluye logging de información del servidor al iniciar