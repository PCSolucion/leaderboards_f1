/**
 * Feature Flags - Control de funcionalidades
 * Permite activar/desactivar features sin cambiar el código
 */
const FEATURES = {
    // Funcionalidades principales
    TTS_ENABLED: true,
    MUSIC_INTEGRATION: true,
    PURPLE_ICON_TRACKING: true,
    CHAT_DISPLAY: true,

    // Modo debug y logging
    DEBUG_MODE: false,
    VERBOSE_LOGGING: false,

    // Características experimentales
    EXPERIMENTAL_FEATURES: false,
    ADVANCED_ANIMATIONS: true,

    // Accesibilidad
    SCREEN_READER_SUPPORT: true,
    HIGH_CONTRAST_MODE: false,

    // Performance
    USE_REQUEST_ANIMATION_FRAME: true,
    CACHE_DOM_ELEMENTS: true,
};

/**
 * Configuración del entorno
 * Detecta automáticamente si está en desarrollo o producción
 */
const ENV_CONFIG = {
    // Detectar entorno
    isDevelopment: window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:',

    isProduction: window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1' &&
        window.location.protocol !== 'file:',

    // URLs base según entorno
    get musicServerUrl() {
        return this.isDevelopment
            ? 'http://127.0.0.1:3000'
            : 'http://127.0.0.1:3000'; // Cambiar en producción si es necesario
    },

    // Nivel de logging según entorno
    get logLevel() {
        return this.isDevelopment ? 'DEBUG' : 'WARN';
    },

    // Performance settings
    get enablePerformanceMonitoring() {
        return this.isDevelopment;
    }
};

// Configurar Logger según el entorno
if (typeof window !== 'undefined' && window.Logger) {
    Logger.setLevel(ENV_CONFIG.logLevel);

    if (ENV_CONFIG.isDevelopment) {
        Logger.info('🔧 Modo Desarrollo Activado');
        Logger.debug('Feature Flags:', FEATURES);
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.FEATURES = FEATURES;
    window.ENV_CONFIG = ENV_CONFIG;
}

// Configuración de módulos exportable
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FEATURES, ENV_CONFIG };
}
