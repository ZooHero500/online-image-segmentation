const JPEG_QUALITY = 0.92
const MAX_CANVAS_AREA = 16_777_216
const MAX_CANVAS_DIMENSION = 16_384

export type GridType = "3x3" | "1x3" | "2x2"

export interface GridEditorState {
  gridType: GridType
  offsetX: number
  offsetY: number
  scale: number
  withGap: boolean
}

export interface GridSplitResult {
  index: number
  blob: Blob
  width: number
  height: number
}

interface DisplaySize {
  displayWidth: number
  displayHeight: number
}

export function getGridConfig(gridType: GridType): {
  rows: number
  cols: number
  aspectRatio: number
} {
  switch (gridType) {
    case "3x3": return { rows: 3, cols: 3, aspectRatio: 1 }
    case "1x3": return { rows: 1, cols: 3, aspectRatio: 3 }
    case "2x2": return { rows: 2, cols: 2, aspectRatio: 1 }
  }
}

function resolveOutputMimeType(originalMimeType: string): string {
  if (originalMimeType === "image/webp") return "image/png"
  if (originalMimeType === "image/jpeg" || originalMimeType === "image/png") return originalMimeType
  return "image/png"
}

function computeScale(w: number, h: number): number {
  let scale = 1
  if (w * h > MAX_CANVAS_AREA) scale = Math.sqrt(MAX_CANVAS_AREA / (w * h))
  if (w * scale > MAX_CANVAS_DIMENSION) scale = MAX_CANVAS_DIMENSION / w
  if (h * scale > MAX_CANVAS_DIMENSION) scale = MAX_CANVAS_DIMENSION / h
  return scale
}

function cropCell(
  image: HTMLImageElement,
  srcX: number, srcY: number, srcW: number, srcH: number,
  withGap: boolean, mimeType: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const scale = computeScale(srcW, srcH)
    const canvas = document.createElement("canvas")
    const cellW = Math.round(srcW * scale)
    const cellH = Math.round(srcH * scale)
    canvas.width = cellW
    canvas.height = cellH
    const ctx = canvas.getContext("2d")
    if (!ctx) { reject(new Error("Failed to get canvas 2d context")); return }

    if (withGap) {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, cellW, cellH)
      const margin = 0.03
      const insetX = Math.round(cellW * margin)
      const insetY = Math.round(cellH * margin)
      const innerW = cellW - insetX * 2
      const innerH = cellH - insetY * 2
      ctx.drawImage(image, srcX, srcY, srcW, srcH, insetX, insetY, innerW, innerH)
    } else {
      ctx.drawImage(image, srcX, srcY, srcW, srcH, 0, 0, cellW, cellH)
    }

    const quality = mimeType === "image/jpeg" ? JPEG_QUALITY : undefined
    canvas.toBlob(
      (blob) => {
        if (blob) { resolve(blob); return }
        reject(new Error("Failed to create blob from canvas"))
      },
      mimeType, quality
    )
  })
}

export async function splitGrid(
  image: HTMLImageElement,
  state: GridEditorState,
  displaySize: DisplaySize,
  originalMimeType: string
): Promise<GridSplitResult[]> {
  const mimeType = resolveOutputMimeType(originalMimeType)
  const { rows, cols } = getGridConfig(state.gridType)
  const scaleRatio = image.naturalWidth / (displaySize.displayWidth * state.scale)
  const srcX = -state.offsetX * scaleRatio
  const srcY = -state.offsetY * scaleRatio
  const srcW = displaySize.displayWidth * scaleRatio
  const srcH = displaySize.displayHeight * scaleRatio
  const cellW = srcW / cols
  const cellH = srcH / rows
  const results: GridSplitResult[] = []
  let index = 1
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const blob = await cropCell(image, srcX + c * cellW, srcY + r * cellH, cellW, cellH, state.withGap, mimeType)
      results.push({ index, blob, width: Math.round(cellW), height: Math.round(cellH) })
      index++
    }
  }
  return results
}
