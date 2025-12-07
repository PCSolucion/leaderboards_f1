/**
 * Lógica principal del Overlay de Chat de Twitch
 * Refactorizado con principios SOLID
 */

// ============================================
// SERVICIOS
// ============================================

/**
 * Servicio encargado de la gestión de datos (Equipos, Números)
 */
class ChatDataService {
    constructor(config, teamsData, userNumbersData, userTeamsData) {
        this.config = config;
        this.teams = teamsData;
        this.userNumbers = userNumbersData;
        this.userTeams = userTeamsData;
    }

    /**
     * Obtiene el número de piloto para un usuario
     * @param {string} username 
     * @returns {number}
     */
    getUserNumber(username) {
        const lowerUser = username.toLowerCase();

        if (lowerUser === this.config.SPECIAL_USER.username) {
            return this.config.SPECIAL_USER.number;
        }

        if (this.userNumbers[lowerUser]) {
            return this.userNumbers[lowerUser];
        }

        return Math.floor(
            Math.random() * (this.config.MAX_RANDOM_NUMBER - this.config.MIN_RANDOM_NUMBER + 1)
        ) + this.config.MIN_RANDOM_NUMBER;
    }

    /**
     * Obtiene el equipo para un usuario
     * @param {string} username 
     * @returns {Object}
     */
    getUserTeam(username) {
        const lowerUser = username.toLowerCase();

        if (lowerUser === this.config.SPECIAL_USER.username) {
            return this.teams[this.config.SPECIAL_USER.team];
        }

        const teamKey = this.userTeams[lowerUser];
        if (teamKey && this.teams[teamKey]) {
            return this.teams[teamKey];
        }

        return this.getRandomTeam();
    }

    /**
     * Obtiene un equipo aleatorio
     * @returns {Object}
     */
    getRandomTeam() {
        const teamKeys = Object.keys(this.teams);
        const randomKey = teamKeys[Math.floor(Math.random() * teamKeys.length)];
        return this.teams[randomKey];
    }
}

/**
 * Servicio encargado del Audio
 */
class ChatAudioService {
    constructor(audioUrl, volume) {
        this.audioUrl = audioUrl;
        this.volume = volume;
        this.audioElement = null;
        this.init();
    }

    init() {
        try {
            this.audioElement = new Audio(this.audioUrl);
            this.audioElement.preload = 'auto';
            this.audioElement.volume = this.volume;

            this.audioElement.addEventListener('error', (e) => {
                console.error('Error al cargar el audio:', e);
            });
        } catch (error) {
            console.error('Error al inicializar AudioService:', error);
        }
    }

    play() {
        if (!this.audioElement) return;

        try {
            this.audioElement.currentTime = 0;
            this.audioElement.play().catch((error) => {
                console.warn('No se pudo reproducir el audio (posiblemente bloqueado por el navegador):', error);
            });
        } catch (error) {
            console.error('Error al reproducir audio:', error);
        }
    }
}

/**
 * Servicio encargado de la conexión con Twitch
 */
class TwitchService {
    constructor(channel, onMessageCallback) {
        this.channel = channel;
        this.onMessageCallback = onMessageCallback;
        this.client = null;
    }

    connect() {
        try {
            // @ts-ignore
            this.client = new tmi.Client({
                channels: [this.channel]
            });

            this.client.on('connected', (address, port) => {
                console.log(`✅ Conectado a Twitch IRC: ${address}:${port}`);
            });

            this.client.on('message', (channel, tags, message, self) => {
                if (this.onMessageCallback) {
                    this.onMessageCallback(tags, message);
                }
            });

            this.client.on('disconnected', (reason) => {
                console.warn('⚠️ Desconectado de Twitch IRC:', reason);
            });

            this.client.connect().catch((error) => {
                console.error('❌ Error al conectar con Twitch:', error);
            });

        } catch (error) {
            console.error('❌ Error al inicializar TwitchService:', error);
        }
    }
}

/**
 * Gestor de la Interfaz de Usuario (UI)
 */
