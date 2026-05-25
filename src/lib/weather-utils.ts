import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Snowflake,
  Sun,
  Wind,
} from "lucide-react"

export function getWeatherCondition(code: number) {
  if (code === 0) return { label: "Clear Sky", icon: Sun }
  if (code === 1 || code === 2)
    return { label: "Partly Cloudy", icon: CloudSun }
  if (code === 3) return { label: "Overcast", icon: Cloud }
  if (code === 45 || code === 48) return { label: "Foggy", icon: CloudFog }
  if (code >= 51 && code <= 57) return { label: "Drizzle", icon: CloudDrizzle }
  if (code >= 61 && code <= 67) return { label: "Rain", icon: CloudRain }
  if (code >= 71 && code <= 75) return { label: "Snow", icon: CloudSnow }
  if (code === 77) return { label: "Snow Grains", icon: Snowflake }
  if (code >= 80 && code <= 82)
    return { label: "Rain Showers", icon: CloudRain }
  if (code === 85 || code === 86)
    return { label: "Snow Showers", icon: CloudSnow }
  if (code === 95) return { label: "Thunderstorm", icon: CloudLightning }
  if (code === 96 || code === 99)
    return { label: "Thunderstorm", icon: CloudLightning }
  return { label: "Windy", icon: Wind }
}
