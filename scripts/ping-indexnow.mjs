import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

const host = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"
const key = "imgsplit-indexnow-2026"
const keyFilePath = join(process.cwd(), "public", `${key}.txt`)
const endpoint = "https://api.indexnow.org/indexnow"

const urls = process.argv.slice(2)

if (urls.length === 0) {
  console.error("Usage: bun run seo:indexnow -- https://imgsplit.com/page-1 https://imgsplit.com/page-2")
  process.exit(1)
}

if (!existsSync(keyFilePath) || readFileSync(keyFilePath, "utf8").trim() !== key) {
  console.error(`IndexNow key file must exist at public/${key}.txt and contain ${key}`)
  process.exit(1)
}

let baseUrl
try {
  baseUrl = new URL(host)
} catch {
  console.error(`NEXT_PUBLIC_SITE_URL must be a valid absolute URL. Received: ${host}`)
  process.exit(1)
}

const normalizedUrls = []
for (const input of urls) {
  let url
  try {
    url = input.startsWith("http://") || input.startsWith("https://")
      ? new URL(input)
      : new URL(input.replace(/^\//, ""), `${baseUrl.origin}/`)
  } catch {
    console.error(`Invalid URL: ${input}`)
    process.exit(1)
  }

  if (url.host !== baseUrl.host) {
    console.error(`IndexNow URL host mismatch: ${url.href} does not belong to ${baseUrl.host}`)
    process.exit(1)
  }

  normalizedUrls.push(url.href)
}

const keyLocation = `${baseUrl.origin}/${key}.txt`
let response
try {
  response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      host: baseUrl.host,
      key,
      keyLocation,
      urlList: normalizedUrls,
    }),
  })
} catch (error) {
  console.error(`IndexNow request failed for ${endpoint}`)
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}

if (!response.ok) {
  const body = await response.text()
  console.error(`IndexNow ping failed: ${response.status} ${response.statusText}`)
  console.error(body)
  process.exit(1)
}

console.log(`Submitted ${normalizedUrls.length} URL(s) to IndexNow`)
