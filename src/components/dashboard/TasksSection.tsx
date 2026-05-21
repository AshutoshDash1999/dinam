"use client"

import { Plus, Calendar, Percent } from "lucide-react"
import { useCallback, useState } from "react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { useDashboardState } from "@/context/dashboard-state"
import { Button } from "@/components/ui/button"
import { TaskItem } from "./TaskItem"
import { cn } from "@/lib/utils"

export function TasksSection() {
  const {
    todos = [],
    toggleTodo,
    deleteTodo,
    addTodo,
    updateTodo,
    clearCompletedTodos,
  } = useDashboardState()

  const [newTaskLabel, setNewTaskLabel] = useState("")
  const [startDate, setStartDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [progress, setProgress] = useState(0)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [editStartDate, setEditStartDate] = useState("")
  const [editDueDate, setEditDueDate] = useState("")

  const addTask = () => {
    const label = newTaskLabel.trim()
    if (!label) return
    addTodo(label, startDate, dueDate, progress)
    setNewTaskLabel("")
    setStartDate("")
    setDueDate("")
    setProgress(0)
  }

  const startEditTodo = (
    id: string,
    label: string,
    start: string,
    due: string
  ) => {
    setEditingId(id)
    setEditLabel(label)
    setEditStartDate(start || "")
    setEditDueDate(due || "")
  }

  const commitEditTodo = useCallback(() => {
    if (!editingId) return
    const label = editLabel.trim()
    if (!label) {
      setEditingId(null)
      return
    }
    const currentTodo = todos?.find((t) => t.id === editingId)
    updateTodo(editingId, {
      label,
      startDate: editStartDate,
      dueDate: editDueDate,
      progress: currentTodo?.progress,
    })
    setEditingId(null)
  }, [editLabel, editStartDate, editDueDate, editingId, todos, updateTodo])

  const isOverdue = (dateStr?: string, isDone?: boolean) => {
    if (!dateStr || isDone) return false
    const today = new Date().toISOString().split("T")[0]
    return dateStr < today
  }

  const completedCount = todos.filter((t) => t.done).length

  return (
    <article className="flex min-h-0 flex-col rounded-[1.75rem] bg-card p-6 shadow-md ring-1 ring-border/40 lg:p-7">
      <div className="mb-6 flex shrink-0 items-center justify-between gap-3">
        <h2 className={dashboardSectionLabelClassName}>Focus items</h2>
        {completedCount > 0 && (
          <button
            type="button"
            onClick={clearCompletedTodos}
            className="rounded-lg border border-border/60 bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:text-destructive"
          >
            Clear completed ({completedCount})
          </button>
        )}
      </div>

      {todos && todos.length > 0 && (
        <div className="mb-3 grid grid-cols-12 items-center gap-2 border-b border-border/30 px-4 pb-2 text-xs font-bold tracking-wider text-muted-foreground/80 uppercase">
          <div className="col-span-5">Task Name</div>
          <div className="col-span-4 text-center">Timeline</div>
          <div className="col-span-3 text-center">Progress Adjust</div>
        </div>
      )}

      <div
        className={cn(
          "min-h-0 flex-1",
          todos && todos.length > 3 && "max-h-64 overflow-y-auto pr-1"
        )}
      >
        {!todos || todos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No focus items yet. Add a task below to get started.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {todos.map((todo) => {
              if (!todo) return null
              return (
                <TaskItem
                  key={todo.id}
                  todo={todo}
                  isEditing={editingId === todo.id}
                  editLabel={editLabel}
                  editStartDate={editStartDate}
                  editDueDate={editDueDate}
                  currentVal={todo.done ? 100 : todo.progress || 0}
                  overdue={isOverdue(todo.dueDate, todo.done)}
                  setEditLabel={setEditLabel}
                  setEditStartDate={setEditStartDate}
                  setEditDueDate={setEditDueDate}
                  onToggle={() => toggleTodo(todo.id)}
                  onDelete={() => deleteTodo(todo.id)}
                  onStartEdit={() =>
                    startEditTodo(
                      todo.id,
                      todo.label,
                      todo.startDate || "",
                      todo.dueDate || ""
                    )
                  }
                  onCancelEdit={() => setEditingId(null)}
                  onCommitEdit={commitEditTodo}
                  onDecrement={() =>
                    updateTodo(todo.id, {
                      progress: Math.max((todo.progress || 0) - 10, 0),
                    })
                  }
                  onIncrement={() =>
                    updateTodo(todo.id, {
                      progress: Math.min((todo.progress || 0) + 10, 100),
                    })
                  }
                />
              )
            })}
          </ul>
        )}
      </div>

      <div className="mt-4 shrink-0 space-y-3 border-t border-border/50 pt-4">
        <input
          type="text"
          value={newTaskLabel}
          onChange={(e) => setNewTaskLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask()
          }}
          placeholder="New task title…"
          aria-label="New task title"
          className="min-w-0 flex-1 rounded-xl border border-border/80 bg-card px-3 py-2 text-sm text-card-foreground outline-none"
        />

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/30 bg-muted/40 p-2.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5 text-primary/70" />
            <label htmlFor="new-task-start-date">Start:</label>
            <input
              id="new-task-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded border border-border/60 bg-card px-1.5 py-0.5 text-xs text-foreground"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5 text-destructive/70" />
            <label htmlFor="new-task-due-date">Finish:</label>
            <input
              id="new-task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded border border-border/60 bg-card px-1.5 py-0.5 text-xs text-foreground"
            />
          </div>
          <div className="flex min-w-[10rem] flex-1 items-center justify-end gap-1.5 text-xs text-muted-foreground">
            <Percent className="size-3.5 text-primary/70" />
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value))}
              aria-label="New task progress"
              className="h-1 w-16 appearance-none rounded-lg bg-border accent-primary"
            />
            <span className="min-w-[1.5rem] text-right font-mono text-[11px]">
              {progress}%
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-primary"
            onClick={addTask}
          >
            <Plus className="size-4" strokeWidth={2.5} /> Add task
          </Button>
        </div>
      </div>
    </article>
  )
}
