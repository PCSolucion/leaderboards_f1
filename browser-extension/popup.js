/**
 * Popup Script - Muestra la información actual de la música
 */

const artistElement = document.getElementById('artist');
const songElement = document.getElementById('song');
const statusElement = document.getElementById('status');

/**
 * Actualiza la UI con la información de la música
 */
function updateUI(music) {
    if (!music) {
        artistElement.textContent = '-';
        songElement.textContent = '-';
        statusElement.textContent = 'Esperando música...';
        return;
    }

    artistElement.textContent = music.artist || '-';
    songElement.textContent = music.song || '-';

    const timeDiff = Date.now() - music.timestamp;
    if (timeDiff < 5000) {
        statusElement.textContent = music.isPlaying ? '▶️ Reproduciendo' : '⏸️ Pausado';
    } else {
        statusElement.textContent = '⏱️ Última actualización hace ' + Math.floor(timeDiff / 1000) + 's';
    }
}

/**
 * Carga la música actual
 */
function loadCurrentMusic() {
    chrome.storage.local.get(['currentMusic'], (result) => {
        updateUI(result.currentMusic);
    });
}

/**
 * Escucha cambios en el almacenamiento
 */
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.currentMusic) {
        updateUI(changes.currentMusic.newValue);
    }
});

// Cargar información inicial
loadCurrentMusic();

// Actualizar cada segundo
setInterval(loadCurrentMusic, 1000);
