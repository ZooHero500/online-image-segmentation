import type { ResizeImageTransform } from "@/types"

export function exportArtboard(
  image: HTMLImageElement,
  transform: ResizeImageTransform,
  artboardWidth: number,
  artboardHeight: number,
  mimeType: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    canvas.width = artboardWidth
    canvas.height = artboardHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      reject(new Error("Failed to get canvas 2d context"))
      return
    }

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, artboardWidth, artboardHeight)

    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, artboardWidth, artboardHeight)
    ctx.clip()

    if (transform.crop) {
      const { x: sx, y: sy, width: sw, height: sh } = transform.crop
      const dw = sw * transform.scale
      const dh = sh * transform.scale
      ctx.drawImage(image, sx, sy, sw, sh, transform.x, transform.y, dw, dh)
    } else {
      const dw = image.naturalWidth * transform.scale
      const dh = image.naturalHeight * transform.scale
      ctx.drawImage(image, transform.x, transform.y, dw, dh)
    }

    ctx.restore()

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Failed to create blob"))
        }
      },
      mimeType,
      quality
    )
  })
}
