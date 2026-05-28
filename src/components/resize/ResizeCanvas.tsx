"use client"

import { useRef, useCallback, useEffect, useState, useMemo } from "react"
import { useTheme } from "next-themes"
import { Stage, Layer, Rect, Image, Transformer, Group, Line } from "@/lib/konva"
import { useTranslations } from "next-intl"
import { Upload } from "lucide-react"
import { ACCEPTED_TYPES } from "@/lib/upload-utils"
import { calculateInitialCropRect } from "@/lib/resize-utils"
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
  cropAspectRatio?: number | null
}

const SNAP_THRESHOLD = 8
const ZOOM_FACTOR = 1.05
const CHECKER_SIZE = 10
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
  cropAspectRatio,
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
  const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)

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
    // Force cursor when entering/leaving crop mode
    if (containerRef.current) {
      containerRef.current.style.cursor = mode === "crop" ? "crosshair" : "grab"
    }
  }, [mode])

  // Cursor helper — crop mode always forces crosshair
  const setCursor = useCallback((cursor: string) => {
    if (!containerRef.current) return
    containerRef.current.style.cursor = mode === "crop" ? "crosshair" : cursor
  }, [mode])

  const srcW = transform.crop ? transform.crop.width : image?.naturalWidth ?? 0
  const srcH = transform.crop ? transform.crop.height : image?.naturalHeight ?? 0
  const displayW = srcW * transform.scale
  const displayH = srcH * transform.scale

  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const checkerboardPattern = useMemo(() => {
    if (typeof document === "undefined") return undefined
    const color1 = isDark ? "#2a2a2a" : "#f0f0f0"
    const color2 = isDark ? "#333333" : "#ffffff"
    const size = CHECKER_SIZE * 2
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) return undefined
    ctx.fillStyle = color2
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = color1
    ctx.fillRect(0, 0, CHECKER_SIZE, CHECKER_SIZE)
    ctx.fillRect(CHECKER_SIZE, CHECKER_SIZE, CHECKER_SIZE, CHECKER_SIZE)
    return canvas
  }, [isDark])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && document.activeElement === document.body) {
        e.preventDefault()
        isPanningRef.current = true
        setIsPanning(true)
        setCursor("grab")
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isPanningRef.current = false
        setIsPanning(false)
        setCursor("")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [setCursor])

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

  // --- Touch: pinch zoom + single-finger pan ---
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null)
  const lastPinchDistRef = useRef<number | null>(null)

  const handleTouchStart = useCallback((e: Konva.KonvaEventObject<TouchEvent>) => {
    const touches = e.evt.touches
    if (touches.length === 1) {
      // Single finger — pan the viewport (on background)
      const isBackground = e.target === e.target.getStage() || e.target.name() === "artboard" || e.target.name() === "artboard-shadow"
      if (isBackground) {
        lastTouchRef.current = { x: touches[0].clientX, y: touches[0].clientY }
      }
    } else if (touches.length === 2) {
      // Two fingers — prepare pinch
      e.evt.preventDefault()
      const dx = touches[0].clientX - touches[1].clientX
      const dy = touches[0].clientY - touches[1].clientY
      lastPinchDistRef.current = Math.sqrt(dx * dx + dy * dy)
      const cx = (touches[0].clientX + touches[1].clientX) / 2
      const cy = (touches[0].clientY + touches[1].clientY) / 2
      lastTouchRef.current = { x: cx, y: cy }
    }
  }, [])

  const handleTouchMove = useCallback((e: Konva.KonvaEventObject<TouchEvent>) => {
    const touches = e.evt.touches
    if (touches.length === 1 && lastTouchRef.current) {
      // Single finger pan
      const dx = touches[0].clientX - lastTouchRef.current.x
      const dy = touches[0].clientY - lastTouchRef.current.y
      lastTouchRef.current = { x: touches[0].clientX, y: touches[0].clientY }
      onPan(dx, dy)
    } else if (touches.length === 2 && lastPinchDistRef.current !== null) {
      e.evt.preventDefault()
      const dx = touches[0].clientX - touches[1].clientX
      const dy = touches[0].clientY - touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const factor = dist / lastPinchDistRef.current
      lastPinchDistRef.current = dist

      // Pinch center
      const cx = (touches[0].clientX + touches[1].clientX) / 2
      const cy = (touches[0].clientY + touches[1].clientY) / 2

      // Also pan while pinching
      if (lastTouchRef.current) {
        onPan(cx - lastTouchRef.current.x, cy - lastTouchRef.current.y)
      }
      lastTouchRef.current = { x: cx, y: cy }

      // Get center relative to stage
      const stage = stageRef.current
      if (stage) {
        const rect = stage.container().getBoundingClientRect()
        onZoomAtPoint(cx - rect.left, cy - rect.top, factor)
      }
    }
  }, [onPan, onZoomAtPoint])

  const handleTouchEnd = useCallback(() => {
    lastTouchRef.current = null
    lastPinchDistRef.current = null
  }, [])

  // Track whether a stage-level pan is in progress (click on empty area or Space+drag)
  const isStagePanningRef = useRef(false)

  const handleStageMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Space+drag OR click on stage/artboard background → start panning
      const isBackground = e.target === e.target.getStage() || e.target.name() === "artboard" || e.target.name() === "artboard-shadow"
      if (isPanningRef.current || isBackground) {
        isStagePanningRef.current = true
        panStartRef.current = { x: e.evt.clientX, y: e.evt.clientY }
        setCursor("grabbing")
      }
    },
    [setCursor]
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
    setCursor("grab")
  }, [setCursor])

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

    onCropRectChange(calculateInitialCropRect(
      image.naturalWidth,
      image.naturalHeight,
      transform,
      canvasWidth,
      canvasHeight
    ))
    onModeChange("crop")
  }, [image, transform, mode, canvasWidth, canvasHeight, onCropRectChange, onModeChange, onApplyCrop])

  const handleImageDragStart = useCallback(() => {
    setIsDraggingImage(true)
    // Auto-select on drag start (Canva behavior)
    if (mode !== "selected") onModeChange("selected")
    setCursor("grabbing")
  }, [mode, onModeChange, setCursor])

  // Offset used for rotation center — must be subtracted when reading drag position
  const halfW = displayW * viewportScale / 2
  const halfH = displayH * viewportScale / 2

  const handleImageDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      // e.target.x() includes the center offset, subtract it to get visual top-left
      const artX = (e.target.x() - halfW - artboardX) / viewportScale
      const artY = (e.target.y() - halfH - artboardY) / viewportScale
      const snap = calculateSnap(
        artX, artY, displayW, displayH,
        { width: canvasWidth, height: canvasHeight },
        SNAP_THRESHOLD / viewportScale
      )
      e.target.x(artboardX + snap.snappedX * viewportScale + halfW)
      e.target.y(artboardY + snap.snappedY * viewportScale + halfH)
      setSnapGuides({ x: snap.guidesX, y: snap.guidesY })
    },
    [artboardX, artboardY, viewportScale, displayW, displayH, canvasWidth, canvasHeight, halfW, halfH]
  )

  const handleImageDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      setIsDraggingImage(false)
      setSnapGuides({ x: [], y: [] })
      setCursor("grab")
      const newX = (e.target.x() - halfW - artboardX) / viewportScale
      const newY = (e.target.y() - halfH - artboardY) / viewportScale
      onTransformChange({ ...transform, x: newX, y: newY })
    },
    [transform, onTransformChange, artboardX, artboardY, viewportScale, halfW, halfH, setCursor]
  )

  const handleTransformEnd = useCallback(() => {
    const node = imageRef.current
    if (!node) return
    const scaleX = node.scaleX()
    const newScale = transform.scale * Math.abs(scaleX)
    const newX = (node.x() - halfW - artboardX) / viewportScale
    const newY = (node.y() - halfH - artboardY) / viewportScale
    onTransformChange({ ...transform, x: newX, y: newY, scale: newScale })
    // Reset Konva scale but preserve flip direction
    node.scaleX(transform.flipX ? -1 : 1)
    node.scaleY(transform.flipY ? -1 : 1)
  }, [transform, onTransformChange, artboardX, artboardY, viewportScale, halfW, halfH])

  const handleImageMouseEnter = useCallback(() => {
    if (isPanningRef.current || isDraggingImage) return
    setCursor("grab")
  }, [isDraggingImage, setCursor])

  const handleImageMouseLeave = useCallback(() => {
    if (isPanningRef.current || isDraggingImage) return
    setCursor("grab")
  }, [isDraggingImage, setCursor])

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
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-accent/5 pointer-events-none">
          <div
            className="flex items-center justify-center border-2 border-dashed border-accent rounded-lg transition-transform duration-200 scale-[1.02]"
            style={{
              left: artboardX,
              top: artboardY,
              width: artboardDisplayW + 24,
              height: artboardDisplayH + 24,
              position: "absolute",
              transform: "translate(-12px, -12px) scale(1.02)",
              marginLeft: artboardX,
              marginTop: artboardY,
            }}
          />
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Layer>
          <Rect name="artboard-shadow" x={artboardX} y={artboardY} width={artboardDisplayW} height={artboardDisplayH} shadowColor="rgba(0,0,0,0.12)" shadowBlur={12} shadowOffsetY={3} listening={false} />

          {/* Artboard background: checkerboard if available, solid white fallback */}
          {checkerboardPattern ? (
            <Rect name="artboard" x={artboardX} y={artboardY} width={artboardDisplayW} height={artboardDisplayH} fillPatternImage={checkerboardPattern as unknown as HTMLImageElement} fillPatternScaleX={1} fillPatternScaleY={1} fillPatternRepeat="repeat" stroke="#d4d4d4" strokeWidth={1} />
          ) : (
            <Rect name="artboard" x={artboardX} y={artboardY} width={artboardDisplayW} height={artboardDisplayH} fill="#ffffff" stroke="#d4d4d4" strokeWidth={1} />
          )}

          {image && (
            <Group clipX={artboardX} clipY={artboardY} clipWidth={artboardDisplayW} clipHeight={artboardDisplayH}>
              <Image
                ref={imageRef}
                image={image}
                x={artboardX + transform.x * viewportScale + displayW * viewportScale / 2}
                y={artboardY + transform.y * viewportScale + displayH * viewportScale / 2}
                width={displayW * viewportScale}
                height={displayH * viewportScale}
                offsetX={displayW * viewportScale / 2}
                offsetY={displayH * viewportScale / 2}
                rotation={transform.rotation || 0}
                scaleX={transform.flipX ? -1 : 1}
                scaleY={transform.flipY ? -1 : 1}
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
              artboardBounds={{ x: artboardX, y: artboardY, width: artboardDisplayW, height: artboardDisplayH }}
              aspectRatio={cropAspectRatio}
              touchDevice={isTouchDevice}
              onCursorChange={(cursor) => {
                if (containerRef.current) containerRef.current.style.cursor = cursor
              }}
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
