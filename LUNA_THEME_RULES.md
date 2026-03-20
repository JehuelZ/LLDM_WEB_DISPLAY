# LUNA PREMIUM THEME RULES (MASTER)

## 1. Visual Aesthetics (Kinetic Observatory)
- **Background**: Diagonal gradient from `#626c87` (top-right) to `#2b3043` (bottom-left).
- **Cards/Boxes**: Diagonal gradient from `#2b2e41` (top-right) to `#1b1d2c` (bottom-left).
- **Borders & Corners**: No borders, no rounding (`rounded-none`, `border-none`).
- **Shadows**: Deep, soft dark shadows (`shadow-4xl` or manual `rgba(0,0,0,0.8)`).
- **Monolithic Design**: Elements should look like solid blocks of data without separation lines.

## 2. Typography & Casing
- **Font Family**: Saira (Google Fonts).
- **Base Weights**: 100 (Thin) for body/descriptions, 200 (Extra Light) for metrics/titles.
- **Color**: Pure White (`#ffffff`) for ALL texts. Solid, no opacities (`text-white/40` is forbidden for labels).
- **Casing**: ALL labels and titles must be in **lowercase** (e.g., "growth projections", "identity: verified").
- **Alignment**: Box titles must always be aligned to the **left**.

## 3. LunaDonut Component (Standard)
- **Structure**: Title at the top-left, centered percentage metric, horizontal pill legend at the bottom.
- **Donut Width**: Stroke width 8px. Line caps: `round`.
- **Colors**:
  - **Active Segment**: Industrial Gold Gradient (`#cc9900` to `#b45309`) with intense glow.
  - **Remaining Segment (Track)**: Sacred Gray **`#525469`**.
- **Legend**: Two horizontal pill markers with numerical values below.

## 4. Density Matrix (Weekly Distribution)
- **Style**: Segmented bars with specific industrial palette:
  - **Morning**: Emerald (`#10b981`)
  - **Intermediate**: Indigo (`#6366f1`)
  - **Evening**: Amber (`#f59e0b`)
- **Glow**: Subtle sharp glows per segment. Clean background (no grid lines).

## 5. Line Charts (Trend Indicators)
- **Style**: Smooth, fluid neon curves with high glow deviation (stdDeviation="5").
- **Highlight**: Single white point with gold halo for key data markers.
- **Minimalism**: No vertical axis. X-axis with lowercase day labels ('mo', 'tu'...).

## 6. Color Exceptions (System States)
- **Emerald (#10b981)**: For active status indicators or small graphical dots (verified states).
- **Red/Amber**: Only for critical alerts or specific chart segments.
- **Text in Exceptions**: Even if an indicator is colored, the associated TEXT remains White.
