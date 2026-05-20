"use client"

import { useCallback, useEffect, useRef, useState, Fragment } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Download, RotateCcw, ImagePlus, Check, X, Undo2, Redo2, ChevronDown } from "lucide-react"
import { useResizeEditor } from "@/hooks/use-resize-editor"
import { useCanvasViewport } from "@/hooks/use-canvas-viewport"
import { exportArtboard } from "@/lib/resize-export"
import { ACCEPTED_TYPES } from "@/lib/upload-utils"
import { CanvasSizeControl } from "./CanvasSizeControl"
import { ResizeCanvas } from "./ResizeCanvas"
import { ResizeStatusBar } from "./ResizeStatusBar"
import { ZoomIndicator } from "@/components/ZoomIndicator"

const DOWNLOAD_FORMATS = [
  { label: "PNG", mime: "image/png" as const, desc: "Lossless, transparent" },
  { label: "JPEG", mime: "image/jpeg" as const, desc: "Smaller size, no transparency" },
  { label: "WebP", mime: "image/webp" as const, desc: "Best compression, modern" },
]

function DownloadDropdown({ onDownload }: { onDownload: (format: "image/png" | "image/jpeg" | "image/webp") => void }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider bg-foreground text-background rounded cursor-pointer hover:bg-foreground/90 transition-colors"
      >
        <Download className="h-3.5 w-3.5" />
        Download
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-background border border-border rounded-md shadow-lg z-50 py-1">
          {DOWNLOAD_FORMATS.map((fmt) => (
            <button
              key={fmt.label}
              onClick={() => { onDownload(fmt.mime); setOpen(false) }}
              className="flex flex-col w-full px-3 py-2 text-left cursor-pointer hover:bg-muted transition-colors"
            >
              <span className="text-xs font-medium text-foreground">{fmt.label}</span>
              <span className="text-[10px] text-muted-foreground">{fmt.desc}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

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

      if (isCmd && (e.key === "=" || e.key === "+")) {
        e.preventDefault()
        viewport.zoomAtPoint(containerSize.width / 2, containerSize.height / 2, 1.15)
        return
      }
      if (isCmd && e.key === "-") {
        e.preventDefault()
        viewport.zoomAtPoint(containerSize.width / 2, containerSize.height / 2, 1 / 1.15)
        return
      }
      if (isCmd && e.key === "0") {
        e.preventDefault()
        viewport.fitToView()
        return
      }

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
  }, [mode, applyCrop, cancelCrop, setMode, clearImage, containerSize, viewport, undo, redo])

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
    async (format: "image/png" | "image/jpeg" | "image/webp") => {
      if (!image) return
      try {
        const quality = format === "image/png" ? undefined : 0.92
        const blob = await exportArtboard(
          image, transform, canvasSize.width, canvasSize.height, format, quality
        )
        const ext = format === "image/jpeg" ? ".jpg" : format === "image/webp" ? ".webp" : ".png"
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
      const targetScale = percent / 100
      const factor = targetScale / viewport.scale
      viewport.zoomAtPoint(containerSize.width / 2, containerSize.height / 2, factor)
    },
    [viewport, containerSize]
  )

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-60 shrink-0 border-r border-border bg-background flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <CanvasSizeControl
            width={canvasSize.width}
            height={canvasSize.height}
            onChange={setCanvasSize}
          />
        </div>

        {/* Sidebar bottom: replace image */}
        {image && (
          <div className="border-t border-border px-4 py-3">
            <button
              onClick={() => replaceInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 w-full py-2 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded cursor-pointer hover:text-foreground transition-colors"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              {t("replaceImage")}
            </button>
          </div>
        )}
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — compact */}
        <div className="flex items-center justify-between h-11 px-3 border-b border-border bg-background">
          {/* Left: undo/redo + mode actions */}
          <div className="flex items-center gap-1.5">
            {image && mode !== "crop" && (
              <>
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="w-7 h-7 flex items-center justify-center text-muted-foreground rounded cursor-pointer hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-default disabled:pointer-events-none"
                  title="Undo (Cmd+Z)"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="w-7 h-7 flex items-center justify-center text-muted-foreground rounded cursor-pointer hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-default disabled:pointer-events-none"
                  title="Redo (Cmd+Shift+Z)"
                >
                  <Redo2 className="h-3.5 w-3.5" />
                </button>
                <div className="w-px h-4 bg-border mx-1" />
                <button
                  onClick={resetImage}
                  className="w-7 h-7 flex items-center justify-center text-muted-foreground rounded cursor-pointer hover:bg-muted hover:text-foreground transition-colors"
                  title={t("reset")}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </>
            )}

            {mode === "crop" && (
              <>
                <p className="text-[10px] text-muted-foreground mr-2">
                  {t("cropHint")}
                </p>
                <button
                  onClick={applyCrop}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider bg-accent text-accent-foreground rounded cursor-pointer hover:bg-accent/90 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  {t("applyCrop")}
                </button>
                <button
                  onClick={cancelCrop}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded cursor-pointer hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  {t("cancelCrop")}
                </button>
              </>
            )}
          </div>

          {/* Center: title */}
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Image Resize
          </span>

          {/* Right: dimensions + download */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {canvasSize.width} × {canvasSize.height} {t("px")}
            </span>
            {image && mode !== "crop" && (
              <>
                <div className="w-px h-4 bg-border" />
                <DownloadDropdown onDownload={handleDownload} />
              </>
            )}
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

      <input
        ref={replaceInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleReplaceFile}
      />
    </div>
  )
}
