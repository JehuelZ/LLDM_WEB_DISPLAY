# LLDM RODEO 2026: MASTER PROTOCOL & ARCHITECTURAL RULES
**Version**: 2.4.0 (Abril 2026)
**Status**: ACTIVE / MANDATORY

---

## 1. Misión del Sistema
El sistema LLDM Rodeo 2026 es el centro neurálgico de comunicación y gestión de la Iglesia. Su prioridad absoluta es la **PRECISIÓN**, la **ESTÉTICA PREMIUM** y la **CONFIABILIDAD**.

## 2. Reglas de Desarrollo (Core)
1. **Source of Truth Only**: Ningún dato (hora, clima, nombres, roles) debe ser "inventado" o hardcoded como placeholder si no existe en la base de datos.
2. **Estética Neon/Glow**: Los temas `NeonForge` y `MidnightGlow` son los estándares visuales. Cualquier nuevo componente debe seguir sus tokens de diseño.
3. **Responsividad Extrema**: El sistema debe operar perfectamente en Smart TVs (4K/1080p) y en dispositivos móviles.
4. **Sincronización en Tiempo Real**: El estado global (`zustand`) debe estar siempre sincronizado con Supabase.

## 3. Protocolo de Datos e Integridad (v2026-FINAL)
Sustituido en Abril 2026 para garantizar que la pizarra sea una "ventana" fiel a la iglesia, sin importar la ubicación del hardware:

### 3.1 Data Integrity & Anti-Placeholder Mandate
- **Zero Inventions**: Ningún elemento del sistema (Dashboards, Temas de Display, Pantallas Móviles) debe usar datos de relleno como "Ministro Local", "Responsable de Coro" o estadísticas genéricas.
- **Identidad via DB**: Todas las identidades deben resolverse mediante las tablas `profiles` o `members`. Si falta un dato, la interfaz mostrará "Por asignar" o se ocultará, alertando al administrador del vacío de información.
- **Sincronización de Reloj**: El reloj del sistema ignorará el tiempo físico del dispositivo. Usará `settings.weatherTimezone` junto con la API `Intl` para calcular la hora local de la iglesia.
- **Visibilidad de Privilegios**: Los dashboards deben consultar `schedule` y `kids_assignments` con una ventana de previsión de 60 días para que los miembros tengan visibilidad total de sus turnos.

### 3.2 Fullscreen & Admin Controls
- **Fullscreen API**: Accesible mediante un botón físico en la capa `z-[9999]` de `DisplayPage`.
- **Trigger Secreto**: 5 clics rápidos en la esquina inferior izquierda de la diapositiva de display.
- **Resiliencia al Bloqueo**: Los controles técnicos deben saltar el `DisplayLock` mediante capas de UI de alta prioridad.

## 4. Gestión de Asignaciones y Responsabilidades
- **Consultas Multi-Tabla**: `loadUserResponsibilities` debe unificar datos de `schedule` (servicios de adultos) y `kids_assignments` (servicios de niños).
- **Rango de Fechas**: Se deben mostrar asignaciones del mes en curso y del mes siguiente.
- **Mapeo de Roles**: Los privilegios se derivan directamente de las asignaciones relacionales, no del estado local del componente.

---
*Este documento es la ley suprema del repositorio. Cualquier desviación debe ser justificada o corregida de inmediato.*
