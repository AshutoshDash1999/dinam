// src/lib/theme-storage.ts

export type ThemePreference = "light" | "dark" | "system"

const STORAGE_KEY = "dinam-theme"

/** Read the saved preference (falls back to 'system'). */
export function readThemePreference(): ThemePreference {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === "light" || value === "dark" || value === "system") {
      return value
    }
  } catch {
    // Private-browsing / quota errors — silently fall back.
  }
  return "system"
}

/** Persist the preference. */
export function writeThemePreference(preference: ThemePreference): void {
  try {
    localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    // Silently ignore.
  }
}

/** Resolve 'system' → 'light' | 'dark' using the OS preference. */
export function resolveTheme(preference: ThemePreference): "light" | "dark" {
  if (preference !== "system") return preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

/** Apply the resolved theme to <html> and keep Tailwind's `dark` class in sync. */
export function applyTheme(preference: ThemePreference): void {
  const resolved = resolveTheme(preference)
  document.documentElement.classList.toggle("dark", resolved === "dark")
}
