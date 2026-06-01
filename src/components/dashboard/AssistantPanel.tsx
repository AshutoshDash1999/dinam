import { Loader2, MessageSquare, Send, Trash2, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useDashboardState } from "@/context/dashboard-state"
import {
  AGENT_TOOL_DEFINITIONS,
  executeAgentTool,
  type AgentExecutionContext,
} from "@/lib/agent-tools"
import { requestChatCompletion } from "@/lib/ai-chat-completion"
import {
  isAiProviderBaseUrlValid,
  useAiProviderSettings,
} from "@/lib/ai-provider-settings"
import { cn } from "@/lib/utils"

const SYSTEM_PROMPT = `You are Dinam, the assistant for this personal new-tab dashboard.

You can manage focus tasks, bookmarks, and quick-launch shortcuts; adjust theme, accent, and search URL template; and use browser capabilities: open URLs, clipboard, text-to-speech, notifications, downloads, print, scroll, vibration (if supported), geolocation, and careful HTTP GET (CORS may block).

The user may connect any OpenAI-compatible chat API (OpenAI, Ollama, Groq, proxies, etc.)—never assume a single vendor.

Always use the provided tools instead of inventing data. Prefer opening links in a new tab. Be concise. If a tool returns an error, explain briefly and suggest a fix.`

const MAX_TOOL_ROUNDS = 14
const MAX_CONTEXT_MESSAGES = 20
const TOKEN_BUDGET = 100_000

function estimateTokens(messages: Record<string, unknown>[]): number {
  return messages.reduce((sum, m) => {
    const text = typeof m.content === "string" ? m.content : JSON.stringify(m)
    return sum + Math.ceil(text.length / 4)
  }, 0)
}

type ChatTurn = {
  role: "user" | "assistant"
  content: string
}

type AssistantPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssistantPanel({ open, onOpenChange }: AssistantPanelProps) {
  const dashboard = useDashboardState()
  const {
    theme,
    setTheme,
    searchUrlTemplate,
    setSearchUrlTemplate,
    accent,
    setAccent,
  } = useTheme()
  const { baseUrl, apiKey, model } = useAiProviderSettings()

  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const ctx: AgentExecutionContext = useMemo(
    () => ({
      dashboard,
      theme: {
        theme,
        setTheme,
        searchUrlTemplate,
        setSearchUrlTemplate,
        accent,
        setAccent,
      },
    }),
    [
      accent,
      dashboard,
      searchUrlTemplate,
      setAccent,
      setSearchUrlTemplate,
      setTheme,
      theme,
    ]
  )

  useEffect(() => {
    if (!open) return
    const el = listRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [open, turns, busy])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  const runAgent = useCallback(
    async (historyIncludingLatestUser: ChatTurn[]) => {
      if (!baseUrl.trim() || !isAiProviderBaseUrlValid(baseUrl)) {
        throw new Error(
          "Configure a valid chat API base URL under Settings → Assistant."
        )
      }
      if (!apiKey.trim()) {
        throw new Error(
          "Add an API key or token under Settings → Assistant (use a placeholder if your server allows)."
        )
      }

      const recentHistory =
        historyIncludingLatestUser.length > MAX_CONTEXT_MESSAGES
          ? historyIncludingLatestUser.slice(-MAX_CONTEXT_MESSAGES)
          : historyIncludingLatestUser

      const apiMessages: Record<string, unknown>[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...recentHistory.map((t) => ({
          role: t.role,
          content: t.content,
        })),
      ]

      for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
        if (estimateTokens(apiMessages) > TOKEN_BUDGET * 0.8) {
          throw new Error(
            "Conversation too long for the model context — please clear the chat and try again."
          )
        }

        const res = await requestChatCompletion({
          baseUrl,
          apiKey,
          model,
          messages: apiMessages,
          tools: AGENT_TOOL_DEFINITIONS,
        })

        const message = res.choices?.[0]?.message
        if (!message) {
          throw new Error("The model returned an empty response.")
        }

        const toolCalls = message.tool_calls
        if (!toolCalls?.length) {
          const text = message.content?.trim() || "(No text reply.)"
          apiMessages.push({
            role: "assistant",
            content: message.content,
          })
          return text
        }

        apiMessages.push({
          role: "assistant",
          content: message.content,
          tool_calls: toolCalls,
        })

        for (const tc of toolCalls) {
          let parsed: Record<string, unknown> = {}
          try {
            parsed = JSON.parse(tc.function.arguments || "{}") as Record<
              string,
              unknown
            >
          } catch {
            parsed = {}
          }
          let payload: unknown
          try {
            payload = await executeAgentTool(tc.function.name, parsed, ctx)
          } catch (e) {
            payload = {
              error: e instanceof Error ? e.message : "tool execution failed",
            }
          }
          const content =
            typeof payload === "string" ? payload : JSON.stringify(payload)
          apiMessages.push({
            role: "tool",
            tool_call_id: tc.id,
            content,
          })
        }
      }

      throw new Error("Too many tool rounds — try a simpler request.")
    },
    [apiKey, baseUrl, ctx, model]
  )

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || busy) return
    setInput("")
    setError(null)
    const historyAfterUser: ChatTurn[] = [
      ...turns,
      { role: "user", content: text },
    ]
    setTurns(historyAfterUser)
    setBusy(true)
    try {
      const reply = await runAgent(historyAfterUser)
      setTurns((prev) => [...prev, { role: "assistant", content: reply }])
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong."
      setError(msg)
      setTurns((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Could not complete that: ${msg}`,
        },
      ])
    } finally {
      setBusy(false)
    }
  }, [busy, input, runAgent, turns])

  if (!open) {
    return null
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        aria-label="Close assistant"
        onClick={() => onOpenChange(false)}
      />
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-border/60 bg-background shadow-2xl"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Chat assistant"
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageSquare
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden
            />
            <h2 className="text-base font-semibold">Assistant</h2>
          </div>
          <div className="flex items-center gap-1">
            {turns.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Clear chat history"
                title="Clear chat history"
                onClick={() => {
                  setTurns([])
                  setError(null)
                }}
                disabled={busy}
              >
                <Trash2 className="size-4" strokeWidth={2} />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-5" strokeWidth={2} />
            </Button>
          </div>
        </div>

        <div
          ref={listRef}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3"
        >
          {turns.length === 0 && !busy ? (
            <p className="text-sm text-muted-foreground">
              Ask to manage tasks, bookmarks, quick links, theme, or use browser
              tools (clipboard, speak, open URLs, …). Set chat API URL, token,
              and model under Settings → Assistant first.
            </p>
          ) : null}
          {turns.map((t, i) => (
            <div
              key={`${i}-${t.role}`}
              className={cn(
                "rounded-2xl px-3 py-2 text-sm leading-relaxed",
                t.role === "user"
                  ? "ml-6 bg-primary text-primary-foreground"
                  : "mr-4 bg-muted/80 text-foreground"
              )}
            >
              <p className="whitespace-pre-wrap">{t.content}</p>
            </div>
          ))}
          {busy ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Thinking…
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="shrink-0 border-t border-border/40 px-4 py-2 text-xs text-destructive">
            {error}
          </p>
        ) : null}

        <form
          className="shrink-0 border-t border-border/60 p-3"
          onSubmit={(e) => {
            e.preventDefault()
            void send()
          }}
        >
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  void send()
                }
              }}
              placeholder="Message…"
              rows={2}
              disabled={busy}
              className="min-h-11 flex-1 resize-none rounded-2xl border border-border/80 bg-card px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-60"
              aria-label="Message"
            />
            <Button
              type="submit"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-2xl"
              disabled={busy || !input.trim()}
              aria-label="Send"
            >
              <Send className="size-5" strokeWidth={2} />
            </Button>
          </div>
          {turns.length >= 30 ? (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Long conversation — consider clearing for better responses
            </p>
          ) : null}
        </form>
      </aside>
    </>
  )
}
