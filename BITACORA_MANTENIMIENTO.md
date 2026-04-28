# Bitácora de Mantenimiento - LLDM Rodeo

Este documento registra las reparaciones técnicas, mejoras de UX y correcciones de errores realizadas en el proyecto.

---

### 🛡️ Reparaciones del Skill Doctor (8 de Marzo, 2026)

#### 1. Reparación de Navegación Lateral (Temas Semanales)
- **Problema:** El enlace "Temas Semanales" en la barra lateral del administrador no abría la sección correspondiente.
- **Causa:** 
    - El enlace usaba un hash de URL (`#temas`) que no estaba mapeado correctamente en ninguna de las dos interfaces (Clásica y Táctica).
    - La interfaz "Táctica" no escuchaba cambios en el hash de la URL, solo parámetros de búsqueda.
- **Solución:**
    - Se migraron todos los enlaces de la barra lateral de **Hashes** (`#`) a **Parámetros de Búsqueda** (`?tab=`).
    - Se implementó un sistema de **Alias Inteligentes** para que enlaces como `#temas` o `?tab=temas` abran automáticamente la sección de **Contenido**.
    - Se unificó el comportamiento de `popstate` y custom events (`tab-change`) para que la navegación sea instantánea sin recargar la página.
- **Archivos Afectados:**
    - `src/app/admin/layout.tsx` (Actualización de enlaces y dispatchers).
    - `src/app/admin/page.tsx` (Lógica de alias y escucha de query params en UI Clásica).
    - `src/app/admin/TactileAdmin.tsx` (Lógica de alias y escucha de query params en UI Táctica).

#### 2. Campo 'Bio' en Perfiles
- **Mejora:** Se añadió la capacidad de guardar una biografía o notas personales para cada miembro.
- **Solución:** Se actualizó el esquema de datos en el `store.ts` y se añadieron campos de texto en el registro de miembros y en la edición de perfil personal.
- **Archivos Afectados:**
    - `src/lib/store.ts`
    - `src/app/admin/TactileAdmin.tsx`

#### 3. Optimización para Smart TV / Chromecast
- **Mejora:** Creación de una ruta dedicada para pantallas de la iglesia.
- **Solución:** Se creó `/tv` que elimina el PIN de acceso, oculta el cursor y optimiza el rendimiento gráfico para hardware limitado.
- **Archivos Afectados:**
    - `src/app/tv/page.tsx`
    - `src/app/tv/tv.css`

#### 4. Nueva Identidad Visual y Custom Logos
- **Mejora:** El administrador necesitaba renovar la imagen visual del sitio y tener flexibilidad para eventos futuros.
- **Solución:**
    - Se eliminaron los logos archivados ('Rodeo Oficial', 'Santa Cena', '100 Aniversario').
    - Se estableció la **Flama LLDM** como el logo oficial predeterminado en todo el sistema.
    - Se implementaron **4 ranuras (slots) dinámicas** para subir logos personalizados.
    - Se modificaron los componentes `Header`, `Layout` y `Clock` de todos los temas para usar el nuevo sistema de iconos dinámicos.
- **Archivos Afectados:**
    - `src/lib/store.ts` (Nuevos campos de AppSettings).
    - `src/app/admin/page.tsx` y `TactileAdmin.tsx` (Subida y selección en UI).
    - `src/components/layout/Header.tsx`, `src/app/admin/layout.tsx`.
    - `src/themes/MidnightGlow/Clock.tsx`, `src/themes/DarkMinimal/Clock.tsx`, `src/themes/Glassmorphism/Clock.tsx`.

#### 5. Dashboard Mejorado (Mensajes y Stats)
- **Mejora:** Centralizar la actividad del usuario y el acceso a mensajes.
- **Solución:**
    - Se añadió una tarjeta de **Mensajes** en el dashboard principal con redirección al perfil.
    - Se rediseñó la página de perfil para incluir pestañas de **Perfil**, **Mensajes** y **Estadísticas**, organizando mejor la información.
- **Archivos Afectados:**
    - `src/app/dashboard/page.tsx`.
    - `src/app/dashboard/profile/page.tsx`.

#### 6. Correcciones en Panel de Coro (Choir Hub)
- **Mejora:** El dirigente de coro no podía editar ni eliminar avisos publicados previamente.
- **Solución:** 
    - Se habilitó la lógica de `editingAnnId` en el dashboard de coro.
    - Se añadieron iconos de **Ajustes** (Editar) y **Basura** (Eliminar) en la lista de avisos del coro.
    - Los cambios se sincronizan en tiempo real con Supabase.
