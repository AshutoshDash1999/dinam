import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useCallback, useEffect, useRef, useState } from "react"

dayjs.extend(relativeTime)

export type NewsItem = {
  id: string
  source: string
  timeAgo: string
  headline: string
  url: string
  faviconUrl: string
}

type HackerNewsHit = {
  objectID: string
  title: string
  url: string
  created_at: string
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

  // Track mount state for the whole hook lifetime, not just the initial effect.
  // The old code path passed `isMounted` in as a function arg and hardcoded
  // `true` at the refreshNews call site, so a refresh fired right before an
  // unmount (or a second refresh before the first resolved) still wrote state
  // — and the older in-flight request could overwrite the newer one.
  const isMountedRef = useRef(true)
  const abortRef = useRef<AbortController | null>(null)

  const fetchNews = useCallback(async (forceRefresh = false) => {
    // 1. Check Cache
    if (!forceRefresh) {
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY)

        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw) as CacheData

          if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            if (!isMountedRef.current) return
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

    // Cancel any in-flight fetch so a slow earlier request can't clobber
    // this refresh's result when it finally resolves.
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    if (isMountedRef.current) setStatus("loading")

    // 2. Fetch Fresh Data (Algolia Hacker News API)
    try {
      // Fetch front page stories, 4 items
      const res = await fetch(
        "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=4",
        { signal: controller.signal }
      )
      if (!res.ok) throw new Error("Failed to fetch news")

      const data = await res.json()

      const fetchedItems: NewsItem[] = data.hits
        .filter((hit: Partial<HackerNewsHit>) => hit.title && hit.url)
        .map(({ objectID, title, url, created_at }: HackerNewsHit) => {
          const urlObj = new URL(url)

          const source = urlObj.hostname.replace(/^www\./, "")

          return {
            id: objectID,
            headline: title,
            url,
            source,
            timeAgo: dayjs(created_at).fromNow(),
            faviconUrl: `https://www.google.com/s2/favicons?domain=${source}&sz=64`,
          }
        })

      // Discard if this request was superseded or the component unmounted
      // between the fetch kicking off and now.
      if (controller.signal.aborted || !isMountedRef.current) return

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
    } catch (err) {
      // AbortError is expected when a newer refresh cancels this one — don't
      // surface it as an error state to the UI.
      if ((err as { name?: string })?.name === "AbortError") return

      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY)

        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw) as CacheData

          if (isMountedRef.current) {
            setNews(parsed.items)
            setLastUpdated(parsed.timestamp)
            setStatus("success")
          }

          return
        }
      } catch {
        /* empty */
      }

      if (isMountedRef.current) {
        setStatus("error")
      }
    }
  }, [])

  useEffect(() => {
    isMountedRef.current = true
    fetchNews(false)

    return () => {
      isMountedRef.current = false
      abortRef.current?.abort()
    }
  }, [fetchNews])

  const refreshNews = useCallback(() => fetchNews(true), [fetchNews])

  return {
    news,
    status,
    lastUpdated,
    refreshNews,
  }
}
