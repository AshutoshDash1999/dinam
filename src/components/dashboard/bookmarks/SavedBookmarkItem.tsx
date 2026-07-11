import { ExternalLink, Trash2 } from "lucide-react"

import { sanitizeUrl } from "@/lib/sanitizeUrl"
import { cn } from "@/lib/utils"

import type { BookmarkItem } from "@/context/dashboard-state"

export function SavedBookmarkItem({
  bookmark,
  onDelete,
}: {
  bookmark: BookmarkItem
  onDelete: (id: string) => void
}) {
  const safeHref = sanitizeUrl(bookmark.href)

  let domain = ""
  try {
    domain = new URL(bookmark.href).hostname
  } catch {
    domain = ""
  }

  const favicon = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    : null

  return (
    <li className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-foreground/5">
      {/* favicon */}
      <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded bg-muted/50">
        {favicon ? (
          <img
            src={favicon}
            alt=""
            className="size-3.5 object-contain"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = "none"
            }}
          />
        ) : null}
      </span>

      {/* link */}
      <a
        href={safeHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "min-w-0 flex-1 truncate text-xs font-medium text-foreground/80 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "hover:text-foreground"
        )}
      >
        <span className="flex items-center gap-1.5">
          <span className="truncate">{bookmark.title || bookmark.href}</span>
          <ExternalLink className="size-2.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-50" />
        </span>
      </a>

      {/* delete */}
      <button
        type="button"
        aria-label={`Delete bookmark "${bookmark.title}"`}
        onClick={() => onDelete(bookmark.id)}
        className={cn(
          "shrink-0 rounded p-1 text-foreground/30 opacity-0 transition-all group-hover:opacity-100",
          "hover:bg-destructive/10 hover:text-destructive",
          "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <Trash2 className="size-3" />
      </button>
    </li>
  )
}
