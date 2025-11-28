function animateTable() {
    const container = document.getElementById('table-container');

    function cycle() {
        // Deslizar hacia fuera después de 5 minutos
        setTimeout(() => {
            container.classList.add('slide-out');

            // Después de 5 minutos de estar oculta, deslizar hacia dentro
            setTimeout(() => {
                container.classList.remove('slide-out');
                container.classList.add('slide-in');

                // Remover la clase slide-in después de que termine la animación
                setTimeout(() => {
                    container.classList.remove('slide-in');
                }, 1000);
            }, 300000); // 300000 ms = 5 minutos
        }, 300000); // 300000 ms = 5 minutos
    }

    // Iniciar el ciclo cada 10 minutos (5 minutos visible + 5 minutos oculta)
    setInterval(cycle, 600000); // 600000 ms = 10 minutos
}

// Iniciar la animación cuando la página se cargue
document.addEventListener('DOMContentLoaded', animateTable);