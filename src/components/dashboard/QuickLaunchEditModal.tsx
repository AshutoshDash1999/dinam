import { PlusIcon } from "@/components/animated-icons/plus-icon"
// Note: We can reuse  existing TrashIcon from earlier or standard fallback, assuming TrashIcon is locally defined:
import { TrashIcon } from "@/components/animated-icons/trash-icon"
import { type Dispatch, type SetStateAction, useState } from "react"

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

const MAX_QUICK_LAUNCH_LINKS = 8

export type QuickLaunchDraftSlot = {
  id?: string
  title: string
  url: string
  description?: string
  favicon?: string
}

type QuickLaunchEditModalProps = {
  open: boolean
  draft: QuickLaunchDraftSlot[]
  onDraftChange: Dispatch<SetStateAction<QuickLaunchDraftSlot[]>>
  onClose: () => void
  onSave: () => void
  isSaving?: boolean
}

export function QuickLaunchEditModal({
  open,
  draft,
  onDraftChange,
  onClose,
  onSave,
  isSaving,
}: QuickLaunchEditModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const removeSlot = (index: number) => {
    onDraftChange((prev) => prev.filter((_, i) => i !== index))
  }

  const addSlot = () => {
    onDraftChange((prev) => {
      if (prev.length >= MAX_QUICK_LAUNCH_LINKS) return prev
      return [...prev, { title: "", url: "" }]
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setErrorMessage(null)
          onClose()
        }
      }}
    >
      <DialogContent
        className="max-h-[min(90vh,32rem)] gap-0 overflow-hidden sm:max-w-md"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>Edit quick links</DialogTitle>
          <DialogDescription>
            Add a name and URL for each shortcut. Remove rows you don&apos;t
            need (up to {MAX_QUICK_LAUNCH_LINKS} links).
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
                  <label className="sr-only" htmlFor={`ql-title-${index}`}>
                    Link {index + 1} title
                  </label>
                  <Input
                    id={`ql-title-${index}`}
                    type="text"
                    value={slot.title}
                    onChange={(e) => {
                      setErrorMessage(null)
                      onDraftChange((prev) =>
                        prev.map((s, i) =>
                          i === index
                            ? {
                                ...s,
                                title: e.target.value,
                              }
                            : s
                        )
                      )
                    }}
                    placeholder="Title"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="sr-only" htmlFor={`ql-url-${index}`}>
                    Link {index + 1} URL
                  </label>
                  <Input
                    id={`ql-url-${index}`}
                    type="url"
                    value={slot.url}
                    onChange={(e) => {
                      setErrorMessage(null)
                      onDraftChange((prev) =>
                        prev.map((s, i) =>
                          i === index
                            ? {
                                ...s,
                                url: e.target.value,
                              }
                            : s
                        )
                      )
                    }}
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
                <TrashIcon
                  size={16}
                  className="transition-colors group-hover:text-destructive"
                />
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
            <PlusIcon size={16} className="text-foreground" />
            Add link
          </Button>
        </div>
        {errorMessage ? (
          <div className="mt-2 text-sm font-medium text-destructive">
            {errorMessage}
          </div>
        ) : null}
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setErrorMessage(null)
              onClose()
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              const urls = new Set<string>()
              for (const slot of draft) {
                const t = slot.title.trim()
                const u = slot.url.trim().toLowerCase()

                // Ignore completely empty slots (they are just deleted on save)
                if (!t && (!u || u === "#")) continue

                // Check if they forgot the URL
                if (!u || u === "#") {
                  setErrorMessage("Please provide a URL for all shortcuts.")
                  return
                }

                if (urls.has(u)) {
                  setErrorMessage(
                    "This link has already been added to your dashboard."
                  )
                  return
                }
                urls.add(u)
              }
              setErrorMessage(null)
              onSave()
            }}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { MAX_QUICK_LAUNCH_LINKS }
