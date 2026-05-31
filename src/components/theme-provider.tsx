/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

import {
  DEFAULT_SEARCH_URL_TEMPLATE,
  getInitialSearchUrlTemplate,
} from "@/lib/search-engine"
import {
  ACCENT_CSS_VARS,
  ACCENT_PRESETS,
  isAccentId,
  mergeAccentVariables,
  type AccentId,
} from "@/lib/theme-accent-presets"
import {
  saveWallpaper as idbSaveWallpaper,
  loadWallpaper as idbLoadWallpaper,
  clearWallpaper as idbClearWallpaper,
} from "@/lib/wallpaper-storage"

type Theme = "dark" | "light" | "system"
type ResolvedTheme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  /** localStorage key for accent / color preset (default: `theme-accent`). */
  accentStorageKey?: string
  defaultAccent?: AccentId
  /** Legacy localStorage key for wallpaper migration; wallpaper is now stored in IndexedDB. */
  dashboardWallpaperStorageKey?: string
  /** localStorage key for search URL template with `%s` (default: `dashboard-search-url`). */
  searchUrlTemplateStorageKey?: string
  /** Previous preset id storage; read once to migrate, then removed. */
  legacySearchEngineStorageKey?: string
  defaultSearchUrlTemplate?: string
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  accent: AccentId
  setAccent: (accent: AccentId) => void
  /** Data URL or absolute URL; `null` clears the wallpaper. */
  dashboardWallpaper: string | null
  /** True while the wallpaper is being loaded from IndexedDB on mount. */
  wallpaperLoading: boolean
  setDashboardWallpaper: (value: string | null) => void
  /** Full URL template; use `%s` where the encoded query belongs. */
  searchUrlTemplate: string
  setSearchUrlTemplate: (template: string) => void
}

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
const THEME_VALUES: Theme[] = ["dark", "light", "system"]

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

function isTheme(value: string | null): value is Theme {
  if (value === null) {
    return false
  }

  return THEME_VALUES.includes(value as Theme)
}

