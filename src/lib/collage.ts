import {
  getCollageTemplate,
  getDefaultArtboardForTemplate,
  type CollageArtboard,
  type CollagePoint,
  type CollageTemplateId,
} from "./collage-presets"

export type CollageOutputFormat = "image/png" | "image/jpeg" | "image/webp"
export type CollageFitMode = "fill" | "fit"

export interface CollageFrameImage {
  imageId: string
  fitMode: CollageFitMode
  scale: number
  offsetX: number
  offsetY: number
  rotation: number
}

export interface CollageFrame {
  id: string
  slotId: string
  image: CollageFrameImage | null
}

export interface CollageImageAsset {
  id: string
  fileName: string
  image: HTMLImageElement
}

export type CollageImageAssetMap = Record<string, HTMLImageElement>

export interface CollageState {
  templateId: CollageTemplateId
  artboard: CollageArtboard
  frames: CollageFrame[]
  spacing: number
  margin: number
  cornerRadius: number
  backgroundColor: string
  transparentBackground: boolean
  selectedFrameId: string | null
}

export interface CollageFrameRect {
  frameId: string
  slotId: string
  x: number
  y: number
  width: number
  height: number
  polygon?: CollagePoint[]
  cornerMask?: CollageCornerMask
}

export interface CollageCornerMask {
  topLeft: boolean
  topRight: boolean
  bottomRight: boolean
  bottomLeft: boolean
}

export interface CollageImageTransformInput {
  fitMode: CollageFitMode
  scale: number
  offsetX: number
  offsetY: number
  rotation: number
}

export interface CollageImageTransform {
  x: number
  y: number
  width: number
  height: number
}

let nextCollageId = 0

function createId(prefix: string) {
  nextCollageId += 1
  return `${prefix}-${nextCollageId}`
}

function createFrames(templateId: CollageTemplateId): CollageFrame[] {
  return getCollageTemplate(templateId).slots.map((slot) => ({
    id: createId("cf"),
    slotId: slot.id,
    image: null,
  }))
}

export function createCollageFrameImage(
  imageId: string,
  patch: Partial<Omit<CollageFrameImage, "imageId">> = {}
): CollageFrameImage {
  return {
    imageId,
    fitMode: "fill",
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    ...patch,
  }
}

export function createCollageState(
  templateId: CollageTemplateId = "four-grid"
): CollageState {
  const frames = createFrames(templateId)

  return {
    templateId,
    artboard: getDefaultArtboardForTemplate(templateId),
    frames,
    spacing: 16,
    margin: 32,
    cornerRadius: 0,
    backgroundColor: "#ffffff",
    transparentBackground: false,
    selectedFrameId: frames[0]?.id ?? null,
  }
}

export function reframeCollageState(
  state: CollageState,
  templateId: CollageTemplateId
): CollageState {
  const previousImages = state.frames
    .map((frame) => frame.image)
    .filter((image): image is CollageFrameImage => image != null)
  const frames = createFrames(templateId).map((frame, index) => ({
    ...frame,
    image: previousImages[index]
      ? createCollageFrameImage(previousImages[index].imageId)
      : null,
  }))

  return {
    ...state,
    templateId,
    artboard: getDefaultArtboardForTemplate(templateId),
    frames,
    selectedFrameId: frames[0]?.id ?? null,
  }
}

export function assignImagesToFrames(
  state: CollageState,
  images: CollageImageAsset[]
): CollageState {
  const usedImageIds = new Set(
    state.frames
      .map((frame) => frame.image?.imageId)
      .filter((imageId): imageId is string => imageId != null)
  )
  const nextImages = images.filter((asset) => !usedImageIds.has(asset.id))
  let nextImageIndex = 0

  return {
    ...state,
    frames: state.frames.map((frame) => {
      if (frame.image) return frame
      const image = nextImages[nextImageIndex]
      nextImageIndex += 1
      if (!image) return frame

      return {
        ...frame,
        image: createCollageFrameImage(image.id),
      }
    }),
  }
}

export function switchCollageTemplate(
  state: CollageState,
  templateId: CollageTemplateId,
  images: CollageImageAsset[]
): CollageState {
  const next = createCollageState(templateId)

  return assignImagesToFrames(
    {
      ...next,
      spacing: state.spacing,
      margin: state.margin,
      cornerRadius: state.cornerRadius,
      backgroundColor: state.backgroundColor,
      transparentBackground: state.transparentBackground,
    },
    images
  )
}

export function updateFrameImage(
  state: CollageState,
  frameId: string,
  patch: Partial<CollageFrameImage> | null
): CollageState {
  return {
    ...state,
    frames: state.frames.map((frame) => {
      if (frame.id !== frameId) return frame
      if (!patch) return { ...frame, image: null }
      if (!frame.image) return frame

      return {
        ...frame,
        image: { ...frame.image, ...patch },
      }
    }),
  }
}

