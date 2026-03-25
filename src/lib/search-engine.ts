/** Placeholder for URL-encoded query (same idea as browser keyword bookmarks). */
export const DEFAULT_SEARCH_URL_TEMPLATE =
    "https://www.google.com/search?q=%s"

const LEGACY_ENGINE_TEMPLATES: Record<string, string> = {
    google: "https://www.google.com/search?q=%s",
    bing: "https://www.bing.com/search?q=%s",
    duckduckgo: "https://duckduckgo.com/?q=%s",
    brave: "https://search.brave.com/search?q=%s",
    ecosia: "https://www.ecosia.org/search?q=%s",
}

function isLegacySearchEngineId(value: string): boolean {
    return Object.hasOwn(LEGACY_ENGINE_TEMPLATES, value)
}

/**
 * Read persisted template, or migrate from pre-template `dashboard-search-engine` id.
 */
export function getInitialSearchUrlTemplate(
    urlStorageKey: string,
    legacyEngineStorageKey: string,
    defaultTemplate: string,
): string {
    const stored = localStorage.getItem(urlStorageKey)
    if (stored !== null && stored.trim() !== "") {
        return stored.trim()
    }

    const legacy = localStorage.getItem(legacyEngineStorageKey)
    if (legacy !== null && isLegacySearchEngineId(legacy)) {
        const template = LEGACY_ENGINE_TEMPLATES[legacy] ?? defaultTemplate
        localStorage.setItem(urlStorageKey, template)
        localStorage.removeItem(legacyEngineStorageKey)
        return template
    }

    return defaultTemplate
}

export function isSearchUrlTemplateValid(template: string): boolean {
    return template.trim().includes("%s")
}

export function buildSearchUrlFromTemplate(
    template: string,
    query: string,
): string {
    const raw = template.trim()
    const t = isSearchUrlTemplateValid(raw)
        ? raw
        : DEFAULT_SEARCH_URL_TEMPLATE
    return t.replace(/%s/g, encodeURIComponent(query))
}

/** True if the string can be parsed as a navigable http(s) / special URL (not a search phrase). */
function hrefIfSingleTokenUrl(trimmed: string): string | null {
    if (/\s/.test(trimmed)) {
        return null
    }

    const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`

    try {
        const u = new URL(withProtocol)
        if (u.protocol === "http:" || u.protocol === "https:") {
            const host = u.hostname
            if (
                host === "localhost" ||
                /\./.test(host) ||
                /^(\d{1,3}\.){3}\d{1,3}$/.test(host)
            ) {
                return u.href
            }
        }
        if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
            return trimmed
        }
    } catch {
        return null
    }

    return null
}

/**
 * Turn omnibox-style input into a full URL: real URLs / hostnames go through;
 * everything else is filled into the search URL template.
 */
export function resolveNavigationHref(
    raw: string,
    searchUrlTemplate: string,
): string | null {
    const trimmed = raw.trim()
    if (!trimmed) {
        return null
    }

    const asUrl = hrefIfSingleTokenUrl(trimmed)
    if (asUrl !== null) {
        return asUrl
    }

    return buildSearchUrlFromTemplate(searchUrlTemplate, trimmed)
}

/**
 * Opens Google reverse image search in a new tab with the selected file.
 * Uses a same-origin form POST (no XHR) to avoid CORS blocks.
 */
export function openGoogleSearchByImage(file: File): void {
    const form = document.createElement("form")
    form.method = "POST"
    form.action = "https://www.google.com/searchbyimage/upload"
    form.target = "_blank"
    form.enctype = "multipart/form-data"

    const input = document.createElement("input")
    input.type = "file"
    input.name = "encoded_image"

    try {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        input.files = dataTransfer.files
    } catch {
        window.open("https://lens.google.com/", "_blank", "noopener,noreferrer")
        return
    }

    form.appendChild(input)
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
}
