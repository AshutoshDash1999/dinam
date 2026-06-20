"use client"

import { CheckSquare, Plus } from "lucide-react"
import { useRef, useState } from "react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDashboardState } from "@/context/dashboard-state"

import { TaskItem } from "./TaskItem"

export function TasksSection() {
  const {
    todos = [],
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompletedTodos,
  } = useDashboardState()
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
  const pending = todos.filter((t) => !t.done)
  const done = todos.filter((t) => t.done)

  return (
    <article className="glass-card flex min-h-0 flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className={dashboardSectionLabelClassName}>Focus Items</h2>
          {todos.length > 0 && (
            <span className="text-[0.6rem] font-bold text-muted-foreground/40 tabular-nums">
              {completedCount}/{todos.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {completedCount > 0 && (
            <button
              type="button"
              onClick={clearCompletedTodos}
              className="text-[0.6rem] font-bold tracking-widest text-muted-foreground/40 uppercase transition-colors hover:text-destructive"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {todos.length > 0 && (
        <Progress
          value={Math.round((completedCount / todos.length) * 100)}
          className="mb-4 h-0.5"
        />
      )}

      <ScrollArea className="min-h-0 flex-1 pr-1">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6 opacity-40">
            <CheckSquare className="size-8 stroke-[1.5]" />
            <p className="text-xs font-medium">No focus items yet</p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <ul className="flex flex-col gap-1">
                {pending.map((todo) => (
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

            {done.length > 0 && (
              <div className="mt-3">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-[0.6rem] font-bold tracking-widest text-muted-foreground/30 uppercase">
                    Done
                  </span>
                  <div className="h-px flex-1 bg-border/40" />
                </div>
                <ul className="mb-2 flex flex-col gap-1 opacity-60">
                  {done.map((todo) => (
                    <TaskItem
                      key={todo.id}
                      todo={todo}
                      onToggle={() => toggleTodo(todo.id)}
                      onDelete={() => deleteTodo(todo.id)}
                      onUpdate={(label) => updateTodo(todo.id, { label })}
                    />
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </ScrollArea>

      <div className="mt-4 shrink-0 border-t border-border/50 pt-4">
        <div className="flex items-center gap-2">
          <Input
            data-testid="task-input"
            ref={taskInputRef}
            type="text"
            value={newTaskLabel}
            onChange={(e) => setNewTaskLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask()
            }}
            placeholder="New task title…"
            className="min-w-0 flex-1"
          />
          <Button
            data-testid="add-task-btn"
            type="button"
            onClick={addTask}
            disabled={!newTaskLabel.trim()}
            className="h-9 shrink-0 rounded-xl border border-white/5 bg-white/5 px-4 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-white/10 active:scale-95 disabled:opacity-40"
          >
            <Plus className="mr-1 size-3.5" strokeWidth={3} />
            Add
          </Button>
        </div>
      </div>
    </article>
  )
}