export function calculateFrameRects(state: CollageState): CollageFrameRect[] {
  const template = getCollageTemplate(state.templateId)
  const usableWidth = Math.max(1, state.artboard.width - state.margin * 2)
  const usableHeight = Math.max(1, state.artboard.height - state.margin * 2)
  const useOuterGridCorners =
    state.templateId === "four-grid" || state.templateId === "six-grid"

  return state.frames.map((frame) => {
    const slot = template.slots.find((item) => item.id === frame.slotId)
    if (!slot) {
      return {
        frameId: frame.id,
        slotId: frame.slotId,
        x: state.margin,
        y: state.margin,
        width: usableWidth,
        height: usableHeight,
        polygon: undefined,
        cornerMask: undefined,
      }
    }

    const leftGap = slot.x > 0 ? state.spacing / 2 : 0
    const rightGap = slot.x + slot.width < 1 ? state.spacing / 2 : 0
    const topGap = slot.y > 0 ? state.spacing / 2 : 0
    const bottomGap = slot.y + slot.height < 1 ? state.spacing / 2 : 0

    return {
      frameId: frame.id,
      slotId: frame.slotId,
      x: state.margin + slot.x * usableWidth + leftGap,
      y: state.margin + slot.y * usableHeight + topGap,
      width: Math.max(1, slot.width * usableWidth - leftGap - rightGap),
      height: Math.max(1, slot.height * usableHeight - topGap - bottomGap),
      polygon: slot.polygon,
      cornerMask:
        useOuterGridCorners && !slot.polygon
          ? {
              topLeft: slot.x === 0 && slot.y === 0,
              topRight: slot.x + slot.width >= 1 && slot.y === 0,
              bottomRight: slot.x + slot.width >= 1 && slot.y + slot.height >= 1,
              bottomLeft: slot.x === 0 && slot.y + slot.height >= 1,
            }
          : undefined,
    }
  })
}

export function getFramePathPoints(
  rect: Pick<CollageFrameRect, "x" | "y" | "width" | "height" | "polygon">
): CollagePoint[] {
  const polygon = rect.polygon
  if (polygon?.length) {
    return polygon.map((point) => ({
      x: rect.x + point.x * rect.width,
      y: rect.y + point.y * rect.height,
    }))
  }

  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ]
}

function formatPathNumber(value: number) {
  return Number(value.toFixed(3)).toString()
}

function getRoundedRectPathData(
  rect: Pick<CollageFrameRect, "x" | "y" | "width" | "height" | "cornerMask">,
  radius: number
) {
  const r = Math.max(0, Math.min(radius, rect.width / 2, rect.height / 2))
  const cornerMask = rect.cornerMask ?? {
    topLeft: true,
    topRight: true,
    bottomRight: true,
    bottomLeft: true,
  }

  if (r <= 0) return ""

  const x = formatPathNumber(rect.x)
  const y = formatPathNumber(rect.y)
  const right = formatPathNumber(rect.x + rect.width)
  const bottom = formatPathNumber(rect.y + rect.height)
  const tl = cornerMask.topLeft ? r : 0
  const tr = cornerMask.topRight ? r : 0
  const br = cornerMask.bottomRight ? r : 0
  const bl = cornerMask.bottomLeft ? r : 0
  const xTl = formatPathNumber(rect.x + tl)
  const xTr = formatPathNumber(rect.x + rect.width - tr)
  const yTr = formatPathNumber(rect.y + tr)
  const yBr = formatPathNumber(rect.y + rect.height - br)
  const xBr = formatPathNumber(rect.x + rect.width - br)
  const xBl = formatPathNumber(rect.x + bl)
  const yBl = formatPathNumber(rect.y + rect.height - bl)
  const yTl = formatPathNumber(rect.y + tl)

  return [
    `M ${xTl} ${y}`,
    `L ${xTr} ${y}`,
    tr > 0 ? `Q ${right} ${y} ${right} ${yTr}` : `L ${right} ${y}`,
    `L ${right} ${yBr}`,
    br > 0 ? `Q ${right} ${bottom} ${xBr} ${bottom}` : `L ${right} ${bottom}`,
    `L ${xBl} ${bottom}`,
    bl > 0 ? `Q ${x} ${bottom} ${x} ${yBl}` : `L ${x} ${bottom}`,
    `L ${x} ${yTl}`,
    tl > 0 ? `Q ${x} ${y} ${xTl} ${y}` : `L ${x} ${y}`,
    "Z",
  ].join(" ")
}

