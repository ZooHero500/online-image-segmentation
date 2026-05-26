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

export async function compressImage(
  image: HTMLImageElement,
  originalFile: File,
  format: OutputFormat,
  quality: number // 0.1 - 1.0
): Promise<CompressResult> {
  const width = image.naturalWidth
  const height = image.naturalHeight

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Failed to get 2D canvas context")
  }

  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)
  }

  ctx.drawImage(image, 0, 0)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result)
        } else {
          reject(new Error("canvas.toBlob returned null"))
        }
      },
      format,
      format === "image/png" ? undefined : quality
    )
  })

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
