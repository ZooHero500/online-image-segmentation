"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Stage, Layer, Image as KonvaImage, Line, Rect } from "react-konva"
import type Konva from "konva"
import { Button } from "@/components/ui/button"
import { UploadZone } from "./UploadZone"
import { SplitPreview } from "./SplitPreview"
import { Ruler, CornerBlock, DragPreviewLine } from "./Ruler"
import { ZoomIndicator } from "./ZoomIndicator"
import { useSplitLines } from "@/hooks/use-split-lines"
import { useImageExport } from "@/hooks/use-image-export"
import { useRulerDrag } from "@/hooks/use-ruler-drag"
import { useCanvasViewport } from "@/hooks/use-canvas-viewport"
import { consumePendingUpload } from "@/lib/pending-upload"
import { toast } from "sonner"
import type { SplitLine, UploadResult } from "@/types"

const RULER_THICKNESS = 20

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
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [originalFileName, setOriginalFileName] = useState("")
  const [originalMimeType, setOriginalMimeType] = useState("")
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null)
  const [splitCount, setSplitCount] = useState(0)
  const uploadCountRef = useRef(0)

  const imageWidth = image?.naturalWidth ?? 1
  const imageHeight = image?.naturalHeight ?? 1

  // Viewport hook — must be before useSplitLines for snap threshold
  const stageWidth = containerSize.width - RULER_THICKNESS
  const stageHeight = containerSize.height - RULER_THICKNESS

  const viewport = useCanvasViewport({
    containerWidth: stageWidth,
    containerHeight: stageHeight,
    imageWidth,
    imageHeight,
  })

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
  } = useSplitLines({ imageWidth, imageHeight, snapThreshold: 12 / viewport.scale })

  const {
    splitResults,
    isSplitting,
    generateSplit,
    downloadAll,
    downloadOne,
    clearResults,
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

  // Resize observer — re-run when image changes because containerRef
  // is only mounted when image is loaded (different return branches)
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
  }, [image])

  // Load pending upload from homepage navigation
  useEffect(() => {
    if (image) return // already has an image
    const pending = consumePendingUpload()
    if (pending) {
      setImage(pending.image)
      setOriginalFileName(pending.file.name)
      setOriginalMimeType(pending.mimeType)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Load initial state
  useEffect(() => {
    if (!initialState) return
    const url = URL.createObjectURL(initialState.imageBlob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      setImage(img)
      setOriginalFileName(initialState.originalFileName)
      setOriginalMimeType(initialState.originalMimeType)
      setLines(initialState.lines)
    }
    img.src = url
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState])

  const handleImageLoaded = useCallback(
    (result: UploadResult) => {
      setImage(result.image)
      setOriginalFileName(result.file.name)
      setOriginalMimeType(result.mimeType)
      clearResults()
      uploadCountRef.current++
      onImageUpload?.(uploadCountRef.current)
    },
    [onImageUpload, clearResults]
  )

  const handleGenerate = useCallback(async () => {
    if (!image) return
    if (lines.length === 0) {
      toast.error("请先添加分割线")
      return
    }
    await generateSplit(image, lines, originalMimeType)
    const newCount = splitCount + 1
    setSplitCount(newCount)
    onSplitComplete?.(newCount === 1)

    // Save to history
    if (onSaveHistory) {
      // Thumbnail
      const thumbCanvas = document.createElement("canvas")
      const thumbSize = 128
      const ratio = Math.min(thumbSize / image.naturalWidth, thumbSize / image.naturalHeight)
      thumbCanvas.width = image.naturalWidth * ratio
      thumbCanvas.height = image.naturalHeight * ratio
      const thumbCtx = thumbCanvas.getContext("2d")
      if (thumbCtx) {
        thumbCtx.drawImage(image, 0, 0, thumbCanvas.width, thumbCanvas.height)
        const thumbnailDataUrl = thumbCanvas.toDataURL("image/jpeg", 0.6)
        // Full-size blob via canvas (blob URL may be revoked)
        const fullCanvas = document.createElement("canvas")
        fullCanvas.width = image.naturalWidth
        fullCanvas.height = image.naturalHeight
        const fullCtx = fullCanvas.getContext("2d")
        if (fullCtx) {
          fullCtx.drawImage(image, 0, 0)
          const mimeForBlob = ["image/png", "image/jpeg"].includes(originalMimeType)
            ? originalMimeType
            : "image/png"
          const imageBlob = await new Promise<Blob>((resolve, reject) =>
            fullCanvas.toBlob(
              (b) => (b ? resolve(b) : reject(new Error("toBlob returned null"))),
              mimeForBlob
            )
          )
          onSaveHistory({
            originalFileName,
            originalMimeType,
            lines: [...lines],
            imageBlob,
            thumbnailDataUrl,
          })
        }
      }
    }
  }, [image, lines, originalFileName, originalMimeType, generateSplit, splitCount, onSplitComplete, onSaveHistory])

  const handleDownloadAll = useCallback(() => {
    const baseName = getFileNameWithoutExtension(originalFileName)
    const ext = getFileExtension(originalMimeType)
    downloadAll(baseName, ext)
  }, [originalFileName, originalMimeType, downloadAll])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey

      // Cmd+0 = fit to view
      if (isCmd && e.key === "0") {
        e.preventDefault()
        viewport.fitToView()
        return
      }
      // Cmd+1 = 100%
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

  // Track which line is being dragged near ruler zone for delete feedback
  const [lineNearRuler, setLineNearRuler] = useState<string | null>(null)

  if (!image) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <UploadZone onImageLoaded={handleImageLoaded} />
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
          {isSplitting ? "生成中..." : "生成"}
        </Button>
        {splitResults.length > 0 && (
          <Button size="sm" variant="secondary" onClick={handleDownloadAll}>
            下载全部
          </Button>
        )}
        <div className="flex-1" />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setImage(null)
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

          {/* Horizontal ruler */}
          <Ruler
            orientation="horizontal"
            length={stageWidth}
            viewportScale={viewport.scale}
            viewportOffset={viewport.position.x}
            imageSize={imageWidth}
            thickness={RULER_THICKNESS}
            lines={lines}
            onDragStart={startDrag}
          />

          {/* Vertical ruler */}
          <Ruler
            orientation="vertical"
            length={stageHeight}
            viewportScale={viewport.scale}
            viewportOffset={viewport.position.y}
            imageSize={imageHeight}
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
              {/* Background + Image layer */}
              <Layer listening={false}>
                {/* Canvas background */}
                <Rect
                  x={-viewport.position.x / viewport.scale}
                  y={-viewport.position.y / viewport.scale}
                  width={stageWidth / viewport.scale}
                  height={stageHeight / viewport.scale}
                  fill="#e0e0e0"
                  listening={false}
                />
                <KonvaImage
                  image={image}
                  width={imageWidth}
                  height={imageHeight}
                />
              </Layer>

              {/* Split lines layer */}
              <Layer>
                {/* Preview regions overlay */}
                {lines.length > 0 && (
                  <SplitRegionOverlay
                    lines={lines}
                    imageWidth={imageWidth}
                    imageHeight={imageHeight}
                    scale={1}
                  />
                )}

                {/* Split lines */}
                {lines.map((line) => {
                  const isHorizontal = line.orientation === "horizontal"
                  const isSelected = line.id === selectedLineId
                  const isAboutToDelete = line.id === lineNearRuler

                  // Calculate visible world bounds for full-viewport lines
                  const worldLeft = -viewport.position.x / viewport.scale
                  const worldTop = -viewport.position.y / viewport.scale
                  const worldRight = worldLeft + stageWidth / viewport.scale
                  const worldBottom = worldTop + stageHeight / viewport.scale

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

                        // Check if line was dragged to ruler zone (delete)
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
              </Layer>
            </Stage>

            {/* Drag preview line (relative to stage container) */}
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

      {/* Split results */}
      {splitResults.length > 0 && (
        <SplitPreview
          results={splitResults}
          originalFileName={getFileNameWithoutExtension(originalFileName)}
          fileExtension={getFileExtension(originalMimeType)}
          onDownloadSingle={downloadOne}
          onDownloadAll={handleDownloadAll}
        />
      )}
    </div>
  )
}

// Helper component: region overlay for split preview
function SplitRegionOverlay({
  lines,
  imageWidth,
  imageHeight,
  scale,
}: {
  lines: SplitLine[]
  imageWidth: number
  imageHeight: number
  scale: number
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
          x={xEdges[c] * scale}
          y={yEdges[r] * scale}
          width={(xEdges[c + 1] - xEdges[c]) * scale}
          height={(yEdges[r + 1] - yEdges[r]) * scale}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1}
          listening={false}
        />
      )
    }
  }

  return <>{rects}</>
}
