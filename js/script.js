/**
 * DriverService (Business Logic Layer)
 * Responsabilidad: Gestionar los datos, cálculos y reglas de negocio.
 */
class DriverService {
  constructor(data, config) {
    this.drivers = data;
    this.config = config;
  }

  getDrivers() {
    return this.drivers;
  }

  getTopDrivers(limit) {
    return this.drivers.slice(0, limit);
  }

  getLeaderPoints() {
    return this.drivers.length > 0 ? this.drivers[0].points : 0;
  }

  /**
   * Calcula el índice del conductor con mayor progreso (puntos actuales - puntos anteriores).
   * @returns {number} Índice del conductor o -1 si no hay ninguno.
   */
  calculateBestImproverIndex() {
    let maxDiff = -Infinity;
    let index = -1;
    const limit = Math.min(this.drivers.length, this.config.topLimit);

    for (let i = 0; i < limit; i++) {
      const driver = this.drivers[i];
      const diff = driver.points - driver.prevPoints;
      if (diff > maxDiff) {
        maxDiff = diff;
        index = i;
      }
    }
    return index;
  }
}

/**
 * TableRenderer (Presentation Layer)
 * Responsabilidad: Manipular el DOM y visualizar los datos usando D3.js.
 */
class TableRenderer {
  constructor(tableSelector, config) {
    this.tableSelector = tableSelector;
    this.config = config;
    this.main = d3.select(tableSelector);
  }

  initTable() {
    this.main
      .style('border-collapse', 'separate')
      .style('border-spacing', '0 6px');

    // Estilos de encabezado
    this.main.select('thead th:first-child')
      .style('padding-top', '10px')
      .style('margin-top', '-10px')
      .style('position', 'relative')
      .style('top', '-10px');

    this.main.select('tr:first-child td:first-child')
      .style('border-top-left-radius', '8px');
  }

  renderRows(drivers) {
    // En D3, el patrón enter/update/exit es clave. Aquí simplificamos asumiendo renderizado inicial.
    const rows = this.main.selectAll('tr.driver')
      .data(drivers)
      .enter()
      .append('tr')
      .attr('class', (d, i) => this._getRowClasses(d, i))
      .style('animation-delay', (d, i) => `${i * 0.1}s`);

    this._renderPositionColumn(rows);
    this._renderDriverColumn(rows);
    this._renderPointsColumn(rows);
  }

  _getRowClasses(d, i) {
    let classes = 'driver';
    if (i === 0) classes += ' rank-1';
    if (i === 1) classes += ' rank-2';
    if (i === 2) classes += ' rank-3';
    if (d.trend === 2) classes += ' hot-streak';
    return classes;
  }

  _renderPositionColumn(rows) {
    rows.append('td')
      .attr('class', 'position')
      .style('position', 'relative')
      .html((d, i) => this._getPositionHtml(d, i))
      .style('background-color', (d, i) => {
        if ((i + 1) === 1) return '#ff0000';
        if ((i + 1) >= 2 && (i + 1) <= 20) return 'rgba(30, 30, 30, 0.0)';
        return null;
      })
      .style('width', '22px')
      .style('min-width', '22px')
      .style('max-width', '22px')
      .style('font-size', '14px');
  }

  _getPositionHtml(d, i) {
    let positionImage = '';
    if ((i + 1) !== 1) {
      if (d.trend === 2) {
        positionImage = `<img class="up" src="${config.images.positionUp}" alt="Position Up">`;
      } else if (d.trend === 3) {
        positionImage = `<img class="down" src="${config.images.positionDown}" alt="Position Down">`;
      }
    }
    return `${positionImage}${i + 1}`;
  }

