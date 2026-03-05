import type { SplitLine, SplitResult } from "@/types"

const JPEG_QUALITY = 0.92

function resolveOutputMimeType(originalMimeType: string): string {
  if (originalMimeType === "image/webp") return "image/png"
  return originalMimeType
}

function computeRegions(
  imageWidth: number,
  imageHeight: number,
  lines: SplitLine[]
): { x: number; y: number; w: number; h: number; row: number; col: number }[] {
  const hPositions = lines
    .filter((l) => l.orientation === "horizontal")
    .map((l) => l.position)
    .sort((a, b) => a - b)
  const vPositions = lines
    .filter((l) => l.orientation === "vertical")
    .map((l) => l.position)
    .sort((a, b) => a - b)

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

  for (let r = 0; r < yEdges.length - 1; r++) {
    for (let c = 0; c < xEdges.length - 1; c++) {
      regions.push({
        x: xEdges[c],
        y: yEdges[r],
        w: xEdges[c + 1] - xEdges[c],
        h: yEdges[r + 1] - yEdges[r],
        row: r + 1,
        col: c + 1,
      })
    }
  }

  return regions
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
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      reject(new Error("Failed to get canvas 2d context"))
      return
    }
    ctx.drawImage(image, x, y, w, h, 0, 0, w, h)
    const quality = mimeType === "image/jpeg" ? JPEG_QUALITY : undefined
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Failed to create blob from canvas"))
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
