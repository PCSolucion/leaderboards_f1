function animateTable() {
    const container = document.getElementById('table-container');
    
    function cycle() {
        // Deslizar hacia fuera después de 15 minutos
        setTimeout(() => {
            container.classList.add('slide-out');
            
            // Después de 30 minutos de estar oculta, deslizar hacia dentro
            setTimeout(() => {
                container.classList.remove('slide-out');
                container.classList.add('slide-in');
                
                // Remover la clase slide-in después de que termine la animación
                setTimeout(() => {
                    container.classList.remove('slide-in');
                }, 1000);
            }, 1800000); // 1800000 ms = 30 minutos
        }, 900000); // 900000 ms = 15 minutos
    }
    
    // Iniciar el ciclo cada 45 minutos (15 minutos visible + 30 minutos oculta)
    setInterval(cycle, 2700000); // 2700000 ms = 45 minutos
}

// Iniciar la animación cuando la página se cargue
document.addEventListener('DOMContentLoaded', animateTable);