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
    { name: 'TAKERU_XIII', team: 'mercedes', points: 750, prevPoints: 705, trend: 1 },
    { name: 'JAMES_193', team: 'mercedes', points: 673, prevPoints: 664, trend: 1 },
    { name: 'RACTOR09', team: 'mclaren', points: 604, prevPoints: 579, trend: 1 },
    { name: 'XROOCKK', team: 'toroRosso', points: 460, prevPoints: 460, trend: 1 },
    { name: 'X1LENZ', team: 'redBull', points: 427, prevPoints: 416, trend: 2 },
    { name: 'CHANDALF', team: 'alpine', points: 421, prevPoints: 417, trend: 2 },
    { name: 'BROXA24', team: 'ferrari', points: 420, prevPoints: 418, trend: 3 },
    { name: 'MANGUERAZO', team: 'redBull', points: 394, prevPoints: 390, trend: 2 },
    { name: 'DARKOUS666', team: 'ferrari', points: 392, prevPoints: 392, trend: 3 },
    { name: 'CCXSNOP', team: 'mclaren', points: 366, prevPoints: 366, trend: 1 },
    { name: 'URIMAS82', team: 'astonmartin', points: 355, prevPoints: 352, trend: 2 },
    { name: 'MACUSAM', team: 'astonmartin', points: 355, prevPoints: 353, trend: 3 },
    { name: 'NANUSSO', team: 'toroRosso', points: 289, prevPoints: 289, trend: 1 },
    { name: 'REICHSKANZ', team: 'alpine', points: 278, prevPoints: 264, trend: 1 },
    { name: 'MAMBIITV', team: 'williams', points: 276, prevPoints: 276, trend: 2 }
];
