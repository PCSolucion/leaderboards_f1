# 🔧 Guía Rápida - Recargar la Extensión

## ✅ Cambios Realizados

He mejorado `browser-extension/content.js` para:
- ✅ Asegurar que los datos se envíen en el formato correcto
- ✅ Mejor logging para ver exactamente qué se envía
- ✅ Manejo de errores más detallado

---

## 🚀 Pasos para Aplicar los Cambios

### 1. Recarga la Extensión en Chrome

1. **Abre Chrome** y ve a:
   ```
   chrome://extensions
   ```

2. **Activa "Modo de desarrollador"** (esquina superior derecha)

3. **Busca** "YouTube Music Tracker for OBS"

4. **Haz clic en el botón de recarga** 🔄 (icono circular)

5. Verás un mensaje: "Extensión recargada"

---

### 2. Reinicia el Servidor con DEBUG

```bash
cd server

# Asegúrate que .env tenga DEBUG=true
# Luego:
npm start
```

Deberías ver:
```
ℹ️ [INFO] Servidor Music Overlay escuchando en http://127.0.0.1:3000
ℹ️ [INFO]    - Modo: DEBUG
```

---

### 3. Prueba con YouTube

1. **Abre YouTube Music** o **YouTube** normal

2. **Reproduce una canción**

3. **Abre la Consola del navegador** (F12 → Console)

4. **Busca estos mensajes**:
   ```
   📤 Enviando al servidor: {artist: "Queen", song: "Bohemian Rhapsody", ...}
   ✅ Enviado al servidor local correctamente
   ```

5. **En el servidor** deberías ver:
   ```
   📨 POST /update - IP: ::1 - User-Agent: Mozilla/5.0...
   🔍 [DEBUG] POST /update - Body recibido: {"artist":"Queen",...}
   ℹ️ [INFO] ✅ Música actualizada: Queen - Bohemian Rhapsody (Playing: true)
   ```

---

## 🔍 Qué Buscar

### En la Consola del Navegador (YouTube)

✅ **Bueno:**
```
🎵 YouTube Music Tracker Extension - Content Script loaded
📤 Enviando al servidor: {artist: "...", song: "...", fullTitle: "..."}
✅ Enviado al servidor local correctamente
```

❌ **Malo:**
```
⚠️ No se pudo conectar con el servidor local
   Verifica que el servidor esté corriendo: cd server && npm start
```

### En el Servidor (Terminal)

✅ **Bueno:**
```
📨 POST /update - IP: ::1 - User-Agent: Mozilla/5.0...
   Body size: 245 bytes
🔍 [DEBUG] POST /update - Body recibido: {"artist":"Queen","song":"Bohemian Rhapsody",...}
ℹ️ [INFO] ✅ Música actualizada: Queen - Bohemian Rhapsody (Playing: true)
```

❌ **Malo:**
```
(silencio... no aparece nada)
```

---

## 🐛 Si No Funciona

### Problema: La extensión no se recarga

**Solución:**
1. Desinstala la extensión
2. Vuelve a cargar la carpeta:
   - Clic en "Cargar extensión sin empaquetar"
   - Selecciona la carpeta: `Tabla de lideres\browser-extension`

### Problema: La consola muestra errores de CORS

**Solución:**
Esto es normal y el servidor ya maneja CORS. Pero verifica:

1. El servidor debe mostrar el log de la petición
2. Si no aparece NADA en el servidor → la extensión no está enviando

### Problema: "Servidor local no disponible"

**Solución:**
1. Verifica que el servidor esté corriendo: `npm start`
2. Verifica que sea puerto 3000: `netstat -ano | findstr :3000`
3. El servidor debe estar en `http://127.0.0.1:3000` (NO localhost)

---

## 📊 Checklist Final

Antes de decir que no funciona, verifica:

- [ ] Extensión recargada en chrome://extensions
- [ ] Servidor corriendo con `npm start`
- [ ] DEBUG=true en server/.env
- [ ] YouTube Music o YouTube abierto
- [ ] Canción reproduciéndose
- [ ] Consola del navegador abierta (F12)
- [ ] Terminal del servidor visible

---

## ✨ Después de que Funcione

Una vez que veas en el servidor:
```
ℹ️ [INFO] ✅ Música actualizada: [Artista] - [Canción]
```

Ahora verifica que el overlay de Twitch también lo reciba:

1. Abre `index.html` en OBS o navegador
2. En la consola deberías ver:
   ```
   🎮 [INFO] Nueva canción detectada: 🎶 Escuchando ahora: [Artista] - [Canción]
   ```

---

**¡Recuerda recargar la extensión después de cualquier cambio!** 🔄
