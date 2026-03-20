# 🌑 LUNA PREMIUM: REGLAS MAESTRAS DE DISEÑO INDUSTRIAL

Este documento es la única fuente de verdad para el tema visual del dashboard administrativo. Cualquier cambio futuro debe respetar estas leyes de hierro para mantener la estética premium y monocromática.

## 1. Tipografía y Color (Ley del Blanco Puro)
- **Texto**: Todo el texto debe ser **blanco puro sólido (`#ffffff`)**. Queda prohibido el uso de opacidades (0.5, 0.7) en el texto principal.
- **Caso (Casing)**: Todo se escribe en **minúsculas (`lowercase`)**. Esto incluye títulos de secciones, nombres de botones, estados de nodos y el sidebar.
- **Peso de Fuente (`Font Weight`)**: Todo el texto blanco debe tener un grosor de **`300`** (`font-[300]`). Se descarta el peso ultraligero (100) en favor de mayor nitidez industrial.
- **Fuente**: `Saira` (Google Fonts).

## 2. Componentes de Asistencia (Métricas Críticas)

### **Asistencia Semanal**
- **Título**: `asistencia semanal`.
- **Barras**: Formato cápsula delgada (`w-3`) con puntas totalmente redondeadas (`rounded-full`).
- **Resplandor (`Glow`)**: Sombras de neón reducidas a **`6px`** o **`8px`** (`shadow-[0_0_6px_...]`) para un look técnico y sobrio.
- **Etiquetas**: Días de **2 caracteres** (`lu`, `ma`, `mi`, `ju`, `vi`, `sa`, `do`) posicionados justo bajo la barra (`gap-3`).

### **Asistencia Anual**
- **Título**: `asistencia anual`.
- **Eje Y**: 5 divisiones tácticas (**0, 25, 50, 75, 100**) en blanco puro (`font-300`).
- **Eje X (Meses)**: 12 meses en formato de 2 caracteres (`en`, `fe`, `ma`, `ab`, `my`, `jn`, `jl`, `ag`, `se`, `oc`, `no`, `di`) con un **puntito táctico blanco** (`w-1 h-1`) sobre cada etiqueta.
- **Gráfica**: Curva de neón amarilla gruesa (**`strokeWidth="5"`**) con brillo suavizado (**`feGaussianBlur stdDeviation="2.5"`**).

## 3. Geometría de Componentes (LunaDonut)
- **Círculos**: El trayecto de fondo (track) debe ser el color sagrado **`#525469`**.
- **Métrica**: Valor central en blanco puro (`font-300`).
- **Legibilidad**: Los títulos de estos componentes deben ir alineados a la **IZQUIERDA**.

## 4. Botones e Indicadores (Píldoras Tácticas)
- **Bordes**: Todo botón, badge o indicador de estado debe ser **`rounded-full`** (forma de píldora). Se eliminan los cuadros con aristas rectas.
- **Status Dots**: Puntos esmeralda con resplandor contenido (`6px`) y pulso suave.

## 5. Layout y Fondos
- **Cajas**: Degradado diagonal de `#2b2e41` (superior derecha) a `#1b1d2c` (inferior izquierda).
- **Separación**: Espaciado generoso (`p-12`) para que la interfaz respire con aire premium.
- **Header**: Selector de semana (`13 mar - 19 mar`) y botones de acción (`poblar semana`) en la derecha, título en la izquierda.

---
*Cualquier desviación de estas reglas romperá la integridad estética del sistema LUNA.*
