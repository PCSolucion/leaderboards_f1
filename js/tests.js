/**
 * Tests Básicos para Utilidades
 * Ejecutar en la consola del navegador o con un test runner
 */

// Simple test framework
class SimpleTest {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(description, fn) {
        this.tests.push({ description, fn });
    }

    run() {
        console.log(`\n🧪 Running tests for: ${this.name}\n`);

        this.tests.forEach(({ description, fn }) => {
            try {
                fn();
                this.passed++;
                console.log(`✅ ${description}`);
            } catch (error) {
                this.failed++;
                console.error(`❌ ${description}`);
                console.error(`   Error: ${error.message}`);
            }
        });

        console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed\n`);
        return this.failed === 0;
    }
}

function assert(condition, message = 'Assertion failed') {
    if (!condition) {
        throw new Error(message);
    }
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

// Tests para UsernameHelper
const usernameTests = new SimpleTest('UsernameHelper');

usernameTests.test('normalize() convierte a minúsculas', () => {
    const result = UsernameHelper.normalize('TestUser');
    assertEquals(result, 'testuser');
});

usernameTests.test('normalize() maneja aliases correctamente', () => {
    const result = UsernameHelper.normalize('c_h_a_n_d_a_l_f');
    assertEquals(result, 'chandalf');
});

usernameTests.test('areEqual() compara usuarios correctamente', () => {
    assert(UsernameHelper.areEqual('TestUser', 'testuser'));
    assert(UsernameHelper.areEqual('c_h_a_n_d_a_l_f', 'Chandalf'));
});

// Tests para DOMHelper
const domTests = new SimpleTest('DOMHelper');

domTests.test('escapeHTML() previene XSS básico', () => {
    const malicious = '<script>alert("xss")</script>';
    const escaped = DOMHelper.escapeHTML(malicious);
    assert(!escaped.includes('<script>'), 'Scripts no deberían estar presentes');
});

domTests.test('escapeHTML() maneja strings vacíos', () => {
    assertEquals(DOMHelper.escapeHTML(''), '');
});

domTests.test('escapeHTML() maneja null/undefined', () => {
    assertEquals(DOMHelper.escapeHTML(null), '');
    assertEquals(DOMHelper.escapeHTML(undefined), '');
});

domTests.test('sanitizeHTML() remueve event handlers', () => {
    const malicious = '<div onclick="alert(1)">Test</div>';
    const sanitized = DOMHelper.sanitizeHTML(malicious);
    assert(!sanitized.includes('onclick'), 'Event handlers no deberían estar presentes');
});

// Tests para Logger
const loggerTests = new SimpleTest('Logger');

loggerTests.test('setLevel() acepta strings', () => {
    Logger.setLevel('DEBUG');
    assertEquals(Logger.currentLevel, Logger.LOG_LEVELS.DEBUG);
});

loggerTests.test('setLevel() acepta números', () => {
    Logger.setLevel(2);
    assertEquals(Logger.currentLevel, 2);
});

loggerTests.test('shouldLog() respeta el nivel configurado', () => {
    Logger.setLevel('WARN');
    assert(!Logger.shouldLog(Logger.LOG_LEVELS.DEBUG), 'DEBUG no debería loguearse con nivel WARN');
    assert(Logger.shouldLog(Logger.LOG_LEVELS.ERROR), 'ERROR debería loguearse con nivel WARN');
});

// Tests para EventEmitter
const eventTests = new SimpleTest('EventEmitter');

eventTests.test('on() registra eventos', () => {
    const emitter = new EventEmitter();
    let called = false;
    emitter.on('test', () => { called = true; });
    emitter.emit('test');
    assert(called, 'El callback debería haber sido llamado');
});

eventTests.test('off() remueve eventos', () => {
    const emitter = new EventEmitter();
    let count = 0;
    const callback = () => { count++; };
    emitter.on('test', callback);
    emitter.emit('test');
    emitter.off('test', callback);
    emitter.emit('test');
    assertEquals(count, 1, 'El callback solo debería ejecutarse una vez');
});

eventTests.test('once() ejecuta solo una vez', () => {
    const emitter = new EventEmitter();
    let count = 0;
    emitter.once('test', () => { count++; });
    emitter.emit('test');
    emitter.emit('test');
    assertEquals(count, 1, 'El callback solo debería ejecutarse una vez');
});

// Tests para PerformanceHelper
const perfTests = new SimpleTest('PerformanceHelper');

perfTests.test('debounce() existe y retorna función', () => {
    const debounced = PerformanceHelper.debounce(() => { }, 100);
    assertEquals(typeof debounced, 'function');
});

perfTests.test('throttle() existe y retorna función', () => {
    const throttled = PerformanceHelper.throttle(() => { }, 100);
    assertEquals(typeof throttled, 'function');
});

// Tests para RetryHelper
const retryTests = new SimpleTest('RetryHelper');

retryTests.test('withRetry() reintentar en caso de fallo (async)', async () => {
    let attempts = 0;
    const fn = async () => {
        attempts++;
        if (attempts < 3) throw new Error('Failed');
        return 'success';
    };

    const result = await RetryHelper.withRetry(fn, { maxRetries: 3, initialDelay: 10 });
    assertEquals(result, 'success');
    assert(attempts === 3, 'Debería haber reintentado 3 veces');
});

// Tests para UI_CONSTANTS
const constantsTests = new SimpleTest('UI_CONSTANTS');

constantsTests.test('Todas las constantes están definidas', () => {
    assert(UI_CONSTANTS.TTS_PAUSE_BETWEEN_MESSAGES_MS !== undefined);
    assert(UI_CONSTANTS.MUSIC_CHECK_INTERVAL_MS !== undefined);
    assert(UI_CONSTANTS.FIVE_MINUTES_MS !== undefined);
});

constantsTests.test('FIVE_MINUTES_MS es correcto', () => {
    assertEquals(UI_CONSTANTS.FIVE_MINUTES_MS, 5 * 60 * 1000);
});

// Función para ejecutar todos los tests
async function runAllTests() {
    console.clear();
    console.log('🧪 Ejecutando suite de tests...\n');

    const results = [];

    results.push(usernameTests.run());
    results.push(domTests.run());
    results.push(loggerTests.run());
    results.push(eventTests.run());
    results.push(perfTests.run());
    results.push(await retryTests.run());
    results.push(constantsTests.run());

    const allPassed = results.every(r => r === true);

    if (allPassed) {
        console.log('🎉 Todos los tests pasaron!');
    } else {
        console.log('❌ Algunos tests fallaron');
    }

    return allPassed;
}

// Exportar para uso en consola del navegador
if (typeof window !== 'undefined') {
    window.runTests = runAllTests;
    window.SimpleTest = SimpleTest;

    console.log('💡 Tests cargados. Ejecuta runTests() en la consola para correr todos los tests.');
}
