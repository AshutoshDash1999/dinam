import type { DashboardStateContextValue } from "@/context/dashboard-state"
import { AI_PROVIDER_API_KEY_STORAGE_KEY } from "@/lib/ai-provider-settings"
import { isAccentId, type AccentId } from "@/lib/theme-accent-presets"

export type AgentThemeBridge = {
  theme: "dark" | "light" | "system"
  setTheme: (t: "dark" | "light" | "system") => void
  searchUrlTemplate: string
  setSearchUrlTemplate: (s: string) => void
  accent: AccentId
  setAccent: (a: AccentId) => void
}

export type AgentExecutionContext = {
  dashboard: DashboardStateContextValue
  theme: AgentThemeBridge
}

const STORAGE_WRITE_EXACT = new Set([
  "theme",
  "theme-accent",
  "dashboard-wallpaper",
  "dashboard-search-url",
])

function canMutateStorageKey(key: string): boolean {
  if (STORAGE_WRITE_EXACT.has(key)) return true
  if (key.startsWith("dinam-")) return true
  return false
}

function str(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined
}

function bool(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined
}

function num(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined
}

function obj(v: unknown): Record<string, unknown> | null {
  return typeof v === "object" && v !== null && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null
}

function numArray(v: unknown): number[] | null {
  if (!Array.isArray(v)) return null
  const out: number[] = []
  for (const x of v) {
    if (typeof x !== "number" || !Number.isFinite(x)) return null
    out.push(x)
  }
  return out
}

