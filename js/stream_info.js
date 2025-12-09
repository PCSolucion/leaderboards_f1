/**
 * StreamInfoRotator
 * Maneja la rotación de información en la fila del temporizador
 */

class StreamInfoRotator {
    constructor() {
        this.currentView = 0;
        this.timerLabel = document.querySelector('.timer-label');
        this.timerDisplay = document.querySelector('.timer-display');
        this.streamTitle = 'Cargando...';
        this.rotationInterval = 15000; // 15 segundos
        this.sessionStartTime = Date.now();
        this.updateIntervalId = null;

        // 5 vistas: DIRECTO + tiempo, Título stream, Fecha, Horario, Mensajes totales
        this.views = [
            this.getTimeView.bind(this),
            this.getStreamTitleView.bind(this),
            this.getDateView.bind(this),
            this.getScheduleView.bind(this),
            this.getTotalMessagesView.bind(this)
        ];
    }

    async init() {
        // Obtener información inicial del stream (título y tiempo)
        await this.fetchStreamInfo();

        // Iniciar rotación
        this.rotate();
        setInterval(() => this.rotate(), this.rotationInterval);

        // Actualizar info cada 60 segundos para corregir desfases y título
        setInterval(() => this.fetchStreamInfo(), 60000);
    }

    async fetchStreamInfo() {
        const timestamp = Date.now();
        try {
            // 1. Obtener Título
            const titleResponse = await fetch(`https://decapi.me/twitch/title/liiukiin?t=${timestamp}`);
            if (titleResponse.ok) {
                const title = await titleResponse.text();
                this.streamTitle = title.trim() || 'Stream de Liiukiin';
            }

            // 2. Obtener Uptime para calcular tiempo real
            const uptimeResponse = await fetch(`https://decapi.me/twitch/uptime/liiukiin?t=${timestamp}`);
            if (uptimeResponse.ok) {
                const uptimeText = await uptimeResponse.text();

                if (uptimeText.includes('offline')) {
                    // Si está offline, usar hora local o resetear
                    this.isOffline = true;
                } else {
                    this.isOffline = false;
                    // Parsear "1 hour, 30 minutes, 10 seconds"
                    const uptimeSeconds = this.parseUptime(uptimeText);
                    if (uptimeSeconds > 0) {
                        // Calcular hora de inicio estimada
                        this.sessionStartTime = Date.now() - (uptimeSeconds * 1000);
                    }
                }
            }
        } catch (error) {
            console.log('Error al obtener info del stream:', error);
        }
    }

    parseUptime(uptimeText) {
        // Ejemplo: "1 hour, 30 minutes, 10 seconds" o "30 minutes, 10 seconds"
        let seconds = 0;

        const hoursMatch = uptimeText.match(/(\d+)\s+hour/);
        const minutesMatch = uptimeText.match(/(\d+)\s+minute/);
        const secondsMatch = uptimeText.match(/(\d+)\s+second/);

        if (hoursMatch) seconds += parseInt(hoursMatch[1]) * 3600;
        if (minutesMatch) seconds += parseInt(minutesMatch[1]) * 60;
        if (secondsMatch) seconds += parseInt(secondsMatch[1]);

        return seconds;
    }

    getTimeView() {
        return {
            label: this.isOffline ? 'OFFLINE' : 'DIRECTO',
            display: this.getSessionTime(),
            needsUpdate: !this.isOffline
        };
    }

    getStreamTitleView() {
        return {
            label: this.streamTitle,
            display: '',
            needsUpdate: false
        };
    }

    getDateView() {
        return {
            label: this.getCurrentDateFormatted(),
            display: '',
            needsUpdate: false
        };
    }

    getScheduleView() {
        return {
            label: 'Directo todos los días a las 15:00',
            display: '',
            needsUpdate: false
        };
    }

    getTotalMessagesView() {
        // Obtener el contador global de mensajes del chat
        const totalMessages = window.chatMessageStats ? window.chatMessageStats.totalMessages : 0;
        return {
            label: `💬 ${totalMessages} MENSAJES HOY`,
            display: '',
            needsUpdate: false
        };
    }

    getSessionTime() {
        if (this.isOffline) return "00:00:00";

        const elapsed = Date.now() - this.sessionStartTime;
        // Evitar tiempos negativos si hay desajuste
        const totalSeconds = Math.max(0, Math.floor(elapsed / 1000));

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    getCurrentDateFormatted() {
        const now = new Date();
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };

        // Formato: "viernes, 29 de noviembre de 2025"
        const formatted = now.toLocaleDateString('es-ES', options);
        // Capitalizar primera letra
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }

    rotate() {
        const viewData = this.views[this.currentView]();

        // Limpiar intervalo anterior si existe
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
            this.updateIntervalId = null;
        }

        // Aplicar transición suave
        this.timerLabel.style.opacity = '0';
        this.timerDisplay.style.opacity = '0';

        setTimeout(() => {
            // Resetear clases y estilos
            this.timerLabel.classList.remove('marquee');
            this.timerDisplay.style.display = 'block'; // Asegurar que sea visible por defecto

            // Establecer el contenido
            this.timerLabel.textContent = viewData.label;
            this.timerDisplay.textContent = viewData.display;

            // Detectar si necesita marquesina
            requestAnimationFrame(() => {
                const labelWidth = this.timerLabel.scrollWidth;
                const containerWidth = this.timerLabel.clientWidth;

                // Si el texto es largo (más del 80% del contenedor padre aprox)
                // O si explícitamente queremos que ocupe todo (vistas de texto largo)
                if (labelWidth > containerWidth + 5) {
                    // El texto no cabe, aplicar marquesina
                    this.timerLabel.classList.add('marquee');

                    // Ocultar el display para dar espacio completo
                    this.timerDisplay.style.display = 'none';

                    // Envolver el texto en un span para la animación
                    const text = this.timerLabel.textContent;
                    this.timerLabel.innerHTML = `<span>${text}</span>`;
                }
            });

            this.timerLabel.style.opacity = '1';
            this.timerDisplay.style.opacity = '1';

            // Si la vista necesita actualizaciones (como el cronómetro), configurar intervalo
            if (viewData.needsUpdate) {
                this.updateIntervalId = setInterval(() => {
                    this.timerDisplay.textContent = this.getSessionTime();
                }, 1000);
            }
        }, 300);

        // Avanzar al siguiente view
        this.currentView = (this.currentView + 1) % this.views.length;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const rotator = new StreamInfoRotator();
    rotator.init();
});
