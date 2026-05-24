export function normalizeQuickLaunchHref(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return "#"

  // Prepend https:// if it lacks any valid scheme
  const withProtocol = /^[a-z0-9+.-]+:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  try {
    const u = new URL(withProtocol)
    const p = u.protocol.toLowerCase()

    // Explicitly block execution/dangerous schemes
    if (
      p === "javascript:" ||
      p === "vbscript:" ||
      p === "data:" ||
      p === "file:"
    ) {
      return "#"
    }
    return u.href
  } catch {
    return "#"
  }
}

export function fallbackNameFromQuickLaunchHref(href: string): string {
  if (href === "#") return "Link"
  try {
    const u = new URL(href)
    return u.hostname.replace(/^www\./, "") || "Link"
  } catch {
    return "Link"
  }
}