function getSystemTheme(): ResolvedTheme {
  if (window.matchMedia(COLOR_SCHEME_QUERY).matches) {
    return "dark"
  }

  return "light"
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

function clearAccentInlineOverrides(root: HTMLElement) {
  for (const key of ACCENT_CSS_VARS) {
    root.style.removeProperty(key)
  }
}

function applyAccentToDocument(accent: AccentId, resolvedTheme: ResolvedTheme) {
  const root = document.documentElement

  if (accent === "neutral") {
    clearAccentInlineOverrides(root)
    return
  }

  const preset = ACCENT_PRESETS[accent]
  const vars = mergeAccentVariables(preset, resolvedTheme)

  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  accentStorageKey = "theme-accent",
  defaultAccent = "neutral",
  dashboardWallpaperStorageKey = "dashboard-wallpaper",
  searchUrlTemplateStorageKey = "dashboard-search-url",
  legacySearchEngineStorageKey = "dashboard-search-engine",
  defaultSearchUrlTemplate = DEFAULT_SEARCH_URL_TEMPLATE,
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey)
    if (isTheme(storedTheme)) {
      return storedTheme
    }

    return defaultTheme
  })

  const [accent, setAccentState] = React.useState<AccentId>(() => {
    const stored = localStorage.getItem(accentStorageKey)
    if (isAccentId(stored)) {
      return stored
    }

    return defaultAccent
  })

  const [dashboardWallpaper, setDashboardWallpaperState] = React.useState<
    string | null
  >(null)

  const [wallpaperLoading, setWallpaperLoading] = React.useState(true)

  const [searchUrlTemplate, setSearchUrlTemplateState] = React.useState(() => {
    return getInitialSearchUrlTemplate(
      searchUrlTemplateStorageKey,
      legacySearchEngineStorageKey,
      defaultSearchUrlTemplate
    )
  })

  const setSearchUrlTemplate = React.useCallback(
    (next: string) => {
      const trimmed = next.trim()
      localStorage.setItem(searchUrlTemplateStorageKey, trimmed)
      setSearchUrlTemplateState(trimmed)
    },
    [searchUrlTemplateStorageKey]
  )

  function setDashboardWallpaper(value: string | null) {
    if (value === null || value === "") {
      setDashboardWallpaperState(null)
      idbClearWallpaper()
      return
    }

    setDashboardWallpaperState(value)
    idbSaveWallpaper(value)
  }

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      localStorage.setItem(storageKey, nextTheme)
      setThemeState(nextTheme)
    },
    [storageKey]
  )

  const setAccent = React.useCallback(
    (nextAccent: AccentId) => {
      localStorage.setItem(accentStorageKey, nextAccent)
      setAccentState(nextAccent)
    },
    [accentStorageKey]
  )

  const applyTheme = React.useCallback(
    (nextTheme: Theme) => {
      const root = document.documentElement
      const resolvedTheme =
        nextTheme === "system" ? getSystemTheme() : nextTheme
      const restoreTransitions = disableTransitionOnChange
        ? disableTransitionsTemporarily()
        : null

      root.classList.remove("light", "dark")
      root.classList.add(resolvedTheme)

      if (restoreTransitions) {
        restoreTransitions()
      }
    },
    [disableTransitionOnChange]
  )

  React.useEffect(() => {
    applyTheme(theme)

    if (theme !== "system") {
      return undefined
    }

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    const handleChange = () => {
      applyTheme("system")
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme, applyTheme])

  React.useEffect(() => {
    const runAccent = () => {
      const resolved: ResolvedTheme =
        theme === "system" ? getSystemTheme() : theme
      const restoreTransitions = disableTransitionOnChange
        ? disableTransitionsTemporarily()
        : null

      applyAccentToDocument(accent, resolved)

      if (restoreTransitions) {
        restoreTransitions()
      }
    }

    runAccent()

    if (theme !== "system") {
      return undefined
    }

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    const handleChange = () => {
      runAccent()
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [accent, disableTransitionOnChange, theme])

  React.useEffect(() => {
    let cancelled = false

    async function initWallpaper() {
      const oldDataUrl = localStorage.getItem(dashboardWallpaperStorageKey)
      if (oldDataUrl && oldDataUrl.startsWith("data:")) {
        await idbSaveWallpaper(oldDataUrl)
        localStorage.removeItem(dashboardWallpaperStorageKey)
        if (!cancelled) {
          setDashboardWallpaperState(oldDataUrl)
          setWallpaperLoading(false)
        }
        return
      }

      try {
        const stored = await idbLoadWallpaper()
        if (!cancelled && stored) {
          setDashboardWallpaperState(stored)
        }
      } catch {
        /* IndexedDB unavailable */
      }

      if (!cancelled) {
        setWallpaperLoading(false)
      }
    }

    initWallpaper()
    return () => {
      cancelled = true
    }
  }, [dashboardWallpaperStorageKey])

  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) {
        return
      }

      if (event.key === storageKey) {
        if (isTheme(event.newValue)) {
          setThemeState(event.newValue)
        } else {
          setThemeState(defaultTheme)
        }
        return
      }

      if (event.key === accentStorageKey) {
        if (isAccentId(event.newValue)) {
          setAccentState(event.newValue)
        } else {
          setAccentState(defaultAccent)
        }
        return
      }

      if (event.key === searchUrlTemplateStorageKey) {
        if (event.newValue !== null && event.newValue.trim() !== "") {
          setSearchUrlTemplateState(event.newValue.trim())
        } else {
          setSearchUrlTemplateState(defaultSearchUrlTemplate)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [
    accentStorageKey,
    defaultAccent,
    defaultSearchUrlTemplate,
    defaultTheme,
    searchUrlTemplateStorageKey,
    storageKey,
  ])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      accent,
      setAccent,
      dashboardWallpaper,
      wallpaperLoading,
      setDashboardWallpaper,
      searchUrlTemplate,
      setSearchUrlTemplate,
    }),
    [
      accent,
      dashboardWallpaper,
      wallpaperLoading,
      searchUrlTemplate,
      setAccent,
      setSearchUrlTemplate,
      setTheme,
      theme,
    ]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
