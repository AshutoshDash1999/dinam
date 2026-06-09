"use client"

import { useState } from "react"

import { BookmarkIcon } from "@/components/animated-icons/bookmark-icon"
import { ExternalLink, FileTextIcon, PaletteIcon, TypeIcon } from "lucide-react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { sanitizeUrl } from "@/lib/sanitizeUrl"
import { cn } from "@/lib/utils"

import { BookmarkNode } from "@/components/dashboard/bookmarks/BookmarkNode"
import { useBrowserBookmarks } from "@/hooks/use-browser-bookmarks"

import type { BrowserBookmark } from "@/types/browser-bookmarks"

export function BookmarksSection() {
  const { bookmarks, loadingBookmarks } = useBrowserBookmarks()

  const [searchTerm, setSearchTerm] = useState("")

  const getIconForBookmark = (title: string) => {
    const t = title.toLowerCase()

    if (t.includes("design")) return PaletteIcon
    if (t.includes("type") || t.includes("font")) return TypeIcon
    if (t.includes("doc") || t.includes("read")) return FileTextIcon

    return BookmarkIcon
  }

  const filterBookmarks = (
    nodes: BrowserBookmark[],
    query: string
  ): BrowserBookmark[] => {
    if (!query.trim()) return nodes

    return nodes.reduce<BrowserBookmark[]>((acc, node) => {
      const matches = node.title
        .toLowerCase()
        .includes(query.toLowerCase())

      const filteredChildren = node.children
        ? filterBookmarks(node.children, query)
        : []

      if (matches || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren,
        })
      }

      return acc
    }, [])
  }

  const filteredBookmarks = filterBookmarks(bookmarks, searchTerm)

  return (
    <article className="glass-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className={dashboardSectionLabelClassName}>Bookmarks</h2>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
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
      ) : filteredBookmarks.length === 0 ? (
        <div className="px-2 py-1.5 text-xs text-foreground/40">
          No bookmarks found
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {filteredBookmarks.map((item) => {
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