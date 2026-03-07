"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Stage, Layer, Image as KonvaImage, Line, Rect, Group } from "react-konva"
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
import { validateFiles, loadImage } from "@/lib/upload-utils"
import { toast } from "sonner"
import type { SplitLine, UploadResult } from "@/types"
import { X, ImagePlus } from "lucide-react"

const RULER_THICKNESS = 20
const IMAGE_GAP = 40
const SNAP_THRESHOLD_PX = 8 // screen pixels for image alignment snap

// ─── Image snap alignment ───

interface SnapGuide {
  orientation: "horizontal" | "vertical"
  position: number
  start: number
  end: number
}

function calculateImageSnap(
  draggedIdx: number,
  proposedX: number,
  proposedY: number,
  dragW: number,
  dragH: number,
  positions: { x: number; y: number }[],
  sizes: { w: number; h: number }[],
  threshold: number
): { x: number; y: number; guides: SnapGuide[] } {
  let bestX = proposedX
  let bestY = proposedY
  let bestDx = Infinity
  let bestDy = Infinity
  let snapXEdge = 0
  let snapXOtherIdx = -1
  let snapYEdge = 0
  let snapYOtherIdx = -1

  for (let i = 0; i < positions.length; i++) {
    if (i === draggedIdx) continue
    const ox = positions[i].x
    const oy = positions[i].y
    const ow = sizes[i].w
    const oh = sizes[i].h

    // X-axis: left/right/center edges
    const dragXEdges = [proposedX, proposedX + dragW, proposedX + dragW / 2]
    const otherXEdges = [ox, ox + ow, ox + ow / 2]
    for (const de of dragXEdges) {
      for (const oe of otherXEdges) {
        const d = Math.abs(de - oe)
        if (d < bestDx) {
          bestDx = d
          bestX = proposedX + (oe - de)
          snapXEdge = oe
          snapXOtherIdx = i
        }
      }
    }

    // Y-axis: top/bottom/center edges
    const dragYEdges = [proposedY, proposedY + dragH, proposedY + dragH / 2]
    const otherYEdges = [oy, oy + oh, oy + oh / 2]
    for (const de of dragYEdges) {
      for (const oe of otherYEdges) {
        const d = Math.abs(de - oe)
        if (d < bestDy) {
          bestDy = d
          bestY = proposedY + (oe - de)
          snapYEdge = oe
          snapYOtherIdx = i
        }
      }
    }
  }

  // Apply threshold — only snap if close enough
  if (bestDx >= threshold) bestX = proposedX
  if (bestDy >= threshold) bestY = proposedY

  const guides: SnapGuide[] = []

  if (bestDx < threshold && snapXOtherIdx >= 0) {
    const oy = positions[snapXOtherIdx].y
    const oh = sizes[snapXOtherIdx].h
    guides.push({
      orientation: "vertical",
      position: snapXEdge,
      start: Math.min(bestY, oy) - 10,
      end: Math.max(bestY + dragH, oy + oh) + 10,
    })
  }

  if (bestDy < threshold && snapYOtherIdx >= 0) {
    const ox = positions[snapYOtherIdx].x
    const ow = sizes[snapYOtherIdx].w
    guides.push({
      orientation: "horizontal",
      position: snapYEdge,
      start: Math.min(bestX, ox) - 10,
      end: Math.max(bestX + dragW, ox + ow) + 10,
    })
  }

  return { x: bestX, y: bestY, guides }
}