class ChatUIManager {
    constructor(config) {
        this.config = config;
        this.dom = {
            username: document.getElementById('chat-username'),
            number: document.querySelector('.chat-number'),
            message: document.getElementById('chat-message'),
            container: document.querySelector('.chat-container'),
            teamLogo: document.querySelector('.chat-team-logo'),
            root: document.documentElement
        };
        this.hideTimeout = null;
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    processEmotes(text, emotes) {
        if (!emotes) return this.escapeHTML(text);

        try {
            let splitText = text.split('');
            let emoteReplacements = [];

            Object.entries(emotes).forEach(([emoteId, positions]) => {
                positions.forEach(pos => {
                    const [start, end] = pos.split('-').map(Number);
                    emoteReplacements.push({ start, end, id: emoteId });
                });
            });

            emoteReplacements.sort((a, b) => b.start - a.start);

            emoteReplacements.forEach(({ start, end, id }) => {
                const emoteImg = `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/2.0" alt="emote" class="emote-img" style="height:${this.config.EMOTE_SIZE};vertical-align:middle;">`;
                splitText.splice(start, end - start + 1, emoteImg);
            });

            return splitText.map(char => {
                return char.startsWith('<img') ? char : this.escapeHTML(char);
            }).join('');

        } catch (error) {
            console.error('Error al procesar emotes:', error);
            return this.escapeHTML(text);
        }
    }

    displayMessage(username, message, emotes, userNumber, team, isTopChatter = false) {
        try {
            // Actualizar contenido - añadir 🔥 si es el top chatter del día
            const topIndicator = isTopChatter ? ' 🔥' : '';
            this.dom.username.textContent = username.toUpperCase() + topIndicator;
            this.dom.number.textContent = userNumber;
            this.dom.root.style.setProperty('--chat-team-color', team.color);
            this.dom.teamLogo.style.backgroundImage = `url('${team.logo}')`;

            // Procesar mensaje
            const processedMessage = this.processEmotes(message, emotes);
            this.dom.message.innerHTML = `"${processedMessage}"`;

            // Accesibilidad
            if (this.config.ACCESSIBILITY.ENABLE_ARIA) {
                const topText = isTopChatter ? ' (top chatter del día)' : '';
                this.dom.message.setAttribute('aria-label', `Mensaje de ${username}${topText}: ${message}`);
            }

            // Mostrar
            this.dom.container.style.opacity = '1';
            this.dom.container.style.visibility = 'visible';

            // Añadir/quitar clase de top chatter al contenedor
            if (isTopChatter) {
                this.dom.container.classList.add('streak-active');
            } else {
                this.dom.container.classList.remove('streak-active');
            }

            // Resetear timer
            if (this.hideTimeout) clearTimeout(this.hideTimeout);

            this.hideTimeout = setTimeout(() => {
                this.dom.container.style.opacity = '0';
                setTimeout(() => {
                    this.dom.container.style.visibility = 'hidden';
                }, 700);
            }, this.config.MESSAGE_DISPLAY_TIME);

        } catch (error) {
            console.error('Error en ChatUIManager:', error);
        }
    }
}

// ============================================
// SISTEMA DE ESTADÍSTICAS DE MENSAJES
// ============================================

/**
 * Clase para rastrear estadísticas de mensajes del chat
 * Resalta al usuario de la tabla que más mensajes ha enviado en el día
 */
class ChatMessageTracker {
    constructor() {
        this.totalMessages = 0;
        this.dailyUserMessages = {}; // { username: count }
        this.currentTopUser = null; // Usuario con más mensajes actualmente
        this.lastResetDate = this.getTodayDateString();

        // Exponer estadísticas globalmente para stream_info.js
        window.chatMessageStats = this;
    }

    /**
     * Obtiene la fecha actual como string (YYYY-MM-DD)
     */
    getTodayDateString() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    /**
     * Verifica si es un nuevo día y resetea los contadores si es necesario
     */
    checkDayReset() {
        const today = this.getTodayDateString();
        if (today !== this.lastResetDate) {
            console.log('🔄 Nuevo día detectado. Reseteando contadores de mensajes...');
            this.dailyUserMessages = {};
            this.totalMessages = 0;
            this.currentTopUser = null;
            this.lastResetDate = today;

            // Quitar todas las clases on-streak
            document.querySelectorAll('tr.driver.on-streak').forEach(row => {
                row.classList.remove('on-streak');
            });
        }
    }

    /**
     * Registra un mensaje de un usuario
     * @param {string} username 
     * @param {boolean} isInClassification - Si el usuario está en la tabla
     */
    trackMessage(username, isInClassification = false) {
        // Verificar si hay que resetear por nuevo día
        this.checkDayReset();

        const lowerUser = username.toLowerCase();

        // Incrementar contador total
        this.totalMessages++;

        // Solo contar para el ranking de "top chatter" si está en la clasificación
        if (isInClassification) {
            // Incrementar contador del usuario
            if (!this.dailyUserMessages[lowerUser]) {
                this.dailyUserMessages[lowerUser] = 0;
            }
            this.dailyUserMessages[lowerUser]++;
        }
    }

    /**
     * Obtiene el usuario de la tabla con más mensajes del día
     * @returns {string|null} username del top chatter o null
     */
    getTopChatter() {
        let topUser = null;
        let maxMessages = 0;

        for (const [username, count] of Object.entries(this.dailyUserMessages)) {
            if (count > maxMessages) {
                maxMessages = count;
                topUser = username;
            }
        }

        return topUser;
    }

    /**
     * Obtiene el número de mensajes de un usuario hoy
     * @param {string} username 
     * @returns {number}
     */
    getDailyMessageCount(username) {
        const lowerUser = username.toLowerCase();
        return this.dailyUserMessages[lowerUser] || 0;
    }

