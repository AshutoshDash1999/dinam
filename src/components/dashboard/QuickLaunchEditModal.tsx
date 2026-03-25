import { useEffect, type Dispatch, type SetStateAction } from "react"

import { Button } from "@/components/ui/button"

const QUICK_LAUNCH_SLOTS = 6

export type QuickLaunchDraftSlot = { name: string; href: string }

type QuickLaunchEditModalProps = {
    open: boolean
    draft: QuickLaunchDraftSlot[]
    onDraftChange: Dispatch<SetStateAction<QuickLaunchDraftSlot[]>>
    onClose: () => void
    onSave: () => void
}

export function QuickLaunchEditModal({
    open,
    draft,
    onDraftChange,
    onClose,
    onSave,
}: QuickLaunchEditModalProps) {
    useEffect(() => {
        if (!open) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="presentation"
        >
            <button
                type="button"
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
                aria-label="Close dialog"
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="quick-launch-edit-title"
                className="relative z-10 w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <h3
                    id="quick-launch-edit-title"
                    className="text-lg font-bold text-card-foreground"
                >
                    Edit quick links
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Set a name and URL for each shortcut (up to{" "}
                    {QUICK_LAUNCH_SLOTS}).
                </p>
                <div className="mt-5 max-h-[min(60vh,22rem)] space-y-3 overflow-y-auto pr-1">
                    {draft.map((slot, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                        >
                            <label
                                className="sr-only"
                                htmlFor={`ql-name-${index}`}
                            >
                                Link {index + 1} name
                            </label>
                            <input
                                id={`ql-name-${index}`}
                                type="text"
                                value={slot.name}
                                onChange={(e) =>
                                    onDraftChange((prev) =>
                                        prev.map((s, i) =>
                                            i === index
                                                ? { ...s, name: e.target.value }
                                                : s,
                                        ),
                                    )
                                }
                                placeholder={`Name ${index + 1}`}
                                className="rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/25"
                            />
                            <label
                                className="sr-only"
                                htmlFor={`ql-href-${index}`}
                            >
                                Link {index + 1} URL
                            </label>
                            <input
                                id={`ql-href-${index}`}
                                type="url"
                                value={slot.href}
                                onChange={(e) =>
                                    onDraftChange((prev) =>
                                        prev.map((s, i) =>
                                            i === index
                                                ? { ...s, href: e.target.value }
                                                : s,
                                        ),
                                    )
                                }
                                placeholder="https://…"
                                className="rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/25"
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex flex-wrap justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={onSave}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}

export { QUICK_LAUNCH_SLOTS }