function getRoundedPolygonPathData(points: CollagePoint[], radius: number) {
  if (points.length < 3 || radius <= 0) return ""

  const corners = points.map((point, index) => {
    const prev = points[(index - 1 + points.length) % points.length]
    const next = points[(index + 1) % points.length]
    const prevVector = { x: prev.x - point.x, y: prev.y - point.y }
    const nextVector = { x: next.x - point.x, y: next.y - point.y }
    const prevLength = Math.hypot(prevVector.x, prevVector.y)
    const nextLength = Math.hypot(nextVector.x, nextVector.y)
    const distance = Math.min(radius, prevLength / 2, nextLength / 2)

    if (distance <= 0 || prevLength === 0 || nextLength === 0) {
      return { point, start: point, end: point }
    }

    return {
      point,
      start: {
        x: point.x + (prevVector.x / prevLength) * distance,
        y: point.y + (prevVector.y / prevLength) * distance,
      },
      end: {
        x: point.x + (nextVector.x / nextLength) * distance,
        y: point.y + (nextVector.y / nextLength) * distance,
      },
    }
  })

  const [firstCorner, ...restCorners] = corners
  return [
    `M ${formatPathNumber(firstCorner.end.x)} ${formatPathNumber(firstCorner.end.y)}`,
    ...restCorners.map((corner) =>
      [
        `L ${formatPathNumber(corner.start.x)} ${formatPathNumber(corner.start.y)}`,
        `Q ${formatPathNumber(corner.point.x)} ${formatPathNumber(corner.point.y)} ${formatPathNumber(corner.end.x)} ${formatPathNumber(corner.end.y)}`,
      ].join(" ")
    ),
    `L ${formatPathNumber(firstCorner.start.x)} ${formatPathNumber(firstCorner.start.y)}`,
    `Q ${formatPathNumber(firstCorner.point.x)} ${formatPathNumber(firstCorner.point.y)} ${formatPathNumber(firstCorner.end.x)} ${formatPathNumber(firstCorner.end.y)}`,
    "Z",
  ].join(" ")
}

function drawRoundedPolygonPath(
  ctx: CanvasRenderingContext2D,
  points: CollagePoint[],
  radius: number
) {
  if (points.length < 3 || radius <= 0) return false

  const corners = points.map((point, index) => {
    const prev = points[(index - 1 + points.length) % points.length]
    const next = points[(index + 1) % points.length]
    const prevVector = { x: prev.x - point.x, y: prev.y - point.y }
    const nextVector = { x: next.x - point.x, y: next.y - point.y }
    const prevLength = Math.hypot(prevVector.x, prevVector.y)
    const nextLength = Math.hypot(nextVector.x, nextVector.y)
    const distance = Math.min(radius, prevLength / 2, nextLength / 2)

    if (distance <= 0 || prevLength === 0 || nextLength === 0) {
      return { point, start: point, end: point }
    }

    return {
      point,
      start: {
        x: point.x + (prevVector.x / prevLength) * distance,
        y: point.y + (prevVector.y / prevLength) * distance,
      },
      end: {
        x: point.x + (nextVector.x / nextLength) * distance,
        y: point.y + (nextVector.y / nextLength) * distance,
      },
    }
  })

  const [firstCorner, ...restCorners] = corners
  ctx.beginPath()
  ctx.moveTo(firstCorner.end.x, firstCorner.end.y)
  for (const corner of restCorners) {
    ctx.lineTo(corner.start.x, corner.start.y)
    ctx.quadraticCurveTo(corner.point.x, corner.point.y, corner.end.x, corner.end.y)
  }
  ctx.lineTo(firstCorner.start.x, firstCorner.start.y)
  ctx.quadraticCurveTo(
    firstCorner.point.x,
    firstCorner.point.y,
    firstCorner.end.x,
    firstCorner.end.y
  )
  ctx.closePath()
  return true
}

export function getFramePathData(
  rect: Pick<
    CollageFrameRect,
    "x" | "y" | "width" | "height" | "polygon" | "cornerMask"
  >,
  radius = 0
): string {
  const points = getFramePathPoints(rect)
  if (points.length === 0) return ""

  if (rect.polygon?.length && radius > 0) {
    const roundedPath = getRoundedPolygonPathData(points, radius)
    if (roundedPath) return roundedPath
  }

  if (!rect.polygon?.length && radius > 0) {
    const roundedPath = getRoundedRectPathData(rect, radius)
    if (roundedPath) return roundedPath
  }

  const [first, ...rest] = points
  return [
    `M ${formatPathNumber(first.x)} ${formatPathNumber(first.y)}`,
    ...rest.map(
      (point) => `L ${formatPathNumber(point.x)} ${formatPathNumber(point.y)}`
    ),
    "Z",
  ].join(" ")
}

