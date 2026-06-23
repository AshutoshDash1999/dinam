import { useEffect, useState } from "react"

import {
  getBrowserBookmarks,
  subscribeToBookmarkChanges,
} from "@/lib/browser-bookmarks"

import type { BrowserBookmark } from "@/types/browser-bookmarks"

export function useBrowserBookmarks() {
  const [bookmarks, setBookmarks] = useState<BrowserBookmark[]>([])
  const [loadingBookmarks, setLoadingBookmarks] = useState(true)
  const [bookmarksError, setBookmarksError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function load() {
      if (isMounted) {
        setLoadingBookmarks(true)
        setBookmarksError(null)
      }

      try {
        const data = await getBrowserBookmarks()
        if (!isMounted) return

        setBookmarks(data)
      } catch (error) {
        if (!isMounted) return

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load browser bookmarks."

        setBookmarks([])
        setBookmarksError(message)
      } finally {
        if (isMounted) {
          setLoadingBookmarks(false)
        }
      }
    }

    load()

    const unsubscribe = subscribeToBookmarkChanges(() => {
      load()
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return { bookmarks, loadingBookmarks, bookmarksError }
}
