"use client"

import { useState } from "react"
import { ExternalLink, Plus, Trash } from "lucide-react"

import { BookmarkIcon } from "@/components/animated-icons/bookmark-icon"
import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useDashboardState } from "@/context/dashboard-state"
import { cn } from "@/lib/utils"

export function BookmarksSection() {
  const { bookmarks, addBookmark, deleteBookmark } = useDashboardState()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newHref, setNewHref] = useState("")

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const t = newTitle.trim()
    let h = newHref.trim()
    if (!t || !h) return
    
    // Automatically prepend protocol if not present
    if (!/^https?:\/\//i.test(h)) {
      h = `https://${h}`
    }
    
    addBookmark(t, h)
    setNewTitle("")
    setNewHref("")
    setShowAddForm(false)
  }

  return (
    <article className="rounded-2xl bg-card p-6 shadow-md ring-1 ring-border/40 lg:p-7">
      <div className="flex items-center justify-between">
        <h2 className={dashboardSectionLabelClassName}>Bookmarks</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className={cn(
                "rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 transition-transform",
                showAddForm && "rotate-45 text-destructive hover:text-destructive hover:bg-destructive/10"
              )}
              aria-label={showAddForm ? "Close form" : "Add bookmark"}
            >
              <Plus className="size-4" strokeWidth={2.5} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={4}>
            {showAddForm ? "Cancel" : "Add bookmark"}
          </TooltipContent>
        </Tooltip>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="mt-4 space-y-3 rounded-xl border border-border/40 bg-muted/30 p-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div>
            <label htmlFor="bookmark-title" className="sr-only">
              Bookmark Title
            </label>
            <input
              id="bookmark-title"
              type="text"
              required
              placeholder="Name..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-lg border border-border/80 bg-card px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="bookmark-href" className="sr-only">
              Bookmark URL
            </label>
            <input
              id="bookmark-href"
              type="text"
              required
              placeholder="URL (e.g. google.com)"
              value={newHref}
              onChange={(e) => setNewHref(e.target.value)}
              className="w-full rounded-lg border border-border/80 bg-card px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg bg-transparent px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/95"
            >
              Save
            </button>
          </div>
        </form>
      )}

      <ul className="mt-5 flex flex-col gap-1">
        {bookmarks.map((item) => (
          <li key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-2 py-1.5 text-sm font-medium text-card-foreground transition-colors outline-none",
                    "hover:bg-muted/80"
                  )}
                >
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex flex-1 items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-lg p-1"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                      <BookmarkIcon
                        size={16}
                        className="text-muted-foreground transition-colors group-hover:text-primary"
                      />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                    <ExternalLink
                      className="size-3.5 shrink-0 -translate-x-2 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </a>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          deleteBookmark(item.id)
                        }}
                        className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                        aria-label="Delete bookmark"
                      >
                        <Trash className="size-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" sideOffset={4}>
                      Delete link
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={6}>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{item.title}</span>
                  <span className="max-w-[16rem] truncate text-[0.65rem] opacity-80 font-mono">
                    {item.href}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          </li>
        ))}
      </ul>
    </article>
  )
}
