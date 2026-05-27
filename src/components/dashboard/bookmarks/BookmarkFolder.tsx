"use client"

import { Folder } from "lucide-react"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { BrowserBookmark } from "@/types/browser-bookmarks"

export function BookmarkFolder({
  node,
  children,
}: {
  node: BrowserBookmark
  children: React.ReactNode
}) {
  return (
    <AccordionItem
      value={node.id}
      className="w-full max-w-full min-w-0 overflow-hidden border-none"
    >
      <AccordionTrigger className="w-full max-w-full min-w-0 overflow-hidden rounded-lg px-2 py-2 hover:bg-muted/50 hover:no-underline">
        <div className="flex w-full max-w-full min-w-0 items-center gap-2 overflow-hidden">
          <Folder className="size-4 shrink-0 text-primary" />

          <span className="block min-w-0 flex-1 truncate text-left text-sm font-medium">
            {node.title || "Bookmarks"}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="w-full overflow-hidden data-[state=closed]:hidden">
        <div className="h-64 w-full overflow-hidden pl-3">
          <ScrollArea className="h-full w-full" type="always">
            <div className="space-y-1 pr-2">{children}</div>
          </ScrollArea>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
