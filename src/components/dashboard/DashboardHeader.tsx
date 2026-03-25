import dayjs from "dayjs"
import { Mic, Search, Settings, Sun } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { MOCK_WEATHER } from "@/data/dashboard-mock"

function timeOfDayGreeting(hour: number): string {
    if (hour >= 5 && hour < 12) return "Good morning"
    if (hour >= 12 && hour < 17) return "Good afternoon"
    if (hour >= 17 && hour < 22) return "Good evening"
    return "Good night"
}

export function DashboardHeader() {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), 1000)
        return () => window.clearInterval(id)
    }, [])

    const timeWithPeriod = dayjs(now).format("h:mm A")
    const shortDateLine = dayjs(now).format("dddd, MMM D").toUpperCase()
    const greeting = timeOfDayGreeting(dayjs(now).hour())

    return (
        <header className="w-full">
            <div className="flex items-start justify-between gap-4 px-1">
                <p
                    className="flex max-w-[min(100%,36rem)] flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.8125rem] font-medium tracking-wide text-primary/70"
                    role="status"
                    aria-label={`${timeWithPeriod}, ${shortDateLine}, ${MOCK_WEATHER.city}, ${MOCK_WEATHER.summary}`}
                >
                    <span className="text-foreground/90">{timeWithPeriod}</span>
                    <span className="text-primary/55">•</span>
                    <span>{shortDateLine}</span>
                    <span className="text-primary/55">•</span>
                    <span className="inline-flex items-center gap-1 text-foreground/85">
                        <Sun
                            className="size-3.5 shrink-0 text-chart-1"
                            strokeWidth={2}
                            aria-hidden
                        />
                        {MOCK_WEATHER.city}
                        <span className="text-primary/55">·</span>
                        <span className="text-muted-foreground">
                            {MOCK_WEATHER.summary}
                        </span>
                    </span>
                </p>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 rounded-full text-muted-foreground"
                            aria-label="Settings"
                        >
                            <Settings className="size-5" strokeWidth={2} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={6}>
                        Settings
                    </TooltipContent>
                </Tooltip>
            </div>

            <div className="mt-10 flex flex-col items-center text-center sm:mt-14">
                <p className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
                    {greeting}
                </p>


                <div className="relative mt-8 w-full max-w-xl sm:mt-10">
                    <label htmlFor="dashboard-search" className="sr-only">
                        Search the web or type a URL
                    </label>
                    <Search
                        className="pointer-events-none absolute top-1/2 left-5 z-1 size-5 -translate-y-1/2 text-muted-foreground"
                        strokeWidth={2}
                        aria-hidden
                    />
                    <Input
                        id="dashboard-search"
                        type="search"
                        placeholder="Search the web or type a URL"
                        className="h-auto rounded-full border-border/80 bg-card py-3.5 pr-14 pl-14 text-center shadow-sm placeholder:text-muted-foreground focus-visible:ring-ring/25 sm:text-left"
                    />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                className="absolute top-1/2 right-3 z-1 size-8 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
                                aria-label="Voice search"
                            >
                                <Mic className="size-5" strokeWidth={2} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" sideOffset={6}>
                            Voice search
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </header>
    )
}
