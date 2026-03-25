import { BackgroundBlobs } from "@/components/dashboard/BackgroundBlobs"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { QuoteCard } from "@/components/dashboard/QuoteCard"
import { QuickLaunchPanel } from "@/components/dashboard/QuickLaunchPanel"
import { TasksSection } from "@/components/dashboard/TasksSection"
import { TechNewsSection } from "@/components/dashboard/TechNewsSection"

const App = () => {
    return (
        <div className="relative min-h-dvh bg-muted font-sans text-foreground">
            <BackgroundBlobs />

            <div className="relative z-10 mx-auto w-full max-w-6xl p-4">
                <DashboardHeader />

                <section className="mb-6 grid grid-cols-1 gap-6 lg:mb-8 lg:grid-cols-5 lg:gap-8">
                    <QuoteCard />
                    <TasksSection />
                </section>

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,13fr)] lg:gap-8">
                    <QuickLaunchPanel />
                    <TechNewsSection />
                </section>
            </div>
        </div>
    )
}

export default App
