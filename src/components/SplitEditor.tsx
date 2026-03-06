"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Stage, Layer, Image as KonvaImage, Line, Rect } from "react-konva"
import type Konva from "konva"
import { Button } from "@/components/ui/button"
import { UploadZone } from "./UploadZone"
import { ResultSheet } from "./ResultSheet"
import { Ruler, CornerBlock, DragPreviewLine } from "./Ruler"
import { ZoomIndicator } from "./ZoomIndicator"
import { useSplitLines } from "@/hooks/use-split-lines"
import { useImageExport } from "@/hooks/use-image-export"
import { useRulerDrag } from "@/hooks/use-ruler-drag"
import { useCanvasViewport } from "@/hooks/use-canvas-viewport"
import { consumePendingUpload } from "@/lib/pending-upload"
import { toast } from "sonner"
import type { SplitLine, UploadResult } from "@/types"
import { X } from "lucide-react"

const RULER_THICKNESS = 20
const IMAGE_GAP = 40 // gap between images in image-space pixels

interface ImageItem {
  image: HTMLImageElement
  fileName: string
  mimeType: string
}

interface LayoutResult {
  direction: "vertical" | "horizontal"
  offsets: { x: number; y: number }[]
  totalWidth: number
  totalHeight: number
}

function calculateLayout(images: ImageItem[]): LayoutResult {
  if (images.length === 0)
    return { direction: "vertical", offsets: [], totalWidth: 1, totalHeight: 1 }

  if (images.length === 1) {
    const img = images[0].image
    return {
      direction: "vertical",
      offsets: [{ x: 0, y: 0 }],
      totalWidth: img.naturalWidth,
      totalHeight: img.naturalHeight,
    }
  }

  // Heuristic: landscape images (width >= height) → stack vertically; portrait → horizontal
  const avgAspect =
    images.reduce(
      (sum, item) =>
        sum + item.image.naturalWidth / item.image.naturalHeight,
      0
    ) / images.length

  const direction: "vertical" | "horizontal" = avgAspect >= 1 ? "vertical" : "horizontal"
  const offsets: { x: number; y: number }[] = []

  if (direction === "vertical") {
    let y = 0
    let maxW = 0
    for (const item of images) {
      offsets.push({ x: 0, y })
      y += item.image.naturalHeight + IMAGE_GAP
      maxW = Math.max(maxW, item.image.naturalWidth)
    }
    return { direction, offsets, totalWidth: maxW, totalHeight: y - IMAGE_GAP }
  } else {
    let x = 0
    let maxH = 0
    for (const item of images) {
      offsets.push({ x, y: 0 })
      x += item.image.naturalWidth + IMAGE_GAP
      maxH = Math.max(maxH, item.image.naturalHeight)
    }
    return { direction, offsets, totalWidth: x - IMAGE_GAP, totalHeight: maxH }
  }
}

interface SplitEditorProps {
  onSplitComplete?: (isFirstSplit: boolean) => void
  onImageUpload?: (uploadCount: number) => void
  onSaveHistory?: (data: {
    originalFileName: string
    originalMimeType: string
    lines: SplitLine[]
    imageBlob: Blob
    thumbnailDataUrl: string
  }) => void
  initialState?: {
    imageBlob: Blob
    lines: SplitLine[]
    originalFileName: string
    originalMimeType: string
  }
  showShortcutHints?: boolean
}

function getFileExtension(mimeType: string): string {
  if (mimeType === "image/webp") return "png"
  if (mimeType === "image/jpeg") return "jpg"
  if (mimeType === "image/png") return "png"
  return "png"
}

function getFileNameWithoutExtension(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "")
}

