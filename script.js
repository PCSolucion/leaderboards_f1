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
    gap: '+542',
    posicion: 1
  },
  {
    name: 'TAKERU_XIII',
    team: 'mercedes',
    gap: '+456',
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
    gap: '+387',
    posicion: 1
  },
  {
    name: 'BROXA24',
    team: 'ferrari',
    gap: '+373',
    posicion: 1
  },
  {
    name: 'MANGUERAZO',
    team: 'red bull',
    gap: '+332',
    posicion: 1
  },
  {
    name: 'RACTOR09',
    team: 'alpine',
    gap: '+317',
    posicion: 2
  }, 
  {
    name: 'MACUSAM',
    team: 'astonmartin',
    gap: '+316',
    posicion: 3
  },
  {
    name: 'CCXSNOP',
    team: 'alfaRomeo',
    gap: '+295',
    posicion: 1
  },
  {
    name: 'XROOCKK',
    team: 'toroRosso',
    gap: '+279',
    posicion: 1
  },
  {
    name: 'Romain Grosjean',
    team: 'haas',
    gap: '+1 lap',
    posicion: 1
  },
  {
    name: 'Lance Stroll',
    team: 'racing point',
    gap: '+1 lap',
    posicion: 1
  },
  {
    name: 'Kevin Magnussen',
    team: 'haas',
    gap: '+1 lap',
    posicion: 1
  },
  {
    name: 'Carlos Sainz',
    team: 'mclaren',
    gap: '+1 lap',
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
  .select('table');

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
      ? '<img class="down" src="https://res.cloudinary.com/pcsolucion/image/upload/v1743585029/Position_Down_jjm0ha.png" alt="Position Down" style="height: 1em; vertical-align: middle; display: block; margin-bottom: 2px;">'
      : '';
    return `${positionImage}${i + 1}`;
  });

// nombre seguido del equipo
drivers
  .append('td')
  .html(({name, team}) => {
    // Verificar si el equipo es Mercedes y mostrar la imagen
    const teamName = team === 'mercedes' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742785431/Mercedes-Logo.svg_obpxws.png" alt="Mercedes" style="height: 1em; vertical-align: middle;">' 
      : team === 'ferrari' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742785952/Ferrari-Logo_l17w2e.png" alt="Ferrari" style="height: 1em; vertical-align: middle;">' 
      : team === 'red bull' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742786100/rb_x5pwuu.png" alt="Red Bull" style="height: 1em; vertical-align: middle;">' 
      : team === 'alpine' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742786254/imgbin_alpine-a110-sports-car-renault-png_upq6ni.png" alt="Alpine" style="height: 1em; vertical-align: middle;">'
      : team === 'astonmartin' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742786664/am_wuvn6v.png" alt="Aston Martin" style="height: 1em; vertical-align: middle;">'
      : team === 'alfaRomeo' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742786780/20210106191506_Alfa_Romeo_Racing__Logo_fly4r8.svg" alt="Alfa Romeo" style="height: 1em; vertical-align: middle;">'
      : team === 'toroRosso' 
      ? '<img src="https://res.cloudinary.com/pcsolucion/image/upload/v1742786903/racing_bulls-logo_brandlogos.net_bjuef_ygq2em.png" alt="Toro Rosso" style="height: 1em; vertical-align: middle;">'
      : team;
    
    return `${name.split(' ').map((part, index) => index > 0 ? `<strong>${part}</strong>` : `${part}`).join(' ')} <span>${teamName}</span>`;
  })
  .style('border-left', ({team}) => {
    const color = team.split(' ').map((word, index) => index > 0 ? `${word[0].toUpperCase()}${word.slice(1)}` : `${word}`).join('');
    return `4px solid ${colors[color]}`;
  })
  .attr('class', 'driver');

// gap desde el primer conductor
drivers
  .append('td')
  .attr('class', 'gap')
  .append('span')
  .text(({gap}) => gap);