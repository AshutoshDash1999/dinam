import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useState, useEffect, useCallback } from "react"

dayjs.extend(relativeTime)

export type NewsItem = {
  id: string
  source: string
  timeAgo: string
  headline: string
  url: string
  faviconUrl: string
}

type FetchStatus = "loading" | "success" | "error"

const CACHE_KEY = "dinam-dashboard-tech-news"
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

type CacheData = {
  timestamp: number
  items: NewsItem[]
}

export function useTechNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [status, setStatus] = useState<FetchStatus>("loading")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refetch = useCallback((force = false) => {
    if (force) {
      try {
        localStorage.removeItem(CACHE_KEY)
      } catch {
        // Ignore cache errors and fetch fresh
      }
    }
    setStatus("loading")
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function fetchNews() {
      // 1. Check Cache
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY)
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw) as CacheData
          if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            setNews(parsed.items)
            setStatus("success")
            return
          }
        }
      } catch {
        // Ignore cache errors and fetch fresh
      }

      // 2. Fetch Fresh Data (Algolia Hacker News API)
      setStatus("loading")
      try {
        // Fetch front page stories, 4 items
        const res = await fetch(
          "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=4"
        )
        if (!res.ok) throw new Error("Failed to fetch news")

        const data = await res.json()

        const fetchedItems: NewsItem[] = data.hits
          .filter(
            (hit: { title?: string; url?: string }) => hit.title && hit.url
          ) // ensure valid data
          .map(
            (hit: {
              objectID: string
              title: string
              url: string
              created_at: string
            }) => {
              const urlObj = new URL(hit.url)
              // Strip www. for cleaner source name
              const source = urlObj.hostname.replace(/^www\./, "")

              return {
                id: hit.objectID,
                headline: hit.title,
                url: hit.url,
                source: source,
                timeAgo: dayjs(hit.created_at).fromNow(),
                faviconUrl: `https://www.google.com/s2/favicons?domain=${source}&sz=64`,
              }
            }
          )

        if (isMounted) {
          setNews(fetchedItems)
          setStatus("success")

          // Update Cache
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              items: fetchedItems,
            } satisfies CacheData)
          )
        }
      } catch {
        if (isMounted) {
          setStatus("error")
        }
      }
    }

    fetchNews()

    return () => {
      isMounted = false
    }
  }, [refreshTrigger])

  return { news, status, refetch }
}
