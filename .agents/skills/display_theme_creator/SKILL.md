---
name: Display Theme Creator
description: Expert system to design and implement new visual themes for the LLDM Rodeo Board display system. Use this skill whenever the user requests creating, redesigning, or updating a display theme. This skill deeply studies a reference design before writing any code.
---

# Display Theme Creator

You are operating under the **Display Theme Creator** context. Your mission is to create breathtaking, consistent, and fully functional visual themes for the LLDM Rodeo Board **display screen** (`/display`). This is the projection screen shown to the church congregation — it must be visually stunning AND preserve every piece of information it displays.

---

## ⚠️ CREATIVE MANIFESTO — READ THIS FIRST, NEVER SKIP IT

> **Every new theme must be 100% original.** You have complete creative freedom over every visual decision — backgrounds, effects, typography, layout, card shapes, animations, color theory, spacing. You must NOT copy or reference design attributes from any existing theme in the project (MidnightGlow, Glassmorphism, DarkMinimal, etc.).

**What you OWN as the designer:**
- ✅ How the clock looks and WHERE it is positioned (it can be top-left, center bottom, floating, embedded in a banner — anything)
- ✅ Which fonts to use and how they are sized, spaced, or styled
- ✅ Background treatment — gradients, textures, images, animated particles, architectural patterns, photography overlays, anything
- ✅ Card shapes — circular cards, hexagonal frames, strip tickets, no cards at all, floating labels
- ✅ Color palette — from monochrome to maximalist, from warm earth tones to neon
- ✅ Animation style — subtle fades, explosive entrances, kinetic typography, morphing shapes
- ✅ Layout composition — horizontal banners, radial arrangement, magazine mosaic, grid, asymmetric
- ✅ Visual metaphors — church architecture, stained glass, watercolor, newspaper, film, concert poster, etc.

**What you must RESPECT (the data contract):**
- ⛔ You must display ALL scheduled information — no information can be removed or hidden
- ⛔ The calendar must show all days of the month with their slot data
- ⛔ The schedule must show all assigned leaders per time slot (5am, 9am, 12pm optional, evening)
- ⛔ The weekly view must show 7 days with all slot leaders
- ⛔ Announcements must show all active announcements
- ⛔ The clock must remain functional and display real-time (even if styled radically)
- ⛔ The countdown slide is **completely independent** — it receives official graphics from the organization and must NOT be modified by this skill

