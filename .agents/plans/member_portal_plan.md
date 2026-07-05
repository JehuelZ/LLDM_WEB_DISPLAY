# Portal del Miembro — Plan de Implementación
**Fecha**: 2026-07-05  
**Estatus**: 🟡 Planificado — Pendiente de ejecución

---

## Resumen

Crear un **Portal Personal del Miembro** accesible desde celular (móvil/PWA),
con **registro cerrado**: solo miembros ya registrados en Supabase pueden activar cuenta.
Acceso promovido mediante QR codes en la pantalla `/display` de la entrada de la iglesia.

---

## Regla de Oro del Sistema

> **El miembro no "crea" una cuenta. El miembro "reclama" la cuenta que ya existe para él.**

- Nadie externo a la base de datos puede registrarse
- El admin habilita el acceso por miembro (`portal_habilitado = true`)
- La verificación se hace por Nombre + Teléfono (datos ya en el sistema)

---

## Nuevas Rutas

| Ruta | Descripción |
|------|-------------|
| `/activar` | Página pública de reclamación de cuenta |
| `/activar?token=xxx` | Acceso directo por link de invitación del admin |
| `/portal` | Dashboard personal protegido del miembro |

---

## Contenido del Portal `/portal`

| Sección | Qué muestra |
|---------|-------------|
| Mis Privilegios | Roles y servicios asignados del mes |
| Mi Horario | Próximos servicios donde el miembro participa |
| Anuncios | Comunicados relevantes a su grupo (`member_group`) |
| Lista de Oraciones | Peticiones del mes/semana/día |
| Mi Coro | Solo si `privileges` incluye `'choir'` |
| Mis Mensajes | Mensajes del admin dirigidos al miembro |

---

## Cambios en Base de Datos

```sql
-- Ejecutar en Supabase SQL Editor
ALTER TABLE profiles ADD COLUMN portal_habilitado boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN portal_invite_token text;
ALTER TABLE profiles ADD COLUMN portal_invite_expires timestamptz;
```

---

## QR Codes en `/display`

- Overlay fijo en esquina inferior derecha (encima de los slides)
- QR 1: Link a `/display` (ver pantalla en celular)
- QR 2: Link a `/activar` (activar cuenta de miembro)
- Librería: `qrcode.react`

---

## Fases de Implementación

- [ ] **Fase 1** — SQL: 3 campos nuevos en Supabase
- [ ] **Fase 2** — `/activar`: formulario de reclamación con validación cerrada
- [ ] **Fase 3** — Store: `enablePortalAccess()` + `generateInviteToken()`
- [ ] **Fase 4** — MiembrosTab: botón "Invitar al Portal" + toggle de acceso
- [ ] **Fase 5** — `/portal`: dashboard personal del miembro
- [ ] **Fase 6** — `/display`: QR overlay fijo en esquina
- [ ] **Fase 7** — PWA: manifest.json para instalación móvil

---

## Referencias Técnicas

- Auth actual: `src/lib/store.ts` → función `mergeProfiles()` (línea 1287)
- Tipo miembro: `src/lib/store.ts` → interface `UserProfile` (línea 118)
- Display: `src/app/display/page.tsx` → array `slides` (línea 192)
- Admin miembros: `src/app/admin/tabs/MiembrosTab.tsx`
