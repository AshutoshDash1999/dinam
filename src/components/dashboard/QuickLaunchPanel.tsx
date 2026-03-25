import { SquarePen } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    QUICK_LAUNCH_ICON_POOL,
    MOCK_QUICK_LAUNCH,
    type QuickLaunchItem,
} from "@/data/dashboard-mock"

import {
    QuickLaunchEditModal,
    type QuickLaunchDraftSlot,
} from "./QuickLaunchEditModal"
import { QuickLaunchIcon } from "./QuickLaunchIcon"

function normalizeHref(raw: string): string {
    let href = raw.trim()
    if (!href) return "#"
    if (
        !href.startsWith("http://") &&
        !href.startsWith("https://") &&
        href !== "#"
    ) {
        href = `https://${href}`
    }
    return href
}

function fallbackNameFromHref(href: string): string {
    if (href === "#") return "Link"
    try {
        const u = new URL(href)
        return u.hostname.replace(/^www\./, "") || "Link"
    } catch {
        return "Link"
    }
}

function draftToItems(draft: QuickLaunchDraftSlot[]): QuickLaunchItem[] {
    const next: QuickLaunchItem[] = []
    for (const slot of draft) {
        const nameRaw = slot.name.trim()
        const hrefRaw = slot.href.trim()
        if (!nameRaw && !hrefRaw) continue
        const href = normalizeHref(hrefRaw)
        if (!nameRaw && href === "#") continue
        const name = nameRaw || fallbackNameFromHref(href)
        const icon =
            slot.icon ??
            QUICK_LAUNCH_ICON_POOL[next.length % QUICK_LAUNCH_ICON_POOL.length]!
        next.push({
            id: slot.id ?? `q-${crypto.randomUUID()}`,
            name,
            href,
            icon,
        })
    }
    return next
}

export function QuickLaunchPanel() {
    const [items, setItems] = useState<QuickLaunchItem[]>(MOCK_QUICK_LAUNCH)
    const [modalOpen, setModalOpen] = useState(false)
    const [draft, setDraft] = useState<QuickLaunchDraftSlot[]>(() =>
        MOCK_QUICK_LAUNCH.map((item) => ({
            id: item.id,
            name: item.name,
            href: item.href === "#" ? "" : item.href,
            icon: item.icon,
        })),
    )

    const openModal = () => {
        setDraft(
            items.length > 0
                ? items.map((item) => ({
                      id: item.id,
                      name: item.name,
                      href: item.href === "#" ? "" : item.href,
                      icon: item.icon,
                  }))
                : [{ name: "", href: "" }],
        )
        setModalOpen(true)
    }

    const save = () => {
        setItems(draftToItems(draft))
        setModalOpen(false)
    }

    return (
        <>
            <article className="rounded-2xl bg-card p-6 shadow-md ring-1 ring-border/40 lg:p-7">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-[0.6875rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                        Jump back in
                    </h2>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={openModal}
                                className="text-muted-foreground"
                                aria-label="Edit quick launch links"
                            >
                                <SquarePen className="size-4" strokeWidth={2} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" sideOffset={6}>
                            Edit quick links
                        </TooltipContent>
                    </Tooltip>
                </div>
                {items.length === 0 ? (
                    <p className="mt-6 text-sm text-muted-foreground">
                        No shortcuts yet.{" "}
                        <button
                            type="button"
                            className="font-medium text-primary underline-offset-2 hover:underline"
                            onClick={openModal}
                        >
                            Add links
                        </button>
                    </p>
                ) : (
                    <div className="mt-6 grid grid-cols-4 gap-3 sm:gap-4">
                        {items.map((item) => (
                            <Tooltip key={item.id}>
                                <TooltipTrigger asChild>
                                    <a
                                        href={item.href}
                                        {...(item.href.startsWith("http")
                                            ? {
                                                  target: "_blank",
                                                  rel: "noreferrer noopener",
                                              }
                                            : {})}
                                        className="group flex flex-col items-center outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                                        aria-label={item.name}
                                    >
                                        <span className="flex size-13 items-center justify-center rounded-xl bg-card shadow-sm ring-1 ring-border/50 transition group-hover:shadow-md sm:size-14">
                                            <QuickLaunchIcon item={item} />
                                        </span>
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" sideOffset={6}>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-medium">
                                            {item.name}
                                        </span>
                                        {item.href !== "#" ? (
                                            <span className="max-w-56 truncate text-[0.65rem] opacity-80">
                                                {item.href}
                                            </span>
                                        ) : null}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                )}
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
