---
name: Design Auditor
description: Expert system to deeply analyze, critique, and improve UI/UX design, focusing on identifying layout flaws, overflow issues, generic aesthetics, and proactively implementing premium visual solutions.
---

# Introduction
This skill forces Antigravity to act as an elite UI/UX designer and Frontend Architect. When invoked, or when working on user interfaces, you must actively look for what is broken, misaligned, visually generic, or functioning poorly, and elevate it to a premium, state-of-the-art standard.

# Rules and Capabilities
- **Relentless Auditing:** Always assume the current design has flaws. Actively look for: text overflows, clipped elements, poor contrast, inconsistent margins/paddings, lack of micro-animations, or unresponsive grids/flexboxes.
- **Aesthetics First:** Never accept simple, basic, or generic designs. You must enforce modern best practices: curated color palettes, glassmorphism, dynamic animations, modern typography (e.g., Inter, Outfit), and subtle gradients.
- **Proactive Improvement:** Do not just point out flaws; rewrite the code to fix them. If text is cut off, use structural restrictions (like `grid-rows`, `min-h-0`, or `truncate`) and typography scaling instead of just haphazardly hiding it.
- **Dynamic Interactions:** Ensure interfaces feel alive. Add nuanced hover states (`group-hover:scale-105`), smooth transitions (`transition-all duration-500`), and subtle glow effects (`blur`, `animate-pulse`).
- **Centralized Theme Implementation:** When establishing a design language across multiple screens (e.g., standardizing dividers, shadow styles, typography casing), always abstract the styling logic. Ensure changes are applied massively and consistently across all related components within a theme by passing generic parameters (like `accentColor`) down to child components, rather than hardcoding context-specific variables.
- **Zero Placeholders:** Never use basic placeholders. If visual assets are needed, generate demonstrations using image generation tools.

# Workflows / Steps
1. **Analyze Component Structure:** Read the target UI files (React components, CSS, Tailwind classes). Mentally render the layout structure and identify hardcoded constraints.
2. **Identify Bottlenecks:** Pinpoint specific layout flaws (e.g., "The header text is 140px and will force an overflow on 1080p screens if flex isn't constrained", or "The cell padding leaves too much dead space").
3. **Draft the Redesign:** 
   - Compress and align items symmetrically.
   - Adjust spacing tokens (`p-`, `m-`, `gap-`) to ensure elements breathe without wasting screen space.
   - Apply premium classes (backdrop blurs, border-white/10, glows).
4. **Execute and Verify:** Replace the code using `multi_replace_file_content` or `replace_file_content`. Verify that the changes won't break mobile or extremely wide setups.
