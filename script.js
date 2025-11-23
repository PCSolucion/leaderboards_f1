// Usamos los datos de data.js (config, driversData)

// seleccionar el elemento de la tabla en el que agregar un div para cada conductor
const main = d3
  .select('table')
  .style('border-collapse', 'separate')
  .style('border-spacing', '0 6px');

// Estilizar el encabezado y redondear borde superior izquierdo
main.select('thead th:first-child')
  .style('padding-top', '10px')
  .style('margin-top', '-10px')
  .style('position', 'relative')
  .style('top', '-10px');

// Redondear el borde superior izquierdo
main.select('tr:first-child td:first-child')
  .style('border-top-left-radius', '8px');

// para cada conductor agregar una fila de tabla
const drivers = main
  .selectAll('tr.driver')
  .data(driversData) // Usamos driversData de data.js
  .enter()
  .append('tr')
  .attr('class', (d, i) => i === 0 ? 'driver rank-1' : 'driver') // Clase especial para el Top 1
  .style('animation-delay', (d, i) => `${i * 0.1}s`); // Retraso en cascada (0.1s por fila)

// en cada fila agregar la información especificada por el conjunto de datos en elementos td
// especificar una clase para estilizar los elementos de manera diferente con CSS

// posición usando el índice de los puntos de datos
drivers
  .append('td')
  .attr('class', 'position')
  .style('position', 'relative')
  .html((d, i) => {
    let positionImage = '';
    // El top 1 nunca muestra iconos de cambio de posición
    if ((i + 1) !== 1) {
      // Flecha verde arriba si subió (trend === 2)
      if (d.trend === 2) {
        positionImage = `<img class="up" src="${config.images.positionUp}" alt="Position Up">`;
      }
      // Flecha roja abajo si bajó (trend === 3)
      if (d.trend === 3) {
        positionImage = `<img class="down" src="${config.images.positionDown}" alt="Position Down">`;
      }
    }
    return `${positionImage}${i + 1}`;
  })
  .style('background-color', (d, i) => {
    // Restaurar el color morado para la posición 1
    if ((i + 1) === 1) return '#ff0000';
    if ((i + 1) >= 2 && (i + 1) <= 20) return 'rgba(30, 30, 30, 0.0)';
    return null;
  })
  .style('width', '22px')
  .style('min-width', '22px')
  .style('max-width', '22px')
  .style('font-size', '14px');

// nombre seguido del equipo
drivers
  .append('td')
  .html(({ name, team }) => {
    // Obtener info del equipo desde config
    const teamInfo = config.teams[team] || { logo: '', width: '1.6em' };

    // Generar HTML del logo si existe
    const teamLogoHtml = teamInfo.logo
      ? `<img src="${teamInfo.logo}" alt="${team}" style="height: 1.2em; width: ${teamInfo.width}; object-fit: contain; vertical-align: middle; margin-right: 3px;">`
      : '';

    // Añadir los puntos directamente junto al nombre
    const nombreFormateado = name.split(' ').map((part, index) => index > 0 ? `<strong>${part}</strong>` : `${part}`).join(' ');

    // Si el nombre tiene más de 11 letras, reducir la fuente 1px (de 14px a 13px)
    const fontSizeStyle = name.length > 11 ? 'font-size: 13px;' : '';

    return `<span style="margin-left: 7px; display: inline-block; margin-right: 0px;">${teamLogoHtml}</span><span class="driver-name" style="display: inline; ${fontSizeStyle}">${nombreFormateado}</span>`;
  })
  .style('border-left', ({ team }) => {
    const teamInfo = config.teams[team];
    const color = teamInfo ? teamInfo.color : '#FFFFFF';
    return `4px solid ${color}`;
  })
  .style('padding-left', '0px')
  .attr('class', 'driver');

// gap desde el primer conductor (ahora puntos)
drivers
  .append('td')
  .attr('class', 'gap')
  .style('padding-left', '0px')
  .style('padding-right', '0px')
  .style('background-color', 'rgba(30, 30, 30, 0.0)')
  .append('span')
  .text(({ points }) => `${points} Exp.`);

// === LÓGICA SIMPLIFICADA PARA ICONO MORADO ===
window.addEventListener('DOMContentLoaded', () => {
  // Calcular quién sumó más puntos entre los del top 15
  // Ahora es mucho más fácil porque tenemos points y prevPoints en el mismo objeto
  let maxDiff = -Infinity;
  let pilotoDestacadoIndex = -1;

  // Solo consideramos el top 15
  const top15 = driversData.slice(0, 15);

  top15.forEach((driver, index) => {
    const diff = driver.points - driver.prevPoints;
    if (diff > maxDiff) {
      maxDiff = diff;
      pilotoDestacadoIndex = index;
    }
  });

  // Mostrar el icono morado en el piloto destacado
  if (pilotoDestacadoIndex !== -1) {
    // Seleccionar la fila correspondiente en el DOM
    // Nota: d3 crea las filas en orden, así que el índice coincide con driversData
    const filas = document.querySelectorAll('tr.driver');
    const filaDestacada = filas[pilotoDestacadoIndex];

    if (filaDestacada) {
      const celdaGap = filaDestacada.querySelector('td.gap');
      if (celdaGap) {
        // Crear el icono morado
        const icono = document.createElement('img');
        icono.src = config.images.purpleIcon;
        icono.alt = 'Icono Morado';
        icono.style.height = '31px';
        icono.style.marginLeft = '0px';
        icono.style.verticalAlign = 'middle';
        icono.style.position = 'absolute';
        icono.style.left = '100%';
        icono.style.top = '50%';
        icono.style.transform = 'translateY(-50%)';

        // Crear un contenedor relativo para la celda si no lo tiene
        celdaGap.style.position = 'relative';
        celdaGap.appendChild(icono);
      }
    }
  }
});