import { useEffect, useState } from "react"

import {
  getBrowserBookmarks,
  subscribeToBookmarkChanges,
} from "@/lib/browser-bookmarks"

import type { BrowserBookmark } from "@/types/browser-bookmarks"

export function useBrowserBookmarks() {
  const [bookmarks, setBookmarks] = useState<BrowserBookmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const data = await getBrowserBookmarks()

      setBookmarks(data)
      setLoading(false)
    }

    load()

    const unsubscribe = subscribeToBookmarkChanges(() => {
      load()
    })

    return unsubscribe
  }, [])

  return {
    bookmarks,
    loading,
  }
}
