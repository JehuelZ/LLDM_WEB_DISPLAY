# MEMORY: LLDM Rodeo Admin Dashboard

Este archivo sirve como puente cognitivo entre sesiones. Contiene el estado actual del proyecto, decisiones críticas de diseño y tareas pendientes.

## 📌 Estado Actual del Proyecto (Julio 2026)
- **Servicios Especiales & Galería de Medios (Julio 21, 2026):**
  - Se implementó **"Ocultar Perfiles"** (`hideProfiles`) para servicios de tipo Especial, reemplazando fotos por ícono/logo y título en grande.
  - Se implementó **selector de color del acento** (`accentColor`) con 8 presets + color personalizado libre (`#hex`).
  - Se creó un modal de **Galería de Medios (`MediaGalleryModal`) estilo WordPress** con:
    - **Detección Automática de Vinculación (`En Uso` / `Libre`)**: escanea si cada imagen está vinculada a un perfil de miembro, fotos del Ministro o Supervisor en Ajustes, logo/fondo, evento programado o aviso. Muestra una insignia `🟢 En Uso` con tooltip detallando a qué elemento exacto está vinculada.
    - **Botón "Elegir de Galería" y Botones Táctiles en Formularios**: se transformaron los textos simples de "Cambiar Fotografía", "Elegir de Galería" y "Re-encuadrar" en botones táctiles modernos con íconos (`Upload`, `Images`, `Crop`), agregándolos en Ministro, Supervisor, Perfil de Miembro, Modal de Jerarquía/Obras y Fondo de Proyección. Se corrigieron los elementos sintéticos (`icon_setting_...`) en la Galería para omitir rutas relativas/rotas, añadiendo un contenedor distintivo `⚠️ No disponible (404)` y purga de referencias en Supabase DB al eliminar.
    - **Sincronización Total con la Base de Datos de Perfiles**: se consulta directamente la tabla de perfiles (`profiles`) en Supabase para garantizar que **todas las fotos de avatar de todos los miembros estén registradas en la Galería**, categorizadas en `✨ Íconos y Logos` y marcadas como `🟢 En Uso` (evitando que queden fotos de perfil huérfanas sin registrar).
    - **Protección contra Eliminación Accidental**: si intentas eliminar una imagen en uso, aparece un modal de advertencia roja alertando qué secciones del sistema perderán la imagen antes de permitir borrar.
    - **Modo Selección Múltiple y Eliminación Masiva**: botón de selección múltiple con casilla en cada imagen, botón útil **"Seleccionar No Vinculadas (Libres)"** para limpiar rápidamente imágenes huérfanas, y eliminación masiva protegida por el modal de seguridad.
    - **Clasificación por pestañas/etiquetas**: `✨ Íconos y Logos`, `🎨 Afiches / Eventos`, `🖼️ General`.
    - **Barra de búsqueda instantánea** por nombre de archivo.
    - **Compresión WebP automática**: toda imagen se redimensiona a máx 800x800px y se convierte a `.webp` al 85% de calidad.
  - La imagen seleccionada de la galería se asigna al servicio especial (`customIconUrl`) y se proyecta en las vistas Display (Weekly y Daily).
- **Servicios Especiales (Multi-Tema & Título Personalizado):** Se verificó y completó el soporte completo de **Servicios Especiales** en los 6 temas de proyección (**Midnight Glow**, **Iglesia / Cátedra**, **Luna Premium**, **Dark Minimal**, **Neon Forge** y **Glassmorphism**):
    - **Título Personalizado (`customLabel`)**: si el administrador escribe un título (ej: "AVIVAMIENTOS"), se despliega en mayúsculas como título principal. Si el servicio es `special` y no tiene `customLabel`, todas las plantillas hacen fallback automático a **"SERVICIO ESPECIAL"** (cumpliendo estrictamente la Regla #5 del proyecto).
    - **Ocultar Perfiles (`hideProfiles`)**: al activar esta casilla en cualquier tema, se ocultan los nombres y avatares de los miembros y se despliega en su lugar el logo/ícono oficial de la iglesia en grande junto al título del evento.
    - **Color del Acento Personalizado (`accentColor`)**: todos los temas aplican dinámicamente el color personalizado para bordes, sombras, resplandores e insignias.
- **Activación QR & Autenticación de Google (Julio 24, 2026):**
  - **Vinculación Atómica OAuth**: Se corrigió el flujo de activación desde el escaneo del QR code. El parámetro `claim_profile_id` ahora se transmite mediante la URL de retorno de OAuth en `signInWithGoogle(memberFound.id)`, evitando la pérdida de `localStorage` al saltar entre dominios en navegadores móviles.
  - **Función RPC Atómica `claim_member_portal`**: Actualizada en Supabase SQL para vincular `auth_user_id`, `email`, `status: 'Activo'` e `is_pre_registered: false` en una sola transacción segura.
  - **Terminología Ministerial**: Se actualizó la interfaz para referirse a la autoridad ministerial como **"habla con tu Ministro"** (reemplazando "líder").
  - **Nota de Membresía**: Se incorporó una insignia informativa en `/activar`: *"Nota: Este sistema es estrictamente para miembros de la iglesia (Rodeo)"* usando dinámicamente la configuración de la ciudad/iglesia.
  - **Protección SEO (`robots.txt`)**: Se creó `src/app/robots.ts` y `src/app/sitemap.ts` bloqueando la indexación de las rutas privadas (`/admin`, `/portal`, `/dashboard`, `/display`, `/activar`, `/tv`) y permitiendo solo el acceso público a la raíz (`/`).
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
- **FLAMA v1.0 (Beta) & Sitio Web Público (`lldmrodeo.org/`):**
    - Se construyó el sitio web público oficial en la raíz `/` (Home, Quiénes Somos, Horarios Públicos, Ubicación en Google Maps).
    - **FLAMA v1.0 (Beta)**: Denominación oficial de la plataforma y del gestor de contenido sin código integrado en `/admin?tab=public_web`. Permite editar en tiempo real la portada (Hero), títulos, lemas, mensaje ministerial, dirección, teléfono y foto de fondo con 1 clic desde la Galería de Medios.

## 🛠️ Especificaciones Técnicas
- **Frontend:** Next.js (src/app architecture).
- **Backend/DB:** Supabase con políticas RLS (Row Level Security) estrictas.
- **Control de Acceso:** RBAC expandido para incluir `Ministro a Cargo` con permisos de escritura en temas y avisos.
- **Prevención de Duplicados:** Implementación de restricción única (`UNIQUE constraint`) en la tabla `schedule` y `weekly_themes` para evitar colisiones de fechas.
- **SEO & Privacidad:** Indexación restringida por `robots.txt` y meta tags `noindex` para proteger datos de la iglesia.

## 🚀 Próximos Pasos (Pendientes)
- [ ] Monitorear la respuesta de la UI en dispositivos Smart TV tras el parche de `LockManager`.
- [ ] Validar la visualización de los 3 responsables de niños en los temas Luna y Primitivo (Pantallas de Proyección).
- [ ] Auditoría de seguridad de políticas RLS para nuevas tablas.
- [ ] Optimización de la carga de "Member Profiles" con grandes volumenes de datos.
- [ ] Diseñar el módulo CMS para la Página Home Pública (`/`) administrable desde `/admin`.
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
*Última actualización: 24 de julio de 2026*