export const AGENT_TOOL_DEFINITIONS: Record<string, unknown>[] = [
  {
    type: "function",
    function: {
      name: "dashboard_list_tasks",
      description: "List all focus tasks with id, label, and done status.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "dashboard_add_task",
      description: "Add a new task to the dashboard focus list.",
      parameters: {
        type: "object",
        properties: {
          label: { type: "string", description: "Task text" },
        },
        required: ["label"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "dashboard_toggle_task",
      description: "Toggle a task between done and not done.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string", description: "Task id from list" },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "dashboard_update_task",
      description: "Update a task label and/or done state.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string" },
          label: { type: "string" },
          done: { type: "boolean" },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "dashboard_delete_task",
      description: "Remove a task by id.",
      parameters: {
        type: "object",
        properties: { id: { type: "string" } },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "dashboard_clear_completed_tasks",
      description: "Delete all tasks that are marked done.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "dashboard_list_bookmarks",
      description: "List saved bookmarks with id, title, href.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "dashboard_add_bookmark",
      description: "Add a bookmark link to the sidebar.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          href: { type: "string" },
        },
        required: ["title", "href"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "dashboard_delete_bookmark",
      description: "Remove a bookmark by id.",
      parameters: {
        type: "object",
        properties: { id: { type: "string" } },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "dashboard_list_quick_launch",
      description: "List quick-launch shortcuts (title, url, id).",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "dashboard_add_quick_launch",
      description: "Add a shortcut to the quick-launch grid.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          url: { type: "string" },
        },
        required: ["title", "url"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "dashboard_remove_quick_launch",
      description: "Remove a quick-launch item by id.",
      parameters: {
        type: "object",
        properties: { id: { type: "string" } },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "dashboard_update_quick_launch",
      description: "Update title and/or url for a quick-launch item.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          url: { type: "string" },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "settings_get_summary",
      description:
        "Read current theme mode, accent, search URL template, page URL, language, timezone. Whether an API token is configured is reported without revealing the secret.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "settings_set_theme",
      description: "Set light, dark, or system color theme.",
      parameters: {
        type: "object",
        properties: {
          theme: {
            type: "string",
            enum: ["light", "dark", "system"],
          },
        },
        required: ["theme"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "settings_set_accent",
      description:
        "Set dashboard accent: neutral, blue, green, orange, red, rose, violet, yellow.",
      parameters: {
        type: "object",
        properties: { accent: { type: "string" } },
        required: ["accent"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "settings_set_search_url_template",
      description:
        "Set the dashboard search box URL template; must include %s for the query.",
      parameters: {
        type: "object",
        properties: { template: { type: "string" } },
        required: ["template"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "browser_open_url",
      description:
        "Open a URL in the same tab or a new tab. Prefer https URLs.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string" },
          new_tab: {
            type: "boolean",
            description: "Default true",
          },
        },
        required: ["url"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "browser_copy_to_clipboard",
      description: "Copy text to the system clipboard.",
      parameters: {
        type: "object",
        properties: { text: { type: "string" } },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "browser_read_clipboard",
      description:
        "Read plain text from the clipboard (may fail without permission).",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "browser_get_environment",
      description:
        "Page URL, title, user agent, language, timezone, viewport size, online status.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "browser_speak",
      description: "Speak text aloud using the browser TTS engine.",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string" },
          rate: { type: "number" },
          pitch: { type: "number" },
          lang: { type: "string" },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "browser_stop_speaking",
      description: "Cancel any in-progress speech synthesis.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "browser_notify",
      description: "Show a desktop notification if permission was granted.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          body: { type: "string" },
        },
        required: ["title", "body"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "browser_download_text_file",
      description: "Trigger download of a text file in the browser.",
      parameters: {
        type: "object",
        properties: {
          filename: { type: "string" },
          content: { type: "string" },
          mime_type: { type: "string" },
        },
        required: ["filename", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "browser_print_page",
      description: "Open the browser print dialog for the current page.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "browser_vibrate_pattern",
      description:
        "Vibrate device (mobile); pattern is milliseconds on/off alternating.",
      parameters: {
        type: "object",
        properties: {
          pattern: {
            type: "array",
            items: { type: "number" },
            description: "e.g. [200, 100, 200]",
          },
        },
        required: ["pattern"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "browser_get_geolocation",
      description:
        "Request one-shot geolocation (user may deny). Returns lat/lng accuracy.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "browser_http_get",
      description:
        "GET a public https URL from the user's browser (subject to CORS). Max ~100k chars. Do not use for secrets.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string" },
          max_bytes: { type: "number" },
        },
        required: ["url"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "local_storage_list_keys",
      description: "List localStorage keys, optionally filtered by prefix.",
      parameters: {
        type: "object",
        properties: {
          prefix: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "local_storage_get",
      description: "Read a localStorage value by key (string values only).",
      parameters: {
        type: "object",
        properties: { key: { type: "string" } },
        required: ["key"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "local_storage_set",
      description:
        "Write localStorage only for dinam-* keys or theme/dashboard settings keys.",
      parameters: {
        type: "object",
        properties: {
          key: { type: "string" },
          value: { type: "string" },
        },
        required: ["key", "value"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "local_storage_remove",
      description:
        "Remove a localStorage key (same allowlist as local_storage_set). Never removes API key storage via this tool.",
      parameters: {
        type: "object",
        properties: { key: { type: "string" } },
        required: ["key"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "session_storage_list_keys",
      description: "List sessionStorage keys with optional prefix filter.",
      parameters: {
        type: "object",
        properties: { prefix: { type: "string" } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "session_storage_get",
      description: "Read sessionStorage by key.",
      parameters: {
        type: "object",
        properties: { key: { type: "string" } },
        required: ["key"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "session_storage_set",
      description: "Write sessionStorage only for keys starting with dinam-",
      parameters: {
        type: "object",
        properties: {
          key: { type: "string" },
          value: { type: "string" },
        },
        required: ["key", "value"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "session_storage_remove",
      description: "Remove sessionStorage key if it starts with dinam-",
      parameters: {
        type: "object",
        properties: { key: { type: "string" } },
        required: ["key"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "window_scroll",
      description: "Scroll the page; omit top/left to only set behavior.",
      parameters: {
        type: "object",
        properties: {
          top: { type: "number" },
          left: { type: "number" },
          behavior: { type: "string", enum: ["auto", "smooth"] },
        },
      },
    },
  },
]

export async function executeAgentTool(
  name: string,
  rawArgs: unknown,
  ctx: AgentExecutionContext
): Promise<unknown> {
  const args = obj(rawArgs) ?? {}
  const d = ctx.dashboard
  const t = ctx.theme

  switch (name) {
    case "dashboard_list_tasks":
      return { tasks: d.todos }
    case "dashboard_add_task": {
      const label = str(args.label)
      if (!label?.trim()) return { error: "label required" }
      const id = d.addTodo(label)
      return id ? { id } : { error: "empty task" }
    }
    case "dashboard_toggle_task": {
      const id = str(args.id)
      if (!id) return { error: "id required" }
      if (!d.todos.some((x) => x.id === id)) return { error: "not found" }
      d.toggleTodo(id)
      return { ok: true }
    }
    case "dashboard_update_task": {
      const id = str(args.id)
      if (!id) return { error: "id required" }
      if (!d.todos.some((x) => x.id === id)) return { error: "not found" }
      const patch: { label?: string; done?: boolean } = {}
      if (args.label !== undefined) {
        const l = str(args.label)
        if (l !== undefined) patch.label = l
      }
      const done = bool(args.done)
      if (done !== undefined) patch.done = done
      d.updateTodo(id, patch)
      return { ok: true }
    }
    case "dashboard_delete_task": {
      const id = str(args.id)
      if (!id) return { error: "id required" }
      d.deleteTodo(id)
      return { ok: true }
    }
    case "dashboard_clear_completed_tasks":
      d.clearCompletedTodos()
      return { ok: true }
    case "dashboard_list_bookmarks":
      return { bookmarks: d.bookmarks }
    case "dashboard_add_bookmark": {
      const title = str(args.title)
      const href = str(args.href)
      if (!title || !href) return { error: "title and href required" }
      const id = d.addBookmark(title, href)
      return { id }
    }
    case "dashboard_delete_bookmark": {
      const id = str(args.id)
      if (!id) return { error: "id required" }
      d.deleteBookmark(id)
      return { ok: true }
    }
    case "dashboard_list_quick_launch":
      return { items: d.quickLaunchItems }
    case "dashboard_add_quick_launch": {
      const title = str(args.title) ?? ""
      const url = str(args.url) ?? ""
      const id = d.addQuickLaunchItem(title, url)
      return id ? { id } : { error: "invalid shortcut" }
    }
    case "dashboard_remove_quick_launch": {
      const id = str(args.id)
      if (!id) return { error: "id required" }
      d.removeQuickLaunchItem(id)
      return { ok: true }
    }
    case "dashboard_update_quick_launch": {
      const id = str(args.id)
      if (!id) return { error: "id required" }
      const patch: Partial<{
        title: string
        url: string
      }> = {}
      if (args.title !== undefined) {
        const t = str(args.title)
        if (t !== undefined) patch.title = t
      }
      if (args.url !== undefined) {
        const u = str(args.url)
        if (u !== undefined) patch.url = u
      }
      d.updateQuickLaunchItem(id, patch)
      return { ok: true }
    }
    case "settings_get_summary":
      return {
        theme: t.theme,
        accent: t.accent,
        search_url_template: t.searchUrlTemplate,
        page_url: window.location.href,
        page_title: document.title,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        user_agent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        online: navigator.onLine,
        api_key_configured: Boolean(
          localStorage.getItem(AI_PROVIDER_API_KEY_STORAGE_KEY)
        ),
      }
    case "settings_set_theme": {
      const theme = str(args.theme)
      if (theme !== "light" && theme !== "dark" && theme !== "system") {
        return { error: "theme must be light, dark, or system" }
      }
      t.setTheme(theme)
      return { ok: true }
    }
    case "settings_set_accent": {
      const accent = str(args.accent)
      if (!accent || !isAccentId(accent)) {
        return { error: "invalid accent id" }
      }
      t.setAccent(accent)
      return { ok: true }
    }
    case "settings_set_search_url_template": {
      const template = str(args.template)
      if (!template) return { error: "template required" }
      t.setSearchUrlTemplate(template)
      return { ok: true }
    }
    case "browser_open_url": {
      const url = str(args.url)
      if (!url) return { error: "url required" }
      let parsed: URL
      try {
        parsed = new URL(url)
      } catch {
        return { error: "invalid url" }
      }
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return { error: "only http(s) URLs allowed" }
      }
      const newTab = args.new_tab !== undefined ? bool(args.new_tab) : true
      if (newTab !== false) {
        window.open(parsed.href, "_blank", "noopener,noreferrer")
      } else {
        window.location.assign(parsed.href)
      }
      return { ok: true }
    }
    case "browser_copy_to_clipboard": {
      const text = str(args.text)
      if (text === undefined) return { error: "text required" }
      await navigator.clipboard.writeText(text)
      return { ok: true }
    }
    case "browser_read_clipboard": {
      try {
        const text = await navigator.clipboard.readText()
        return { text }
      } catch (e) {
        return {
          error: e instanceof Error ? e.message : "clipboard read failed",
        }
      }
    }
    case "browser_get_environment":
      return {
        href: window.location.href,
        title: document.title,
        user_agent: navigator.userAgent,
        language: navigator.language,
        languages: [...navigator.languages],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height,
        },
        online: navigator.onLine,
        cookie_enabled: navigator.cookieEnabled,
      }
    case "browser_speak": {
      const text = str(args.text)
      if (!text) return { error: "text required" }
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      const rate = num(args.rate)
      const pitch = num(args.pitch)
      const lang = str(args.lang)
      if (rate !== undefined) u.rate = rate
      if (pitch !== undefined) u.pitch = pitch
      if (lang) u.lang = lang
      window.speechSynthesis.speak(u)
      return { ok: true }
    }
    case "browser_stop_speaking":
      window.speechSynthesis.cancel()
      return { ok: true }
    case "browser_notify": {
      const title = str(args.title)
      const body = str(args.body) ?? ""
      if (!title) return { error: "title required" }
      if (!("Notification" in window)) {
        return { error: "notifications not supported" }
      }
      if (Notification.permission === "default") {
        await Notification.requestPermission()
      }
      if (Notification.permission !== "granted") {
        return { error: "notification permission denied" }
      }
      new Notification(title, { body })
      return { ok: true }
    }
    case "browser_download_text_file": {
      const filename = str(args.filename)
      const content = str(args.content)
      if (!filename || content === undefined) {
        return { error: "filename and content required" }
      }
      const mime = str(args.mime_type) ?? "text/plain;charset=utf-8"
      const blob = new Blob([content], { type: mime })
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = filename
      a.rel = "noopener"
      a.click()
      URL.revokeObjectURL(a.href)
      return { ok: true }
    }
    case "browser_print_page":
      window.print()
      return { ok: true }
    case "browser_vibrate_pattern": {
      const pattern = numArray(args.pattern)
      if (!pattern?.length) return { error: "pattern array required" }
      if (!navigator.vibrate) return { error: "vibrate not supported" }
      navigator.vibrate(pattern)
      return { ok: true }
    }
    case "browser_get_geolocation":
      return await new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve({ error: "geolocation not supported" })
          return
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy_m: pos.coords.accuracy,
            })
          },
          (err) => resolve({ error: err.message }),
          { enableHighAccuracy: false, timeout: 15_000 }
        )
      })
    case "browser_http_get": {
      const url = str(args.url)
      if (!url) return { error: "url required" }
      let parsed: URL
      try {
        parsed = new URL(url)
      } catch {
        return { error: "invalid url" }
      }
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return { error: "only http(s) URLs" }
      }
      if (
        parsed.protocol === "http:" &&
        parsed.hostname !== "localhost" &&
        parsed.hostname !== "127.0.0.1"
      ) {
        return { error: "http only allowed for localhost" }
      }
      const maxBytes = Math.min(num(args.max_bytes) ?? 100_000, 500_000)
      const ac = new AbortController()
      const timer = window.setTimeout(() => ac.abort(), 20_000)
      try {
        const res = await fetch(url, {
          method: "GET",
          signal: ac.signal,
          credentials: "omit",
        })
        const text = await res.text()
        const slice = text.slice(0, maxBytes)
        return {
          status: res.status,
          truncated: text.length > maxBytes,
          content_type: res.headers.get("content-type"),
          body_preview: slice,
        }
      } catch (e) {
        return {
          error: e instanceof Error ? e.message : "fetch failed",
        }
      } finally {
        window.clearTimeout(timer)
      }
    }
    case "local_storage_list_keys": {
      const prefix = str(args.prefix) ?? ""
      const keys: string[] = []
      for (let i = 0; i < localStorage.length; i += 1) {
        const k = localStorage.key(i)
        if (k && k.startsWith(prefix)) keys.push(k)
      }
      return { keys }
    }
    case "local_storage_get": {
      const key = str(args.key)
      if (!key) return { error: "key required" }
      const value = localStorage.getItem(key)
      if (key === AI_PROVIDER_API_KEY_STORAGE_KEY) {
        return {
          key,
          value: value ? "[redacted]" : null,
        }
      }
      return { key, value }
    }
    case "local_storage_set": {
      const key = str(args.key)
      const value = str(args.value)
      if (!key || value === undefined) {
        return { error: "key and value required" }
      }
      if (key === AI_PROVIDER_API_KEY_STORAGE_KEY) {
        return { error: "cannot set API key via this tool" }
      }
      if (!canMutateStorageKey(key)) {
        return { error: "key not allowed for write" }
      }
      localStorage.setItem(key, value)
      return { ok: true }
    }
    case "local_storage_remove": {
      const key = str(args.key)
      if (!key) return { error: "key required" }
      if (key === AI_PROVIDER_API_KEY_STORAGE_KEY) {
        return { error: "cannot remove API key via this tool" }
      }
      if (!canMutateStorageKey(key)) {
        return { error: "key not allowed for remove" }
      }
      localStorage.removeItem(key)
      return { ok: true }
    }
    case "session_storage_list_keys": {
      const prefix = str(args.prefix) ?? ""
      const keys: string[] = []
      for (let i = 0; i < sessionStorage.length; i += 1) {
        const k = sessionStorage.key(i)
        if (k && k.startsWith(prefix)) keys.push(k)
      }
      return { keys }
    }
    case "session_storage_get": {
      const key = str(args.key)
      if (!key) return { error: "key required" }
      return { key, value: sessionStorage.getItem(key) }
    }
    case "session_storage_set": {
      const key = str(args.key)
      const value = str(args.value)
      if (!key || value === undefined) {
        return { error: "key and value required" }
      }
      if (!key.startsWith("dinam-")) {
        return { error: "only dinam-* session keys allowed" }
      }
      sessionStorage.setItem(key, value)
      return { ok: true }
    }
    case "session_storage_remove": {
      const key = str(args.key)
      if (!key) return { error: "key required" }
      if (!key.startsWith("dinam-")) {
        return { error: "only dinam-* session keys allowed" }
      }
      sessionStorage.removeItem(key)
      return { ok: true }
    }
    case "window_scroll": {
      const top = num(args.top)
      const left = num(args.left)
      const behavior = str(args.behavior) === "smooth" ? "smooth" : "auto"
      window.scrollTo({
        top: top ?? window.scrollY,
        left: left ?? window.scrollX,
        behavior,
      })
      return { ok: true }
    }
    default:
      return { error: `unknown_tool: ${name}` }
  }
}
