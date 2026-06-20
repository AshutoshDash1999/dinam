"use client"

import { BookmarkIcon } from "@/components/animated-icons/bookmark-icon"
import { ExternalLink, FileTextIcon, PaletteIcon, TypeIcon } from "lucide-react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { sanitizeUrl } from "@/lib/sanitizeUrl"
import { cn } from "@/lib/utils"

import { BookmarkNode } from "@/components/dashboard/bookmarks/BookmarkNode"
import { useBrowserBookmarks } from "@/hooks/use-browser-bookmarks"

export function BookmarksSection() {
  const { bookmarks, loadingBookmarks } = useBrowserBookmarks()

  // Helper to pick icons based on title or random
  const getIconForBookmark = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes("design")) return PaletteIcon
    if (t.includes("type") || t.includes("font")) return TypeIcon
    if (t.includes("doc") || t.includes("read")) return FileTextIcon
    return BookmarkIcon
  }

  return (
    <article className="glass-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className={dashboardSectionLabelClassName}>Bookmarks</h2>
      </div>

      {loadingBookmarks ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse items-center gap-3 rounded-lg px-2 py-1.5"
            >
              <div className="size-4 shrink-0 rounded bg-white/10" />
              <div className="h-3 flex-1 rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="px-2 py-1.5 text-xs text-foreground/40">
          No bookmarks
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {bookmarks.map((item) => {
            const Icon = getIconForBookmark(item.title)
            return (
              <li key={item.id}>
                {item.url ? (
                  <a
                    href={sanitizeUrl(item.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground/80 transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
                      "hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{item.title}</span>
                    <ExternalLink className="ml-auto size-3 shrink-0 opacity-0 group-hover:opacity-50" />
                  </a>
                ) : (
                  <BookmarkNode node={item} />
                )}
              </li>
            )
          })}
        </ul>
      )}
    </article>
  )
}
