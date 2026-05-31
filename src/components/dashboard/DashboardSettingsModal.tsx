"use client"

import { ImageIcon } from "lucide-react"
import { type ChangeEvent, useEffect, useId, useRef, useState } from "react"

import {
  SEARCH_ENGINES,
  getSearchEngineById,
  getSearchEngineIdFromTemplate,
  type SearchEngineId,
} from "@/config/search-engines"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DEFAULT_AI_MODEL,
  isAiProviderBaseUrlValid,
  useAiProviderSettings,
} from "@/lib/ai-provider-settings"
import {
  DEFAULT_SEARCH_URL_TEMPLATE,
  isSearchUrlTemplateValid,
} from "@/lib/search-engine"
import { ACCENT_OPTIONS, type AccentId } from "@/lib/theme-accent-presets"
import { cn } from "@/lib/utils"
import { compressImageFile } from "@/lib/wallpaper-storage"

const MAX_WALLPAPER_BYTES = 10 * 1024 * 1024

type SettingsSectionId = "appearance" | "search" | "assistant"

const SETTINGS_SECTIONS: { id: SettingsSectionId; label: string }[] = [
  { id: "appearance", label: "Appearance" },
  { id: "search", label: "Search" },
  { id: "assistant", label: "Assistant" },
]

type DashboardSettingsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DashboardSettingsModal({
  open,
  onOpenChange,
}: DashboardSettingsModalProps) {
  const {
    accent,
    setAccent,
    dashboardWallpaper,
    setDashboardWallpaper,
    searchUrlTemplate,
    setSearchUrlTemplate,
  } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const wallpaperInputId = useId()
  const aiBaseUrlId = useId()
  const aiApiKeyId = useId()
  const aiModelId = useId()
  const searchEngineSelectId = useId()
  const searchUrlId = useId()
  const accentId = useId()

  const [activeSection, setActiveSection] =
    useState<SettingsSectionId>("appearance")
  const [wallpaperError, setWallpaperError] = useState<string | null>(null)

  const {
    baseUrl: aiBaseUrl,
    setBaseUrl: setAiBaseUrl,
    apiKey: aiApiKey,
    setApiKey: setAiApiKey,
    model: aiModel,
    setModel: setAiModel,
  } = useAiProviderSettings()

  const searchEngineValue =
    getSearchEngineIdFromTemplate(searchUrlTemplate) ?? "custom"

  useEffect(() => {
    if (!open) {
      return
    }
    const id = requestAnimationFrame(() => {
      setActiveSection("appearance")
    })
    return () => cancelAnimationFrame(id)
  }, [open])

  const handleWallpaperPick = () => {
    setWallpaperError(null)
    fileInputRef.current?.click()
  }

  const [wallpaperSaving, setWallpaperSaving] = useState(false)

  const handleWallpaperFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      setWallpaperError("Choose an image file.")
      return
    }

    if (file.size > MAX_WALLPAPER_BYTES) {
      setWallpaperError(
        `Image must be ${MAX_WALLPAPER_BYTES / (1024 * 1024)} MB or smaller.`
      )
      return
    }

    setWallpaperSaving(true)
    setWallpaperError(null)

    compressImageFile(file)
      .then((dataUrl) => {
        setDashboardWallpaper(dataUrl)
      })
      .catch(() => {
        setWallpaperError("Could not process that image.")
      })
      .finally(() => {
        setWallpaperSaving(false)
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90dvh,40rem)] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl sm:p-0">
        <div className="border-b border-border/60 p-6 pb-4">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Appearance, search box, and optional chat assistant (any
              OpenAI-compatible API). Toggle light/dark from the header anytime.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 p-6 pt-4 sm:flex-row sm:gap-0 sm:pt-0">
          <div className="shrink-0 sm:w-44 sm:border-r sm:border-border/60 sm:py-4 sm:pr-4 sm:pl-6">
            <label className="sr-only" htmlFor="settings-section-mobile">
              Settings section
            </label>
            <Select
              value={activeSection}
              onValueChange={(v) => setActiveSection(v as SettingsSectionId)}
            >
              <SelectTrigger
                id="settings-section-mobile"
                className="w-full rounded-2xl border-border/80 sm:hidden"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SETTINGS_SECTIONS.map(({ id, label }) => (
                  <SelectItem key={id} value={id}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <nav
              className="mt-0 hidden flex-col gap-0.5 sm:flex"
              role="tablist"
              aria-label="Settings sections"
            >
              {SETTINGS_SECTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeSection === id}
                  id={`settings-tab-${id}`}
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    "rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors",
                    activeSection === id
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div
            className="min-h-0 min-w-0 flex-1 overflow-y-auto sm:max-h-[min(28rem,55vh)] sm:py-4 sm:pr-6 sm:pl-4"
            role="tabpanel"
            aria-label={
              SETTINGS_SECTIONS.find((s) => s.id === activeSection)?.label ??
              "Settings"
            }
          >
            {activeSection === "appearance" ? (
              <div className="grid gap-6 pr-1">
                <div className="grid gap-2">
                  <label
                    className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
                    htmlFor={wallpaperInputId}
                  >
                    Wallpaper
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Full-page background behind the dashboard. Stored in this
                    browser only.
                  </p>
                  <input
                    ref={fileInputRef}
                    id={wallpaperInputId}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleWallpaperFile}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-2xl border-border/80"
                      onClick={handleWallpaperPick}
                      disabled={wallpaperSaving}
                    >
                      <ImageIcon className="size-4 opacity-80" aria-hidden />
                      {wallpaperSaving
                        ? "Compressing…"
                        : dashboardWallpaper
                          ? "Replace image"
                          : "Upload image"}
                    </Button>
                    {dashboardWallpaper ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rounded-2xl text-muted-foreground"
                        onClick={() => {
                          setWallpaperError(null)
                          setDashboardWallpaper(null)
                        }}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                  {wallpaperError ? (
                    <p className="text-xs text-destructive">{wallpaperError}</p>
                  ) : null}
                  {dashboardWallpaper ? (
                    <div
                      className="mt-1 overflow-hidden rounded-2xl border border-border/60 bg-muted/40"
                      aria-hidden
                    >
                      <img
                        src={dashboardWallpaper}
                        alt=""
                        className="aspect-video max-h-28 w-full object-cover"
                      />
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-2 border-t border-border/60 pt-2">
                  <label
                    className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
                    htmlFor={accentId}
                  >
                    Accent color
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Uses the same semantic tokens as the rest of the app (
                    <code className="rounded bg-muted px-1 py-px text-[0.7rem]">
                      bg-primary
                    </code>
                    , etc.). Neutral keeps colors from the app default theme.
                  </p>
                  <Select
                    value={accent}
                    onValueChange={(value) => setAccent(value as AccentId)}
                  >
                    <SelectTrigger
                      id={accentId}
                      className="w-full rounded-2xl border-border/80"
                    >
                      <SelectValue placeholder="Choose accent" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCENT_OPTIONS.map(({ id, label }) => (
                        <SelectItem key={id} value={id}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : null}

            {activeSection === "search" ? (
              <div className="grid gap-4 pr-1">
                <div className="grid gap-2">
                  <label
                    className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
                    htmlFor={searchEngineSelectId}
                  >
                    Search engine
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Select the default engine used by the search box.
                  </p>
                  <Select
                    value={searchEngineValue}
                    onValueChange={(value) => {
                      if (value === "custom") {
                        return
                      }
                      const engine = getSearchEngineById(
                        value as SearchEngineId
                      )
                      if (engine) {
                        setSearchUrlTemplate(engine.template)
                      }
                    }}
                  >
                    <SelectTrigger
                      id={searchEngineSelectId}
                      className="w-full rounded-2xl border-border/80"
                    >
                      <SelectValue placeholder="Choose engine" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEARCH_ENGINES.map((engine) => (
                        <SelectItem key={engine.id} value={engine.id}>
                          {engine.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2 border-t border-border/60 pt-2">
                  <label
                    className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
                    htmlFor={searchUrlId}
                  >
                    Search URL template
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Template for the dashboard search box. Put{" "}
                    <code className="rounded bg-muted px-1 py-px text-[0.7rem]">
                      %s
                    </code>{" "}
                    where the encoded query goes (e.g.{" "}
                    <code className="rounded bg-muted px-1 py-px text-[0.7rem]">
                      https://duckduckgo.com/?q=%s
                    </code>
                    ). Sites cannot read your browser default engine—match what
                    you would type in the address bar. Ignored when you open a
                    direct URL.
                  </p>
                  <Input
                    id={searchUrlId}
                    type="text"
                    spellCheck={false}
                    autoComplete="off"
                    value={searchUrlTemplate}
                    onChange={(e) => setSearchUrlTemplate(e.target.value)}
                    placeholder={DEFAULT_SEARCH_URL_TEMPLATE}
                    className="rounded-2xl border-border/80 font-mono text-sm"
                  />
                  {!isSearchUrlTemplateValid(searchUrlTemplate) ? (
                    <p className="text-xs text-destructive">
                      Add %s for the query. Searches will use Google until this
                      is fixed.
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {activeSection === "assistant" ? (
              <div className="grid gap-6 pr-1">
                <div className="grid gap-2">
                  <label
                    className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
                    htmlFor={aiBaseUrlId}
                  >
                    Chat API base URL
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Root URL for an <strong>OpenAI-compatible</strong>{" "}
                    <code className="rounded bg-muted px-1 py-px text-[0.7rem]">
                      /chat/completions
                    </code>{" "}
                    endpoint—no trailing slash. Examples:{" "}
                    <code className="rounded bg-muted px-1 py-px text-[0.7rem]">
                      https://api.openai.com/v1
                    </code>
                    ,{" "}
                    <code className="rounded bg-muted px-1 py-px text-[0.7rem]">
                      http://localhost:11434/v1
                    </code>{" "}
                    (Ollama), or your proxy. Leave empty to disable the
                    assistant.
                  </p>
                  <Input
                    id={aiBaseUrlId}
                    type="text"
                    spellCheck={false}
                    autoComplete="off"
                    value={aiBaseUrl}
                    onChange={(e) => setAiBaseUrl(e.target.value)}
                    placeholder="https://…/v1"
                    className="rounded-2xl border-border/80 font-mono text-sm"
                  />
                  {!isAiProviderBaseUrlValid(aiBaseUrl) ? (
                    <p className="text-xs text-destructive">
                      Enter a valid http(s) URL or clear the field.
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-2 border-t border-border/60 pt-2">
                  <label
                    className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
                    htmlFor={aiApiKeyId}
                  >
                    API key or token
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Sent as{" "}
                    <code className="rounded bg-muted px-1 py-px text-[0.7rem]">
                      Authorization: Bearer …
                    </code>
                    . Stored only in this browser. Some local servers accept any
                    non-empty value; get the real secret from your
                    provider—never share it.
                  </p>
                  <Input
                    id={aiApiKeyId}
                    type="password"
                    spellCheck={false}
                    autoComplete="off"
                    value={aiApiKey}
                    onChange={(e) => setAiApiKey(e.target.value)}
                    onBlur={() => setAiApiKey(aiApiKey.trim())}
                    placeholder="Key or token (if required)"
                    className="rounded-2xl border-border/80 font-mono text-sm"
                  />
                  {aiApiKey !== "" ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 justify-self-start rounded-2xl text-muted-foreground"
                      onClick={() => setAiApiKey("")}
                    >
                      Remove API key
                    </Button>
                  ) : null}
                </div>

                <div className="grid gap-2 border-t border-border/60 pt-2">
                  <label
                    className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
                    htmlFor={aiModelId}
                  >
                    Model id
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Name your server expects (e.g.{" "}
                    <code className="rounded bg-muted px-1 py-px text-[0.7rem]">
                      gpt-4o-mini
                    </code>
                    ,{" "}
                    <code className="rounded bg-muted px-1 py-px text-[0.7rem]">
                      llama3.2
                    </code>
                    ). Clear the field to use the built-in default (
                    <code className="rounded bg-muted px-1 py-px text-[0.7rem]">
                      {DEFAULT_AI_MODEL}
                    </code>
                    )—handy for OpenAI-style hosts; change it for Ollama or
                    other APIs.
                  </p>
                  <Input
                    id={aiModelId}
                    type="text"
                    spellCheck={false}
                    autoComplete="off"
                    value={aiModel === DEFAULT_AI_MODEL ? "" : aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    onBlur={() => {
                      const t = aiModel.trim()
                      setAiModel(t === "" ? "" : t)
                    }}
                    placeholder={DEFAULT_AI_MODEL}
                    className="rounded-2xl border-border/80 font-mono text-sm"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