export function calculateImageTransform(
  image: HTMLImageElement,
  frameRect: Pick<CollageFrameRect, "x" | "y" | "width" | "height">,
  frameImage: CollageImageTransformInput
): CollageImageTransform {
  const imageWidth = image.naturalWidth || image.width
  const imageHeight = image.naturalHeight || image.height
  const baseScale =
    frameImage.fitMode === "fit"
      ? Math.min(frameRect.width / imageWidth, frameRect.height / imageHeight)
      : Math.max(frameRect.width / imageWidth, frameRect.height / imageHeight)
  const scale = baseScale * frameImage.scale
  const width = imageWidth * scale
  const height = imageHeight * scale

  return {
    x: frameRect.x + (frameRect.width - width) / 2 + frameImage.offsetX,
    y: frameRect.y + (frameRect.height - height) / 2 + frameImage.offsetY,
    width,
    height,
  }
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  cornerMask: CollageCornerMask = {
    topLeft: true,
    topRight: true,
    bottomRight: true,
    bottomLeft: true,
  }
) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2))
  ctx.beginPath()

  if (r <= 0) {
    ctx.rect(x, y, width, height)
    return
  }

  const tl = cornerMask.topLeft ? r : 0
  const tr = cornerMask.topRight ? r : 0
  const br = cornerMask.bottomRight ? r : 0
  const bl = cornerMask.bottomLeft ? r : 0

  ctx.moveTo(x + tl, y)
  ctx.lineTo(x + width - tr, y)
  if (tr > 0) ctx.quadraticCurveTo(x + width, y, x + width, y + tr)
  else ctx.lineTo(x + width, y)
  ctx.lineTo(x + width, y + height - br)
  if (br > 0) ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height)
  else ctx.lineTo(x + width, y + height)
  ctx.lineTo(x + bl, y + height)
  if (bl > 0) ctx.quadraticCurveTo(x, y + height, x, y + height - bl)
  else ctx.lineTo(x, y + height)
  ctx.lineTo(x, y + tl)
  if (tl > 0) ctx.quadraticCurveTo(x, y, x + tl, y)
  else ctx.lineTo(x, y)
  ctx.closePath()
}

function drawFramePath(ctx: CanvasRenderingContext2D, rect: CollageFrameRect, radius: number) {
  if (!rect.polygon?.length) {
    drawRoundedRectPath(
      ctx,
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      radius,
      rect.cornerMask
    )
    return
  }

  const points = getFramePathPoints(rect)
  if (drawRoundedPolygonPath(ctx, points, radius)) {
    return
  }

  ctx.beginPath()
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  })
  ctx.closePath()
}

export function renderCollageToCanvas(
  canvas: HTMLCanvasElement,
  state: CollageState,
  assets: CollageImageAssetMap,
  options: { forceBackground?: string } = {}
) {
  canvas.width = state.artboard.width
  canvas.height = state.artboard.height

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Failed to get canvas 2d context")
  }

  ctx.resetTransform()
  ctx.beginPath()
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const background = options.forceBackground
    ? options.forceBackground
    : state.transparentBackground
      ? null
      : state.backgroundColor

  if (background) {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const rects = calculateFrameRects(state)
  for (const frame of state.frames) {
    if (!frame.image) continue
    const image = assets[frame.image.imageId]
    const rect = rects.find((item) => item.frameId === frame.id)
    if (!image || !rect) continue

    ctx.save()
    ctx.beginPath()
    ctx.rect(rect.x, rect.y, rect.width, rect.height)
    ctx.clip()
    drawFramePath(ctx, rect, state.cornerRadius)
    ctx.clip()

    const transform = calculateImageTransform(image, rect, frame.image)
    const centerX = rect.x + rect.width / 2
    const centerY = rect.y + rect.height / 2
    ctx.translate(centerX, centerY)
    ctx.rotate((frame.image.rotation * Math.PI) / 180)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(image, transform.x, transform.y, transform.width, transform.height)
    ctx.restore()
  }
}

export function exportCollageImage(
  state: CollageState,
  assets: CollageImageAssetMap,
  format: CollageOutputFormat,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    renderCollageToCanvas(canvas, state, assets, {
      forceBackground:
        format !== "image/png" && state.transparentBackground ? "#ffffff" : undefined,
    })

    const outputQuality = format === "image/png" ? undefined : quality
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }
        reject(new Error("Failed to create collage blob"))
      },
      format,
      outputQuality
    )
  })
}

export function getCollageOutputExtension(format: CollageOutputFormat): string {
  switch (format) {
    case "image/jpeg":
      return "jpg"
    case "image/webp":
      return "webp"
    case "image/png":
      return "png"
  }
}

function stripExtension(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "")
}

export function getCollageBaseName(fileNames: string[]): string {
  if (fileNames.length === 0) return "collage"
  if (fileNames.length === 1) return `${stripExtension(fileNames[0])}_collage`
  return "photo-collage"
}
