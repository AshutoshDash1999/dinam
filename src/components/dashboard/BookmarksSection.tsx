import { useCallback, useMemo, useState } from "react"

import { BookmarkIcon } from "@/components/animated-icons/bookmark-icon"
import { BookmarkNode } from "@/components/dashboard/bookmarks/BookmarkNode"
import { SavedBookmarkItem } from "@/components/dashboard/bookmarks/SavedBookmarkItem"
import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDashboardState } from "@/context/dashboard-state"
import { useBrowserBookmarks } from "@/hooks/use-browser-bookmarks"
import { cn } from "@/lib/utils"
import { Folder, Plus, Search, X } from "lucide-react"

import type { BrowserBookmark } from "@/types/browser-bookmarks"

function flattenBookmarks(nodes: BrowserBookmark[]): BrowserBookmark[] {
  const result: BrowserBookmark[] = []
  const traverse = (items: BrowserBookmark[]) => {
    for (const item of items) {
      if (item.url) result.push(item)
      if (item.children?.length) traverse(item.children)
    }
  }
  traverse(nodes)
  return result
}

export function BookmarksSection() {
  // Dashboard-managed bookmarks 
  const { bookmarks: savedBookmarks, addBookmark, deleteBookmark } =
    useDashboardState()

  const [addingBookmark, setAddingBookmark] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newHref, setNewHref] = useState("")
  const [addError, setAddError] = useState("")

  const handleAddBookmark = useCallback(() => {
    const title = newTitle.trim()
    const href = newHref.trim()

    if (!href) {
      setAddError("URL is required.")
      return
    }

    // Basic URL validation
    try {
      const u = new URL(href.startsWith("http") ? href : `https://${href}`)
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        setAddError("Only http / https URLs are allowed.")
        return
      }
    } catch {
      setAddError("Enter a valid URL.")
      return
    }

    addBookmark(title || href, href.startsWith("http") ? href : `https://${href}`)
    setNewTitle("")
    setNewHref("")
    setAddError("")
    setAddingBookmark(false)
  }, [addBookmark, newTitle, newHref])

  const handleCancelAdd = useCallback(() => {
    setAddingBookmark(false)
    setNewTitle("")
    setNewHref("")
    setAddError("")
  }, [])

  // Browser bookmarks (Chrome extension API)
  const { bookmarks: browserBookmarks, loadingBookmarks, bookmarksError } =
    useBrowserBookmarks()

  const [searchQuery, setSearchQuery] = useState("")
  const trimmedQuery = searchQuery.trim().toLowerCase()

  const filteredBrowserBookmarks = useMemo(() => {
    if (!trimmedQuery) return []
    return flattenBookmarks(browserBookmarks).filter((bm) => {
      const title = bm.title?.toLowerCase() ?? ""
      const url = bm.url?.toLowerCase() ?? ""
      return title.includes(trimmedQuery) || url.includes(trimmedQuery)
    })
  }, [browserBookmarks, trimmedQuery])

  const hasBrowserBookmarks =
    !bookmarksError && !loadingBookmarks && browserBookmarks.length > 0

  const browserBookmarksUnavailable =
    !loadingBookmarks && !bookmarksError && browserBookmarks.length === 0

  return (
    <article className="glass-card p-6">
      {/* Saved Bookmarks*/}
      <section aria-labelledby="saved-bookmarks-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="saved-bookmarks-heading"
            className={dashboardSectionLabelClassName}
          >
            Bookmarks
          </h2>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Add bookmark"
            title="Add bookmark"
            className="size-7 rounded-lg text-foreground/50 hover:text-foreground"
            onClick={() => setAddingBookmark((v) => !v)}
          >
            {addingBookmark ? (
              <X className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
          </Button>
        </div>

        {/* Inline add-form */}
        {addingBookmark ? (
          <div className="mb-4 rounded-xl border border-border/50 bg-muted/30 p-3">
            <div className="flex flex-col gap-2">
              <Input
                id="new-bookmark-title"
                placeholder="Title (optional)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-8 text-xs"
              />
              <Input
                id="new-bookmark-href"
                placeholder="https://example.com"
                value={newHref}
                onChange={(e) => {
                  setNewHref(e.target.value)
                  setAddError("")
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddBookmark()
                  if (e.key === "Escape") handleCancelAdd()
                }}
                className="h-8 text-xs"
              />
              {addError ? (
                <p className="text-xs text-destructive">{addError}</p>
              ) : null}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-7 flex-1 text-xs"
                  onClick={handleAddBookmark}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleCancelAdd}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {savedBookmarks.length === 0 ? (
          <p className="px-2 py-1.5 text-xs text-foreground/40">
            No saved bookmarks yet. Press{" "}
            <span className="font-medium text-foreground/60">+</span> to add
            one.
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {savedBookmarks.map((bm) => (
              <SavedBookmarkItem
                key={bm.id}
                bookmark={bm}
                onDelete={deleteBookmark}
              />
            ))}
          </ul>
        )}
      </section>

      {/* Browser Bookmarks (Chrome extension only) */}
      {!browserBookmarksUnavailable ? (
        <section
          aria-labelledby="browser-bookmarks-heading"
          className="mt-6 border-t border-border/40 pt-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Folder className="size-4 shrink-0 text-primary" />
            <h3
              id="browser-bookmarks-heading"
              className={cn(dashboardSectionLabelClassName, "text-sm")}
            >
              Browser Bookmarks
            </h3>
          </div>

          {/* Search */}
          {hasBrowserBookmarks ? (
            <div className="relative mb-4">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-foreground/40" />
              <Input
                id="browser-bookmarks-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search browser bookmarks..."
                className="pl-9 text-xs"
                aria-label="Search browser bookmarks"
              />
            </div>
          ) : null}

          {/* States */}
          {loadingBookmarks ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex animate-pulse items-center gap-3 rounded-lg px-2 py-1.5"
                >
                  <div className="size-4 shrink-0 rounded bg-foreground/10" />
                  <div className="h-3 flex-1 rounded bg-foreground/10" />
                </div>
              ))}
            </div>
          ) : bookmarksError ? (
            <div className="px-2 py-1.5 text-xs text-foreground/50">
              Unable to load browser bookmarks. Please check extension
              permissions and try again.
            </div>
          ) : trimmedQuery ? (
            filteredBrowserBookmarks.length === 0 ? (
              <div className="px-2 py-1.5 text-xs text-foreground/40">
                No bookmarks found for &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {filteredBrowserBookmarks.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground/80 transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "hover:bg-foreground/5 hover:text-foreground"
                      )}
                    >
                      <BookmarkIcon className="size-4 shrink-0" />
                      <span className="truncate">
                        {item.title || item.url}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <ul className="flex flex-col gap-2">
              {browserBookmarks.map((item) => (
                <li key={item.id}>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground/80 transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "hover:bg-foreground/5 hover:text-foreground"
                      )}
                    >
                      <BookmarkIcon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </a>
                  ) : (
                    <BookmarkNode node={item} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </article>
  )
}