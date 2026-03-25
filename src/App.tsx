import {
    Calendar,
    Check,
    Cloud,
    LayoutList,
    Mail,
    MessageCircle,
    Plus,
    Quote,
    Search,
    Sun,
} from "lucide-react"
import dayjs from "dayjs"
import { useEffect, useMemo, useState } from "react"

import {
    MOCK_NEWS,
    MOCK_QUICK_LAUNCH,
    MOCK_QUOTE,
    MOCK_TODOS,
    MOCK_WEATHER,
    type QuickLaunchItem,
} from "@/data/dashboard-mock"
import { cn } from "@/lib/utils"

function randomBetween(min: number, max: number) {
    return min + Math.random() * (max - min)
}

type BackgroundBlob = {
    animationClass: string
    bgClass: string
    blurClass: string
    borderRadius: string
    height: string
    left: string
    animationDelay: string
    opacity: number
    top: string
    width: string
}

function createBackgroundBlobs(): BackgroundBlob[] {
    const animations = [
        "animate-dashboard-blob-1",
        "animate-dashboard-blob-2",
        "animate-dashboard-blob-3",
    ] as const
    const bgClasses = [
        "bg-primary/35",
        "bg-chart-1/30",
        "bg-chart-2/28",
        "bg-accent/40",
    ] as const
    return Array.from({ length: 8 }, (_, i) => ({
        top: `${randomBetween(-8, 72)}%`,
        left: `${randomBetween(-12, 78)}%`,
        width: `${randomBetween(14, 32)}rem`,
        height: `${randomBetween(11, 28)}rem`,
        borderRadius: `${randomBetween(36, 48)}% ${randomBetween(40, 50)}% ${randomBetween(36, 48)}% ${randomBetween(40, 50)}%`,
        animationClass: animations[i % 3],
        bgClass: bgClasses[i % bgClasses.length],
        blurClass: i % 3 === 0 ? "blur-3xl" : "blur-2xl",
        animationDelay: `${randomBetween(0, 12)}s`,
        opacity: randomBetween(0.65, 1),
    }))
}

function QuickLaunchIcon({ item }: { item: QuickLaunchItem }) {
    const common = "size-6 shrink-0"
    switch (item.icon) {
        case "mail":
            return <Mail className={cn(common, "text-chart-1")} strokeWidth={2} />
        case "sticky-note":
            return <LayoutList className={cn(common, "text-foreground")} strokeWidth={2} />
        case "github":
            return (
                <svg
                    className={cn(common, "text-foreground")}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                >
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
            )
        case "calendar":
            return <Calendar className={cn(common, "text-primary")} strokeWidth={2} />
        case "cloud":
            return <Cloud className={cn(common, "text-primary")} strokeWidth={2} />
        case "message":
            return <MessageCircle className={cn(common, "text-destructive")} strokeWidth={2} />
        default: {
            const _exhaustive: never = item.icon
            return _exhaustive
        }
    }
}

const App = () => {
    const [now, setNow] = useState(() => new Date())
    const [todos, setTodos] = useState(MOCK_TODOS)
    const backgroundBlobs = useMemo(() => createBackgroundBlobs(), [])

    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), 60_000)
        return () => window.clearInterval(id)
    }, [])

    const remaining = todos.filter((t) => !t.done).length

    const toggleTodo = (id: string) => {
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        )
    }

    const newsItems = MOCK_NEWS.slice(0, 2)
    const timeLabel = dayjs(now).format("h:mm A")
    const dateLabel = dayjs(now).format("dddd, MMMM D, YYYY")

    return (
        <div className="relative min-h-dvh bg-muted font-sans text-foreground">
            <div
                className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
                aria-hidden
            >
                {backgroundBlobs.map((blob, index) => (
                    <div
                        key={index}
                        className={cn(
                            "absolute will-change-transform",
                            blob.blurClass,
                            blob.bgClass,
                            blob.animationClass,
                        )}
                        style={{
                            top: blob.top,
                            left: blob.left,
                            width: blob.width,
                            height: blob.height,
                            borderRadius: blob.borderRadius,
                            opacity: blob.opacity,
                            animationDelay: blob.animationDelay,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <header className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] md:items-center md:gap-6 lg:gap-8">
                    <div className="min-w-0">
                        <p className="text-4xl font-bold tracking-tight sm:text-5xl">
                            {timeLabel}
                        </p>
                        <p className="mt-1 text-base text-muted-foreground">
                            {dateLabel}
                        </p>
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

                <section className="mb-6 grid grid-cols-1 gap-6 lg:mb-8 lg:grid-cols-5 lg:gap-8">
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

                    <article className="flex flex-col rounded-3xl bg-card p-7 lg:col-span-2">
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-card-foreground">
                                Today&apos;s Tasks
                            </h2>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold tracking-wide text-accent-foreground uppercase">
                                <span
                                    className="size-1.5 shrink-0 rounded-full bg-primary"
                                    aria-hidden
                                />
                                {remaining} remaining
                            </span>
                        </div>
                        <ul className="flex flex-1 flex-col gap-4">
                            {todos.map((todo) => (
                                <li key={todo.id}>
                                    <button
                                        type="button"
                                        onClick={() => toggleTodo(todo.id)}
                                        className="flex w-full cursor-pointer items-start gap-3 rounded-xl text-left transition-colors hover:bg-muted/80"
                                    >
                                        <span
                                            className={cn(
                                                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                                                todo.done
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-border bg-muted",
                                            )}
                                            aria-hidden
                                        >
                                            {todo.done ? (
                                                <Check className="size-3" strokeWidth={3} />
                                            ) : null}
                                        </span>
                                        <span
                                            className={cn(
                                                "text-base leading-snug",
                                                todo.done
                                                    ? "text-muted-foreground line-through"
                                                    : "font-medium text-card-foreground",
                                            )}
                                        >
                                            {todo.label}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            type="button"
                            className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                        >
                            <Plus className="size-5" strokeWidth={2.5} />
                            Add task
                        </button>
                    </article>
                </section>

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,13fr)] lg:gap-8">
                    <article className="rounded-3xl bg-card p-7">
                        <h2 className="text-sm font-bold text-muted-foreground">
                            Quick Launch
                        </h2>
                        <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6">
                            {MOCK_QUICK_LAUNCH.map((item) => (
                                <a
                                    key={item.id}
                                    href="#"
                                    className="group flex flex-col items-center gap-2 rounded-xl pb-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <span className="flex size-14 items-center justify-center rounded-full bg-card shadow-sm transition group-hover:shadow-md">
                                        <QuickLaunchIcon item={item} />
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {item.name}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </article>

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
                </section>
            </div>
        </div>
    )
}

export default App
