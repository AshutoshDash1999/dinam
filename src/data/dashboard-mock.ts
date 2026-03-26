export type NewsItem = {
  id: string
  source: string
  timeAgo: string
  headline: string
  /** Tailwind background class for thumbnail placeholder */
  thumbClass: string
}

export type CalendarEventMock = {
  id: string
  timeLabel: string
  title: string
}

export type QuickLaunchIconKey =
  | "mail"
  | "file"
  | "calendar"
  | "terminal"
  | "folder"
  | "music"
  | "camera"

export type QuickLaunchItem = {
  id: string
  name: string
  href: string
  icon: QuickLaunchIconKey
}

/** Icons assigned to new slots by order (cycles). */
export const QUICK_LAUNCH_ICON_POOL: readonly QuickLaunchIconKey[] = [
  "mail",
  "file",
  "calendar",
  "terminal",
  "folder",
  "music",
  "camera",
] as const

export type BookmarkItem = {
  id: string
  title: string
  href: string
}

export const MOCK_QUOTE = {
  text: "The details are not the details. They make the design.",
  author: "Charles Eames",
} as const

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "n1",
    source: "New York Times",
    timeAgo: "12m ago",
    headline: "The future of generative AI in high-end industrial design",
    thumbClass: "bg-chart-1/45 dark:bg-chart-1/35",
  },
  {
    id: "n2",
    source: "Wired",
    timeAgo: "1h ago",
    headline: "Silicon Photonics: The next leap in computing power",
    thumbClass: "bg-chart-2/45 dark:bg-chart-2/35",
  },
  {
    id: "n3",
    source: "The Verge",
    timeAgo: "3h ago",
    headline: "Spatial audio and the revolution of personal workspace",
    thumbClass: "bg-chart-3/45 dark:bg-chart-3/35",
  },
]

export const MOCK_CALENDAR: CalendarEventMock[] = [
  { id: "c1", timeLabel: "10:00 AM", title: "Design sync — Dinam new tab" },
  { id: "c2", timeLabel: "2:30 PM", title: "Focus block — deep work" },
]

export const MOCK_QUICK_LAUNCH: QuickLaunchItem[] = [
  { id: "q1", name: "Mail", href: "https://mail.google.com", icon: "mail" },
  { id: "q2", name: "Documents", href: "https://notion.so", icon: "file" },
  {
    id: "q3",
    name: "Calendar",
    href: "https://calendar.google.com",
    icon: "calendar",
  },
  { id: "q4", name: "Terminal", href: "https://github.com", icon: "terminal" },
  { id: "q5", name: "Files", href: "#", icon: "folder" },
  { id: "q6", name: "Music", href: "#", icon: "music" },
  { id: "q7", name: "Camera", href: "#", icon: "camera" },
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
  city: "San Francisco",
  summary: "28°C · Sunny",
} as const

export const MOCK_STREAK_DAYS = 5
