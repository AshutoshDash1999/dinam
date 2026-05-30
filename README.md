# Dinam
[![License: PolyForm Noncommercial 1.0.0](https://img.shields.io/badge/License-PolyForm%20Noncommercial%201.0.0-blue)](LICENSE)

Dinam is a **Chrome extension** that replaces your **new tab** page with a personal dashboard. It brings quick launch shortcuts, bookmarks, a daily quote, tasks, and a tech news column into one responsive layout. Appearance is customizable: theme accents, optional wallpaper, and layout-adjacent settings live in the dashboard header.

Data for bookmarks, tasks, news, and quick launch items is currently driven by mock modules under `src/data/`—a natural place to swap in real APIs, `chrome.storage`, or other persistence later.

If Dinam is useful to you, **star this repository on GitHub** — it helps others discover the project and keeps us motivated to improve it.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Fork & Clone Repository](#fork--clone-repository)
- [Getting Started](#getting-started)
- [Run Locally](#run-locally)
- [Load as Chrome Extension](#load-as-chrome-extension)
- [Project Layout](#project-layout)
- [Contributing](#contributing)
- [License](#license)

## Features

- **New tab override** — The dashboard opens whenever you open a new tab (once packaged as an extension).
- **Header** — Search (configurable provider), date/time, and dashboard settings
- **Quick launch** — Editable grid of shortcuts with icon presets
- **Bookmarks** — Curated links section
- **Quote card** — Rotating stoic-style quotes
- **Tasks** — Task list UI (mock data)
- **Tech news** — Headlines column (mock data)
- **Theming** — Light/dark/system, accent presets, optional background wallpaper

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Radix primitives, `class-variance-authority`, `tailwind-merge`)

## Fork & Clone Repository
1. Fork this repository

2. Clone your fork
```bash
git clone https://github.com/<your-username>/dinam.git
cd dinam
```
3. Add upstream remote (optional)
```bash
git remote add upstream https://github.com/AshutoshDash1999/dinam.git
```

## Getting started

**Requirements:** Node.js compatible with the versions in `package.json` (recent LTS recommended).

## Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server
```
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`) for fast refresh while you work on the dashboard UI.

## Load as Chrome Extension

Dinam can also be tested as a Chrome new-tab extension.

### 1. Build the project

```bash
npm run build
```

The production-ready files will be generated inside the `dist/` folder.

### 2. Open Chrome Extensions

Open the following URL in Chrome:

```text
chrome://extensions
```

Enable **Developer Mode** using the toggle in the top-right corner.

### 3. Load the Extension

Click **Load unpacked** and select the `dist/` folder containing the built files and `manifest.json`.

### 4. Open a New Tab

Once loaded successfully, opening a new Chrome tab will display the Dinam dashboard.

After making changes, rebuild the project and reload the unpacked extension to view updates.

### Scripts

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `npm run dev`       | Dev server with HMR          |
| `npm run build`     | Typecheck + production build |
| `npm run preview`   | Preview production build     |
| `npm run lint`      | ESLint                       |
| `npm run format`    | Prettier (TS/TSX)            |
| `npm run typecheck` | TypeScript `--noEmit`        |


## End-to-End Testing

This project uses Playwright for automated end-to-end (E2E) testing across multiple browsers.

### Run E2E Tests

```bash
npm run test:e2e
```

### Run Tests in Headed Mode

```bash
npm run test:e2e:headed
```

### Debug Tests

```bash
npm run test:e2e:debug
```

### Open Playwright HTML Report

```bash
npx playwright show-report
```

### Browser Coverage

The E2E suite currently runs against:

- Chromium
- Firefox
- WebKit
- Mobile Chrome (Pixel 5)

### CI Integration

Playwright tests run automatically through GitHub Actions on:
- Pull requests
- Pushes to `master`

### Current Test Coverage

- Dashboard rendering
- Task creation flow
- Theme persistence across reloads

### Adding UI components

This project uses the shadcn CLI. Example:

```bash
npx shadcn@latest add button
```

Components are added under `src/components/ui` and imported with the `@/` alias, for example:

```tsx
import { Button } from "@/components/ui/button"
```


## Project layout
```text
src/
├── components/
│   ├── dashboard/      # Dashboard widgets and sections
│   ├── ui/             # Reusable UI primitives
├── data/               # Mock/static dashboard data
├── lib/                # Utility helpers and theme logic
├── App.tsx             # Main dashboard layout
```

## Contributing

We welcome issues and pull requests. Please keep changes focused and consistent with existing patterns.

### Before you open a PR

1. **Discuss larger changes** — For new features or structural refactors, open an issue first so direction and scope align.
2. **One topic per PR** — Easier to review and bisect than mixed unrelated edits.
3. **Run checks locally:**
   ```bash
   npm run lint
   npm run typecheck
   ```
   Fix any new warnings or errors. Use `npm run format` so TS/TSX matches Prettier (including Tailwind class sorting).

4. **Match the codebase** — Follow existing naming, file organization, and import style (`@/` alias, imports at top of file). Avoid drive-by refactors outside your change.
5. **Chrome / new tab** — When behavior depends on extension APIs, permissions, or the built bundle, verify with an unpacked load (see above) in addition to `npm run dev`.
6. **Accessibility & semantics** — Prefer semantic HTML, labels for controls, and reasonable focus behavior when touching UI.
7. **Commits** — Clear messages (imperative mood is fine: “Add bookmark drag handle”). Squash or keep history readable at your discretion unless maintainers request otherwise.

### Reporting bugs

Include: what you expected, what happened, Chrome version, OS, whether you saw it in **dev** (`npm run dev`) or **packed/unpacked extension**, and minimal steps to reproduce. Screenshots help for visual issues.

## License

[PolyForm Noncommercial License 1.0.0](LICENSE) — free for personal and noncommercial use. Commercial use requires explicit permission from the author.
