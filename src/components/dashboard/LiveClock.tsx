import dayjs from "dayjs"
import { Sun } from "lucide-react"
import { useMemo, useSyncExternalStore } from "react"

import { MOCK_WEATHER } from "@/data/dashboard-mock"
import { getCreativeGreeting } from "@/utils/greetings"

type LiveClockVariant = "status" | "greeting"

type LiveClockProps = {
    variant: LiveClockVariant
}

let now = new Date()
let timerId: number | null = null
const listeners = new Set<() => void>()

function tick() {
    now = new Date()
    for (const listener of listeners) {
        listener()
    }
}

function subscribeClock(onStoreChange: () => void) {
    listeners.add(onStoreChange)
    if (timerId === null && typeof window !== "undefined") {
        timerId = window.setInterval(tick, 1000)
    }
    return () => {
        listeners.delete(onStoreChange)
        if (listeners.size === 0 && timerId !== null) {
            window.clearInterval(timerId)
            timerId = null
        }
    }
}

function getClockSnapshot() {
    return now
}

function getClockServerSnapshot() {
    return now
}

export function LiveClock({ variant }: LiveClockProps) {
    const current = useSyncExternalStore(
        subscribeClock,
        getClockSnapshot,
        getClockServerSnapshot,
    )
    const timeWithPeriod = dayjs(current).format("h:mm A")
    const shortDateLine = dayjs(current).format("dddd, MMM D").toUpperCase()
    const greeting = useMemo(
        () => getCreativeGreeting(),
        [current.getHours()],
    )

    if (variant === "greeting") {
        return (
            <div className="w-full max-w-4xl min-h-[7rem] flex items-center justify-center">
                <p className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-5xl font-bold tracking-tight text-foreground leading-none sm:text-6xl md:text-7xl lg:text-8xl select-none">
                    <span className="inline-block max-w-3xl text-balance leading-tight">
                        {greeting.text}
                    </span>
                    <span className="inline-block shrink-0 animate-pulse align-middle text-5xl sm:text-6xl md:text-7xl lg:text-8xl manual-emoji-reset leading-none">
                        {greeting.emoji}
                    </span>
                </p>
            </div>
        )
    }

    return (
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
    )
}
