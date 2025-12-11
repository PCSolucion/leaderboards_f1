/**
 * Background Script - Service Worker
 * Maneja la comunicación entre el content script y el almacenamiento
 */

let currentMusic = null;

/**
 * Escucha mensajes del content script
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'MUSIC_UPDATE') {
        currentMusic = message.data;

        // Guardar en chrome.storage para persistencia
        chrome.storage.local.set({
            currentMusic: currentMusic
        });

        console.log('🎵 Background: Music updated', currentMusic);
    }

    if (message.type === 'GET_CURRENT_MUSIC') {
        sendResponse({ music: currentMusic });
    }
});

/**
 * Inicializa el background script
 */
chrome.runtime.onInstalled.addListener(() => {
    console.log('🎵 YouTube Music Tracker Extension installed');

    // Cargar música guardada
    chrome.storage.local.get(['currentMusic'], (result) => {
        if (result.currentMusic) {
            currentMusic = result.currentMusic;
            console.log('🎵 Loaded saved music:', currentMusic);
        }
    });
});
