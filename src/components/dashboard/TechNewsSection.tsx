import { MOCK_NEWS } from "@/data/dashboard-mock"
import { cn } from "@/lib/utils"

export function TechNewsSection() {
    const newsItems = MOCK_NEWS.slice(0, 2)

    return (
        <article className="rounded-3xl bg-card p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-card-foreground">
                    Tech News
                </h2>
                <button
                    type="button"
                    className="text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                >
                    Refresh feed
                </button>
            </div>
            <ul className="flex flex-col gap-5">
                {newsItems.map((item) => (
                    <li key={item.id}>
                        <a
                            href="#"
                            className="flex gap-4 rounded-xl outline-none transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring/30"
                            onClick={(e) => e.preventDefault()}
                        >
                            <div
                                className={cn(
                                    "size-18 shrink-0 rounded-xl",
                                    item.thumbClass,
                                )}
                                aria-hidden
                            />
                            <div className="min-w-0 flex-1 py-0.5">
                                <p className="text-xs font-semibold tracking-wider text-chart-1 uppercase">
                                    {item.source}
                                    <span className="text-border"> {" · "} </span>
                                    <span className="font-medium text-muted-foreground normal-case">
                                        {item.timeAgo}
                                    </span>
                                </p>
                                <p className="mt-1.5 text-base leading-snug font-bold text-card-foreground">
                                    {item.headline}
                                </p>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </article>
    )
}
