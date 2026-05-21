"use client"

import { useRef, useCallback, useEffect, useState, useMemo } from "react"
import { Stage, Layer, Rect, Image, Transformer, Group, Line } from "@/lib/konva"
import { useTranslations } from "next-intl"
import { Upload } from "lucide-react"
import { ACCEPTED_TYPES } from "@/lib/upload-utils"
import { calculateSnap, type SnapGuide } from "@/lib/resize-snap"
import type { ResizeImageTransform, ResizeEditorMode, CropRect } from "@/types"
import type Konva from "konva"
import { CropOverlay } from "./CropOverlay"

interface ResizeCanvasProps {
  canvasWidth: number
  canvasHeight: number
  image: HTMLImageElement | null
  transform: ResizeImageTransform
  onTransformChange: (t: ResizeImageTransform) => void
  mode: ResizeEditorMode
  onModeChange: (m: ResizeEditorMode) => void
  cropRect: CropRect | null
  onCropRectChange: (r: CropRect | null) => void
  onImageFile: (file: File) => void
  onApplyCrop?: () => void
  viewportScale: number
  viewportPosition: { x: number; y: number }
  onZoomAtPoint: (screenX: number, screenY: number, factor: number) => void
  onPan: (dx: number, dy: number) => void
}

const SNAP_THRESHOLD = 8
const ZOOM_FACTOR = 1.05
const CHECKER_SIZE = 10
const CHECKER_COLOR_1 = "#f0f0f0"
const CHECKER_COLOR_2 = "#ffffff"
const SNAP_LINE_COLOR = "#3b82f6"

