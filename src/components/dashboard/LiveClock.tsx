import dayjs from "dayjs"
import { useEffect, useState } from "react"

/**
 * Fully self-contained live clock status bar.
 *
 * All time-driven state (`now`, the 1-second interval) lives entirely inside
 * this component so only this subtree re-renders on each tick — parent
 * components and siblings remain completely static.
 */
export function LiveClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const timeWithPeriod = dayjs(now).format("h:mm A")
  const shortDateLine = dayjs(now).format("dddd, MMM D").toUpperCase()

  return (
    <p
      className="flex max-w-[min(100%,36rem)] flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.8125rem] font-medium tracking-wide text-primary/70"
      role="status"
      aria-label={`${timeWithPeriod}, ${shortDateLine}`}
    >
      <span className="text-foreground/90">{timeWithPeriod}</span>
      <span className="text-primary/55">•</span>
      <span>{shortDateLine}</span>
    </p>
  )
}
