/**
 * Configuración del Overlay de Chat de Twitch
 * Todas las constantes y configuraciones centralizadas
 */

const CHAT_CONFIG = {
    // Configuración de Twitch
    TWITCH_CHANNEL: 'liiukiin',

    // Tiempos (en milisegundos)
    MESSAGE_DISPLAY_TIME: 8500,
    TRANSITION_DURATION: 700,

    // Audio
    AUDIO_URL: 'https://res.cloudinary.com/pcsolucion/video/upload/v1745911791/f1-box-box_hg8frh.mp3',
    AUDIO_VOLUME: 1.0,

    // Efecto Radio F1
    RADIO_EFFECT: {
        ENABLED: false, // Solo pitido limpio, sin efectos de radio
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
        },
        'duckcris': {
            number: 2,
            team: 'redbull',
            image: './assets/duckcris.png'
        },
        'mambiitv': {
            number: 77,
            team: 'ferrari',
            image: './assets/mambittv.png'
        },
        'james_193': {
            number: 19, // Corregido: era 2 (duplicado con duckcris)
            team: 'mercedes',
            image: './assets/james193.png'
        },
        'xroockk': {
            number: 4,
            team: 'toroRosso',
            image: './assets/xroockk.png'
        },
        'broxa24': {
            number: 5,
            team: 'ferrari',
            image: './assets/brooxa24.png'
        },
        'manguerazo': {
            number: 8,
            team: 'haas',
            image: './assets/manguerazo.png'
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

// Validación de configuración (se ejecuta cuando se carga el script)
if (typeof window !== 'undefined') {
    // Esperar a que utils.js esté cargado para validar
    document.addEventListener('DOMContentLoaded', () => {
        if (window.ConfigValidator) {
            // Validar propiedades principales
            const isValid = ConfigValidator.validateRequired(
                CHAT_CONFIG,
                ['TWITCH_CHANNEL', 'MESSAGE_DISPLAY_TIME', 'AUDIO_URL', 'SPECIAL_USERS'],
                'CHAT_CONFIG'
            );

            if (isValid) {
                console.log('✅ Configuración de chat validada correctamente');
            }
        }
    });
}