    /**
     * Actualiza el resaltado naranja para mostrar solo al top chatter
     */
    updateTopChatterHighlight() {
        const topUser = this.getTopChatter();

        // Si no hay top user o no ha cambiado, no hacer nada
        if (!topUser) return;

        const rows = document.querySelectorAll('tr.driver');

        rows.forEach(row => {
            const nameCell = row.querySelector('.driver-name');
            if (nameCell) {
                const username = nameCell.textContent.trim().toLowerCase();

                if (username === topUser) {
                    // Este es el top chatter, añadir clase
                    if (!row.classList.contains('on-streak')) {
                        row.classList.add('on-streak');
                    }
                } else {
                    // No es el top chatter, quitar clase si la tiene
                    row.classList.remove('on-streak');
                }
            }
        });

        this.currentTopUser = topUser;
    }

    /**
     * Inicia el intervalo de actualización periódica
     */
    startCleanupInterval() {
        // Actualizar el resaltado del top chatter cada 10 segundos
        setInterval(() => {
            this.checkDayReset();
            this.updateTopChatterHighlight();
        }, 10000);
    }
}

// ============================================
// APLICACIÓN PRINCIPAL
// ============================================

class ChatApp {
    constructor() {
        this.config = CHAT_CONFIG; // Global from config_chat.js
        // Globales from data_chat.js: chatTeams, chatUserNumbers, chatUserTeams
        this.dataService = new ChatDataService(this.config, chatTeams, chatUserNumbers, chatUserTeams);
        this.audioService = new ChatAudioService(this.config.AUDIO_URL, this.config.AUDIO_VOLUME);
        this.uiManager = new ChatUIManager(this.config);
        this.messageTracker = new ChatMessageTracker();
        this.twitchService = new TwitchService(
            this.config.TWITCH_CHANNEL,
            this.handleMessage.bind(this)
        );
    }

    init() {
        console.log('🏎️ Inicializando Twitch Chat Overlay F1 (Refactorizado)...');
        this.twitchService.connect();

        // Iniciar limpieza periódica de rachas expiradas
        this.messageTracker.startCleanupInterval();

        // Exponer para pruebas
        window.simularMensaje = (usuario, mensaje) => {
            this.handleMessage({ 'display-name': usuario, emotes: {} }, mensaje);
        };

        console.log('✅ Chat App inicializada');
    }

    handleMessage(tags, message) {
        const username = tags['display-name'] || tags.username;
        const emotes = tags.emotes;

        // Verificar si el usuario está en la clasificación o es Liiukiin
        const usernameUpper = username.toUpperCase();
        const isLiiukiin = username.toLowerCase() === 'liiukiin';

        // Verificar si está en driversData
        const isInClassification = driversData.some(driver =>
            driver.name.toUpperCase() === usernameUpper
        );

        // Trackear mensaje (solo cuenta para ranking si está en clasificación)
        this.messageTracker.trackMessage(username, isInClassification);

        // Verificar si es el top chatter actual
        const topChatter = this.messageTracker.getTopChatter();
        const isTopChatter = topChatter && username.toLowerCase() === topChatter;

        if (this.config.DEBUG) {
            console.log('Mensaje recibido:', username, message,
                `(Total: ${this.messageTracker.totalMessages}, Top Chatter: ${topChatter}, Es Top: ${isTopChatter})`);
        }

        // Solo mostrar y reproducir sonido si está en la clasificación o es Liiukiin
        if (!isInClassification && !isLiiukiin) {
            if (this.config.DEBUG) {
                console.log(`Usuario ${username} no está en la clasificación. Mensaje ignorado.`);
            }
            return;
        }

        // Si está en la clasificación, resaltar la fila en la tabla
        if (isInClassification) {
            try {
                // Actualizar el resaltado del top chatter
                this.messageTracker.updateTopChatterHighlight();

                // Buscar la fila del usuario actual para añadir chat-active
                const rows = document.querySelectorAll('tr.driver');
                rows.forEach(row => {
                    const nameCell = row.querySelector('.driver-name');
                    if (nameCell && nameCell.textContent.trim().toUpperCase() === usernameUpper) {
                        // Aplicar clase de animación verde temporal
                        row.classList.add('chat-active');

                        // Remover clase chat-active después del tiempo de visualización
                        setTimeout(() => {
                            row.classList.remove('chat-active');
                        }, this.config.MESSAGE_DISPLAY_TIME);
                    }
                });
            } catch (error) {
                console.error('Error al resaltar fila en tabla:', error);
            }
        }

        const userNumber = this.dataService.getUserNumber(username);
        const team = this.dataService.getUserTeam(username);

        // Pasar información de top chatter al UI (para mostrar emoji 🔥)
        this.uiManager.displayMessage(username, message, emotes, userNumber, team, isTopChatter);
        this.audioService.play();
    }
}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si los elementos del chat existen
    if (document.querySelector('.chat-container')) {
        const chatApp = new ChatApp();
        chatApp.init();
    }
});