**Avoid these patterns from existing themes:**
- 🚫 No dot grid textures (that's MidnightGlow)
- 🚫 No `bg-[#0F1117]` dark navy palettes (that's DarkMinimal)
- 🚫 No frosted glass overlapping cards unless you do something radically different (that's Glassmorphism)
- 🚫 No `font-orbitron` as primary font (that's MidnightGlow's identity)
- 🚫 No neon green `#A3FF57` accents (that's MidnightGlow)

---

## 🔴 CONGREGATION READABILITY STANDARDS — MANDATORY FOR ALL THEMES

> These standards exist because the display screen is projected in a worship hall. People read from **5–20 meters away**. Confusion about who is responsible for a service causes real problems. These rules are **NON-NEGOTIABLE** across every theme ever created.

### 📅 Calendar Mensual — Readability Rules

1. **Full name always** — never show only a first name. Show `Nombre Apellido`. If the full name exceeds 22 characters, show first 2 words (`Juan Hernández`, never `Juan H.` or just `Juan`).
2. **Responsibility label is mandatory** — every name must have its role label directly below it: `Consagración`, `Doctrina`, `Oración`, `Co-responsable`, `Escuela Dom.` etc. Minimum `8px font-semibold uppercase`.
3. **ALL people per day must show** — if a day has 3 slot leaders, show all 3. Never drop a person to save space.
4. **Names must be a minimum of `14px` bold** — never smaller. Use `break-words` NOT `truncate` so long names wrap instead of disappearing.
5. **Use all available horizontal space** — calendar cells are ~274px wide on 1920px screens. That's enough for a full name. Don't waste it with abbreviations.
6. **Responsibility label minimum size: `8px`** — any smaller is unreadable on a projector.

### 📆 Weekly Semanal — Readability Rules

All the Calendar rules above apply, **PLUS these additional requirements:**

7. **Avatars are HIGH PRIORITY** — show avatar photos for every leader. Never reduce to a tiny icon unless there is genuinely no space.
8. **Avatar minimum sizes by slot:**
   - Evening (vespertino) primary leader: **`w-16 h-16`** minimum (64px)
   - Evening co-leader: **`w-12 h-12`** minimum (48px)
   - 9AM consecration leader: **`w-12 h-12`** minimum
   - 9AM doctrine leader: **`w-10 h-10`** minimum
   - 5AM leader: **`w-10 h-10`** minimum
9. **Avatar style:** Always `rounded-xl overflow-hidden border border-[accent]/30` — square-rounded feels modern, not circular
10. **Avatar fallback:** Use a `User` icon on a dark background — never show a broken `<img>` or empty space
11. **Names next to avatars** must be at minimum `clamp(15px, 2vw, 22px)` — readable from the last row of seats

### 🛑 Anti-patterns — Never do these
- ❌ `truncate` on names in Calendar or Weekly — use `break-words` instead
- ❌ Names under `14px`
- ❌ Responsibility labels under `8px`
- ❌ Avatars under `40px` in Weekly
- ❌ Showing only 1 leader when 2 are assigned
- ❌ Dropping slots to save visual space — information density IS the priority

---

## 0. Context You Must Know

### Project Structure
- **Project root:** `/Users/hardglobal/Documents/LLDM_RODEO_APP/`
- **Themes folder:** `src/themes/`
- **Display page:** `src/app/display/page.tsx`
- **Admin registration:** `src/app/admin/page.tsx` (template selector list at approx line 1722)
- **Store type:** `src/lib/store.ts` (CalendarStyles.template type union must include your new ID)

### How the Theme System Works
Each theme is a folder inside `src/themes/` and must export an object matching the `Theme` interface:

```typescript
interface Theme {
    name: string;           // e.g. "Stained Glass"
    id: string;             // kebab-case e.g. "stained-glass"
    fonts: ThemeFonts;           // { primary, secondary, accent }
    fontOptions?: ThemeFonts[];  // Array of font combos
    components: {
        Background: React.Component;  // Full-screen background
        Clock: React.Component;       // Time display (you decide where/how)
        Progress: React.Component;    // Slide progress (can be null)
    };
    slides: {
        Schedule: React.Component;      // Daily schedule (isTomorrow?: boolean)
        Calendar: React.Component;      // Monthly calendar
        Weekly: React.Component;        // 7-day program
        Announcements: React.Component; // Active announcements
    }
}
```

### 🧠 Modern Architecture Pattern: Independent Controls & Animations
Each theme is designed to be self-governing. This means:
*   **Custom Animations**: Themes can have unique transition styles (e.g., the *Iglesia* theme uses a specific 'Metro Station' flow, while others use standard fades).
*   **Theme-Specific Settings**: Individual themes can expose their own variations in the Administration panel. For example, the *Iglesia* theme allows selecting between **Claro/Oscuro** and different **Transition Styles** (Metro, Breathing, Fade), independent of how other themes behave.
*   **Total Autonomy**: When designing a theme, you define not just the look but also the *feel* and the *interaction controls* available to the user in the admin dashboard.

### Data Available via Zustand Store (`useAppStore`)
```typescript
state.monthlySchedule    // Record<'yyyy-MM-dd', DailySchedule>
state.members            // Array of { id, name, avatar, avatarUrl }
state.minister           // { name, avatar, phone, email }
state.announcements      // Array of active announcements
state.settings           // churchIcon, churchLogoUrl, showMinisterOnDisplay, etc.
```

### Slot Data Reference
```typescript
// 5am slot: { leaderId, time?, customLabel?, language? }
// 9am slot: { consecrationLeaderId?, doctrineLeaderId?, sundayType?, churchOrigin?, language?, time? }
// evening slot: { leaderIds[], type?, topic?, time?, customLabel?, language? }
// 12pm slot (optional): { leaderId, time?, customLabel? }
```

### Available Fonts in Project
`font-orbitron` | `font-inter` | `font-sora` | `font-outfit` | `font-black-ops`

---

## 1. PHASE 1 — Request and Study the Reference Design

**Before any code**, ask the user for a visual reference image (mandatory):

> "Para crear el nuevo tema, necesito ver una imagen de referencia del estilo que quieres. Puede ser:  
> - Una captura de pantalla de un diseño que te inspire  
> - Un mockup, afiche, o imagen bajada de internet  
> - Una descripción muy detallada si no tienes imagen  
> ¿Me compartes la referencia?"

### Deep Analysis Protocol
Once you have the reference, analyze it across **every dimension**:

#### 🎨 Color System
- Dominant background color(s) — exact hex values if identifiable
- 2–4 accent colors and their roles (highlight, border, glow, text)
- Text hierarchy colors (primary, secondary, muted)
- Gradient directions and color stops if present
- Does the palette feel warm, cool, neutral, neon, muted, saturated?

#### 🌄 Background & Environment
- Is the background solid, gradient, textured, photographic, illustrated?
- What textures exist? (grid, noise, bokeh, architectural, fabric, geometric)
- Are there depth layers? (foreground elements, mid elements, ambient glow)
- Is the mood dark, light, or mid-tone?

#### 📝 Typography Personality
- Sans-serif, serif, display, monospace, handwritten?
- Condensed or wide form factor?
- Uppercase dominant or mixed-case?
- Letter-spacing style — tight tracking or widely spaced?
- Relative scale differences between heading, body, label

#### 🃏 Container / Card Design
- Do cards exist at all? Or is it a single full-screen composition?
- Border-radius: sharp 0px, soft 8px, pill, custom shape?
- Card background: opaque, translucent, gradient, or text-on-texture with no card?
- Borders: none, fine line, gradient border, colorful accent border?
- Shadow: none, drop, glow, inner, layered?

#### ✨ Effects & Motion
- Any glow/bloom effects?
- Any blur (glass, depth of field)?
- Any animated elements visible (shimmer, pulse, float, scan line)?
- Any gradient overlays or color shifts over content?
- Any 3D transforms (perspective, tilt, rotation)?

#### 📐 Layout & Visual Hierarchy
- Is information centered, left-aligned, or asymmetric?
- Do time/hour numbers dominate? Or are names/labels prominent?
- How are avatars/photos framed (circular, square, hexagonal, strip, with badge)?
- What draws the eye immediately upon looking at the design?
- How dense or spacious is the layout?

---

## 2. PHASE 2 — Write the Theme Specification

Present a structured **Theme Specification** for user approval before coding:

---
### 🎨 ESPECIFICACIÓN DEL TEMA: `[Theme Name]`

**ID:** `theme-id` (kebab-case for use in code)

**Concepto Visual:** [Two sentences describing the aesthetic mood and inspiration]

**Metáfora de diseño:** [The visual concept — e.g. "Vitral de catedral", "Cartel de concierto vintage", "Interfaz de cockpit aeroespacial"]

**Paleta Cromática:**
| Rol | Color | Justificación |
|-----|-------|--------------|
| Fondo base | `#______` | Textura/tratamiento |
| Container/Card | `#______` | Opacidad, blur |
| Acento primario | `#______` | Slots activos, hoy, reloj |
| Acento secundario | `#______` | Labels, bordes, indicadores |
| Texto h1 / grandes | `#______` | Nombres, horas |
| Texto body / roles | `#______` | Subtítulos |
| Texto muted | `#______` | Meta, branding |

**Tipografía:**
- Fuente principal (títulos, horas): `font-[x]` — [describir personalidad]
- Fuente cuerpo (nombres, roles): `font-[x]`
- Fuente acento (labels, caps): `font-[x]`
- Tracking labels: `tracking-[x]` · Tracking títulos: `tracking-[x]`
- Casing dominante: UPPERCASE / Mixed / Sentence

**Cards y Contenedores:**
- Forma: [rounded-3xl / sharp / pill / custom]
- Fondo: [sólido / translucido X% / sin tarjeta]
- Borde: [border-2 border-[color] / gradient border / ninguno]
- Sombra: [drop shadow parámetros / glow parámetros / ninguna]

**Fondo (`Background.tsx`):**
- Base: [descripción]
- Capa de textura: [descripción]
- Elementos ambientales: [glows, blobs, formas geométricas, etc.]
- Animación: [si existe]

**Reloj (`Clock.tsx`):**
- Posición: [corner / central / embedded in headers / floating strip]
- Forma: [circular / rectangular pill / vertical strip / badge]
- Elementos: [qué muestra además de hora: segundos, fecha, logo, etc.]

**Efectos Especiales:**
- Avatares: [cómo se enmarcan, borde, glow]
- Estado activo/LIVE: [cómo se marca el slot en curso]
- Animaciones de entrada: [spring / fade / slide / scale]
- Indicador hoy en calendario: [descripción]
---

Wait for user approval before coding. If the user requests changes, update the spec.

---

## 3. PHASE 3 — Build the Theme Files

Directory structure:
```
src/themes/[ThemeName]/
├── index.ts
├── Background.tsx
├── Clock.tsx
├── Progress.tsx
├── [Name]Schedule.tsx
├── [Name]Calendar.tsx
├── [Name]Weekly.tsx
└── [Name]Announcements.tsx
```

### File Rules

#### `Background.tsx`
- `div` with `className="absolute inset-0 z-0 overflow-hidden pointer-events-none"`
- All decorative layers inside
- Can use `motion.div` for ambient animations
- **Must reflect the approved spec — no recycled patterns from other themes**

#### `Clock.tsx`
- Props: `{ now: Date, isMounted: boolean, settings: any }`
- Must show at minimum: current time (HH:mm), seconds, date in Spanish
- Must show church logo/icon via `settings`
- **Positioning and visual form are yours to decide — NOT fixed bottom-right required**
- Use `format(now, 'HH:mm')`, seconds via `now.getSeconds()`, date via `format(now, 'EEEE, d MMMM', { locale: es })`
- SVG seconds ring is optional — use only if it fits your design

#### `Progress.tsx`
- Props: `{ slides?: any[], currentSlide: number }`
- Optional — can return `null`
- Or implement something visually creative that fits the theme

#### `[Name]Schedule.tsx` — **CRITICAL — ALL DATA MUST SHOW**
Required fields (ALWAYS render, never omit):
- Slide title: "Agenda del Día" / "Agenda de Mañana" (`isTomorrow`)
- Display date with tomorrow logic
- **5AM card**: time, label, leader name + avatar, LIVE badge if active
- **9AM card** (weekday): consecration leader + doctrine leader, LIVE badge if active
- **Sunday 9AM**: switch to `sundayType` display (local/exchange/broadcast/visitors)
- **Evening card**: featured/prominent, supports 1 or 2 leaders with `type` awareness (married=side by side, standard=dual, single=centered), LIVE badge
- **12PM card**: only if `slot12pm?.leaderId` exists
- Language badge: "EN" when `language === 'en'`
- Footer branding

`isSlotActive()` logic: compare current time vs slot start/end times. Preserve this logic exactly.

Avatar patterns to support:
- Single leader → centered
- Married (2 + `type:'married'`) → overlapping or side-by-side
- Dual standard (2 + `type:'standard'`) → dual layout
- Minister Sunday (type:'local') → show `minister.avatar`

#### `[Name]Calendar.tsx` — **CRITICAL — ALL DAYS MUST SHOW**

> [!IMPORTANT]
> See the **CONGREGATION READABILITY STANDARDS** section above. Every rule there applies here.

Required:
- `DOM LUN MAR MIÉ JUE VIE SÁB` header
- Full month grid with blank offset cells
- Per-day cell: day number, ALL assigned leaders for 5AM / 9AM / evening slots
- Each leader shown with: **full name (`14px+` bold, `break-words`)** + **responsibility label (`8px+`)**
- Dividers between sections within cells
- Today cell: visually distinct with accent color
- Time badge (5AM / 9AM / PM) as a small colored label above each slot group
- Bottom dot indicators per assigned slot
- **NEVER use `truncate` on names. Use `break-words` or `overflow-hidden` on the container instead.**

#### `[Name]Weekly.tsx` — **CRITICAL**

> [!IMPORTANT]
> See the **CONGREGATION READABILITY STANDARDS** section above. Every rule there applies here. Avatar priority is HIGH.

Required:
- 7 columns (today + next 6 days)
- Per column: day name + date number (large) + 3 service rows (5am / 9am / evening)
- Each leader: **large avatar (`w-10`→`w-16` depending on slot importance)** + **full name (`clamp(15px,2vw,22px)` bold)** + **responsibility label (`9px` bold uppercase)**
- Avatar sizes mandatory: Evening primary=`w-16 h-16`, Evening co=`w-12`, 9AM Cons=`w-12`, 9AM Doc=`w-10`, 5AM=`w-10`
- Avatar style: `rounded-xl overflow-hidden border border-[accent]/30`
- Today column: distinct highlighted state (border, background tint, accent color on text)
- Sunday 9am: show `sundayType` label + Crown icon instead of leader name
- All names: `break-words` not `truncate`

#### `[Name]Announcements.tsx` — **CRITICAL**
Required:
- All active announcements from `state.announcements.filter(a => a.active)`
- Per announcement: title (prominent), content/body, urgency indicator (`priority > 0`)
- Optional: minister sidebar (when `settings.showMinisterOnDisplay`)
- Empty state when no announcements

---

## 4. PHASE 4 — Register the Theme

### Step 4.1 — Add to `src/themes/index.ts`
```typescript
import { [ThemeName]Theme } from './[ThemeName]';

// In ALL_THEMES:
'[theme-id]': [ThemeName]Theme,
```

### Step 4.2 — Add to Admin Type (`src/lib/store.ts`)
Extend the `template` type in `CalendarStyles`:
```typescript
template: 'modern' | 'minimalist' | 'broadcast' | 'midnight-glow' | 'dark-minimal' | '[theme-id]';
```

### Step 4.3 — Add to Admin UI (`src/app/admin/page.tsx`)
Find the theme options array (search for `{ id: 'midnight-glow'`) and add:
```typescript
{ id: '[theme-id]', label: '[Theme Display Name]' }
```

---

## 5. PHASE 5 — Verification

### Functional Completeness Checklist
- [ ] All leaders render without errors (handle null/undefined with `|| 'Por Asignar'`)
- [ ] `isTomorrow` → tomorrow's date and title
- [ ] LIVE badge only on `isSlotActive() === true`
- [ ] Calendar shows correct blank offset (startDay = `getDay(startOfMonth(today))`)
- [ ] Today cell distinctly highlighted
- [ ] Clock shows real-time seconds updating
- [ ] Church logo renders from `settings`
- [ ] Language "EN" badge appears when `language === 'en'`
- [ ] Empty states: "sin programa", "sin anuncios", etc.
- [ ] No slots missing from calendar cells
- [ ] 12pm slot conditional rendering

### Visual Integrity Checklist
- [ ] Background matches spec
- [ ] Clock position and visual form match spec
- [ ] Typography scale consistent across all slides
- [ ] Accent color usage consistent (same role = same color on all slides)
- [ ] Card styles identical across slides
- [ ] No design attributes copied from MidnightGlow, Glassmorphism, or DarkMinimal
- [ ] Theme has a distinct, recognizable identity of its own

### No Information Loss Checklist
- [ ] 4+ time slots shown in schedule (5am, 9am, optional 12pm, evening)
- [ ] All calendar days visible (no cut-off on long months)
- [ ] Member names truncate with `truncate` class (not overflow: hidden cutting text)
- [ ] All active announcements displayed

---

## 6. PHASE 6 — Present the Result

1. Tell the user the exact steps to activate: **Admin → Configuración → Temas y Estilos → `[Theme Display Name]` → Aplicar y Guardar Todo**
2. Open the display in the browser and take a screenshot
3. Report any known edge cases or future improvements

---

## Key Reminders

> [!CAUTION]
> **NEVER hardcode dates.** Always use `new Date()` and `format(date, ...)`. Hardcoded dates like `'2026-03-01'` cause the display to show stale data.

> [!CAUTION]
> **CONGREGATION READABILITY IS NON-NEGOTIABLE.** Names must be readable from the back of a worship hall. Minimum 14px for Calendar names, 15px for Weekly names. Full name + last name always. Responsibility labels minimum 8px. Avatars minimum 40px in Weekly.

> [!WARNING]
> All components must start with `'use client';` — they use hooks and framer-motion.

> [!WARNING]
> The countdown slide is **completely independent** — it receives official organization graphics. Do NOT create or modify countdown-related components.

> [!TIP]
> For avatar images, always wrap in `overflow-hidden` container and add a gradient overlay:
> `<div className="absolute inset-0 bg-gradient-to-t from-[background]/40 to-transparent" />`  
> This integrates photos into any theme style.

> [!TIP]
> The display screen is **1920×1080px** (16:9). Design at full scale. Root element: `fixed inset-0` or `h-full w-full`. Cards use `px` sizing for pixel precision.

> [!NOTE]
> Don't be afraid to explore radical layouts. A schedule showing huge typographic hour numbers with tiny leader names overlaid. A calendar that looks like a physical wall calendar with handwritten-style fonts. A weekly view arranged as a horizontal timeline with photos as the focal point. The congregation will appreciate a truly unique and memorable visual experience.
