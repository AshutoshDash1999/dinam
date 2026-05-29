import { useEffect, useMemo, useState } from "react"

import { getCreativeGreeting } from "@/utils/greetings"

/**
 * Self-contained greeting hero that re-renders only when the hour changes.
 *
 * Maintains its own 60-second polling interval (just to detect hour
 * boundaries), so the parent tree never re-renders for greeting updates.
 */
export function LiveGreeting() {
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours())

  useEffect(() => {
    // Check once per minute whether the hour has changed.
    // This is far cheaper than every second, and a ≤59 s delay on
    // a greeting change is imperceptible.
    const id = window.setInterval(() => {
      setCurrentHour(new Date().getHours())
    }, 60_000)
    return () => window.clearInterval(id)
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps -- currentHour is an intentional cache-buster
  const greeting = useMemo(() => getCreativeGreeting(), [currentHour])

  return (
    <div className="flex items-center justify-center">
      <p className="text-center text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white select-none leading-[0.9]">
        <span className="inline-block max-w-xl leading-[1] text-balance">
          {greeting.text}
        </span>
      </p>
    </div>
  )
}
