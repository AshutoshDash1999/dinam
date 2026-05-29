import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { useStoicQuote } from "@/lib/stoic-quote"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

function wikipediaAuthorSearchUrl(author: string): string {
  return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(author)}`
}

export function QuoteCard() {
  const { text, author } = useStoicQuote()

  return (
    <article className="glass-card p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className={dashboardSectionLabelClassName}>Quote of the Day</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground/50 hover:text-foreground"
        >
          <MoreHorizontal size={14} />
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
        <blockquote>
          <p className="text-2xl md:text-3xl leading-[1.3] font-serif tracking-tight text-foreground/90">
            &ldquo;{text}&rdquo;
          </p>
          <footer className="mt-6 text-[0.65rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
            —{" "}
            <a
              href={wikipediaAuthorSearchUrl(author)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {author}
            </a>
          </footer>
        </blockquote>
      </div>
    </article>
  )
}