export function ResizeCanvas({
  canvasWidth,
  canvasHeight,
  image,
  transform,
  onTransformChange,
  mode,
  onModeChange,
  cropRect,
  onCropRectChange,
  onImageFile,
  onApplyCrop,
  viewportScale,
  viewportPosition,
  onZoomAtPoint,
  onPan,
}: ResizeCanvasProps) {
  const t = useTranslations("resize")
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const imageRef = useRef<Konva.Image>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
  const [isDragOver, setIsDragOver] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const isPanningRef = useRef(false)
  const panStartRef = useRef({ x: 0, y: 0 })
  const [snapGuides, setSnapGuides] = useState<{ x: SnapGuide[]; y: SnapGuide[] }>({ x: [], y: [] })
  const [isDraggingImage, setIsDraggingImage] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height })
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const artboardX = viewportPosition.x
  const artboardY = viewportPosition.y
  const artboardDisplayW = canvasWidth * viewportScale
  const artboardDisplayH = canvasHeight * viewportScale

  useEffect(() => {
    if (mode === "selected" && imageRef.current && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    } else if (transformerRef.current) {
      transformerRef.current.nodes([])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [mode])

  const srcW = transform.crop ? transform.crop.width : image?.naturalWidth ?? 0
  const srcH = transform.crop ? transform.crop.height : image?.naturalHeight ?? 0
  const displayW = srcW * transform.scale
  const displayH = srcH * transform.scale

  const checkerboardImage = useMemo(() => {
    if (typeof document === "undefined") return undefined
    const size = CHECKER_SIZE * 2
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) return undefined
    ctx.fillStyle = CHECKER_COLOR_2
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = CHECKER_COLOR_1
    ctx.fillRect(0, 0, CHECKER_SIZE, CHECKER_SIZE)
    ctx.fillRect(CHECKER_SIZE, CHECKER_SIZE, CHECKER_SIZE, CHECKER_SIZE)
    const img = new window.Image()
    img.src = canvas.toDataURL()
    return img
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && document.activeElement === document.body) {
        e.preventDefault()
        isPanningRef.current = true
        setIsPanning(true)
        if (containerRef.current) containerRef.current.style.cursor = "grab"
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isPanningRef.current = false
        setIsPanning(false)
        if (containerRef.current) containerRef.current.style.cursor = ""
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault()
      const stage = stageRef.current
      if (!stage) return
      const pointer = stage.getPointerPosition()
      if (!pointer) return
      if (isPanningRef.current) {
        onPan(-e.evt.deltaX, -e.evt.deltaY)
        return
      }
      const direction = e.evt.deltaY > 0 ? -1 : 1
      const factor = direction > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR
      onZoomAtPoint(pointer.x, pointer.y, factor)
    },
    [onZoomAtPoint, onPan]
  )

  // Track whether a stage-level pan is in progress (click on empty area or Space+drag)
  const isStagePanningRef = useRef(false)

  const handleStageMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Space+drag OR click on stage/artboard background → start panning
      const isBackground = e.target === e.target.getStage() || e.target.name() === "artboard" || e.target.name() === "artboard-shadow"
      if (isPanningRef.current || isBackground) {
        isStagePanningRef.current = true
        panStartRef.current = { x: e.evt.clientX, y: e.evt.clientY }
        if (containerRef.current) containerRef.current.style.cursor = "grabbing"
      }
    },
    []
  )

  const handleStageMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (isStagePanningRef.current && e.evt.buttons === 1) {
        const dx = e.evt.clientX - panStartRef.current.x
        const dy = e.evt.clientY - panStartRef.current.y
        panStartRef.current = { x: e.evt.clientX, y: e.evt.clientY }
        onPan(dx, dy)
      }
    },
    [onPan]
  )

  const handleStageMouseUp = useCallback(() => {
    isStagePanningRef.current = false
    if (containerRef.current) containerRef.current.style.cursor = "grab"
  }, [])

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (isPanningRef.current) return
      if (e.target === e.target.getStage() || e.target.name() === "artboard" || e.target.name() === "checkerboard") {
        if (mode === "selected") onModeChange("idle")
      }
    },
    [mode, onModeChange]
  )

  const handleImageClick = useCallback(() => {
    if (isPanningRef.current) return
    if (mode !== "selected") onModeChange("selected")
  }, [mode, onModeChange])

  const handleImageDblClick = useCallback(() => {
    if (!image || isPanningRef.current) return

    // If already in crop mode, double-click = confirm crop
    if (mode === "crop") {
      onApplyCrop?.()
      return
    }

    // Compute display dimensions fresh from current transform (avoid stale closure)
    const curSrcW = transform.crop ? transform.crop.width : image.naturalWidth
    const curSrcH = transform.crop ? transform.crop.height : image.naturalHeight
    const curDisplayW = curSrcW * transform.scale
    const curDisplayH = curSrcH * transform.scale

    // Crop rect = intersection of image rect and artboard rect
    const imgLeft = transform.x
    const imgTop = transform.y
    const imgRight = transform.x + curDisplayW
    const imgBottom = transform.y + curDisplayH

    const x1 = Math.max(0, imgLeft)
    const y1 = Math.max(0, imgTop)
    const x2 = Math.min(canvasWidth, imgRight)
    const y2 = Math.min(canvasHeight, imgBottom)

    const newCropRect = {
      x: x1,
      y: y1,
      width: Math.max(20, x2 - x1),
      height: Math.max(20, y2 - y1),
    }
    onCropRectChange(newCropRect)
    onModeChange("crop")
  }, [image, transform, mode, canvasWidth, canvasHeight, onCropRectChange, onModeChange, onApplyCrop])

  const handleImageDragStart = useCallback(() => {
    setIsDraggingImage(true)
    // Auto-select on drag start (Canva behavior)
    if (mode !== "selected") onModeChange("selected")
    if (containerRef.current) containerRef.current.style.cursor = "grabbing"
  }, [mode, onModeChange])

  const handleImageDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const artX = (e.target.x() - artboardX) / viewportScale
      const artY = (e.target.y() - artboardY) / viewportScale
      const snap = calculateSnap(
        artX, artY, displayW, displayH,
        { width: canvasWidth, height: canvasHeight },
        SNAP_THRESHOLD / viewportScale
      )
      e.target.x(artboardX + snap.snappedX * viewportScale)
      e.target.y(artboardY + snap.snappedY * viewportScale)
      setSnapGuides({ x: snap.guidesX, y: snap.guidesY })
    },
    [artboardX, artboardY, viewportScale, displayW, displayH, canvasWidth, canvasHeight]
  )

  const handleImageDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      setIsDraggingImage(false)
      setSnapGuides({ x: [], y: [] })
      if (containerRef.current) containerRef.current.style.cursor = "grab"
      const newX = (e.target.x() - artboardX) / viewportScale
      const newY = (e.target.y() - artboardY) / viewportScale
      onTransformChange({ ...transform, x: newX, y: newY })
    },
    [transform, onTransformChange, artboardX, artboardY, viewportScale]
  )

  const handleTransformEnd = useCallback(() => {
    const node = imageRef.current
    if (!node) return
    const scaleX = node.scaleX()
    const newScale = transform.scale * scaleX
    const newX = (node.x() - artboardX) / viewportScale
    const newY = (node.y() - artboardY) / viewportScale
    onTransformChange({ ...transform, x: newX, y: newY, scale: newScale })
    node.scaleX(1)
    node.scaleY(1)
  }, [transform, onTransformChange, artboardX, artboardY, viewportScale])

  const handleImageMouseEnter = useCallback(() => {
    if (isPanningRef.current || isDraggingImage) return
    if (containerRef.current && mode !== "crop") containerRef.current.style.cursor = "grab"
  }, [mode, isDraggingImage])

  const handleImageMouseLeave = useCallback(() => {
    if (isPanningRef.current || isDraggingImage) return
    if (containerRef.current) containerRef.current.style.cursor = "grab"
  }, [isDraggingImage])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file && ACCEPTED_TYPES.includes(file.type)) onImageFile(file)
    },
    [onImageFile]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onImageFile(file)
      if (inputRef.current) inputRef.current.value = ""
    },
    [onImageFile]
  )

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 bg-muted/30 overflow-hidden ${mode === "crop" ? "cursor-crosshair" : "cursor-grab"}`}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false) }}
    >
      {isDragOver && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-accent/10 border-2 border-dashed border-accent pointer-events-none">
          <p className="text-accent text-sm uppercase tracking-wider">{t("uploadHint")}</p>
        </div>
      )}
      {!image && (
        <div
          className="absolute z-10 flex flex-col items-center justify-center cursor-pointer"
          style={{
            left: artboardX,
            top: artboardY,
            width: artboardDisplayW,
            height: artboardDisplayH,
          }}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-1">{t("uploadHint")}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">{t("uploadFormats")}</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(",")} className="hidden" onChange={handleFileChange} />

      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        onClick={handleStageClick}
        onWheel={handleWheel}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
      >
        <Layer>
          <Rect name="artboard-shadow" x={artboardX} y={artboardY} width={artboardDisplayW} height={artboardDisplayH} shadowColor="rgba(0,0,0,0.12)" shadowBlur={12} shadowOffsetY={3} listening={false} />

          {/* Artboard background: checkerboard if available, solid white fallback */}
          {checkerboardImage ? (
            <Rect name="artboard" x={artboardX} y={artboardY} width={artboardDisplayW} height={artboardDisplayH} fillPatternImage={checkerboardImage} fillPatternScaleX={1} fillPatternScaleY={1} fillPatternRepeat="repeat" stroke="#d4d4d4" strokeWidth={1} />
          ) : (
            <Rect name="artboard" x={artboardX} y={artboardY} width={artboardDisplayW} height={artboardDisplayH} fill="#ffffff" stroke="#d4d4d4" strokeWidth={1} />
          )}

          {image && (
            <Group clipX={artboardX} clipY={artboardY} clipWidth={artboardDisplayW} clipHeight={artboardDisplayH}>
              <Image
                ref={imageRef}
                image={image}
                x={artboardX + transform.x * viewportScale}
                y={artboardY + transform.y * viewportScale}
                width={displayW * viewportScale}
                height={displayH * viewportScale}
                crop={transform.crop ? { x: transform.crop.x, y: transform.crop.y, width: transform.crop.width, height: transform.crop.height } : undefined}
                draggable={mode !== "crop" && !isPanning}
                onClick={handleImageClick}
                onDblClick={handleImageDblClick}
                onDragStart={handleImageDragStart}
                onDragMove={handleImageDragMove}
                onDragEnd={handleImageDragEnd}
                onMouseEnter={handleImageMouseEnter}
                onMouseLeave={handleImageMouseLeave}
                shadowColor={isDraggingImage ? "rgba(0,0,0,0.25)" : undefined}
                shadowBlur={isDraggingImage ? 8 : 0}
                shadowOffsetY={isDraggingImage ? 4 : 0}
              />
            </Group>
          )}

          {mode === "selected" && (
            <Transformer
              ref={transformerRef}
              rotateEnabled={false}
              enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
              keepRatio={true}
              anchorSize={10}
              anchorCornerRadius={1}
              anchorFill="#0d99ff"
              anchorStroke="#0d99ff"
              anchorStrokeWidth={0}
              borderStroke="#0d99ff"
              borderStrokeWidth={1.5}
              borderDash={[]}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 20 || newBox.height < 20) return oldBox
                return newBox
              }}
              onTransformEnd={handleTransformEnd}
            />
          )}

          {/* Snap guides — only visible while dragging */}
          {isDraggingImage && snapGuides.x.map((guide, i) => (
            <Line key={`sx-${i}`} points={[artboardX + guide.pos * viewportScale, artboardY, artboardX + guide.pos * viewportScale, artboardY + artboardDisplayH]} stroke={SNAP_LINE_COLOR} strokeWidth={1} dash={guide.type === "center" ? [4, 4] : undefined} listening={false} />
          ))}
          {isDraggingImage && snapGuides.y.map((guide, i) => (
            <Line key={`sy-${i}`} points={[artboardX, artboardY + guide.pos * viewportScale, artboardX + artboardDisplayW, artboardY + guide.pos * viewportScale]} stroke={SNAP_LINE_COLOR} strokeWidth={1} dash={guide.type === "center" ? [4, 4] : undefined} listening={false} />
          ))}

          {mode === "crop" && cropRect && image && (
            <CropOverlay
              cropRect={{ x: artboardX + cropRect.x * viewportScale, y: artboardY + cropRect.y * viewportScale, width: cropRect.width * viewportScale, height: cropRect.height * viewportScale }}
              imageBounds={{ x: artboardX + transform.x * viewportScale, y: artboardY + transform.y * viewportScale, width: displayW * viewportScale, height: displayH * viewportScale }}
              onCropChange={(displayRect) => {
                onCropRectChange({
                  x: (displayRect.x - artboardX) / viewportScale,
                  y: (displayRect.y - artboardY) / viewportScale,
                  width: displayRect.width / viewportScale,
                  height: displayRect.height / viewportScale,
                })
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  )
}
