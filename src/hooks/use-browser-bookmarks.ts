import { useEffect, useState } from "react"

import {
  getBrowserBookmarks,
  subscribeToBookmarkChanges,
} from "@/lib/browser-bookmarks"

import type { BrowserBookmark } from "@/types/browser-bookmarks"

export function useBrowserBookmarks() {
  const [bookmarks, setBookmarks] = useState<BrowserBookmark[]>([])
  const [loadingBookmarks, setLoadingBookmarks] = useState(true)

  useEffect(() => {
    async function load() {
      setLoadingBookmarks(true)

      const data = await getBrowserBookmarks()

      setBookmarks(data)
      setLoadingBookmarks(false)
    }

    load()

    const unsubscribe = subscribeToBookmarkChanges(() => {
      load()
    })

    return unsubscribe
  }, [])

  return {
    bookmarks,
    loadingBookmarks,
  }
}