// ─── Layout ───

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

  const avgAspect =
    images.reduce(
      (sum, item) => sum + item.image.naturalWidth / item.image.naturalHeight,
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

// ─── Editor ───

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
  const t = useTranslations("workspace")
  const containerRef = useRef<HTMLDivElement>(null)
  const editorAreaRef = useRef<HTMLDivElement>(null)
  const stageContainerRef = useRef<HTMLDivElement>(null)
  const [images, setImages] = useState<ImageItem[]>([])
  const [imagePositions, setImagePositions] = useState<{ x: number; y: number }[]>([])
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null)
  const [splitCount, setSplitCount] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([])
  const snapGuidesRef = useRef<SnapGuide[]>([])
  const uploadCountRef = useRef(0)
  const appendInputRef = useRef<HTMLInputElement>(null)
  const [hoveredImageIdx, setHoveredImageIdx] = useState<number | null>(null)
  const [draggingImageIdx, setDraggingImageIdx] = useState<number | null>(null)
  const [isFileDragOver, setIsFileDragOver] = useState(false)

  const isMultiImage = images.length > 1

  // Stable layout for viewport (only depends on images identity, not positions)
  const layout = useMemo(() => calculateLayout(images), [images])

  // Reference image (first) for split line positioning
  const refImage = images[0] ?? null
  const refWidth = refImage?.image.naturalWidth ?? 1
  const refHeight = refImage?.image.naturalHeight ?? 1
  const originalFileName = refImage?.fileName ?? ""
  const originalMimeType = refImage?.mimeType ?? ""

  // Image sizes for snap calculation
  const imageSizes = useMemo(
    () => images.map((img) => ({ w: img.image.naturalWidth, h: img.image.naturalHeight })),
    [images]
  )

  const stageWidth = containerSize.width - RULER_THICKNESS
  const stageHeight = containerSize.height - RULER_THICKNESS

  const viewport = useCanvasViewport({
    containerWidth: stageWidth,
    containerHeight: stageHeight,
    imageWidth: layout.totalWidth,
    imageHeight: layout.totalHeight,
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
  } = useSplitLines({ workspaceWidth: layout.totalWidth, workspaceHeight: layout.totalHeight, snapThreshold: 12 / viewport.scale })

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
    messages: {
      horizontalLimitReached: t("horizontalLimitReached"),
      verticalLimitReached: t("verticalLimitReached"),
    },
  })

  // Panning
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

  // Helper: set images + initial positions from layout
  const initializeImages = useCallback((newImages: ImageItem[]) => {
    setImages(newImages)
    const newLayout = calculateLayout(newImages)
    setImagePositions(newLayout.offsets)
  }, [])

  // Load pending upload
  useEffect(() => {
    if (images.length > 0) return
    const pending = consumePendingUpload()
    if (pending && pending.length > 0) {
      initializeImages(
        pending.map((p) => ({
          image: p.image,
          fileName: p.file.name,
          mimeType: p.mimeType,
        }))
      )
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Load initial state (history)
  useEffect(() => {
    if (!initialState) return
    const url = URL.createObjectURL(initialState.imageBlob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      initializeImages([{
        image: img,
        fileName: initialState.originalFileName,
        mimeType: initialState.originalMimeType,
      }])
      setLines(initialState.lines)
    }
    img.src = url
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState])

  const handleImagesLoaded = useCallback(
    (results: UploadResult[]) => {
      initializeImages(
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
    [initializeImages, onImageUpload, clearResults]
  )

  const handleAppendImages = useCallback(
    async (fileList: FileList) => {
      // Estimate existing images total size (use naturalWidth * naturalHeight * 4 as rough byte estimate)
      const existingSize = images.reduce((sum, img) => {
        return sum + img.image.naturalWidth * img.image.naturalHeight * 4
      }, 0)
      const result = validateFiles(Array.from(fileList), existingSize)
      if (!result.valid) {
        toast.error(result.error!)
        return
      }
      if (result.totalSizeWarning) {
        const totalSize = result.files.reduce((sum, f) => sum + f.size, 0)
        toast.warning(
          `总文件大小 ${(totalSize / 1024 / 1024).toFixed(1)}MB 超过 50MB，可能导致浏览器卡顿`
        )
      }
      try {
        const newItems: ImageItem[] = []
        for (const file of result.files) {
          const image = await loadImage(file)
          newItems.push({ image, fileName: file.name, mimeType: file.type })
        }
        setImages((prev) => {
          const merged = [...prev, ...newItems]
          const newLayout = calculateLayout(merged)
          setImagePositions(newLayout.offsets)
          return merged
        })
        clearResults()
        toast.success(`已添加 ${newItems.length} 张图片`)
      } catch {
        toast.error("图片加载失败，请重试")
      }
    },
    [images, clearResults]
  )

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
    setImagePositions((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
    clearResults()
  }, [clearResults])

  // ─── Image drag with snap ───

  const makeImageDragBound = useCallback(
    (index: number) => (proposedAbsPos: { x: number; y: number }) => {
      const worldX = (proposedAbsPos.x - viewport.position.x) / viewport.scale
      const worldY = (proposedAbsPos.y - viewport.position.y) / viewport.scale
      const threshold = SNAP_THRESHOLD_PX / viewport.scale

      const snap = calculateImageSnap(
        index,
        worldX,
        worldY,
        imageSizes[index]?.w ?? 0,
        imageSizes[index]?.h ?? 0,
        imagePositions,
        imageSizes,
        threshold
      )

      snapGuidesRef.current = snap.guides

      return {
        x: snap.x * viewport.scale + viewport.position.x,
        y: snap.y * viewport.scale + viewport.position.y,
      }
    },
    [viewport.scale, viewport.position, imagePositions, imageSizes]
  )

  const handleImageDragMove = useCallback(() => {
    setSnapGuides([...snapGuidesRef.current])
  }, [])

  const handleImageDragEnd = useCallback(
    (index: number) => (e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target
      setImagePositions((prev) => {
        const next = [...prev]
        next[index] = { x: node.x(), y: node.y() }
        return next
      })
      setSnapGuides([])
      snapGuidesRef.current = []
      setDraggingImageIdx(null)
    },
    []
  )

  // ─── Generate / Download ───

  // Convert workspace lines to local coordinates for a specific image
  const getLocalLines = useCallback(
    (
      wsLines: SplitLine[],
      imgPos: { x: number; y: number },
      imgW: number,
      imgH: number
    ): SplitLine[] => {
      return wsLines
        .map((line) => {
          const isH = line.orientation === "horizontal"
          const localPos = isH ? line.position - imgPos.y : line.position - imgPos.x
          const max = isH ? imgH : imgW
          if (localPos <= 0 || localPos >= max) return null
          return { ...line, position: Math.round(localPos) }
        })
        .filter((l): l is SplitLine => l !== null)
    },
    []
  )

  const handleGenerate = useCallback(async () => {
    if (images.length === 0) return
    if (lines.length === 0) {
      toast.error(t("addLinesFirst"))
      return
    }

    try {
      if (isMultiImage) {
        // Convert workspace lines to per-image local lines
        const linesPerImage = images.map((item, index) => {
          const pos = imagePositions[index] ?? { x: 0, y: 0 }
          return getLocalLines(
            lines,
            pos,
            item.image.naturalWidth,
            item.image.naturalHeight
          )
        })
        await generateBatchSplit(images, linesPerImage)
      } else {
        // Single image: convert workspace lines to local coords
        const pos = imagePositions[0] ?? { x: 0, y: 0 }
        const localLines = getLocalLines(
          lines,
          pos,
          images[0].image.naturalWidth,
          images[0].image.naturalHeight
        )
        if (localLines.length === 0) {
          toast.error(t("linesNotCrossing"))
          return
        }
        await generateSplit(images[0].image, localLines, images[0].mimeType)
      }
    } catch (err) {
      console.error("Split failed:", err)
      toast.error(t("splitFailed"))
      return
    }

    const newCount = splitCount + 1
    setSplitCount(newCount)
    setSheetOpen(true)
    onSplitComplete?.(newCount === 1)

    if (onSaveHistory && images.length > 0) {
      try {
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
      } catch (err) {
        console.error("Save history failed:", err)
      }
    }
  }, [images, lines, imagePositions, isMultiImage, getLocalLines, generateSplit, generateBatchSplit, splitCount, onSplitComplete, onSaveHistory])

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
      if (isCmd && e.key === "0") { e.preventDefault(); viewport.fitToView(); return }
      if (isCmd && e.key === "1") { e.preventDefault(); viewport.resetTo100(); return }
      if (isCmd && e.shiftKey && e.key === "z") { e.preventDefault(); redo(); return }
      if (isCmd && e.key === "z") { e.preventDefault(); undo(); return }
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
      const ratio = Math.min(thumbSize / item.image.naturalWidth, thumbSize / item.image.naturalHeight)
      canvas.width = item.image.naturalWidth * ratio
      canvas.height = item.image.naturalHeight * ratio
      const ctx = canvas.getContext("2d")
      if (ctx) ctx.drawImage(item.image, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL("image/jpeg", 0.6)
    })
  }, [images])

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
        <Button size="sm" variant="outline" onClick={() => addLine("horizontal")} disabled={!canAddHorizontal}>
          {t("addHorizontal")}
        </Button>
        <Button size="sm" variant="outline" onClick={() => addLine("vertical")} disabled={!canAddVertical}>
          {t("addVertical")}
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button size="sm" variant="outline" onClick={undo} disabled={!canUndo}>{t("undo")}</Button>
        <Button size="sm" variant="outline" onClick={redo} disabled={!canRedo}>{t("redo")}</Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button size="sm" onClick={handleGenerate} disabled={isSplitting}>
          {isSplitting ? t("generating") : isMultiImage ? t("batchGenerate", { count: images.length }) : t("generate")}
        </Button>
        {splitResults.length > 0 && (
          <Button size="sm" variant="secondary" onClick={() => setSheetOpen(true)}>{t("viewResults")}</Button>
        )}
        <div className="flex-1" />
        {isMultiImage && (
          <span className="text-xs text-muted-foreground">
            {t("imageCount", { count: images.length })}
          </span>
        )}
        <>
          <input
            ref={appendInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleAppendImages(e.target.files)
              }
              if (appendInputRef.current) appendInputRef.current.value = ""
            }}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => appendInputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4 mr-1" />
            添加图片
          </Button>
        </>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setImages([])
            setImagePositions([])
            clearResults()
            setSelectedLineId(null)
          }}
        >
          {t("reupload")}
        </Button>
      </div>

      {showShortcutHints && (
        <p className="text-xs text-muted-foreground flex-shrink-0">
          {t("shortcutHints")}
        </p>
      )}

      {/* Image management strip */}
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
        className={`relative w-full bg-muted/30 rounded-lg overflow-hidden flex-1 ${
          isFileDragOver ? "ring-2 ring-[#D4AF37] bg-[#D4AF37]/5" : ""
        }`}
        style={{ minHeight: 400 }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onDragOver={(e) => {
          // Only react to file drags, not Konva internal drags
          if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault()
            setIsFileDragOver(true)
          }
        }}
        onDragLeave={(e) => {
          // Only reset if leaving the container (not entering a child)
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsFileDragOver(false)
          }
        }}
        onDrop={(e) => {
          setIsFileDragOver(false)
          if (e.dataTransfer.files.length > 0) {
            e.preventDefault()
            handleAppendImages(e.dataTransfer.files)
          }
        }}
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
          <CornerBlock thickness={RULER_THICKNESS} />
          <Ruler
            orientation="horizontal"
            length={stageWidth}
            viewportScale={viewport.scale}
            viewportOffset={viewport.position.x}
            imageSize={layout.totalWidth}
            thickness={RULER_THICKNESS}
            lines={lines}
            onDragStart={startDrag}
          />
          <Ruler
            orientation="vertical"
            length={stageHeight}
            viewportScale={viewport.scale}
            viewportOffset={viewport.position.y}
            imageSize={layout.totalHeight}
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
                if (e.target === e.target.getStage()) setSelectedLineId(null)
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
              {/* Background */}
              <Layer listening={false}>
                <Rect
                  x={-viewport.position.x / viewport.scale}
                  y={-viewport.position.y / viewport.scale}
                  width={stageWidth / viewport.scale}
                  height={stageHeight / viewport.scale}
                  fill="#e0e0e0"
                  listening={false}
                />
              </Layer>

              {/* Image groups (draggable) */}
              <Layer>
                {images.map((item, index) => {
                  const pos = imagePositions[index] ?? { x: 0, y: 0 }
                  const imgW = item.image.naturalWidth
                  const imgH = item.image.naturalHeight

                  // Convert workspace lines to local coordinates for this image
                  const localLines = lines
                    .map((line) => {
                      const isH = line.orientation === "horizontal"
                      const localPos = isH ? line.position - pos.y : line.position - pos.x
                      const max = isH ? imgH : imgW
                      if (localPos <= 0 || localPos >= max) return null
                      return { ...line, position: Math.round(localPos) }
                    })
                    .filter((l): l is SplitLine => l !== null)

                  return (
                    <Group
                      key={`img-group-${index}`}
                      x={pos.x}
                      y={pos.y}
                      draggable={!isPanning && isMultiImage}
                      dragBoundFunc={isMultiImage ? makeImageDragBound(index) : undefined}
                      onDragMove={isMultiImage ? handleImageDragMove : undefined}
                      onDragStart={isMultiImage ? () => setDraggingImageIdx(index) : undefined}
                      onDragEnd={isMultiImage ? handleImageDragEnd(index) : undefined}
                      onMouseEnter={isMultiImage ? () => {
                        setHoveredImageIdx(index)
                        if (stageContainerRef.current) {
                          stageContainerRef.current.style.cursor = isPanning ? "grab" : "move"
                        }
                      } : undefined}
                      onMouseLeave={isMultiImage ? () => {
                        setHoveredImageIdx(null)
                        if (stageContainerRef.current) {
                          stageContainerRef.current.style.cursor = ""
                        }
                      } : undefined}
                      onClick={() => setSelectedLineId(null)}
                    >
                      {/* Selection / hover border */}
                      {isMultiImage && (hoveredImageIdx === index || draggingImageIdx === index) && (
                        <Rect
                          x={-3 / viewport.scale}
                          y={-3 / viewport.scale}
                          width={imgW + 6 / viewport.scale}
                          height={imgH + 6 / viewport.scale}
                          stroke={draggingImageIdx === index ? "#3b82f6" : "#3b82f6"}
                          strokeWidth={(draggingImageIdx === index ? 2.5 : 1.5) / viewport.scale}
                          opacity={draggingImageIdx === index ? 0.9 : 0.5}
                          dash={draggingImageIdx === index ? undefined : [6 / viewport.scale, 3 / viewport.scale]}
                          listening={false}
                        />
                      )}
                      {/* Image */}
                      <KonvaImage
                        image={item.image}
                        width={imgW}
                        height={imgH}
                      />

                      {/* Region overlay — uses local lines that intersect this image */}
                      {localLines.length > 0 && (
                        <SplitRegionOverlay
                          lines={localLines}
                          imageWidth={imgW}
                          imageHeight={imgH}
                        />
                      )}
                    </Group>
                  )
                })}

                {/* Workspace split lines (fixed in workspace coordinates) */}
                {lines.map((line) => (
                  <WorkspaceSplitLine
                    key={line.id}
                    line={line}
                    totalWidth={layout.totalWidth}
                    totalHeight={layout.totalHeight}
                    lineExtend={layout.totalWidth + layout.totalHeight}
                    viewportScale={viewport.scale}
                    viewportPosition={viewport.position}
                    selectedLineId={selectedLineId}
                    lineNearRuler={lineNearRuler}
                    stageContainerRef={stageContainerRef}
                    calculateSnap={calculateSnap}
                    isNearRulerZone={isNearRulerZone}
                    updateLinePosition={updateLinePosition}
                    removeLine={removeLine}
                    setSelectedLineId={setSelectedLineId}
                    setLineNearRuler={setLineNearRuler}
                  />
                ))}

                {/* Snap alignment guides */}
                {snapGuides.map((guide, i) => (
                  <Line
                    key={`snap-guide-${i}`}
                    points={
                      guide.orientation === "vertical"
                        ? [guide.position, guide.start, guide.position, guide.end]
                        : [guide.start, guide.position, guide.end, guide.position]
                    }
                    stroke="#3b82f6"
                    strokeWidth={1 / viewport.scale}
                    dash={[6 / viewport.scale, 3 / viewport.scale]}
                    listening={false}
                  />
                ))}
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

