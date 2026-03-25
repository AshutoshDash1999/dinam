
import { useTheme } from "@/components/theme-provider"
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
    ACCENT_OPTIONS,
    type AccentId,
} from "@/lib/theme-accent-presets"

type DashboardSettingsModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DashboardSettingsModal({
    open,
    onOpenChange,
}: DashboardSettingsModalProps) {
    const { accent, setAccent } = useTheme()

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
