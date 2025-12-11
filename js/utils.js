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
     * Escape HTML seguro para prevenir XSS
     * @param {string} text 
     * @returns {string}
     */
    static escapeHTML(text) {
        if (typeof text !== 'string') return '';

        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Sanitiza HTML permitiendo solo tags seguros
     * @param {string} html 
     * @returns {string}
     */
    static sanitizeHTML(html) {
        if (typeof html !== 'string') return '';

        // Remover scripts y eventos inline
        const temp = document.createElement('div');
        temp.textContent = html;
        let sanitized = temp.innerHTML;

        // Prevenir javascript: URLs y event handlers
        sanitized = sanitized.replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');

        return sanitized;
    }

    /**
     * Crea un elemento de forma segura con propiedades
     * @param {string} tag 
     * @param {Object} props 
     * @param {string|HTMLElement[]} children 
     * @returns {HTMLElement}
     */
    static createElement(tag, props = {}, children = null) {
        const element = document.createElement(tag);

        // Aplicar propiedades
        Object.entries(props).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                // Sanitizar HTML antes de asignar
                element.innerHTML = this.sanitizeHTML(value);
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });

        // Agregar hijos
        if (children) {
            if (typeof children === 'string') {
                element.textContent = children;
            } else if (Array.isArray(children)) {
                children.forEach(child => {
                    if (child instanceof HTMLElement) {
                        element.appendChild(child);
                    }
                });
            }
        }

        return element;
    }

    /**
     * Actualiza texto de forma segura
     * @param {HTMLElement} element 
     * @param {string} text 
     */
    static setTextSafely(element, text) {
        if (element && typeof text === 'string') {
            element.textContent = text;
        }
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
 * Sistema de Logging centralizado
 */
class Logger {
    static LOG_LEVELS = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        NONE: 4
    };

    static currentLevel = Logger.LOG_LEVELS.INFO;
    static prefix = '🎮';

    static setLevel(level) {
        this.currentLevel = typeof level === 'string'
            ? this.LOG_LEVELS[level.toUpperCase()]
            : level;
    }

    static shouldLog(level) {
        return this.currentLevel <= level;
    }

    static debug(message, ...args) {
        if (this.shouldLog(this.LOG_LEVELS.DEBUG)) {
            console.log(`${this.prefix} [DEBUG]`, message, ...args);
        }
    }

    static info(message, ...args) {
        if (this.shouldLog(this.LOG_LEVELS.INFO)) {
            console.log(`${this.prefix} [INFO]`, message, ...args);
        }
    }

    static warn(message, ...args) {
        if (this.shouldLog(this.LOG_LEVELS.WARN)) {
            console.warn(`${this.prefix} [WARN]`, message, ...args);
        }
    }

    static error(message, ...args) {
        if (this.shouldLog(this.LOG_LEVELS.ERROR)) {
            console.error(`${this.prefix} [ERROR]`, message, ...args);
        }
    }
}

/**
 * EventEmitter para comunicación entre módulos (PubSub pattern)
 */
class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);

        // Retornar función para unsubscribe
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.events.has(event)) return;

        const callbacks = this.events.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event, ...args) {
        if (!this.events.has(event)) return;

        this.events.get(event).forEach(callback => {
            try {
                callback(...args);
            } catch (error) {
                Logger.error(`Error en evento '${event}':`, error);
            }
        });
    }

    once(event, callback) {
        const onceCallback = (...args) => {
            callback(...args);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }

    clear(event) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }
}

/**
 * Utilidades de Performance - Debouncing y Throttling
 */
class PerformanceHelper {
    /**
     * Debounce - Ejecuta la función después de que pasen 'delay' ms sin nuevas llamadas
     */
    static debounce(func, delay) {
        let timeoutId;
        return function debounced(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Throttle - Ejecuta la función como máximo una vez cada 'limit' ms
     */
    static throttle(func, limit) {
        let inThrottle;
        return function throttled(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * RequestAnimationFrame wrapper para animaciones suaves
     */
    static rafThrottle(func) {
        let rafId = null;
        return function rafThrottled(...args) {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(() => {
                func.apply(this, args);
                rafId = null;
            });
        };
    }
}

/**
 * Constantes de UI para evitar magic numbers
 */
const UI_CONSTANTS = {
    // Tiempos de animación
    TTS_PAUSE_BETWEEN_MESSAGES_MS: 300,
    MUSIC_CHECK_RETRY_DELAY_MS: 2000,
    CHAT_HEADER_CACHE_TIMEOUT_MS: 100,
    CHAT_DISPLAY_DURATION_MS: 5500,
    CHAT_TRANSITION_DURATION_MS: 700,

    // Intervalos
    MUSIC_CHECK_INTERVAL_MS: 5000,
    PURPLE_ICON_UPDATE_INTERVAL_MS: 10000,
    TABLE_UPDATE_INTERVAL_MS: 5000,

    // Tamaños de texto
    USERNAME_LENGTH_THRESHOLD: 12,
    USERNAME_LONG_FONT_SIZE: '1.3rem',

    // Timestamps
    FIVE_MINUTES_MS: 5 * 60 * 1000,

    // Límites
    DEFAULT_TOP_LIMIT: 15,
    MAX_CONSECUTIVE_ERRORS: 5,
    MAX_MUSIC_HISTORY: 50,

    // Retry config
    DEFAULT_MAX_RETRIES: 3,
    DEFAULT_INITIAL_DELAY_MS: 1000,
    DEFAULT_MAX_DELAY_MS: 10000,

    // Volúmenes
    DEFAULT_AUDIO_VOLUME: 1.0,
    DEFAULT_TTS_VOLUME: 0.8,

    // TTS
    TTS_MAX_CHARS: 150,
    TTS_SKIP_IF_LONGER_THAN: 200,
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.TimerManager = TimerManager;
    window.ConfigValidator = ConfigValidator;
    window.RetryHelper = RetryHelper;
    window.DOMHelper = DOMHelper;
    window.UsernameHelper = UsernameHelper;
    window.Logger = Logger;
    window.EventEmitter = EventEmitter;
    window.PerformanceHelper = PerformanceHelper;
    window.UI_CONSTANTS = UI_CONSTANTS;

    // Crear instancia global de EventEmitter
    window.appEvents = new EventEmitter();
}
