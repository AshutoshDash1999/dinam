import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const distDir = path.join(rootDir, "dist")
const manifestPath = path.join(distDir, "manifest.json")

if (!fs.existsSync(manifestPath)) {
  throw new Error("dist/manifest.json is missing. Run npm run build first.")
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))

if (manifest.manifest_version !== 3) {
  throw new Error("manifest_version must be 3.")
}

if (!manifest.chrome_url_overrides?.newtab) {
  throw new Error("chrome_url_overrides.newtab is required for new-tab extension behavior.")
}

const iconEntries = Object.entries(manifest.icons ?? {})
if (iconEntries.length === 0) {
  throw new Error("manifest.icons must include 16, 48, and 128 entries.")
}

for (const size of ["16", "48", "128"]) {
  const iconRelativePath = manifest.icons?.[size]
  if (!iconRelativePath) {
    throw new Error(`manifest.icons.${size} is missing.`)
  }
  const iconFilePath = path.join(distDir, iconRelativePath)
  if (!fs.existsSync(iconFilePath)) {
    throw new Error(`Missing icon file in dist: ${iconRelativePath}`)
  }
}

const newtabPath = path.join(distDir, manifest.chrome_url_overrides.newtab)
if (!fs.existsSync(newtabPath)) {
  throw new Error(`Missing new tab entry file in dist: ${manifest.chrome_url_overrides.newtab}`)
}

console.log("Extension build validation passed.")
