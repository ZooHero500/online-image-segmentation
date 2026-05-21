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

    const srcW = transform.crop ? transform.crop.width : image.naturalWidth
    const srcH = transform.crop ? transform.crop.height : image.naturalHeight
    const dw = srcW * transform.scale
    const dh = srcH * transform.scale

    // Apply rotation and flip around image center
    const cx = transform.x + dw / 2
    const cy = transform.y + dh / 2
    ctx.translate(cx, cy)
    if (transform.rotation) {
      ctx.rotate((transform.rotation * Math.PI) / 180)
    }
    ctx.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1)
    ctx.translate(-cx, -cy)

    if (transform.crop) {
      const { x: sx, y: sy, width: sw, height: sh } = transform.crop
      ctx.drawImage(image, sx, sy, sw, sh, transform.x, transform.y, dw, dh)
    } else {
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
