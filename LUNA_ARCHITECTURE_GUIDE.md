# 🌑 Luna Premium: Manual de Arquitectura y Diseño V1.0

Este documento establece los estándares de ingeniería, el flujo de trabajo creativo y las pautas visuales para el ecosistema **Luna Premium** dentro de LLDM Rodeo. Es de lectura obligatoria antes de cualquier modificación estructural.

## 1. 🌊 Flujo de Diseño (Luna Design Workflow)

El diseño en Luna no es decorativo; es **funcional e industrial**. El flujo para crear una nueva característica o consola es:

1.  **Abstracción de Datos**: Antes de dibujar, identificar los KPIs (Key Performance Indicators) del tablero. Menos es más.
2.  **Esqueleto Industrial**: Definir un grid limpio de máximo 4 columnas en Desktop.
3.  **Inyección de Profundidad**: Aplicar el sistema de capas (OLED Black -> Glass -> Glow).
4.  **Micro-Animaciones**: Cada estado (hover, loading, select) debe tener una transición suave (Framer Motion).
5.  **Auditoría de Contraste**: Asegurar que los textos secundarios no compitan con la métrica principal.

---

## 2. 🎨 Pautas de Diseño (Design Guidelines)

### 2.1 Paleta de Colores Tácticos
*   **Fondo Base (OLED)**: `#0a0a0a` (Negro puro para contraste infinito).
*   **Gradients Tácticos**: 
    *   Dashboard: `linear-gradient(225deg, #2b2e41 0%, #1b1d2c 100%)`.
    *   Cards (Tablas): `bg-black/60 backdrop-blur-3xl`.
*   **Acentos de Estado**:
    *   `Primary`: Oro Táctico (`#d4af37` / Brillo de autoridad).
    *   `Secondary`: Azul Kinético (Operaciones).
    *   `Success`: Esmeralda Neón (Asistencia confirmada).

### 2.2 Tipografía (The "300" Rule)
*   **Font Principal**: `Outfit` (Sans Serif geométrica).
*   **Jerarquía**: 
    *   Títulos: `font-black uppercase italic tracking-tighter`.
    *   Labels: `font-black uppercase tracking-[0.2em] text-[10px]`.
    *   Cuerpo: `font-light` o `font-300` (Grosor ultra-delgado para estética premium).

### 2.3 Estándar de Contenedores
*   **Bordes**: `rounded-[2.5rem]` para cards grandes, `rounded-xl` para elementos internos.
*   **Borders**: `border-white/5` o `border-primary/20`. Nunca usar bordes sólidos de alta opacidad.
*   **Efectos**: `glass-card` con `backdrop-blur-3xl` obligatorio en tablas de datos.

---

## 3. 🏗️ Estructura del Código (Code Architecture)

### 3.1 Localización de Componentes
*   **Consolas Principales**: `src/app/admin/LunaAdmin.tsx` (Single point of truth para el Dashboard Luna).
*   **Componentes Compartidos**: `src/components/ui/` (Ajustados con clases de Luna).
*   **Temas Globales**: `src/themes/LunaPremium/` (Almacén de estilos e iconos específicos).

### 3.2 Gestión de Estado (Zustand Strategy)
*   **Store Central**: `src/lib/store.ts` (`useAppStore`).
*   **Persistencia**: La versión actual es `lldm-rodeo-storage-v10`. No degradar versiones de almacenamiento.
*   **Sincronización**: Toda acción de escritura debe llamar a su correspondiente `save...ToCloud`.

### 3.3 Integración con Supabase
*   **Tablas Críticas**: `profiles`, `attendance`, `weekly_themes`.
*   **Seguridad**: Validar el rol de `Administrador` mediante el filtro de `auth_user_id` en las políticas RLS.

---

## 4. 🛠️ Reglas de Oro (The Golden Rules)

> [!IMPORTANT]
> 1. **No Placeholders**: Si falta una imagen, usar la API de avatares dinámicos (`ui-avatars.com`).
> 2. **Lowercase por Defecto**: Las descripciones y textos secundarios tienden al lowercase minimalista.
> 3. **Consistencia de Bordes**: Un radio de borde incorrecto rompe la armonía industrial.
> 4. **Hardware Look**: Todo elemento interactivo debe sentirse como un botón físico de equipo premium.

---
**LLDM RODEO | Luna Premium Support Team**
