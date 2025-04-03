function animateTable() {
    const container = document.getElementById('table-container');
    
    function cycle() {
        // Deslizar hacia fuera
        container.classList.add('slide-out');
        
        // Después de 1 minuto, deslizar hacia dentro
        setTimeout(() => {
            container.classList.remove('slide-out');
            container.classList.add('slide-in');
            
            // Remover la clase slide-in después de que termine la animación
            setTimeout(() => {
                container.classList.remove('slide-in');
            }, 1000);
        }, 600000); // 60000 ms = 10 minuto
    }
    
    // Iniciar el ciclo cada 20 minutos (10 minuto visible + 10 minuto de animación)
    setInterval(cycle, 1200000); // 120000 ms = 20 minutos
}

// Iniciar la animación cuando la página se cargue
document.addEventListener('DOMContentLoaded', animateTable);