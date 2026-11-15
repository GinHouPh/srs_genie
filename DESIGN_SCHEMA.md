# Agape Infosys / Qreate Digital Design Schema

> **Cyber-Minimalist Dark Design System** extracted from **SRS Genie**.  
> Engineered for technical SaaS, developer platforms, AI agent interfaces, and high-precision tools.

---

## 1. Design Philosophy

The design system blends **cyber-minimalism**, **architectural precision**, and **brutalist dark-mode ergonomics**:

- **High Contrast Dark Canvas**: Deep `#0c0c0c` ink background prevents eye strain while giving maximum visual punch to content.
- **Razor-Sharp Geometry**: 0px border-radius default across cards, buttons, badges, and inputs, creating a military/industrial aesthetic.
- **Signature Agape Crimson Accent (`#d90429`)**: Used sparingly for high-intent actions, active states, and structural guidelines (eyebrow rules, top-bar gradients).
- **Dual Font Typographic Hierarchy**:
  - **Display (`Akshar`)**: Condensed, technical sans-serif rendered uppercase with generous letter tracking (`0.12em` to `0.34em`).
  - **Body (`Roboto`)**: Highly legible neutral grotesque with comfortable paragraph tracking (`0.03em`).
  - **Mono**: Monospaced font for code snippets, JSON-RPC endpoints, paths, hashes, and token IDs.

---

## 2. Core Color Palette & Design Tokens

### Color Tokens Table

| Token Name | Hex / RGBA | CSS Variable | Tailwind Class | Semantic Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Ink** | `#0c0c0c` | `--color-ink` | `bg-ink`, `text-ink` | Root canvas / body background |
| **Surface** | `#141414` | `--color-surface` | `bg-surface` | Primary card, modal & panel background |
| **Box** | `#2c2c2c` | `--color-box` | `bg-box` | Secondary container, wells, code blocks, inactive tabs |
| **Line** | `#383838` | `--color-line` | `border-line` | Borders, grid lines, dividers, scrollbar thumb |
| **Muted** | `#828282` | `--color-muted` | `text-muted` | Secondary copy, labels, hints, timestamps |
| **Body** | `#d8d8d8` | `--color-body` | `text-body` | Primary readable paragraph & content text |
| **Headline** | `#ffffff` | `--color-headline` | `text-white` | Headings, active badge text, pure contrast |
| **Accent** | `#d90429` | `--color-accent` | `bg-accent`, `text-accent`, `border-accent` | Signature Crimson for CTAs & highlights |
| **Accent Soft** | `rgba(217, 4, 41, 0.14)` | `--color-accent-soft` | `bg-accent-soft` | Soft tinted fill for active badges & alerts |
| **Accent Border** | `rgba(217, 4, 41, 0.35)` | `--color-accent-border` | `border-accent/40` | Subtle glowing card & badge borders |
| **On Accent** | `#ffffff` | `--color-on-accent` | `text-on-accent` | Text rendered on top of crimson accent |

### CSS Variables Definition (`:root`)

```css
:root {
  --color-ink: #0c0c0c;
  --color-surface: #141414;
  --color-box: #2c2c2c;
  --color-line: #383838;
  --color-muted: #828282;
  --color-body: #d8d8d8;
  --color-headline: #ffffff;
  --color-accent: #d90429;
  --color-accent-soft: rgba(217, 4, 41, 0.14);
  --color-accent-border: rgba(217, 4, 41, 0.35);
  --color-on-accent: #ffffff;

  --font-display: 'Akshar', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Roboto', ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
```

---

## 3. Typography & Font Stacks

### Google Fonts Import

Include this in the `<head>` of your HTML document:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Akshar:wght@300;400;500;600;700&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
```

### Font Rules & Tracking

| Usage | Font Family | Case | Letter Spacing | Weights |
| :--- | :--- | :--- | :--- | :--- |
| **Headings & Titles** | `Akshar` | Uppercase | `0.03em` - `0.06em` | 600, 700 |
| **Eyebrow Rules** | `Akshar` | Uppercase | `0.34em` | 500 |
| **Buttons** | `Akshar` | Uppercase | `0.22em` | 500 |
| **Badges / Tags** | `Akshar` | Uppercase | `0.16em` | 500, 600 |
| **Form Labels** | `Akshar` | Uppercase | `0.14em` | 500 |
| **Body Paragraphs** | `Roboto` | Normal | `0.03em` | 400 |
| **Code / Data** | `Mono` | Normal | Normal / `0.05em` | 400, 500 |

---

## 4. Layout & Atmosphere

### Responsive Container (`.shell`)

A fluid full-width layout container with graduated responsive side padding:

```css
.shell {
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px)  { .shell { padding-left: 1.75rem; padding-right: 1.75rem; } }
@media (min-width: 1024px) { .shell { padding-left: 2.5rem;  padding-right: 2.5rem;  } }
@media (min-width: 1440px) { .shell { padding-left: 3.5rem;  padding-right: 3.5rem;  } }
```

### Cyber Grid / Background Texture (Optional)

```css
.bg-cyber-grid {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 4rem 4rem;
}
```

---

## 5. Signature Component Primitives

### 1. The Eyebrow (`.eyebrow`)

The hallmark signature element of Agape Infosys: an inline crimson rule followed by tracked uppercase text.

```html
<div class="eyebrow">
  AI Software Architecture // SaaS Documentation Platform
