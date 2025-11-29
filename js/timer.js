/**
 * SessionTimer
 * Responsabilidad: Gestionar el cronómetro de sesión en tiempo real
 */
class SessionTimer {
    constructor(displayElementId) {
        this.displayElement = document.getElementById(displayElementId);
        this.startTime = Date.now();
        this.intervalId = null;
    }

    /**
     * Formatea el tiempo transcurrido en formato HH:MM:SS
     * @param {number} milliseconds - Milisegundos transcurridos
     * @returns {string} Tiempo formateado
     */
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    /**
     * Actualiza el display del cronómetro
     */
    updateDisplay() {
        const elapsed = Date.now() - this.startTime;
        this.displayElement.textContent = this.formatTime(elapsed);
    }

    /**
     * Inicia el cronómetro
     */
    start() {
        // Actualizar inmediatamente
        this.updateDisplay();

        // Actualizar cada segundo
        this.intervalId = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    /**
     * Detiene el cronómetro
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Reinicia el cronómetro
     */
    reset() {
        this.stop();
        this.startTime = Date.now();
        this.start();
    }
}

// Inicializar el cronómetro cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    const sessionTimer = new SessionTimer('session-time');
    sessionTimer.start();
});
