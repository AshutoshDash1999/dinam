
import { ImageIcon } from "lucide-react"
import { type ChangeEvent, useId, useRef, useState } from "react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DEFAULT_SEARCH_URL_TEMPLATE,
    isSearchUrlTemplateValid,
} from "@/lib/search-engine"
import {
    ACCENT_OPTIONS,
    type AccentId,
} from "@/lib/theme-accent-presets"

/** ~3 MiB — keeps data URLs within typical localStorage limits. */
const MAX_WALLPAPER_BYTES = 3 * 1024 * 1024

type DashboardSettingsModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DashboardSettingsModal({
    open,
    onOpenChange,
}: DashboardSettingsModalProps) {
    const {
        accent,
        setAccent,
        dashboardWallpaper,
        setDashboardWallpaper,
        searchUrlTemplate,
        setSearchUrlTemplate,
    } = useTheme()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const wallpaperInputId = useId()
    const [wallpaperError, setWallpaperError] = useState<string | null>(null)

    const handleWallpaperPick = () => {
        setWallpaperError(null)
        fileInputRef.current?.click()
    }

    const handleWallpaperFile = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        event.target.value = ""

        if (!file) {
            return
        }

        if (!file.type.startsWith("image/")) {
            setWallpaperError("Choose an image file.")
            return
        }

        if (file.size > MAX_WALLPAPER_BYTES) {
            setWallpaperError(
                `Image must be ${MAX_WALLPAPER_BYTES / (1024 * 1024)} MB or smaller.`
            )
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result
            if (typeof result === "string") {
                setWallpaperError(null)
                setDashboardWallpaper(result)
            }
        }
        reader.onerror = () => {
            setWallpaperError("Could not read that file.")
        }
        reader.readAsDataURL(file)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Choose how the dashboard looks. You can also toggle
                        light and dark quickly from the header.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <label
                            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
                            htmlFor={wallpaperInputId}
                        >
                            Wallpaper
                        </label>
                        <p className="text-xs text-muted-foreground">
                            Full-page background behind the dashboard. Stored in
                            this browser only.
                        </p>
                        <input
                            ref={fileInputRef}
                            id={wallpaperInputId}
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleWallpaperFile}
                        />
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="rounded-2xl border-border/80"
                                onClick={handleWallpaperPick}
                            >
                                <ImageIcon
                                    className="size-4 opacity-80"
                                    aria-hidden
                                />
                                {dashboardWallpaper
                                    ? "Replace image"
                                    : "Upload image"}
                            </Button>
                            {dashboardWallpaper ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-2xl text-muted-foreground"
                                    onClick={() => {
                                        setWallpaperError(null)
                                        setDashboardWallpaper(null)
                                    }}
                                >
                                    Remove
                                </Button>
                            ) : null}
                        </div>
                        {wallpaperError ? (
                            <p className="text-xs text-destructive">
                                {wallpaperError}
                            </p>
                        ) : null}
                        {dashboardWallpaper ? (
                            <div
                                className="mt-1 overflow-hidden rounded-2xl border border-border/60 bg-muted/40"
                                aria-hidden
                            >
                                <img
                                    src={dashboardWallpaper}
                                    alt=""
                                    className="aspect-video max-h-28 w-full object-cover"
                                />
                            </div>
                        ) : null}
                    </div>

                    <div className="grid gap-2 border-border/60 border-t pt-2">
                        <label
                            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
                            htmlFor="dashboard-search-url"
                        >
                            Search URL
                        </label>
                        <p className="text-xs text-muted-foreground">
                            Full search URL for text queries in the dashboard
                            box. Put{" "}
                            <code className="rounded bg-muted px-1 py-px text-[0.7rem]">
                                %s
                            </code>{" "}
                            where the terms go (e.g.{" "}
                            <code className="rounded bg-muted px-1 py-px text-[0.7rem]">
                                https://duckduckgo.com/?q=%s
                            </code>
                            ). Sites can’t read your browser’s default engine—use
                            the same pattern as your address bar. Not used when
                            you open a direct URL.
                        </p>
                        <Input
                            id="dashboard-search-url"
                            type="url"
                            spellCheck={false}
                            autoComplete="off"
                            value={searchUrlTemplate}
                            onChange={(e) =>
                                setSearchUrlTemplate(e.target.value)
                            }
                            placeholder={DEFAULT_SEARCH_URL_TEMPLATE}
                            className="rounded-2xl border-border/80 font-mono text-sm"
                        />
                        {!isSearchUrlTemplateValid(searchUrlTemplate) ? (
                            <p className="text-xs text-destructive">
                                Add %s for the query. Searches will use Google
                                until this is fixed.
                            </p>
                        ) : null}
                    </div>

                    <div className="grid gap-2 border-border/60 border-t pt-2">
                        <label
                            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
                            htmlFor="dashboard-accent"
                        >
                            Accent color
                        </label>
                        <p className="text-xs text-muted-foreground">
                            Uses the same semantic tokens as the rest of the app
                            (
                            <code className="rounded bg-muted px-1 py-px text-[0.7rem]">
                                bg-primary
                            </code>
                            , etc.). Neutral keeps colors from the app default
                            theme.
                        </p>
                        <Select
                            value={accent}
                            onValueChange={(value) =>
                                setAccent(value as AccentId)
                            }
                        >
                            <SelectTrigger
                                id="dashboard-accent"
                                className="w-full rounded-2xl border-border/80"
                            >
                                <SelectValue placeholder="Choose accent" />
                            </SelectTrigger>
                            <SelectContent>
                                {ACCENT_OPTIONS.map(({ id, label }) => (
                                    <SelectItem key={id} value={id}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
