/**
 * Gestor de Resaltado Verde Estático
 * Mantiene el resaltado verde constante para las filas activas del chat
 * (sin parpadeo ni ciclos temporales)
 */

class GreenPulseCycleManager {
    constructor() {
        this.isPulsing = true; // Siempre activo

        console.log('🟢 Green Pulse Manager inicializado (modo estático)');
        console.log('   El resaltado verde está siempre activo');

        // Aplicar inmediatamente a las filas existentes
        this.applyToAllActiveRows();
    }

    /**
     * Aplica el estilo estático a todas las filas con chat-active
     */
    applyToAllActiveRows() {
        const activeRows = document.querySelectorAll('tr.driver.chat-active');

        activeRows.forEach(row => {
            row.classList.add('pulsing');
        });

        if (activeRows.length > 0) {
            console.log(`🟢 Resaltado verde aplicado a ${activeRows.length} fila(s)`);
        }
    }

    /**
     * Añade la clase pulsing a una fila (siempre activo)
     * @param {HTMLElement} row - Elemento TR de la fila
     */
    applyToRow(row) {
        if (!row) return;
        row.classList.add('pulsing');
    }

    /**
     * Obtiene el estado actual
     * @returns {{isPulsing: boolean}}
     */
    getStatus() {
        return {
            isPulsing: this.isPulsing,
            mode: 'static',
            description: 'Resaltado verde siempre activo'
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
        console.log('🟢 Estado del Green Pulse:', status);
        return status;
    };

    console.log('💡 Comando disponible: getGreenPulseStatus()');
});
