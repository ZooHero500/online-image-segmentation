import type { SplitLine, SplitResult } from "@/types"

const JPEG_QUALITY = 0.92

// Conservative cross-browser canvas limits
const MAX_CANVAS_AREA = 16_777_216 // 4096 * 4096
const MAX_CANVAS_DIMENSION = 16_384

function resolveOutputMimeType(originalMimeType: string): string {
  if (originalMimeType === "image/webp") return "image/png"
  if (originalMimeType === "image/jpeg" || originalMimeType === "image/png") return originalMimeType
  return "image/png"
}

function computeRegions(
  imageWidth: number,
  imageHeight: number,
  lines: SplitLine[]
): { x: number; y: number; w: number; h: number; row: number; col: number }[] {
  const hPositions = [
    ...new Set(
      lines
        .filter((l) => l.orientation === "horizontal")
        .map((l) => l.position)
    ),
  ].sort((a, b) => a - b)
  const vPositions = [
    ...new Set(
      lines
        .filter((l) => l.orientation === "vertical")
        .map((l) => l.position)
    ),
  ].sort((a, b) => a - b)

  const yEdges = [0, ...hPositions, imageHeight]
  const xEdges = [0, ...vPositions, imageWidth]

  const regions: {
    x: number
    y: number
    w: number
    h: number
    row: number
    col: number
  }[] = []

  let actualRow = 0
  for (let r = 0; r < yEdges.length - 1; r++) {
    const h = yEdges[r + 1] - yEdges[r]
    if (h <= 0) continue
    actualRow++
    let actualCol = 0
    for (let c = 0; c < xEdges.length - 1; c++) {
      const w = xEdges[c + 1] - xEdges[c]
      if (w <= 0) continue
      actualCol++
      regions.push({
        x: xEdges[c],
        y: yEdges[r],
        w,
        h,
        row: actualRow,
        col: actualCol,
      })
    }
  }

  return regions
}

function dataUrlToBlob(dataUrl: string, fallbackMime: string): Blob {
  const parts = dataUrl.split(",")
  const mime = parts[0].match(/:(.*?);/)?.[1] ?? fallbackMime
  const raw = atob(parts[1])
  const u8 = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) u8[i] = raw.charCodeAt(i)
  return new Blob([u8], { type: mime })
}

function computeScale(w: number, h: number): number {
  let scale = 1
  if (w * h > MAX_CANVAS_AREA) {
    scale = Math.sqrt(MAX_CANVAS_AREA / (w * h))
  }
  if (w * scale > MAX_CANVAS_DIMENSION) {
    scale = MAX_CANVAS_DIMENSION / w
  }
  if (h * scale > MAX_CANVAS_DIMENSION) {
    scale = MAX_CANVAS_DIMENSION / h
  }
  return scale
}

function cropRegion(
  image: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  mimeType: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const scale = computeScale(w, h)
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(w * scale)
    canvas.height = Math.round(h * scale)
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      reject(new Error("Failed to get canvas 2d context"))
      return
    }
    if (scale < 1) {
      ctx.scale(scale, scale)
    }
    ctx.drawImage(image, x, y, w, h, 0, 0, w, h)
    const quality = mimeType === "image/jpeg" ? JPEG_QUALITY : undefined
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }
        // Fallback: try toDataURL when toBlob returns null
        try {
          resolve(dataUrlToBlob(canvas.toDataURL(mimeType, quality), mimeType))
        } catch {
          reject(new Error("Failed to create blob from canvas"))
        }
      },
      mimeType,
      quality
    )
  })
}

export async function splitImage(
  image: HTMLImageElement,
  lines: SplitLine[],
  originalMimeType: string
): Promise<SplitResult[]> {
  const mimeType = resolveOutputMimeType(originalMimeType)
  const regions = computeRegions(
    image.naturalWidth,
    image.naturalHeight,
    lines
  )

  const results: SplitResult[] = []

  for (const region of regions) {
    const blob = await cropRegion(
      image,
      region.x,
      region.y,
      region.w,
      region.h,
      mimeType
    )
    results.push({
      row: region.row,
      col: region.col,
      blob,
      width: region.w,
      height: region.h,
    })
  }

  return results
}
