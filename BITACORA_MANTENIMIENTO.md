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

---

### 🛡️ Funcionalidades de Servicios Especiales (21 de Julio, 2026)

#### 12. Selector de Color para Servicios Especiales
- **Mejora:** El administrador necesitaba personalizar el color de acento de los servicios tipo "Especial" en el display.
- **Solución:**
    - Se implementó una paleta de **8 colores predeterminados** (Morado, Rojo, Naranja, Azul, Verde, Dorado, Rosa, Cyan) + un **selector de color personalizado** (`<input type="color">`) en el panel de administración.
    - El color se almacena como 4to segmento en `evening_custom_label` (formato: `customLabel|thirdLeaderRole|hideProfiles|accentColor`).
    - El color del Especial tiene **prioridad sobre el color predeterminado del día** (ej. jueves verde → morado).
    - Se expandió la lógica de colores en `MidnightGlowWeekly.tsx` para soportar gold, rose, cyan como presets nativos.
- **Archivos Afectados:**
    - `src/app/admin/page.tsx` (UI del selector de color)
    - `src/lib/store.ts` (empaquetado/desempaquetado del 4to segmento)
    - `src/lib/types.ts` (campos `hideProfiles`, `accentColor`)
    - `src/themes/MidnightGlow/MidnightGlowWeekly.tsx` (renderizado de colores)

#### 13. Ocultar Perfiles en Display (hideProfiles)
- **Mejora:** Para ciertos eventos especiales, el administrador necesitaba ocultar las fotos y nombres de los responsables y mostrar solo el logo de la iglesia con el título del evento.
- **Solución:**
    - Se añadió un botón toggle **"Ocultar Perfiles en Display"** (`hideProfiles`) en el panel admin, visible solo cuando el tipo de servicio es "Especial".
    - En **Midnight Glow Weekly**: se ocultan los avatares (se reemplazan por el ícono de la iglesia) y los nombres de los encargados.
    - En **Midnight Glow Schedule (Diario)**: se oculta el avatar normal y se muestra un avatar grande con el logo centrado, el título personalizado en texto grande, y "SERVICIO ESPECIAL" como subtítulo.
- **Archivos Afectados:**
    - `src/app/admin/page.tsx` (toggle UI)
    - `src/themes/MidnightGlow/MidnightGlowSchedule.tsx` (logo centrado + título grande)
    - `src/themes/MidnightGlow/MidnightGlowWeekly.tsx` (ícono de iglesia + nombres ocultos)

#### 14. Corrección de Crash en Producción (IIFEs y Tailwind Dinámico)
- **Problema:** Al activar `hideProfiles`, la pantalla `/display` crasheaba con "Application Error: client-side exception".
- **Causa:**
    1. `settings` no estaba importada del store en `MidnightGlowWeekly.tsx` → `settings.churchIcon` era `undefined`.
    2. Funciones IIFE `(() => {...})()` dentro de JSX son inestables en producción de Next.js.
    3. Clases Tailwind dinámicas como `border-[${hexColor}]` no se generan en build-time.
- **Solución:**
    - Se añadió `const settings = useAppStore(...)` al componente Weekly.
    - Se reemplazaron todos los IIFEs con variables pre-computadas (`ChurchIcon`, `HideProfileIcon`) antes del `return`.
    - Se reemplazaron clases Tailwind dinámicas con `style={{ borderColor: hex }}` inline.
- **Archivos Afectados:**
    - `src/themes/MidnightGlow/MidnightGlowSchedule.tsx`
    - `src/themes/MidnightGlow/MidnightGlowWeekly.tsx`
- **Reglas Nuevas Derivadas:**
    - **Regla 7:** No usar IIFEs en JSX. Pre-computar antes del `return`.
    - **Regla 8:** No usar clases Tailwind dinámicas. Usar `style={{}}` inline.

#### 15. Galería de Medios y Clasificación de Íconos / Logos
- **Mejora:** Se implementó un modal de **Galería de Medios (`MediaGalleryModal`)** para seleccionar y subir imágenes optimizadas (WebP). Se incorporó la **clasificación de archivos** a solicitud del usuario para facilitar la búsqueda de íconos/logos frente a afiches o imágenes generales.
- **Solución:**
    - Se agregaron **botones de filtro por categoría**: `Todos`, `✨ Íconos y Logos`, `🎨 Afiches / Eventos` y `General`.
    - Se agregó una **barra de búsqueda rápida** en la galería por nombre de archivo.
    - Se incluyó un **selector de categoría previo al subir** (permite etiquetar archivos como `icon_`, `poster_` o `gen_`).
    - Al seleccionar una imagen, su URL pública se guarda en el 5to parámetro de `evening_custom_label` (`customIconUrl`) y se renderiza en la tarjeta/pantalla del display cuando los perfiles están ocultos.
