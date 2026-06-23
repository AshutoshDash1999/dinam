import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const packageJsonPath = path.join(rootDir, "package.json")
const manifestPath = path.join(rootDir, "public", "manifest.json")

if (!fs.existsSync(manifestPath)) {
  throw new Error("public/manifest.json is missing.")
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))

if (!packageJson.version) {
  throw new Error("package.json version is missing.")
}

manifest.version = packageJson.version
fs.writeFileSync(
  manifestPath,
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf-8"
)

console.log(`Synced manifest version to ${manifest.version}.`)
