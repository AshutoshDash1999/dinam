# Contributing to Dinam

Thanks for your interest in contributing! Dinam is a React + Vite personal dashboard app designed for a new-tab-style experience. All skill levels are welcome, whether it is a bug fix, dashboard improvement, test, or typo correction.

Read the [README](./README.md) first to understand the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [First-Time Contributors](#first-time-contributors)
- [Issue Assignment](#issue-assignment)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Building a Dashboard Section](#building-a-dashboard-section)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [PR Title](#pr-title)
- [PR Description](#pr-description)
- [Code Quality](#code-quality)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)
- [Questions](#questions)

---

## Code of Conduct

Be respectful. Constructive feedback only. No harassment, gatekeeping, or dismissiveness, especially toward beginners. Maintainers reserve the right to close PRs or issues that violate this.

---

## First-Time Contributors

Never contributed to open source before? Start here:

1. Look for issues labeled [`good first issue`](https://github.com/AshutoshDash1999/dinam/issues?q=is%3Aissue+label%3A%22good+first+issue%22)
2. Comment on the issue to claim it before starting work
3. Ask questions in the issue thread, which is what it is for
4. Do not worry about perfection on your first PR; maintainers will guide you

---

## Issue Assignment

**Before writing any code, claim the issue.**

### Claiming an Issue

1. Find an open, unassigned issue
2. Comment: _"I'd like to work on this"_ or similar
3. Wait for a maintainer to assign it to you; do not start until assigned
4. Once assigned, open your PR within **7 days**

### Rules

| Rule | Detail |
| ---- | ------ |
| One issue at a time | Finish or release your current issue before claiming another |
| Wait for assignment | Do not open a PR until a maintainer has officially assigned the issue to you |
| Stay responsive | Reply to questions on your issue within **3 days** |
| Inactivity = unassignment | No update for **3 days** after assignment means a maintainer may reassign |
| Can't continue? | Comment on the issue to release it so others can pick it up |

### Unassigned PRs

PRs opened before official assignment will be **closed**, regardless of whether you commented to claim the issue.

> "I commented but wasn't assigned yet" is not an exception. Wait for the assignment confirmation, then open your PR.

Maintainers will leave a comment explaining this so you can reopen after assignment.

### First-Time Contributors

Stick to issues labeled [`good first issue`](https://github.com/AshutoshDash1999/dinam/issues?q=is%3Aissue+label%3A%22good+first+issue%22) for your first contribution.

### Maintainers

Maintainers may self-assign issues without prior comment.

---

## Getting Started

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/dinam.git
cd dinam

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`.

To preview a production build:

```bash
npm run build
npm run preview
```

The current repository does not include a Chrome extension manifest, so `dist/` is not currently a complete unpacked extension package. Test dashboard behavior with the Vite dev server or production preview unless extension packaging is added in a future change.

---

## Project Structure

```text
dinam/
|-- src/
|   |-- components/
|   |   |-- animated-icons/   # Local animated icon components
|   |   |-- dashboard/        # Dashboard sections, dialogs, and assistant panel
|   |   |-- ui/               # Reusable shadcn/ui primitives
|   |   `-- theme-provider.tsx
|   |-- config/               # Search engine presets
|   |-- context/              # Dashboard state provider
|   |-- data/                 # Static/fallback data where used
|   |-- hooks/                # Browser, news, and dashboard hooks
|   |-- lib/                  # Storage, search, theme, AI, and utility helpers
|   |-- types/                # Shared TypeScript types
|   |-- App.tsx               # Main dashboard layout
|   |-- main.tsx              # React entry point and providers
|   `-- index.css             # Tailwind CSS and theme tokens
|-- tests/e2e/                # Playwright tests
|-- public/                   # Static assets copied by Vite
`-- dist/                     # Build output (gitignored)
```

State and persistence currently follow these patterns:

- Dashboard items such as focus items and quick-launch links use `src/context/dashboard-state.tsx`
- Theme, accent, search, assistant, and cached external data use browser storage
- Wallpaper images are stored through IndexedDB helpers in `src/lib/wallpaper-storage`
- Browser-only capabilities should be isolated behind focused hooks or helpers

---

## Building a Dashboard Section

Dashboard UI lives in `src/components/dashboard/`. Add new dashboard sections there and wire them into `src/App.tsx` only when they should appear in the main dashboard layout.

Use these locations for supporting code:

- `src/components/ui/` for reusable shadcn/ui primitives
- `src/hooks/` for React hooks shared across components
- `src/lib/` for storage, parsing, API, search, theme, AI, and utility helpers
- `src/context/dashboard-state.tsx` for shared dashboard state that belongs with existing todos, bookmarks, or quick-launch behavior
- `src/types/` for shared TypeScript types

**Checklist for dashboard changes:**

- [ ] Component lives in the appropriate `src/components/dashboard/` area
- [ ] Shared state follows the existing dashboard context or browser-storage patterns
- [ ] Async data handles loading, error, and empty states where applicable
- [ ] UI works across the dashboard's responsive breakpoints
- [ ] User-facing settings persist in browser storage when appropriate
- [ ] Browser-only APIs have a graceful fallback where possible
- [ ] Screenshot or recording is included for visual changes

---

## Branch Naming

Pattern: `<type>/<short-kebab-description>`

| Type | Use for |
| ---- | ------- |
| `feat/` | New feature or enhancement |
| `fix/` | Bug fix |
| `docs/` | Documentation only |
| `refactor/` | Code restructure, no behavior change |
| `chore/` | Tooling, dependencies, config |
| `style/` | Visual / CSS changes only |
| `test/` | Adding or updating tests |

**Examples:**

```text
feat/dark-mode-toggle
fix/bookmark-render-crash
docs/update-readme-setup
chore/bump-tailwind-v4
```

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/).

**Format:** `<type>(<optional scope>): <imperative description>`

**Types:** `feat`, `fix`, `docs`, `refactor`, `chore`, `style`, `test`, `perf`

**Rules:**

- Lowercase subject, no trailing period
- Imperative mood: "add" not "added", "fix" not "fixed"
- Keep subject under 72 characters
- Optional body separated by a blank line

**Examples:**

```text
feat(dashboard): add weather section
fix(bookmarks): handle missing browser bookmark API
docs: update getting started instructions
refactor(tasks): extract task item into separate component
chore: upgrade vite to 7.x
```

---

## PR Title

Same format as commit messages: `<type>(<scope>): <description>`

**Examples:**

```text
feat(tasks): add due date picker
fix(header): voice search button not responding on Firefox
docs: add screenshot to README
```

---

## PR Description

Use this template when opening a PR:

```markdown
## Description
<!-- What changed and why. Link any related issues with "Closes #123". -->

## Screenshot / Screen Recording
<!-- Required for any UI change. Drag and drop an image here, or paste a screen recording link. -->
<!-- Write "N/A" if this is a non-visual change (docs, refactor, chore). -->

## How to Test
<!-- Step-by-step instructions for the reviewer to verify your change works. -->
<!-- Example:
1. Run `npm run dev`
2. Open the Vite URL
3. Interact with the changed dashboard section or setting
4. Verify that the expected state persists or resets as intended
-->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactor (no behavior change)
- [ ] Breaking change

## Checklist
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] Relevant Playwright tests were run or updated, if applicable
- [ ] Self-reviewed the diff
- [ ] Screenshot / recording attached, if applicable
- [ ] No unrelated files changed
```

---

## Code Quality

Run these before pushing:

```bash
npm run lint        # ESLint
npm run format      # Prettier auto-format for TS/TSX
npm run typecheck   # TypeScript strict check
npm run build       # Production build
```

For UI flows, also run the relevant Playwright command when practical:

```bash
npm run test:e2e
```

PRs that fail lint, typecheck, or build will not be merged.

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/AshutoshDash1999/dinam/issues) and include:

- Steps to reproduce
- Expected vs actual behavior
- Browser version and OS
- Whether you tested in dev server or production preview
- Screenshot or error from DevTools console, if applicable

---

## Requesting Features

Open a [GitHub Issue](https://github.com/AshutoshDash1999/dinam/issues) and describe:

- The problem you are solving, not just the solution
- How it fits into a personal dashboard use case

---

## Questions?

Open a Discussion or an Issue. Happy to help you get started.
