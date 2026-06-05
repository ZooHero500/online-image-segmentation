export type BackgroundRemovalOutputFormat =
  | "image/png"
  | "image/jpeg"
  | "image/webp"

export type BackgroundRemovalRefineOptions = {
  alphaCutoff: number
  edgeShift: number
  edgeFeather: number
}

export const BACKGROUND_REMOVAL_MODEL_ID = "imgsplit/rmbg-1.4"
export const BACKGROUND_REMOVAL_MODEL_LABEL = "BRIA RMBG local AI model"
export const BACKGROUND_REMOVAL_ESTIMATED_MODEL_BYTES = 45 * 1024 * 1024
export const BACKGROUND_REMOVAL_CACHE_VERSION = "imgsplit-rmbg-1.4-worker-processor-v2"
export const BACKGROUND_REMOVAL_REQUIRED_MODEL_FILES = [
  "config.json",
  "preprocessor_config.json",
  "onnx/model_quantized.onnx",
] as const

export function formatModelBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`

  const mb = bytes / (1024 * 1024)
  return Number.isInteger(mb) ? `${mb} MB` : `${mb.toFixed(1)} MB`
}

export function getBackgroundRemovalBaseName(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".")
  return lastDot === -1 ? fileName : fileName.slice(0, lastDot)
}

export function getBackgroundRemovalOutputExtension(
  format: BackgroundRemovalOutputFormat
): string {
  switch (format) {
    case "image/png":
      return "png"
    case "image/jpeg":
      return "jpg"
    case "image/webp":
      return "webp"
  }
}

export function getBackgroundRemovalModelFilePath(file: string): string {
  return `/models/${BACKGROUND_REMOVAL_MODEL_ID}/${file}`
}

export async function assertBackgroundRemovalModelAvailable(
  fetcher: typeof fetch = fetch
): Promise<void> {
  const missingFiles: string[] = []

  for (const file of BACKGROUND_REMOVAL_REQUIRED_MODEL_FILES) {
    const path = getBackgroundRemovalModelFilePath(file)

    try {
      const response = await fetcher(path, {
        method: "HEAD",
        cache: "no-store",
      })

      if (!response.ok) missingFiles.push(path)
    } catch {
      missingFiles.push(path)
    }
  }

  if (missingFiles.length > 0) {
    throw new Error(`Missing local background removal model files: ${missingFiles.join(", ")}`)
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: BackgroundRemovalOutputFormat,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      format,
      format === "image/png" ? undefined : quality
    )
  })
}

export function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not load image"))
    }
    image.src = url
  })
}

export async function composeBackgroundRemovalResult(
  image: HTMLImageElement,
  maskBlob: Blob,
  loadMask: (blob: Blob) => Promise<HTMLImageElement> = loadImageFromBlob
): Promise<HTMLCanvasElement> {
  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height
  const resultCanvas = document.createElement("canvas")
  resultCanvas.width = width
  resultCanvas.height = height

  const resultCtx = resultCanvas.getContext("2d")
  if (!resultCtx) throw new Error("Canvas is not available")

  resultCtx.clearRect(0, 0, width, height)
  resultCtx.drawImage(image, 0, 0)

  const maskImage = await loadMask(maskBlob)
  const maskCanvas = document.createElement("canvas")
  maskCanvas.width = width
  maskCanvas.height = height
  const maskCtx = maskCanvas.getContext("2d")
  if (!maskCtx) throw new Error("Canvas is not available")

  maskCtx.clearRect(0, 0, width, height)
  maskCtx.drawImage(maskImage, 0, 0, width, height)

  const resultData = resultCtx.getImageData(0, 0, width, height)
  const maskData = maskCtx.getImageData(0, 0, width, height)

  for (let i = 0; i < resultData.data.length; i += 4) {
    const maskAlpha = maskData.data[i + 3]
    const grayscaleAlpha = Math.round(
      (maskData.data[i] + maskData.data[i + 1] + maskData.data[i + 2]) / 3
    )
    resultData.data[i + 3] = maskAlpha < 255 ? maskAlpha : grayscaleAlpha
  }

  resultCtx.putImageData(resultData, 0, 0)
  return resultCanvas
}

export async function exportBackgroundRemovalCanvas(
  sourceCanvas: HTMLCanvasElement,
  format: BackgroundRemovalOutputFormat,
  quality?: number
): Promise<Blob> {
  if (format !== "image/jpeg") {
    return canvasToBlob(sourceCanvas, format, quality)
  }

  const exportCanvas = document.createElement("canvas")
  exportCanvas.width = sourceCanvas.width
  exportCanvas.height = sourceCanvas.height
  const ctx = exportCanvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not available")

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
  ctx.drawImage(sourceCanvas, 0, 0)

  return canvasToBlob(exportCanvas, format, quality)
}

export function refineBackgroundRemovalCanvas(
  sourceCanvas: HTMLCanvasElement,
  options: BackgroundRemovalRefineOptions
): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = sourceCanvas.width
  canvas.height = sourceCanvas.height

  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not available")

  ctx.drawImage(sourceCanvas, 0, 0)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const alpha = extractAlpha(imageData.data)
  const shiftedAlpha = shiftAlphaEdge(
    alpha,
    canvas.width,
    canvas.height,
    Math.round(options.edgeShift)
  )
  const clippedAlpha = applyAlphaCutoff(shiftedAlpha, options.alphaCutoff)
  const refinedAlpha = blurAlpha(
    clippedAlpha,
    canvas.width,
    canvas.height,
    Math.round(options.edgeFeather)
  )

  for (let i = 0, pixel = 0; i < imageData.data.length; i += 4, pixel += 1) {
    imageData.data[i + 3] = refinedAlpha[pixel]
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

function extractAlpha(data: Uint8ClampedArray): Uint8ClampedArray {
  const alpha = new Uint8ClampedArray(data.length / 4)
  for (let i = 0, pixel = 0; i < data.length; i += 4, pixel += 1) {
    alpha[pixel] = data[i + 3]
  }
  return alpha
}

function shiftAlphaEdge(
  alpha: Uint8ClampedArray,
  width: number,
  height: number,
  edgeShift: number
): Uint8ClampedArray {
  if (edgeShift === 0) return alpha

  const iterations = Math.min(32, Math.abs(edgeShift))
  const expand = edgeShift > 0
  let current = alpha

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const output = new Uint8ClampedArray(alpha.length)

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let nextAlpha = expand ? 0 : 255

        for (let dy = -1; dy <= 1; dy += 1) {
          const sampleY = y + dy
          if (sampleY < 0 || sampleY >= height) continue

          for (let dx = -1; dx <= 1; dx += 1) {
            const sampleX = x + dx
            if (sampleX < 0 || sampleX >= width) continue

            const sampleAlpha = current[sampleY * width + sampleX]
            nextAlpha = expand
              ? Math.max(nextAlpha, sampleAlpha)
              : Math.min(nextAlpha, sampleAlpha)
          }
        }

        output[y * width + x] = nextAlpha
      }
    }

    current = output
  }

  return current
}

function applyAlphaCutoff(
  alpha: Uint8ClampedArray,
  alphaCutoff: number
): Uint8ClampedArray {
  const cutoff = Math.max(0, Math.min(95, alphaCutoff))
  if (cutoff === 0) return alpha

  const threshold = (cutoff / 100) * 255
  const output = new Uint8ClampedArray(alpha.length)

  for (let i = 0; i < alpha.length; i += 1) {
    const value = alpha[i]
    output[i] =
      value <= threshold
        ? 0
        : Math.round(((value - threshold) / (255 - threshold)) * 255)
  }

  return output
}

function blurAlpha(
  alpha: Uint8ClampedArray,
  width: number,
  height: number,
  edgeFeather: number
): Uint8ClampedArray {
  const radius = Math.max(0, Math.min(32, edgeFeather))
  if (radius === 0) return alpha

  const horizontal = new Uint8ClampedArray(alpha.length)
  const output = new Uint8ClampedArray(alpha.length)

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let total = 0
      let samples = 0

      for (let dx = -radius; dx <= radius; dx += 1) {
        const sampleX = x + dx
        if (sampleX < 0 || sampleX >= width) continue
        total += alpha[y * width + sampleX]
        samples += 1
      }

      horizontal[y * width + x] = Math.round(total / samples)
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let total = 0
      let samples = 0

      for (let dy = -radius; dy <= radius; dy += 1) {
        const sampleY = y + dy
        if (sampleY < 0 || sampleY >= height) continue
        total += horizontal[sampleY * width + x]
        samples += 1
      }

      output[y * width + x] = Math.round(total / samples)
    }
  }

  return output
}

export async function isBackgroundRemovalModelLikelyCached(): Promise<boolean> {
  if (typeof caches === "undefined") return false

  try {
    const cacheNames = await caches.keys()
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const requests = await cache.keys()
      const hasModelEntry = requests.some((request) => {
        const url = request.url.toLowerCase()
        return (
          url.includes("imgsplit/rmbg-1.4") ||
          url.includes("imgsplit%2frmbg-1.4") ||
          url.includes("briaai/rmbg-1.4") ||
          url.includes("briaai%2frmbg-1.4") ||
          url.includes("rmbg-1.4")
        )
      })
      if (hasModelEntry) return true
    }
  } catch {
    return false
  }

  return false
}

export async function clearBackgroundRemovalModelCache(): Promise<number> {
  if (typeof caches === "undefined") return 0

  let deleted = 0
  try {
    const cacheNames = await caches.keys()
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const requests = await cache.keys()
      for (const request of requests) {
        const url = request.url.toLowerCase()
        if (
          url.includes("imgsplit/rmbg-1.4") ||
          url.includes("imgsplit%2frmbg-1.4") ||
          url.includes("briaai/rmbg-1.4") ||
          url.includes("briaai%2frmbg-1.4") ||
          url.includes("rmbg-1.4")
        ) {
          const didDelete = await cache.delete(request)
          if (didDelete) deleted += 1
        }
      }
    }
  } catch {
    return deleted
  }

  return deleted
}
