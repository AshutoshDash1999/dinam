"use client"

import { ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

import { BookmarkIcon } from "@/components/animated-icons/bookmark-icon"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"

import type { BrowserBookmark } from "@/types/browser-bookmarks"

export function BookmarkLink({ node }: { node: BrowserBookmark }) {
  const [faviconError, setFaviconError] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFaviconError(false)
  }, [node.url])

  let domain = ""

  try {
    domain = node.url ? new URL(node.url).hostname : ""
  } catch {
    domain = ""
  }

  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

  return (
    <a
      href={node.url}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "group flex w-full max-w-full min-w-0 items-center gap-3 overflow-hidden rounded-xl px-2 py-2 text-sm transition-all"
      )}
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/50">
        {!faviconError ? (
          <img
            src={favicon}
            alt=""
            className="size-4 object-contain"
            onError={() => setFaviconError(true)}
          />
        ) : null}

        <BookmarkIcon
          size={14}
          className="absolute opacity-0 transition-opacity group-hover:opacity-100"
        />
      </span>

    <span className="block min-w-0 flex-1 overflow-hidden truncate whitespace-nowrap text-sm font-medium">
        {node.title || node.url}
      </span>

      <Tooltip>
        <TooltipTrigger asChild>
          <ExternalLink
            className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            strokeWidth={2}
          />
        </TooltipTrigger>

        <TooltipContent side="right">
          <div className="max-w-xs">
            <p className="truncate font-medium">{node.title}</p>

            <p className="truncate text-xs opacity-70">{node.url}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </a>
  )
}
