# MEMORY: LLDM Rodeo Admin Dashboard

Este archivo sirve como puente cognitivo entre sesiones. Contiene el estado actual del proyecto, decisiones críticas de diseño y tareas pendientes.

## 📌 Estado Actual del Proyecto (Julio 2026)
- **Servicios Especiales & Galería de Medios (Julio 21, 2026):**
  - Se implementó **"Ocultar Perfiles"** (`hideProfiles`) para servicios de tipo Especial, reemplazando fotos por ícono/logo y título en grande.
  - Se implementó **selector de color del acento** (`accentColor`) con 8 presets + color personalizado libre (`#hex`).
  - Se creó un modal de **Galería de Medios (`MediaGalleryModal`) estilo WordPress** con:
    - **Detección Automática de Vinculación (`En Uso` / `Libre`)**: escanea si cada imagen está vinculada a un perfil de miembro, fotos del Ministro o Supervisor en Ajustes, logo/fondo, evento programado o aviso. Muestra una insignia `🟢 En Uso` con tooltip detallando a qué elemento exacto está vinculada.
    - **Botón "Elegir de Galería" y Botones Táctiles en Formularios**: se transformaron los textos simples de "Cambiar Fotografía", "Elegir de Galería" y "Re-encuadrar" en botones táctiles modernos con íconos (`Upload`, `Images`, `Crop`), agregándolos en Ministro, Supervisor, Perfil de Miembro y Modal de Jerarquía/Obras. Se solucionó también la activación del botón "Guardar Configuración" en la edición de Obras asignando valor por defecto a `formData.name`.
    - **Sincronización Total con la Base de Datos de Perfiles**: se consulta directamente la tabla de perfiles (`profiles`) en Supabase para garantizar que **todas las fotos de avatar de todos los miembros estén registradas en la Galería**, categorizadas en `✨ Íconos y Logos` y marcadas como `🟢 En Uso` (evitando que queden fotos de perfil huérfanas sin registrar).
    - **Protección contra Eliminación Accidental**: si intentas eliminar una imagen en uso, aparece un modal de advertencia roja alertando qué secciones del sistema perderán la imagen antes de permitir borrar.
    - **Modo Selección Múltiple y Eliminación Masiva**: botón de selección múltiple con casilla en cada imagen, botón útil **"Seleccionar No Vinculadas (Libres)"** para limpiar rápidamente imágenes huérfanas, y eliminación masiva protegida por el modal de seguridad.
    - **Clasificación por pestañas/etiquetas**: `✨ Íconos y Logos`, `🎨 Afiches / Eventos`, `🖼️ General`.
    - **Barra de búsqueda instantánea** por nombre de archivo.
    - **Compresión WebP automática**: toda imagen se redimensiona a máx 800x800px y se convierte a `.webp` al 85% de calidad.
  - La imagen seleccionada de la galería se asigna al servicio especial (`customIconUrl`) y se proyecta en las vistas Display (Weekly y Daily).
- **Servicios Especiales (Titulo Personalizado):** Se implementó la personalización del título en los servicios tipo 'Especial' en el slot `evening` desde el panel de administración (mapeado a `customLabel` / `evening_custom_label`). Se adaptaron todos los temas de visualización (Midnight Glow, Iglesia, Luna Premium, etc.) para pintar dinámicamente este título personalizado o usar 'Servicio Especial' como fallback si está vacío.
- **Automatización de Mayo:** Calendario de mayo 2026 completado y cargado en Supabase (`schedule`).
- **Seguridad & Acceso:** 
    - Se habilitó el acceso administrativo para el rol **"Ministro a Cargo"** (E.E. Eliab Aguilar) mediante la actualización de políticas RLS.
    - Se corrigió el "Hanging" en la UI mediante bloques `try...finally` y mejoras en el manejo de bloqueos del navegador (`Navigator LockManager`).
- **Lógica de Privilegios (Niños):** Se implementó la división de servicios de alabanza de niños en 3 roles (Dirige, Consagración, Doctrina) para los sábados, respondiendo al incremento de participación infantil.

