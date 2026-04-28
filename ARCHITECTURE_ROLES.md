# 🛸 ARCHITECTURE_ROLES.md (MANDATO ESTRICTO)

**ASUNTO: ACTUALIZACIÓN DE ARQUITECTURA Y JERARQUÍA DE ROLES (MANDATO 2026)**

El proyecto LLDM RODEO 2026 deja de ser una "Mega App" monolítica para convertirse en un ecosistema de **5 PANELES INDEPENDIENTES** con una única base de datos en Supabase. A partir de ahora, todo el desarrollo debe regirse estrictamente por este esquema de aislamiento:

### 1. PANEL ADMINISTRADOR (Dueño/Jairo)
*   **Objetivo**: Control total, auditoría RLS y configuración de la Iglesia.
*   **Estética**: Premium Dark UI, Azul Zafiro, tablas con efecto hover y filas intercaladas.
*   **Privilegios**: Único con acceso a settings globales y "Admin Stealth Triggers".

### 2. PANEL ASISTENCIA (Operadores de Oración)
*   **Objetivo**: Registro rápido de asistencia de miembros.
*   **Estética**: Tema Catedral (Limpio/Académico). Mobile Evolution (botones táctiles grandes).
*   **Privilegios**: Solo SELECT en perfiles y INSERT/UPDATE en attendance_messages.

### 3. PANEL DEL MINISTRO (Supervisión Pastoral)
*   **Objetivo**: Decisiones basadas en estadísticas reales y condiciones de los miembros.
*   **Estética**: Tema Dark Minimal. Gráficos de asistencia y reportes.
*   **Privilegios**: Lectura total de métricas; prohibido editar datos personales.

### 4. PANEL DE RESPONSABLES (Coro, Niños, Jóvenes)
*   **Objetivo**: Gestión interna de subgrupos específicos.
*   **Estética**: Tema Iglesia con filtros bloqueados por grupo.
*   **Privilegios**: El Responsable de Coro solo gestiona choir_members. El de niños solo kids_assignments.

### 5. PANEL DEL MIEMBRO (Consulta Personal)
*   **Objetivo**: El hermano revisa su horario y responsabilidades.
*   **Estética**: Tema Luna/Glassmorphism.
*   **Privilegios**: Visibilidad a 60 días de sus turnos. Cero placeholders ("Zero Inventions").

---

## 🛠️ INSTRUCCIONES OPERATIVAS PARA ANTIGRAVITY

1.  **Aislamiento de Código**: Cuando se solicite un cambio, se debe confirmar en qué PANEL estamos trabajando. No se debe permitir que la lógica de un panel afecte o "ensucie" a los otros.
2.  **Seguridad RLS**: Toda nueva función debe incluir sus políticas Row Level Security en Supabase para proteger la jerarquía anterior y asegurar la protección de datos por roles.
3.  **Vocabulario**: Mantener el Manifiesto LLDM activo en todo momento. Queda estrictamente prohibido el uso de términos no autorizados en cualquiera de los 5 paneles.
4.  **Sincronización**: Todas las apps o paneles deben leer de la misma base de datos, asegurando el "Live Sync" total en el ecosistema.