- **Archivos Afectados:**
    - `src/app/dashboard/coro/page.tsx`.

#### 7. Banner de Servicio Informativo (Live Banner)
- **Problema:** El sistema de display no avisaba de forma prominente cuando un servicio dominical u oración estaba en curso.
- **Solución:**
    - Se implementó un **Banner "En Curso"** dinámico en el encabezado global del tema **Iglesia (Cátedra)**.
    - El banner detecta automáticamente si es domingo para mostrar "Escuela Dominical" o si es un día regular para mostrar "Oración".
    - Incluye animación de pulsación para máxima visibilidad en televisiones y proyectores.
- **Archivos Afectados:**
    - `src/themes/Iglesia/Clock.tsx`.

---

### 🛡️ Reparaciones de Identidad y Almacenamiento (18 de Marzo, 2026)

#### 8. Corrección en Selección de Logos Personalizados
- **Problema:** Los administradores subían logos pero no podían activarlos correctamente en el panel táctil.
- **Causa:** Inconsistencia de nombres (snake_case vs camelCase). El código usaba `custom_logo_1` mientras que el store esperaba `customLogo1`.
- **Solución:** Se unificaron las claves a camelCase en el panel de administración táctil para asegurar la sincronización con el estado global y la base de datos.
- **Archivos Afectados:**
    - `src/app/admin/TactileAdmin.tsx`

#### 9. Soporte SVG de Proyección y Sistema Multi-Bucket
- **Problema:** Error `mime type image/svg+xml is not supported` al intentar subir fondos de proyección en formato SVG.
- **Causa:** El bucket predeterminado de avatars en Supabase tiene restricciones de tipo de archivo para fotos de perfil.
- **Solución:** 
    - Se implementó un **Sistema de Fallback de Buckets** en la lógica de subida.
    - Si la subida al bucket `avatars` falla, el sistema intenta automáticamente subir el archivo al bucket `app_assets`, el cual es más permisivo con archivos vectoriales (SVG).
    - Se mejoró el reporte de errores para identificar qué bucket falló y por qué.
- **Archivos Afectados:**
    - `src/lib/store.ts` (Lógica de `uploadAvatar`).
    - `src/app/admin/TactileAdmin.tsx` (UI de fondo de proyección).

---

### 🛡️ Finalización de Tema Mocha y UI (28 de Marzo, 2026)

#### 10. Implementación de Tema Mocha y Corrección de FOUC
- **Mejora:** Transición del panel de administración Tactile a la estética premium en modo claro ("Mocha").
- **Solución:**
    - Se optimizó la inicialización del tema en `src/app/admin/layout.tsx` para sincronizar `adminTheme` y `colorMode` desde el localStorage antes del primer renderizado, eliminando el destello visual (FOUC).
    - Se estandarizaron tokens semánticos en `tactile-admin.css` (`--tactile-panel-bg`, `--tactile-item-hover`, etc.).
    - Se limpiaron componentes como `TactileAdmin.tsx` y `admin/page.tsx` de colores estáticos limitantes para admitir la variante Mocha.
- **Archivos Afectados:**
    - `src/app/admin/layout.tsx`
    - `src/app/admin/tactile-admin.css`
    - `src/app/admin/TactileAdmin.tsx`
    - `src/app/admin/page.tsx`

---

*Documento actualizado por Antigravity (IA)*

### 🛡️ Resolución de Sincronización de Base de Datos (28 de Abril, 2026)

#### 11. Columnas Faltantes en `app_settings` (Clima y Zona Horaria)
- **Problema:** El panel de administración arrojaba un error de fallo de sincronización al intentar configurar la ciudad del clima, indicando que faltaba la columna `weather_city`.
- **Causa:** En actualizaciones recientes se añadió funcionalidad para detección automática de clima y zona horaria (para que la proyección dependa de la ubicación global de la iglesia y no de la hora local del dispositivo), pero estas columnas (`weather_lat`, `weather_lng`, `weather_city`, `weather_timezone`) no fueron agregadas al schema en producción.
- **Solución:**
    - Se actualizó el archivo maestro de reconstrucción `MEGA_FIX_DATABASE.sql` incluyendo las sentencias `ADD COLUMN IF NOT EXISTS` para estas propiedades.
    - Se proveyó el fragmento de código SQL necesario para ejecutarse directamente en el SQL Editor de Supabase y resolver la incidencia de forma inmediata.
- **Archivos Afectados:**
    - `MEGA_FIX_DATABASE.sql`
