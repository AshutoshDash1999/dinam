export type QuickLinkMetadata = {
  title: string
  description: string
  favicon: string
}

/**
 * Normalizes a raw user-entered URL by prepending https:// if needed.
 */
function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ""

  const withProtocol = /^[a-z0-9+.-]+:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  try {
    const u = new URL(withProtocol)
    const p = u.protocol.toLowerCase()

    if (
      p === "javascript:" ||
      p === "vbscript:" ||
      p === "data:" ||
      p === "file:"
    ) {
      return ""
    }
    return u.href
  } catch {
    return ""
  }
}

/**
 * Extracts the hostname from a URL for favicon lookup.
 */
function getDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return ""
  }
}

/**
 * Fetches page metadata (title, description, favicon) for a given URL
 * using the Microlink API (CORS-friendly, no API key required).
 *
 * Falls back to Google's favicon service if the API doesn't return one.
 *
 * Throws on network errors, invalid URLs, or timeouts.
 */
export async function fetchQuickLinkMetadata(
  rawUrl: string
): Promise<QuickLinkMetadata> {
  const url = normalizeUrl(rawUrl)
  if (!url) throw new Error("URL is empty")

  // Validate the URL
  try {
    new URL(url)
  } catch {
    throw new Error("Invalid URL")
  }

  const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(apiUrl, { signal: controller.signal })

    if (!res.ok) {
      throw new Error(`Failed to fetch metadata (status ${res.status})`)
    }

    const json = await res.json()
    const data = json?.data

    const domain = getDomain(url)
    const googleFavicon = domain
      ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
      : ""

    return {
      title:
        typeof data?.title === "string" && data.title.trim()
          ? data.title.trim()
          : "",
      description:
        typeof data?.description === "string" && data.description.trim()
          ? data.description.trim()
          : "",
      favicon:
        typeof data?.logo?.url === "string" && data.logo.url.trim()
          ? data.logo.url.trim()
          : googleFavicon,
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out")
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

export { normalizeUrl }
