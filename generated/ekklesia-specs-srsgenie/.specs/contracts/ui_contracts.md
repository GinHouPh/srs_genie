---
tier: 3
role: ui-contracts
depends-on: architecture/system_design.md
updated: 2026-11-24
---

# UI Contracts, Component Tree & Route Specifications: Ekklesia

## 1. Application Route Hierarchy

| Route Path | View Component | Access Guard | Primary Layout |
|:---|:---|:---|:---|
| `/` | `LandingPage` | Public | Marketing Navbar & Footer |
| `/auth/login` | `AuthModal (login)` | Public | Centered Modal Shell |
| `/auth/register` | `AuthModal (register)` | Public | Centered Modal Shell |
| `/dashboard` | `DashboardOverview` | Authenticated | App Shell with Top Telemetry & Sidebar |
| `/wizard` | `WizardForm` | Authenticated | 15-Section Step Navigator |
| `/preview` | `DocumentPreview` | Authenticated | Spec Tree Split Viewer |
| `/mcp-hub` | `McpHub` | Authenticated | Agent Key Generator & Log Viewer |
| `/billing` | `ClientBillingPage` | Role: Admin | Plan Card Grid & Invoice Table |
| `/admin` | `AdminConsole` | Role: Super Admin | Tabbed SaaS Backoffice |

---

## 2. Design System Tokens & Typography

- **Dark Interface Foundation:** Background `#05080f` (slate-950), Box Card `#0d1117`, Line Border `#21262d`.
- **Accent Brand Color:** `#38bdf8` (cyan-400) / `#6366f1` (indigo-500).
- **Typography Scale:**
  - Headings: `font-display` uppercase tracking `[0.06em]`.
  - Body: `font-sans` high legibility dark mode contrast.
  - Telemetry & Code: `font-mono` with subtle border boxes.


---

## Frontier Model UI Specifications

# Master Strategic Architecture Suite: Ekklesia
**Generated Date:** 2026-11-24

