import { Check, Pencil, Plus, Trash2 } from "lucide-react"
import { useCallback, useRef, useState } from "react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { Button } from "@/components/ui/button"
import { MOCK_TODOS, type TodoMock } from "@/data/dashboard-mock"
import { cn } from "@/lib/utils"

function newTodoId() {
    return `t-${crypto.randomUUID()}`
}

export function TasksSection() {
    const [todos, setTodos] = useState<TodoMock[]>(MOCK_TODOS)
    const [newTaskLabel, setNewTaskLabel] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editLabel, setEditLabel] = useState("")
    const skipEditCommitOnBlur = useRef(false)

    const toggleTodo = (id: string) => {
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        )
    }

    const addTask = () => {
        const label = newTaskLabel.trim()
        if (!label) return
        setTodos((prev) => [...prev, { id: newTodoId(), label, done: false }])
        setNewTaskLabel("")
    }

    const deleteTodo = (id: string) => {
        setTodos((prev) => prev.filter((t) => t.id !== id))
        setEditingId((cur) => (cur === id ? null : cur))
    }

    const startEditTodo = (id: string, label: string) => {
        setEditingId(id)
        setEditLabel(label)
    }

    const commitEditTodo = useCallback(() => {
        const id = editingId
        if (!id) return
        const label = editLabel.trim()
        if (!label) {
            setEditingId(null)
            return
        }
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, label } : t)),
        )
        setEditingId(null)
    }, [editLabel, editingId])

    const onEditTodoBlur = () => {
        if (skipEditCommitOnBlur.current) {
            skipEditCommitOnBlur.current = false
            return
        }
        commitEditTodo()
    }

    return (
        <article className="flex min-h-0 flex-col rounded-[1.75rem] bg-card p-6 shadow-md ring-1 ring-border/40 lg:p-7">
            <div className="mb-6 flex shrink-0 items-center justify-between gap-3">
                <h2 className={dashboardSectionLabelClassName}>Focus items</h2>
            </div>
            <div
                className={cn(
                    "min-h-0 flex-1",
                    todos.length > 3 && "max-h-56 overflow-y-auto pr-1",
                )}
            >
                <ul className="flex flex-col gap-4">
                    {todos.map((todo) => (
                        <li key={todo.id}>
                            <div className="group/task flex items-start gap-2 rounded-xl transition-colors hover:bg-muted/80">
                                <button
                                    type="button"
                                    onClick={() => toggleTodo(todo.id)}
                                    className={cn(
                                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                        todo.done
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-primary/35 bg-transparent",
                                    )}
                                    aria-label={
                                        todo.done
                                            ? "Mark as not done"
                                            : "Mark as done"
                                    }
                                >
                                    {todo.done ? (
                                        <Check
                                            className="size-3"
                                            strokeWidth={3}
                                            aria-hidden
                                        />
                                    ) : null}
                                </button>
                                {editingId === todo.id ? (
                                    <input
                                        type="text"
                                        value={editLabel}
                                        onChange={(e) =>
                                            setEditLabel(e.target.value)
                                        }
                                        onBlur={onEditTodoBlur}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.currentTarget.blur()
                                            }
                                            if (e.key === "Escape") {
                                                skipEditCommitOnBlur.current = true
                                                setEditingId(null)
                                            }
                                        }}
                                        className="min-w-0 flex-1 rounded-lg border border-border bg-card px-2 py-1 text-base leading-snug font-medium text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                                        autoFocus
                                        aria-label="Edit task"
                                    />
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => toggleTodo(todo.id)}
                                        className={cn(
                                            "min-w-0 flex-1 cursor-pointer py-0.5 text-left text-base leading-snug",
                                            todo.done
                                                ? "text-muted-foreground line-through"
                                                : "font-medium text-card-foreground",
                                        )}
                                    >
                                        {todo.label}
                                    </button>
                                )}
                                <div
                                    className={cn(
                                        "flex shrink-0 items-center gap-0.5 transition-opacity",
                                        editingId === todo.id
                                            ? "opacity-100"
                                            : "opacity-0 group-hover/task:opacity-100 focus-within:opacity-100",
                                    )}
                                >
                                    <button
                                        type="button"
                                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                                        aria-label="Edit task"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (editingId === todo.id) {
                                                setEditingId(null)
                                            } else {
                                                startEditTodo(todo.id, todo.label)
                                            }
                                        }}
                                    >
                                        <Pencil
                                            className="size-4"
                                            strokeWidth={2}
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                        aria-label="Delete task"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            deleteTodo(todo.id)
                                        }}
                                    >
                                        <Trash2
                                            className="size-4"
                                            strokeWidth={2}
                                        />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4 shrink-0 border-t border-border/50 pt-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                        type="text"
                        value={newTaskLabel}
                        onChange={(e) => setNewTaskLabel(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") addTask()
                        }}
                        placeholder="New task…"
                        className="min-w-0 flex-1 rounded-xl border border-border/80 bg-card px-3 py-2 text-sm text-card-foreground outline-none placeholder:text-muted-foreground focus-visible:border-input focus-visible:ring-2 focus-visible:ring-ring/25"
                        aria-label="New task"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        className="gap-2 text-primary hover:text-primary"
                        onClick={addTask}
                    >
                        <Plus className="size-5" strokeWidth={2.5} />
                        Add task
                    </Button>
                </div>
            </div>
        </article>
    )
}
