import { Check, Pencil, Trash2, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { type DashboardTodo } from "@/context/dashboard-state"

interface TaskItemProps {
  todo: DashboardTodo
  isEditing: boolean
  editLabel: string
  editStartDate: string
  editDueDate: string
  currentVal: number
  overdue: boolean
  setEditLabel: (val: string) => void
  setEditStartDate: (val: string) => void
  setEditDueDate: (val: string) => void
  onToggle: () => void
  onDelete: () => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onCommitEdit: () => void
  onDecrement: () => void
  onIncrement: () => void
}

function formatTaskDate(dateStr?: string): string {
  if (!dateStr) return "—"
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return "—"
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  } catch {
    return "—"
  }
}

export function TaskItem({
  todo,
  isEditing,
  editLabel,
  editStartDate,
  editDueDate,
  currentVal,
  overdue,
  setEditLabel,
  setEditStartDate,
  setEditDueDate,
  onToggle,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onCommitEdit,
  onDecrement,
  onIncrement,
}: TaskItemProps) {
  const formattedStart = formatTaskDate(todo.startDate)
  const formattedDue = formatTaskDate(todo.dueDate)

  return (
    <li className="group/task flex flex-col gap-2.5 rounded-xl border border-border/30 bg-muted/20 p-3.5 transition-colors hover:bg-muted/40">
      {/* CORE COMPONENT GRID LAYOUT */}
      <div className="grid w-full grid-cols-12 items-center gap-2">
        {/* 1. Task Name Column (col-span-5) */}
        <div className="col-span-5 flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
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
                if (e.key === "Enter") onCommitEdit()
              }}
              aria-label="Edit task title"
              className="min-w-0 flex-1 rounded-lg border border-border bg-card px-3 py-1 text-sm font-medium text-card-foreground outline-none focus:border-primary"
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={onToggle}
              className={cn(
                "min-w-0 flex-1 truncate text-left text-sm",
                todo.done
                  ? "text-muted-foreground line-through"
                  : "font-medium text-card-foreground",
                overdue && "font-bold text-destructive"
              )}
            >
              {todo.label}
            </button>
          )}
        </div>

        {/* 2. Timeline Column (col-span-4) - CHANGED: justify-center to justify-start + pl-10 to nudge left */}
        <div
          className={cn(
            "col-span-4 flex items-center justify-start truncate px-1 pl-10 font-mono text-xs select-none",
            overdue
              ? "animate-pulse font-bold text-destructive"
              : "text-muted-foreground/90"
          )}
        >
          {isEditing ? (
            <span className="pl-2 font-sans text-[11px] text-muted-foreground italic">
              Editing timeline...
            </span>
          ) : todo.startDate || todo.dueDate ? (
            <span className="inline-flex flex-wrap items-center gap-1 text-[11px]">
              <span>{formattedStart}</span>
              <span className="mx-0.5 font-sans text-muted-foreground/50">
                →
              </span>
              <span>{formattedDue}</span>
            </span>
          ) : (
            <span className="pl-6">—</span>
          )}
        </div>

        {/* 3. Centered Progress Adjust Column (col-span-3) */}
        <div className="col-span-3 flex min-w-0 items-center justify-center">
          <div
            className={cn(
              "inline-flex items-center rounded-lg border border-border/60 bg-card p-0.5 shadow-sm",
              isEditing && "pointer-events-none opacity-40"
            )}
          >
            <button
              type="button"
              disabled={todo.done || currentVal === 0}
              onClick={onDecrement}
              className="flex size-6 items-center justify-center rounded-md font-sans text-sm font-bold text-muted-foreground hover:bg-muted"
            >
              −
            </button>
            <span className="w-12 text-center font-mono text-xs font-bold">
              {currentVal}%
            </span>
            <button
              type="button"
              disabled={todo.done || currentVal === 100}
              onClick={onIncrement}
              className="flex size-6 items-center justify-center rounded-md font-sans text-sm font-bold text-muted-foreground hover:bg-muted"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Inline Input Panel row editing block drawer */}
      {isEditing && (
        <div className="mt-1 flex flex-wrap items-center gap-4 rounded-xl border border-border/40 bg-background/50 p-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="size-3.5 text-primary/70" />
            <label htmlFor={`edit-start-date-${todo.id}`}>Start:</label>
            <input
              id={`edit-start-date-${todo.id}`}
              type="date"
              value={editStartDate}
              onChange={(e) => setEditStartDate(e.target.value)}
              className="rounded border border-border/60 bg-card px-2 py-0.5 font-mono text-xs text-foreground outline-none"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="size-3.5 text-destructive/70" />
            <label htmlFor={`edit-due-date-${todo.id}`}>Finish:</label>
            <input
              id={`edit-due-date-${todo.id}`}
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="rounded border border-border/60 bg-card px-2 py-0.5 font-mono text-xs text-foreground outline-none"
            />
          </div>
        </div>
      )}

      <div className="mt-0.5 flex items-center justify-end gap-3 border-t border-border/20 pt-2">
        {isEditing ? (
          <>
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
              onClick={onCommitEdit}
            >
              <Check className="size-3.5" strokeWidth={3} /> Save Changes
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
              onClick={onStartEdit}
            >
              <Pencil className="size-3" /> Edit Task
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="size-3" /> Delete
            </button>
          </>
        )}
      </div>
    </li>
  )
}
