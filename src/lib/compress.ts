export type OutputFormat = "image/png" | "image/jpeg" | "image/webp"

export interface CompressResult {
  blob: Blob
  originalSize: number
  compressedSize: number
  savedPercent: number
  format: OutputFormat
  width: number
  height: number
}

/**
 * Encode image to blob via offscreen canvas.
 */
function canvasToBlob(
  image: HTMLImageElement,
  format: OutputFormat,
  quality?: number,
  fillWhiteBg = false
): Promise<Blob> {
  const canvas = document.createElement("canvas")
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const ctx = canvas.getContext("2d")!
  if (fillWhiteBg) {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(image, 0, 0)
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      format,
      quality
    )
  })
}

export async function compressImage(
  image: HTMLImageElement,
  originalFile: File,
  format: OutputFormat,
  quality: number // 0.1 - 1.0
): Promise<CompressResult> {
  const width = image.naturalWidth
  const height = image.naturalHeight

  let blob: Blob

  if (format === "image/png") {
    // PNG is lossless — canvas re-encoding often increases size.
    // Encode via canvas, but if result is larger than original (and original is also PNG),
    // return the original file to avoid "compression" that makes files bigger.
    const encoded = await canvasToBlob(image, "image/png")
    if (originalFile.type === "image/png" && encoded.size >= originalFile.size) {
      blob = originalFile
    } else {
      blob = encoded
    }
  } else {
    // JPEG / WebP — use canvas encoder with quality parameter.
    // JPEG needs white background fill (no alpha channel support).
    blob = await canvasToBlob(
      image,
      format,
      quality,
      format === "image/jpeg"
    )
  }

  const originalSize = originalFile.size
  const compressedSize = blob.size
  const savedPercent = Math.round((1 - compressedSize / originalSize) * 100)

  return {
    blob,
    originalSize,
    compressedSize,
    savedPercent,
    format,
    width,
    height,
  }
}

export function formatToExtension(format: OutputFormat): string {
  switch (format) {
    case "image/png":
      return "png"
    case "image/jpeg":
      return "jpg"
    case "image/webp":
      return "webp"
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
}

export function getBaseName(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".")
  if (lastDot === -1) {
    return fileName
  }
  return fileName.slice(0, lastDot)
}
