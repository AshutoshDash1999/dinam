"use client"

import { StickyNote } from "lucide-react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { useDashboardState } from "@/context/dashboard-state"

export function ScratchpadSection() {
  const { scratchpad, setScratchpad } = useDashboardState()

  return (
    <article className="glass-card flex h-full min-h-0 flex-col p-6">
      <div className="mb-4 flex items-center gap-3">
        <h2 className={dashboardSectionLabelClassName}>Scratchpad</h2>
      </div>

      <div className="group relative flex min-h-0 flex-1 flex-col">
        <textarea
          data-testid="scratchpad-textarea"
          value={scratchpad}
          onChange={(e) => setScratchpad(e.target.value)}
          placeholder="Jot down a quick thought..."
          className="min-h-[150px] flex-1 resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-foreground/90 shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
          spellCheck={false}
        />
        {/* Subtle decorative elements for the "notepad" feel */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 -ml-2 w-[1px] bg-border/20" />
      </div>

      {/* Footer / Status indicator */}
      <div className="mt-4 flex shrink-0 items-center justify-between border-t border-border/40 pt-3">
        <div className="flex items-center gap-2 text-muted-foreground/40 transition-opacity">
          <StickyNote className="size-3.5" strokeWidth={2.5} />
          <span className="text-[0.6rem] font-bold tracking-widest uppercase">
            {scratchpad.length > 0 ? `${scratchpad.length} chars` : "Empty"}
          </span>
        </div>
      </div>
    </article>
  )
}
