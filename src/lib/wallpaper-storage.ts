const DB_NAME = "dinam-wallpaper"
const STORE_NAME = "wallpapers"
const KEY = "current"

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/** Save a wallpaper data URL to IndexedDB. */
export async function saveWallpaper(dataUrl: string): Promise<void> {
  try {
    const db = await openDB()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite")
      tx.objectStore(STORE_NAME).put(dataUrl, KEY)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    console.warn("[dinam] Failed to save wallpaper to IndexedDB.")
  }
}

/** Load the current wallpaper data URL from IndexedDB. */
export async function loadWallpaper(): Promise<string | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly")
    const req = tx.objectStore(STORE_NAME).get(KEY)
    req.onsuccess = () =>
      resolve(typeof req.result === "string" ? req.result : null)
    req.onerror = () => reject(req.error)
  })
}

/** Remove the wallpaper from IndexedDB. */
export async function clearWallpaper(): Promise<void> {
  try {
    const db = await openDB()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite")
      tx.objectStore(STORE_NAME).delete(KEY)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    console.warn("[dinam] Failed to clear wallpaper from IndexedDB.")
  }
}

/**
 * Compress an image file to JPEG via canvas, capping width at
 * max(screen width, 1920). Returns a data URL.
 */
export function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const maxWidth = Math.max(window.innerWidth, 1920)
      let width = img.naturalWidth
      let height = img.naturalHeight

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Canvas 2D context unavailable"))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL("image/jpeg", 0.8))
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("Failed to decode image"))
    }

    img.src = objectUrl
  })
}
