"use client"

import {
  ExternalLink,
  TypeIcon,
  PaletteIcon,
  FileTextIcon,
} from "lucide-react"
import { BookmarkIcon } from "@/components/animated-icons/bookmark-icon"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

import { BookmarkNode } from "@/components/dashboard/bookmarks/BookmarkNode"

import { useBrowserBookmarks } from "@/hooks/use-browser-bookmarks"

export function BookmarksSection() {
  const { bookmarks, loading } = useBrowserBookmarks()

  // Helper to pick icons based on title or random
  const getIconForBookmark = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes("design")) return BookmarkIcon
    if (t.includes("typography")) return TypeIcon
    if (t.includes("color")) return PaletteIcon
    return FileTextIcon
  }

  return (
    <>
    <article className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className={dashboardSectionLabelClassName}>Bookmarks</h2>
      </div>
      
      <ul className="flex flex-col gap-2">
        {bookmarks.map((item) => {
          const Icon = getIconForBookmark(item.title)
          return (
            <li key={item.id}>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  <div className="flex size-7 shrink-0 items-center justify-center text-muted-foreground/60 transition-colors group-hover:text-foreground">
                    <Icon className="size-4" strokeWidth={2} />
                  </div>
                  <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  <ExternalLink
                    className="size-3.5 shrink-0 opacity-0 -translate-x-2 transition-all group-hover:opacity-40 group-hover:translate-x-0"
                    strokeWidth={2}
                  />
                </a>
              ) : (
                <div
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground/80",
                    "cursor-default"
                  )}
                >
                  <div className="flex size-7 shrink-0 items-center justify-center text-muted-foreground/60">
                    <Icon className="size-4" strokeWidth={2} />
                  </div>
                  <span className="min-w-0 flex-1 truncate">{item.title}</span>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </article>
    <article className="flex h-[40rem] min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-card p-5 shadow-md ring-1 ring-border/40 lg:min-w-[22rem] lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className={dashboardSectionLabelClassName}>Browser Bookmarks</h2>

        {!loading ? (
          <span className="text-xs text-muted-foreground">
            {bookmarks.length} folders
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Loading bookmarks...
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full overflow-hidden">
            <div className="space-y-1 pr-2 pb-4">
              {bookmarks.map((bookmark) => (
                <BookmarkNode key={bookmark.id} node={bookmark} />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </article>
    </>
  )
}
