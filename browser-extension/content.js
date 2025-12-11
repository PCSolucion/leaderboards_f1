/**
 * Content Script - Se ejecuta en las páginas de YouTube
 * Captura la información de la música y la envía al background script y al servidor local
 */

let lastTitle = '';
let updateInterval = null;

/**
 * Obtiene el título actual del video
 */
function getCurrentTitle() {
    let title = document.title.replace(' - YouTube', '').trim();

    const videoTitle = document.querySelector('h1.title yt-formatted-string, h1.ytd-video-primary-info-renderer yt-formatted-string');
    if (videoTitle && videoTitle.textContent) {
        title = videoTitle.textContent.trim();
    }

    return title;
}

/**
 * Obtiene el nombre del canal/artista
 */
function getCurrentArtist() {
    const channelLink = document.querySelector('#channel-name a, ytd-channel-name a');
    if (channelLink && channelLink.textContent) {
        return channelLink.textContent.trim();
    }

    const title = getCurrentTitle();
    if (title.includes(' - ')) {
        return title.split(' - ')[0].trim();
    }

    return 'YouTube';
}

/**
 * Verifica si el video está reproduciéndose
 */
function isPlaying() {
    const video = document.querySelector('video');
    return video && !video.paused && !video.ended;
}

/**
 * Parsea el título para extraer artista y canción
 */
function parseTitle(title) {
    let clean = title
        .replace(/\s*\(Official.*?\)/gi, '')
        .replace(/\s*\[Official.*?\]/gi, '')
        .replace(/\s*\(Lyrics?\)/gi, '')
        .replace(/\s*\[Lyrics?\]/gi, '')
        .replace(/\s*\(.*?Music Video\)/gi, '')
        .trim();

    let artist = '';
    let song = '';

    if (clean.includes(' - ')) {
        const parts = clean.split(' - ');
        artist = parts[0].trim();
        song = parts.slice(1).join(' - ').trim();
    } else if (clean.includes(': ')) {
        const parts = clean.split(': ');
        artist = parts[0].trim();
        song = parts.slice(1).join(': ').trim();
    } else {
        artist = getCurrentArtist();
        song = clean;
    }

    return { artist, song, fullTitle: clean };
}

/**
 * Actualiza la información de la música
 */
function updateMusicInfo() {
    const title = getCurrentTitle();

    if (!title || title === lastTitle) {
        return;
    }

    lastTitle = title;
    const parsed = parseTitle(title);

    const musicData = {
        artist: parsed.artist,
        song: parsed.song,
        fullTitle: parsed.fullTitle,
        timestamp: Date.now(),
        url: window.location.href,
        isPlaying: isPlaying()
    };

    // 1. Guardar en localStorage (backup)
    try {
        localStorage.setItem('currentYouTubeMusic', JSON.stringify(musicData));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }

    // 2. Enviar al background script (para popup)
    try {
        chrome.runtime.sendMessage({
            type: 'MUSIC_UPDATE',
            data: musicData
        });
    } catch (error) {
        // Ignorar errores si el background script no está disponible
    }

    // 3. ENVIAR AL SERVIDOR LOCAL (Principal)
    // Usamos 127.0.0.1 en lugar de localhost para evitar problemas de DNS
    const serverPayload = {
        artist: musicData.artist,
        song: musicData.song,
        fullTitle: musicData.fullTitle,
        isPlaying: musicData.isPlaying,
        url: musicData.url
    };

    console.log('📤 Enviando al servidor:', serverPayload);

    fetch('http://127.0.0.1:3000/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverPayload),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('✅ Enviado al servidor local correctamente');
            } else {
                console.warn('⚠️ Servidor respondió con error:', data.message);
            }
        })
        .catch(err => {
            console.warn('⚠️ No se pudo conectar con el servidor local');
            console.warn('   Verifica que el servidor esté corriendo: cd server && npm start');
            console.warn('   Error:', err.message);
        });

    console.log('🎵 Music updated:', parsed.artist, '-', parsed.song);
}

/**
 * Inicializa el content script
 */
function init() {
    console.log('🎵 YouTube Music Tracker Extension - Content Script loaded');

    // Actualización inicial
    updateMusicInfo();

    // Actualización periódica
    updateInterval = setInterval(updateMusicInfo, 2000);

    // Observar cambios en el DOM
    const observer = new MutationObserver(updateMusicInfo);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Eventos de YouTube
    window.addEventListener('yt-navigate-finish', updateMusicInfo);
    document.addEventListener('yt-player-updated', updateMusicInfo);
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
