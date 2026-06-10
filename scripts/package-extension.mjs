import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const distDir = path.join(rootDir, "dist")
const releaseDir = path.join(rootDir, "release")
const packageJsonPath = path.join(rootDir, "package.json")

if (!fs.existsSync(distDir)) {
  throw new Error("dist directory is missing. Run npm run build:extension first.")
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))
const safeVersion = String(packageJson.version || "0.0.0").replace(/[^0-9A-Za-z.-]/g, "-")
const zipName = `dinam-extension-v${safeVersion}.zip`
const zipPath = path.join(releaseDir, zipName)

fs.mkdirSync(releaseDir, { recursive: true })
if (fs.existsSync(zipPath)) {
  fs.rmSync(zipPath)
}

if (process.platform === "win32") {
  const command = `Compress-Archive -Path * -DestinationPath "${zipPath}" -Force`
  const result = spawnSync("powershell", ["-NoProfile", "-Command", command], {
    cwd: distDir,
    stdio: "inherit",
  })
  if (result.status !== 0) {
    throw new Error("Failed to package extension with Compress-Archive.")
  }
} else {
  const result = spawnSync("zip", ["-r", zipPath, "."], {
    cwd: distDir,
    stdio: "inherit",
  })
  if (result.status !== 0) {
    throw new Error("Failed to package extension with zip command.")
  }
}

console.log(`Created extension package: ${zipPath}`)
