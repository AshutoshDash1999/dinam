"use client"

import { StickyNote, Copy, Check } from "lucide-react"
import { useRef, useCallback, useState, useEffect } from "react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { useDashboardState } from "@/context/dashboard-state"

export function ScratchpadSection() {
  const { scratchpad, setScratchpad } = useDashboardState()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [copied, setCopied] = useState(false)

  // Clear copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(t)
    }
  }, [copied])

  const handleCopy = useCallback(() => {
    if (!scratchpad) return
    navigator.clipboard.writeText(scratchpad)
    setCopied(true)
  }, [scratchpad])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        const target = e.target as HTMLTextAreaElement
        const cursorPosition = target.selectionStart
        const textBeforeCursor = target.value.slice(0, cursorPosition)
        const lastLine = textBeforeCursor.split("\n").pop() || ""

        // Match list patterns: "- ", "* ", or "1." (with or without trailing space)
        const match = lastLine.match(/^(\s*)([-*]|\d+\.)\s*(.*)/)

        if (match) {
          e.preventDefault()
          const prefixSpaces = match[1]
          const listMarker = match[2]
          const content = match[3]

          // If the list item is completely empty (just the marker), exit the list
          if (lastLine.trim() === listMarker) {
            const newText =
              target.value.slice(0, cursorPosition - lastLine.length) +
              target.value.slice(cursorPosition)
            setScratchpad(newText)

            // Set cursor to the new line
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.selectionStart =
                  cursorPosition - lastLine.length
                textareaRef.current.selectionEnd =
                  cursorPosition - lastLine.length
              }
            }, 0)
            return
          }

          let nextMarker = listMarker
          // If it's a numbered list, increment the number
          if (/^\d+\./.test(listMarker)) {
            const num = parseInt(listMarker, 10)
            nextMarker = `${num + 1}.`
          }

          const insertion = `\n${prefixSpaces}${nextMarker} `
          const newText =
            target.value.slice(0, cursorPosition) +
            insertion +
            target.value.slice(cursorPosition)

          setScratchpad(newText)

          setTimeout(() => {
            if (textareaRef.current) {
              const newPos = cursorPosition + insertion.length
              textareaRef.current.selectionStart = newPos
              textareaRef.current.selectionEnd = newPos
            }
          }, 0)
        }
      }
    },
    [setScratchpad]
  )

  return (
    <article className="glass-card flex h-full min-h-0 flex-col p-6">
      <div className="mb-4 flex items-center gap-3">
        <h2 className={dashboardSectionLabelClassName}>Scratchpad</h2>
      </div>

      <div className="group relative flex min-h-0 flex-1 flex-col">
        <textarea
          ref={textareaRef}
          data-testid="scratchpad-textarea"
          value={scratchpad}
          onChange={(e) => setScratchpad(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Jot down a quick thought..."
          className="min-h-[150px] flex-1 resize-none border-0 bg-transparent px-3 py-1 text-sm leading-relaxed text-foreground/90 shadow-none [-ms-overflow-style:none] [scrollbar-width:none] placeholder:text-muted-foreground/40 focus:outline-none focus-visible:ring-0 [&::-webkit-scrollbar]:hidden"
          spellCheck={false}
        />
        {/* Subtle decorative elements for the "notepad" feel */}
        <div className="pointer-events-none absolute top-1 bottom-1 left-0 w-[2px] rounded-full bg-border/40" />
      </div>

      {/* Footer / Status indicator */}
      <div className="mt-4 flex shrink-0 items-center justify-between border-t border-border/40 pt-3">
        <div className="flex items-center gap-2 text-muted-foreground/40 transition-opacity">
          <StickyNote className="size-3.5" strokeWidth={2.5} />
          <span className="text-[0.6rem] font-bold tracking-widest uppercase">
            {scratchpad.length > 0 ? `${scratchpad.length} chars` : "Ready"}
          </span>
        </div>
        {scratchpad.length > 0 && (
          <button
            onClick={handleCopy}
            className="group flex items-center gap-1.5 text-muted-foreground/40 transition-colors hover:text-foreground/80"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <>
                <span className="text-[0.6rem] font-bold tracking-widest text-emerald-500 uppercase">
                  Copied
                </span>
                <Check
                  className="size-3.5 text-emerald-500"
                  strokeWidth={2.5}
                />
              </>
            ) : (
              <>
                <span className="text-[0.6rem] font-bold tracking-widest uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  Copy
                </span>
                <Copy className="size-3.5" strokeWidth={2.5} />
              </>
            )}
          </button>
        )}
      </div>
    </article>
  )
}
