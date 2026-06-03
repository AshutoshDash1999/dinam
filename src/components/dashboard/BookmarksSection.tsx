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
import { sanitizeUrl } from "@/lib/sanitizeUrl"

import { BookmarkNode } from "@/components/dashboard/bookmarks/BookmarkNode"

export function BookmarksSection() {
  const { bookmarks, loading } = useBrowserBookmarks()

  // Helper to pick icons based on title or random
  const getIconForBookmark = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes("design")) return PaletteIcon
    if (t.includes("type") || t.includes("font")) return TypeIcon
    if (t.includes("doc") || t.includes("read")) return FileTextIcon
    return BookmarkIcon
  }

  return (
    <div>
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
                  href={sanitizeUrl(item.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{item.title}</span>
                  <ExternalLink className="ml-auto size-3 shrink-0 opacity-0 group-hover:opacity-50" />
                </a>
              ) : (
                <BookmarkNode item={item} />
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
