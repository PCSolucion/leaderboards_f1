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
        this.maxConsecutiveErrors = UI_CONSTANTS.MAX_CONSECUTIVE_ERRORS;
        this.isServerAvailable = true;
        this.abortController = null; // Para cancelar peticiones pendientes
    }

    init() {
        if (!this.config || !this.config.ENABLED) {
            Logger.info('Integración de música desactivada en configuración');
            return;
        }

        Logger.info('Iniciando servicio de integración de música...');
        this.isInitialized = true;

        // Primera verificación inmediata
        this.checkSong();

        // Iniciar intervalo usando constante
        this.intervalId = setInterval(() => this.checkSong(), UI_CONSTANTS.MUSIC_CHECK_INTERVAL_MS);
    }

    async checkSong() {
        if (!this.isInitialized) return;

        // Si hemos detectado que el servidor no está disponible, intentar menos frecuentemente
        if (!this.isServerAvailable) {
            if (this.consecutiveErrors % 10 === 0) {
                // Reintentar cada 10 intentos fallidos
                Logger.debug('Reintentando conexión al servidor de música...');
            } else {
                return; // Salir sin intentar
            }
        }

        try {
            // Cancelar petición previa si existe
            if (this.abortController) {
                Logger.debug('Cancelando petición de música anterior');
                this.abortController.abort();
            }

            // Crear nuevo AbortController para esta petición
            this.abortController = new AbortController();
            const signal = this.abortController.signal;

            const fetchData = async () => {
                const response = await fetch(this.config.ENDPOINT, {
                    method: 'GET',
                    signal: signal,
                    headers: {
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
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
                            Logger.debug(`Reintentando petición de música (${attempt}/${max})...`);
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
            // Si el error es por abort, no contar como error real
            if (error.name === 'AbortError') {
                Logger.debug('Petición de música cancelada');
                return;
            }

            this.consecutiveErrors++;

            // Marcar servidor como no disponible después de varios errores
            if (this.consecutiveErrors >= this.maxConsecutiveErrors) {
                if (this.isServerAvailable) {
                    Logger.warn('Servidor de música no disponible. Pausando reintentos frecuentes...');
                    this.isServerAvailable = false;
                }
            }

            // Log solo en modo debug o en el primer error
            if (CHAT_CONFIG.DEBUG || this.consecutiveErrors === 1) {
                Logger.warn('No se pudo conectar con el servidor de música:', error.message);
            }
        } finally {
            // Limpiar AbortController después de la petición
            this.abortController = null;
        }
    }

    announceSong(title, artist) {
        const message = `${this.config.MESSAGE_PREFIX}${title} - ${artist}`;

        Logger.info(`Nueva canción detectada: ${message}`);

        // Usar la función global simularMensaje expuesta por ChatApp
        if (typeof window.simularMensaje === 'function') {
            window.simularMensaje('liiukiin', message);

            // Emitir evento para otros módulos
            if (window.appEvents) {
                window.appEvents.emit('music:changed', { title, artist, message });
            }
        } else {
            Logger.error('La función simularMensaje no está disponible');
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        // Cancelar cualquier petición pendiente
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }

        this.isInitialized = false;
        this.consecutiveErrors = 0;
        this.isServerAvailable = true;

        Logger.info('Servicio de música detenido');
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
