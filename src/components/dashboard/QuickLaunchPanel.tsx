import { SquarePenIcon } from "@/components/animated-icons/square-pen-icon"
import { useState } from "react"

import { dashboardSectionLabelClassName } from "@/components/dashboard/dashboard-section-label-classes"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Globe, MoreHorizontal } from "lucide-react"
import { fetchQuickLinkMetadata, normalizeUrl } from "@/lib/quick-link-metadata"
import { sanitizeUrl } from "@/lib/sanitizeUrl"
import {
  useDashboardState,
  type QuickLaunchItem,
} from "@/context/dashboard-state"

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
      <article className="glass-card p-6">
        <div className="flex items-center justify-between">
          <h2 className={dashboardSectionLabelClassName}>Jump Back In</h2>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={openModal}
                  className="text-muted-foreground/50 hover:text-foreground"
                  aria-label="Edit quick launch links"
                >
                  <SquarePenIcon size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Edit</TooltipContent>
            </Tooltip>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground/50 hover:text-foreground"
            >
              <MoreHorizontal size={14} />
            </Button>
          </div>
        </div>

        {quickLaunchItems.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground/60 text-center pb-4">
            No shortcuts yet.{" "}
            <button
              type="button"
              className="font-medium text-foreground underline-offset-4 hover:underline"
              onClick={openModal}
            >
              Add links
            </button>
          </p>
        ) : (
          <div className="mt-8 flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-8 w-full">
              {quickLaunchItems.slice(0, 7).map((item) => (
                <a
                  key={item.id}
                  href={sanitizeUrl(item.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shortcut-btn group"
                >
                  <div className="icon-square shadow-xl group-hover:shadow-white/10 transition-shadow">
                    {item.favicon ? (
                      <img src={item.favicon} alt="" />
                    ) : (
                      <Globe className="size-6 text-black/50" />
                    )}
                  </div>
                  <span className="truncate max-w-[64px] group-hover:text-foreground transition-colors">
                    {item.title}
                  </span>
                </a>
              ))}
            </div>

            {quickLaunchItems.length > 4 && (
              <div className="mt-8 flex gap-1.5">
                <div className="size-1.5 rounded-full bg-foreground" />
                <div className="size-1.5 rounded-full bg-foreground/20" />
              </div>
            )}
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
