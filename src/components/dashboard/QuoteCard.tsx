import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { useStoicQuote } from "@/lib/stoic-quote"

function wikipediaAuthorSearchUrl(author: string): string {
    return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(author)}`
}

export function QuoteCard() {
    const { text, author } = useStoicQuote()

    return (
        <article className="rounded-[1.75rem] bg-card p-7 shadow-md ring-1 ring-border/40 sm:p-8">
            <h2 className={`${dashboardSectionLabelClassName} mb-3`}>Quote of the day</h2>
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
