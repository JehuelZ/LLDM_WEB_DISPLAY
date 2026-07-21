# MEMORY: LLDM Rodeo Admin Dashboard

Este archivo sirve como puente cognitivo entre sesiones. Contiene el estado actual del proyecto, decisiones críticas de diseño y tareas pendientes.

## 📌 Estado Actual del Proyecto (Julio 2026)
- **Servicios Especiales:** Se implementó la personalización del título en los servicios tipo 'Especial' en el slot `evening` desde el panel de administración (mapeado a `customLabel` / `evening_custom_label`). Se adaptaron todos los temas de visualización (Midnight Glow, Iglesia, Luna Premium, etc.) para pintar dinámicamente este título personalizado o usar 'Servicio Especial' como fallback si está vacío.
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

## 🏆 Reglas de Oro (Estándares del Proyecto)
1. **Integridad Temática:** No mezclar estilos entre temas (Primitivo, Luna, Catedral). Cada interfaz debe respetar su propio lenguaje visual.
2. **Seguridad Supabase (RLS):** Toda tabla DEBE tener políticas de seguridad RLS activas. Prohibido el acceso libre sin filtrado por rol o UID.
3. **Cero Placeholders:** Prohibido el uso de datos genéricos. Si no hay datos, usar "Empty States" elegantes.
4. **Resiliencia en Fechas:** Manejo estricto de fechas para evitar `RangeError`. Validar siempre antes de renderizar calendarios o métricas.
5. **Estética Premium:** Todo componente nuevo debe cumplir con estándares visuales modernos (micro-animaciones, sombras suaves, tipografía cuidada).
6. **Consistencia de Terminología Ministerial:** El tipo de tema `orthodoxy` (técnico en Supabase) debe etiquetarse en la interfaz pública y el panel de administración como **"Ortodoxia"** (o "Estudio de Ortodoxia"). No se debe utilizar la etiqueta "Sana Doctrina" ya que es un término poco familiar para visitas y miembros según retroalimentación directa recibida en junio de 2026.

---
*Última actualización: 20 de julio de 2026*
