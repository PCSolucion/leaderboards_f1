/**
 * Configuración del Overlay de Chat de Twitch
 * Todas las constantes y configuraciones centralizadas
 */

const CHAT_CONFIG = {
    // Configuración de Twitch
    TWITCH_CHANNEL: 'liiukiin',

    // Tiempos (en milisegundos)
    MESSAGE_DISPLAY_TIME: 5500,
    TRANSITION_DURATION: 700,

    // Audio
    AUDIO_URL: 'https://res.cloudinary.com/pcsolucion/video/upload/v1745911791/f1-box-box_hg8frh.mp3',
    AUDIO_VOLUME: 1.0,

    // Efecto Radio F1
    RADIO_EFFECT: {
        ENABLED: true,
        // Delay antes de reproducir (simula transmisión por radio)
        DELAY_MS: 150,
        // Filtro paso alto (Hz) - elimina graves, simula speaker pequeño
        HIGHPASS_FREQ: 300,
        // Filtro paso bajo (Hz) - elimina agudos extremos
        LOWPASS_FREQ: 3500,
        // Cantidad de distorsión (0-100)
        DISTORTION_AMOUNT: 20,
        // Volumen del ruido de estática (0-1)
        STATIC_VOLUME: 0.08,
        // Duración del ruido de estática (ms)
        STATIC_DURATION: 80,
        // Ganancia del efecto de compresión
        COMPRESSION_THRESHOLD: -24,
        COMPRESSION_RATIO: 4
    },

    // Text-to-Speech (TTS) - Voz para mensajes
    TTS: {
        ENABLED: true,
        // Idioma preferido (es-ES para español)
        LANG: 'es-ES',
        // Velocidad de la voz (0.5 = lento, 1 = normal, 2 = rápido)
        RATE: 1.1,
        // Tono de la voz (0.5 = grave, 1 = normal, 2 = agudo)
        PITCH: 0.9,
        // Volumen del TTS (0-1)
        VOLUME: 0.8,
        // Leer también el nombre del usuario antes del mensaje
        READ_USERNAME: true,
        // Prefijo antes del mensaje (ej: "dice:", ":", etc.)
        USERNAME_SEPARATOR: ' dice: ',
        // Máximo de caracteres a leer (se trunca el mensaje)
        MAX_CHARS: 150,
        // Si el mensaje supera este límite, NO se lee (se ignora completamente)
        SKIP_IF_LONGER_THAN: 200,
        // Filtro de palabras adultas/ofensivas (activar/desactivar)
        PROFANITY_FILTER: true,
        // Lista de palabras prohibidas (si aparecen, no se lee el mensaje)
        // Añade o quita palabras según necesites
        BANNED_WORDS: [
            // Insultos comunes en español
            'puta', 'puto', 'mierda', 'cago', 'cagar', 'culo', 'coño', 'joder',
            'cabron', 'cabrón', 'gilipollas', 'hostia', 'ostia', 'follar',
            'verga', 'polla', 'cipote', 'capullo', 'mamón', 'pendejo',
            'idiota', 'imbecil', 'imbécil', 'subnormal', 'retrasado',
            'maricón', 'maricon', 'marica', 'bollera', 'zorra',
            'hdp', 'hp', 'ptm', 'puto', 'ctm', 'csm', 'nmms',
            // Insultos en inglés comunes
            'fuck', 'shit', 'bitch', 'asshole', 'dick', 'cock', 'pussy',
            'nigger', 'nigga', 'faggot', 'fag', 'retard', 'cunt', 'whore',
            // Variaciones con números/símbolos
            'put4', 'm1erda', 'c4bron', 'p0lla', 'f0llar', 'c0ño'
        ],
        // Aplicar efecto de radio al TTS
        APPLY_RADIO_EFFECT: true
    },

    // Tamaños y dimensiones
    EMOTE_SIZE: '1.2em',
    TEAM_LOGO_DEFAULT_WIDTH: '1.6em',

    // Números de piloto
    MIN_RANDOM_NUMBER: 1,
    MAX_RANDOM_NUMBER: 99,

    // Usuario especial
    // Usuarios especiales (siempre se muestran y tienen config personalizada)
    SPECIAL_USERS: {
        'liiukiin': {
            number: 63,
            team: 'mercedes',
            image: './assets/liiukiin.png'
        },
        'c_h_a_n_d_a_l_f': {
            number: 10, // Asignar un número si no tienen
            team: 'ferrari', // Asignar un equipo por defecto
            image: './assets/chandalf.png'
        },
        '01jenial': {
            number: 1,
            team: 'redbull',
            image: './assets/jenial.png'
        },
        'ractor09': {
            number: 9,
            team: 'mclaren',
            image: './assets/ractor09.png'
        },
        'takeru_xiii': {
            number: 13,
            team: 'mercedes',
            image: './assets/takeruxiii.png'
        }
    },

    // Configuración de accesibilidad
    ACCESSIBILITY: {
        ENABLE_ARIA: true,
        ENABLE_SCREEN_READER: true
    },

    // Modo debug
    DEBUG: false
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CHAT_CONFIG;
}
