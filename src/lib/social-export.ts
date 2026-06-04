import {
  SOCIAL_EXPORT_PRESETS,
  type SocialExportPreset,
  type SocialExportPresetId,
} from "./social-export-presets"

export type SocialExportOutputFormat = "image/png" | "image/jpeg" | "image/webp"
export type SocialExportFitMode = "fill" | "fit"

export interface SocialExportCropState {
  fitMode: SocialExportFitMode
  scale: number
  offsetX: number
  offsetY: number
}

export interface SocialExportDrawTransform {
  x: number
  y: number
  width: number
  height: number
}

export type SocialExportCropStateMap = Record<
  SocialExportPresetId,
  SocialExportCropState
>

const DEFAULT_CROP_STATE: SocialExportCropState = {
  fitMode: "fill",
  scale: 1,
  offsetX: 0,
  offsetY: 0,
}

export function createSocialExportCropState(
  patch: Partial<SocialExportCropState> = {}
): SocialExportCropState {
  return {
    ...DEFAULT_CROP_STATE,
    ...patch,
  }
}

export function createSocialExportCropStateMap(): SocialExportCropStateMap {
  return Object.fromEntries(
    SOCIAL_EXPORT_PRESETS.map((preset) => [
      preset.id,
      createSocialExportCropState(),
    ])
  ) as SocialExportCropStateMap
}

export function clampSocialExportScale(
  scale: number,
  fitMode: SocialExportFitMode
): number {
  const min = fitMode === "fit" ? 0.5 : 1
  return Math.min(3, Math.max(min, scale))
}

export function calculateSocialExportBaseScale(
  image: Pick<HTMLImageElement, "naturalWidth" | "naturalHeight">,
  preset: Pick<SocialExportPreset, "width" | "height">,
  fitMode: SocialExportFitMode
): number {
  const scaleX = preset.width / image.naturalWidth
  const scaleY = preset.height / image.naturalHeight
  return fitMode === "fit" ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY)
}

export function calculateSocialExportDrawTransform(
  image: Pick<HTMLImageElement, "naturalWidth" | "naturalHeight">,
  preset: Pick<SocialExportPreset, "width" | "height">,
  crop: SocialExportCropState
): SocialExportDrawTransform {
  const baseScale = calculateSocialExportBaseScale(image, preset, crop.fitMode)
  const scale = baseScale * clampSocialExportScale(crop.scale, crop.fitMode)
  const width = image.naturalWidth * scale
  const height = image.naturalHeight * scale

  return {
    x: (preset.width - width) / 2 + crop.offsetX,
    y: (preset.height - height) / 2 + crop.offsetY,
    width,
    height,
  }
}

export function resetSocialExportCropForFitMode(
  crop: SocialExportCropState,
  fitMode: SocialExportFitMode
): SocialExportCropState {
  return {
    fitMode,
    scale: clampSocialExportScale(crop.scale, fitMode),
    offsetX: 0,
    offsetY: 0,
  }
}

export function getSocialExportOutputExtension(
  format: SocialExportOutputFormat
): "png" | "jpg" | "webp" {
  if (format === "image/jpeg") return "jpg"
  if (format === "image/webp") return "webp"
  return "png"
}

export function getSocialExportBaseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "") || "social-export"
}

export function getSocialExportFileName(
  originalFileName: string,
  preset: SocialExportPreset,
  format: SocialExportOutputFormat
): string {
  const extension = getSocialExportOutputExtension(format)
  const baseName = getSocialExportBaseName(originalFileName)
  return `${baseName}_${preset.fileNameSuffix}_${preset.width}x${preset.height}.${extension}`
}

export function getSocialExportZipFileName(originalFileName: string): string {
  return `${getSocialExportBaseName(originalFileName)}_social_exports.zip`
}

export function renderSocialExportToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  preset: SocialExportPreset,
  crop: SocialExportCropState,
  backgroundColor: string = "#ffffff"
): void {
  canvas.width = preset.width
  canvas.height = preset.height
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Failed to get canvas 2d context")
  }

  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, preset.width, preset.height)
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, preset.width, preset.height)
  ctx.clip()

  const transform = calculateSocialExportDrawTransform(image, preset, crop)
  ctx.drawImage(
    image,
    transform.x,
    transform.y,
    transform.width,
    transform.height
  )
  ctx.restore()
}

export function exportSocialPresetImage(
  image: HTMLImageElement,
  preset: SocialExportPreset,
  crop: SocialExportCropState,
  format: SocialExportOutputFormat,
  quality: number,
  backgroundColor: string = "#ffffff"
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    renderSocialExportToCanvas(canvas, image, preset, crop, backgroundColor)
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Failed to create blob"))
      },
      format,
      quality
    )
  })
}

export async function exportSocialPresetsAsZip({
  image,
  originalFileName,
  presets,
  cropStates,
  format,
  quality,
}: {
  image: HTMLImageElement
  originalFileName: string
  presets: SocialExportPreset[]
  cropStates: SocialExportCropStateMap
  format: SocialExportOutputFormat
  quality: number
}): Promise<Blob> {
  const { default: JSZip } = await import("jszip")
  const zip = new JSZip()

  for (const preset of presets) {
    const blob = await exportSocialPresetImage(
      image,
      preset,
      cropStates[preset.id],
      format,
      quality
    )
    zip.file(
      `${preset.platform}/${getSocialExportFileName(
        originalFileName,
        preset,
        format
      )}`,
      blob
    )
  }

  return zip.generateAsync({ type: "blob", mimeType: "application/zip" })
}