// ─── Workspace split line (fixed in workspace coordinates) ───

function WorkspaceSplitLine({
  line,
  totalWidth,
  totalHeight,
  lineExtend,
  viewportScale,
  viewportPosition,
  selectedLineId,
  lineNearRuler,
  stageContainerRef,
  calculateSnap,
  isNearRulerZone,
  updateLinePosition,
  removeLine,
  setSelectedLineId,
  setLineNearRuler,
}: {
  line: SplitLine
  totalWidth: number
  totalHeight: number
  lineExtend: number
  viewportScale: number
  viewportPosition: { x: number; y: number }
  selectedLineId: string | null
  lineNearRuler: string | null
  stageContainerRef: React.RefObject<HTMLDivElement | null>
  calculateSnap: (position: number, orientation: "horizontal" | "vertical") => number
  isNearRulerZone: (screenPos: number, orientation: "horizontal" | "vertical") => boolean
  updateLinePosition: (id: string, position: number) => void
  removeLine: (id: string) => void
  setSelectedLineId: (id: string | null) => void
  setLineNearRuler: (id: string | null) => void
}) {
  const isHorizontal = line.orientation === "horizontal"
  const isSelected = line.id === selectedLineId
  const isAboutToDelete = line.id === lineNearRuler

  const pts = isHorizontal
    ? [-lineExtend, line.position, totalWidth + lineExtend, line.position]
    : [line.position, -lineExtend, line.position, totalHeight + lineExtend]

  return (
    <Line
      points={pts}
      stroke={
        isAboutToDelete ? "#f97316" : isSelected ? "#3b82f6" : "#ef4444"
      }
      strokeWidth={(isSelected ? 3 : 2) / viewportScale}
      opacity={isAboutToDelete ? 0.5 : 1}
      hitStrokeWidth={20 / viewportScale}
      draggable
      onClick={() => setSelectedLineId(line.id)}
      onTap={() => setSelectedLineId(line.id)}
      dragBoundFunc={(pos) => {
        // Directly in workspace (world) coordinates — no group offset needed
        if (isHorizontal) {
          const worldY = (pos.y - viewportPosition.y) / viewportScale
          const snapped = calculateSnap(worldY, "horizontal")
          return { x: pos.x, y: snapped * viewportScale + viewportPosition.y }
        } else {
          const worldX = (pos.x - viewportPosition.x) / viewportScale
          const snapped = calculateSnap(worldX, "vertical")
          return { x: snapped * viewportScale + viewportPosition.x, y: pos.y }
        }
      }}
      onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => {
        const node = e.target
        const stageContainer = stageContainerRef.current
        if (!stageContainer) return

        const stageRect = stageContainer.getBoundingClientRect()
        if (isHorizontal) {
          const lineWorldY = node.y() + line.position
          const screenY = stageRect.top + lineWorldY * viewportScale + viewportPosition.y
          const near = isNearRulerZone(screenY, "horizontal")
          setLineNearRuler(near ? line.id : null)
        } else {
          const lineWorldX = node.x() + line.position
          const screenX = stageRect.left + lineWorldX * viewportScale + viewportPosition.x
          const near = isNearRulerZone(screenX, "vertical")
          setLineNearRuler(near ? line.id : null)
        }
      }}
      onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
        const node = e.target

        if (lineNearRuler === line.id) {
          removeLine(line.id)
          setLineNearRuler(null)
          if (selectedLineId === line.id) setSelectedLineId(null)
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
}

// ─── Split region overlay ───

function SplitRegionOverlay({
  lines,
  imageWidth,
  imageHeight,
}: {
  lines: SplitLine[]
  imageWidth: number
  imageHeight: number
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
          x={xEdges[c]}
          y={yEdges[r]}
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
