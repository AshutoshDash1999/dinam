export const WEATHER_CACHE_KEY = "dinam-weather-cache"
export const CACHE_TTL_MS = 15 * 60 * 1000

export type WeatherCache = {
  lat: number
  lng: number
  weather: {
    city: string
    temperature: number
    weatherCode: number
  }
  timestamp: number
}

export function readWeatherCache(): WeatherCache | null {
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (
      typeof parsed?.lat !== "number" ||
      typeof parsed?.lng !== "number" ||
      typeof parsed?.weather?.city !== "string" ||
      typeof parsed?.timestamp !== "number"
    ) {
      localStorage.removeItem(WEATHER_CACHE_KEY)
      return null
    }
    return parsed as WeatherCache
  } catch {
    localStorage.removeItem(WEATHER_CACHE_KEY)
    return null
  }
}

export function writeWeatherCache(entry: WeatherCache): void {
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(entry))
  } catch {
    console.warn("[dinam] Storage full — could not cache weather data.")
  }
}
