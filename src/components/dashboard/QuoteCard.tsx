import { useState } from "react"
import { Copy, Check, RefreshCw } from "lucide-react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { useStoicQuote } from "@/lib/stoic-quote"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function wikipediaAuthorSearchUrl(author: string): string {
  return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(author)}`
}

export function QuoteCard() {
  const { text, author, refresh, loading } = useStoicQuote()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`“${text}” — ${author}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <article className="group/card relative rounded-[1.75rem] bg-card p-7 shadow-md ring-1 ring-border/40 sm:p-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className={dashboardSectionLabelClassName}>
          Quote of the day
        </h2>
        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-300 focus-within:opacity-100 group-hover/card:opacity-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                aria-label="Copy quote"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-500 transition-transform duration-300 scale-110" />
                ) : (
                  <Copy className="size-3.5 opacity-70" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4}>
              {copied ? "Copied!" : "Copy quote"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50"
                aria-label="Refresh quote"
              >
                <RefreshCw
                  className={cn(
                    "size-3.5 opacity-70 transition-transform duration-500",
                    loading && "animate-spin"
                  )}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4}>
              New quote
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <blockquote>
        <p className="text-xl leading-relaxed font-bold tracking-tight text-card-foreground sm:text-2xl">
          &ldquo;{text}&rdquo;
        </p>
        <footer className="mt-5 text-[0.6875rem] font-semibold tracking-[0.12em] text-primary uppercase">
          —{" "}
          <a
            href={wikipediaAuthorSearchUrl(author)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {author}
          </a>
        </footer>
      </blockquote>
    </article>
  )
}
