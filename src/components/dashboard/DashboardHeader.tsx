import {
  MessageSquare,
  Mic,
  Moon,
  ScanSearch,
  Search,
  Settings,
  Sun,
} from "lucide-react"
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"

import { DashboardSettingsModal } from "@/components/dashboard/DashboardSettingsModal"
import { LiveClock } from "@/components/dashboard/LiveClock"
import { LiveGreeting } from "@/components/dashboard/LiveGreeting"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  openGoogleSearchByImage,
  resolveNavigationHref,
} from "@/lib/search-engine"

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"

function subscribePreferredColorScheme(onStoreChange: () => void) {
  const mq = window.matchMedia(COLOR_SCHEME_QUERY)
  mq.addEventListener("change", onStoreChange)
  return () => mq.removeEventListener("change", onStoreChange)
}

function getPreferredColorSchemeSnapshot(): "dark" | "light" {
  return window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light"
}

function getPreferredColorSchemeServerSnapshot(): "dark" | "light" {
  return "light"
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  if (target.isContentEditable) {
    return true
  }
  return Boolean(
    target.closest(
      "input, textarea, [contenteditable='true'], [contenteditable='']"
    )
  )
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognition) | undefined {
  if (typeof window === "undefined") {
    return undefined
  }
  return window.SpeechRecognition ?? window.webkitSpeechRecognition
}

type DashboardHeaderProps = {
  onOpenAssistant?: () => void
}