export function SplitEditor({
  onSplitComplete,
  onImageUpload,
  onSaveHistory,
  initialState,
  showShortcutHints = false,
}: SplitEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorAreaRef = useRef<HTMLDivElement>(null)
  const stageContainerRef = useRef<HTMLDivElement>(null)
  const [images, setImages] = useState<ImageItem[]>([])
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null)
  const [splitCount, setSplitCount] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const uploadCountRef = useRef(0)

  const isMultiImage = images.length > 1

  // Layout calculation
  const layout = useMemo(() => calculateLayout(images), [images])

  // Reference image (first) for split line positioning
  const refImage = images[0] ?? null
  const refWidth = refImage?.image.naturalWidth ?? 1
  const refHeight = refImage?.image.naturalHeight ?? 1
  const originalFileName = refImage?.fileName ?? ""
  const originalMimeType = refImage?.mimeType ?? ""

  // Viewport uses total layout dimensions
  const stageWidth = containerSize.width - RULER_THICKNESS
  const stageHeight = containerSize.height - RULER_THICKNESS

  const viewport = useCanvasViewport({
    containerWidth: stageWidth,
    containerHeight: stageHeight,
    imageWidth: layout.totalWidth,
    imageHeight: layout.totalHeight,
  })

  // Split lines use reference image dimensions
  const {
    lines,
    addLine,
    addLineAtPosition,
    updateLinePosition,
    removeLine,
    canAddHorizontal,
    canAddVertical,
    calculateSnap,
    undo,
    redo,
    canUndo,
    canRedo,
    setLines,
  } = useSplitLines({ imageWidth: refWidth, imageHeight: refHeight, snapThreshold: 12 / viewport.scale })

  const {
    splitResults,
    batchResults,
    isSplitting,
    generateSplit,
    generateBatchSplit,
    downloadAll,
    downloadBatchAll,
    downloadOne,
    clearResults,
    selectedKeys,
    toggleSelect,
    selectAll,
    deselectAll,
    clearSelection,
    downloadSelected,
    downloadBatchSelected,
  } = useImageExport()

  const {
    isDragging,
    dragOrientation,
    previewPosition,
    startDrag,
    isNearRulerZone,
  } = useRulerDrag({
    editorRef: editorAreaRef,
    stageContainerRef,
    viewportScale: viewport.scale,
    viewportPosition: viewport.position,
    addLineAtPosition,
    removeLine,
    calculateSnap,
    canAddHorizontal,
    canAddVertical,
    rulerThickness: RULER_THICKNESS,
  })

  // Panning state (space+drag)
  const [isPanning, setIsPanning] = useState(false)
  const isPanningRef = useRef(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && !isPanningRef.current) {
        e.preventDefault()
        isPanningRef.current = true
        setIsPanning(true)
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isPanningRef.current = false
        setIsPanning(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Resize observer
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [images.length])

  // Load pending upload from homepage navigation
  useEffect(() => {
    if (images.length > 0) return
    const pending = consumePendingUpload()
    if (pending && pending.length > 0) {
      setImages(
        pending.map((p) => ({
          image: p.image,
          fileName: p.file.name,
          mimeType: p.mimeType,
        }))
      )
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Load initial state
  useEffect(() => {
    if (!initialState) return
    const url = URL.createObjectURL(initialState.imageBlob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      setImages([
        {
          image: img,
          fileName: initialState.originalFileName,
          mimeType: initialState.originalMimeType,
        },
      ])
      setLines(initialState.lines)
    }
    img.src = url
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState])

  const handleImagesLoaded = useCallback(
    (results: UploadResult[]) => {
      setImages(
        results.map((r) => ({
          image: r.image,
          fileName: r.file.name,
          mimeType: r.mimeType,
        }))
      )
      clearResults()
      uploadCountRef.current++
      onImageUpload?.(uploadCountRef.current)
    },
    [onImageUpload, clearResults]
  )

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const handleGenerate = useCallback(async () => {
    if (images.length === 0) return
    if (lines.length === 0) {
      toast.error("请先添加分割线")
      return
    }

    if (isMultiImage) {
      await generateBatchSplit(images, lines)
    } else {
      await generateSplit(images[0].image, lines, images[0].mimeType)
    }

    const newCount = splitCount + 1
    setSplitCount(newCount)
    setSheetOpen(true)
    onSplitComplete?.(newCount === 1)

    // Save to history (first image)
    if (onSaveHistory && images.length > 0) {
      const firstImage = images[0].image
      const thumbCanvas = document.createElement("canvas")
      const thumbSize = 128
      const ratio = Math.min(thumbSize / firstImage.naturalWidth, thumbSize / firstImage.naturalHeight)
      thumbCanvas.width = firstImage.naturalWidth * ratio
      thumbCanvas.height = firstImage.naturalHeight * ratio
      const thumbCtx = thumbCanvas.getContext("2d")
      if (thumbCtx) {
        thumbCtx.drawImage(firstImage, 0, 0, thumbCanvas.width, thumbCanvas.height)
        const thumbnailDataUrl = thumbCanvas.toDataURL("image/jpeg", 0.6)
        const fullCanvas = document.createElement("canvas")
        fullCanvas.width = firstImage.naturalWidth
        fullCanvas.height = firstImage.naturalHeight
        const fullCtx = fullCanvas.getContext("2d")
        if (fullCtx) {
          fullCtx.drawImage(firstImage, 0, 0)
          const mimeForBlob = ["image/png", "image/jpeg"].includes(images[0].mimeType)
            ? images[0].mimeType
            : "image/png"
          const imageBlob = await new Promise<Blob>((resolve, reject) =>
            fullCanvas.toBlob(
              (b) => (b ? resolve(b) : reject(new Error("toBlob returned null"))),
              mimeForBlob
            )
          )
          onSaveHistory({
            originalFileName: images[0].fileName,
            originalMimeType: images[0].mimeType,
            lines: [...lines],
            imageBlob,
            thumbnailDataUrl,
          })
        }
      }
    }
  }, [images, lines, isMultiImage, generateSplit, generateBatchSplit, splitCount, onSplitComplete, onSaveHistory])

  const handleDownloadAll = useCallback(() => {
    if (isMultiImage) {
      downloadBatchAll()
    } else {
      const baseName = getFileNameWithoutExtension(originalFileName)
      const ext = getFileExtension(originalMimeType)
      downloadAll(baseName, ext)
    }
  }, [isMultiImage, originalFileName, originalMimeType, downloadAll, downloadBatchAll])

  const handleDownloadSelected = useCallback(() => {
    if (isMultiImage) {
      downloadBatchSelected()
    } else {
      const baseName = getFileNameWithoutExtension(originalFileName)
      const ext = getFileExtension(originalMimeType)
      downloadSelected(baseName, ext)
    }
  }, [isMultiImage, originalFileName, originalMimeType, downloadSelected, downloadBatchSelected])

  const handleSelectAll = useCallback(() => {
    if (selectedKeys.size === splitResults.length && splitResults.length > 0) {
      deselectAll()
    } else {
      selectAll()
    }
  }, [selectedKeys.size, splitResults.length, selectAll, deselectAll])

  const isAllSelected = splitResults.length > 0 && selectedKeys.size === splitResults.length

  const handleSheetClose = useCallback(() => {
    setSheetOpen(false)
    clearSelection()
  }, [clearSelection])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey

      if (isCmd && e.key === "0") {
        e.preventDefault()
        viewport.fitToView()
        return
      }
      if (isCmd && e.key === "1") {
        e.preventDefault()
        viewport.resetTo100()
        return
      }
      if (isCmd && e.shiftKey && e.key === "z") {
        e.preventDefault()
        redo()
        return
      }
      if (isCmd && e.key === "z") {
        e.preventDefault()
        undo()
        return
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedLineId) {
        e.preventDefault()
        removeLine(selectedLineId)
        setSelectedLineId(null)
      }
    },
    [undo, redo, removeLine, selectedLineId, viewport]
  )

  const [lineNearRuler, setLineNearRuler] = useState<string | null>(null)

  // Thumbnail URLs for image management strip
  const thumbnailUrls = useMemo(() => {
    return images.map((item) => {
      const canvas = document.createElement("canvas")
      const thumbSize = 64
      const ratio = Math.min(
        thumbSize / item.image.naturalWidth,
        thumbSize / item.image.naturalHeight
      )
      canvas.width = item.image.naturalWidth * ratio
      canvas.height = item.image.naturalHeight * ratio
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(item.image, 0, 0, canvas.width, canvas.height)
      }
      return canvas.toDataURL("image/jpeg", 0.6)
    })
  }, [images])

  // Compute world bounds for line rendering
  const worldLeft = -viewport.position.x / viewport.scale
  const worldTop = -viewport.position.y / viewport.scale
  const worldRight = worldLeft + stageWidth / viewport.scale
  const worldBottom = worldTop + stageHeight / viewport.scale

  if (images.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <UploadZone onImagesLoaded={handleImagesLoaded} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
        <Button
          size="sm"
          variant="outline"
          onClick={() => addLine("horizontal")}
          disabled={!canAddHorizontal}
        >
          + 横向分割线
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => addLine("vertical")}
          disabled={!canAddVertical}
        >
          + 纵向分割线
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          size="sm"
          variant="outline"
          onClick={undo}
          disabled={!canUndo}
        >
          撤销
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={redo}
          disabled={!canRedo}
        >
          重做
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          size="sm"
          onClick={handleGenerate}
          disabled={isSplitting}
        >
          {isSplitting ? "生成中..." : isMultiImage ? `批量生成 (${images.length} 张)` : "生成"}
        </Button>
        {splitResults.length > 0 && (
          <Button size="sm" variant="secondary" onClick={() => setSheetOpen(true)}>
            查看结果
          </Button>
        )}
        <div className="flex-1" />
        {isMultiImage && (
          <span className="text-xs text-muted-foreground">
            {images.length} 张图片 · {layout.direction === "vertical" ? "纵向排列" : "横向排列"}
          </span>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setImages([])
            clearResults()
            setSelectedLineId(null)
          }}
        >
          重新上传
        </Button>
      </div>

      {showShortcutHints && (
        <p className="text-xs text-muted-foreground flex-shrink-0">
          快捷键: Ctrl+Z 撤销 | Ctrl+Shift+Z 重做 | Delete 删除选中分割线 | 从标尺拖拽创建分割线 | 拖回标尺删除 | 滚轮缩放 | 空格+拖拽平移 | Cmd+0 适应 | Cmd+1 100%
        </p>
      )}

      {/* Image management strip for multi-image */}
      {isMultiImage && (
        <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0">
          {images.map((item, index) => (
            <div
              key={`thumb-${index}`}
              className="group/thumb relative shrink-0 rounded border border-[#1A1A1A]/15 overflow-hidden"
            >
              <img
                src={thumbnailUrls[index]}
                alt={item.fileName}
                className="h-12 w-auto object-cover"
              />
              {/* Delete button */}
              <button
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-2.5 w-2.5" strokeWidth={2} />
              </button>
              <span className="absolute bottom-0 left-0 right-0 text-center text-[8px] bg-black/50 text-white leading-4">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Editor area with rulers */}
      <div
        ref={containerRef}
        className="relative w-full bg-muted/30 rounded-lg overflow-hidden flex-1"
        style={{ minHeight: 400 }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div
          ref={editorAreaRef}
          className="relative"
          style={{
            display: "grid",
            gridTemplateColumns: `${RULER_THICKNESS}px 1fr`,
            gridTemplateRows: `${RULER_THICKNESS}px 1fr`,
            width: "100%",
            height: "100%",
          }}
        >
          {/* Corner block */}
          <CornerBlock thickness={RULER_THICKNESS} />

          {/* Horizontal ruler — uses reference image width */}
          <Ruler
            orientation="horizontal"
            length={stageWidth}
            viewportScale={viewport.scale}
            viewportOffset={viewport.position.x}
            imageSize={refWidth}
            thickness={RULER_THICKNESS}
            lines={lines}
            onDragStart={startDrag}
          />

          {/* Vertical ruler — uses reference image height */}
          <Ruler
            orientation="vertical"
            length={stageHeight}
            viewportScale={viewport.scale}
            viewportOffset={viewport.position.y}
            imageSize={refHeight}
            thickness={RULER_THICKNESS}
            lines={lines}
            onDragStart={startDrag}
          />

          {/* Canvas */}
          <div ref={stageContainerRef} className="relative overflow-hidden">
            <Stage
              width={stageWidth}
              height={stageHeight}
              scaleX={viewport.scale}
              scaleY={viewport.scale}
              x={viewport.position.x}
              y={viewport.position.y}
              draggable={isPanning}
              onClick={(e: Konva.KonvaEventObject<MouseEvent>) => {
                if (e.target === e.target.getStage()) {
                  setSelectedLineId(null)
                }
              }}
              onWheel={(e: Konva.KonvaEventObject<WheelEvent>) => {
                e.evt.preventDefault()
                const scaleBy = 1.05
                const factor = e.evt.deltaY < 0 ? scaleBy : 1 / scaleBy
                const stage = e.target.getStage()
                if (!stage) return
                const pointer = stage.getPointerPosition()
                if (!pointer) return
                viewport.zoomAtPoint(pointer.x, pointer.y, factor)
              }}
              onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
                if (e.target === e.target.getStage()) {
                  const stage = e.target.getStage()!
                  viewport.panBy(
                    stage.x() - viewport.position.x,
                    stage.y() - viewport.position.y
                  )
                }
              }}
              style={{ cursor: isPanning ? "grab" : "default" }}
            >
              {/* Background + Images layer */}
              <Layer listening={false}>
                {/* Canvas background */}
                <Rect
                  x={worldLeft}
                  y={worldTop}
                  width={stageWidth / viewport.scale}
                  height={stageHeight / viewport.scale}
                  fill="#e0e0e0"
                  listening={false}
                />
                {/* Render ALL images at their layout offsets */}
                {images.map((item, index) => (
                  <KonvaImage
                    key={`img-${index}`}
                    image={item.image}
                    x={layout.offsets[index].x}
                    y={layout.offsets[index].y}
                    width={item.image.naturalWidth}
                    height={item.image.naturalHeight}
                  />
                ))}
              </Layer>

              {/* Split lines layer */}
              <Layer>
                {/* Preview regions overlay — render per image */}
                {lines.length > 0 &&
                  images.map((item, index) => (
                    <SplitRegionOverlay
                      key={`overlay-${index}`}
                      lines={lines}
                      imageWidth={item.image.naturalWidth}
                      imageHeight={item.image.naturalHeight}
                      offsetX={layout.offsets[index].x}
                      offsetY={layout.offsets[index].y}
                    />
                  ))}

                {/* Split lines — primary segments (first image, interactive) */}
                {lines.map((line) => {
                  const isHorizontal = line.orientation === "horizontal"
                  const isSelected = line.id === selectedLineId
                  const isAboutToDelete = line.id === lineNearRuler

                  // Primary line on first image (at offset 0,0 — same logic as before)
                  const points = isHorizontal
                    ? [worldLeft, line.position, worldRight, line.position]
                    : [line.position, worldTop, line.position, worldBottom]

                  return (
                    <Line
                      key={line.id}
                      points={points}
                      stroke={
                        isAboutToDelete
                          ? "#f97316"
                          : isSelected
                            ? "#3b82f6"
                            : "#ef4444"
                      }
                      strokeWidth={(isSelected ? 3 : 2) / viewport.scale}
                      opacity={isAboutToDelete ? 0.5 : 1}
                      hitStrokeWidth={20 / viewport.scale}
                      draggable
                      onClick={() => setSelectedLineId(line.id)}
                      onTap={() => setSelectedLineId(line.id)}
                      dragBoundFunc={(pos) => {
                        if (isHorizontal) {
                          const worldY = (pos.y - viewport.position.y) / viewport.scale
                          const snapped = calculateSnap(worldY, "horizontal")
                          return { x: pos.x, y: snapped * viewport.scale + viewport.position.y }
                        } else {
                          const worldX = (pos.x - viewport.position.x) / viewport.scale
                          const snapped = calculateSnap(worldX, "vertical")
                          return { x: snapped * viewport.scale + viewport.position.x, y: pos.y }
                        }
                      }}
                      onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => {
                        const node = e.target
                        const stageContainer = stageContainerRef.current
                        if (!stageContainer) return

                        const stageRect = stageContainer.getBoundingClientRect()
                        if (isHorizontal) {
                          const screenY = stageRect.top + (node.y() + line.position) * viewport.scale + viewport.position.y
                          const near = isNearRulerZone(screenY, "horizontal")
                          setLineNearRuler(near ? line.id : null)
                        } else {
                          const screenX = stageRect.left + (node.x() + line.position) * viewport.scale + viewport.position.x
                          const near = isNearRulerZone(screenX, "vertical")
                          setLineNearRuler(near ? line.id : null)
                        }
                      }}
                      onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
                        const node = e.target
                        const stageContainer = stageContainerRef.current

                        if (stageContainer && lineNearRuler === line.id) {
                          removeLine(line.id)
                          setLineNearRuler(null)
                          if (selectedLineId === line.id) {
                            setSelectedLineId(null)
                          }
                          node.y(0)
                          node.x(0)
                          return
                        }

                        setLineNearRuler(null)

                        if (isHorizontal) {
                          updateLinePosition(line.id, Math.round(line.position + node.y()))
                          node.y(0)
                        } else {
                          updateLinePosition(line.id, Math.round(line.position + node.x()))
                          node.x(0)
                        }
                      }}
                    />
                  )
                })}

                {/* Split lines — mirror segments on other images (visual only) */}
                {isMultiImage &&
                  lines.map((line) =>
                    images.slice(1).map((item, i) => {
                      const imgIndex = i + 1
                      const offset = layout.offsets[imgIndex]
                      const isHorizontal = line.orientation === "horizontal"
                      const isAboutToDelete = line.id === lineNearRuler
                      const isSelected = line.id === selectedLineId

                      // For vertical layout: horizontal lines need per-image y offset
                      // For horizontal layout: vertical lines need per-image x offset
                      let points: number[]
                      if (layout.direction === "vertical" && isHorizontal) {
                        points = [worldLeft, offset.y + line.position, worldRight, offset.y + line.position]
                      } else if (layout.direction === "horizontal" && !isHorizontal) {
                        points = [offset.x + line.position, worldTop, offset.x + line.position, worldBottom]
                      } else {
                        // This direction already covered by the primary full-span line
                        return null
                      }

                      return (
                        <Line
                          key={`${line.id}-mirror-${imgIndex}`}
                          points={points}
                          stroke={
                            isAboutToDelete
                              ? "#f97316"
                              : isSelected
                                ? "#3b82f6"
                                : "#ef4444"
                          }
                          strokeWidth={(isSelected ? 3 : 2) / viewport.scale}
                          opacity={isAboutToDelete ? 0.5 : 0.8}
                          hitStrokeWidth={20 / viewport.scale}
                          listening={false}
                        />
                      )
                    })
                  )}
              </Layer>
            </Stage>

            {/* Drag preview line */}
            {isDragging && dragOrientation && (
              <DragPreviewLine
                isDragging={isDragging}
                orientation={dragOrientation}
                position={previewPosition - RULER_THICKNESS}
              />
            )}

            {/* Zoom indicator */}
            <ZoomIndicator
              zoomPercent={viewport.zoomPercent}
              onFitToView={viewport.fitToView}
              onResetTo100={viewport.resetTo100}
              onZoomChange={(percent) => {
                const factor = percent / 100 / viewport.scale
                viewport.zoomAtPoint(stageWidth / 2, stageHeight / 2, factor)
              }}
            />
          </div>
        </div>
      </div>

      {/* Split results sheet */}
      <ResultSheet
        open={sheetOpen && splitResults.length > 0}
        onClose={handleSheetClose}
        results={splitResults}
        batchResults={batchResults}
        originalFileName={getFileNameWithoutExtension(originalFileName)}
        fileExtension={getFileExtension(originalMimeType)}
        onDownloadSingle={downloadOne}
        onDownloadAll={handleDownloadAll}
        selectedKeys={selectedKeys}
        onToggleSelect={toggleSelect}
        onSelectAll={handleSelectAll}
        isAllSelected={isAllSelected}
        onDownloadSelected={handleDownloadSelected}
      />
    </div>
  )
}

// Helper component: region overlay for split preview — now supports offset
function SplitRegionOverlay({
  lines,
  imageWidth,
  imageHeight,
  offsetX = 0,
  offsetY = 0,
}: {
  lines: SplitLine[]
  imageWidth: number
  imageHeight: number
  offsetX?: number
  offsetY?: number
}) {
  const hPositions = lines
    .filter((l) => l.orientation === "horizontal")
    .map((l) => l.position)
    .sort((a, b) => a - b)
  const vPositions = lines
    .filter((l) => l.orientation === "vertical")
    .map((l) => l.position)
    .sort((a, b) => a - b)

  const yEdges = [0, ...hPositions, imageHeight]
  const xEdges = [0, ...vPositions, imageWidth]

  const rects: React.ReactElement[] = []

  for (let r = 0; r < yEdges.length - 1; r++) {
    for (let c = 0; c < xEdges.length - 1; c++) {
      rects.push(
        <Rect
          key={`region-${r}-${c}`}
          x={offsetX + xEdges[c]}
          y={offsetY + yEdges[r]}
          width={xEdges[c + 1] - xEdges[c]}
          height={yEdges[r + 1] - yEdges[r]}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1}
          listening={false}
        />
      )
    }
  }

  return <>{rects}</>
}
