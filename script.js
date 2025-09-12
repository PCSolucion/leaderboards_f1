// array que describe el color para cada equipo
// usando camel case donde los nombres de los equipos incluyen un espacio
const colors = {
  mercedes: '#00D2BE',
  ferrari: '#DC0000',
  redBull: '#1E41FF',
  alpine: '#0b1d2e',
  astonmartin: '#229971',
  alfaRomeo: '#9B0000',
  toroRosso: '#2325cf',
  haas: '#BD9E57',
  mclaren: '#FF8700',
  williams: '#FFFFFF'
}

// array que describe los conductores, ordenados por posición y con un gap que describe la distancia del conductor líder
// para los iconos de subir o bajar puestos se ha añadido posicion. 1 para que no aparezca nada, 2 para la flecha verde de subir y 3 para la roja de bajar
const leaderboard = [
  {
    name: 'JAMES_193',
    team: 'mercedes',
    gap: '613 Exp.',
    posicion: 1
  },
  {
    name: 'TAKERU_XIII',
    team: 'mercedes',
    gap: '578 Exp.',
    posicion: 1
  },
  {
    name: 'RACTOR09',
    team: 'mclaren',
    gap: '438 Exp.',
    posicion: 1
  },
  {
    name: 'X1LENZ',
    team: 'red bull',
    gap: '398 Exp.',
    posicion: 1
  },
  {
    name: 'BROXA24',
    team: 'ferrari',
    gap: '396 Exp.',
    posicion: 1
  },
  {
    name: 'DARKOUS666',
    team: 'ferrari',
    gap: '392 Exp.',
    posicion: 1
  },
  
  {
    name: 'XROOCKK',
    team: 'toroRosso',
    gap: '366 Exp.',
    posicion: 1
  },
  {
    name: 'MANGUERAZO',
    team: 'red bull',
    gap: '365 Exp.',
    posicion: 1
  },
  {
    name: 'CHADAIF',
    team: 'alpine',
    gap: '356 Exp.',
    posicion: 1
  },
  {
    name: 'MACUSAM',
    team: 'astonmartin',
    gap: '335 Exp.',
    posicion: 1
  },
  {
    name: 'CCXSNOP',
    team: 'mclaren',
    gap: '335 Exp.',
    posicion: 1
  },
  
  {
    name: 'URIMAS82',
    team: 'astonmartin',
    gap: '304 Exp.',
    posicion: 1
  },
  {
    name: 'NANUSSO',
    team: 'toroRosso',
    gap: '254 Exp.',
    posicion: 1
  },
  {
    name: 'TONYFORYU',
    team: 'alpine',
    gap: '235 Exp.',
    posicion: 1
  },
  {
    name: 'YISUS86',
    team: 'williams',
    gap: '232 Exp.',
    posicion: 1
  },
  {
    name: 'MAMBIITV',
    team: 'alfaRomeo',
    gap: '203 Exp.',
    posicion: 1
  },
  {
    name: 'BITTERBITZ',
    team: 'williams',
    gap: '198 Exp.',
    posicion: 1
  },
  {
    name: 'PANICSHOW_12',
    team: 'haas',
    gap: '191 Exp.',
    posicion: 1
  },
  {
    name: 'EMMA1403',
    team: 'alfaRomeo',
    gap: '188 Exp.',
    posicion: 1
  },
  {
    name: 'ICAROLINAGI',
    team: 'haas',
    gap: '163 Exp.',
    posicion: 1
  }
];

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
// ! agregar una clase a la fila para diferenciar las filas de la existente
// de lo contrario, el método select podría apuntar a la existente y incluir una fila menos de la requerida
const drivers = main
  .selectAll('tr.driver')
  .data(leaderboard)
  .enter()
  .append('tr')
  .attr('class', 'driver');

// en cada fila agregar la información especificada por el conjunto de datos en elementos td
// especificar una clase para estilizar los elementos de manera diferente con CSS

// posición usando el índice de los puntos de datos
drivers
  .append('td')
  .attr('class', 'position')
  .html((d, i) => {
    // Se eliminó la funcionalidad de la imagen up completamente
    const positionImage = d.posicion === 3
      ? '<img class="down" src="https://res.cloudinary.com/pcsolucion/image/upload/v1743585029/Position_Down_jjm0ha.png" alt="Position Down" style="height: 1em; vertical-align: middle; display: none; margin-bottom: 2px;">'
      : '';
    return `${positionImage}${i + 1}`;
  })
  .style('background-color', (d, i) => {
    // Restaurar el color morado para la posición 1
    if ((i + 1) === 1) return '#ff0000';
    if ((i + 1) >= 2 && (i + 1) <= 20) return 'rgba(5, 5, 5, 0.3)';
    return null;
  })
  .style('width', '22px')
  .style('min-width', '22px')
  .style('max-width', '22px')
  .style('font-size', '14px');

