import dayjs from "dayjs"
import { useEffect, useState, useCallback } from "react"

import { MOCK_QUOTE } from "@/data/dashboard-mock"

/** Same path as upstream; in dev Vite proxies to https://stoic.tekloon.net (see vite.config). */
export const STOIC_QUOTE_API_URL = import.meta.env.DEV
  ? "/stoic-quote"
  : "https://stoic.tekloon.net/stoic-quote"

export const STOIC_QUOTE_STORAGE_KEY = "dashboard-stoic-quote"

export type StoicQuoteStored = {
  dayKey: string
  quote: string
  author: string
}

function todayKey(): string {
  return dayjs().format("YYYY-MM-DD")
}

export function readStoicQuoteFromStorage(): StoicQuoteStored | null {
  try {
    const raw = localStorage.getItem(STOIC_QUOTE_STORAGE_KEY)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("dayKey" in parsed) ||
      !("quote" in parsed) ||
      !("author" in parsed)
    ) {
      return null
    }
    const { dayKey, quote, author } = parsed as Record<string, unknown>
    if (
      typeof dayKey !== "string" ||
      typeof quote !== "string" ||
      typeof author !== "string" ||
      dayKey.trim() === "" ||
      quote.trim() === "" ||
      author.trim() === ""
    ) {
      return null
    }
    return {
      dayKey: dayKey.trim(),
      quote: quote.trim(),
      author: author.trim(),
    }
  } catch {
    return null
  }
}

export function writeStoicQuoteToStorage(entry: StoicQuoteStored): void {
  try {
    localStorage.setItem(STOIC_QUOTE_STORAGE_KEY, JSON.stringify(entry))
  } catch {
    /* ignore quota / private mode */
  }
}

export async function fetchStoicQuoteFromApi(): Promise<{
  quote: string
  author: string
} | null> {
  let res: Response
  try {
    res = await fetch(STOIC_QUOTE_API_URL)
  } catch {
    // Network error, CORS failure, offline, or DNS failure.
    // Return null so the caller falls back to cached / mock quote.
    return null
  }
  if (!res.ok) return null
  const json: unknown = await res.json()
  if (
    typeof json !== "object" ||
    json === null ||
    !("data" in json) ||
    typeof (json as { data?: unknown }).data !== "object" ||
    (json as { data: unknown }).data === null
  ) {
    return null
  }
  const data = (json as { data: Record<string, unknown> }).data
  const quote = data.quote
  const author = data.author
  if (
    typeof quote !== "string" ||
    typeof author !== "string" ||
    quote.trim() === "" ||
    author.trim() === ""
  ) {
    return null
  }
  return { quote: quote.trim(), author: author.trim() }
}

function initialDisplayQuote(): { text: string; author: string } {
  const stored = readStoicQuoteFromStorage()
  const today = todayKey()
  if (stored?.dayKey === today) {
    return { text: stored.quote, author: stored.author }
  }
  if (stored) {
    return { text: stored.quote, author: stored.author }
  }
  return { text: MOCK_QUOTE.text, author: MOCK_QUOTE.author }
}

export function useStoicQuote(): {
  text: string
  author: string
  refresh: () => void
  loading: boolean
} {
  const [quote, setQuote] = useState(initialDisplayQuote)
  const [loading, setLoading] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refresh = useCallback(() => {
    setLoading(true)
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const isManual = refreshTrigger > 0
    if (!isManual) {
      const stored = readStoicQuoteFromStorage()
      const today = todayKey()
      if (stored?.dayKey === today) {
        return
      }
    }

    let cancelled = false
    void fetchStoicQuoteFromApi().then((result) => {
      if (cancelled) return
      setLoading(false)
      if (!result) return
      
      const today = todayKey()
      writeStoicQuoteToStorage({
        dayKey: today,
        quote: result.quote,
        author: result.author,
      })
      setQuote({ text: result.quote, author: result.author })
    })

    return () => {
      cancelled = true
    }
  }, [refreshTrigger])

  return { text: quote.text, author: quote.author, refresh, loading }
}
