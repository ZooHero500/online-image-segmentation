import type { CropRect } from "@/types"

const MIN_CANVAS_SIZE = 1
const MAX_CANVAS_SIZE = 4096
const MIN_CROP_SIZE = 20

export function calculateFillTransform(
  imageWidth: number,
  imageHeight: number,
  artboardWidth: number,
  artboardHeight: number
): { x: number; y: number; scale: number } {
  const scaleToFillW = artboardWidth / imageWidth
  const scaleToFillH = artboardHeight / imageHeight
  const scale = Math.max(scaleToFillW, scaleToFillH)

  const scaledW = imageWidth * scale
  const scaledH = imageHeight * scale

  return {
    x: (artboardWidth - scaledW) / 2,
    y: (artboardHeight - scaledH) / 2,
    scale,
  }
}

export function calculateFitTransform(
  imageWidth: number,
  imageHeight: number,
  artboardWidth: number,
  artboardHeight: number
): { x: number; y: number; scale: number } {
  const scaleToFitW = artboardWidth / imageWidth
  const scaleToFitH = artboardHeight / imageHeight
  const scale = Math.min(scaleToFitW, scaleToFitH)

  const scaledW = imageWidth * scale
  const scaledH = imageHeight * scale

  return {
    x: (artboardWidth - scaledW) / 2,
    y: (artboardHeight - scaledH) / 2,
    scale,
  }
}

export function constrainCropRect(
  crop: CropRect,
  bounds: CropRect
): CropRect {
  let { x, y, width, height } = crop
  const { x: bx, y: by, width: bw, height: bh } = bounds

  x = Math.max(bx, x)
  y = Math.max(by, y)

  width = Math.min(width, bx + bw - x)
  height = Math.min(height, by + bh - y)

  width = Math.max(MIN_CROP_SIZE, width)
  height = Math.max(MIN_CROP_SIZE, height)

  if (x + width > bx + bw) {
    x = bx + bw - width
  }
  if (y + height > by + bh) {
    y = by + bh - height
  }

  return { x, y, width, height }
}

export function validateCanvasSize(
  width: number,
  height: number
): { valid: boolean; errorKey?: string } {
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    return { valid: false, errorKey: "notInteger" }
  }
  if (width < MIN_CANVAS_SIZE || height < MIN_CANVAS_SIZE) {
    return { valid: false, errorKey: "tooSmall" }
  }
  if (width > MAX_CANVAS_SIZE || height > MAX_CANVAS_SIZE) {
    return { valid: false, errorKey: "tooLarge" }
  }
  return { valid: true }
}
