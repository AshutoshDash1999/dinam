import { BookmarksSection } from "@/components/dashboard/BookmarksSection"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { QuoteCard } from "@/components/dashboard/QuoteCard"
import { QuickLaunchPanel } from "@/components/dashboard/QuickLaunchPanel"
import { TasksSection } from "@/components/dashboard/TasksSection"
import { TechNewsSection } from "@/components/dashboard/TechNewsSection"

const App = () => {
    return (
        <div className="min-h-dvh bg-linear-to-b from-muted via-muted to-background font-sans text-foreground">
            <div className="mx-auto w-full max-w-6xl px-6 pt-8 pb-10 lg:px-8 lg:pb-12">
                <DashboardHeader />

                <div className="mt-14 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
                    <div className="flex flex-col gap-6 lg:col-span-3">
                        <QuickLaunchPanel />
                        <BookmarksSection />
                    </div>
                    <div className="flex flex-col gap-6 lg:col-span-5">
                        <QuoteCard />
                        <div className="min-h-0 flex-1">
                            <TasksSection />
                        </div>
                    </div>
                    <div className="lg:col-span-4">
                        <TechNewsSection />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
