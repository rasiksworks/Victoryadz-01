# VictoryAdz Development & Preservation Rules

> **CRITICAL MANDATE FOR ALL AI AGENTS AND DEVELOPERS**:
> Prioritize preserving existing visual designs, animations, and custom styling across all landing page sections.

---

## 1. Scope & Component Isolation Rule
- **Admin Panel Separation**: All Admin Panel code, state management, and dashboard components MUST live inside isolated directories:
  - Pages/Routes: `app/admin/**`
  - Components: `components/admin/**`
  - API Routes: `app/api/admin/**`
- **Zero Impact on Existing Sections**: Never mutate, rewrite, or reset public page components (`we-most-proud-of.tsx`, `brand-vision-section.tsx`, `gallery-tunnel.tsx`, `hero-03/*`) when implementing admin features or backend APIs.

---

## 2. CLI Generator Safeguard (No Overwrites)
- **Do NOT re-add existing components**: Never run `npx originkit add`, `npx shadcn@latest add`, or template generators against existing files.
- **Manual Incremental Edits Only**: Edits to existing components MUST be performed line-by-line using targeted edits. Replacing entire file contents with boilerplate is strictly forbidden.

---

## 3. Data Integrity & Schema Preservation
- **`site-images.json` Integrity**: The `exploreGrid` dataset MUST maintain 15 items in a 5-column x 3-row layout structure unless explicitly instructed by the user.
- **Fallbacks & Safety**: Always provide safe fallbacks if dynamic admin data is missing or loading, preventing visual blanking or layout crashes.

---

## 4. Animation & Scroll Integrity
- **Lenis & GSAP Sync**: Always preserve Lenis smooth scroll and GSAP `ScrollTrigger` bindings (`ScrollTrigger.refresh()`).
- **WebGL Safety**: Do NOT add blocking `try/catch` returns that render 3D canvases blank. Ensure `reactStrictMode` is set appropriately in `next.config.mjs`.
