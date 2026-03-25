import { Plus, Trash2 } from "lucide-react"
import { type Dispatch, type SetStateAction } from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { QuickLaunchIconKey } from "@/data/dashboard-mock"

const MAX_QUICK_LAUNCH_LINKS = 8

export type QuickLaunchDraftSlot = {
    id?: string
    name: string
    href: string
    icon?: QuickLaunchIconKey
}

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
    const removeSlot = (index: number) => {
        onDraftChange((prev) => prev.filter((_, i) => i !== index))
    }

    const addSlot = () => {
        onDraftChange((prev) => {
            if (prev.length >= MAX_QUICK_LAUNCH_LINKS) return prev
            return [...prev, { name: "", href: "" }]
        })
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) onClose()
            }}
        >
            <DialogContent
                className="max-h-[min(90vh,32rem)] gap-0 overflow-hidden sm:max-w-md"
                showCloseButton
            >
                <DialogHeader>
                    <DialogTitle>Edit quick links</DialogTitle>
                    <DialogDescription>
                        Add a name and URL for each shortcut. Remove rows you
                        don&apos;t need (up to {MAX_QUICK_LAUNCH_LINKS} links).
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 max-h-[min(50vh,20rem)] space-y-3 overflow-y-auto pr-1">
                    {draft.map((slot, index) => (
                        <div
                            key={slot.id ?? `draft-${index}`}
                            className="flex flex-col gap-2 sm:flex-row sm:items-end"
                        >
                            <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label
                                        className="sr-only"
                                        htmlFor={`ql-name-${index}`}
                                    >
                                        Link {index + 1} name
                                    </label>
                                    <Input
                                        id={`ql-name-${index}`}
                                        type="text"
                                        value={slot.name}
                                        onChange={(e) =>
                                            onDraftChange((prev) =>
                                                prev.map((s, i) =>
                                                    i === index
                                                        ? {
                                                              ...s,
                                                              name: e.target
                                                                  .value,
                                                          }
                                                        : s,
                                                ),
                                            )
                                        }
                                        placeholder="Name"
                                        className="rounded-xl"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label
                                        className="sr-only"
                                        htmlFor={`ql-href-${index}`}
                                    >
                                        Link {index + 1} URL
                                    </label>
                                    <Input
                                        id={`ql-href-${index}`}
                                        type="url"
                                        value={slot.href}
                                        onChange={(e) =>
                                            onDraftChange((prev) =>
                                                prev.map((s, i) =>
                                                    i === index
                                                        ? {
                                                              ...s,
                                                              href: e.target
                                                                  .value,
                                                          }
                                                        : s,
                                                ),
                                            )
                                        }
                                        placeholder="https://…"
                                        className="rounded-xl"
                                    />
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="shrink-0 text-muted-foreground hover:text-destructive"
                                onClick={() => removeSlot(index)}
                                aria-label={`Remove link ${index + 1}`}
                            >
                                <Trash2 className="size-4" strokeWidth={2} />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="mt-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 sm:w-auto"
                        onClick={addSlot}
                        disabled={draft.length >= MAX_QUICK_LAUNCH_LINKS}
                    >
                        <Plus className="size-4" strokeWidth={2} />
                        Add link
                    </Button>
                </div>
                <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={onSave}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export { MAX_QUICK_LAUNCH_LINKS }
