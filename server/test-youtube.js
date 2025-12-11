/**
 * 🧪 Script de Test para YouTube → Servidor
 * 
 * INSTRUCCIONES:
 * 1. Abre YouTube Music o YouTube con una canción
 * 2. Abre la Consola del navegador (F12 → Console)
 * 3. Copia y pega TODO este código
 * 4. Presiona Enter
 * 
 * El script intentará detectar la canción actual y enviarla al servidor
 */

(function () {
    console.log('%c🎵 Test de YouTube → Servidor', 'font-size: 20px; color: #1DB954; font-weight: bold');
    console.log('━'.repeat(60));

    const SERVER_URL = 'http://127.0.0.1:3000/update';

    // Función para detectar la canción en YouTube/YouTube Music
    function detectCurrentSong() {
        let artist = 'Artista Desconocido';
        let song = 'Canción Desconocida';
        let fullTitle = '';
        let url = window.location.href;

        // YouTube Music
        const ytmTitle = document.querySelector('.title.ytmusic-player-bar');
        const ytmArtist = document.querySelector('.byline.ytmusic-player-bar a');

        if (ytmTitle && ytmArtist) {
            song = ytmTitle.textContent.trim();
            artist = ytmArtist.textContent.trim();
            fullTitle = `${artist} - ${song}`;
            console.log('✅ Detectado en YouTube Music');
        } else {
            // YouTube normal
            const ytTitle = document.querySelector('h1.ytd-watch-metadata yt-formatted-string');
            const ytChannel = document.querySelector('ytd-channel-name a');

            if (ytTitle) {
                fullTitle = ytTitle.textContent.trim();

                // Intentar parsear "Artist - Song"
                const parts = fullTitle.split('-');
                if (parts.length >= 2) {
                    artist = parts[0].trim();
                    song = parts.slice(1).join('-').trim();
                    // Limpiar texto común
                    song = song.replace(/\(Official.*\)/gi, '').trim();
                    song = song.replace(/\(Lyric.*\)/gi, '').trim();
                    song = song.replace(/\[.*\]/g, '').trim();
                } else {
                    song = fullTitle;
                    if (ytChannel) {
                        artist = ytChannel.textContent.trim();
                    }
                }
                console.log('✅ Detectado en YouTube');
            }
        }

        return { artist, song, fullTitle: fullTitle || `${artist} - ${song}`, url };
    }

    // Función para enviar al servidor
    async function sendToServer(songData) {
        console.log('📤 Enviando al servidor...');
        console.log('   Artista:', songData.artist);
        console.log('   Canción:', songData.song);
        console.log('   Título completo:', songData.fullTitle);
        console.log('   URL:', songData.url);
        console.log('━'.repeat(60));

        try {
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    artist: songData.artist,
                    song: songData.song,
                    fullTitle: songData.fullTitle,
                    isPlaying: true,
                    url: songData.url
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log('%c✅ ¡ÉXITO! Datos enviados correctamente', 'color: #00ff00; font-weight: bold; font-size: 16px');
                console.log('📊 Respuesta del servidor:', data);
            } else {
                console.log('%c⚠️ El servidor respondió pero hubo un problema', 'color: #ff9800; font-weight: bold');
                console.log('❌ Mensaje:', data.message);
                console.log('📄 Datos recibidos por el servidor:', data.received);
            }

        } catch (error) {
            console.log('%c❌ ERROR: No se pudo conectar con el servidor', 'color: #ff0000; font-weight: bold; font-size: 16px');
            console.error('Detalles del error:', error);
            console.log('\n💡 Posibles causas:');
            console.log('   1. El servidor no está corriendo (ejecuta: npm start)');
            console.log('   2. El servidor está en un puerto diferente');
            console.log('   3. Problemas de CORS (revisa la consola de red)');
        }
    }

    // Ejecutar test
    console.log('🔍 Detectando canción actual...');
    const songData = detectCurrentSong();

    if (songData.song === 'Canción Desconocida') {
        console.log('%c⚠️ No se pudo detectar la canción', 'color: #ff9800; font-weight: bold');
        console.log('💡 Asegúrate de estar en YouTube/YouTube Music con una canción reproduciéndose');
        console.log('\n📝 De todos modos, puedes enviar datos de prueba:');
        console.log('testSendManual("Queen", "Bohemian Rhapsody")');
    } else {
        sendToServer(songData);
    }

    // Función global para test manual
    window.testSendManual = function (artist, song) {
        const testData = {
            artist: artist || 'Test Artist',
            song: song || 'Test Song',
            fullTitle: `${artist || 'Test Artist'} - ${song || 'Test Song'}`,
            url: window.location.href
        };
        sendToServer(testData);
    };

    // Función para monitorear cambios automáticamente
    window.startMusicMonitor = function () {
        console.log('%c🎯 Monitor activado', 'color: #1DB954; font-weight: bold');
        console.log('El script enviará actualizaciones cada vez que cambies de canción');

        let lastSong = '';

        setInterval(() => {
            const songData = detectCurrentSong();
            if (songData.fullTitle !== lastSong && songData.song !== 'Canción Desconocida') {
                lastSong = songData.fullTitle;
                console.log('\n🎵 Nueva canción detectada!');
                sendToServer(songData);
            }
        }, 2000); // Verificar cada 2 segundos
    };

    console.log('\n📚 Funciones disponibles:');
    console.log('   testSendManual("Artista", "Canción") - Enviar datos personalizados');
    console.log('   startMusicMonitor() - Activar monitoreo automático');
    console.log('━'.repeat(60));

})();
