/**
 * Servicio de integración con Music OBS Widget
 * Consulta el servidor local para obtener la canción actual y la envía al chat
 * Versión mejorada con retry logic y mejor manejo de errores
 */
class MusicIntegrationService {
    constructor() {
        this.config = CHAT_CONFIG.MUSIC;
        this.lastSongTitle = null;
        this.intervalId = null;
        this.isInitialized = false;
        this.consecutiveErrors = 0;
        this.maxConsecutiveErrors = 5;
        this.isServerAvailable = true;
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

        // Si hemos detectado que el servidor no está disponible, intentar menos frecuentemente
        if (!this.isServerAvailable) {
            if (this.consecutiveErrors % 10 === 0) {
                // Reintentar cada 10 intentos fallidos
                console.log('🔄 Reintentando conexión al servidor de música...');
            } else {
                return; // Salir sin intentar
            }
        }

        try {
            // Usar RetryHelper si está disponible
            const fetchData = async () => {
                const response = await fetch(this.config.ENDPOINT, {
                    method: 'GET',
                    signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                return await response.json();
            };

            const data = window.RetryHelper
                ? await RetryHelper.withRetry(fetchData, {
                    maxRetries: 2,
                    initialDelay: 500,
                    maxDelay: 2000,
                    onRetry: (attempt, max) => {
                        if (CHAT_CONFIG.DEBUG) {
                            console.log(`🔄 Reintentando petición de música (${attempt}/${max})...`);
                        }
                    }
                })
                : await fetchData();

            // Reset contador de errores si la petición fue exitosa
            this.consecutiveErrors = 0;
            this.isServerAvailable = true;

            // Validar datos
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
            this.consecutiveErrors++;

            // Marcar servidor como no disponible después de varios errores
            if (this.consecutiveErrors >= this.maxConsecutiveErrors) {
                if (this.isServerAvailable) {
                    console.warn('⚠️ Servidor de música no disponible. Pausando reintentos frecuentes...');
                    this.isServerAvailable = false;
                }
            }

            // Log solo en modo debug o en el primer error
            if (CHAT_CONFIG.DEBUG || this.consecutiveErrors === 1) {
                console.warn('⚠️ No se pudo conectar con el servidor de música:', error.message);
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
        this.consecutiveErrors = 0;
        this.isServerAvailable = true;
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
