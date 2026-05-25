import dayjs from "dayjs"
import { useEffect, useState } from "react"

import { useWeather } from "@/hooks/use-weather"
import { getWeatherCondition } from "@/lib/weather-utils"

/**
 * Fully self-contained live clock status bar.
 *
 * All time-driven state (`now`, the 1-second interval) lives entirely inside
 * this component so only this subtree re-renders on each tick — parent
 * components and siblings remain completely static.
 */
export function LiveClock() {
  const [now, setNow] = useState(() => new Date())
  const { weather, weatherLoading, weatherError } = useWeather()

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const timeWithPeriod = dayjs(now).format("h:mm A")
  const shortDateLine = dayjs(now).format("dddd, MMM D").toUpperCase()
  const condition = getWeatherCondition(weather.weatherCode)
  const WeatherIcon = condition.icon

  const weatherAriaLabel =
    !weatherLoading && !weatherError
      ? `, ${weather.city}, ${condition.label}`
      : ""

  return (
    <p
      className="flex max-w-[min(100%,36rem)] flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.8125rem] font-medium tracking-wide text-primary/70"
      role="status"
      aria-label={`${timeWithPeriod}, ${shortDateLine}${weatherAriaLabel}`}
    >
      <span className="text-foreground/90">{timeWithPeriod}</span>
      <span className="text-primary/55">•</span>
      <span>{shortDateLine}</span>
      {!weatherError && (
        <>
          <span className="text-primary/55">•</span>
          <span className="inline-flex items-center gap-1 text-foreground/85">
            <WeatherIcon
              className="size-3.5 shrink-0 text-chart-1"
              strokeWidth={2}
              aria-hidden
            />
            {weatherLoading ? (
              <span className="text-muted-foreground">…</span>
            ) : (
              <>
                {weather.city}
                <span className="text-primary/55">·</span>
                <span className="text-muted-foreground">{condition.label}</span>
              </>
            )}
          </span>
        </>
      )}
    </p>
  )
}
