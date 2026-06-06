import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useState, useEffect } from "react"

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
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)

  async function fetchNews(forceRefresh = false, isMounted = true) {
    // 1. Check Cache
    if (!forceRefresh) {
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY)

        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw) as CacheData

          if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            setNews(parsed.items)
            setLastUpdated(parsed.timestamp)
            setStatus("success")
            return
          }
        }
      } catch {
        // Ignore cache errors and fetch fresh
      }
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
        .filter((hit: { title?: string; url?: string }) => hit.title && hit.url) // ensure valid data
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
        const timestamp = Date.now()

        setNews(fetchedItems)
        setLastUpdated(timestamp)
        setStatus("success")

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp,
            items: fetchedItems,
          } satisfies CacheData)
        )
      }
    } catch {
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY)

        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw) as CacheData

          if (isMounted) {
            setNews(parsed.items)
            setLastUpdated(parsed.timestamp)
            setStatus("success")
          }

          return
        }
      } catch {
        /* empty */
      }

      if (isMounted) {
        setStatus("error")
      }
    }
  }

  useEffect(() => {
    let isMounted = true

    fetchNews(false, isMounted)

    return () => {
      isMounted = false
    }
  }, [])

  return {
    news,
    status,
    lastUpdated,
    refreshNews: () => fetchNews(true, true),
  }
}
