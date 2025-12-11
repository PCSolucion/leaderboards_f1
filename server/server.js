/**
* Servidor Local para Music Overlay
*
* Este servidor actúa como puente entre YouTube (extensión) y OBS (widget)
* permitiendo la comunicación entre diferentes dominios.
*/
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Configuración
app.use(cors()); // Permitir CORS para que OBS y la extensión puedan acceder
app.use(express.json()); // Parsear JSON en las peticiones

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
const MAX_HISTORY = 50;

// Endpoint para obtener la canción actual
app.get('/current', (req, res) => {
    res.json(currentMusic);
});

// Endpoint para actualizar la canción (desde la extensión)
app.post('/update', (req, res) => {
    const { artist, song, fullTitle, isPlaying, url } = req.body;

    if (artist && song && fullTitle) {
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
            console.log('🎵 Música actualizada:', currentMusic.artist, '-', currentMusic.song, `(Playing: ${currentMusic.isPlaying})`);

            // Añadir al historial
            musicHistory.unshift(currentMusic);
            if (musicHistory.length > MAX_HISTORY) {
                musicHistory.pop();
            }
        }
        res.json({ success: true, message: 'Música actualizada', data: currentMusic });
    } else {
        res.status(400).json({ success: false, message: 'Faltan datos (artist, song, fullTitle)' });
    }
});

// Endpoint para obtener el historial
app.get('/history', (req, res) => {
    res.json(musicHistory);
});

// Endpoint de estado
app.get('/status', (req, res) => {
    res.json({
        status: 'running',
        port: port,
        currentSong: currentMusic,
        historyLength: musicHistory.length,
        uptime: process.uptime()
    });
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
        </style>
        <h1>🎵 Music Overlay Server</h1>
        <p>Tiempo activo: ${uptime}</p>
        <h2>🎧 Ahora Sonando:</h2>
        <pre>${JSON.stringify(currentMusic, null, 2)}</pre>
        <h2>📡 Endpoints Disponibles:</h2>
        <ul>
            <li><a href="/current">/current</a> - Obtener música actual</li>
            <li>/update (POST) - Actualizar música (desde extensión)</li>
            <li><a href="/history">/history</a> - Ver historial de canciones</li>
            <li><a href="/status">/status</a> - Estado del servidor</li>
        </ul>
        <p>Puerto: ${port} | Historial: ${musicHistory.length} canciones</p>
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

// Iniciar servidor
app.listen(port, '127.0.0.1', () => {
    console.log(`🚀 Servidor Music Overlay escuchando en http://127.0.0.1:${port}`);
    console.log('   - /current: Devuelve la canción actual');
    console.log('   - /update (POST): Actualiza la canción (usado por la extensión)');
    console.log('   - /history: Devuelve el historial de canciones');
    console.log('   - /status: Devuelve el estado del servidor');
});

// Manejo de cierre del servidor
process.on('SIGINT', () => {
    console.log('\n🛑 Servidor detenido.');
    process.exit(0);
});
