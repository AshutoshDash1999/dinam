import { SquarePen } from "lucide-react"
import { useState } from "react"

import {
    MOCK_QUICK_LAUNCH,
    type QuickLaunchItem,
} from "@/data/dashboard-mock"

import {
    QUICK_LAUNCH_SLOTS,
    QuickLaunchEditModal,
    type QuickLaunchDraftSlot,
} from "./QuickLaunchEditModal"
import { QuickLaunchIcon } from "./QuickLaunchIcon"

export function QuickLaunchPanel() {
    const [items, setItems] = useState<QuickLaunchItem[]>(MOCK_QUICK_LAUNCH)
    const [modalOpen, setModalOpen] = useState(false)
    const [draft, setDraft] = useState<QuickLaunchDraftSlot[]>(() =>
        MOCK_QUICK_LAUNCH.map((item) => ({
            name: item.name,
            href: item.href,
        })),
    )

    const openModal = () => {
        setDraft(() => {
            const next = items.map((item) => ({
                name: item.name,
                href: item.href,
            }))
            while (next.length < QUICK_LAUNCH_SLOTS) {
                next.push({ name: "", href: "" })
            }
            return next.slice(0, QUICK_LAUNCH_SLOTS)
        })
        setModalOpen(true)
    }

    const save = () => {
        setItems((prev) =>
            prev.map((item, i) => {
                const slot = draft[i]
                if (!slot) return item
                const name = slot.name.trim() || item.name
                let href = slot.href.trim()
                if (!href) href = "#"
                if (
                    !href.startsWith("http://") &&
                    !href.startsWith("https://") &&
                    href !== "#"
                ) {
                    href = `https://${href}`
                }
                return { ...item, name, href }
            }),
        )
        setModalOpen(false)
    }

    return (
        <>
            <article className="rounded-3xl bg-card p-7">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-bold text-muted-foreground">
                        Quick Launch
                    </h2>
                    <button
                        type="button"
                        onClick={openModal}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                        aria-label="Edit quick launch links"
                    >
                        <SquarePen className="size-4" strokeWidth={2} />
                    </button>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6">
                    {items.map((item) => (
                        <a
                            key={item.id}
                            href={item.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="group flex flex-col items-center gap-2 rounded-xl pb-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                        >
                            <span className="flex size-14 items-center justify-center rounded-full bg-card shadow-sm transition group-hover:shadow-md">
                                <QuickLaunchIcon item={item} />
                            </span>
                            <span className="text-xs font-medium text-muted-foreground">
                                {item.name}
                            </span>
                        </a>
                    ))}
                </div>
            </article>

            <QuickLaunchEditModal
                open={modalOpen}
                draft={draft}
                onDraftChange={setDraft}
                onClose={() => setModalOpen(false)}
                onSave={save}
            />
        </>
    )
}
