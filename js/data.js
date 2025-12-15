// Configuración de recursos (Imágenes, Iconos)
const config = {
    images: {
        logo: "./assets/logo.png",
        positionUp: "./assets/position_up.png",
        positionDown: "./assets/position_down.png",
        purpleIcon: "./assets/purple_icon.jpg"
    },
    teams: {
        mercedes: {
            color: '#00D2BE',
            logo: './assets/teams/mercedes.png',
            width: '1.6em'
        },
        ferrari: {
            color: '#DC0000',
            logo: './assets/teams/ferrari.png',
            width: '1.6em'
        },
        redBull: { // Normalizado a camelCase para coincidir con claves de objeto, aunque el string original era 'red bull'
            id: 'red bull',
            color: '#1E41FF',
            logo: './assets/teams/redbull.png',
            width: '1.6em'
        },
        alpine: {
            color: '#0078c1',
            logo: './assets/teams/alpine.png',
            width: '1.6em'
        },
        astonmartin: {
            color: '#229971',
            logo: './assets/teams/astonmartin.png',
            width: '1.6em'
        },
        alfaRomeo: {
            color: '#9B0000',
            logo: './assets/teams/alfaromeo.svg',
            width: '1.6em'
        },
        toroRosso: {
            color: '#2325cf',
            logo: './assets/teams/racingbulls.png',
            width: '1.6em'
        },
        haas: {
            color: '#BD9E57',
            logo: './assets/teams/haas.png',
            width: '1.6em'
        },
        mclaren: {
            color: '#FF8700',
            logo: './assets/teams/mclaren.png',
            width: '1.6em'
        },
        williams: {
            color: '#FFFFFF',
            logo: './assets/teams/williams.png',
            width: '1.5em'
        }
    }
};

// Configuración de la aplicación
const appConfig = {
    intervalTime: 10000, // Tiempo entre cambios de modo (Puntos/Gap)
    hotStreakDuration: 6000, // Duración de la animación de racha
    transitionDuration: 1500, // Duración de la animación de números
    topLimit: 15, // Límite para calcular el mejor progreso
    purpleIconStyle: {
        height: '31px',
        marginLeft: '0px',
        verticalAlign: 'middle',
        position: 'absolute',
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: '9999',
        display: 'block',
        width: '31px'
    },

};

// Datos unificados de los conductores
// trend: 1 = igual, 2 = subió (verde), 3 = bajó (rojo)
const driversData = [
    { name: 'TAKERU_XIII', team: 'mercedes', points: 689, prevPoints: 682, trend: 1 },
    { name: 'JAMES_193', team: 'mercedes', points: 660, prevPoints: 656, trend: 1 },
    { name: 'RACTOR09', team: 'mclaren', points: 568, prevPoints: 564, trend: 1 },
    { name: 'XROOCKK', team: 'toroRosso', points: 459, prevPoints: 455, trend: 1 },
    { name: 'BROXA24', team: 'ferrari', points: 418, prevPoints: 417, trend: 1 },
    { name: 'CHANDALF', team: 'alpine', points: 416, prevPoints: 416, trend: 1 },
    { name: 'X1LENZ', team: 'redBull', points: 415, prevPoints: 415, trend: 1 },
    { name: 'DARKOUS666', team: 'ferrari', points: 392, prevPoints: 392, trend: 1 },
    { name: 'MANGUERAZO', team: 'redBull', points: 387, prevPoints: 387, trend: 1 },
    { name: 'CCXSNOP', team: 'mclaren', points: 366, prevPoints: 366, trend: 1 },
    { name: 'MACUSAM', team: 'astonmartin', points: 352, prevPoints: 352, trend: 1 },
    { name: 'URIMAS82', team: 'astonmartin', points: 350, prevPoints: 349, trend: 1 },
    { name: 'NANUSSO', team: 'toroRosso', points: 289, prevPoints: 288, trend: 1 },
    { name: 'MAMBIITV', team: 'alpine', points: 260, prevPoints: 257, trend: 2 },
    { name: 'BITTERBITZ', team: 'williams', points: 259, prevPoints: 258, trend: 3 }
];
