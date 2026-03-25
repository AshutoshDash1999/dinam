import { Quote } from "lucide-react"

import { MOCK_QUOTE } from "@/data/dashboard-mock"

export function QuoteCard() {
    return (
        <article className="relative overflow-hidden rounded-3xl bg-primary px-8 py-10 text-primary-foreground shadow-lg lg:col-span-3">
            <Quote
                className="absolute -top-2 -left-1 size-32 text-primary-foreground/15 sm:size-40"
                strokeWidth={1}
                aria-hidden
            />
            <blockquote className="relative z-1">
                <p className="max-w-xl text-2xl leading-snug font-bold tracking-tight sm:text-3xl sm:leading-tight">
                    &ldquo;{MOCK_QUOTE.text}&rdquo;
                </p>
                <footer className="mt-6 text-base text-primary-foreground/80">
                    — {MOCK_QUOTE.author}
                </footer>
            </blockquote>
        </article>
    )
}
