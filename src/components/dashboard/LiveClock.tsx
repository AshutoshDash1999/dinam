import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { useWeather } from "@/hooks/use-weather"

/**
 * Fully self-contained live clock status bar.
 */
export function LiveClock() {
  const [now, setNow] = useState(() => new Date())
  const { weather, weatherLoading } = useWeather()

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const time = dayjs(now).format("h:mm A")
  const dateLine = dayjs(now).format("dddd, MMMM D")

  return (
    <div className="flex flex-col items-start select-none">
      <div className="flex items-baseline gap-3 leading-none">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {time}
        </span>
        <span className="text-base font-medium text-muted-foreground/60">
          • {dateLine}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-wider text-muted-foreground/50">
        {!weatherLoading && (
          <>
            <span>{Math.round(weather.temperature)}°F</span>
            <span>•</span>
            <span>{weather.city}</span>
          </>
        )}
      </div>
    </div>
  )
}
