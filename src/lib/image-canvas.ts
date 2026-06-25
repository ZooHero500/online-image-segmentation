export const JPEG_QUALITY = 0.92
export const MAX_CANVAS_AREA = 16_777_216
export const MAX_CANVAS_DIMENSION = 16_384

export function resolveOutputMimeType(originalMimeType: string): string {
  if (originalMimeType === "image/webp") return "image/png"
  if (originalMimeType === "image/jpeg" || originalMimeType === "image/png") return originalMimeType
  return "image/png"
}

export function computeScale(w: number, h: number): number {
  let scale = 1
  if (w * h > MAX_CANVAS_AREA) scale = Math.sqrt(MAX_CANVAS_AREA / (w * h))
  if (w * scale > MAX_CANVAS_DIMENSION) scale = MAX_CANVAS_DIMENSION / w
  if (h * scale > MAX_CANVAS_DIMENSION) scale = MAX_CANVAS_DIMENSION / h
  return scale
}
