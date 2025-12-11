/**
* Servidor Local para Music Overlay
*
* Este servidor actúa como puente entre YouTube (extensión) y OBS (widget)
* permitiendo la comunicación entre diferentes dominios.
*/

// Cargar variables de entorno (si existe .env)
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const app = express();

// Configuración desde variables de entorno con fallbacks
const CONFIG = {
    PORT: parseInt(process.env.PORT) || 3000,
    HOST: process.env.HOST || '127.0.0.1',
    MAX_HISTORY: parseInt(process.env.MAX_HISTORY) || 50,
    DEBUG: process.env.DEBUG === 'true',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT) || 5000
};

// Logging helper
const log = {
    info: (...args) => console.log('ℹ️ [INFO]', ...args),
    warn: (...args) => console.warn('⚠️ [WARN]', ...args),
    error: (...args) => console.error('❌ [ERROR]', ...args),
    debug: (...args) => CONFIG.DEBUG && console.log('🔍 [DEBUG]', ...args)
};

// Configuración de middlewares
app.use(cors({ origin: CONFIG.CORS_ORIGIN })); // Permitir CORS
app.use(express.json()); // Parsear JSON en las peticiones

// Logger de todas las peticiones HTTP
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    log.debug(`📨 ${req.method} ${req.path} - IP: ${req.ip} - User-Agent: ${req.get('user-agent')?.substring(0, 50) || 'Unknown'}`);

    // Si es POST, mostrar también el body (pero sin bloquear el parsing)
    if (req.method === 'POST') {
        log.debug(`   Body size: ${req.get('content-length') || '0'} bytes`);
    }

    next();
});

// Timeout middleware
app.use((req, res, next) => {
    req.setTimeout(CONFIG.REQUEST_TIMEOUT);
    res.setTimeout(CONFIG.REQUEST_TIMEOUT);
    next();
});

// Variable para almacenar la canción actual
let currentMusic = {
    artist: 'Esperando música...',
    song: 'Reproduce algo en YouTube',
    fullTitle: 'Esperando música...',
    timestamp: Date.now(),
    isPlaying: false,
    url: ''
};

// Historial de canciones (opcional, para futuras funcionalidades)
let musicHistory = [];
const MAX_HISTORY = CONFIG.MAX_HISTORY;

// Endpoint para obtener la canción actual
app.get('/current', (req, res) => {
    log.debug('GET /current - Solicitando canción actual');
    res.json(currentMusic);
});

// Endpoint para actualizar la canción (desde la extensión)
app.post('/update', (req, res) => {
    // Log de debugging para ver qué llega
    log.debug('POST /update - Body recibido:', JSON.stringify(req.body));
    log.debug('POST /update - Headers:', JSON.stringify(req.headers));

    const { artist, song, fullTitle, isPlaying, url } = req.body;

    // Validación detallada
    if (!artist || !song || !fullTitle) {
        log.warn('POST /update - Datos incompletos recibidos:');
        log.warn('  - artist:', artist || 'MISSING');
        log.warn('  - song:', song || 'MISSING');
        log.warn('  - fullTitle:', fullTitle || 'MISSING');
        log.warn('  - Body completo:', JSON.stringify(req.body));

        return res.status(400).json({
            success: false,
            message: 'Faltan datos (artist, song, fullTitle)',
            received: { artist, song, fullTitle },
            required: ['artist', 'song', 'fullTitle']
        });
    }

    const newMusic = {
        artist,
        song,
        fullTitle,
        timestamp: Date.now(),
        isPlaying: isPlaying !== undefined ? isPlaying : currentMusic.isPlaying,
        url: url || currentMusic.url
    };

    // Solo actualizar si hay un cambio real
    if (currentMusic.fullTitle !== newMusic.fullTitle || currentMusic.isPlaying !== newMusic.isPlaying) {
        currentMusic = newMusic;
        log.info('✅ Música actualizada:', currentMusic.artist, '-', currentMusic.song, `(Playing: ${currentMusic.isPlaying})`);

        // Añadir al historial
        musicHistory.unshift(currentMusic);
        if (musicHistory.length > MAX_HISTORY) {
            musicHistory.pop();
        }
    } else {
        log.debug('Sin cambios - Misma canción:', fullTitle);
    }

    res.json({ success: true, message: 'Música actualizada', data: currentMusic });
});

