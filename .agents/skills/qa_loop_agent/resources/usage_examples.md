# QA Loop Agent — Ejemplos de Uso

## Ejemplo 1: Nuevo Componente UI

### Request del Usuario
> "Crea un componente `StatCard` en el DashboardTab que muestre el número de miembros activos con un ícono y variación porcentual"

### Criterios Derivados Automáticamente
1. Componente `StatCard` existe en `DashboardTab.tsx` o archivo propio
2. Muestra número de miembros activos (dato de Supabase)
3. Incluye ícono visual
4. Muestra variación porcentual (vs período anterior)
5. Usa Tactile UI (TactileGlassCard como contenedor)
6. Compatible con los temas del sistema

### Ciclo 1 — Evaluación típica
| Criterio | Estado | Notas |
|----------|--------|-------|
| Componente StatCard existe | ✅ | Creado en DashboardTab.tsx |
| Muestra miembros activos | ✅ | Query a tabla `miembros` con filtro `activo=true` |
| Incluye ícono | ❌ | No se importó ningún ícono de lucide-react |
| Variación porcentual | ⚠️ | Calculada pero no formateada (muestra 0.3333 en lugar de 33%) |
| Usa TactileGlassCard | ✅ | Correcto |
| Compatible con temas | ⚠️ | Color del badge hardcodeado como `#22c55e` en lugar de `var(--success)` |

### Corrección Ciclo 1
- Agregar `import { Users } from 'lucide-react'` y `<Users size={20} />` en el header
- Cambiar `{variation}` por `{(variation * 100).toFixed(1)}%`
- Cambiar `color: '#22c55e'` por `color: 'var(--success)'`

### Ciclo 2 — Post-corrección
| Criterio | Estado |
|----------|--------|
| Ícono | ✅ |
| Variación formateada | ✅ |
| Color temático | ✅ |

**→ 🎯 QA APROBADO en Iteración 2**

---

## Ejemplo 2: Bug Fix

### Request del Usuario
> "El HorariosTab no guarda el líder del servicio de las 5AM, arréglalo"

### Criterios Derivados
1. Al seleccionar un líder en el slot 5AM, se guarda en Supabase
2. Al recargar la página, el líder guardado persiste
3. No se rompe la funcionalidad de los otros slots (9AM, 12PM, tarde)

### Proceso QA
Ciclo 1: Busca en `HorariosTab.tsx` la función de guardado para el slot 5AM.
Verifica que el `id` del slot 5AM sea correcto en la query de upsert.
Verifica que el `useEffect` de carga inicial incluya el slot 5AM.

---

## Cuándo NO usar este Skill

- Tareas de investigación pura (no hay entregable que verificar)
- Preguntas conceptuales del usuario
- Cuando el usuario dice explícitamente "no necesito revisión"
