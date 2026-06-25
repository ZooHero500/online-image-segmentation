import { JPEG_QUALITY, computeScale, resolveOutputMimeType } from "@/lib/image-canvas"

export const MIN_SLIDES = 2
export const MAX_SLIDES = 10

export type AspectPreset = "4:5" | "1:1" | "original"

export interface CarouselEditorState {
  slideCount: number
  aspect: AspectPreset
  offsetX: number
  offsetY: number
  scale: number
}

export interface CarouselSlide {
  index: number
  blob: Blob
  width: number
  height: number
}

export interface CarouselDisplaySize {
  displayWidth: number
  displayHeight: number
}

export function clampSlideCount(n: number): number {
  const rounded = Math.round(n)
  return Math.min(MAX_SLIDES, Math.max(MIN_SLIDES, rounded))
}

export function getSlideSize(
  aspect: AspectPreset,
  image: HTMLImageElement,
  slideCount: number,
): { w: number; h: number } {
  const n = clampSlideCount(slideCount)
  if (aspect === "4:5") return { w: 1080, h: 1350 }
  if (aspect === "1:1") return { w: 1080, h: 1080 }
  // original: slice native image into N columns at native height
  return { w: Math.round(image.naturalWidth / n), h: image.naturalHeight }
}

export function getCompositeAspect(
  aspect: AspectPreset,
  image: HTMLImageElement,
  slideCount: number,
): number {
  const n = clampSlideCount(slideCount)
  const { w, h } = getSlideSize(aspect, image, n)
  return (n * w) / h
}

function renderSlideToBlob(
  image: HTMLImageElement,
  srcX: number, srcY: number, srcW: number, srcH: number,
  targetW: number, targetH: number,
  mimeType: string,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Cap target by canvas limits (1080x1350 never trips this; native "original" might).
    const scale = computeScale(targetW, targetH)
    const outW = Math.round(targetW * scale)
    const outH = Math.round(targetH * scale)
    const canvas = document.createElement("canvas")
    canvas.width = outW
    canvas.height = outH
    const ctx = canvas.getContext("2d")
    if (!ctx) { reject(new Error("Failed to get canvas 2d context")); return }
    ctx.drawImage(image, srcX, srcY, srcW, srcH, 0, 0, outW, outH)
    const quality = mimeType === "image/jpeg" ? JPEG_QUALITY : undefined
    canvas.toBlob(
      (blob) => { blob ? resolve(blob) : reject(new Error("Failed to create blob from canvas")) },
      mimeType, quality,
    )
  })
}

export async function splitCarousel(
  image: HTMLImageElement,
  state: CarouselEditorState,
  displaySize: CarouselDisplaySize,
  originalMimeType: string,
): Promise<CarouselSlide[]> {
  const mimeType = resolveOutputMimeType(originalMimeType)
  const slideCount = clampSlideCount(state.slideCount)
  const { w: targetW, h: targetH } = getSlideSize(state.aspect, image, slideCount)

  // Display→source coordinate conversion, identical model to splitGrid.
  const srcX = -state.offsetX / state.scale
  const srcY = -state.offsetY / state.scale
  const srcW = displaySize.displayWidth / state.scale
  const srcH = displaySize.displayHeight / state.scale
  const cellSrcW = srcW / slideCount
  const cellSrcH = srcH

  const slides: CarouselSlide[] = []
  for (let c = 0; c < slideCount; c++) {
    const blob = await renderSlideToBlob(
      image,
      srcX + c * cellSrcW, srcY, cellSrcW, cellSrcH,
      targetW, targetH, mimeType,
    )
    slides.push({ index: c + 1, blob, width: targetW, height: targetH })
  }
  return slides
}
