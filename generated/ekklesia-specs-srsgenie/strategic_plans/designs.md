# DESIGN SYSTEM DOCUMENTATION
## AI-Generated Design System Specification

**Document Type:** Design System Specification  
**Document Version:** 1.0  
**Project Name:** Ekklesia  
**Product Name:** Ekklesia Platform  
**Design System Name:** Agape Helix UI  
**Document Status:** Approved  
**Prepared By:** AI Design System Architect Agent (SpecAgent)  
**Design Owner:** Principal UI/UX Architect  
**Date Created:** 2026-11-24  
**Last Updated:** 2026-11-24  
**Target Release:** v1.0.0

---

# SECTION 1 — DESIGN SYSTEM OVERVIEW

## 1. Design System Identification

### 1.1 Design System Information

| Field | Details |
|---|---|
| Design System Name | Agape Helix UI |
| Design System ID | DS-EKKLES |
| Product | Ekklesia |
| Design System Version | 1.0.0 |
| Design System Type | Product-Specific Design System |
| Supported Platforms | Web (Desktop, Tablet, Mobile Responsive) |
| Design Owner | Staff Product Designer |
| Implementation Framework | React 19 / TypeScript / Tailwind CSS |
| Component Library | Custom Tailwind CSS Preset + Headless Radix Primitives |
| Design Tool | Figma Tokens Studio |
| Theme Support | Dark Mode (Default) & Light Mode with System Auto-detection |
| Accessibility Target | WCAG 2.1 Level AA Compliant |
| Status | Approved |

### 1.2 Design System Purpose
Agape Helix UI provides an authoritative design token foundation, accessible component library, and consistent interaction guidelines for Ekklesia, ensuring high developer velocity and interface polish.

### 1.3 Design System Vision
Deliver a seamless, high-contrast, keyboard-first user experience that feels precise, responsive, and fatigue-free during long operational shifts.

---

# SECTION 2 — DESIGN PHILOSOPHY AND PRINCIPLES

## 2. Design Philosophy

### 2.1 Visual Personality
- **Technical & Purposeful:** Clear visual hierarchy with zero unnecessary ornamentation.
- **High-Density & Readable:** Dense data layouts with strict 8px spatial grid alignment.
- **Responsive & Optimistic:** Instant visual feedback with optimistic UI transitions.

### 2.2 Design Principles
1. **Consistency:** Single source of truth for all color, type, and spacing tokens.
2. **Clarity:** Immediate state differentiation (Loading, Empty, Success, Error).
3. **Accessibility First:** High contrast (minimum 4.5:1 text ratio) and full keyboard navigability.
4. **Predictability:** Standardized modal, drawer, and table interaction mechanics.

---

# SECTION 4 — DESIGN TOKEN ARCHITECTURE

## 4. Design Token System

### 4.1 Token Layers
- **Layer 1: Primitive Tokens** (Raw values: `slate-950`, `indigo-500`, `spacing-4`, `radius-md`)
- **Layer 2: Semantic Tokens** (`color.background.primary`, `color.text.secondary`, `spacing.gap.component`)
- **Layer 3: Component Tokens** (`button.primary.bg`, `table.header.bg`, `input.border.focus`)

### 4.2 Token Naming Convention
`category.property.variant.state` (e.g., `color.surface.raised.hover`)

---

# SECTION 5 — COLOR SYSTEM

## 5. Color Architecture

### 5.1 Semantic Color Mapping

