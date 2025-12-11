/**
 * Módulo de Accesibilidad
 * Mejora el soporte para lectores de pantalla y accesibilidad general
 */
class AccessibilityManager {
    constructor(config) {
        this.config = config || CHAT_CONFIG.ACCESSIBILITY || {};
        this.enabled = this.config.ENABLE_ARIA !== false;
        this.announcer = null;
        this.init();
    }

    init() {
        if (!this.enabled) {
            Logger.info('Soporte de accesibilidad desactivado');
            return;
        }

        Logger.info('Inicializando AccessibilityManager');
        this.createLiveRegion();
        this.setupKeyboardNavigation();
        this.checkColorContrast();
    }

    /**
     * Crea una región ARIA live para anuncios al lector de pantalla
     */
    createLiveRegion() {
        if (document.getElementById('aria-live-announcer')) return;

        this.announcer = DOMHelper.createElement('div', {
            id: 'aria-live-announcer',
            className: 'sr-only',
            'role': 'status',
            'aria-live': 'polite',
            'aria-atomic': 'true',
            style: `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `
        });

        document.body.appendChild(this.announcer);
        Logger.debug('Región ARIA live creada');
    }

    /**
     * Anuncia un mensaje al lector de pantalla
     * @param {string} message 
     * @param {string} priority - 'polite' o 'assertive'
     */
    announce(message, priority = 'polite') {
        if (!this.enabled || !this.announcer) return;

        // Limpiar el mensaje anterior
        this.announcer.textContent = '';
        this.announcer.setAttribute('aria-live', priority);

        // Agregar el nuevo mensaje después de un pequeño delay
        setTimeout(() => {
            DOMHelper.setTextSafely(this.announcer, message);
            Logger.debug('Anuncio ARIA:', message);
        }, 100);
    }

    /**
     * Actualiza el estado ARIA de un elemento
     * @param {HTMLElement} element 
     * @param {Object} attributes 
     */
    static updateAriaAttributes(element, attributes) {
        if (!element) return;

        Object.entries(attributes).forEach(([key, value]) => {
            if (key.startsWith('aria-')) {
                element.setAttribute(key, value);
            }
        });
    }

    /**
     * Configura navegación por teclado
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC para cerrar/ocultar elementos
            if (e.key === 'Escape') {
                if (window.appEvents) {
                    window.appEvents.emit('keyboard:escape');
                }
            }

            // Teclas de navegación (flechas)
            if (e.key.startsWith('Arrow')) {
                // Permitir navegación personalizada
                if (window.appEvents) {
                    window.appEvents.emit('keyboard:arrow', e.key);
                }
            }
        });

        Logger.debug('Navegación por teclado configurada');
    }

    /**
     * Verifica el contraste de colores (básico)
     */
    checkColorContrast() {
        // En desarrollo, advertir sobre posibles problemas de contraste
        if (ENV_CONFIG && ENV_CONFIG.isDevelopment) {
            Logger.debug('Verificación de contraste de colores activada en modo desarrollo');
            // Aquí se podría implementar verificación automática
        }
    }

    /**
     * Actualiza el label dinámico del chat
     * @param {string} username 
     * @param {string} message 
     */
    updateChatLabel(username, message) {
        const chatContainer = DOMHelper.getElement('.chat-container');
        if (chatContainer) {
            AccessibilityManager.updateAriaAttributes(chatContainer, {
                'aria-label': `Mensaje de ${username}: ${message.substring(0, 50)}...`
            });
        }
    }

    /**
     * Anuncia cambio en la tabla de líderes
     * @param {string} driver 
     * @param {number} position 
     */
    announceLeaderboardChange(driver, position) {
        const message = `${driver} está ahora en la posición ${position}`;
        this.announce(message, 'polite');
    }

    /**
     * Anuncia nueva canción
     * @param {string} title 
     * @param {string} artist 
     */
    announceSongChange(title, artist) {
        const message = `Ahora sonando: ${title} de ${artist}`;
        this.announce(message, 'polite');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia global
    window.accessibilityManager = new AccessibilityManager();

    // Escuchar eventos de aplicación
    if (window.appEvents) {
        // Anunciar cambios de música
        window.appEvents.on('music:changed', ({ title, artist }) => {
            window.accessibilityManager.announceSongChange(title, artist);
        });

        // Anunciar cambios en el chat
        window.appEvents.on('chat:message', ({ username, message }) => {
            window.accessibilityManager.updateChatLabel(username, message);
        });
    }
});
