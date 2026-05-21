"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import {
  Download, RotateCcw, ImagePlus, Check, X, Undo2, Redo2, ChevronDown,
  RotateCw, FlipHorizontal2, FlipVertical2,
  AlignCenterHorizontal, AlignCenterVertical, AlignStartHorizontal,
  AlignEndHorizontal, AlignStartVertical, AlignEndVertical, Maximize2,
} from "lucide-react"
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

const CROP_RATIOS = [
  { key: "ratioFree", value: null },
  { key: "ratio1_1", value: 1 },
  { key: "ratio4_3", value: 4 / 3 },
  { key: "ratio16_9", value: 16 / 9 },
  { key: "ratio3_2", value: 3 / 2 },
] as const

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

function ToolbarButton({ onClick, disabled, title, children }: {
  onClick: () => void
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 flex items-center justify-center text-muted-foreground rounded cursor-pointer hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-default disabled:pointer-events-none"
      title={title}
    >
      {children}
    </button>
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
    rotateLeft,
    rotateRight,
    flipHorizontal,
    flipVertical,
    fitMode,
    setFitMode,
    alignImage,
  } = useResizeEditor()

  const [cropAspectRatio, setCropAspectRatio] = useState<number | null>(null)

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

  // Position input handlers
  const handlePositionChange = useCallback(
    (axis: "x" | "y", value: string) => {
      const num = parseFloat(value)
      if (isNaN(num)) return
      setTransform({ ...transform, [axis]: num })
    },
    [transform, setTransform]
  )

  const handleScaleChange = useCallback(
    (value: string) => {
      const num = parseFloat(value)
      if (isNaN(num) || num <= 0) return
      setTransform({ ...transform, scale: num / 100 })
    },
    [transform, setTransform]
  )

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-60 shrink-0 border-r border-border bg-background flex flex-col relative">
        {/* Sidebar mask during crop mode */}
        {mode === "crop" && (
          <div className="absolute inset-0 bg-background/80 z-10" />
        )}

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          <CanvasSizeControl
            width={canvasSize.width}
            height={canvasSize.height}
            onChange={setCanvasSize}
          />

          {/* Fit Mode */}
          {image && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
                {t("fitMode")}
              </p>
              <div className="flex gap-1">
                {(["fill", "fit"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setFitMode(m)}
                    className={`flex-1 py-1.5 text-xs uppercase tracking-wider rounded cursor-pointer transition-colors ${
                      fitMode === m ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {t(m === "fill" ? "fitModeFill" : "fitModeFit")}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Position & Scale */}
          {image && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
                {t("position")}
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">X</label>
                  <input
                    type="number"
                    value={Math.round(transform.x)}
                    onChange={(e) => handlePositionChange("x", e.target.value)}
                    className="w-full h-7 px-1.5 text-xs bg-background border border-border rounded text-foreground text-center focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Y</label>
                  <input
                    type="number"
                    value={Math.round(transform.y)}
                    onChange={(e) => handlePositionChange("y", e.target.value)}
                    className="w-full h-7 px-1.5 text-xs bg-background border border-border rounded text-foreground text-center focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">{t("scale")}</label>
                  <input
                    type="number"
                    value={Math.round(transform.scale * 100)}
                    onChange={(e) => handleScaleChange(e.target.value)}
                    min={1}
                    className="w-full h-7 px-1.5 text-xs bg-background border border-border rounded text-foreground text-center focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Crop Ratio (shown during crop mode) */}
          {mode === "crop" && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
                {t("cropRatio")}
              </p>
              <div className="flex flex-wrap gap-1">
                {CROP_RATIOS.map((ratio) => (
                  <button
                    key={ratio.key}
                    onClick={() => setCropAspectRatio(ratio.value)}
                    className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded cursor-pointer transition-colors ${
                      cropAspectRatio === ratio.value ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {t(ratio.key)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar bottom: replace image + restore */}
        {image && (
          <div className="border-t border-border px-4 py-3 flex flex-col gap-2">
            <button
              onClick={() => replaceInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 w-full py-2 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded cursor-pointer hover:text-foreground transition-colors"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              {t("replaceImage")}
            </button>
            {transform.crop && (
              <button
                onClick={resetImage}
                className="flex items-center justify-center gap-1.5 w-full py-2 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded cursor-pointer hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t("reset")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — compact */}
        <div className="flex items-center justify-between h-11 px-3 border-b border-border bg-background">
          {/* Left: undo/redo + transform tools */}
          <div className="flex items-center gap-1">
            {image && mode !== "crop" && (
              <>
                <ToolbarButton onClick={undo} disabled={!canUndo} title="Undo (Cmd+Z)">
                  <Undo2 className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton onClick={redo} disabled={!canRedo} title="Redo (Cmd+Shift+Z)">
                  <Redo2 className="h-3.5 w-3.5" />
                </ToolbarButton>

                <div className="w-px h-4 bg-border mx-1" />

                <ToolbarButton onClick={rotateLeft} title={t("rotateLeft")}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton onClick={rotateRight} title={t("rotateRight")}>
                  <RotateCw className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton onClick={flipHorizontal} title={t("flipH")}>
                  <FlipHorizontal2 className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton onClick={flipVertical} title={t("flipV")}>
                  <FlipVertical2 className="h-3.5 w-3.5" />
                </ToolbarButton>

                <div className="w-px h-4 bg-border mx-1" />

                <ToolbarButton onClick={() => alignImage("left")} title={t("alignLeft")}>
                  <AlignStartHorizontal className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton onClick={() => alignImage("center")} title={t("alignCenter")}>
                  <AlignCenterHorizontal className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton onClick={() => alignImage("right")} title={t("alignRight")}>
                  <AlignEndHorizontal className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton onClick={() => alignImage("top")} title={t("alignTop")}>
                  <AlignStartVertical className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton onClick={() => alignImage("center")} title={t("alignCenter")}>
                  <AlignCenterVertical className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton onClick={() => alignImage("bottom")} title={t("alignBottom")}>
                  <AlignEndVertical className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton onClick={() => alignImage("fill")} title={t("alignFill")}>
                  <Maximize2 className="h-3.5 w-3.5" />
                </ToolbarButton>
              </>
            )}

            {mode === "crop" && (
              <p className="text-[10px] text-muted-foreground">
                {t("cropHint")}
              </p>
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
            onApplyCrop={applyCrop}
            viewportScale={viewport.scale}
            viewportPosition={viewport.position}
            onZoomAtPoint={viewport.zoomAtPoint}
            onPan={viewport.panBy}
            cropAspectRatio={cropAspectRatio}
          />

          {/* Floating crop actions */}
          {mode === "crop" && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-border rounded-lg shadow-lg px-3 py-2">
              <button
                onClick={applyCrop}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider bg-accent text-accent-foreground rounded cursor-pointer hover:bg-accent/90 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                {t("applyCrop")}
              </button>
              <button
                onClick={cancelCrop}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded cursor-pointer hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                {t("cancelCrop")}
              </button>
              {transform.crop && (
                <button
                  onClick={resetImage}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded cursor-pointer hover:text-foreground transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {t("reset")}
                </button>
              )}
            </div>
          )}

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