| Semantic Token | Light Theme | Dark Theme | Purpose |
|---|---|---|---|
| `color.background.primary` | `#f8fafc` (Slate 50) | `#090d16` (Deep Ink) | Main application canvas |
| `color.background.surface` | `#ffffff` (Pure White) | `#121826` (Box Surface) | Cards, modals, sidebars |
| `color.border.default` | `#e2e8f0` (Slate 200) | `#1e293b` (Slate 800) | Card boundaries, dividers |
| `color.text.primary` | `#0f172a` (Slate 900) | `#f1f5f9` (Slate 100) | High-emphasis headings, data |
| `color.text.secondary` | `#64748b` (Slate 500) | `#94a3b8` (Slate 400) | Labels, descriptions, meta |
| `color.accent.primary` | `#4f46e5` (Indigo 600) | `#6366f1` (Indigo 500) | CTAs, active pills, links |
| `color.accent.cyan` | `#0891b2` (Cyan 600) | `#06b6d4` (Cyan 500) | Telemetry, stats, badges |
| `color.status.success` | `#16a34a` (Green 600) | `#22c55e` (Green 500) | Completed state, 200 OK |
| `color.status.error` | `#dc2626` (Red 600) | `#ef4444` (Red 500) | Error banners, destructive actions |

---

# SECTION 6 — TYPOGRAPHY SYSTEM

## 6. Typography Foundation

### 6.1 Font Families
- **Display Headings:** `Space Grotesk`, sans-serif (Weights: 600, 700)
- **Body & UI Text:** `Inter`, system-ui, sans-serif (Weights: 400, 500, 600)
- **Code & Telemetry:** `JetBrains Mono`, monospace (Weight: 400, 500)

### 6.2 Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| `type.display.xl` | 36px (2.25rem) | 700 | 44px | -0.02em | Hero titles, landing headers |
| `type.heading.lg` | 24px (1.5rem) | 600 | 32px | -0.01em | Dashboard page headers |
| `type.heading.md` | 18px (1.125rem)| 600 | 26px | -0.005em| Section titles, card headers |
| `type.body.md` | 14px (0.875rem)| 400 | 20px | 0 | Standard table cells, form labels |
| `type.body.sm` | 12px (0.75rem) | 400 | 16px | 0.01em | Helper captions, timestamp tags |
| `type.code.sm` | 12px (0.75rem) | 400 | 16px | 0 | API endpoints, UUIDs, DDL |

---

# SECTION 7 — SPACING AND DIMENSION SYSTEM

## 7. Spacing Foundation
Base unit: **4px / 8px grid system**

| Token | Value | Tailwind Class | Usage |
|---|---|---|---|
| `space.1` | 4px | `p-1` / `gap-1` | Icon-text spacing, tight gaps |
| `space.2` | 8px | `p-2` / `gap-2` | Input inner padding, badge margins |
| `space.3` | 12px | `p-3` / `gap-3` | Card header padding, table cell padding |
| `space.4` | 16px | `p-4` / `gap-4` | Standard card body padding, form row gap |
| `space.6` | 24px | `p-6` / `gap-6` | Modal margins, dashboard grid gaps |
| `space.8` | 32px | `p-8` / `gap-8` | Page container padding, section dividers |

---

# SECTION 8 — BORDERS, RADII, SHADOWS AND ELEVATION

## 8. Shape System

### 8.1 Border Radius
- `radius.xs`: `2px` (Tags, status pips)
- `radius.sm`: `4px` (Inputs, tooltips, select dropdowns)
- `radius.md`: `6px` (Buttons, table container borders)
- `radius.lg`: `8px` (Cards, modals, flyout drawers)
- `radius.full`: `9999px` (Avatars, pills, circular action buttons)

### 8.2 Elevation & Shadows
- `shadow.xs`: `0 1px 2px rgba(0,0,0,0.25)` (Subtle boundary elevation)
- `shadow.md`: `0 4px 6px -1px rgba(0,0,0,0.3)` (Floating cards, dropdowns)
- `shadow.xl`: `0 20px 25px -5px rgba(0,0,0,0.5)` (Modals, command palettes)

---

# SECTION 10 — LAYOUT AND GRID SYSTEM

## 11. Layout Foundation

