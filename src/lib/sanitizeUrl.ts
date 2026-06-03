const SAFE_SCHEMES = ["https:", "http:", "ftp:"];

/**
 * Returns the URL if it uses a safe scheme, otherwise returns "#".
 * Blocks javascript:, data:, vbscript:, and any other dangerous schemes.
 */
export function sanitizeUrl(url: string): string {
  if (!url || url.trim() === "") return "#";
  try {
    const parsed = new URL(url.trim());
    if (SAFE_SCHEMES.includes(parsed.protocol)) {
      return parsed.href;
    }
  } catch {
    // Not a valid absolute URL — could be a relative path
    if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) {
      return url;
    }
  }
  return "#";
}