// nombre seguido del equipo
drivers
  .append('td')
  .html(({name, team}) => {
    // Verificar si el equipo es Mercedes y mostrar la imagen
    const teamName = team === 'mercedes' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742785431/Mercedes-Logo.svg_obpxws.png" alt="Mercedes" style="height: 1.2em; width: 1.6em; object-fit: contain; vertical-align: middle; margin-right: 3px;">' 
      : team === 'ferrari' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742785952/Ferrari-Logo_l17w2e.png" alt="Ferrari" style="height: 1.2em; width: 1.6em; object-fit: contain; vertical-align: middle; margin-right: 3px;">' 
      : team === 'red bull' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742786100/rb_x5pwuu.png" alt="Red Bull" style="height: 1.2em; width: 1.6em; object-fit: contain; vertical-align: middle; margin-right: 3px;">' 
      : team === 'alpine' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742786254/imgbin_alpine-a110-sports-car-renault-png_upq6ni.png" alt="Alpine" style="height: 1.2em; width: 1.6em; object-fit: contain; vertical-align: middle; margin-right: 3px;">'
      : team === 'astonmartin' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1745062238/am_pwkxij.png" alt="Aston Martin" style="height: 1.2em; width: 1.6em; object-fit: contain; vertical-align: middle; margin-right: 3px;">'
      : team === 'alfaRomeo' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742786780/20210106191506_Alfa_Romeo_Racing__Logo_fly4r8.svg" alt="Alfa Romeo" style="height: 1.2em; width: 1.6em; object-fit: contain; vertical-align: middle; margin-right: 3px;">'
      : team === 'toroRosso' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742786903/racing_bulls-logo_brandlogos.net_bjuef_ygq2em.png" alt="Toro Rosso" style="height: 1.2em; width: 1.6em; object-fit: contain; vertical-align: middle; margin-right: 3px;">'
      : team === 'mclaren'
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1745062373/9807_McLaren_Logo_cqwdty.png" alt="McLaren" style="height: 1.2em; width: 1.6em; object-fit: contain; vertical-align: middle; margin-right: 3px;">'
      : team === 'williams'
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1745829856/clipart3162470_uki0pk.png" alt="Williams" style="height: 1.1em; width: 1.5em; object-fit: contain; vertical-align: middle; margin-right: 3px;">'
      : team === 'haas'
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1745828985/Logo_Haas_F1_vekjlj.png" alt="Haas" style="height: 1.2em; width: 1.6em; object-fit: contain; vertical-align: middle; margin-right: 3px;">'
      : team;
    
    // Añadir los puntos directamente junto al nombre
    return `<span style="margin-left: 7px; display: inline-block; margin-right: 0px;">${teamName}</span>${name.split(' ').map((part, index) => index > 0 ? `<strong>${part}</strong>` : `${part}`).join(' ')}`;
  })
  .style('border-left', ({team}) => {
    const color = team.split(' ').map((word, index) => index > 0 ? `${word[0].toUpperCase()}${word.slice(1)}` : `${word}`).join('');
    return `4px solid ${colors[color]}`;
  })
  .style('padding-left', '0px')
  .style('background-color', 'rgba(30, 30, 30, 0.3)')
  .attr('class', 'driver');

// gap desde el primer conductor
drivers
  .append('td')
  .attr('class', 'gap')
  .style('padding-left', '0px')
  .style('padding-right', '0px')
  .style('background-color', 'rgba(30, 30, 30, 0.3)')
  .append('span')
  .text(({gap}) => gap);

// === NUEVO CÓDIGO PARA ICONO MORADO ===
// Puntos anteriores (antes de la actualización)
const puntosPrevios = {
  'JAMES_193': 608,
  'TAKERU_XIII': 560,
  'RACTOR09': 410,
  'X1LENZ': 397,
  'DARKOUS666': 392,
  'BROXA24': 388,
  'XROOCKK': 365,
  'MANGUERAZO': 362,
  'CHADAIF': 344,
  'CCXSNOP': 333,
  'MACUSAM': 330,
  'URIMAS82': 291,
  'NANUSSO': 254,
  'TONYFORYU': 235,
  'YISUS86': 231,
  'MAMBIITV': 198,
  'BITTERBITZ': 190,
  'PANICSHOW_12': 191,
  'EMMA1403': 187,
  'ICAROLINAGI': 163
};

// Puntos actuales (después de la actualización)
const puntosActuales = {
  'JAMES_193': 609,
  'TAKERU_XIII': 569,
  'RACTOR09': 428,
  'X1LENZ': 398,
  'DARKOUS666': 392,
  'BROXA24': 391,
  'XROOCKK': 366,
  'MANGUERAZO': 364,
  'CHADAIF': 352,
  'CCXSNOP': 333,
  'MACUSAM': 332,
  'URIMAS82': 301,
  'NANUSSO': 254,
  'TONYFORYU': 235,
  'YISUS86': 232,
  'MAMBIITV': 203,
  'BITTERBITZ': 198,
  'PANICSHOW_12': 191,
  'EMMA1403': 188,
  'ICAROLINAGI': 163
};

// Calcular quién sumó más puntos
let maxDiff = -Infinity;
let pilotoDestacado = null;
Object.keys(puntosActuales).forEach(nombre => {
  let nombrePrevio = nombre === 'CHADAIF' ? 'LINKH_RP' : nombre;
  const prev = puntosPrevios[nombrePrevio] || 0;
  const actual = puntosActuales[nombre];
  const diff = actual - prev;
  if (diff > maxDiff) {
    maxDiff = diff;
    pilotoDestacado = nombre;
  }
});

// Esperar a que la tabla esté renderizada para insertar el icono
window.addEventListener('DOMContentLoaded', () => {
  // Buscar la fila del piloto destacado
  const filas = document.querySelectorAll('tr.driver');
  let filaDestacada = null;
  filas.forEach(fila => {
    const nombreCelda = fila.querySelector('td.driver');
    if (nombreCelda && nombreCelda.textContent.trim().toUpperCase().includes(pilotoDestacado)) {
      filaDestacada = fila;
    }
  });
  if (filaDestacada) {
    // Buscar la celda de puntos (gap)
    const celdaGap = filaDestacada.querySelector('td.gap');
    if (celdaGap) {
      // Crear el icono morado
      const icono = document.createElement('img');
      icono.src = 'https://res.cloudinary.com/pcsolucion/image/upload/v1752070038/Screenshot_1_wespu3.jpg';
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
});