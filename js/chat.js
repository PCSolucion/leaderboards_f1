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

        if (this.config.SPECIAL_USERS[lowerUser]) {
            return this.config.SPECIAL_USERS[lowerUser].number;
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

        if (this.config.SPECIAL_USERS[lowerUser]) {
            const teamName = this.config.SPECIAL_USERS[lowerUser].team;
            return this.teams[teamName] || this.getRandomTeam();
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
 * Servicio encargado del Audio con Efecto Radio F1
 * Usa Web Audio API para simular comunicaciones por radio de F1
 */
class ChatAudioService {
    constructor(audioUrl, volume, radioConfig = null) {
        this.audioUrl = audioUrl;
        this.volume = volume;
        this.radioConfig = radioConfig || {
            ENABLED: false,
            DELAY_MS: 150,
            HIGHPASS_FREQ: 300,
            LOWPASS_FREQ: 3500,
            DISTORTION_AMOUNT: 20,
            STATIC_VOLUME: 0.08,
            STATIC_DURATION: 80,
            COMPRESSION_THRESHOLD: -24,
            COMPRESSION_RATIO: 4
        };

        this.audioContext = null;
        this.audioBuffer = null;
        this.isReady = false;

        this.init();
    }

    async init() {
        try {
            // Crear contexto de audio
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Cargar el audio como buffer
            await this.loadAudioBuffer();

            console.log('🎙️ Audio Service con efecto Radio F1 inicializado');
        } catch (error) {
            console.error('Error al inicializar AudioService:', error);
        }
    }

    async loadAudioBuffer() {
        try {
            const response = await fetch(this.audioUrl);
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.isReady = true;
            console.log('✅ Audio buffer cargado correctamente');
        } catch (error) {
            console.error('Error al cargar audio buffer:', error);
        }
    }

    /**
     * Crea una curva de distorsión para simular el crunch de radio
     * @param {number} amount - Cantidad de distorsión (0-100)
     * @returns {Float32Array}
     */
    createDistortionCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);
        const deg = Math.PI / 180;

        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            // Curva de distorsión suave tipo radio
            curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }

        return curve;
    }

    /**
     * Genera ruido blanco para simular estática
     * @param {number} duration - Duración en segundos
     * @returns {AudioBuffer}
     */
    createStaticNoise(duration) {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
            // Ruido blanco con envolvente para fade in/out
            const envelope = Math.sin((i / length) * Math.PI);
            data[i] = (Math.random() * 2 - 1) * envelope;
        }

        return buffer;
    }

    /**
     * Reproduce el sonido con efecto de radio F1
     */
    play() {
        if (!this.isReady || !this.audioBuffer) {
            console.warn('Audio no está listo todavía');
            return;
        }

        // Reanudar contexto si está suspendido (requisito de navegadores)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        try {
            if (this.radioConfig.ENABLED) {
                this.playWithRadioEffect();
            } else {
                this.playNormal();
            }
        } catch (error) {
            console.error('Error al reproducir audio:', error);
        }
    }

    /**
     * Reproducción normal sin efectos
     */
    playNormal() {
        const source = this.audioContext.createBufferSource();
        source.buffer = this.audioBuffer;

        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.volume;

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        source.start(0);
    }

    /**
     * Reproducción con efecto de radio F1
     */
    playWithRadioEffect() {
        const startTime = this.audioContext.currentTime;

        // === ESTÁTICA INICIAL ===
        this.playStaticBurst(startTime);

        // === AUDIO PRINCIPAL CON EFECTOS ===
        setTimeout(() => {
            this.playMainAudioWithEffects();
        }, this.radioConfig.DELAY_MS);
    }

    /**
     * Reproduce una ráfaga de estática
     */
    playStaticBurst(startTime) {
        const staticDuration = this.radioConfig.STATIC_DURATION / 1000;
        const staticBuffer = this.createStaticNoise(staticDuration);

        const staticSource = this.audioContext.createBufferSource();
        staticSource.buffer = staticBuffer;

        // Filtrar la estática para que suene más a radio
        const staticHighpass = this.audioContext.createBiquadFilter();
        staticHighpass.type = 'highpass';
        staticHighpass.frequency.value = 500;

        const staticGain = this.audioContext.createGain();
        staticGain.gain.value = this.radioConfig.STATIC_VOLUME * this.volume;

        staticSource.connect(staticHighpass);
        staticHighpass.connect(staticGain);
        staticGain.connect(this.audioContext.destination);

        staticSource.start(startTime);
    }

    /**
     * Reproduce el audio principal con todos los efectos de radio
     */
    playMainAudioWithEffects() {
        // Crear nodos de audio
        const source = this.audioContext.createBufferSource();
        source.buffer = this.audioBuffer;

        // === FILTRO PASO ALTO (elimina graves) ===
        const highpassFilter = this.audioContext.createBiquadFilter();
        highpassFilter.type = 'highpass';
        highpassFilter.frequency.value = this.radioConfig.HIGHPASS_FREQ;
        highpassFilter.Q.value = 0.7;

        // === FILTRO PASO BAJO (elimina agudos extremos) ===
        const lowpassFilter = this.audioContext.createBiquadFilter();
        lowpassFilter.type = 'lowpass';
        lowpassFilter.frequency.value = this.radioConfig.LOWPASS_FREQ;
        lowpassFilter.Q.value = 0.7;

        // === FILTRO PEAKING (realza frecuencias medias - característica de radio) ===
        const peakingFilter = this.audioContext.createBiquadFilter();
        peakingFilter.type = 'peaking';
        peakingFilter.frequency.value = 1500;
        peakingFilter.Q.value = 1;
        peakingFilter.gain.value = 4;

        // === DISTORSIÓN (crunch de radio) ===
        const distortion = this.audioContext.createWaveShaper();
        distortion.curve = this.createDistortionCurve(this.radioConfig.DISTORTION_AMOUNT);
        distortion.oversample = '2x';

        // === COMPRESOR (para ese sonido "apretado" de radio) ===
        const compressor = this.audioContext.createDynamicsCompressor();
        compressor.threshold.value = this.radioConfig.COMPRESSION_THRESHOLD;
        compressor.ratio.value = this.radioConfig.COMPRESSION_RATIO;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.1;

        // === GANANCIA FINAL ===
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.volume * 1.2; // Compensar pérdida de volumen por filtros

        // === CONECTAR LA CADENA DE EFECTOS ===
        source.connect(highpassFilter);
        highpassFilter.connect(lowpassFilter);
        lowpassFilter.connect(peakingFilter);
        peakingFilter.connect(distortion);
        distortion.connect(compressor);
        compressor.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Reproducir
        source.start(0);

        if (this.radioConfig.DEBUG) {
            console.log('🎙️ Audio reproducido con efecto Radio F1');
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
            userImage: document.getElementById('chat-user-image'),
            root: document.documentElement,
            chatHeader: null // Se cacheará en la primera llamada
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
            // Actualizar contenido
            this.dom.username.textContent = username.toUpperCase();

            // Ajustar tamaño de fuente si el nombre es muy largo
            const lengthThreshold = window.UI_CONSTANTS?.USERNAME_LENGTH_THRESHOLD || 12;
            const longFontSize = window.UI_CONSTANTS?.USERNAME_LONG_FONT_SIZE || '1.0rem';

            if (username.length > lengthThreshold) {
                this.dom.username.style.fontSize = longFontSize;
            } else {
                this.dom.username.style.fontSize = '';
            }

            this.dom.number.textContent = userNumber;
            this.dom.root.style.setProperty('--chat-team-color', team.color);

            this.dom.teamLogo.style.backgroundImage = `url('${team.logo}')`;

            // Mostrar imagen de usuario si es un usuario especial con imagen configurada
            const lowerUser = username.toLowerCase();
            const specialUserConfig = this.config.SPECIAL_USERS[lowerUser];

            if (specialUserConfig && specialUserConfig.image) {
                this.dom.userImage.src = specialUserConfig.image;
                this.dom.userImage.style.display = 'block';
                // Ajustar padding del header si hay imagen (cachear referencia)
                // En el nuevo diseño "discreet", la imagen está en el fondo y no requiere padding extra en el header
                this.dom.container.classList.add('has-image');
            } else {
                this.dom.userImage.style.display = 'none';
                this.dom.container.classList.remove('has-image');
            }

            // Procesar mensaje normal
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

        // Guardar timestamp del mensaje para la lógica de "Vuelta Rápida" (últimos 5 min)
        if (!this.userMessageTimestamps) {
            this.userMessageTimestamps = {};
        }
        if (!this.userMessageTimestamps[lowerUser]) {
            this.userMessageTimestamps[lowerUser] = [];
        }
        this.userMessageTimestamps[lowerUser].push(Date.now());

        // Solo contar para el ranking de "top chatter" si está en la clasificación
        if (isInClassification) {
            if (!this.dailyUserMessages[lowerUser]) {
                this.dailyUserMessages[lowerUser] = 0;
            }
            this.dailyUserMessages[lowerUser]++;

            // Actualizar top user si es necesario
            if (!this.currentTopUser || this.dailyUserMessages[lowerUser] > this.dailyUserMessages[this.currentTopUser]) {
                this.currentTopUser = lowerUser;
                console.log(`🏆 Nuevo Top Chatter del día: ${lowerUser} (${this.dailyUserMessages[lowerUser]} mensajes)`);
            }
        }
    }

    /**
     * Normaliza nombres de usuario (manejo de alias)
     */
    normalizeUsername(username) {
        // Usar UsernameHelper si está disponible, sino fallback al método anterior
        if (window.UsernameHelper) {
            return UsernameHelper.normalize(username);
        }
        const lower = username.toLowerCase();
        if (lower === 'c_h_a_n_d_a_l_f') return 'chandalf';
        return lower;
    }

    /**
     * Obtiene el usuario más activo de los últimos 5 minutos
     * restringido a una lista de usuarios permitidos (Top 15 de la tabla)
     * @param {Array<string>} allowedUsernames - Lista de nombres de la tabla
     * @returns {string|null} Nombre del usuario normalizado o null si no hay actividad
     */
    getTopActiveUser(allowedUsernames) {
        const now = Date.now();
        const fiveMinutesMs = window.UI_CONSTANTS?.FIVE_MINUTES_MS || (5 * 60 * 1000);
        const fiveMinutesAgo = now - fiveMinutesMs;
        let maxCount = 0;
        let topUser = null;

        // Crear set de usuarios permitidos normalizados
        const allowedSet = new Set(allowedUsernames.map(u => this.normalizeUsername(u)));

        if (!this.userMessageTimestamps) return null;

        for (const user in this.userMessageTimestamps) {
            // Normalizar usuario del chat
            const normalizedChatUser = this.normalizeUsername(user);

            // Verificar si está en la lista permitida
            if (!allowedSet.has(normalizedChatUser)) continue;

            // Filtrar timestamps recientes
            const timestamps = this.userMessageTimestamps[user];
            // Limpiar timestamps viejos ya que estamos aquí (optimización lazy)
            const recentTimestamps = timestamps.filter(t => t > fiveMinutesAgo);
            this.userMessageTimestamps[user] = recentTimestamps;

            const recentCount = recentTimestamps.length;

            if (recentCount > 0 && recentCount > maxCount) {
                maxCount = recentCount;
                topUser = normalizedChatUser;
            }
        }

        return topUser;
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

                if (username === topUser && !row.classList.contains('rank-1')) {
                    // Este es el top chatter y NO es el rank 1, añadir clase
                    if (!row.classList.contains('on-streak')) {
                        row.classList.add('on-streak');
                    }
                } else {
                    // No es el top chatter O es el rank 1, quitar clase
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
        this.audioService = new ChatAudioService(this.config.AUDIO_URL, this.config.AUDIO_VOLUME, this.config.RADIO_EFFECT);
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
        console.log('💡 Comandos disponibles:');
        console.log('   - simularMensaje("usuario", "mensaje")');
    }

    handleMessage(tags, message) {
        const username = tags['display-name'] || tags.username;
        const emotes = tags.emotes;

        // Verificar si el usuario está en la clasificación o es un usuario especial
        const usernameUpper = username.toUpperCase();
        const lowerUser = username.toLowerCase();
        const isSpecialUser = !!this.config.SPECIAL_USERS[lowerUser];

        // Verificar si está en driversData
        const isInClassification = driversData.some(driver =>
            driver.name.toUpperCase() === usernameUpper
        );

        // Trackear mensaje (cuenta si está en clasificación o es especial)
        this.messageTracker.trackMessage(username, isInClassification || isSpecialUser);

        // Verificar si es el top chatter actual
        const topChatter = this.messageTracker.getTopChatter();
        const isTopChatter = topChatter && username.toLowerCase() === topChatter;

        if (this.config.DEBUG) {
            console.log('Mensaje recibido:', username, message,
                `(Total: ${this.messageTracker.totalMessages}, Top Chatter: ${topChatter}, Es Top: ${isTopChatter})`);
        }

        // Solo mostrar y reproducir sonido si está en la clasificación o es usuario especial
        if (!isInClassification && !isSpecialUser) {
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

                        // Sincronizar con el ciclo de parpadeo (1 min activo + 10 min pausa)
                        if (window.greenPulseCycleManager) {
                            window.greenPulseCycleManager.applyToRow(row);
                        }

                        // Remover clase chat-active después del tiempo de visualización
                        setTimeout(() => {
                            row.classList.remove('chat-active');
                            row.classList.remove('pulsing'); // También remover pulsing
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

        // Reproducir sonido de radio F1 solo para liiukiin o usuarios en el top 15 de la clasificación
        const isLiiukiin = lowerUser === 'liiukiin';
        const isInTop15 = driversData.slice(0, 15).some(driver =>
            driver.name.toUpperCase() === usernameUpper
        );

        if (isLiiukiin || isInTop15) {
            this.audioService.play();
        }
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
