"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Download, RotateCcw, ImagePlus, Check, X, Undo2, Redo2 } from "lucide-react"
import { useResizeEditor } from "@/hooks/use-resize-editor"
import { useCanvasViewport } from "@/hooks/use-canvas-viewport"
import { exportArtboard } from "@/lib/resize-export"
import { ACCEPTED_TYPES } from "@/lib/upload-utils"
import { CanvasSizeControl } from "./CanvasSizeControl"
import { ResizeCanvas } from "./ResizeCanvas"
import { ResizeStatusBar } from "./ResizeStatusBar"
import { ZoomIndicator } from "@/components/ZoomIndicator"

export function ResizeEditor() {
  const t = useTranslations("resize")
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    canvasSize,
    setCanvasSize,
    image,
    transform,
    setTransform,
    mode,
    setMode,
    cropRect,
    setCropRect,
    loadImage,
    applyCrop,
    cancelCrop,
    resetImage,
    clearImage,
    fileName,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useResizeEditor()

  // Track container size reactively
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
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
  }, [])

  // Viewport zoom/pan — treats the artboard as the "image" for the viewport hook
  const viewport = useCanvasViewport({
    containerWidth: containerSize.width,
    containerHeight: containerSize.height,
    imageWidth: canvasSize.width,
    imageHeight: canvasSize.height,
  })

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey

      if (mode === "crop") {
        if (e.key === "Enter") { e.preventDefault(); applyCrop() }
        else if (e.key === "Escape") { e.preventDefault(); cancelCrop() }
        return
      }

      if (e.key === "Escape" && mode === "selected") {
        setMode("idle")
        return
      }

      if (e.key === "Delete" && mode === "selected" && document.activeElement === document.body) {
        clearImage()
        return
      }

      // Zoom shortcuts
      if (isCmd && (e.key === "=" || e.key === "+")) {
        e.preventDefault()
        const cx = (containerSize.width) / 2
        const cy = (containerSize.height) / 2
        viewport.zoomAtPoint(cx, cy, 1.15)
        return
      }
      if (isCmd && e.key === "-") {
        e.preventDefault()
        const cx = (containerSize.width) / 2
        const cy = (containerSize.height) / 2
        viewport.zoomAtPoint(cx, cy, 1 / 1.15)
        return
      }
      if (isCmd && e.key === "0") {
        e.preventDefault()
        viewport.fitToView()
        return
      }

      // Undo/Redo
      if (isCmd && !e.shiftKey && e.key === "z") {
        e.preventDefault()
        undo()
        return
      }
      if (isCmd && e.shiftKey && e.key === "z") {
        e.preventDefault()
        redo()
        return
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mode, applyCrop, cancelCrop, setMode, clearImage, viewport, undo, redo])

  const handleImageFile = useCallback(
    async (file: File) => {
      try {
        await loadImage(file)
      } catch {
        toast.error(t("invalidSize"))
      }
    },
    [loadImage, t]
  )

  const handleDownload = useCallback(
    async (format: "image/png" | "image/jpeg") => {
      if (!image) return
      try {
        const quality = format === "image/jpeg" ? 0.92 : undefined
        const blob = await exportArtboard(
          image, transform, canvasSize.width, canvasSize.height, format, quality
        )
        const ext = format === "image/jpeg" ? ".jpg" : ".png"
        const baseName = fileName ? fileName.replace(/\.[^.]+$/, "") : "resized"
        const downloadName = `${baseName}_${canvasSize.width}x${canvasSize.height}${ext}`
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = downloadName
        a.click()
        URL.revokeObjectURL(url)
      } catch {
        toast.error("Export failed. Please try again.")
      }
    },
    [image, transform, canvasSize, fileName]
  )

  const handleReplaceFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleImageFile(file)
      if (replaceInputRef.current) replaceInputRef.current.value = ""
    },
    [handleImageFile]
  )

  const handleZoomChange = useCallback(
    (percent: number) => {
      const cx = (containerSize.width) / 2
      const cy = (containerSize.height) / 2
      const targetScale = percent / 100
      const factor = targetScale / viewport.scale
      viewport.zoomAtPoint(cx, cy, factor)
    },
    [viewport]
  )

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border">
        <CanvasSizeControl
          width={canvasSize.width}
          height={canvasSize.height}
          onChange={setCanvasSize}
        />

        <div className="flex items-center gap-2 shrink-0">
          {mode === "crop" && (
            <>
              <p className="text-[10px] text-muted-foreground mr-2 hidden sm:block">
                {t("cropHint")}
              </p>
              <button
                onClick={applyCrop}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider bg-accent text-accent-foreground rounded hover:bg-accent/90 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                {t("applyCrop")}
              </button>
              <button
                onClick={cancelCrop}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                {t("cancelCrop")}
              </button>
            </>
          )}

          {mode !== "crop" && image && (
            <>
              <button
                onClick={undo}
                disabled={!canUndo}
                className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground rounded hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
                title="Undo (Cmd+Z)"
              >
                <Undo2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground rounded hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
                title="Redo (Cmd+Shift+Z)"
              >
                <Redo2 className="h-3.5 w-3.5" />
              </button>
              <div className="w-px h-6 bg-border mx-1" />
              <button
                onClick={() => replaceInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded hover:text-foreground transition-colors"
                title={t("replaceImage")}
              >
                <ImagePlus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("replaceImage")}</span>
              </button>
              <button
                onClick={resetImage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded hover:text-foreground transition-colors"
                title={t("reset")}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("reset")}</span>
              </button>
              <button
                onClick={() => handleDownload("image/png")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider bg-foreground text-background rounded hover:bg-foreground/90 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                PNG
              </button>
              <button
                onClick={() => handleDownload("image/jpeg")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider bg-foreground text-background rounded hover:bg-foreground/90 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                JPG
              </button>
            </>
          )}

          <input
            ref={replaceInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={handleReplaceFile}
          />
        </div>
      </div>

      {/* Canvas area */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <ResizeCanvas
          canvasWidth={canvasSize.width}
          canvasHeight={canvasSize.height}
          image={image}
          transform={transform}
          onTransformChange={setTransform}
          mode={mode}
          onModeChange={setMode}
          cropRect={cropRect}
          onCropRectChange={setCropRect}
          onImageFile={handleImageFile}
          viewportScale={viewport.scale}
          viewportPosition={viewport.position}
          onZoomAtPoint={viewport.zoomAtPoint}
          onPan={viewport.panBy}
        />

        {/* Zoom controls */}
        <ZoomIndicator
          zoomPercent={viewport.zoomPercent}
          onFitToView={viewport.fitToView}
          onResetTo100={viewport.resetTo100}
          onZoomChange={handleZoomChange}
        />
      </div>

      {/* Status bar */}
      <ResizeStatusBar
        imageWidth={image?.naturalWidth ?? null}
        imageHeight={image?.naturalHeight ?? null}
        canvasWidth={canvasSize.width}
        canvasHeight={canvasSize.height}
        zoomPercent={viewport.zoomPercent}
        mode={mode}
        cropRect={cropRect}
      />
    </div>
  )
}
