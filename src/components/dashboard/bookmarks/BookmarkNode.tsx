"use client"

import { Accordion } from "@/components/ui/accordion"

import { BookmarkFolder } from "./BookmarkFolder"
import { BookmarkLink } from "./BookmarkLink"

import type { BrowserBookmark } from "@/types/browser-bookmarks"

const MAX_DEPTH = 2

export function BookmarkNode({
  node,
  depth = 0,
}: {
  node: BrowserBookmark
  depth?: number
}) {
  const children =
    node.children?.filter((child) => child.title || child.url) || []

  if (children.length > 0 && depth < MAX_DEPTH) {
    return (
      <Accordion
        type="single"
        collapsible
        className="w-full max-w-full min-w-0 overflow-hidden"
      >
        <BookmarkFolder node={node}>
          <div className="w-full min-w-0 max-w-full space-y-1 overflow-hidden">
            {children.map((child) => (
              <BookmarkNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        </BookmarkFolder>
      </Accordion>
    )
  }

  if (!node.url) {
    return null
  }

  let safeUrl: string | null = null

  try {
    const parsed = new URL(node.url)

    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      safeUrl = parsed.toString()
    }
  } catch {
    safeUrl = null
  }

  if (!safeUrl) {
    return null
  }

  return (
    <BookmarkLink
      node={{
        ...node,
        url: safeUrl,
      }}
    />
  )
}