### 11.1 Application Shell Hierarchy
```
+---------------------------------------------------------------+
| Global Top Header (Logo, Search, Tenant Switcher, Profile)   |
+---------------------------------------------------------------+
| Primary Sidebar | Breadcrumbs & Page Action Header            |
| (64px / 240px)  |---------------------------------------------|
|                 | Main Content Region (Scrollable Data Grid)  |
|                 | - Filter Drawer / Metrics Strip             |
|                 | - Virtualized Record Table                  |
+---------------------------------------------------------------+
```

### 11.2 Responsive Breakpoints
- **Mobile (<640px):** Single column, bottom navigation bar, collapsed tables.
- **Tablet (640px - 1024px):** Collapsible 64px icon sidebar, responsive 2-column dashboard.
- **Desktop (>1024px):** 240px persistent sidebar, multi-column data grid with filter drawer.

---

# SECTION 15 — COMPONENT LIBRARY INVENTORY

## 16. Component Specifications

### 16.1 CMP-001: Button
- **Variants:** Primary (Indigo), Secondary (Slate outline), Ghost (Transparent), Destructive (Red).
- **Sizes:** Small (`h-8 px-3 text-xs`), Medium (`h-10 px-4 text-sm`), Large (`h-12 px-6 text-base`).
- **States:** Default, Hover, Focus-Visible (`ring-2 ring-indigo-500`), Disabled (`opacity-50 pointer-events-none`), Loading (Spinner icon).

### 16.2 CMP-002: Form Input Field
- **Anatomy:** Label, Input Container, Optional Leading/Trailing Icon, Error Message, Helper Text.
- **States:** Default (`border-slate-800 bg-slate-900`), Focus (`border-indigo-500 ring-1 ring-indigo-500`), Error (`border-red-500`).

### 16.3 CMP-003: Virtualized Data Table
- **Anatomy:** Header row with sorting arrows, selectable checkboxes, sticky column headers, virtual scroll wrapper, pagination bar.
- **Density:** Compact (32px row height), Normal (44px row height).

---

# SECTION 18 — APPLICATION ROUTES & NAVIGATION MAP

## 19. Application Route Table

| Path | Screen Name | Layout Template | Access Level | Description |
|---|---|---|---|---|
| `/` | Landing | Marketing Shell | Public | Value proposition, feature showcase, pricing |
| `/login` | Sign In | Auth Minimal | Public | Multi-tenant credentials authentication |
| `/dashboard` | Executive Overview | App Shell | Authenticated | Live telemetry, KPI cards, activity feed |
| `/records` | Record Explorer | App Shell | Authenticated | Virtualized data table with filter drawer |
| `/audit` | Compliance Audit | App Shell | Admin Only | Immutable event log with JSON state diff |
| `/settings` | Workspace Settings | App Shell | Admin Only | Tenant configurations, team invites, API keys |

---

# SECTION 24 — DESIGN IMPLEMENTATION SPECIFICATION

## 26. Technology Mapping

| Design System Layer | Technology | Implementation Detail |
|---|---|---|
| Design Tokens | CSS Custom Properties | `--bg-ink: #090d16;`, `--color-accent: #6366f1;` |
| Utility Classes | Tailwind CSS | Extended in `tailwind.config.js` with custom token colors |
| Component Primitives | React 19 + Radix UI | Accessible headless primitives for Dialog, Dropdown, Tabs |
| Icons | Lucide React | 16px, 20px, and 24px stroke-width 1.75 |

---

# APPENDIX A — STANDARD IDENTIFICATION SYSTEM
- Tokens: `TOK-001`
- Components: `CMP-001`
- Patterns: `PAT-001`
- Page Templates: `PAGE-001`
- Design Decisions: `DDEC-001`

---

# APPENDIX C — FINAL DESIGN SYSTEM VALIDATION
- [x] Complete design tokens defined for Colors, Typography, Spacing, and Elevation.
- [x] Application route table mapped with layout templates and access permissions.
- [x] Dark mode default palette validated for WCAG 2.1 AA text contrast.
- [x] Component library inventory verified for React 19 and Tailwind CSS implementation.

---

# END OF DESIGN SYSTEM DOCUMENTATION