- **Archivos Afectados:**
    - `src/components/admin/MediaGalleryModal.tsx`
    - `src/lib/store.ts`
    - `src/app/admin/page.tsx`
    - `src/themes/MidnightGlow/MidnightGlowWeekly.tsx`
    - `src/themes/MidnightGlow/MidnightGlowSchedule.tsx`

#### 16. Detección de Vinculación y Protección contra Eliminación
- **Mejora:** Prevenir que un administrador borre accidentalmente una imagen de la galería que esté siendo utilizada en un perfil de hermano, logo del sistema, evento o aviso.
- **Solución:**
    - **Detección Automática de Vinculación**: cada imagen escanea en tiempo real el estado global (`members`, `settings`, `monthlySchedule`, `announcements`). Si está en uso, muestra la etiqueta **`🟢 En Uso`** con un tooltip que lista los elementos exactos vinculados (ej: *Perfil: Hno. Juan Aguilar*).
    - **Modo Selección Múltiple y Eliminación Masiva**: botón de selección múltiple que permite marcar varias imágenes al mismo tiempo, con opción de un solo clic para **"Seleccionar No Vinculadas (Libres)"** e iniciar borrado masivo.
    - **Modal de Advertencia en Rojo**: si se intenta eliminar una o más imágenes en uso (individualmente o en lote), el modal de seguridad desglosa qué archivos y secciones perderán la imagen.
    - **Acceso Independiente en Ajustes**: se agregó la tarjeta **"GALERÍA DE MEDIOS"** en la pestaña de Preferencias del Panel Admin (`AjustesTab.tsx`) para gestionar y limpiar imágenes sin necesidad de estar editando un horario.
- **Archivos Afectados:**
    - `src/components/admin/MediaGalleryModal.tsx`
    - `src/lib/store.ts` (función `deleteMediaGalleryFile`)
    - `src/app/admin/tabs/AjustesTab.tsx`

#### 17. Registro y Sincronización Total de Fotos de Perfiles en la Galería
- **Problema:** Al listar archivos en Storage, la paginación predeterminada (límite 100) y las imágenes de perfiles guardadas en rutas externas o subcarpetas no aparecían en el catálogo de la Galería de Medios.
- **Solución:**
    - Se aumentó el límite de consulta en Storage a `1,000` archivos y se implementó **exploración recursiva de subcarpetas**.
    - Se implementó **sincronización directa con la base de datos `profiles`**: el sistema consulta todos los avatares activos de los miembros y los registra de forma garantizada en la Galería bajo la categoría **`✨ Íconos y Logos`**, asignándoles automáticamente la etiqueta **`🟢 En Uso (Perfil: Nombre)`**.
    - Esto evita que fotos de perfil activas queden fuera del catálogo y previene que el botón "Seleccionar No Vinculadas" las considere por error como archivos sin usar.
- **Archivos Afectados:**
    - `src/lib/store.ts` (`fetchMediaGalleryFiles`)
    - `src/components/admin/MediaGalleryModal.tsx` (`determineCategory`)

#### 18. Protección de Fotos de Ministro Responsable y Supervisor
- **Problema:** Las fotografías del **Ministro Responsable** (`settings.ministerAvatar`) y del **Supervisor** (`settings.mainChurch.supervisorAvatar`) no estaban registradas en el validador `getFileUsages`, causando que fueran marcadas como `Libres` y borradas al presionar "Seleccionar No Vinculadas".
- **Solución:**
    - Se añadieron `ministerAvatar`, `supervisorAvatar` y `ministerAvatar` a las listas de comprobación en `getFileUsages` (`MediaGalleryModal.tsx`) y en `fetchMediaGalleryFiles` (`store.ts`).
    - Ahora estas fotografías se etiquetan automáticamente como **`🟢 En Uso (Ajustes: Foto del Ministro)`** y **`🟢 En Uso (Ajustes: Foto del Supervisor)`**, garantizando que nunca sean borradas por accidente.
- **Archivos Afectados:**
    - `src/components/admin/MediaGalleryModal.tsx`
    - `src/lib/store.ts`

