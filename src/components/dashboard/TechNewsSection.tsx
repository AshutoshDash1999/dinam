import { Globe, RefreshCw } from "lucide-react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { useTechNews } from "@/hooks/use-tech-news"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TechNewsSection() {
  const { news, status, refetch } = useTechNews()

  return (
    <article className="flex h-full flex-col rounded-[1.75rem] bg-card p-6 shadow-md ring-1 ring-border/40 lg:p-7">
      <div className="flex items-center justify-between">
        <h2 className={dashboardSectionLabelClassName}>Market intelligence</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => refetch(true)}
              disabled={status === "loading"}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50"
              aria-label="Refresh news"
            >
              <RefreshCw
                className={cn(
                  "size-3.5 opacity-70 transition-transform duration-500",
                  status === "loading" && "animate-spin"
                )}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={4}>
            Refresh news
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="mt-6 flex-1">
        {status === "loading" && news.length === 0 ? (
          <ul className="flex flex-col gap-6">
            {[1, 2, 3, 4].map((i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-4 py-1"
              >
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="h-2 w-16 animate-pulse rounded-full bg-muted-foreground/20" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-full animate-pulse rounded-full bg-muted-foreground/20" />
                    <div className="h-3.5 w-4/5 animate-pulse rounded-full bg-muted-foreground/20" />
                  </div>
                </div>
                <div className="size-14 shrink-0 animate-pulse rounded-full bg-muted-foreground/10 ring-1 ring-border/40" />
              </li>
            ))}
          </ul>
        ) : status === "error" && news.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              Unable to load latest news.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : news.length === 0 && status === "success" ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            No recent news available.
          </div>
        ) : (
          <ul className="flex flex-col gap-6">
            {news.map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group/news flex items-center justify-between gap-4 rounded-xl py-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="line-clamp-1 text-[0.6875rem] font-semibold tracking-[0.12em] text-primary uppercase">
                        {item.source}
                      </p>
                      <span className="text-[0.65rem] text-muted-foreground">
                        &bull; {item.timeAgo}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-snug font-bold text-card-foreground group-hover/news:underline group-hover/news:decoration-primary/40 group-hover/news:underline-offset-2 sm:text-base">
                      {item.headline}
                    </p>
                  </div>
                  <div
                    className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted/40 ring-1 ring-border/40"
                    aria-hidden
                  >
                    <img
                      src={item.faviconUrl}
                      alt=""
                      className="size-7 object-contain opacity-80 mix-blend-multiply transition-transform group-hover/news:scale-110 dark:mix-blend-normal"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        const fallback = e.currentTarget.nextElementSibling
                        if (fallback instanceof HTMLElement) {
                          fallback.style.display = "block"
                        }
                      }}
                    />
                    <Globe
                      className="hidden size-6 text-muted-foreground/50"
                      strokeWidth={1.5}
                    />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
