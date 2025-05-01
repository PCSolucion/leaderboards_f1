function animateTable() {
    const container = document.getElementById('table-container');
    
    function cycle() {
        // Deslizar hacia fuera
        container.classList.add('slide-out');
        
        // Después de 5 minutos, deslizar hacia dentro
        setTimeout(() => {
            container.classList.remove('slide-out');
            container.classList.add('slide-in');
            
            // Remover la clase slide-in después de que termine la animación
            setTimeout(() => {
                container.classList.remove('slide-in');
            }, 1000);
        }, 300000); // 300000 ms = 5 minutos
    }
    
    // Iniciar el ciclo cada 60 minutos (55 minutos visible + 5 minutos de animación)
    setInterval(cycle, 3600000); // 3600000 ms = 60 minutos
}

// Iniciar la animación cuando la página se cargue
document.addEventListener('DOMContentLoaded', animateTable);