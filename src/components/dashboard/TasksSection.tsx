"use client"

import { Plus } from "lucide-react"
import { useRef, useState } from "react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { Button } from "@/components/ui/button"
import { useDashboardState } from "@/context/dashboard-state"

import { TaskItem } from "./TaskItem"

export function TasksSection() {
  const { todos = [], addTodo, toggleTodo, updateTodo, deleteTodo, clearCompletedTodos } = useDashboardState()
  const [newTaskLabel, setNewTaskLabel] = useState("")
  const taskInputRef = useRef<HTMLInputElement | null>(null)

  const addTask = () => {
    const label = newTaskLabel.trim()

    if (!label) return
    addTodo(label, "", "", 0)
    setNewTaskLabel("")
    taskInputRef.current?.focus()
  }

  const completedCount = todos.filter((t) => t.done).length

  return (
    <article className="glass-card flex min-h-0 flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className={dashboardSectionLabelClassName}>Focus Items</h2>
        <div className="flex items-center gap-1">
          {completedCount > 0 && (
            <button
              type="button"
              onClick={clearCompletedTodos}
              className="mr-2 text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/40 transition-colors hover:text-destructive"
            >
              Clear ({completedCount})
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 transition-all">
        {!todos || todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-2 opacity-40">
            <p className="text-xs font-medium">No focus items yet...</p>
          </div>
        ) : (
          <ul className="mb-4 flex flex-col gap-1">
            {todos.map((todo) => (
              <TaskItem
                key={todo.id}
                todo={todo}
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
                onUpdate={(label) => updateTodo(todo.id, { label })}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 shrink-0 space-y-3 border-t border-border/50 pt-4">
        <input
          ref={taskInputRef}
          type="text"
          value={newTaskLabel}
          onChange={(e) => setNewTaskLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask()
          }}
          placeholder="New task title…"
          className="min-w-0 flex-1 rounded-xl border border-border/80 bg-card px-3 py-2 text-sm text-card-foreground outline-none"
        />

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/30 bg-muted/40 p-2.5">
          <Button
            data-testid="add-task-btn"
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-primary"
            onClick={addTask}
          >
            <Plus className="size-4" strokeWidth={2.5} /> Add
          </Button>
        </div>
        <Button
          type="button"
          onClick={addTask}
          className="h-9 rounded-xl border border-white/5 bg-white/5 px-4 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-white/10 active:scale-95"
        >
          <Plus className="mr-1 size-3.5" strokeWidth={3} />
          Add task
        </Button>
      </div>
    </article>
  )
}