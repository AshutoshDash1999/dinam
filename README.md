# Dinam

[![License: PolyForm Noncommercial 1.0.0](https://img.shields.io/badge/License-PolyForm%20Noncommercial%201.0.0-blue)](LICENSE)

Dinam is a React + Vite personal dashboard app designed for a new-tab-style experience. It brings quick-launch shortcuts, browser bookmarks, a daily quote, focus items, market/news headlines, configurable search, and an optional assistant into one responsive layout.

Appearance and behavior are customizable from the dashboard: light/dark/system theme, accent presets, optional wallpaper, search engine settings, and OpenAI-compatible assistant settings.

Dashboard state is managed in `src/context/dashboard-state.tsx`. Focus items and quick-launch links persist in `localStorage`; wallpaper images are stored with IndexedDB; settings use browser storage; external quote and news data are fetched live and cached/fallback where appropriate.

If Dinam is useful to you, **star this repository on GitHub** - it helps others discover the project and keeps us motivated to improve it.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Fork & Clone Repository](#fork--clone-repository)
- [Getting Started](#getting-started)
- [Run Locally](#run-locally)
- [Browser Extension Status](#browser-extension-status)
- [Production Release (Chrome Extension)](#production-release-chrome-extension)
- [Scripts](#scripts)
- [End-to-End Testing](#end-to-end-testing)
- [Adding UI Components](#adding-ui-components)
- [Project Layout](#project-layout)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Dashboard layout** - Responsive new-tab-style dashboard with focused sections
- **Header** - Search, image search, voice search where supported, date/time, theme toggle, assistant entry point, and settings
- **Quick launch** - Editable shortcut grid with fetched metadata and favicons
- **Bookmarks** - Browser bookmark tree when browser APIs are available
- **Quote card** - Daily quote fetched from a stoic quote API with cached fallback
- **Focus items** - Local task list with progress and completion state
- **Market/news headlines** - Hacker News/Algolia-powered headlines with local cache
- **Theming** - Light/dark/system theme, accent presets, and optional compressed wallpaper
- **Assistant** - Optional OpenAI-compatible chat assistant configured from settings

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Radix primitives, `class-variance-authority`, `tailwind-merge`)
- [Playwright](https://playwright.dev/) for E2E tests

## Fork & Clone Repository

1. Fork this repository.

2. Clone your fork:

```bash
git clone https://github.com/<your-username>/dinam.git
cd dinam
```

3. Add the upstream remote (optional):

```bash
git remote add upstream https://github.com/AshutoshDash1999/dinam.git
```

## Getting Started

**Requirements:** Node.js compatible with the versions used by the project. CI currently uses Node.js 22.

Install dependencies:

```bash
npm install
```

## Run Locally

Start the Vite development server:

```bash
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`, for fast refresh while you work on the dashboard UI.

Preview a production build locally:

```bash
npm run build
npm run preview
```

## Browser Extension Status
Dinam includes a Manifest V3 file in `public/manifest.json`, and `npm run build` copies it into `dist/` so you can load Dinam as an unpacked Chrome extension.

Load it in Chrome:

1. Run:
   ```bash
   npm run build
   ```
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the generated `dist/` folder

After loading, opening a new tab should show the Dinam dashboard.
## Production Release (Chrome Extension)
Use this flow when preparing a Chrome Web Store-ready package:

1. Ensure app and extension versions are in sync:
   ```bash
   npm run sync:manifest-version
   ```
2. Build and validate extension output:
   ```bash
   npm run build:extension
   ```
3. Create a release ZIP from `dist/`:
   ```bash
   npm run package:extension
   ```
4. Upload the generated ZIP in `release/` to the Chrome Web Store dashboard.

Checklist before submitting:
- `dist/manifest.json` exists and uses `manifest_version: 3`
- `chrome_url_overrides.newtab` points to an existing file in `dist/`
- icon files exist for 16/48/128 and are referenced in `manifest.json`
- store listing includes description, screenshots, and privacy policy

## Scripts

| Command                  | Description                  |
| ------------------------ | ---------------------------- |
| `npm run dev`            | Dev server with HMR          |
| `npm run build`          | Typecheck + production build |
| `npm run sync:manifest-version` | Sync `public/manifest.json` version with `package.json` |
| `npm run validate:extension` | Validate built extension artifacts in `dist/` |
| `npm run build:extension` | Sync version, build, and validate extension output |
| `npm run package:extension` | Create release ZIP for Chrome Web Store from `dist/` |
| `npm run release:extension` | Run full extension release pipeline (build + package) |
| `npm run preview`        | Preview production build     |
| `npm run lint`           | ESLint                       |
| `npm run format`         | Prettier for TS/TSX files    |
| `npm run typecheck`      | TypeScript `--noEmit`        |
| `npm run test:e2e`       | Run Playwright tests         |
| `npm run test:e2e:ui`    | Run Playwright UI mode       |
| `npm run test:e2e:headed` | Run headed Playwright tests  |
| `npm run test:e2e:debug` | Debug Playwright tests       |
| `npm run prepare`        | Initialize Husky hooks       |

## End-to-End Testing

This project uses Playwright for automated end-to-end (E2E) testing across multiple browsers.

Run E2E tests:

```bash
npm run test:e2e
```

Run tests in headed mode:

```bash
npm run test:e2e:headed
```

Debug tests:

```bash
npm run test:e2e:debug
```

Open the Playwright HTML report:

```bash
npx playwright show-report
```

The E2E suite currently runs against:

- Chromium
- Firefox
- WebKit
- Mobile Chrome (Pixel 5)

### CI Integration

GitHub Actions currently validates pull requests targeting `master` with lint, typecheck, and production build jobs. Playwright tests are available locally through the `test:e2e` scripts.

### Current Test Coverage

- Dashboard rendering
- Task creation flow
- Theme persistence across reloads

## Adding UI Components

This project uses the shadcn CLI. Example:

```bash
npx shadcn@latest add button
```

Components are added under `src/components/ui` and imported with the `@/` alias, for example:

```tsx
import { Button } from "@/components/ui/button"
```

## Project Layout

```text
src/
|-- components/
|   |-- animated-icons/   # Local animated icon components
|   |-- dashboard/        # Dashboard sections, dialogs, and assistant panel
|   |-- ui/               # Reusable shadcn/ui primitives
|   `-- theme-provider.tsx
|-- config/               # Search engine presets
|-- context/              # Dashboard state provider
|-- data/                 # Static/fallback data where used
|-- hooks/                # Browser, news, and dashboard hooks
|-- lib/                  # Storage, search, theme, AI, and utility helpers
|-- types/                # Shared TypeScript types
|-- App.tsx               # Main dashboard layout
|-- main.tsx              # React entry point and providers
`-- index.css             # Tailwind CSS and theme tokens
```

## Additional Notes

- Prioritize readability and maintainability over clever abstractions
- Keep UI patterns visually consistent with existing components
- Prefer composition over duplication
- Test changes before submitting pull requests

## Contributing

We welcome issues and pull requests. Please keep changes focused and consistent with existing patterns.

### Before You Open a PR

1. **Discuss larger changes** - For new features or structural refactors, open an issue first so direction and scope align.
2. **One topic per PR** - Easier to review and bisect than mixed unrelated edits.
3. **Run checks locally:**

   ```bash
   npm run lint
   npm run typecheck
   ```

   Fix any new warnings or errors. Use `npm run format` so TS/TSX matches Prettier, including Tailwind class sorting.

4. **Match the codebase** - Follow existing naming, file organization, and import style (`@/` alias, imports at top of file). Avoid drive-by refactors outside your change.
5. **Browser APIs** - When behavior depends on browser-only APIs such as bookmarks, notifications, clipboard, speech, or storage, verify the relevant runtime path in addition to `npm run dev`.
6. **Accessibility & semantics** - Prefer semantic HTML, labels for controls, and reasonable focus behavior when touching UI.
7. **Commits** - Clear messages in imperative mood are fine. Squash or keep history readable at your discretion unless maintainers request otherwise.

### Reporting Bugs

Include what you expected, what happened, browser version, OS, whether you saw it in dev or production preview, and minimal steps to reproduce. Screenshots help for visual issues.

## License

[PolyForm Noncommercial License 1.0.0](LICENSE) - free for personal and noncommercial use. Commercial use requires explicit permission from the author.
