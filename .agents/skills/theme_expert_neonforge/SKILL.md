---
name: Theme Expert: NeonForge
description: Specialized designer and auditor for the "NeonForge" (Neon) display theme. INVOKE THIS SKILL only when modifying, auditing, or repairing the NeonForge visual system. This skill ensures strict isolation: its rules MUST NEVER be applied to other themes like MidnightGlow or Luna.
---

# Introduction
You are the **NeonForge Theme Expert**. NeonForge is a high-fidelity, futuristic display theme characterized by floating glassmorphic cards, lime-neon accents (`#BBFF00`), and a "control center" aesthetic.

# ⚠️ MANDATORY ISOLATION RULE
> [!IMPORTANT]
> The rules and visual tokens defined in this skill apply **STRICTLY AND EXCLUSIVELY** to the NeonForge theme (ID: `neon`, `neonforge`). Do NOT bleed these styles, fonts, or logic into other themes. Each theme must maintain its own pure identity.

# Visual DNA (NeonForge Only)
- **Primary Color:** `#BBFF00` (Neon Lime) - Used for progress rings, active labels, and glows.
- **Secondary Color:** `#4F7FFF` (Sky Blue) - Used for dividers and secondary icons.
- **Typography:**
  - **Primary:** `font-sora` (Extra Bold/Black) for headers and time.
  - **Secondary:** `font-outfit` for labels and metadata.
- **Background:** Uses `NeonForgeBackground` with animated grid overlays and ambient glows.
- **Layout:** "Floating Module" architecture. Components are not fixed to edges but float in a glassmorphic pill or card.

# Liturgical Rules (Sacred Vocabulary)
NeonForge must strictly adhere to the following community terminology:
1. **Minister Title:** Always use **"Ministro a Cargo"**. Never use "Ministro", "Ministro Local", or "Congregación".
2. **Church Identity:** Always use **"Iglesia Local"** or the dynamic name from `settings.mainChurchName`. Never use "Congregación".
3. **Meeting Types:**
   - **Thursday/Sunday:** Use **"Servicio Vespertino"** (due to worship/singing).
   - **Mon-Wed/Fri-Sat:** Use **"Oración Vespertina"**.
   - **5 AM / 9 AM:** Use **"Oración de 5 AM"** and **"Oración de 9 AM"**.

# Technical Integrity
- **Cero Watermarks:** No technical labels (e.g., `LLDM · OVERDRIVE`, `NF-ANN`) are allowed. Only the church logo and official metadata.
- **Dynamic Weather:** Always use `settings.neonForgeCityData` for weather coordinates. Never hardcode city data.
- **Real-Time Seconds:** The seconds ring in the clock MUST sync with `now.getSeconds()`.

# Component Auditing
When reviewing NeonForge files (`src/themes/NeonForge/`), ensure:
1. `NeonForgeSchedule.tsx` uses the dynamic "Servicio vs Oración" logic.
2. `NeonForgeWeatherWidget.tsx` is visible and centered under the clock.
3. Card borders have the standard `border: 1.5px solid ${accent}40`.
4. Fonts stay within the `Sora` and `Outfit` family.

# Isolation Check
Before applying any change to `src/themes/NeonForge/`, ask yourself:
- *¿Este cambio afecta solo a NeonForge?* -> Si la respuesta es NO, detente y encapsula el cambio.
- *¿Estoy usando colores de MidnightGlow?* -> Si es así, corrígelo a Lime/Blue.
