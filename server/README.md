# Servidor de Música Local

Este servidor actúa como puente para recibir la información de la música que se está reproduciendo (desde una extensión de navegador o Last.fm) y servirla al overlay de Twitch.

## 📦 Instalación

1. Abre una terminal en esta carpeta (`server/`).
2. Ejecuta el siguiente comando para instalar las dependencias:

```bash
npm install
```

## 🚀 Ejecución

Para iniciar el servidor:

```bash
npm start
```

O simplemente ejecuta el archivo `run_server.bat` en la carpeta raíz del proyecto.

## 📡 Endpoints

- `GET /current`: Devuelve la canción actual en formato JSON.
- `POST /update`: Endpoint para actualizar la canción (usado por extensiones).
- `GET /`: Panel de estado visual.

## 🔧 Configuración

El servidor escucha por defecto en el puerto `3000`. Si necesitas cambiarlo, edita el archivo `server.js`.
