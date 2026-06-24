"use client"

import { useMemo, useState } from "react"
import { BookmarkIcon } from "@/components/animated-icons/bookmark-icon"
import {
  ExternalLink,
  FileTextIcon,
  PaletteIcon,
  Search,
  TypeIcon,
} from "lucide-react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { BookmarkNode } from "@/components/dashboard/bookmarks/BookmarkNode"
import { Input } from "@/components/ui/input"
import { sanitizeUrl } from "@/lib/sanitizeUrl"
import { cn } from "@/lib/utils"
import { useBrowserBookmarks } from "@/hooks/use-browser-bookmarks"

import type { BrowserBookmark } from "@/types/browser-bookmarks"

export function BookmarksSection() {
  const { bookmarks, loadingBookmarks, bookmarksError } = useBrowserBookmarks()
  const [searchQuery, setSearchQuery] = useState("")

  const getIconForBookmark = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes("design")) return PaletteIcon
    if (t.includes("type") || t.includes("font")) return TypeIcon
    if (t.includes("doc") || t.includes("read")) return FileTextIcon
    return BookmarkIcon
  }

  const trimmedQuery = searchQuery.trim().toLowerCase()

  const filteredBookmarks = useMemo(() => {
    if (!trimmedQuery) return []

    const flattenBookmarks = (nodes: BrowserBookmark[]): BrowserBookmark[] => {
      const result: BrowserBookmark[] = []

      const traverse = (items: BrowserBookmark[]) => {
        for (const item of items) {
          if (item.url) {
            result.push(item)
          }

          if (item.children?.length) {
            traverse(item.children)
          }
        }
      }

      traverse(nodes)
      return result
    }

    const allBookmarks = flattenBookmarks(bookmarks)

    return allBookmarks.filter((bookmark) => {
      const title = bookmark.title?.toLowerCase() ?? ""
      const url = bookmark.url?.toLowerCase() ?? ""

      return title.includes(trimmedQuery) || url.includes(trimmedQuery)
    })
  }, [bookmarks, trimmedQuery])

  return (
    <article className="glass-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className={dashboardSectionLabelClassName}>Bookmarks</h2>
      </div>

      <div className="relative mb-4">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-foreground/40" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search bookmarks..."
          className="pl-9"
        />
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
      ) : bookmarksError ? (
        <div className="px-2 py-1.5 text-xs text-foreground/50">
          Unable to load browser bookmarks. Please check extension permissions and
          try again.
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="px-2 py-1.5 text-xs text-foreground/40">No bookmarks</div>
      ) : trimmedQuery ? (
        filteredBookmarks.length === 0 ? (
          <div className="px-2 py-1.5 text-xs text-foreground/40">
            No bookmarks found for "{searchQuery}"
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredBookmarks.map((item) => {
              const Icon = getIconForBookmark(item.title || "")
              return (
                <li key={item.id}>
                  <a
                    href={sanitizeUrl(item.url!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{item.title || item.url}</span>
                    <ExternalLink className="ml-auto size-3 shrink-0 opacity-0 group-hover:opacity-50" />
                  </a>
                </li>
              )
            })}
          </ul>
        )
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
                      "group flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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