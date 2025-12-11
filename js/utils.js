/**
 * Utilidades compartidas para el proyecto
 * Mejora la reutilización de código y mantenibilidad
 */

/**
 * Gestor centralizado de timers para prevenir memory leaks
 */
class TimerManager {
    constructor() {
        this.timers = new Map();
        this.intervals = new Map();
    }

    /**
     * Crea un timeout con ID único
     * @param {Function} callback 
     * @param {number} delay 
     * @param {string} id - Identificador único del timer
     * @returns {string} ID del timer
     */
    setTimeout(callback, delay, id = null) {
        const timerId = id || `timeout_${Date.now()}_${Math.random()}`;

        // Limpiar timer previo si existe
        if (this.timers.has(timerId)) {
            clearTimeout(this.timers.get(timerId));
        }

        const timer = setTimeout(() => {
            callback();
            this.timers.delete(timerId);
        }, delay);

        this.timers.set(timerId, timer);
        return timerId;
    }

    /**
     * Crea un interval con ID único
     * @param {Function} callback 
     * @param {number} delay 
     * @param {string} id - Identificador único del interval
     * @returns {string} ID del interval
     */
    setInterval(callback, delay, id = null) {
        const intervalId = id || `interval_${Date.now()}_${Math.random()}`;

        // Limpiar interval previo si existe
        if (this.intervals.has(intervalId)) {
            clearInterval(this.intervals.get(intervalId));
        }

        const interval = setInterval(callback, delay);
        this.intervals.set(intervalId, interval);
        return intervalId;
    }

    /**
     * Limpia un timeout específico
     */
    clearTimeout(id) {
        if (this.timers.has(id)) {
            clearTimeout(this.timers.get(id));
            this.timers.delete(id);
        }
    }

    /**
     * Limpia un interval específico
     */
    clearInterval(id) {
        if (this.intervals.has(id)) {
            clearInterval(this.intervals.get(id));
            this.intervals.delete(id);
        }
    }

    /**
     * Limpia todos los timers
     */
    clearAll() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.intervals.forEach(interval => clearInterval(interval));
        this.timers.clear();
        this.intervals.clear();
    }
}

/**
 * Validador de configuración
 */
class ConfigValidator {
    /**
     * Valida que un objeto tenga las propiedades requeridas
     * @param {Object} config - Objeto a validar
     * @param {Array<string>} requiredProps - Propiedades requeridas
     * @param {string} configName - Nombre de la configuración (para mensajes de error)
     * @returns {boolean} true si es válido
     */
    static validateRequired(config, requiredProps, configName = 'Config') {
        if (!config) {
            console.error(`❌ ${configName} no está definido`);
            return false;
        }

        const missingProps = requiredProps.filter(prop => !(prop in config));

        if (missingProps.length > 0) {
            console.error(`❌ ${configName} tiene propiedades faltantes:`, missingProps);
            return false;
        }

        return true;
    }

    /**
     * Valida tipos de propiedades
     * @param {Object} config 
     * @param {Object} schema - { propName: 'expectedType' }
     * @param {string} configName 
     * @returns {boolean}
     */
    static validateTypes(config, schema, configName = 'Config') {
        for (const [prop, expectedType] of Object.entries(schema)) {
            if (prop in config) {
                const actualType = typeof config[prop];
                if (actualType !== expectedType) {
                    console.warn(`⚠️ ${configName}.${prop} debería ser ${expectedType}, pero es ${actualType}`);
                }
            }
        }
        return true;
    }
}

/**
 * Utilidades de retry para peticiones HTTP
 */
class RetryHelper {
    /**
     * Ejecuta una función con reintentos exponenciales
     * @param {Function} fn - Función async a ejecutar
     * @param {Object} options - Opciones de retry
     * @returns {Promise<any>}
     */
    static async withRetry(fn, options = {}) {
        const {
            maxRetries = 3,
            initialDelay = 1000,
            maxDelay = 10000,
            backoffMultiplier = 2,
            onRetry = null
        } = options;

        let lastError;
        let delay = initialDelay;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;

                if (attempt < maxRetries) {
                    if (onRetry) {
                        onRetry(attempt + 1, maxRetries, delay);
                    }

                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay = Math.min(delay * backoffMultiplier, maxDelay);
                } else {
                    throw lastError;
                }
            }
        }

        throw lastError;
    }
}

/**
 * Utilidades DOM
 */
class DOMHelper {
    /**
     * Cache de elementos DOM
     */
    static elementCache = new Map();

    /**
     * Obtiene un elemento del DOM y lo cachea
     * @param {string} selector 
     * @param {boolean} forceRefresh - Forzar recarga del elemento
     * @returns {HTMLElement|null}
     */
    static getElement(selector, forceRefresh = false) {
        if (!forceRefresh && this.elementCache.has(selector)) {
            return this.elementCache.get(selector);
        }

        const element = document.querySelector(selector);
        if (element) {
            this.elementCache.set(selector, element);
        }
        return element;
    }

    /**
     * Limpia el cache de elementos
     */
    static clearCache() {
        this.elementCache.clear();
    }

    /**
     * Escape HTML seguro
     * @param {string} text 
     * @returns {string}
     */
    static escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

/**
 * Normalización de nombres de usuario
 */
class UsernameHelper {
    /**
     * Aliases conocidos de usuarios
     */
    static ALIASES = {
        'c_h_a_n_d_a_l_f': 'chandalf'
    };

    /**
     * Normaliza un nombre de usuario
     * @param {string} username 
     * @returns {string}
     */
    static normalize(username) {
        const lower = username.toLowerCase();
        return this.ALIASES[lower] || lower;
    }

    /**
     * Verifica si dos nombres de usuario son equivalentes
     * @param {string} username1 
     * @param {string} username2 
     * @returns {boolean}
     */
    static areEqual(username1, username2) {
        return this.normalize(username1) === this.normalize(username2);
    }
}

/**
 * Constantes de UI para evitar magic numbers
 */
const UI_CONSTANTS = {
    // Tiempos
    TTS_PAUSE_BETWEEN_MESSAGES_MS: 300,
    MUSIC_CHECK_RETRY_DELAY_MS: 2000,
    CHAT_HEADER_CACHE_TIMEOUT_MS: 100,

    // Tamaños de texto
    USERNAME_LENGTH_THRESHOLD: 12,
    USERNAME_LONG_FONT_SIZE: '1.3rem',

    // Timestamps
    FIVE_MINUTES_MS: 5 * 60 * 1000,

    // Límites
    DEFAULT_TOP_LIMIT: 15,
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.TimerManager = TimerManager;
    window.ConfigValidator = ConfigValidator;
    window.RetryHelper = RetryHelper;
    window.DOMHelper = DOMHelper;
    window.UsernameHelper = UsernameHelper;
    window.UI_CONSTANTS = UI_CONSTANTS;
}
