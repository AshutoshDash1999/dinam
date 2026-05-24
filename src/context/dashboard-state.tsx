/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  MOCK_BOOKMARKS,
  MOCK_QUICK_LAUNCH,
  type BookmarkItem,
  type QuickLaunchItem,
} from "@/data/dashboard-mock"

import {
  fallbackNameFromQuickLaunchHref,
  normalizeQuickLaunchHref,
} from "@/lib/quick-launch-utils"

export type DashboardTodo = {
  id: string
  label: string
  done: boolean
  startDate?: string
  dueDate?: string
  progress?: number
  finishedDate?: string
}

const TODOS_KEY = "dinam-dashboard-todos"
const BOOKMARKS_KEY = "dinam-dashboard-bookmarks"
const QUICK_LAUNCH_KEY = "dinam-dashboard-quick-launch"

function newTodoId() {
  return `t-${crypto.randomUUID()}`
}

function newBookmarkId() {
  return `b-${crypto.randomUUID()}`
}

function loadTodos(): DashboardTodo[] {
  try {
    const raw = localStorage.getItem(TODOS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((item: unknown) => {
        const x = (item as Record<string, unknown>) || {}
        return {
          id: String(x.id || ""),
          label: String(x.label || ""),
          done: Boolean(x.done),
          startDate: x.startDate ? String(x.startDate) : "",
          dueDate: x.dueDate ? String(x.dueDate) : "",
          progress: typeof x.progress === "number" ? x.progress : 0,
          finishedDate: x.finishedDate ? String(x.finishedDate) : "",
        }
      })
      .filter((todo) => todo.id && todo.label)
  } catch {
    return []
  }
}

function loadBookmarks(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY)
    if (!raw) return [...MOCK_BOOKMARKS]
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return [...MOCK_BOOKMARKS]

    const next = parsed.filter(
      (x): x is BookmarkItem =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as BookmarkItem).id === "string" &&
        typeof (x as BookmarkItem).title === "string" &&
        typeof (x as BookmarkItem).href === "string"
    )
    return next.length > 0 ? next : [...MOCK_BOOKMARKS]
  } catch {
    return [...MOCK_BOOKMARKS]
  }
}

function loadQuickLaunch(): QuickLaunchItem[] {
  try {
    const raw = localStorage.getItem(QUICK_LAUNCH_KEY)
    if (!raw) return [...MOCK_QUICK_LAUNCH]
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return [...MOCK_QUICK_LAUNCH]

    const next = parsed.filter(
      (x): x is QuickLaunchItem =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as QuickLaunchItem).id === "string" &&
        typeof (x as QuickLaunchItem).title === "string" &&
        typeof (x as QuickLaunchItem).url === "string"
    )
    return next.length > 0 ? next : [...MOCK_QUICK_LAUNCH]
  } catch {
    return [...MOCK_QUICK_LAUNCH]
  }
}

export type DashboardStateContextValue = {
  todos: DashboardTodo[]
  bookmarks: BookmarkItem[]
  quickLaunchItems: QuickLaunchItem[]
  addTodo: (
    label: string,
    startDate?: string,
    dueDate?: string,
    progress?: number
  ) => string
  toggleTodo: (id: string) => void
  updateTodo: (id: string, patch: Partial<DashboardTodo>) => void
  deleteTodo: (id: string) => void
  clearCompletedTodos: () => void
  addBookmark: (title: string, href: string) => string
  deleteBookmark: (id: string) => void
  setQuickLaunchItems: (items: QuickLaunchItem[]) => void
  addQuickLaunchItem: (title: string, url: string) => string
  removeQuickLaunchItem: (id: string) => void
  updateQuickLaunchItem: (
    id: string,
    patch: Partial<Pick<QuickLaunchItem, "title" | "url">>
  ) => void
}

const DashboardStateContext = createContext<DashboardStateContextValue | null>(
  null
)

