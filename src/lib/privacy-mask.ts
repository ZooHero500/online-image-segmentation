export type PrivacyMaskEffect = "mosaic" | "blur" | "solid"
export type PrivacyMaskBrushMode = "mask" | "erase"
export type PrivacyMaskOutputFormat = "image/png" | "image/jpeg" | "image/webp"

export interface PrivacyMaskRegion {
  id: string
  x: number
  y: number
  width: number
  height: number
  effect: PrivacyMaskEffect
  strength: number
  color: string
  enabled: boolean
}

export interface PrivacyMaskPoint {
  x: number
  y: number
}

export interface PrivacyMaskBrushStroke {
  id: string
  mode: PrivacyMaskBrushMode
  points: PrivacyMaskPoint[]
  size: number
  effect: PrivacyMaskEffect
  strength: number
  color: string
  enabled: boolean
}

export interface PrivacyMaskImageLayer {
  id: string
  imageSrc: string
  imageName: string
  x: number
  y: number
  width: number
  height: number
  opacity: number
  rotation: number
  enabled: boolean
}

export interface PrivacyMaskState {
  regions: PrivacyMaskRegion[]
  strokes: PrivacyMaskBrushStroke[]
  imageLayers: PrivacyMaskImageLayer[]
  selectedRegionId: string | null
  selectedImageLayerId: string | null
}

export type PrivacyMaskImageAssets = Record<string, HTMLImageElement>

export interface PrivacyMaskRect {
  x: number
  y: number
  width: number
  height: number
}

let nextPrivacyMaskRegionId = 0
let nextPrivacyMaskBrushStrokeId = 0
let nextPrivacyMaskImageLayerId = 0

export function createPrivacyMaskRegion(
  overrides: Partial<PrivacyMaskRegion> = {}
): PrivacyMaskRegion {
  return {
    id: `pm-${++nextPrivacyMaskRegionId}`,
    x: 0,
    y: 0,
    width: 160,
    height: 96,
    effect: "mosaic",
    strength: 18,
    color: "#111827",
    enabled: true,
    ...overrides,
  }
}

export function createPrivacyMaskBrushStroke(
  overrides: Partial<PrivacyMaskBrushStroke> = {}
): PrivacyMaskBrushStroke {
  return {
    id: `pbs-${++nextPrivacyMaskBrushStrokeId}`,
    mode: "mask",
    points: [],
    size: 32,
    effect: "mosaic",
    strength: 18,
    color: "#111827",
    enabled: true,
    ...overrides,
  }
}

export function createPrivacyMaskImageLayer(
  overrides: Partial<PrivacyMaskImageLayer> = {}
): PrivacyMaskImageLayer {
  return {
    id: `pmi-${++nextPrivacyMaskImageLayerId}`,
    imageSrc: "",
    imageName: "mask.png",
    x: 0,
    y: 0,
    width: 160,
    height: 96,
    opacity: 1,
    rotation: 0,
    enabled: true,
    ...overrides,
  }
}

export function createPrivacyMaskState(
  input: PrivacyMaskRegion[] | Partial<PrivacyMaskState> = []
): PrivacyMaskState {
  const regions = Array.isArray(input) ? input : input.regions ?? []
  const strokes = Array.isArray(input) ? [] : input.strokes ?? []
  const imageLayers = Array.isArray(input) ? [] : input.imageLayers ?? []
  const selectedImageLayerId = Array.isArray(input)
    ? null
    : input.selectedImageLayerId ?? (regions.length > 0 ? null : imageLayers[0]?.id ?? null)
  const selectedRegionId = Array.isArray(input)
    ? regions[0]?.id ?? null
    : input.selectedRegionId ?? (selectedImageLayerId ? null : regions[0]?.id ?? null)

  return {
    regions,
    strokes,
    imageLayers,
    selectedRegionId,
    selectedImageLayerId,
  }
}