## 🎨 Decisiones de Diseño & UX
- **Temas:**
    - **Primitivo:** Estética industrial oscura, restaurada recientemente.
    - **Luna:** Estética moderna y fluida. Jerarquía de clima centrada en Termómetro gigante e iconos flotantes. *Cloud Master Protocol*: Las pantallas en producción no usan la fecha ni ubicación del hardware, sino que consumen estrictamente el Timezone y las Coordenadas definidas en el Admin Panel de Supabase.
    - **Catedral:** Consolidación de clima en el header y reloj flotante neomórfico en la esquina inferior derecha.
- **Interactividad:** Favicon dinámico que cambia de color según el tema activo.
- **Reportes:** Capacidad de exportar "Fichas Personales" de miembros a PDF usando `html2pdf.js`.
- **Gestión de Horarios:** Soporte para hasta 3 responsables en servicios especiales (Niños/Jóvenes).
- **Servicios Especiales en Display:**
    - Tema **Midnight Glow Weekly**: Tarjeta del día especial adopta el color seleccionado (borde, sombra, texto, avatar ring). Si `hideProfiles` está activo, el avatar muestra el ícono de la iglesia y los nombres desaparecen.
    - Tema **Midnight Glow Schedule (Diario)**: Cuando `hideProfiles` está activo, se muestra un avatar grande con el logo de la iglesia centrado, el título personalizado en texto grande, y "SERVICIO ESPECIAL" como subtítulo.

## 🛠️ Especificaciones Técnicas
- **Frontend:** Next.js (src/app architecture).
- **Backend/DB:** Supabase con políticas RLS (Row Level Security) estrictas.
- **Control de Acceso:** RBAC expandido para incluir `Ministro a Cargo` con permisos de escritura en temas y avisos.
- **Prevención de Duplicados:** Implementación de restricción única (`UNIQUE constraint`) en la tabla `schedule` y `weekly_themes` para evitar colisiones de fechas.

## 🚀 Próximos Pasos (Pendientes)
- [ ] Monitorear la respuesta de la UI en dispositivos Smart TV tras el parche de `LockManager`.
- [ ] Validar la visualización de los 3 responsables de niños en los temas Luna y Primitivo (Pantallas de Proyección).
- [ ] Auditoría de seguridad de políticas RLS para nuevas tablas.
- [ ] Optimización de la carga de "Member Profiles" con grandes volumenes de datos.
- [ ] Implementar `hideProfiles` y `accentColor` en temas **Iglesia** y **Luna Premium** para coherencia multi-tema.
- [ ] Validar comportamiento de `hideProfiles` en servicios con 3 líderes (niños/matrimonios).

## 🏆 Reglas de Oro (Estándares del Proyecto)
1. **Integridad Temática:** No mezclar estilos entre temas (Primitivo, Luna, Catedral). Cada interfaz debe respetar su propio lenguaje visual.
2. **Seguridad Supabase (RLS):** Toda tabla DEBE tener políticas de seguridad RLS activas. Prohibido el acceso libre sin filtrado por rol o UID.
3. **Cero Placeholders:** Prohibido el uso de datos genéricos. Si no hay datos, usar "Empty States" elegantes.
4. **Resiliencia en Fechas:** Manejo estricto de fechas para evitar `RangeError`. Validar siempre antes de renderizar calendarios o métricas.
5. **Estética Premium:** Todo componente nuevo debe cumplir con estándares visuales modernos (micro-animaciones, sombras suaves, tipografía cuidada).
6. **Consistencia de Terminología Ministerial:** El tipo de tema `orthodoxy` (técnico en Supabase) debe etiquetarse en la interfaz pública y el panel de administración como **"Ortodoxia"** (o "Estudio de Ortodoxia"). No se debe utilizar la etiqueta "Sana Doctrina" ya que es un término poco familiar para visitas y miembros según retroalimentación directa recibida en junio de 2026.
7. **No usar IIFEs en JSX:** Las funciones anónimas auto-invocadas `(() => {...})()` dentro de JSX causan crashes en producción de Next.js. Siempre pre-computar variables antes del `return` del componente.
8. **No usar clases Tailwind dinámicas:** Expresiones como `border-[${variable}]` no funcionan porque Tailwind las genera en build-time. Usar `style={{ borderColor: variable }}` en su lugar.

---
*Última actualización: 21 de julio de 2026*
