# 🎵 Configuración de Extensión de Música

## ⚠️ Problema Identificado

Tu extensión **DETECTA** la música ✅  
Pero **NO ENVÍA** al servidor ❌

---

## 🔧 Solución Rápida

La extensión necesita enviar datos a esta URL:

```
http://127.0.0.1:3000/update
```

Con este formato JSON:
```json
{
  "artist": "Nombre del Artista",
  "song": "Nombre de la Canción",
  "fullTitle": "Título completo del video",
  "isPlaying": true,
  "url": "https://youtube.com/watch?v=..."
}
```

---

## 📋 Extensiones Compatibles

### **1. Music Overlay Extension (Recomendada)**

Si tienes esta extensión:

1. Abre la extensión (clic en el icono)
2. Ve a **Settings** o **Configuración**
3. Busca **Server URL** o **Webhook URL**
4. Ingresa: `http://127.0.0.1:3000/update`
5. Guarda y recarga la página de YouTube

### **2. YouTube Music Scrobbler**

1. Clic derecho en la extensión → **Opciones**
2. Busca sección **External API** o **Webhook**
3. Habilita "Send to external server"
4. URL: `http://127.0.0.1:3000/update`
5. Método: `POST`
6. Format: `JSON`

### **3. Now Playing Extension**

1. Configuración de la extensión
2. **Integration** → **Custom endpoint**
3. Enable custom endpoint
4. URL: `http://127.0.0.1:3000/update`
5. Format template:
   ```json
   {
     "artist": "{artist}",
     "song": "{title}",
     "fullTitle": "{fullTitle}",
     "isPlaying": {isPlaying},
     "url": "{url}"
   }
   ```

---

## 🔍 Cómo Verificar que la Extensión Funciona

### Paso 1: Activa DEBUG en el servidor

Edita `server/.env`:
```env
DEBUG=true
```

### Paso 2: Reinicia el servidor

```bash
cd server
npm start
```

### Paso 3: Reproduce música en YouTube

1. Ve a YouTube Music o YouTube
2. Reproduce una canción
3. **Observa los logs del servidor**

### ✅ Si funciona, verás:
```
📨 POST /update - IP: ::1 - User-Agent: Mozilla/5.0...
   Body size: 234 bytes
🔍 [DEBUG] POST /update - Body recibido: {"artist":"Queen","song":"..."}
ℹ️ [INFO] ✅ Música actualizada: Queen - Bohemian Rhapsody
```

### ❌ Si NO funciona, verás:
```
(nada... silencio absoluto)
```

**Esto significa que la extensión NO está enviando datos.**

---

## 🛠️ Soluciones por Tipo de Extensión

### Tipo A: Extensión con Configuración de URL

**Síntomas:** Tiene un campo para ingresar URL/Webhook

**Solución:**
1. Abre opciones/settings de la extensión
2. Busca campos como:
   - Server URL
   - Webhook URL
   - API Endpoint
   - Custom endpoint
3. Ingresa: `http://127.0.0.1:3000/update`
4. Asegúrate de que esté **ENABLED/ACTIVE**

### Tipo B: Extensión SIN Configuración de Servidor

**Síntomas:** Solo muestra la música, no tiene opciones de servidor

**Problema:** Esta extensión NO está diseñada para enviar datos

**Solución:** Necesitas modificar la extensión o usar otra

---

## 🔨 Modificar la Extensión Manualmente

Si tu extensión NO tiene opción de configurar servidor, puedes modificarla:

### Paso 1: Encuentra el código de la extensión

1. Ve a: `chrome://extensions`
2. Activa "Modo de desarrollador"
3. Busca tu extensión de música
4. Clic en "Detalles"
5. Busca la ruta en "ID de extensión" o "Inspeccionar vistas"

### Paso 2: Localiza el archivo principal

Busca archivos como:
- `background.js`
- `content-script.js`
- `main.js`

### Paso 3: Agrega código para enviar al servidor

Busca donde detecta cambios de canción y agrega:

```javascript
// Cuando detecte nueva canción
function onSongChange(songData) {
    // Código existente...
    
    // AGREGAR ESTO:
    fetch('http://127.0.0.1:3000/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            artist: songData.artist,
            song: songData.title,
            fullTitle: songData.fullTitle || `${songData.artist} - ${songData.title}`,
            isPlaying: true,
            url: window.location.href
        })
    })
    .then(response => response.json())
    .then(data => console.log('✅ Enviado al servidor:', data))
    .catch(error => console.error('❌ Error enviando:', error));
}
```

### Paso 4: Recarga la extensión

1. Ve a `chrome://extensions`
2. Clic en el botón de recarga (🔄) de tu extensión
3. Prueba reproducir música nuevamente

---

## 📱 Aplicaciones de Escritorio

Si prefieres no modificar extensiones, usa aplicaciones:

### **YouTube Music Desktop App**

1. Descarga: [GitHub - ytmdesktop](https://github.com/ytmdesktop/ytmdesktop)
2. Instala la aplicación
3. En Settings → Integrations
4. Habilita "Companion Server"
5. Custom endpoint: `http://127.0.0.1:3000/update`

---

## 🧪 Test de Conexión

### Prueba Manual desde la Consola del Navegador

Con YouTube abierto, abre la consola (F12) y ejecuta:

```javascript
fetch('http://127.0.0.1:3000/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        artist: 'TEST ARTIST',
        song: 'TEST SONG',
        fullTitle: 'TEST ARTIST - TEST SONG',
        isPlaying: true,
        url: window.location.href
    })
})
.then(r => r.json())
.then(d => console.log('✅ Respuesta:', d))
.catch(e => console.error('❌ Error:', e));
```

Si ves:
- ✅ `{success: true, ...}` → El servidor funciona
- ❌ `Network error` → Problemas de conexión/CORS

---

## 🚨 Problemas Comunes

### Error: CORS Policy

**Mensaje:**
```
Access to fetch at 'http://127.0.0.1:3000/update' from origin 'https://music.youtube.com' 
has been blocked by CORS policy
```

**Solución:**
El servidor ya tiene CORS habilitado, pero verifica:

1. `server/.env`:
   ```env
   CORS_ORIGIN=*
   ```

2. Si persiste, puede ser que necesites una extensión especial para CORS

### Error: Failed to fetch

**Causa:** El servidor no está corriendo

**Solución:**
```bash
cd server
npm start
```

---

## 📞 Necesitas Ayuda Específica

Si aún no funciona, necesito saber:

1. **¿Qué extensión estás usando?** (Nombre exacto)
2. **¿La extensión tiene opciones/settings?**
3. **¿Qué ves en los logs del servidor?** (con DEBUG=true)
4. **¿Qué ves en la consola del navegador?** (F12 → Console)

---

**Actualizado:** Diciembre 2025
