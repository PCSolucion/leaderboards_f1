# 🔍 Guía de Troubleshooting - Servidor de Música

## 🎯 Problema: El servidor no está recibiendo la canción y el artista

### 📝 Pasos de Diagnóstico

#### **1. Verificar que el servidor está corriendo**

```bash
cd server
npm start
```

Deberías ver algo como:
```
ℹ️ [INFO] Servidor Music Overlay escuchando en http://127.0.0.1:3000
ℹ️ [INFO]    - /current: Devuelve la canción actual
ℹ️ [INFO]    - /update (POST): Actualiza la canción (usado por la extensión)
```

#### **2. Activar modo DEBUG**

Edita `server/.env` (si no existe, crea uno basado en `.env.example`):

```env
DEBUG=true
```

Reinicia el servidor. Ahora verás logs detallados.

#### **3. Probar el servidor manualmente**

Abre en tu navegador:
```
file:///C:/Users/Unknown/Documents/Tabla de lideres/server/test-server.html
```

O navega a:
```
http://127.0.0.1:3000
```

Intenta enviar una canción de prueba usando los ejemplos rápidos.

#### **4. Verificar qué está enviando la extensión**

Con DEBUG=true, cuando la extensión envíe datos verás en el servidor:

```
🔍 [DEBUG] POST /update - Body recibido: {"artist":"...","song":"...","fullTitle":"..."}
🔍 [DEBUG] POST /update - Headers: {...}
```

Si no ves estos logs, **la extensión no está enviando datos**.

---

## 🔧 Soluciones Comunes

### ❌ Problema: "No se puede conectar al servidor"

**Síntomas:**
- El test-server.html muestra error rojo
- La integración de música marca errores consecutivos

**Soluciones:**
1. Verifica que el servidor está corriendo (`npm start`)
2. Verifica que el puerto 3000 esté libre:
   ```bash
   netstat -ano | findstr :3000
   ```
3. Verifica que no haya firewall bloqueando el puerto

---

### ❌ Problema: "Datos incompletos (artist, song, fullTitle)"

**Síntomas:**
- En los logs del servidor ves:
  ```
  ⚠️ [WARN] POST /update - Datos incompletos recibidos:
  ⚠️ [WARN]   - artist: MISSING
  ⚠️ [WARN]   - song: MISSING
  ```

**Soluciones:**
1. La extensión está enviando datos en formato incorrecto
2. Verifica el formato esperado:
   ```json
   {
     "artist": "Nombre del Artista",
     "song": "Nombre de la Canción",
     "fullTitle": "Artista - Canción (Info adicional)",
     "isPlaying": true,
     "url": "https://youtube.com/..."
   }
   ```
3. Si usas una extensión de terceros, verifica su configuración

---

### ❌ Problema: La extensión no envía datos

**Síntomas:**
- No aparecen logs en el servidor cuando se reproduce música
- El servidor solo muestra "Esperando música..."

**Posibles causas:**
1. **No tienes extensión instalada**
   - Necesitas una extensión de Chrome/Firefox que detecte YouTube Music
   - O necesitas crear/configurar una extensión personalizada

2. **La extensión está configurada con URL incorrecta**
   - La extensión debe enviar a: `http://127.0.0.1:3000/update`

3. **Problemas de CORS**
   - El servidor ya tiene CORS habilitado (`CORS_ORIGIN=*`)
   - Pero verifica en la consola del navegador si hay errores de CORS

---

### ❌ Problema: El cliente no detecta cambios de canción

**Síntomas:**
- El servidor recibe la canción correctamente
- Pero no aparece en el overlay de Twitch

**Soluciones:**

1. Verifica que `music_integration.js` esté cargado:
   ```javascript
   // En la consola del navegador del overlay
   console.log(window.musicService);
   ```

2. Verifica la configuración en `config_chat.js`:
   ```javascript
   MUSIC: {
       ENABLED: true,  // ← Debe ser true
       ENDPOINT: 'http://127.0.0.1:3000/current',
       CHECK_INTERVAL: 5000,
       // ...
   }
   ```

3. Verifica en la consola del navegador del overlay:
   ```
   🎮 [INFO] Iniciando servicio de integración de música...
   ```

---

## 🧪 Tests Manuales

### Test 1: Enviar datos con cURL

```bash
curl -X POST http://127.0.0.1:3000/update \
  -H "Content-Type: application/json" \
  -d "{\"artist\":\"Queen\",\"song\":\"Bohemian Rhapsody\",\"fullTitle\":\"Queen - Bohemian Rhapsody\"}"
```

**Esperado:** Deberías ver en el servidor:
```
ℹ️ [INFO] ✅ Música actualizada: Queen - Bohemian Rhapsody (Playing: false)
```

### Test 2: Verificar canción actual

```bash
curl http://127.0.0.1:3000/current
```

**Esperado:**
```json
{
  "artist": "Queen",
  "song": "Bohemian Rhapsody",
  "fullTitle": "Queen - Bohemian Rhapsody",
  "timestamp": 1702287600000,
  "isPlaying": false,
  "url": ""
}
```

### Test 3: Usar test-server.html

1. Abre `server/test-server.html` en tu navegador
2. Haz clic en uno de los ejemplos rápidos
3. Haz clic en "📤 Enviar al Servidor"
4. Deberías ver "✅ Canción enviada correctamente!"

---

## 📊 Checklist de Diagnóstico

Marca cada punto que hayas verificado:

- [ ] El servidor está corriendo (`npm start`)
- [ ] El puerto 3000 está libre
- [ ] DEBUG=true en `.env`
- [ ] test-server.html se conecta correctamente (verde)
- [ ] Puedo enviar canciones desde test-server.html
- [ ] El servidor muestra logs cuando envío datos
- [ ] La URL del endpoint es correcta (`http://127.0.0.1:3000/update`)
- [ ] MUSIC.ENABLED está en `true` en config_chat.js
- [ ] La consola del navegador no muestra errores de CORS

---

## 🆘 Si nada funciona

1. **Captura de pantalla de los logs del servidor** (con DEBUG=true)
2. **Captura de la consola del navegador** (F12 → Console)
3. **Verifica si tienes una extensión de YouTube Music instalada**

### Extensiones Recomendadas

Si no tienes extensión, necesitarás:
- **YouTube Music Desktop** (aplicación de escritorio)
- O crear una extensión personalizada que escuche YouTube y envíe datos al servidor

---

## 📝 Crear extensión simple (Opcional)

Si quieres crear tu propia extensión para enviar datos:

```javascript
// content-script.js
const videoElement = document.querySelector('video');
if (videoElement) {
    videoElement.addEventListener('play', () => {
        const titleElement = document.querySelector('h1.title');
        if (titleElement) {
            const fullTitle = titleElement.textContent;
            // Parsear título (implementar lógica)
            
            fetch('http://127.0.0.1:3000/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    artist: '...',
                    song: '...',
                    fullTitle: fullTitle,
                    isPlaying: true,
                    url: window.location.href
                })
            });
        }
    });
}
```

---

**Última actualización:** Diciembre 2025
