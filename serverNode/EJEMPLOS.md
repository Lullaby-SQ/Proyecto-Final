# 🧪 Ejemplos de Pruebas de la API

## Usando el navegador web:

### 1. Obtener todos los jugos:
```
http://localhost:3001/api/jugosAll
```

### 2. Obtener un jugo específico:
```
http://localhost:3001/api/jugos/1
http://localhost:3001/api/jugos/5
```

### 3. Verificar estado del servidor:
```
http://localhost:3001/health
```

### 4. Información general de la API:
```
http://localhost:3001/
```

## Usando PowerShell (desde Windows):

```powershell
# Obtener todos los jugos
Invoke-RestMethod -Uri "http://localhost:3001/api/jugosAll" -Method GET

# Obtener un jugo específico
Invoke-RestMethod -Uri "http://localhost:3001/api/jugos/2" -Method GET

# Verificar estado del servidor
Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET
```

## Usando curl (si tienes curl instalado):

```bash
# Obtener todos los jugos
curl http://localhost:3001/api/jugosAll

# Obtener un jugo específico
curl http://localhost:3001/api/jugos/3

# Verificar estado del servidor
curl http://localhost:3001/health
```

## Estructura de respuesta de /api/jugosAll:

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "nombre": "Naranja Natural",
      "descripcion": "Jugo 100% natural de naranjas valencianas",
      "precio": 2.5,
      "reseñas": [
        {
          "usuario": "Ana García",
          "puntuacion": 5,
          "comentario": "¡Excelente! Sabor muy natural y refrescante. Lo recomiendo totalmente."
        },
        {
          "usuario": "Carlos López",
          "puntuacion": 4,
          "comentario": "Muy bueno, aunque me gustaría que fuera un poco más dulce."
        }
      ]
    }
    // ... más jugos
  ]
}
```