"use client"

import { ScrollArea } from "@/components/ui/scroll-area"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"

import { BookmarkNode } from "@/components/dashboard/bookmarks/BookmarkNode"

import { useBrowserBookmarks } from "@/hooks/use-browser-bookmarks"

export function BookmarksSection() {
  const { bookmarks, loading } = useBrowserBookmarks()

  return (
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
  )
}
