import { MOCK_QUOTE } from "@/data/dashboard-mock"

export function QuoteCard() {
    return (
        <article className="rounded-[1.75rem] bg-card p-7 shadow-md ring-1 ring-border/40 sm:p-8">
            <blockquote>
                <p className="text-lg leading-snug font-bold tracking-tight text-card-foreground sm:text-xl">
                    &ldquo;{MOCK_QUOTE.text}&rdquo;
                </p>
                <footer className="mt-5 text-[0.6875rem] font-semibold tracking-[0.12em] text-primary uppercase">
                    — {MOCK_QUOTE.author}
                </footer>
            </blockquote>
        </article>
    )
}
