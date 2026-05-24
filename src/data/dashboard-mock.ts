export type CalendarEventMock = {
  id: string
  timeLabel: string
  title: string
}

export type QuickLaunchItem = {
  id: string
  title: string
  url: string
  description?: string
  favicon?: string
}

export type BookmarkItem = {
  id: string
  title: string
  href: string
}

export const MOCK_QUOTE = {
  text: "The details are not the details. They make the design.",
  author: "Charles Eames",
} as const

export const MOCK_CALENDAR: CalendarEventMock[] = [
  { id: "c1", timeLabel: "10:00 AM", title: "Design sync — Dinam new tab" },
  { id: "c2", timeLabel: "2:30 PM", title: "Focus block — deep work" },
]

export const MOCK_QUICK_LAUNCH: QuickLaunchItem[] = [
  { id: "q1", title: "Mail", url: "https://mail.google.com", favicon: "https://www.google.com/s2/favicons?domain=mail.google.com&sz=64" },
  { id: "q2", title: "Documents", url: "https://notion.so", favicon: "https://www.google.com/s2/favicons?domain=notion.so&sz=64" },
  { id: "q3", title: "Calendar", url: "https://calendar.google.com", favicon: "https://www.google.com/s2/favicons?domain=calendar.google.com&sz=64" },
  { id: "q4", title: "Terminal", url: "https://github.com", favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=64" },
]

export const MOCK_BOOKMARKS: BookmarkItem[] = [
  {
    id: "b1",
    title: "Design reference",
    href: "https://www.are.na",
  },
  {
    id: "b2",
    title: "Typography",
    href: "https://fonts.google.com",
  },
  {
    id: "b3",
    title: "Color & contrast",
    href: "https://coolors.co",
  },
  {
    id: "b4",
    title: "Documentation",
    href: "https://developer.mozilla.org",
  },
]

export const MOCK_WEATHER = {
  city: "Chennai",
  summary: "Sunny · 34°C",
} as const

export const MOCK_STREAK_DAYS = 5

