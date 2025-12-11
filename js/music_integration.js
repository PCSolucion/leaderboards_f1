/**
 * Servicio de integración con Music OBS Widget
 * Consulta el servidor local para obtener la canción actual y la envía al chat
 */
class MusicIntegrationService {
    constructor() {
        this.config = CHAT_CONFIG.MUSIC;
        this.lastSongTitle = null;
        this.intervalId = null;
        this.isInitialized = false;
    }

    init() {
        if (!this.config || !this.config.ENABLED) {
            console.log('🎵 Integración de música desactivada en configuración');
            return;
        }

        console.log('🎵 Iniciando servicio de integración de música...');
        this.isInitialized = true;

        // Primera verificación inmediata
        this.checkSong();

        // Iniciar intervalo
        this.intervalId = setInterval(() => this.checkSong(), this.config.CHECK_INTERVAL);
    }

    async checkSong() {
        if (!this.isInitialized) return;

        try {
            const response = await fetch(this.config.ENDPOINT);

            if (!response.ok) {
                if (CHAT_CONFIG.DEBUG) console.warn(`⚠️ Error al consultar música: ${response.status}`);
                return;
            }

            const data = await response.json();

            // Validar datos
            // Validar datos
            // El servidor devuelve { artist, song, fullTitle, ... }
            if (!data || (!data.song && !data.title) || !data.artist) return;

            // Normalizar título (el servidor usa 'song', pero soportamos 'title' por si acaso)
            const songTitle = data.song || data.title;

            // Ignorar si es el estado de espera
            if (data.artist === this.config.IGNORE_STATUS) return;

            // Construir identificador único de la canción
            const currentSongId = `${songTitle} - ${data.artist}`;

            // Si la canción ha cambiado
            if (this.lastSongTitle !== currentSongId) {
                this.lastSongTitle = currentSongId;

                // Enviar mensaje al chat como liiukiin
                this.announceSong(songTitle, data.artist);
            }

        } catch (error) {
            // Silencioso por defecto para no llenar la consola si el servidor no está corriendo
            if (CHAT_CONFIG.DEBUG) {
                console.warn('⚠️ No se pudo conectar con el servidor de música (¿está corriendo?)', error);
            }
        }
    }

    announceSong(title, artist) {
        const message = `${this.config.MESSAGE_PREFIX}${title} - ${artist}`;

        console.log(`🎵 Nueva canción detectada: ${message}`);

        // Usar la función global simularMensaje expuesta por ChatApp
        if (typeof window.simularMensaje === 'function') {
            window.simularMensaje('liiukiin', message);
        } else {
            console.error('❌ La función simularMensaje no está disponible');
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isInitialized = false;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que ChatApp se haya inicializado
    setTimeout(() => {
        const musicService = new MusicIntegrationService();
        musicService.init();

        // Exponer para depuración
        window.musicService = musicService;
    }, 2000);
});
