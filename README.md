# 🏎️ Leaderboard F1 Style - Overlay para Twitch

Overlay interactivo de leaderboard estilo Fórmula 1 para streams de Twitch con chat integrado, TTS y música.

## ✨ Características

- 🏆 **Leaderboard Dinámico** - Tabla de clasificación en tiempo real con diseño F1
- 💬 **Chat Overlay** - Muestra mensajes del chat de Twitch con estilo F1
- 🎙️ **Text-to-Speech** - Lee los mensajes del chat con voz personalizable
- 🎵 **Integración de Música** - Muestra la canción actual que estás escuchando
- ⏱️ **Timer de Stream** - Cronómetro de sesión en vivo
- 🎨 **Animaciones Suaves** - Efectos visuales optimizados para 60fps
- ♿ **Accesibilidad** - Soporte para lectores de pantalla
- 🔧 **Configurable** - Feature flags y configuración por entorno

## 📋 Requisitos Previos

- Node.js 14+ (solo para el servidor de música)
- Navegador moderno (Chrome, Firefox, Edge, Opera)
- OBS Studio (para usar como overlay)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd "Tabla de lideres"
```

### 2. Configurar el servidor de música (opcional)

```bash
cd server
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y edita según tus necesidades:

```bash
cd server
copy .env.example .env
```

Edita `.env`:
```env
PORT=3000
HOST=127.0.0.1
MAX_HISTORY=50
DEBUG=false
```

## ⚙️ Configuración

### Chat de Twitch

Edita `js/config_chat.js`:

```javascript
const CHAT_CONFIG = {
    TWITCH_CHANNEL: 'tu_canal', // Tu canal de Twitch
    
    TTS: {
        ENABLED: true,
        LANG: 'es-ES',
        RATE: 1.1,
        // ... más configuraciones
    },
    
    // ... resto de configuraciones
};
```

### Feature Flags

Edita `js/features.js` para activar/desactivar funcionalidades:

```javascript
const FEATURES = {
    TTS_ENABLED: true,
    MUSIC_INTEGRATION: true,
    DEBUG_MODE: false,
    // ...
};
```

### Datos del Leaderboard

Edita `js/data.js` para actualizar los pilotos y puntuaciones:

```javascript
const driversData = [
    { name: 'Usuario1', points: 1500, lastPoints: 1400, team: 'redbull' },
    // ...
];
```

## 🎮 Uso

### Modo Local (Desarrollo)

1. Abre `index.html` directamente en tu navegador
2. O usa un servidor local:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx http-server
   ```

### En OBS Studio

1. Añade una nueva fuente **Navegador**
2. URL: `file:///C:/ruta/a/tu/proyecto/index.html`
3. Ancho: 1920, Alto: 1080
4. Marca "Actualizar navegador cuando la escena se vuelva activa"
5. ✅ Marca "Controlar audio mediante OBS"

### Servidor de Música

```bash
cd server
npm start
```

El servidor estará disponible en `http://127.0.0.1:3000`

## 📁 Estructura del Proyecto

```
Tabla de lideres/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos F1
├── js/
│   ├── utils.js           # Utilidades compartidas
│   ├── features.js        # Feature flags
│   ├── config_chat.js     # Configuración del chat
│   ├── data.js            # Datos del leaderboard
│   ├── script.js          # Lógica principal
│   ├── chat.js            # Sistema de chat
│   ├── music_integration.js  # Integración de música
│   ├── accessibility.js   # Accesibilidad
│   ├── timer.js           # Cronómetro
│   └── stream_info.js     # Info del stream
├── server/
│   ├── server.js          # Servidor de música
│   ├── .env.example       # Variables de entorno
│   └── package.json
├── assets/                # Imágenes y recursos
└── fonts/                 # Fuentes personalizadas
```

## 🎨 Personalización

### Colores y Estilos

Los colores principales están definidos como CSS custom properties en `css/style.css`:

```css
:root {
    --chat-team-color: #9f7cc2;
    --chat-text-white: #FFFFFF;
    /* ... */
}
```

### Usuarios Especiales

Agrega usuarios con imágenes personalizadas en `js/config_chat.js`:

```javascript
SPECIAL_USERS: {
    'tu_usuario': {
        number: 1,
        team: 'redbull',
        image: './assets/tu_imagen.png'
    }
}
```

## 🔧 Troubleshooting

### El TTS no funciona

1. Verifica que `TTS.ENABLED` esté en `true`
2. Comprueba que tu navegador soporte Web Speech API
3. En OBS, asegúrate de que "Controlar audio mediante OBS" esté activado

### El servidor de música no conecta

1. Verifica que el servidor esté corriendo (`npm start`)
2. Comprueba que el puerto 3000 esté disponible
3. Revisa los logs del servidor

### Los mensajes no aparecen

1. Verifica que `TWITCH_CHANNEL` sea correcto
2. Comprueba la consola del navegador para errores
3. Asegúrate de que el chat de Twitch esté activo

## 🛠️ Desarrollo

### Modo Debug

Activa el modo debug en `js/features.js`:

```javascript
const FEATURES = {
    DEBUG_MODE: true,
    VERBOSE_LOGGING: true
};
```

O en el servidor (`server/.env`):

```env
DEBUG=true
```

### Logs

Los logs están centralizados con niveles:
- DEBUG: Información detallada
- INFO: Información general
- WARN: Advertencias
- ERROR: Errores

Cambia el nivel en `js/features.js`:

```javascript
const ENV_CONFIG = {
    logLevel: 'DEBUG' // o 'INFO', 'WARN', 'ERROR'
};
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 🙏 Agradecimientos

- Diseño inspirado en la Fórmula 1
- Fuente Titillium Web por Google Fonts
- Fuente Magistral para el chat
- Comunidad de Twitch

## 📮 Contacto

- Twitch: [@liiukiin](https://twitch.tv/liiukiin)

---

Hecho con ❤️ para la comunidad de Twitch
