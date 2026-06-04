export type WatermarkLayerType = "text" | "image"
export type WatermarkRepeatMode = "single" | "repeat"
export type WatermarkOutputFormat = "image/png" | "image/jpeg" | "image/webp"

export interface WatermarkLayer {
  id: string
  type: WatermarkLayerType
  repeatMode: WatermarkRepeatMode
  text: string
  imageSrc: string | null
  imageName: string | null
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  fontSize: number
  fontFamily: string
  color: string
  spacingX: number
  spacingY: number
  enabled: boolean
}

export interface WatermarkState {
  layers: WatermarkLayer[]
  selectedLayerId: string | null
}

export type WatermarkImageAssets = Record<string, HTMLImageElement>

let nextWatermarkLayerId = 0

export function createWatermarkLayer(
  type: WatermarkLayerType,
  overrides: Partial<WatermarkLayer> = {}
): WatermarkLayer {
  return {
    id: `wm-${++nextWatermarkLayerId}`,
    type,
    repeatMode: "single",
    text: type === "text" ? "ImgSplit" : "",
    imageSrc: null,
    imageName: null,
    x: 0.5,
    y: 0.5,
    width: 240,
    height: 80,
    rotation: -24,
    opacity: 0.35,
    fontSize: 48,
    fontFamily: "Arial",
    color: "#111827",
    spacingX: 280,
    spacingY: 180,
    enabled: true,
    ...overrides,
  }
}

export function createWatermarkState(
  layers: WatermarkLayer[] = []
): WatermarkState {
  return {
    layers,
    selectedLayerId: layers[0]?.id ?? null,
  }
}

export function updateWatermarkLayer(
  state: WatermarkState,
  layerId: string,
  patch: Partial<WatermarkLayer>
): WatermarkState {
  return {
    ...state,
    layers: state.layers.map((layer) =>
      layer.id === layerId ? { ...layer, ...patch } : layer
    ),
  }
}

export function getEnabledLayers(state: WatermarkState): WatermarkLayer[] {
  return state.layers.filter((layer) => layer.enabled)
}

export async function exportWatermarkedImage(
  image: HTMLImageElement,
  state: WatermarkState,
  format: WatermarkOutputFormat,
  quality = 0.92,
  imageAssets: WatermarkImageAssets = {}
): Promise<Blob> {
  const canvas = document.createElement("canvas")
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  await renderWatermarkToCanvas(canvas, image, state, imageAssets, {
    flattenBackground: format === "image/jpeg",
  })

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("Failed to export watermark image")),
      format,
      format === "image/png" ? undefined : quality
    )
  })
}

export async function renderWatermarkToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  state: WatermarkState,
  imageAssets: WatermarkImageAssets = {},
  options: { flattenBackground?: boolean } = {}
): Promise<void> {
  const width = image.naturalWidth
  const height = image.naturalHeight
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Failed to get canvas context")
  }

  ctx.clearRect(0, 0, width, height)

  if (options.flattenBackground) {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)
  }

  ctx.drawImage(image, 0, 0, width, height)

  for (const layer of getEnabledLayers(state)) {
    if (layer.type === "text") {
      drawTextWatermark(ctx, layer, width, height)
    } else if (layer.imageSrc) {
      const watermarkImage =
        imageAssets[layer.imageSrc] ?? (await loadWatermarkImage(layer.imageSrc))
      drawImageWatermark(ctx, layer, watermarkImage, width, height)
    }
  }
}

export function getWatermarkOutputExtension(
  format: WatermarkOutputFormat
): "png" | "jpg" | "webp" {
  if (format === "image/jpeg") return "jpg"
  if (format === "image/webp") return "webp"
  return "png"
}

export function getWatermarkBaseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "") || "image"
}

function drawTextWatermark(
  ctx: CanvasRenderingContext2D,
  layer: WatermarkLayer,
  width: number,
  height: number
) {
  ctx.save()
  ctx.globalAlpha = layer.opacity
  ctx.fillStyle = layer.color
  ctx.shadowColor = "rgba(255,255,255,0.35)"
  ctx.shadowBlur = Math.max(1, Math.round(layer.fontSize * 0.04))
  ctx.font = `${layer.fontSize}px ${layer.fontFamily}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  if (layer.repeatMode === "repeat") {
    for (let y = -height; y <= height * 2; y += layer.spacingY) {
      for (let x = -width; x <= width * 2; x += layer.spacingX) {
        drawRotatedText(ctx, layer.text, x, y, layer.rotation)
      }
    }
  } else {
    drawRotatedText(
      ctx,
      layer.text,
      layer.x * width,
      layer.y * height,
      layer.rotation
    )
  }

  ctx.restore()
}

function drawImageWatermark(
  ctx: CanvasRenderingContext2D,
  layer: WatermarkLayer,
  image: HTMLImageElement,
  width: number,
  height: number
) {
  const aspectRatio =
    image.naturalWidth > 0 && image.naturalHeight > 0
      ? image.naturalWidth / image.naturalHeight
      : 1
  const layerWidth = layer.width
  const layerHeight = layer.height || layerWidth / aspectRatio

  ctx.save()
  ctx.globalAlpha = layer.opacity

  if (layer.repeatMode === "repeat") {
    for (let y = -height; y <= height * 2; y += layer.spacingY) {
      for (let x = -width; x <= width * 2; x += layer.spacingX) {
        drawRotatedImage(ctx, image, x, y, layerWidth, layerHeight, layer.rotation)
      }
    }
  } else {
    drawRotatedImage(
      ctx,
      image,
      layer.x * width,
      layer.y * height,
      layerWidth,
      layerHeight,
      layer.rotation
    )
  }

  ctx.restore()
}

function drawRotatedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  rotation: number
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.fillText(text, 0, 0)
  ctx.restore()
}

function drawRotatedImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(image, -width / 2, -height / 2, width, height)
  ctx.restore()
}

function loadWatermarkImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Failed to load watermark image"))
    image.src = src
  })
}
