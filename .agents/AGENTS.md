# LLDM Rodeo Workspace Rules & Design Principles

This document defines critical rules, architecture patterns, and design principles specific to this workspace to prevent regressions and maintain cloneability.

---

## 1. Multi-Tenant & Template Cloneability

The LLDM Rodeo portal is designed to be easily cloned and deployed by other churches. Hardcoding values that are specific to a single church location or setting is prohibited.

### Weather & Location Integration
- **Unified Settings**: Always query weather location parameters from `app_settings` (`weatherLat`, `weatherLng`, `weatherCity`, `weatherTimezone`). Never use theme-specific config parameters like legacy `neonForgeCityData`.
- **Automatic Geocoding**:
  - The `weatherCity` setting (usually a ZIP code or city/state name) is edited by the user in the admin panel.
  - Typing in the `weatherCity` input must set `weatherLat` and `weatherLng` to `null` to invalidate old coordinates.
  - When saving settings, the application must automatically fetch geocoded coordinates from the Open-Meteo API if `weatherLat` or `weatherLng` are `null`.
- **Safe Fallbacks**: If coordinates are missing or `null` during startup, fallback values must consistently point to the template default: Rodeo, CA (`38.033`, `-122.273`) with timezone `America/Los_Angeles`.
- **Z-Index Layering**: The `QROverlay` component must remain on the bottom left corner (`left-12 bottom-6`) with `z-[250]` to avoid overlaps with the weather/clock widget (`MidnightGlowClock`) or fullscreen controls on the bottom-right.

---

## 2. Display Page Layout Sizing

To prevent columns or calendar slots from cutting off in different viewport sizes or templates:
- Always use `min-w-0` on columns in flex containers (e.g. `MidnightGlowWeekly` grid).
- Ensure that name cards or slots do not cause layout expansion by allowing truncation (`truncate` with `min-w-0`).

---

## 3. High-Efficiency Image Optimization (WebP)

To maintain page load speed and keep database asset sizes light:
- **WebP Output Enforced**: All compressed images must be exported as `image/webp` with a target quality of `0.8` to `0.85` inside `compressImage` and `ImageEditor`.
- **Filename Extension**: Always save image files using `.webp` extensions rather than `.jpg` or `.png`.

---

## 4. Frameless Display Page Elements ("Sin Caja")

To integrate display elements cleanly on projection backgrounds:
- **No Background/Border Frames**: Display column panels for Ministers and Supervisors must float border-free and background-free directly on the slide background.
- **Square Aspect Ratio**: Photos in settings and member details must use a 1:1 square crop box (`aspectRatio={1}`).

---

## 5. Custom Special Service Titles (Servicios Especiales)

To allow precise display of special events/services on the boards:
- **Custom Title Input**: The administrator can set a custom title (`customLabel` / `evening_custom_label`) specifically for services of type `special` in the evening slot.
- **Dynamic Fallback**: If the service type is `special` and no `customLabel` is written, all display themes (including Midnight Glow, Luna Premium, and Iglesia) must fall back to showing "Servicio Especial" (or "Special Service" in English), instead of defaulting to generic labels like "Oración de la Tarde" or "Oración Regular".
- **Dynamic Render**: When `customLabel` is populated, themes must render the custom label text in uppercase/proper case as the service title.

