import { MOCK_NEWS } from "@/data/dashboard-mock"
import { cn } from "@/lib/utils"

export function TechNewsSection() {
    return (
        <article className="rounded-[1.75rem] bg-card p-6 shadow-md ring-1 ring-border/40 lg:p-7">
            <h2 className="text-[0.6875rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Market intelligence
            </h2>
            <ul className="mt-6 flex flex-col gap-6">
                {MOCK_NEWS.map((item) => (
                    <li key={item.id}>
                        <a
                            href="#"
                            className="flex items-center justify-between gap-4 rounded-xl py-1 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/30"
                            onClick={(e) => e.preventDefault()}
                        >
                            <div className="min-w-0 flex-1">
                                <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-primary uppercase">
                                    {item.source}
                                </p>
                                <p className="mt-2 text-sm leading-snug font-bold text-card-foreground sm:text-base">
                                    {item.headline}
                                </p>
                            </div>
                            <div
                                className={cn(
                                    "size-14 shrink-0 rounded-full ring-1 ring-border/40",
                                    item.thumbClass,
                                )}
                                aria-hidden
                            />
                        </a>
                    </li>
                ))}
            </ul>
        </article>
    )
}
