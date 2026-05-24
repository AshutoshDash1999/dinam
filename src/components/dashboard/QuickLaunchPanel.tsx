import { SquarePenIcon } from "@/components/animated-icons/square-pen-icon"
import { useState } from "react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Globe } from "lucide-react"
import { fetchQuickLinkMetadata, normalizeUrl } from "@/lib/quick-link-metadata"
import { cn } from "@/lib/utils"
import { useDashboardState } from "@/context/dashboard-state"
import type { QuickLaunchItem } from "@/data/dashboard-mock"

import {
  QuickLaunchEditModal,
  type QuickLaunchDraftSlot,
} from "./QuickLaunchEditModal"

async function draftToItems(
  draft: QuickLaunchDraftSlot[],
  existingItems: QuickLaunchItem[]
): Promise<QuickLaunchItem[]> {
  const next: QuickLaunchItem[] = []
  for (const slot of draft) {
    const titleRaw = slot.title.trim()
    const urlRaw = slot.url.trim()
    if (!titleRaw && !urlRaw) continue

    const url = normalizeUrl(urlRaw)
    if (!titleRaw && url === "#") continue

    const existing = existingItems.find((e) => e.id === slot.id)

    let title = titleRaw
    let description = slot.description
    let favicon = slot.favicon

    // If url changed or it's new, we need to fetch if title/favicon is missing
    const isUrlChanged = !existing || existing.url !== url

    if (!isUrlChanged && existing) {
      if (!title) title = existing.title
      if (!description) description = existing.description
      if (!favicon) favicon = existing.favicon
    } else if (url !== "#" && (!title || !favicon)) {
      try {
        const metadata = await fetchQuickLinkMetadata(urlRaw)
        if (!title) title = metadata.title || url
        description = metadata.description
        favicon = metadata.favicon
      } catch {
        if (!title) title = url
      }
    }

    if (!title) title = url

    next.push({
      id: slot.id ?? `q-${crypto.randomUUID()}`,
      title,
      url,
      description,
      favicon,
    })
  }
  return next
}

export function QuickLaunchPanel() {
  const { quickLaunchItems, setQuickLaunchItems } = useDashboardState()
  const [modalOpen, setModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [draft, setDraft] = useState<QuickLaunchDraftSlot[]>(() =>
    quickLaunchItems.map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url === "#" ? "" : item.url,
      description: item.description,
      favicon: item.favicon,
    }))
  )

  const openModal = () => {
    setDraft(
      quickLaunchItems.length > 0
        ? quickLaunchItems.map((item) => ({
            id: item.id,
            title: item.title,
            url: item.url === "#" ? "" : item.url,
            description: item.description,
            favicon: item.favicon,
          }))
        : [{ title: "", url: "" }]
    )
    setModalOpen(true)
  }

  const save = async () => {
    setIsSaving(true)
    try {
      const items = await draftToItems(draft, quickLaunchItems)
      setQuickLaunchItems(items)
      setModalOpen(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <article className="rounded-2xl bg-card p-6 shadow-md ring-1 ring-border/40 lg:p-7">
        <div className="flex items-center justify-between gap-2">
          <h2 className={dashboardSectionLabelClassName}>Jump back in</h2>
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
                <SquarePenIcon
                  size={16}
                  className="transition-colors group-hover:text-foreground"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              Edit quick links
            </TooltipContent>
          </Tooltip>
        </div>
        {quickLaunchItems.length === 0 ? (
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
            {quickLaunchItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <a
                    href={item.url}
                    {...(item.url.startsWith("http")
                      ? {
                          target: "_blank",
                          rel: "noreferrer noopener",
                        }
                      : {})}
                    className="group flex flex-col items-center outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    aria-label={item.title}
                  >
                    <span className="flex size-13 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border/50 transition group-hover:shadow-md sm:size-14">
                      {item.favicon ? (
                        <img
                          src={item.favicon}
                          alt=""
                          className="size-6 rounded-sm object-contain transition-opacity group-hover:opacity-90"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                            const fallback = e.currentTarget.nextElementSibling
                            if (fallback instanceof HTMLElement) {
                              fallback.style.display = "block"
                            }
                          }}
                        />
                      ) : null}
                      <Globe
                        className={cn(
                          "size-6 text-muted-foreground transition-colors group-hover:text-foreground",
                          item.favicon ? "hidden" : "block"
                        )}
                        strokeWidth={2}
                        aria-hidden
                      />
                    </span>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={6}>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{item.title}</span>
                    {item.url !== "#" ? (
                      <span className="max-w-56 truncate text-[0.65rem] opacity-80">
                        {item.url}
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
        onClose={() => !isSaving && setModalOpen(false)}
        onSave={save}
        isSaving={isSaving}
      />
    </>
  )
}
