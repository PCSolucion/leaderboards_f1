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
    name: 'TAKERU_XIII',
    team: 'mercedes',
    gap: '640 Exp.',
    posicion: 2
  },
  {
    name: 'JAMES_193',
    team: 'mercedes',
    gap: '636 Exp.',
    posicion: 3
  },
  {
    name: 'RACTOR09',
    team: 'mclaren',
    gap: '545 Exp.',
    posicion: 1
  },
  {
    name: 'XROOCKK',
    team: 'toroRosso',
    gap: '438 Exp.',
    posicion: 1
  },
  {
    name: 'BROXA24',
    team: 'ferrari',
    gap: '416 Exp.',
    posicion: 1
  },
  {
    name: 'X1LENZ',
    team: 'red bull',
    gap: '414 Exp.',
    posicion: 1
  },
  {
    name: 'DARKOUS666',
    team: 'ferrari',
    gap: '392 Exp.',
    posicion: 1
  },
  {
    name: 'CHANDALF',
    team: 'alpine',
    gap: '383 Exp.',
    posicion: 1
  },
  {
    name: 'MANGUERAZO',
    team: 'red bull',
    gap: '383 Exp.',
    posicion: 1
  },
  {
    name: 'CCXSNOP',
    team: 'mclaren',
    gap: '362 Exp.',
    posicion: 1
  },
  {
    name: 'MACUSAM',
    team: 'astonmartin',
    gap: '348 Exp.',
    posicion: 1
  },
  {
    name: 'URIMAS82',
    team: 'astonmartin',
    gap: '346 Exp.',
    posicion: 1
  },
  {
    name: 'NANUSSO',
    team: 'toroRosso',
    gap: '279 Exp.',
    posicion: 1
  },
  {
    name: 'BITTERBITZ',
    team: 'williams',
    gap: '253 Exp.',
    posicion: 2
  },
  {
    name: 'REICHSKANZ',
    team: 'alpine',
    gap: '249 Exp.',
    posicion: 3
  },
  {
    name: 'YISUS86',
    team: 'williams',
    gap: '240 Exp.',
    posicion: 2
  },
  {
    name: 'TONYFORYU',
    team: 'williams',
    gap: '238 Exp.',
    posicion: 3
  },
  {
    name: 'MAMBIITV',
    team: 'alfaRomeo',
    gap: '234 Exp.',
    posicion: 1
  },
  {
    name: 'EMMA1403',
    team: 'alfaRomeo',
    gap: '205 Exp.',
    posicion: 1
  },
  {
    name: 'FABIRULES',
    team: 'haas',
    gap: '198 Exp.',
    posicion: 2
  },
  {
    name: 'PANICSHOW_12',
    team: 'haas',
    gap: '195 Exp.',
    posicion: 3
  },
  {
    name: 'IFLEKY',
    team: 'haas',
    gap: '186 Exp.',
    posicion: 3
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
  .style('position', 'relative')
  .html((d, i) => {
    let positionImage = '';
    // El top 1 nunca muestra iconos de cambio de posición
    if ((i + 1) !== 1) {
      // Flecha verde arriba si subió (posicion === 2)
      if (d.posicion === 2) {
        positionImage = '<img class="up" src="https://res.cloudinary.com/pcsolucion/image/upload/v1743585029/Position_Up_gbv0y4.png" alt="Position Up">';
      }
      // Flecha roja abajo si bajó (posicion === 3)
      if (d.posicion === 3) {
        positionImage = '<img class="down" src="https://res.cloudinary.com/pcsolucion/image/upload/v1743585029/Position_Down_jjm0ha.png" alt="Position Down">';
      }
    }
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
    const nombreFormateado = name.split(' ').map((part, index) => index > 0 ? `<strong>${part}</strong>` : `${part}`).join(' ');
    return `<span style="margin-left: 7px; display: inline-block; margin-right: 0px;">${teamName}</span><span class="driver-name" style="display: inline;">${nombreFormateado}</span>`;
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
  'TAKERU_XIII': 627,
  'JAMES_193': 631,
  'RACTOR09': 504,
  'XROOCKK': 414,
  'BROXA24': 412,
  'X1LENZ': 407,
  'DARKOUS666': 392,
  'C_H_A_N_D_A_L_F': 376,
  'MANGUERAZO': 375,
  'CCXSNOP': 355,
  'MACUSAM': 343,
  'URIMAS82': 327,
  'NANUSSO': 267,
  'BITTERBITZ': 208,
  'REICHSKANZ': 237,
  'YISUS86': 0,
  'TONYFORYU': 237,
  'MAMBIITV': 206,
  'EMMA1403': 191,
  'FABIRULES': 0,
  'PANICSHOW_12': 193,
  'IFLEKY': 167
};

// Puntos actuales (después de la actualización)
const puntosActuales = {
  'TAKERU_XIII': 640,
  'JAMES_193': 636,
  'RACTOR09': 545,
  'XROOCKK': 438,
  'BROXA24': 416,
  'X1LENZ': 414,
  'DARKOUS666': 392,
  'C_H_A_N_D_A_L_F': 383,
  'MANGUERAZO': 383,
  'CCXSNOP': 362,
  'MACUSAM': 348,
  'URIMAS82': 346,
  'NANUSSO': 279,
  'BITTERBITZ': 253,
  'REICHSKANZ': 249,
  'YISUS86': 240,
  'TONYFORYU': 238,
  'MAMBIITV': 234,
  'EMMA1403': 205,
  'FABIRULES': 198,
  'PANICSHOW_12': 195,
  'IFLEKY': 186
};

// Mapeo de nombres para coincidir con el leaderboard
const nombreMapping = {
  'C_H_A_N_D_A_L_F': 'CHANDALF'
};

// Función para normalizar nombres
function normalizarNombre(nombre) {
  return nombreMapping[nombre] || nombre;
}

// Función para obtener el nombre del leaderboard desde el nombre de puntos
function obtenerNombreLeaderboard(nombrePuntos) {
  return normalizarNombre(nombrePuntos);
}

// Esperar a que la tabla esté renderizada para insertar el icono
window.addEventListener('DOMContentLoaded', () => {
  // Obtener los nombres de los pilotos del top 15
  const filas = document.querySelectorAll('tr.driver');
  const pilotosTop15 = [];
  
  filas.forEach((fila, index) => {
    if (index < 15) { // Solo las primeras 15 posiciones
      const nombreCelda = fila.querySelector('td.driver');
      if (nombreCelda) {
        const nombreEnTabla = nombreCelda.textContent.trim().toUpperCase();
        pilotosTop15.push({
          nombre: nombreEnTabla,
          fila: fila,
          posicion: index + 1
        });
      }
    }
  });
  
  // Calcular quién sumó más puntos entre los del top 15
  let maxDiff = -Infinity;
  let pilotoDestacado = null;
  let filaDestacada = null;
  
  pilotosTop15.forEach(({nombre, fila}) => {
    // Buscar el nombre en puntosActuales (puede tener formato diferente)
    Object.keys(puntosActuales).forEach(nombrePuntos => {
      const nombreNormalizado = obtenerNombreLeaderboard(nombrePuntos).toUpperCase();
      // Verificar si coincide con el nombre de la tabla
      if (nombre === nombreNormalizado || nombre.includes(nombreNormalizado) || nombreNormalizado.includes(nombre.replace(/\s+/g, '_'))) {
        const prev = puntosPrevios[nombrePuntos] || 0;
        const actual = puntosActuales[nombrePuntos];
        const diff = actual - prev;
        if (diff > maxDiff) {
          maxDiff = diff;
          pilotoDestacado = nombre;
          filaDestacada = fila;
        }
      }
    });
  });
  
  // Mostrar el icono morado en el piloto destacado del top 15
  if (filaDestacada && pilotoDestacado) {
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