#### 19. Opción "Elegir de Galería" en Creación y Edición de Perfiles
- **Mejora:** Permitir al administrador no solo subir fotos nuevas desde su dispositivo, sino también **seleccionar y vincular imágenes existentes en la Galería de Medios** al crear o editar perfiles.
- **Solución:**
    - Se agregó el botón **`🖼️ Elegir de Galería`** en:
        1. **Registro / Edición de Miembros** (`admin/members/page.tsx`).
        2. **Fotografía del Ministro Responsable** (`AjustesTab.tsx`).
        3. **Fotografía del Supervisor de Distrito** (`AjustesTab.tsx`).
        4. **Fotografía de Mi Perfil Admin** (`PerfilTab.tsx`).
    - Al hacer clic, se abre el modal de Galería de Medios en modo selección y aplica automáticamente la foto seleccionada al perfil correspondiente.
- **Archivos Afectados:**
    - `src/app/admin/members/page.tsx`
    - `src/app/admin/tabs/AjustesTab.tsx`
    - `src/app/admin/tabs/PerfilTab.tsx`

#### 20. Rediseño de Acciones de Fotografía a Botones Táctiles Estilizados
- **Mejora:** Reemplazar los enlaces de texto simple por **botones táctiles estilizados** con iconos explicativos para "Subir Foto", "Elegir de Galería" y "Re-encuadrar".
- **Solución:**
    - En las tarjetas de Ministro Responsable y Supervisor (`AjustesTab.tsx`), así como en el modal de Jerarquía de Obras (`CongregationEditModal.tsx`), las opciones de edición de avatar ahora se despliegan como botones táctiles independientes:
        - `📤 Subir Foto` (botón táctil oscuro).
        - `🖼️ Elegir de Galería` (botón destacado con borde verde neón).
        - `✂️ Re-encuadrar` (botón con ícono de recorte).
- **Archivos Afectados:**
    - `src/app/admin/tabs/AjustesTab.tsx`
    - `src/components/admin/CongregationEditModal.tsx`

#### 21. Corrección de Activación del Botón "Guardar Configuración" en Jerarquía de Obras
- **Problema:** En el modal de gestión de iglesia / obra (`CongregationEditModal.tsx`), el botón **"Guardar Configuración"** permanecía desactivado (gris) cuando el objeto inicial no traía un nombre predeterminado asignado.
- **Solución:**
    - Se agregó un valor de respaldo por defecto (`formData.name || 'Principal (Rodeo CA)'`) en la inicialización del estado del formulario.
    - Se flexibilizó la condición de desactivación a `disabled={isSaving || !(formData.name || '').trim()}`, permitiendo que el botón se active inmediatamente al cargar o al escribir cualquier nombre.
- **Archivos Afectados:**
    - `src/components/admin/CongregationEditModal.tsx`

#### 22. Sincronización Inmediata y Renderizado de Imagen de Iglesia / Obra
- **Problema:** Al seleccionar una imagen para la sede principal u obra desde la Galería y presionar "Guardar Configuración", la imagen se enviaba a Supabase pero la vista previa en el panel de `AjustesTab.tsx` no se refrescaba de inmediato sin recargar la página.
- **Solución:**
    - Se incorporó la actualización inmediata del estado local `setSettings({ ...settings, ...updatedPayload })` en el callback `onSave` de `AjustesTab.tsx`.
    - Se vinculó explícitamente `churchLogoUrl` junto con `mainChurch.imageUrl` para garantizar que la vista previa y los displays reflejen la nueva foto al instante.
- **Archivos Afectados:**
    - `src/app/admin/tabs/AjustesTab.tsx`
    - `src/components/admin/CongregationEditModal.tsx`
#### 23. Manejo de Errores `onError` y Respaldo para Imágenes Eliminadas / Rotas
- **Problema:** Si una imagen previamente asignada fue eliminada del almacenamiento (o su enlace expiró), el navegador mostraba el icono de imagen rota de Chrome.
- **Solución:**
    - Se añadió captura de error `onError` en todas las imágenes de sede principal, ministro, supervisor y obras (`AjustesTab.tsx` y `CongregationEditModal.tsx`).
    - Si la URL falla (404), el componente conmuta automáticamente a mostrar el icono elegante (`<Church />` o avatar con iniciales).
    - Al seleccionar una nueva foto válida de la Galería, el estado de error se reinicia automáticamente y proyecta la nueva imagen limpia.
- **Archivos Afectados:**
    - `src/app/admin/tabs/AjustesTab.tsx`
    - `src/components/admin/CongregationEditModal.tsx`






