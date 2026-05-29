import { Globe, RefreshCw } from "lucide-react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { useTechNews } from "@/hooks/use-tech-news"

export function TechNewsSection() {
  const { news, status } = useTechNews()

  return (
    <article className="glass-card flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <h2 className={dashboardSectionLabelClassName}>Market Intelligence</h2>
        <div className="flex items-center gap-1">
          {status === "loading" && (
            <RefreshCw className="size-3 animate-spin text-muted-foreground/30 mr-1" />
          )}
        </div>
      </div>

      <div className="mt-6 flex-1">
        {status === "loading" && news.length === 0 ? (
          <ul className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-4"
              >
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="h-2 w-24 animate-pulse rounded-full bg-muted-foreground/10" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-full animate-pulse rounded-full bg-muted-foreground/10" />
                  </div>
                </div>
                <div className="size-14 shrink-0 animate-pulse rounded-xl bg-muted-foreground/5" />
              </li>
            ))}
          </ul>
        ) : status === "error" && news.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground/50">
              Unable to load latest news.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-6">
            {news.slice(0, 3).map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group/news flex items-start justify-between gap-4 py-0.5 focus-visible:ring-2 focus-visible:ring-white/10 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.6rem] font-bold tracking-widest text-muted-foreground/60 uppercase">
                        {item.source}
                      </span>
                      <span className="text-[0.6rem] text-muted-foreground/30">
                        • {item.timeAgo}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-snug font-semibold text-foreground/90 group-hover/news:text-foreground transition-colors overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                      {item.headline}
                    </p>
                  </div>
                  <div
                    className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5 border border-white/5 shadow-sm group-hover/news:border-white/10 transition-colors"
                    aria-hidden
                  >
                     <img
                      src={item.faviconUrl || `https://www.google.com/s2/favicons?domain=${item.url}&sz=128`}
                      alt=""
                      className="size-full object-cover opacity-80 group-hover/news:opacity-100 group-hover/news:scale-105 transition-all"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        const fallback = e.currentTarget.nextElementSibling
                        if (fallback instanceof HTMLElement) {
                          fallback.style.display = "flex"
                        }
                      }}
                    />
                    <div className="hidden size-full items-center justify-center bg-muted/20">
                      <Globe className="size-5 text-muted-foreground/20" strokeWidth={1} />
                    </div>
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