export function DashboardStateProvider({ children }: { children: ReactNode }) {
  const [todos, setTodosState] = useState<DashboardTodo[]>(loadTodos)
  const [bookmarks, setBookmarksState] = useState<BookmarkItem[]>(loadBookmarks)
  const [quickLaunchItems, setQuickLaunchState] =
    useState<QuickLaunchItem[]>(loadQuickLaunch)

  useEffect(() => {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback(
    (
      label: string,
      startDate?: string,
      dueDate?: string,
      progress?: number
    ) => {
      const trimmed = label.trim()
      if (!trimmed) return ""
      const id = newTodoId()
      setTodosState((prev) => [
        ...prev,
        {
          id,
          label: trimmed,
          done: false,
          startDate: startDate || "",
          dueDate: dueDate || "",
          progress: progress || 0,
          finishedDate: "",
        },
      ])
      return id
    },
    []
  )

  const toggleTodo = useCallback((id: string) => {
    setTodosState((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const nextDone = !t.done
        return {
          ...t,
          done: nextDone,
          progress: nextDone ? 100 : t.progress,
          finishedDate: nextDone ? new Date().toISOString().split("T")[0] : "",
        }
      })
    )
  }, [])

  const updateTodo = useCallback(
    (id: string, patch: Partial<DashboardTodo>) => {
      setTodosState((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t
          return {
            ...t,
            ...patch,
            label:
              patch.label !== undefined
                ? patch.label.trim() || t.label
                : t.label,
          }
        })
      )
    },
    []
  )

  const deleteTodo = useCallback((id: string) => {
    setTodosState((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearCompletedTodos = useCallback(() => {
    setTodosState((prev) => prev.filter((t) => !t.done))
  }, [])

  const addBookmark = useCallback((title: string, href: string) => {
    const t = title.trim()
    const h = href.trim()
    if (!t || !h) return ""
    const id = newBookmarkId()
    setBookmarksState((prev) => {
      const next = [...prev, { id, title: t, href: h }]
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next))
      return next
    })
    return id
  }, [])

  const deleteBookmark = useCallback((id: string) => {
    setBookmarksState((prev) => {
      const next = prev.filter((b) => b.id !== id)
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const setQuickLaunchItems = useCallback((items: QuickLaunchItem[]) => {
    localStorage.setItem(QUICK_LAUNCH_KEY, JSON.stringify(items))
    setQuickLaunchState(items)
  }, [])

  const addQuickLaunchItem = useCallback((title: string, url: string) => {
    const urlNorm = normalizeQuickLaunchHref(url)
    const titleTrim = title.trim()
    const resolvedTitle = titleTrim || fallbackNameFromQuickLaunchHref(urlNorm)
    if (!resolvedTitle && urlNorm === "#") return ""
    const id = `q-${crypto.randomUUID()}`

    setQuickLaunchState((prev) => {
      const next = [...prev, { id, title: resolvedTitle, url: urlNorm }]
      localStorage.setItem(QUICK_LAUNCH_KEY, JSON.stringify(next))
      return next
    })
    return id
  }, [])

  const removeQuickLaunchItem = useCallback((id: string) => {
    setQuickLaunchState((prev) => {
      const next = prev.filter((q) => q.id !== id)
      localStorage.setItem(QUICK_LAUNCH_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const updateQuickLaunchItem = useCallback(
    (id: string, patch: Partial<Pick<QuickLaunchItem, "title" | "url">>) => {
      setQuickLaunchState((prev) => {
        const next = prev.map((q) => {
          if (q.id !== id) return q
          let url = q.url
          if (patch.url !== undefined) url = normalizeQuickLaunchHref(patch.url)
          let title = q.title
          if (patch.title !== undefined)
            title = patch.title.trim() || fallbackNameFromQuickLaunchHref(url)
          return {
            ...q,
            title,
            url,
          }
        })
        localStorage.setItem(QUICK_LAUNCH_KEY, JSON.stringify(next))
        return next
      })
    },
    []
  )

  const value = useMemo(
    () => ({
      todos,
      bookmarks,
      quickLaunchItems,
      addTodo,
      toggleTodo,
      updateTodo,
      deleteTodo,
      clearCompletedTodos,
      addBookmark,
      deleteBookmark,
      setQuickLaunchItems,
      addQuickLaunchItem,
      removeQuickLaunchItem,
      updateQuickLaunchItem,
    }),
    [
      todos,
      bookmarks,
      quickLaunchItems,
      addTodo,
      toggleTodo,
      updateTodo,
      deleteTodo,
      clearCompletedTodos,
      addBookmark,
      deleteBookmark,
      setQuickLaunchItems,
      addQuickLaunchItem,
      removeQuickLaunchItem,
      updateQuickLaunchItem,
    ]
  )

  return (
    <DashboardStateContext.Provider value={value}>
      {children}
    </DashboardStateContext.Provider>
  )
}

export function useDashboardState(): DashboardStateContextValue {
  const ctx = useContext(DashboardStateContext)
  if (!ctx)
    throw new Error(
      "useDashboardState must be used within DashboardStateProvider"
    )
  return ctx
}