</div>
```

```css
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.34em;
  color: var(--color-accent);
  text-transform: uppercase;
  font-weight: 500;
}

.eyebrow::before {
  content: '';
  display: inline-block;
  height: 1px;
  width: 2.5rem;
  background-color: var(--color-accent);
}
```

---

### 2. Cards (`.agape-card`) & Corner Fold

Sharp, dark surface cards that glow subtly on hover.

```html
<div class="agape-card p-6 relative">
  <!-- Optional Corner Accent Fold -->
  <div class="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
    <div class="w-32 h-32 bg-accent rotate-45 transform origin-bottom-left translate-x-5 -translate-y-16 opacity-80"></div>
  </div>

  <h3 class="font-display text-xl uppercase font-semibold text-white mb-2">Card Title</h3>
  <p class="text-muted text-sm leading-relaxed">Content description with clean typography.</p>
</div>
```

```css
.agape-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-line);
  transition: border-color 0.25s ease;
  border-radius: 0;
}

.agape-card:hover {
  border-color: rgba(217, 4, 41, 0.4);
}
```

---

### 3. Action Buttons (`.btn`)

```html
<!-- Primary Accent Button -->
<button class="btn btn--accent">
  <span>Launch Workspace</span>
  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
</button>

<!-- Secondary Ghost Button -->
<button class="btn btn--ghost">
  View Documentation
</button>

<!-- Solid Dark Box Button -->
<button class="btn btn--solid">
  Configure Settings
</button>

<!-- Small Compact Secondary -->
<button class="btn-secondary">
  Filter Logs
</button>
```

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: 0;
  border-radius: 0;
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  transition: all 0.25s ease-in-out;
  padding: 10px 22px;
  line-height: 1.2;
  cursor: pointer;
  text-decoration: none;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
}

.btn--accent {
  background-color: var(--color-accent);
  color: #ffffff;
}

.btn--accent:hover {
  background-color: #ffffff;
  color: #0c0c0c;
}

.btn--solid {
  background-color: var(--color-box);
  color: #ffffff;
}

.btn--solid:hover {
  background-color: var(--color-accent);
  color: #ffffff;
}

.btn--ghost {
  border: 1px solid var(--color-line);
  background-color: transparent;
  color: #ffffff;
}

.btn--ghost:hover {
  border-color: var(--color-accent);
  background-color: var(--color-accent);
  color: #ffffff;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background-color: var(--color-surface);
  color: var(--color-body);
  border: 1px solid var(--color-line);
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-secondary:hover {
  border-color: var(--color-accent);
  color: #ffffff;
}
```

---

### 4. Status Badges (`.badge--on`, `.badge--off`)

```html
<span class="badge--on">Live</span>
<span class="badge--off">Draft</span>
```

```css
.badge--on {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background-color: var(--color-accent-soft);
  color: var(--color-accent);
  border: 1px solid rgba(217, 4, 41, 0.3);
  font-family: var(--font-display);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 0;
}

.badge--off {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background-color: var(--color-box);
  color: var(--color-muted);
  border: 1px solid var(--color-line);
  font-family: var(--font-display);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 0;
}
```

---

### 5. Metric Stat Indicators (`.stat`)

```html
<div class="stat">
  <span class="stat__value text-white">22</span>
  <span class="stat__label">Specification Files</span>
</div>
```

```css
.stat {
  border-bottom: 1px solid var(--color-line);
  padding-bottom: 1.25rem;
}

.stat__value {
  display: block;
  font-family: var(--font-display);
  color: #ffffff;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1;
  letter-spacing: 0.04em;
  font-weight: 600;
}

.stat__label {
  margin-top: 0.5rem;
  display: block;
  font-family: var(--font-display);
  font-size: 0.875rem;
  letter-spacing: 0.1em;
  color: var(--color-muted);
  text-transform: uppercase;
}
```

---

### 6. Form Fields & Inputs

#### Minimalist Underline Input (`.agape-input`)
```html
<div class="field">
  <label class="field__label">Project Codename</label>
  <input type="text" class="agape-input" placeholder="e.g. PROJECT_GENIE" />
</div>
```

#### Boxed Industrial Input (`.input-boxed`)
```html
<div class="field">
  <label class="field__label">API Token</label>
  <input type="password" class="input-boxed font-mono" placeholder="••••••••••••••••" />
</div>
```

