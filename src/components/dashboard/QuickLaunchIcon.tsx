import {
    Calendar,
    Camera,
    FileText,
    Folder,
    Mail,
    Music,
    SquareTerminal,
} from "lucide-react"

import { type QuickLaunchItem } from "@/data/dashboard-mock"
import { cn } from "@/lib/utils"

export function QuickLaunchIcon({ item }: { item: QuickLaunchItem }) {
    const accent = item.icon === "mail"
    const common = cn(
        "size-6 shrink-0",
        accent ? "text-primary" : "text-muted-foreground",
    )
    switch (item.icon) {
        case "mail":
            return <Mail className={common} strokeWidth={2} />
        case "file":
            return <FileText className={common} strokeWidth={2} />
        case "calendar":
            return <Calendar className={common} strokeWidth={2} />
        case "terminal":
            return <SquareTerminal className={common} strokeWidth={2} />
        case "folder":
            return <Folder className={common} strokeWidth={2} />
        case "music":
            return <Music className={common} strokeWidth={2} />
        case "camera":
            return <Camera className={common} strokeWidth={2} />
        default: {
            const _exhaustive: never = item.icon
            return _exhaustive
        }
    }
}
