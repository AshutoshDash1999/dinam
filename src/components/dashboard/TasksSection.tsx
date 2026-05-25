"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { useDashboardState } from "@/context/dashboard-state"
import { Button } from "@/components/ui/button"
import { TaskItem } from "./TaskItem"
import { cn } from "@/lib/utils"

export function TasksSection() {
  const { todos = [], addTodo, clearCompletedTodos } = useDashboardState()
  const [newTaskLabel, setNewTaskLabel] = useState("")

  const addTask = () => {
    const label = newTaskLabel.trim()
    if (!label) return
    addTodo(label)
    setNewTaskLabel("")
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
              return <TaskItem key={todo.id} todo={todo} />
            })}
          </ul>
        )}
      </div>

      <div className="mt-4 shrink-0 border-t border-border/50 pt-4">
        <div className="flex items-center gap-2">
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-primary"
            onClick={addTask}
          >
            <Plus className="size-4" strokeWidth={2.5} /> Add
          </Button>
        </div>
      </div>
    </article>
  )
}