```css
.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field__label {
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.agape-input {
  width: 100%;
  background-color: transparent;
  border-bottom: 1px solid var(--color-line);
  border-top: 0;
  border-left: 0;
  border-right: 0;
  padding-bottom: 0.5rem;
  font-family: var(--font-body);
  color: #ffffff;
  outline: none;
  transition: border-color 0.25s;
  border-radius: 0;
}

.agape-input:focus {
  border-color: var(--color-accent);
}

.agape-input::placeholder {
  color: var(--color-muted);
}

.input-boxed {
  width: 100%;
  background-color: var(--color-ink);
  border: 1px solid var(--color-line);
  padding: 0.625rem 0.875rem;
  font-family: var(--font-body);
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s;
  border-radius: 0;
}

.input-boxed:focus {
  border-color: var(--color-accent);
}
```

---

### 7. Segmented Navigation Bar & Tabs

```html
<nav class="flex items-center gap-1 bg-surface border border-line p-1">
  <!-- Active Tab -->
  <button class="flex items-center gap-2 px-3 py-1.5 font-display text-xs tracking-[0.16em] uppercase bg-accent text-white font-semibold">
    Dashboard
  </button>

  <!-- Inactive Tab -->
  <button class="flex items-center gap-2 px-3 py-1.5 font-display text-xs tracking-[0.16em] uppercase text-muted hover:text-white hover:bg-box transition-all">
    Integrations
  </button>
</nav>
```

---

### 8. Data Tables

```html
<table class="agape-table">
  <thead>
    <tr>
      <th>Provider</th>
      <th>Endpoint</th>
      <th>Status</th>
      <th class="text-right">Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="font-display font-medium text-white uppercase">AgentRouter</td>
      <td class="font-mono text-xs text-muted">https://api.agentrouter.ai/v1</td>
      <td><span class="badge--on">Connected</span></td>
      <td class="text-right"><button class="btn-secondary btn-sm">Edit</button></td>
    </tr>
  </tbody>
</table>
```

---

## 6. Project Setup Guides

### Method 1: Using with Tailwind CSS

#### For ESM Projects (Vite, Next.js with ESM, Nuxt 3, SvelteKit):
```javascript
// tailwind.config.js
import agapePreset from './tailwind.preset.js';

export default {
  presets: [agapePreset],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue,svelte}'],
  plugins: [],
};
```

#### For CommonJS Projects (Classic Node / Next.js / Webpack):
```javascript
// tailwind.config.js
module.exports = {
  presets: [require('./tailwind.preset.cjs')],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue,svelte}'],
  plugins: [],
};
```

3. Include the Google Fonts `<link>` in `index.html`.
4. Import `agape-design-system.css` into your CSS entry point (e.g. `src/index.css`).

---

### Method 2: Standalone HTML / Zero-Build

Drop this snippet directly into your `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agape Cyber Minimalist Interface</title>

  <!-- 1. Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Akshar:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">

  <!-- 2. Agape Design System CSS -->
  <link rel="stylesheet" href="./agape-design-system.css">
  
  <!-- Optional Tailwind CDN with Agape Config -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            ink: '#0c0c0c',
            surface: '#141414',
            box: '#2c2c2c',
            line: '#383838',
            muted: '#828282',
            body: '#d8d8d8',
            headline: '#ffffff',
            accent: '#d90429',
            'accent-soft': 'rgba(217, 4, 41, 0.14)',
          },
          fontFamily: {
            display: ['Akshar', 'sans-serif'],
            body: ['Roboto', 'sans-serif'],
          }
        }
      }
    }
  </script>
</head>
<body class="bg-ink text-body min-h-screen">
  <div class="shell py-12 space-y-12">
    <div class="eyebrow">Enterprise Spec Generator</div>
    <div class="agape-card p-8">
      <h1 class="font-display text-4xl text-white uppercase font-bold mb-4">
        Autonomous System <span class="text-accent">Console</span>
      </h1>
      <p class="text-muted mb-6">Cyber-minimalist architectural interface.</p>
      <button class="btn btn--accent">Engage Engine</button>
    </div>
  </div>
</body>
</html>
```

---

## 7. Artifacts Created in this Repository

| File Path | Description |
| :--- | :--- |
| [`DESIGN_SCHEMA.md`](file:///d:/PROJECTS/srs_genie/DESIGN_SCHEMA.md) | Complete architectural specifications & visual design guide (this document) |
| [`tailwind.preset.js`](file:///d:/PROJECTS/srs_genie/tailwind.preset.js) | Drop-in Tailwind CSS preset configuration (ESM) |
| [`tailwind.preset.cjs`](file:///d:/PROJECTS/srs_genie/tailwind.preset.cjs) | Drop-in Tailwind CSS preset configuration (CommonJS) |
| [`agape-design-system.css`](file:///d:/PROJECTS/srs_genie/agape-design-system.css) | Zero-dependency standalone CSS stylesheet with variables & components |
| [`design-tokens.json`](file:///d:/PROJECTS/srs_genie/design-tokens.json) | W3C Community Group standard machine-readable JSON design tokens |
