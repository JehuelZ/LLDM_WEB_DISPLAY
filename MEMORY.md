# MEMORY: LLDM Rodeo Admin Dashboard

Este archivo sirve como puente cognitivo entre sesiones. Contiene el estado actual del proyecto, decisiones críticas de diseño y tareas pendientes.

## 📌 Estado Actual del Proyecto (Abril 2026)
- **Tema Activo en Desarrollo:** "Catedral" (Enfoque en estética neomórfica, premium y limpia).
- **Última Estabilización:** Se resolvieron errores de `RangeError` en fechas y se consolidaron las tablas de base de datos (`attendance_messages`, `kids_assignments`).
- **Arquitectura:** Migración completada hacia un modelo de jerarquía de iglesia basado en objetos (`CongregationInfo`).

## 🎨 Decisiones de Diseño & UX
- **Temas:**
    - **Primitivo:** Estética industrial oscura, restaurada recientemente.
    - **Luna:** Estética moderna y fluida. Jerarquía de clima centrada en Termómetro gigante e iconos flotantes. *Cloud Master Protocol*: Las pantallas en producción no usan la fecha ni ubicación del hardware, sino que consumen estrictamente el Timezone y las Coordenadas definidas en el Admin Panel de Supabase.
    - **Catedral:** Consolidación de clima en el header y reloj flotante neomórfico en la esquina inferior derecha.
- **Interactividad:** Favicon dinámico que cambia de color según el tema activo.
- **Reportes:** Capacidad de exportar "Fichas Personales" de miembros a PDF usando `html2pdf.js`.

## 🛠️ Especificaciones Técnicas
- **Frontend:** Next.js (src/app architecture).
- **Backend/DB:** Supabase con políticas RLS (Row Level Security) estrictas.
- **Estado Dinámico:** Uso de Stores para manejar configuraciones globales (tema, congregación activa).

## 🚀 Próximos Pasos (Pendientes)
- [ ] Verificación final del header en el tema "Catedral".
- [ ] Asegurar que el trigger de "admin stealth" sea invisible pero funcional.
- [ ] Auditoría de seguridad de políticas RLS para nuevas tablas.
- [ ] Optimización de la carga de "Member Profiles" con grandes volumenes de datos.

## 🏆 Reglas de Oro (Estándares del Proyecto)
1. **Integridad Temática:** No mezclar estilos entre temas (Primitivo, Luna, Catedral). Cada interfaz debe respetar su propio lenguaje visual.
2. **Seguridad Supabase (RLS):** Toda tabla DEBE tener políticas de seguridad RLS activas. Prohibido el acceso libre sin filtrado por rol o UID.
3. **Cero Placeholders:** Prohibido el uso de datos genéricos. Si no hay datos, usar "Empty States" elegantes.
4. **Resiliencia en Fechas:** Manejo estricto de fechas para evitar `RangeError`. Validar siempre antes de renderizar calendarios o métricas.
5. **Estética Premium:** Todo componente nuevo debe cumplir con estándares visuales modernos (micro-animaciones, sombras suaves, tipografía cuidada).

---
*Última actualización: 13 de abril de 2026*
