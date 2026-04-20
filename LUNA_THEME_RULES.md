# 🌑 LUNA PREMIUM THEME RULES (V10.0)

Este es el documento constitucional para el tema Luna Premium. Estas reglas DEBEN seguirse para mantener el aislamiento y la estética industrial premium.

## 1. 🎨 Tipografía y Color
- **Color Primario**: Blanco Puro sólido (`#ffffff`) para todo el texto.
- **Caso (Casing)**: Estricto **lowercase** (minúsculas) en TODA la interfaz.
- **Grosor**: Todas las etiquetas usan **`font-[300]`**.
- **Fuente**: `Saira` (Google Fonts).

## 2. 🧱 Layout y Geometría
- **Dashboard**: Una única fila de **4 Columnas** (`lg:grid-cols-4`).
- **Cajas**: Solo se permiten 4 cajas maestras: `asistencia semanal`, `asistencia anual`, `node registry` y `active density`.
- **Minimalismo**: ELIMINADOS los textos de `logo`, `branding`, `administrator` o `status`. Solo iconos.
- **Bordes**: Todas las barras y botones deben ser **`rounded-full`** (cápsulas).

## 3. 📊 Componentes Específicos

### **Donas (LunaDonut)**
- **Estilo**: Grosor táctico, colores con gradientes técnicos.
- **Spacing**: Gaps técnicos entre segmentos si es posible.
- **Alineación**: Centrado en su caja.

### **Barras (Asistencia Semanal)**
- **Forma**: Cápsulas delgadas (`w-3`) con puntas redondeadas.
- **Etiquetas**: 2 caracteres (`lu`, `ma`...) en minúsculas y `font-300`.

### **Curva Anual (Trend)**
- **Grosor**: Línea de neón amarilla con `strokeWidth="5"`.
- **Glow**: Brillo suave (`stdDeviation="2.5"`).
- **Indicadores**: Puntos blancos sólidos sobre cada mes.

## 4. 🛡️ Aislamiento Táctico
- Este archivo es la ÚNICA referencia de estilo para Luna Premium.
- Evitar clases de Tailwind que no cumplan con el grosor 300 o el redondeo total.

## 5. ☁️ Sincronización de Nube (Admin vs Display)
- **Principio de Aislamiento de Display**: La terminal pública (Display) es CIEGA. Bajo ninguna circunstancia el display debe extraer la hora local o la ubicación local del dispositivo (TV, Chromecast) donde se abra.
- **Dictadura del Administrador**: El reloj y el clima deben obedecer al 100% las coordenadas (`settings.weatherLat`/`Lng`) y el Timezone configurado en Supabase a través del panel Administrativo.
- **Jerarquía Climatológica**:
    1. Icono Gigante: **Termómetro** (Nunca de clima). Indica que el número principal es la temperatura térmica general.
    2. Temperatura: Tamaño mediano-grande (ej. `6xl`), limpio, con su símbolo de grado `°` estético pegado al número.
    3. Icono Secundario de Estado y Humedad: El icono tradicional de clima (nube/sol) se relega al nivel del texto auxiliar en la parte baja junto con la humedad y las gotas, reduciendo su escala y eliminando fondos (diseño flotante libre).

---
*V10.1: Cero fallbacks al dispositivo local; Cloud Master Protocol.*