export function normalizePrivacyMaskRegion(
  rect: PrivacyMaskRect,
  imageWidth: number,
  imageHeight: number
): PrivacyMaskRect {
  const left = Math.min(rect.x, rect.x + rect.width)
  const right = Math.max(rect.x, rect.x + rect.width)
  const top = Math.min(rect.y, rect.y + rect.height)
  const bottom = Math.max(rect.y, rect.y + rect.height)

  const x = clamp(left, 0, imageWidth)
  const y = clamp(top, 0, imageHeight)
  const clippedRight = clamp(right, 0, imageWidth)
  const clippedBottom = clamp(bottom, 0, imageHeight)

  return {
    x,
    y,
    width: Math.max(0, clippedRight - x),
    height: Math.max(0, clippedBottom - y),
  }
}

export function updatePrivacyMaskRegion(
  state: PrivacyMaskState,
  regionId: string,
  patch: Partial<PrivacyMaskRegion>
): PrivacyMaskState {
  return {
    ...state,
    regions: state.regions.map((region) =>
      region.id === regionId ? { ...region, ...patch } : region
    ),
  }
}

export function removePrivacyMaskRegion(
  state: PrivacyMaskState,
  regionId: string
): PrivacyMaskState {
  const regions = state.regions.filter((region) => region.id !== regionId)
  return {
    ...state,
    regions,
    selectedRegionId:
      state.selectedRegionId === regionId
        ? regions.at(-1)?.id ?? null
        : state.selectedRegionId,
  }
}

export function updatePrivacyMaskBrushStroke(
  state: PrivacyMaskState,
  strokeId: string,
  patch: Partial<PrivacyMaskBrushStroke>
): PrivacyMaskState {
  return {
    ...state,
    strokes: state.strokes.map((stroke) =>
      stroke.id === strokeId ? { ...stroke, ...patch } : stroke
    ),
  }
}

export function updatePrivacyMaskImageLayer(
  state: PrivacyMaskState,
  layerId: string,
  patch: Partial<PrivacyMaskImageLayer>
): PrivacyMaskState {
  return {
    ...state,
    imageLayers: state.imageLayers.map((layer) =>
      layer.id === layerId ? { ...layer, ...patch } : layer
    ),
  }
}

export function removePrivacyMaskImageLayer(
  state: PrivacyMaskState,
  layerId: string
): PrivacyMaskState {
  const imageLayers = state.imageLayers.filter((layer) => layer.id !== layerId)
  return {
    ...state,
    imageLayers,
    selectedImageLayerId:
      state.selectedImageLayerId === layerId
        ? imageLayers.at(-1)?.id ?? null
        : state.selectedImageLayerId,
  }
}

export function getEnabledPrivacyMaskRegions(
  state: PrivacyMaskState
): PrivacyMaskRegion[] {
  return state.regions.filter((region) => region.enabled)
}

export function getEnabledPrivacyMaskBrushStrokes(
  state: PrivacyMaskState
): PrivacyMaskBrushStroke[] {
  return state.strokes.filter((stroke) => stroke.enabled)
}

export function getEnabledPrivacyMaskImageLayers(
  state: PrivacyMaskState
): PrivacyMaskImageLayer[] {
  return state.imageLayers.filter((layer) => layer.enabled && layer.imageSrc)
}

export async function exportPrivacyMaskedImage(
  image: HTMLImageElement,
  state: PrivacyMaskState,
  format: PrivacyMaskOutputFormat,
  quality = 0.92,
  imageAssets: PrivacyMaskImageAssets = {}
): Promise<Blob> {
  const canvas = document.createElement("canvas")

  await renderPrivacyMaskToCanvas(canvas, image, state, imageAssets, {
    flattenBackground: format === "image/jpeg",
  })

  return encodeCanvas(canvas, format, format === "image/png" ? undefined : quality)
}

export async function renderPrivacyMaskToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  state: PrivacyMaskState,
  imageAssets: PrivacyMaskImageAssets = {},
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

  for (const region of getEnabledPrivacyMaskRegions(state)) {
    drawPrivacyMaskRegion(ctx, canvas, region)
  }

  drawPrivacyMaskBrushStrokes(ctx, canvas, getEnabledPrivacyMaskBrushStrokes(state))
  await drawPrivacyMaskImageLayers(
    ctx,
    getEnabledPrivacyMaskImageLayers(state),
    imageAssets
  )
}

