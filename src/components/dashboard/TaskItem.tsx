"use client"

import { Check, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  type DashboardTodo,
  useDashboardState,
} from "@/context/dashboard-state"

interface TaskItemProps {
  todo: DashboardTodo
}

export function TaskItem({ todo }: TaskItemProps) {
  const { toggleTodo, deleteTodo, updateTodo } = useDashboardState()
  const [isEditing, setIsEditing] = useState(false)
  const [editLabel, setEditLabel] = useState("")

  const startEdit = () => {
    setEditLabel(todo.label)
    setIsEditing(true)
  }

  const commitEdit = () => {
    const label = editLabel.trim()
    if (label) updateTodo(todo.id, { label })
    setIsEditing(false)
  }

  const cancelEdit = () => setIsEditing(false)

  return (
    <li className="group/task flex flex-col gap-2 rounded-xl border border-border/30 bg-muted/20 p-3.5 transition-colors hover:bg-muted/40">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => toggleTodo(todo.id)}
          disabled={isEditing}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            todo.done
              ? "border-primary bg-primary text-primary-foreground"
              : "border-primary/35 bg-transparent",
            isEditing && "pointer-events-none opacity-40"
          )}
        >
          {todo.done ? <Check className="size-3" strokeWidth={3} /> : null}
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit()
              if (e.key === "Escape") cancelEdit()
            }}
            aria-label="Edit task title"
            className="min-w-0 flex-1 rounded-lg border border-border bg-card px-3 py-1 text-sm font-medium text-card-foreground outline-none focus:border-primary"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => toggleTodo(todo.id)}
            className={cn(
              "min-w-0 flex-1 truncate text-left text-sm",
              todo.done
                ? "text-muted-foreground line-through"
                : "font-medium text-card-foreground"
            )}
          >
            {todo.label}
          </button>
        )}

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover/task:opacity-100">
          {isEditing ? (
            <>
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground"
                onClick={commitEdit}
              >
                <Check className="size-3" strokeWidth={3} /> Save
              </button>
              <button
                type="button"
                className="rounded-lg px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                onClick={startEdit}
              >
                <Pencil className="size-3" />
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={() => deleteTodo(todo.id)}
              >
                <Trash2 className="size-3" />
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  )
}
