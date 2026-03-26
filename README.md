# Dinam

Dinam is a **Chrome extension** that replaces your **new tab** page with a personal dashboard. It brings quick launch shortcuts, bookmarks, a daily quote, tasks, and a tech news column into one responsive layout. Appearance is customizable: theme accents, optional wallpaper, and layout-adjacent settings live in the dashboard header.

Data for bookmarks, tasks, news, and quick launch items is currently driven by mock modules under `src/data/`—a natural place to swap in real APIs, `chrome.storage`, or other persistence later.

## Features

- **New tab override** — The dashboard opens whenever you open a new tab (once packaged as an extension).
- **Header** — Search (configurable provider), date/time, and dashboard settings
- **Quick launch** — Editable grid of shortcuts with icon presets
- **Bookmarks** — Curated links section
- **Quote card** — Rotating stoic-style quotes
- **Tasks** — Task list UI (mock data)
- **Tech news** — Headlines column (mock data)
- **Theming** — Light/dark/system, accent presets, optional background wallpaper

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Radix primitives, `class-variance-authority`, `tailwind-merge`)

## Getting started

**Requirements:** Node.js compatible with the versions in `package.json` (recent LTS recommended).

### UI development (browser)

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`) for fast refresh while you work on the dashboard UI.

### Load as an unpacked extension in Chrome

The new tab page is the same React app you build with Vite. To test it inside Chrome:

1. **Build** the app:

   ```bash
   npm run build
   ```

   Output goes to `dist/` (HTML, JS, and assets).

2. **Manifest** — Package `dist/` as a [Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation) extension. You need at least:

   - `manifest_version`: **3**
   - `chrome_url_overrides.newtab` pointing at your built entry (typically `"newtab": "index.html"` if `index.html` lives at the root of the extension folder)
   - Appropriate `permissions` / host access if you later call external APIs or use `chrome.*` APIs

   Place `manifest.json` alongside the built files (e.g. copy it into `dist/` after build, or configure Vite to emit it into `dist/`).

3. In Chrome, open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, and select the folder that contains `manifest.json` and the built `index.html`.

After code changes, run `npm run build` again and refresh the extension on the extensions page (or reload the new tab) to see updates.

### Scripts

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `npm run dev`       | Dev server with HMR          |
| `npm run build`     | Typecheck + production build |
| `npm run preview`   | Preview production build     |
| `npm run lint`      | ESLint                       |
| `npm run format`    | Prettier (TS/TSX)            |
| `npm run typecheck` | TypeScript `--noEmit`        |

### Adding UI components

This project uses the shadcn CLI. Example:

```bash
npx shadcn@latest add button
```

Components are added under `src/components/ui` and imported with the `@/` alias, for example:

```tsx
import { Button } from "@/components/ui/button"
```

## Project layout (high level)

- `src/App.tsx` — Dashboard shell and section grid (new tab UI)
- `src/components/dashboard/` — Feature sections (header, quick launch, tasks, etc.)
- `src/components/ui/` — shadcn-style primitives
- `src/data/` — Mock dashboard content
- `src/lib/` — Utilities, theme accents, search helpers

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
