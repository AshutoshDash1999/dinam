import dayjs from "dayjs"
import { Search, Sun } from "lucide-react"
import { useEffect, useState } from "react"

import { MOCK_WEATHER } from "@/data/dashboard-mock"

export function DashboardHeader() {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), 60_000)
        return () => window.clearInterval(id)
    }, [])

    const timeLabel = dayjs(now).format("h:mm A")
    const dateLabel = dayjs(now).format("dddd, MMMM D, YYYY")

    return (
        <header className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] md:items-center md:gap-6 lg:gap-8">
            <div className="min-w-0">
                <p className="text-4xl font-bold tracking-tight sm:text-5xl">
                    {timeLabel}
                </p>
                <p className="mt-1 text-base text-muted-foreground">{dateLabel}</p>
            </div>
            <div className="flex w-full justify-center md:px-2">
                <label className="relative w-full max-w-xl">
                    <span className="sr-only">Search</span>
                    <Search
                        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
                        strokeWidth={2}
                        aria-hidden
                    />
                    <input
                        type="search"
                        placeholder="Search your sanctuary..."
                        className="w-full rounded-full border border-border/80 bg-card/95 py-3.5 pr-4 pl-12 text-foreground shadow-sm outline-none backdrop-blur-sm placeholder:text-muted-foreground focus-visible:border-input focus-visible:ring-2 focus-visible:ring-ring/25"
                    />
                </label>
            </div>
            <div className="flex justify-start md:justify-end">
                <div
                    className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/90 px-4 py-3 shadow-sm backdrop-blur-md"
                    role="status"
                    aria-label={`Weather in ${MOCK_WEATHER.city}`}
                >
                    <Sun
                        className="size-9 shrink-0 text-chart-1"
                        strokeWidth={2}
                        aria-hidden
                    />
                    <div className="min-w-0 text-left">
                        <p className="text-sm font-semibold text-card-foreground">
                            {MOCK_WEATHER.city}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {MOCK_WEATHER.summary}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    )
}
