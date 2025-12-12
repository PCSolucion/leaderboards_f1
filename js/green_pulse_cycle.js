/**
 * Gestor de Ciclos de Parpadeo Verde
 * Controla el parpadeo de las filas de la tabla en ciclos:
 * - 1 minuto: Parpade green
 * - 10 minutos: Pausa (sin parpadeo)
 * - Repetir indefinidamente
 */

class GreenPulseCycleManager {
    constructor() {
        // Duraciones en milisegundos
        this.PULSE_DURATION = 60 * 1000; // 1 minuto
        this.PAUSE_DURATION = 10 * 60 * 1000; // 10 minutos
        this.TOTAL_CYCLE = this.PULSE_DURATION + this.PAUSE_DURATION; // 11 minutos

        this.isPulsing = false;
        this.cycleTimer = null;

        console.log('🟢 Green Pulse Cycle Manager inicializado');
        console.log(`   Patrón: 1 min activo → 10 min pausa → repetir`);

        // Iniciar el ciclo
        this.startCycle();
    }

    /**
     * Inicia el ciclo de parpadeo
     */
    startCycle() {
        // Comenzar inmediatamente con el primer minuto de parpadeo
        this.startPulsing();

        // Después de 1 minuto, detener el parpadeo
        setTimeout(() => {
            this.stopPulsing();

            // Después de 10 minutos de pausa, reiniciar el ciclo
            setTimeout(() => {
                this.startCycle(); // Recursivo para ciclo infinito
            }, this.PAUSE_DURATION);

        }, this.PULSE_DURATION);
    }

    /**
     * Activa el parpadeo en todas las filas con clase chat-active
     */
    startPulsing() {
        this.isPulsing = true;
        const activeRows = document.querySelectorAll('tr.driver.chat-active');

        activeRows.forEach(row => {
            row.classList.add('pulsing');
        });

        if (activeRows.length > 0) {
            console.log(`🟢 Parpadeo ACTIVADO para ${activeRows.length} fila(s) (duración: 1 minuto)`);
        }
    }

    /**
     * Desactiva el parpadeo en todas las filas
     */
    stopPulsing() {
        this.isPulsing = false;
        const activeRows = document.querySelectorAll('tr.driver.chat-active');

        activeRows.forEach(row => {
            row.classList.remove('pulsing');
        });

        if (activeRows.length > 0) {
            console.log(`⏸️  Parpadeo PAUSADO (duración: 10 minutos)`);
        }
    }

    /**
     * Añade la clase pulsing a una fila si el ciclo está activo
     * Usar esto cuando una nueva fila recibe chat-active
     * @param {HTMLElement} row - Elemento TR de la fila
     */
    applyToRow(row) {
        if (!row) return;

        if (this.isPulsing) {
            row.classList.add('pulsing');
        } else {
            row.classList.remove('pulsing');
        }
    }

    /**
     * Obtiene el estado actual del ciclo
     * @returns {{isPulsing: boolean, nextChangeIn: number}}
     */
    getStatus() {
        return {
            isPulsing: this.isPulsing,
            pulseDuration: this.PULSE_DURATION / 1000 + 's',
            pauseDuration: this.PAUSE_DURATION / 1000 + 's',
            totalCycle: this.TOTAL_CYCLE / 1000 + 's'
        };
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia global
    window.greenPulseCycleManager = new GreenPulseCycleManager();

    // Exponer comando de depuración
    window.getGreenPulseStatus = () => {
        const status = window.greenPulseCycleManager.getStatus();
        console.log('🟢 Estado del Green Pulse Cycle:', status);
        return status;
    };

    console.log('💡 Comando disponible: getGreenPulseStatus()');
});
