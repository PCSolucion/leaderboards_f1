// Configuración de recursos (Imágenes, Iconos)
const config = {
    images: {
        logo: "https://res.cloudinary.com/pcsolucion/image/upload/v1755425728/liukin_png_tone_2_skv4ba.png",
        positionUp: "https://res.cloudinary.com/pcsolucion/image/upload/v1743585029/Position_Up_gbv0y4.png",
        positionDown: "https://res.cloudinary.com/pcsolucion/image/upload/v1743585029/Position_Down_jjm0ha.png",
        purpleIcon: "https://res.cloudinary.com/pcsolucion/image/upload/v1752070038/Screenshot_1_wespu3.jpg"
    },
    teams: {
        mercedes: {
            color: '#00D2BE',
            logo: 'https://res.cloudinary.com/pcsolucion/image/upload/v1742785431/Mercedes-Logo.svg_obpxws.png',
            width: '1.6em'
        },
        ferrari: {
            color: '#DC0000',
            logo: 'https://res.cloudinary.com/pcsolucion/image/upload/v1742785952/Ferrari-Logo_l17w2e.png',
            width: '1.6em'
        },
        redBull: { // Normalizado a camelCase para coincidir con claves de objeto, aunque el string original era 'red bull'
            id: 'red bull',
            color: '#1E41FF',
            logo: 'https://res.cloudinary.com/pcsolucion/image/upload/v1742786100/rb_x5pwuu.png',
            width: '1.6em'
        },
        alpine: {
            color: '#0078c1',
            logo: 'https://res.cloudinary.com/pcsolucion/image/upload/v1742786254/imgbin_alpine-a110-sports-car-renault-png_upq6ni.png',
            width: '1.6em'
        },
        astonmartin: {
            color: '#229971',
            logo: 'https://res.cloudinary.com/pcsolucion/image/upload/v1745062238/am_pwkxij.png',
            width: '1.6em'
        },
        alfaRomeo: {
            color: '#9B0000',
            logo: 'https://res.cloudinary.com/pcsolucion/image/upload/v1742786780/20210106191506_Alfa_Romeo_Racing__Logo_fly4r8.svg',
            width: '1.6em'
        },
        toroRosso: {
            color: '#2325cf',
            logo: 'https://res.cloudinary.com/pcsolucion/image/upload/v1742786903/racing_bulls-logo_brandlogos.net_bjuef_ygq2em.png',
            width: '1.6em'
        },
        haas: {
            color: '#BD9E57',
            logo: 'https://res.cloudinary.com/pcsolucion/image/upload/v1745828985/Logo_Haas_F1_vekjlj.png',
            width: '1.6em'
        },
        mclaren: {
            color: '#FF8700',
            logo: 'https://res.cloudinary.com/pcsolucion/image/upload/v1745062373/9807_McLaren_Logo_cqwdty.png',
            width: '1.6em'
        },
        williams: {
            color: '#FFFFFF',
            logo: 'https://res.cloudinary.com/pcsolucion/image/upload/v1745829856/clipart3162470_uki0pk.png',
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
        transform: 'translateY(-50%)'
    },

};

// Datos unificados de los conductores
// trend: 1 = igual, 2 = subió (verde), 3 = bajó (rojo)
const driversData = [
    { name: 'TAKERU_XIII', team: 'mercedes', points: 682, prevPoints: 666, trend: 1 },
    { name: 'JAMES_193', team: 'mercedes', points: 656, prevPoints: 646, trend: 1 },
    { name: 'RACTOR09', team: 'mclaren', points: 564, prevPoints: 559, trend: 1 },
    { name: 'XROOCKK', team: 'toroRosso', points: 455, prevPoints: 449, trend: 1 },
    { name: 'BROXA24', team: 'ferrari', points: 417, prevPoints: 417, trend: 1 },
    { name: 'CHANDALF', team: 'alpine', points: 416, prevPoints: 396, trend: 2 },
    { name: 'X1LENZ', team: 'redBull', points: 415, prevPoints: 415, trend: 3 },
    { name: 'DARKOUS666', team: 'ferrari', points: 392, prevPoints: 392, trend: 1 },
    { name: 'MANGUERAZO', team: 'redBull', points: 387, prevPoints: 385, trend: 1 },
    { name: 'CCXSNOP', team: 'mclaren', points: 366, prevPoints: 365, trend: 1 },
    { name: 'MACUSAM', team: 'astonmartin', points: 352, prevPoints: 351, trend: 1 },
    { name: 'URIMAS82', team: 'astonmartin', points: 349, prevPoints: 348, trend: 1 },
    { name: 'NANUSSO', team: 'toroRosso', points: 288, prevPoints: 284, trend: 1 },
    { name: 'BITTERBITZ', team: 'williams', points: 258, prevPoints: 258, trend: 1 },
    { name: 'MAMBIITV', team: 'alfaRomeo', points: 257, prevPoints: 248, trend: 2 }
];
