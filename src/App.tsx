import { useState } from "react"

import { AssistantPanel } from "@/components/dashboard/AssistantPanel"
import { BookmarksSection } from "@/components/dashboard/BookmarksSection"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { QuickLaunchPanel } from "@/components/dashboard/QuickLaunchPanel"
import { TasksSection } from "@/components/dashboard/TasksSection"
import { TechNewsSection } from "@/components/dashboard/TechNewsSection"
import { ScratchpadSection } from "@/components/dashboard/ScratchpadSection"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const App = () => {
  const { dashboardWallpaper } = useTheme()
  const [assistantOpen, setAssistantOpen] = useState(false)

  return (
    <div
      className={cn(
        "relative min-h-dvh font-sans text-foreground",
        !dashboardWallpaper &&
          "bg-linear-to-b from-muted via-muted to-background"
      )}
    >
      {dashboardWallpaper ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${dashboardWallpaper})`,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 bg-linear-to-b from-background/88 via-background/76 to-background/92"
          />
        </>
      ) : null}
      <div className="relative z-0 mx-auto w-full max-w-dashboard px-8 pt-6 pb-10 lg:px-10 lg:pb-12">
        <DashboardHeader onOpenAssistant={() => setAssistantOpen(true)} />

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-8 lg:col-span-4">
            <QuickLaunchPanel />
            <BookmarksSection />
          </div>
          <div className="flex flex-col gap-8 lg:col-span-4">
            <div className="min-h-0 flex-1">
              <TasksSection />
            </div>
            <div className="min-h-0 flex-1">
              <ScratchpadSection />
            </div>
          </div>
          <div className="min-w-0 lg:col-span-4">
            <TechNewsSection />
          </div>
        </div>
      </div>

      <AssistantPanel open={assistantOpen} onOpenChange={setAssistantOpen} />
    </div>
  )
}

export default App
