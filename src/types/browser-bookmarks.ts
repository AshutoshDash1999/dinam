export type BrowserBookmark = {
  id: string
  title: string
  url?: string
  children?: BrowserBookmark[]
}