  _renderDriverColumn(rows) {
    rows.append('td')
      .html(({ name, team }) => {
        const teamInfo = config.teams[team] || { logo: '', width: '1.6em' };
        const teamLogoHtml = teamInfo.logo
          ? `<img src="${teamInfo.logo}" alt="${team}" style="height: 1.2em; width: ${teamInfo.width}; object-fit: contain; vertical-align: middle; margin-right: 3px;">`
          : '';

        const nombreFormateado = name.split(' ').map((part, index) => index > 0 ? `<strong>${part}</strong>` : `${part}`).join(' ');
        const fontSizeStyle = name.length > 11 ? 'font-size: 13px;' : '';

        return `<span style="margin-left: 7px; display: inline-block; margin-right: 0px;">${teamLogoHtml}</span><span class="driver-name" style="display: inline; ${fontSizeStyle}">${nombreFormateado}</span>`;
      })
      .style('border-left', ({ team }) => {
        const teamInfo = config.teams[team];
        return `4px solid ${teamInfo ? teamInfo.color : '#FFFFFF'}`;
      })
      .style('padding-left', '0px')
      .attr('class', 'driver');
  }

  _renderPointsColumn(rows) {
    rows.append('td')
      .attr('class', 'gap')
      .style('padding-left', '0px')
      .style('padding-right', '0px')
      .style('background-color', 'rgba(30, 30, 30, 0.0)')
      .append('span')
      .each(function (d) {
        const el = d3.select(this);
        el.transition()
          .duration(appConfig.transitionDuration)
          .ease(d3.easeCubicOut)
          .tween("text", function () {
            const i = d3.interpolateRound(0, d.points);
            return function (t) {
              this.textContent = `${i(t)} Exp.`;
            };
          });
      });
  }

  updateGapColumn(showInterval, leaderPoints) {
    const gapCells = d3.selectAll('td.gap span');

    gapCells.each(function (d, i) {
      const el = d3.select(this);
      if (showInterval) {
        if (i === 0) {
          el.text("LIDER");
        } else {
          const gap = leaderPoints - d.points;
          el.text(`+${gap}`);
        }
      } else {
        el.text(`${d.points} Exp.`);
      }
    });
  }

  removeHotStreakClasses() {
    d3.selectAll('.hot-streak').classed('hot-streak', false);
  }

  renderPurpleIcon(index) {
    const rows = document.querySelectorAll('tr.driver');
    const targetRow = rows[index];

    if (targetRow) {
      const gapCell = targetRow.querySelector('td.gap');
      if (gapCell) {
        const icon = document.createElement('img');
        icon.src = config.images.purpleIcon;
        icon.alt = 'Icono Morado';
        Object.assign(icon.style, this.config.purpleIconStyle);

        gapCell.style.position = 'relative';
        gapCell.appendChild(icon);
      }
    }
  }
}

/**
 * LeaderboardApp (Orchestrator)
 * Responsabilidad: Inicializar y coordinar el servicio y el renderizador.
 */
class LeaderboardApp {
  constructor(driverService, renderer, config) {
    this.driverService = driverService;
    this.renderer = renderer;
    this.config = config;
    this.showInterval = false;
  }

  init() {
    this.renderer.initTable();
    this.renderer.renderRows(this.driverService.getDrivers());
    this.applyPurpleIcon();
    this.startTimers();
  }

  applyPurpleIcon() {
    const bestImproverIndex = this.driverService.calculateBestImproverIndex();
    if (bestImproverIndex !== -1) {
      this.renderer.renderPurpleIcon(bestImproverIndex);
    }
  }

  startTimers() {
    // Intervalo para alternar entre Puntos y Gap
    setInterval(() => this.togglePointsInterval(), this.config.intervalTime);

    // Timeout para remover la clase hot-streak
    setTimeout(() => {
      this.renderer.removeHotStreakClasses();
    }, this.config.hotStreakDuration);
  }

  togglePointsInterval() {
    this.showInterval = !this.showInterval;
    const leaderPoints = this.driverService.getLeaderPoints();
    this.renderer.updateGapColumn(this.showInterval, leaderPoints);
  }
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  // Inyección de dependencias
  const driverService = new DriverService(driversData, appConfig);
  const renderer = new TableRenderer('table', appConfig);

  const app = new LeaderboardApp(driverService, renderer, appConfig);
  app.init();
});