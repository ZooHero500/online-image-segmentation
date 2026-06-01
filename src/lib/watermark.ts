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
    color: "#ffffff",
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
  quality = 0.92
): Promise<Blob> {
  const canvas = document.createElement("canvas")
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Failed to get canvas context")
  }

  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

  for (const layer of getEnabledLayers(state)) {
    if (layer.type === "text") {
      drawTextWatermark(ctx, layer, canvas.width, canvas.height)
    }
  }

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

function drawTextWatermark(
  ctx: CanvasRenderingContext2D,
  layer: WatermarkLayer,
  width: number,
  height: number
) {
  ctx.save()
  ctx.globalAlpha = layer.opacity
  ctx.fillStyle = layer.color
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
