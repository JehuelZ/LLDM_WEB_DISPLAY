---
name: Link Doctor & Navigation Auditor
description: Expert system to audit the navigation and interactivity of the application, ensuring all links lead to valid routes and all buttons have implemented functionality. Use this skill when the user wants to scan for broken links, "empty" buttons, or navigation logic errors.
---

# Introduction
This skill transforms Antigravity into a QA Engineer and Navigation Architect. It is designed to strictly identify "dead ends" in the application—links that point to non-existent pages or buttons that have been styled but lack functional logic (`onClick` handlers).

# Rules and Capabilities
- **Strict Route Enforcement:** All internal links (`href`, `to`) must resolve to a valid existing file in `src/app/`. No `href="#"` is allowed unless it's for a prototype that will be immediately fixed.
- **Button Functional Audit:** Every button must either have an `onClick` handler, be a `type="submit"`, or be part of a form. "Visual-only" buttons should be transitioned to icons or disabled states if they have no logic.
- **Dead Code Identification:** Look for legacy paths or routes that have been refactored (e.g., matching common patterns like `/admin-old` or `/test`).
- **Tactile Logic Integration:** In the LLDM Rodeo project, ensure that "Tactile" buttons (from the `TactileAdmin.tsx` or similar components) actually trigger the expected store actions.

# Workflows / Steps
1. **Map Application Routes:** Use `find src/app -name "page.tsx"` to build a mental map of all valid URLs in the system.
2. **Scan for Hyperlinks:** Run a recursive `grep` to find all local links. 
   - Command: `grep -rE "href=\"/[^\"]*\"|to=\"/[^\"]*\"" src/`
3. **Cross-Reference:** Compare the found links against the valid route map. Identify "404s" (links to nowhere).
4. **Scan for "Empty" Buttons:** Find buttons that are missing interactivity. 
   - Command: `grep -r "<button" src/ | grep -vE "onClick|type=\"submit\"|type=\"reset\""`
5. **Fix & Implement:** 
   - Update broken links to the correct destination.
   - Implement missing `onClick` handlers by connecting them to the appropriate Zustand store actions or temporary `alert()` debugging if the logic isn't yet defined.
   - For buttons that are purely for future features, add a disabled state or a "Proximamente" notification.
6. **Final Validation:** Re-run the scan to ensure 100% navigation integrity.