export function DashboardHeader({ onOpenAssistant }: DashboardHeaderProps) {
  const { theme, setTheme, searchUrlTemplate } = useTheme()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [voiceListening, setVoiceListening] = useState(false)
  const imageSearchInputRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null)
  const lastVoiceTranscriptRef = useRef("")
  const voiceUserStoppedRef = useRef(false)
  const voiceSessionFailedRef = useRef(false)
  const systemPref = useSyncExternalStore(
    subscribePreferredColorScheme,
    getPreferredColorSchemeSnapshot,
    getPreferredColorSchemeServerSnapshot
  )
  const resolvedTheme: "dark" | "light" =
    theme === "system" ? systemPref : theme

  useEffect(() => {
    return () => {
      speechRecognitionRef.current?.abort()
      speechRecognitionRef.current = null
    }
  }, [])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) {
        return
      }

      if (isEditableTarget(event.target)) {
        return
      }

      const key = event.key.toLowerCase()
      const isSlash = event.key === "/"
      const isFind = (event.ctrlKey || event.metaKey) && key === "k"

      if (!isSlash && !isFind) {
        return
      }

      if (isSlash && (event.ctrlKey || event.metaKey || event.altKey)) {
        return
      }

      event.preventDefault()
      searchInputRef.current?.focus()
    }

    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [])

  const runSearchNavigation = useCallback(() => {
    const href = resolveNavigationHref(searchQuery, searchUrlTemplate)
    if (href !== null) {
      window.location.assign(href)
    }
  }, [searchUrlTemplate, searchQuery])

  const handleSearchSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      runSearchNavigation()
    },
    [runSearchNavigation]
  )

  const handleImageSearchPick = useCallback(() => {
    imageSearchInputRef.current?.click()
  }, [])

  const handleImageSearchFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ""
      if (!file?.type.startsWith("image/")) {
        return
      }
      openGoogleSearchByImage(file)
    },
    []
  )

  const toggleVoiceSearch = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor()
    if (Ctor === undefined) {
      return
    }

    if (speechRecognitionRef.current !== null) {
      voiceUserStoppedRef.current = true
      speechRecognitionRef.current.stop()
      return
    }

    lastVoiceTranscriptRef.current = ""
    voiceUserStoppedRef.current = false
    voiceSessionFailedRef.current = false
    const recognition = new Ctor()
    recognition.lang = navigator.language || "en-US"
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let text = ""
      for (let i = 0; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript
      }
      const trimmed = text.trim()
      lastVoiceTranscriptRef.current = trimmed
      setSearchQuery(trimmed)
    }

    recognition.onerror = () => {
      voiceSessionFailedRef.current = true
      setVoiceListening(false)
      speechRecognitionRef.current = null
      voiceUserStoppedRef.current = false
    }

    recognition.onend = () => {
      setVoiceListening(false)
      speechRecognitionRef.current = null
      const userStopped = voiceUserStoppedRef.current
      const failed = voiceSessionFailedRef.current
      voiceUserStoppedRef.current = false
      voiceSessionFailedRef.current = false
      if (userStopped || failed) {
        return
      }
      const transcript = lastVoiceTranscriptRef.current
      if (transcript.length > 0) {
        const href = resolveNavigationHref(transcript, searchUrlTemplate)
        if (href !== null) {
          window.location.assign(href)
        }
      }
    }

    speechRecognitionRef.current = recognition
    setVoiceListening(true)
    recognition.start()
  }, [searchUrlTemplate])

  const speechSupported = useMemo(
    () => getSpeechRecognitionCtor() !== undefined,
    []
  )

  return (
    <header className="w-full">
      <div className="flex items-start justify-between gap-4 px-1">
        <LiveClock />

        <div className="flex shrink-0 items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground"
                aria-label={
                  resolvedTheme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="size-5" strokeWidth={2} aria-hidden />
                ) : (
                  <Moon className="size-5" strokeWidth={2} aria-hidden />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
            </TooltipContent>
          </Tooltip>
          {onOpenAssistant ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground"
                  aria-label="Open assistant"
                  onClick={onOpenAssistant}
                >
                  <MessageSquare className="size-5" strokeWidth={2} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                Chat assistant
              </TooltipContent>
            </Tooltip>
          ) : null}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground"
                aria-label="Open settings"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="size-5" strokeWidth={2} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              Settings
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <DashboardSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      <div className="mt-10 flex flex-col items-center text-center sm:mt-14">
        <LiveGreeting />

        <form
          className="relative mt-6 w-full max-w-xl sm:mt-8"
          onSubmit={handleSearchSubmit}
        >
          <label htmlFor="dashboard-search" className="sr-only">
            Search the web or type a URL
          </label>
          <input
            ref={imageSearchInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={handleImageSearchFile}
          />
          <Search
            className="pointer-events-none absolute top-1/2 left-5 z-1 size-5 -translate-y-1/2 text-muted-foreground"
            strokeWidth={2}
            aria-hidden
          />
          <Input
            id="dashboard-search"
            name="q"
            type="search"
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.blur()
              }
            }}
            placeholder="Search the web or type a URL"
            autoComplete="off"
            className="h-auto rounded-full border-border/80 bg-card py-3.5 pr-36 pl-14 text-center shadow-sm placeholder:text-muted-foreground focus-visible:ring-ring/25 sm:text-left"
          />
          <div className="absolute top-1/2 right-4 z-10 flex -translate-y-1/2 items-center gap-1.5">
            {!searchFocused ? (
              <kbd
                aria-hidden
                className="pointer-events-none inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border/70 px-1.5 text-xs font-medium text-muted-foreground"
              >
                /
              </kbd>
            ) : null}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="size-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Search by image on Google"
                  onClick={handleImageSearchPick}
                >
                  <ScanSearch className="size-5" strokeWidth={2} aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                Search by image (Google)
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className={
                    voiceListening
                      ? "size-8 shrink-0 rounded-full text-destructive hover:text-destructive"
                      : "size-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                  }
                  aria-label={
                    voiceListening ? "Stop voice search" : "Voice search"
                  }
                  aria-pressed={voiceListening}
                  disabled={!speechSupported}
                  onClick={toggleVoiceSearch}
                >
                  <Mic className="size-5" strokeWidth={2} aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                {!speechSupported
                  ? "Voice search needs a supported browser (e.g. Chrome)"
                  : voiceListening
                    ? "Stop without searching"
                    : "Voice search (then opens results)"}
              </TooltipContent>
            </Tooltip>
          </div>
        </form>
      </div>
    </header>
  )
}
