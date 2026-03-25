export type NewsItem = {
  id: string
  source: string
  timeAgo: string
  headline: string
  /** Tailwind background class for thumbnail placeholder */
  thumbClass: string
}

export type TodoMock = {
  id: string
  label: string
  done: boolean
}

export type CalendarEventMock = {
  id: string
  timeLabel: string
  title: string
}

export type QuickLaunchItem = {
  id: string
  name: string
  icon: "mail" | "sticky-note" | "github" | "calendar" | "cloud" | "message"
}

export const MOCK_QUOTE = {
  text: "The quality of your life is determined by the quality of your thoughts.",
  author: "Marcus Aurelius",
} as const

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "n1",
    source: "The Verge",
    timeAgo: "12m ago",
    headline: "Apple's M4 Chip: Everything we know so far",
    thumbClass: "bg-sky-200 dark:bg-sky-900",
  },
  {
    id: "n2",
    source: "9to5Mac",
    timeAgo: "1h ago",
    headline: "iOS 18 rumors: what to expect this fall",
    thumbClass: "bg-purple-200 dark:bg-purple-900",
  },
  {
    id: "n3",
    source: "Hacker News",
    timeAgo: "3h ago",
    headline: "Why Rust is the future of systems programming",
    thumbClass: "bg-orange-200 dark:bg-orange-900",
  },
]

export const MOCK_TODOS: TodoMock[] = [
  { id: "t1", label: "Morning meditation", done: true },
  { id: "t2", label: "Review project roadmap", done: false },
  { id: "t3", label: "Inbox zero", done: false },
]

export const MOCK_CALENDAR: CalendarEventMock[] = [
  { id: "c1", timeLabel: "10:00 AM", title: "Design sync — Dinam new tab" },
  { id: "c2", timeLabel: "2:30 PM", title: "Focus block — deep work" },
]

export const MOCK_QUICK_LAUNCH: QuickLaunchItem[] = [
  { id: "q1", name: "Gmail", icon: "mail" },
  { id: "q2", name: "Notion", icon: "sticky-note" },
  { id: "q3", name: "GitHub", icon: "github" },
  { id: "q4", name: "Calendar", icon: "calendar" },
  { id: "q5", name: "Drive", icon: "cloud" },
  { id: "q6", name: "Slack", icon: "message" },
]

export const MOCK_WEATHER = "28°C · Sunny"

export const MOCK_STREAK_DAYS = 5