export function getPrivacyMaskOutputExtension(
  format: PrivacyMaskOutputFormat
): "png" | "jpg" | "webp" {
  if (format === "image/jpeg") return "jpg"
  if (format === "image/webp") return "webp"
  return "png"
}

export function getPrivacyMaskBaseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "") || "image"
}

function drawPrivacyMaskRegion(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  region: PrivacyMaskRegion
) {
  const rect = normalizeIntegerRect(region, canvas.width, canvas.height)
  if (rect.width <= 0 || rect.height <= 0) return

  if (region.effect === "solid") {
    ctx.fillStyle = region.color
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
    return
  }

  if (region.effect === "blur") {
    drawBlurRegion(ctx, canvas, rect, region.strength)
    return
  }

  drawMosaicRegion(ctx, canvas, rect, region.strength)
}

interface BrushMaskLayer {
  effect: PrivacyMaskEffect
  strength: number
  color: string
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

function drawPrivacyMaskBrushStrokes(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  strokes: PrivacyMaskBrushStroke[]
) {
  if (strokes.length === 0) return

  const maskLayers: BrushMaskLayer[] = []

  for (const stroke of strokes) {
    if (stroke.points.length === 0) continue

    if (stroke.mode === "erase") {
      for (const layer of maskLayers) {
        layer.ctx.save()
        layer.ctx.globalCompositeOperation = "destination-out"
        drawStrokePath(layer.ctx, stroke)
        layer.ctx.restore()
      }
      continue
    }

    const layer = getBrushMaskLayer(maskLayers, canvas, stroke)
    layer.ctx.save()
    layer.ctx.globalCompositeOperation = "source-over"
    drawStrokePath(layer.ctx, stroke)
    layer.ctx.restore()
  }

  for (const layer of maskLayers) {
    drawBrushMaskLayer(ctx, canvas, layer)
  }
}

function getBrushMaskLayer(
  layers: BrushMaskLayer[],
  sourceCanvas: HTMLCanvasElement,
  stroke: PrivacyMaskBrushStroke
): BrushMaskLayer {
  const existing = layers.find(
    (layer) =>
      layer.effect === stroke.effect &&
      layer.strength === stroke.strength &&
      layer.color === stroke.color
  )
  if (existing) return existing

  const canvas = document.createElement("canvas")
  canvas.width = sourceCanvas.width
  canvas.height = sourceCanvas.height
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Failed to get brush mask canvas context")
  }

  const layer = {
    effect: stroke.effect,
    strength: stroke.strength,
    color: stroke.color,
    canvas,
    ctx,
  }
  layers.push(layer)
  return layer
}

function drawBrushMaskLayer(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  layer: BrushMaskLayer
) {
  const effectCanvas = document.createElement("canvas")
  effectCanvas.width = sourceCanvas.width
  effectCanvas.height = sourceCanvas.height

  const effectCtx = effectCanvas.getContext("2d")
  if (!effectCtx) return

  if (layer.effect === "solid") {
    effectCtx.fillStyle = layer.color
    effectCtx.fillRect(0, 0, effectCanvas.width, effectCanvas.height)
  } else {
    effectCtx.drawImage(sourceCanvas, 0, 0)
    if (layer.effect === "blur") {
      drawBlurRegion(
        effectCtx,
        effectCanvas,
        { x: 0, y: 0, width: effectCanvas.width, height: effectCanvas.height },
        layer.strength
      )
    } else {
      drawMosaicRegion(
        effectCtx,
        effectCanvas,
        { x: 0, y: 0, width: effectCanvas.width, height: effectCanvas.height },
        layer.strength
      )
    }
  }

  effectCtx.save()
  effectCtx.globalCompositeOperation = "destination-in"
  effectCtx.drawImage(layer.canvas, 0, 0)
  effectCtx.restore()
  ctx.drawImage(effectCanvas, 0, 0)
}

function drawStrokePath(
  ctx: CanvasRenderingContext2D,
  stroke: PrivacyMaskBrushStroke
) {
  const [first, ...rest] = stroke.points
  if (!first) return

  ctx.fillStyle = "#000000"
  ctx.strokeStyle = "#000000"
  ctx.lineWidth = stroke.size
  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  if (rest.length === 0) {
    ctx.beginPath()
    ctx.arc(first.x, first.y, stroke.size / 2, 0, Math.PI * 2)
    ctx.fill()
    return
  }

  ctx.beginPath()
  ctx.moveTo(first.x, first.y)
  for (const point of rest) {
    ctx.lineTo(point.x, point.y)
  }
  ctx.stroke()
}

