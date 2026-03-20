# 🌑 LUNA PREMIUM: REGLAS MAESTRAS DE DISEÑO INDUSTRIAL (V5.0)

Este documento centraliza las leyes visuales sagradas para el tema Luna Premium. Estas reglas aseguran el aislamiento total de la identidad visual de este tema frente a cualquier otro del proyecto.

## 1. Tipografía y Color (Ley del Blanco Puro)
- **Texto Crítico**: Todo el texto debe ser **blanco puro sólido (#ffffff)** al 100% de opacidad.
- **Caso (Casing)**: Estricto uso de **minúsculas (lowercase)** en toda la interfaz (títulos, etiquetas, botones, sidebar). NO usar mayúsculas.
- **Peso de Fuente (Weight)**: El grosor estándar para todo el texto blanco es **`300`** (`font-[300]`). Esto garantiza la legibilidad necesaria sin perder la elegancia industrial.
- **Fuente**: `var(--font-saira)` (Saira).

## 2. Componentes de Asistencia (Arquitectura de Datos)

### **Asistencia Semanal (Density Matrix)**
- **Título**: `asistencia semanal`.
- **Estilo**: Barras delgadas (`w-3`) en forma de cápsula con **puntas redondeadas (`rounded-full`)**.
- **Resplandor (Glow)**: Atenuado a un máximo de **`6px` o `8px`** en sombras para un look técnico sobrio.
- **Etiquetas**: Días en **2 caracteres** (`lu`, `ma`, `mi`, `ju`, `vi`, `sa`, `do`) posicionados con `gap-3` debajo de las barras.

### **Asistencia Anual (Yearly Trend)**
- **Título**: `asistencia anual`.
- **Eje Y**: 5 divisiones tácticas (**0, 25, 50, 75, 100**) en blanco puro (`font-300`).
- **Eje X (Meses)**: 12 meses en formato de 2 caracteres (`en`, `fe`, `ma`, `ab`, `my`, `jn`, `jl`, `ag`, `se`, `oc`, `no`, `di`) con un **puntito táctico blanco sólido (`w-1 h-1`)** centrado sobre cada mes.
- **Gráfica**: Curva de neón amarilla/ámbar (**`strokeWidth="5"`**) con brillo suavizado (**`feGaussianBlur stdDeviation="2.5"`**).

## 3. Geometría Monolítica (Industrial)
- **Contenedores**: Los módulos principales (Cards) deben conservar **esquinas rectas (`rounded-none`)** y **cero bordes (`border-none`)** para mantener el aire de monolito tecnológico.
- **Botones e Indicadores (Pills)**: Todos los elementos pequeños interactivos o de estado (nodos, botones de acción, leyendas) deben ser **totalmente redondeados (`rounded-full`)**.

## 4. Paleta y Fondos
- **Cards**: Gradiente diagonal de `#2b2e41` a `#1b1d2c`.
- **Dona Luna**: Track en gris industrial (**`#525469`**) con progreso principal en Oro/Ámbar.
- **Indicadores de Estado**: Puntos esmeralda con resplandor suave y animaciones `pulse`.

---
*Luna Premium: El Observatorio de Datos Minimalista y Aislado.*
