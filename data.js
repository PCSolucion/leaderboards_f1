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
            color: '#0b1d2e',
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

// Datos unificados de los conductores
// trend: 1 = igual, 2 = subió (verde), 3 = bajó (rojo)
const driversData = [
    { name: 'TAKERU_XIII', team: 'mercedes', points: 640, prevPoints: 627, trend: 2 },
    { name: 'JAMES_193', team: 'mercedes', points: 636, prevPoints: 631, trend: 3 },
    { name: 'RACTOR09', team: 'mclaren', points: 545, prevPoints: 504, trend: 1 },
    { name: 'XROOCKK', team: 'toroRosso', points: 438, prevPoints: 414, trend: 1 },
    { name: 'BROXA24', team: 'ferrari', points: 416, prevPoints: 412, trend: 1 },
    { name: 'X1LENZ', team: 'redBull', points: 414, prevPoints: 407, trend: 1 },
    { name: 'DARKOUS666', team: 'ferrari', points: 392, prevPoints: 392, trend: 1 },
    { name: 'CHANDALF', team: 'alpine', points: 383, prevPoints: 376, trend: 1 }, // Nombre normalizado
    { name: 'MANGUERAZO', team: 'redBull', points: 383, prevPoints: 375, trend: 1 },
    { name: 'CCXSNOP', team: 'mclaren', points: 362, prevPoints: 355, trend: 1 },
    { name: 'MACUSAM', team: 'astonmartin', points: 348, prevPoints: 343, trend: 1 },
    { name: 'URIMAS82', team: 'astonmartin', points: 346, prevPoints: 327, trend: 1 },
    { name: 'NANUSSO', team: 'toroRosso', points: 279, prevPoints: 267, trend: 1 },
    { name: 'BITTERBITZ', team: 'williams', points: 253, prevPoints: 208, trend: 2 },
    { name: 'REICHSKANZ', team: 'alpine', points: 249, prevPoints: 237, trend: 3 },
    { name: 'YISUS86', team: 'williams', points: 240, prevPoints: 0, trend: 2 },
    { name: 'TONYFORYU', team: 'williams', points: 238, prevPoints: 237, trend: 3 },
    { name: 'MAMBIITV', team: 'alfaRomeo', points: 234, prevPoints: 206, trend: 1 },
    { name: 'EMMA1403', team: 'alfaRomeo', points: 205, prevPoints: 191, trend: 1 },
    { name: 'FABIRULES', team: 'haas', points: 198, prevPoints: 0, trend: 2 },
    { name: 'PANICSHOW_12', team: 'haas', points: 195, prevPoints: 193, trend: 3 },
    { name: 'IFLEKY', team: 'haas', points: 186, prevPoints: 167, trend: 3 }
];