async function drawPrivacyMaskImageLayers(
  ctx: CanvasRenderingContext2D,
  layers: PrivacyMaskImageLayer[],
  imageAssets: PrivacyMaskImageAssets
) {
  for (const layer of layers) {
    const image = imageAssets[layer.imageSrc] ?? (await loadImage(layer.imageSrc))
    drawImageMaskLayer(ctx, layer, image)
  }
}

function drawImageMaskLayer(
  ctx: CanvasRenderingContext2D,
  layer: PrivacyMaskImageLayer,
  image: HTMLImageElement
) {
  ctx.save()
  ctx.globalAlpha = clamp(layer.opacity, 0, 1)
  ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2)
  ctx.rotate((layer.rotation * Math.PI) / 180)
  ctx.drawImage(image, -layer.width / 2, -layer.height / 2, layer.width, layer.height)
  ctx.restore()
}

function drawMosaicRegion(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  rect: PrivacyMaskRect,
  strength: number
) {
  const blockSize = clamp(Math.round(strength), 2, 80)
  const smallWidth = Math.max(1, Math.ceil(rect.width / blockSize))
  const smallHeight = Math.max(1, Math.ceil(rect.height / blockSize))
  const scratch = document.createElement("canvas")
  scratch.width = smallWidth
  scratch.height = smallHeight

  const scratchCtx = scratch.getContext("2d")
  if (!scratchCtx) return

  scratchCtx.drawImage(
    canvas,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    0,
    0,
    smallWidth,
    smallHeight
  )

  const previousSmoothing = ctx.imageSmoothingEnabled
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(
    scratch,
    0,
    0,
    smallWidth,
    smallHeight,
    rect.x,
    rect.y,
    rect.width,
    rect.height
  )
  ctx.imageSmoothingEnabled = previousSmoothing
}

function drawBlurRegion(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  rect: PrivacyMaskRect,
  strength: number
) {
  const radius = clamp(Math.round(strength), 1, 80)
  const padding = radius * 2
  const sourceX = Math.max(0, rect.x - padding)
  const sourceY = Math.max(0, rect.y - padding)
  const sourceRight = Math.min(canvas.width, rect.x + rect.width + padding)
  const sourceBottom = Math.min(canvas.height, rect.y + rect.height + padding)
  const sourceWidth = sourceRight - sourceX
  const sourceHeight = sourceBottom - sourceY
  const scratch = document.createElement("canvas")
  scratch.width = sourceWidth
  scratch.height = sourceHeight

  const scratchCtx = scratch.getContext("2d")
  if (!scratchCtx) return
  scratchCtx.drawImage(
    canvas,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    sourceWidth,
    sourceHeight
  )

  ctx.save()
  ctx.beginPath()
  ctx.rect(rect.x, rect.y, rect.width, rect.height)
  ctx.clip()
  ctx.filter = `blur(${radius}px)`
  ctx.drawImage(scratch, sourceX, sourceY, sourceWidth, sourceHeight)
  ctx.filter = "none"
  ctx.restore()
}

function normalizeIntegerRect(
  rect: PrivacyMaskRect,
  imageWidth: number,
  imageHeight: number
): PrivacyMaskRect {
  const normalized = normalizePrivacyMaskRegion(rect, imageWidth, imageHeight)
  const x = Math.floor(normalized.x)
  const y = Math.floor(normalized.y)
  const right = Math.ceil(normalized.x + normalized.width)
  const bottom = Math.ceil(normalized.y + normalized.height)

  return {
    x,
    y,
    width: Math.max(0, right - x),
    height: Math.max(0, bottom - y),
  }
}

function encodeCanvas(
  canvas: HTMLCanvasElement,
  format: PrivacyMaskOutputFormat,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("Failed to export privacy masked image")),
      format,
      quality
    )
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Failed to load mask image"))
    image.src = src
  })
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
