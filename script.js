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
    gap: '+547',
    posicion: 1
  },
  {
    name: 'TAKERU_XIII',
    team: 'mercedes',
    gap: '+492',
    posicion: 1
  },
  {
    name: 'DARKOUS666',
    team: 'ferrari',
    gap: '+392',
    posicion: 1
  },
  {
    name: 'X1LENZ',
    team: 'red bull',
    gap: '+390',
    posicion: 1
  },
  {
    name: 'BROXA24',
    team: 'ferrari',
    gap: '+375',
    posicion: 1
  },
  {
    name: 'MANGUERAZO',
    team: 'red bull',
    gap: '+335',
    posicion: 1
  },
  {
    name: 'RACTOR09',
    team: 'alpine',
    gap: '+330',
    posicion: 2
  }, 
  {
    name: 'MACUSAM',
    team: 'astonmartin',
    gap: '+320',
    posicion: 3
  },
  {
    name: 'CCXSNOP',
    team: 'mclaren',
    gap: '+299',
    posicion: 1
  },
  {
    name: 'XROOCKK',
    team: 'toroRosso',
    gap: '+289',
    posicion: 1
  },
  {
    name: 'LINKH_RP',
    team: 'mclaren',
    gap: '+284',
    posicion: 1
  },
  {
    name: 'NANUSSO',
    team: 'toroRosso',
    gap: '+253',
    posicion: 1
  },
  {
    name: 'URIMAS82',
    team: 'astonmartin',
    gap: '+232',
    posicion: 1
  },
  {
    name: 'TONYFORYU',
    team: 'alpine',
    gap: '+229',
    posicion: 1
  },
  {
    name: 'Antonio Giovinazzi',
    team: 'alfa romeo',
    gap: '+1 lap',
    posicion: 1
  },
  {
    name: 'George Russell',
    team: 'williams',
    gap: '+2 laps',
    posicion: 1
  },
  {
    name: 'Robert Kubica',
    team: 'williams',
    gap: '+2 laps',
    posicion: 1
  },
  {
    name: 'Lando Norris',
    team: 'mclaren',
    gap: 'DNF',
    posicion: 1
  },
  {
    name: 'Daniil Kvyat',
    team: 'toro rosso',
    gap: 'DNF',
    posicion: 1
  },
  {
    name: 'Nico Hulkenberg',
    team: 'renault',
    gap: 'DNF',
    posicion: 1
  }
];

// seleccionar el elemento de la tabla en el que agregar un div para cada conductor
const main = d3
  .select('table')
  .style('border-collapse', 'separate')
  .style('border-spacing', '0 8px');

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
    const positionImage = d.posicion === 2 
      ? '<img class="up" src="https://res.cloudinary.com/pcsolucion/image/upload/v1743585029/Position_Up_gbv0y4.png" alt="Position Up" style="height: 1em; vertical-align: middle; display: block; margin-bottom: 2px;">'
      : d.posicion === 3
      ? '<img class="down" src="https://res.cloudinary.com/pcsolucion/image/upload/v1743585029/Position_Down_jjm0ha.png" alt="Position Down" style="height: 1em; vertical-align: middle; display: none; margin-bottom: 2px;">'
      : '';
    return `${positionImage}${i + 1}`;
  })
  .style('background-color', (d, i) => {
    if ((i + 1) === 1) return 'rgba(255, 0, 0, 1)';
    if ((i + 1) >= 2 && (i + 1) <= 20) return 'rgba(5, 5, 5, 0.5)';
    return null;
  })
  .style('width', (d, i) => (i + 1) === 1 ? '37px' : null);

// nombre seguido del equipo
drivers
  .append('td')
  .html(({name, team}) => {
    // Verificar si el equipo es Mercedes y mostrar la imagen
    const teamName = team === 'mercedes' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742785431/Mercedes-Logo.svg_obpxws.png" alt="Mercedes" style="height: 1.43em; width: 1.98em; object-fit: contain; vertical-align: middle;">' 
      : team === 'ferrari' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742785952/Ferrari-Logo_l17w2e.png" alt="Ferrari" style="height: 1.43em; width: 1.98em; object-fit: contain; vertical-align: middle;">' 
      : team === 'red bull' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742786100/rb_x5pwuu.png" alt="Red Bull" style="height: 1.43em; width: 1.98em; object-fit: contain; vertical-align: middle;">' 
      : team === 'alpine' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742786254/imgbin_alpine-a110-sports-car-renault-png_upq6ni.png" alt="Alpine" style="height: 1.43em; width: 1.98em; object-fit: contain; vertical-align: middle;">'
      : team === 'astonmartin' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1745062238/am_pwkxij.png" alt="Aston Martin" style="height: 1.43em; width: 1.98em; object-fit: contain; vertical-align: middle;">'
      : team === 'alfaRomeo' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742786780/20210106191506_Alfa_Romeo_Racing__Logo_fly4r8.svg" alt="Alfa Romeo" style="height: 1.43em; width: 1.98em; object-fit: contain; vertical-align: middle;">'
      : team === 'toroRosso' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742786903/racing_bulls-logo_brandlogos.net_bjuef_ygq2em.png" alt="Toro Rosso" style="height: 1.43em; width: 1.98em; object-fit: contain; vertical-align: middle;">'
      : team === 'mclaren'
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1745062373/9807_McLaren_Logo_cqwdty.png" alt="McLaren" style="height: 1.43em; width: 1.98em; object-fit: contain; vertical-align: middle;">'
      : team;
    
    return `<span style="margin-left: -2px; display: inline-block; margin-right: 3px;">${teamName}</span> ${name.split(' ').map((part, index) => index > 0 ? `<strong>${part}</strong>` : `${part}`).join(' ')}`;
  })
  .style('border-left', ({team}) => {
    const color = team.split(' ').map((word, index) => index > 0 ? `${word[0].toUpperCase()}${word.slice(1)}` : `${word}`).join('');
    return `4px solid ${colors[color]}`;
  })
  .style('padding-left', '6px')
  .style('background-color', 'rgba(30, 30, 30, 0.3)')
  .attr('class', 'driver');

// gap desde el primer conductor
drivers
  .append('td')
  .attr('class', 'gap')
  .style('padding-left', '5px')
  .style('background-color', 'rgba(30, 30, 30, 0.3)')
  .append('span')
  .text(({gap}) => gap);