import { useMemo } from "react"

import { cn } from "@/lib/utils"

function randomBetween(min: number, max: number) {
    return min + Math.random() * (max - min)
}

type BackgroundBlob = {
    animationClass: string
    bgClass: string
    blurClass: string
    borderRadius: string
    height: string
    left: string
    animationDelay: string
    opacity: number
    top: string
    width: string
}

function createBackgroundBlobs(): BackgroundBlob[] {
    const animations = [
        "animate-dashboard-blob-1",
        "animate-dashboard-blob-2",
        "animate-dashboard-blob-3",
    ] as const
    const bgClasses = [
        "bg-primary/35",
        "bg-chart-1/30",
        "bg-chart-2/28",
        "bg-accent/40",
    ] as const
    return Array.from({ length: 8 }, (_, i) => ({
        top: `${randomBetween(-8, 72)}%`,
        left: `${randomBetween(-12, 78)}%`,
        width: `${randomBetween(14, 32)}rem`,
        height: `${randomBetween(11, 28)}rem`,
        borderRadius: `${randomBetween(36, 48)}% ${randomBetween(40, 50)}% ${randomBetween(36, 48)}% ${randomBetween(40, 50)}%`,
        animationClass: animations[i % 3],
        bgClass: bgClasses[i % bgClasses.length],
        blurClass: i % 3 === 0 ? "blur-3xl" : "blur-2xl",
        animationDelay: `${randomBetween(0, 12)}s`,
        opacity: randomBetween(0.65, 1),
    }))
}

export function BackgroundBlobs() {
    const backgroundBlobs = useMemo(() => createBackgroundBlobs(), [])

    return (
        <div
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
            aria-hidden
        >
            {backgroundBlobs.map((blob, index) => (
                <div
                    key={index}
                    className={cn(
                        "absolute will-change-transform",
                        blob.blurClass,
                        blob.bgClass,
                        blob.animationClass,
                    )}
                    style={{
                        top: blob.top,
                        left: blob.left,
                        width: blob.width,
                        height: blob.height,
                        borderRadius: blob.borderRadius,
                        opacity: blob.opacity,
                        animationDelay: blob.animationDelay,
                    }}
                />
            ))}
        </div>
    )
}
