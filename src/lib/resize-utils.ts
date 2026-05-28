import type { CropRect, ResizeImageTransform } from "@/types"

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

export function calculateInitialCropRect(
  imageWidth: number,
  imageHeight: number,
  transform: Pick<ResizeImageTransform, "x" | "y" | "scale" | "crop">,
  canvasWidth: number,
  canvasHeight: number
): CropRect {
  const srcW = transform.crop ? transform.crop.width : imageWidth
  const srcH = transform.crop ? transform.crop.height : imageHeight
  const displayW = srcW * transform.scale
  const displayH = srcH * transform.scale

  const imgLeft = transform.x
  const imgTop = transform.y
  const imgRight = transform.x + displayW
  const imgBottom = transform.y + displayH

  const x1 = Math.max(0, imgLeft)
  const y1 = Math.max(0, imgTop)
  const x2 = Math.min(canvasWidth, imgRight)
  const y2 = Math.min(canvasHeight, imgBottom)

  return {
    x: x1,
    y: y1,
    width: Math.max(MIN_CROP_SIZE, x2 - x1),
    height: Math.max(MIN_CROP_SIZE, y2 - y1),
  }
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
