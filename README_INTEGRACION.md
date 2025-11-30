# Tabla de Líderes F1 con Chat de Twitch Integrado

Este proyecto combina una tabla de líderes estilo F1 con un overlay de chat de Twitch en tiempo real.

## ✨ Características

### Tabla de Líderes
- ✅ Visualización de clasificación de pilotos/espectadores
- ✅ Animaciones estilo F1
- ✅ Cronómetro de sesión en tiempo real
- ✅ Indicadores de progreso (hot streak)
- ✅ Logos de equipos F1
- ✅ Diseño responsive

### Chat de Twitch
- ✅ Conexión en tiempo real al chat de Twitch (sin autenticación)
- ✅ Diseño visual inspirado en F1 con colores de equipos
- ✅ Asignación de números de piloto y equipos a usuarios
- ✅ Animación de ecualizador durante los mensajes
- ✅ Soporte para emotes de Twitch
- ✅ Sonido de notificación personalizado
- ✅ Transiciones suaves de entrada/salida
- ✅ Arquitectura modular siguiendo principios SOLID

## 🏗️ Estructura del Proyecto

```
Tabla de lideres/
├── index.html              # Página principal
├── assets/                 # Recursos (logos, iconos, etc.)
├── css/
│   └── style.css          # Estilos combinados (tabla + chat)
├── js/
│   ├── data.js            # Datos de la tabla de líderes
│   ├── timer.js           # Cronómetro de sesión
│   ├── script.js          # Lógica de la tabla de líderes
│   ├── config_chat.js     # Configuración del chat de Twitch
│   ├── data_chat.js       # Datos del chat (equipos, usuarios)
│   └── chat.js            # Lógica principal del chat
├── libs/
│   └── tmi.min.js         # Cliente de Twitch IRC
└── fonts/                 # Fuentes personalizadas (opcional)
```

## 🔧 Configuración

### Configurar el Canal de Twitch

Edita el archivo `js/config_chat.js` y cambia el nombre del canal:

```javascript
const CHAT_CONFIG = {
  TWITCH_CHANNEL: 'tu_canal_aqui',  // Cambia esto
  // ...resto de configuración
};
```

### Personalizar Usuarios y Equipos

Edita `js/data_chat.js` para:
- Asignar números de piloto a usuarios específicos
- Asignar equipos F1 a usuarios
- Agregar o modificar equipos de F1

```javascript
const chatUserNumbers = {
    'usuario1': 1,
    'usuario2': 2,
    // ...
};

const chatUserTeams = {
    'usuario1': 'mercedes',
    'usuario2': 'ferrari',
    // ...
};
```

### Personalizar Datos de la Tabla

Edita `js/data.js` para modificar los espectadores y sus puntos.

## 🚀 Uso

### 1. Abrir en Navegador

Simplemente abre `index.html` en tu navegador web favorito.

### 2. Integración con OBS

1. Abre OBS Studio
2. Agrega una nueva fuente **"Navegador"**
3. Configura la URL como ruta local de `index.html` o URL del servidor
4. Ajusta las dimensiones según necesites
5. Marca la casilla **"Actualizar navegador cuando la escena se activa"**

### 3. Probar el Chat

Puedes probar la funcionalidad del chat sin mensajes reales usando la consola del navegador:

```javascript
// Simular un mensaje en el chat
simularMensaje('NombreUsuario', 'Este es un mensaje de prueba!');
```

## 🎨 Personalización Visual

### Cambiar Colores del Chat

Modifica las variables CSS en `css/style.css`:

```css
:root {
  --chat-team-color: #9f7cc2;
  --chat-team-color-bright: #8714cb;
  /* ...otros colores */
}
```

### Ajustar Tiempos de Visualización

Edita `js/config_chat.js`:

```javascript
const CHAT_CONFIG = {
  MESSAGE_DISPLAY_TIME: 5000,     // Milisegundos que se muestra el mensaje
  TRANSITION_DURATION: 700,       // Duración de la transición
  // ...
};
```

## 🔊 Audio

El overlay reproduce un sonido cuando aparece un nuevo mensaje. Puedes cambiar el audio en `js/config_chat.js`:

```javascript
const CHAT_CONFIG = {
  AUDIO_URL: 'tu_url_de_audio_aqui.mp3',
  AUDIO_VOLUME: 1.0,  // 0.0 a 1.0
  // ...
};
```

## 🐛 Solución de Problemas

### El chat no se conecta a Twitch

- Verifica que el nombre del canal en `config_chat.js` sea correcto
- Asegúrate de que `libs/tmi.min.js` esté cargado correctamente
- Revisa la consola del navegador para ver errores

### Los emotes no se muestran

- Verifica tu conexión a internet
- Los emotes se cargan desde los servidores de Twitch

### El audio no suena

- Algunos navegadores bloquean la reproducción automática de audio
- Interactúa con la página primero (clic en cualquier lugar)
- Verifica que la URL del audio sea válida

### Los mensajes no desaparecen

- Verifica la configuración de `MESSAGE_DISPLAY_TIME` en `config_chat.js`
- Revisa la consola del navegador para ver errores

## 📝 Arquitectura Técnica

### Clases Principales (SOLID)

#### Chat de Twitch

1. **ChatDataService**: Gestiona datos de usuarios (números de piloto, equipos)
2. **ChatAudioService**: Maneja la reproducción de sonidos
3. **TwitchService**: Gestiona la conexión con Twitch IRC
4. **ChatUIManager**: Controla la interfaz visual del chat
5. **ChatApp**: Clase orquestadora que coordina todos los servicios

#### Tabla de Líderes

1. **DriverService**: Gestiona los datos y cálculos de pilotos
2. **TableRenderer**: Controla la visualización con D3.js
3. **LeaderboardApp**: Orquesta la tabla de líderes

## 📄 Licencia

Este proyecto integra componentes de:
- [PCSolucion/chat_twitch](https://github.com/PCSolucion/chat_twitch)
- [PCSolucion/leaderboards_f1](https://github.com/PCSolucion/leaderboards_f1)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún error o quieres agregar funcionalidades, no dudes en abrir un issue o pull request.
