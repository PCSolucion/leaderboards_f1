# Instrucciones para Actualizar la Tabla de Líderes

Cuando recibas nuevos datos en crudo (formato: Posición, Nombre, Puntos Exp.), sigue estos pasos para actualizar `data.js`:

## 1. Procesamiento de Datos
*   **Puntos**: Divide el valor crudo por 1000 y redondea hacia abajo (ej. `654345` -> `654`).
*   **Nombres**: Normaliza a mayúsculas. Intenta coincidir con los nombres existentes en `data.js` para preservar la asignación de equipos. Si hay un nombre nuevo, asígnale un equipo por defecto o pregunta.
*   **Excepciones**: Si llega el nombre `C_H_A_N_D_A_L_F`, normalízalo siempre a `CHANDALF`.

## 2. Lógica de Actualización (`driversData`)
Para cada conductor en la nueva lista:
*   **`prevPoints`**: Establece este valor igual a los `points` que tenía el conductor en la versión *anterior* del archivo. Esto es crucial para el cálculo del "Icono Morado".
*   **`points`**: Establece este valor con los nuevos puntos procesados.
*   **`trend`**:
    *   `1`: **Igual** (Misma posición que antes).
    *   `2`: **Subió** (Mejor ranking) -> *Esto mostrará automáticamente el icono de flecha verde hacia arriba*.
    *   `3`: **Bajó** (Peor ranking) -> *Esto mostrará automáticamente el icono de flecha roja hacia abajo*.
*   **`team`**: Mantén el equipo original del conductor.

## 3. Icono de Vuelta Rápida (Icono Morado)
No necesitas añadir lógica extra para el icono. El archivo `script.js` calcula automáticamente quién tuvo el mayor incremento de puntos (`points - prevPoints`) y le asigna el icono. Solo asegúrate de que `prevPoints` sea correcto.

## Ejemplo de Prompt para la IA
"Toma estos nuevos datos, procesa los puntos (dividiendo por 1000), actualiza `data.js` manteniendo los equipos existentes. Asegúrate de poner los puntos anteriores en `prevPoints` para que se calcule el delta. Para el `trend`: usa 2 si subió de puesto (icono verde), 3 si bajó (icono rojo), y 1 si se mantiene."
