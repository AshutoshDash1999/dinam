import { useEffect, useState } from "react"

import { haversineKm } from "@/lib/geo-utils"
import {
  CACHE_TTL_MS,
  readWeatherCache,
  writeWeatherCache,
} from "@/lib/weather-cache"

type WeatherState = {
  city: string
  temperature: number
  weatherCode: number
}

async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: { "Accept-Language": navigator.language || "en" } }
    )
    if (!res.ok) return "Your location"
    const data = await res.json()
    const addr = data.address
    if (!addr) return "Your location"
    const city = addr.city || addr.town || addr.village || addr.county || ""
    const state = addr.state || ""
    if (city && state) return `${city}, ${state}`
    return city || state || "Your location"
  } catch {
    return "Your location"
  }
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherState>(() => {
    const c = readWeatherCache()
    return c?.weather ?? { city: "", temperature: 0, weatherCode: 0 }
  })

  const [weatherLoading, setWeatherLoading] = useState(
    () => !readWeatherCache()
  )
  const [weatherError, setWeatherError] = useState("")

  useEffect(() => {
    const cached = readWeatherCache()
    const isFresh = cached && Date.now() - cached.timestamp < CACHE_TTL_MS

    if (isFresh) return

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        if (
          cached &&
          haversineKm(cached.lat, cached.lng, latitude, longitude) > 10
        ) {
          setWeather({ city: "", temperature: 0, weatherCode: 0 })
          setWeatherLoading(true)
        }

        try {
          const [weatherResponse, city] = await Promise.all([
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            ),
            reverseGeocode(latitude, longitude),
          ])

          if (!weatherResponse.ok) {
            throw new Error("Failed to fetch weather")
          }

          const weatherData = await weatherResponse.json()
          const currentWeather = weatherData.current_weather

          if (!currentWeather) {
            throw new Error("No weather data received")
          }

          const fresh: WeatherState = {
            city,
            temperature: currentWeather.temperature ?? 0,
            weatherCode: currentWeather.weathercode ?? 0,
          }

          setWeather(fresh)
          writeWeatherCache({
            lat: latitude,
            lng: longitude,
            weather: fresh,
            timestamp: Date.now(),
          })
        } catch {
          if (!cached) {
            setWeatherError("Unable to fetch weather")
          }
        } finally {
          setWeatherLoading(false)
        }
      },
      (error) => {
        if (!cached) {
          if (error.code === 1) {
            setWeatherError("Location permission denied")
          } else if (error.code === 2) {
            setWeatherError("Location unavailable")
          } else {
            setWeatherError("Location timeout")
          }
        }
        setWeatherLoading(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 600_000,
      }
    )
  }, [])

  return { weather, weatherLoading, weatherError }
}

.catch(err => console.error("Promise.all failed:", err));