// Endpoint para obtener el historial
app.get('/history', (req, res) => {
    log.debug('GET /history - Solicitando historial');
    res.json(musicHistory);
});

// Endpoint de estado
app.get('/status', (req, res) => {
    const status = {
        status: 'running',
        config: {
            port: CONFIG.PORT,
            host: CONFIG.HOST,
            maxHistory: CONFIG.MAX_HISTORY,
            debug: CONFIG.DEBUG
        },
        currentSong: currentMusic,
        historyLength: musicHistory.length,
        uptime: process.uptime()
    };

    log.debug('GET /status - Solicitando estado del servidor');
    res.json(status);
});

// Página de estado simple
app.get('/', (req, res) => {
    const uptime = new Date(process.uptime() * 1000).toISOString().substr(11, 8);
    res.send(`
        <style>
            body { font-family: sans-serif; background-color: #121212; color: #eee; padding: 20px; }
            h1 { color: #1DB954; }
            h2 { color: #aaa; }
            pre { background-color: #282828; padding: 15px; border-radius: 5px; overflow-x: auto; }
            a { color: #1DB954; }
            .badge { background: #1DB954; color: #000; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        </style>
        <h1>🎵 Music Overlay Server</h1>
        <p>Tiempo activo: ${uptime} <span class="badge">${CONFIG.DEBUG ? 'DEBUG' : 'PRODUCTION'}</span></p>
        <h2>🎧 Ahora Sonando:</h2>
        <pre>${JSON.stringify(currentMusic, null, 2)}</pre>
        <h2>📡 Endpoints Disponibles:</h2>
        <ul>
            <li><a href="/current">/current</a> - Obtener música actual</li>
            <li>/update (POST) - Actualizar música (desde extensión)</li>
            <li><a href="/history">/history</a> - Ver historial de canciones</li>
            <li><a href="/status">/status</a> - Estado del servidor</li>
        </ul>
        <p>Puerto: ${CONFIG.PORT} | Host: ${CONFIG.HOST} | Historial: ${musicHistory.length}/${MAX_HISTORY} canciones</p>
        <p>Actualización automática cada 5 segundos</p>
        <script>
            setInterval(async () => {
                try {
                    const response = await fetch('/current');
                    const data = await response.json();
                    document.querySelector('pre').textContent = JSON.stringify(data, null, 2);
                } catch (error) {
                    document.querySelector('pre').textContent = 'Error al cargar datos.';
                }
            }, 5000);
        </script>
    `);
});

// Manejo de errores global
app.use((err, req, res, next) => {
    log.error('Error en el servidor:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: CONFIG.DEBUG ? err.message : undefined
    });
});

// Iniciar servidor
app.listen(CONFIG.PORT, CONFIG.HOST, () => {
    log.info(`Servidor Music Overlay escuchando en http://${CONFIG.HOST}:${CONFIG.PORT}`);
    log.info('   - /current: Devuelve la canción actual');
    log.info('   - /update (POST): Actualiza la canción (usado por la extensión)');
    log.info('   - /history: Devuelve el historial de canciones');
    log.info('   - /status: Devuelve el estado del servidor');
    log.info(`   - Modo: ${CONFIG.DEBUG ? 'DEBUG' : 'PRODUCTION'}`);
});

// Manejo de cierre del servidor
process.on('SIGINT', () => {
    log.info('Servidor detenido por el usuario');
    process.exit(0);
});

process.on('SIGTERM', () => {
    log.info('Servidor detenido por señal SIGTERM');
    process.exit(0);
});
