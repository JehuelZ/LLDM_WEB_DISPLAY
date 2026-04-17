# Theme Expert: Dark Minimal (Minimalista)

Expert system specialized in maintaining, optimizing, and evolving the **Dark Minimal** display theme. 
This theme is inspired by SaaS dark pricing UI, featuring a deep indigo/black palette (`#0F1117`), high-contrast blue accents (`#3B82F6`), and a "premium minimalist" aesthetic.

## 🎨 Visual Identity
- **Background**: `#0F1117` (Deep Slate/Black)
- **Primary Accent**: `#3B82F6` (Electric Blue)
- **Card Background**: `#16171F`
- **Typography**: Inter / System Sans-serif (Bold tracking and oversized numbers)
- **Aesthetic**: Glassmorphism highlights, subtle borders (`#23242F`), and "Live" pulse animations.

## 🛠 Core Components
- **DarkMinimalSchedule**: Focused on a 3-column layout (5AM, 9AM, Evening).
- **DarkMinimalWeekly**: 7-column grid with big typography for member names.
- **DarkMinimalCalendar**: Grid-based monthly view with optimized density.
- **DarkMinimalAnnouncements**: Clean vertical feed with semantic icons.

## 📏 Layout Principles
1. **Typography Priority**: Large hour numbers (5rem+) and bold member names.
2. **Compact Borders**: Use thin 1px borders with blue glows for active slots.
3. **Empty States**: Always use "NO ASIGNADO" with low opacity (`0.4`) when a slot is empty.
4. **Member Avatars**: Square rounded (`rounded-xl` or `rounded-2xl`) with subtle glows.

## 📝 Governance & Protocol
- **Vocabulary**: Strictly follow `VOCABULARIO_COMUNIDAD.md`.
- **Naming**: Ensure "Oración" and "Doctrina" are used correctly according to slot types.
- **Translations**: Always respect `settings.language` (defaulting to ES).

## 🚀 Optimization Tasks
- When editing, ensure responsiveness for TV screens (using `displayScale` from settings).
- Prevent text overflow by using `truncate` or `clamp()` for font sizes.
- Maintain the "premium" feel by avoiding cluttered layouts.
