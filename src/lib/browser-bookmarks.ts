import type { BrowserBookmark } from "@/types/browser-bookmarks"

function mapBookmarkNode(
  node: chrome.bookmarks.BookmarkTreeNode
): BrowserBookmark {
  return {
    id: node.id,
    title: node.title,
    url: node.url,
    children: node.children?.map(mapBookmarkNode),
  }
}

export async function getBrowserBookmarks(): Promise<
  BrowserBookmark[]
> {
  return new Promise((resolve, reject) => {
    if (
      typeof chrome === "undefined" ||
      !chrome.bookmarks
    ) {
      resolve([])
      return
    }

    try {
      chrome.bookmarks.getTree((tree) => {
        if (chrome.runtime.lastError) {
          reject(
            new Error(
              chrome.runtime.lastError.message
            )
          )
          return
        }

        resolve(tree.map(mapBookmarkNode))
      })
    } catch (error) {
      reject(error)
    }
  })
}

export function subscribeToBookmarkChanges(
  callback: () => void
) {
  if (
    typeof chrome === "undefined" ||
    !chrome.bookmarks
  ) {
    return () => {}
  }

  chrome.bookmarks.onCreated.addListener(callback)
  chrome.bookmarks.onRemoved.addListener(callback)
  chrome.bookmarks.onChanged.addListener(callback)

  return () => {
    chrome.bookmarks.onCreated.removeListener(
      callback
    )

    chrome.bookmarks.onRemoved.removeListener(
      callback
    )

    chrome.bookmarks.onChanged.removeListener(
      callback
    )
  }
}
