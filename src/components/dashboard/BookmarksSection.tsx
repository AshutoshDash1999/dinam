import { Bookmark, ExternalLink } from "lucide-react"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { MOCK_BOOKMARKS } from "@/data/dashboard-mock"
import { cn } from "@/lib/utils"

export function BookmarksSection() {
    return (
        <article className="rounded-2xl bg-card p-6 shadow-md ring-1 ring-border/40 lg:p-7">
            <h2 className={dashboardSectionLabelClassName}>Bookmarks</h2>
            <ul className="mt-5 flex flex-col gap-1">
                {MOCK_BOOKMARKS.map((item) => (
                    <li key={item.id}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className={cn(
                                        "group flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-medium text-card-foreground outline-none transition-colors",
                                        "hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring/40",
                                    )}
                                >
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                                        <Bookmark
                                            className="size-4"
                                            strokeWidth={2}
                                            aria-hidden
                                        />
                                    </span>
                                    <span className="min-w-0 flex-1 truncate">
                                        {item.title}
                                    </span>
                                    <ExternalLink
                                        className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                        strokeWidth={2}
                                        aria-hidden
                                    />
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={6}>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-medium">
                                        {item.title}
                                    </span>
                                    <span className="max-w-[16rem] truncate text-[0.65rem] opacity-80">
                                        {item.href}
                                    </span>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </li>
                ))}
            </ul>
        </article>
    )
}
