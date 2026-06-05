import { spawn } from "node:child_process"
import { mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const sourceModelId = "briaai/RMBG-1.4"
const revision = "main"
const outputRoot = join(root, "public", "models", "imgsplit", "rmbg-1.4")
const files = [
  "config.json",
  "preprocessor_config.json",
  "onnx/model_quantized.onnx",
]

for (const file of files) {
  const url = `https://huggingface.co/${sourceModelId}/resolve/${revision}/${file}`
  const outputPath = join(outputRoot, file)
  const remoteSize = await getRemoteSize(url)

  if (await isCompleteFile(outputPath, remoteSize)) {
    console.log(`Already downloaded ${outputPath} (${formatBytes(remoteSize)})`)
    continue
  }

  console.log(`Downloading ${url}`)
  await mkdir(dirname(outputPath), { recursive: true })

  if (file.endsWith(".onnx")) {
    await downloadWithCurl(url, outputPath)
  } else {
    await downloadWithFetch(url, outputPath)
  }

  const downloaded = await stat(outputPath)
  console.log(`Wrote ${outputPath} (${formatBytes(downloaded.size)})`)
}

await patchConfig()

console.log("\nBackground removal model is ready in public/models/imgsplit/rmbg-1.4")

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "unknown size"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function downloadWithFetch(url, outputPath) {
  const maxAttempts = 4
  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`)
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      await writeFile(outputPath, buffer)
      return
    } catch (error) {
      lastError = error
      if (attempt < maxAttempts) {
        console.warn(`Fetch failed for ${url}; retrying ${attempt}/${maxAttempts - 1}`)
        await sleep(1000 * attempt)
      }
    }
  }

  throw lastError
}

function downloadWithCurl(url, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      "-L",
      "--fail",
      "--retry",
      "10",
      "--retry-delay",
      "2",
      "--retry-all-errors",
      "--connect-timeout",
      "30",
      "--continue-at",
      "-",
      "--output",
      outputPath,
      url,
    ]
    const child = spawn("curl", args, { stdio: "inherit" })

    child.on("error", (error) => {
      reject(new Error(`Could not start curl. Install curl or download ${url} manually. ${error.message}`))
    })

    child.on("exit", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`curl failed with exit code ${code}. Re-run this command to resume the download.`))
      }
    })
  })
}

async function getRemoteSize(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
    })
    const linkedSize = response.headers.get("x-linked-size")
    const contentLength = response.headers.get("content-length")
    return Number(linkedSize ?? contentLength ?? Number.NaN)
  } catch {
    return Number.NaN
  }
}

async function isCompleteFile(outputPath, remoteSize) {
  try {
    const current = await stat(outputPath)
    if (Number.isFinite(remoteSize)) return current.size === remoteSize
    return current.size > 0
  } catch {
    return false
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function patchConfig() {
  const configPath = join(outputRoot, "config.json")
  const config = JSON.parse(await readFile(configPath, "utf8"))

  const nextConfig = {
    ...config,
    _name_or_path: "imgsplit/rmbg-1.4",
    model_type: "segformer",
  }

  if (
    config.model_type !== nextConfig.model_type ||
    config._name_or_path !== nextConfig._name_or_path
  ) {
    await writeFile(configPath, `${JSON.stringify(nextConfig, null, 2)}\n`)
    console.log("Patched config.json for the imgsplit/rmbg-1.4 Transformers.js alias")
  }
}
