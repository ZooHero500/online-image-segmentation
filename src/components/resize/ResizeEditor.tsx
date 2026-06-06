"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import {
  Download, RotateCcw, ImagePlus, Check, X, Undo2, Redo2, ChevronDown,
  RotateCw, FlipHorizontal2, FlipVertical2,
  AlignCenterHorizontal, AlignCenterVertical, AlignStartHorizontal,
  AlignEndHorizontal, AlignStartVertical, AlignEndVertical, Maximize2,
  PanelLeftOpen, PanelLeftClose, Settings2, Crop,
} from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useResizeEditor } from "@/hooks/use-resize-editor"
import { useCanvasViewport } from "@/hooks/use-canvas-viewport"
import { exportArtboard } from "@/lib/resize-export"
import { calculateInitialCropRect } from "@/lib/resize-utils"
import { ACCEPTED_TYPES } from "@/lib/upload-utils"
import { CanvasSizeControl } from "./CanvasSizeControl"
import { ResizeCanvas } from "./ResizeCanvas"
import { ResizeStatusBar } from "./ResizeStatusBar"
import { ZoomIndicator } from "@/components/ZoomIndicator"
import { LogoIcon } from "@/components/LogoIcon"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"

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
        <span className="hidden sm:inline">Download</span>
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

function ToolbarButton({ onClick, disabled, title, children, className = "" }: {
  onClick: () => void
  disabled?: boolean
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 md:w-7 md:h-7 flex items-center justify-center text-muted-foreground rounded cursor-pointer hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-default disabled:pointer-events-none ${className}`}
      title={title}
    >
      {children}
    </button>
  )
}

/* ─── Sidebar Content (shared between desktop sidebar & mobile drawer) ─── */
function SidebarContent({
  t,
  canvasSize,
  setCanvasSize,
  image,
  transform,
  fitMode,
  setFitMode,
  handlePositionChange,
  handleScaleChange,
  mode,
  cropAspectRatio,
  setCropAspectRatio,
  resetImage,
  replaceInputRef,
}: {
  t: ReturnType<typeof useTranslations<"resize">>
  canvasSize: { width: number; height: number }
  setCanvasSize: (s: { width: number; height: number }) => void
  image: HTMLImageElement | null
  transform: { x: number; y: number; scale: number; crop: { x: number; y: number; width: number; height: number } | null }
  fitMode: "fill" | "fit"
  setFitMode: (m: "fill" | "fit") => void
  handlePositionChange: (axis: "x" | "y", value: string) => void
  handleScaleChange: (value: string) => void
  mode: string
  cropAspectRatio: number | null
  setCropAspectRatio: (r: number | null) => void
  resetImage: () => void
  replaceInputRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <>
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
                  className={`flex-1 py-2 text-xs uppercase tracking-wider rounded cursor-pointer transition-colors ${
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
                  className="w-full h-9 md:h-7 px-1.5 text-sm md:text-xs bg-background border border-border rounded text-foreground text-center focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Y</label>
                <input
                  type="number"
                  value={Math.round(transform.y)}
                  onChange={(e) => handlePositionChange("y", e.target.value)}
                  className="w-full h-9 md:h-7 px-1.5 text-sm md:text-xs bg-background border border-border rounded text-foreground text-center focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">{t("scale")}</label>
                <input
                  type="number"
                  value={Math.round(transform.scale * 100)}
                  onChange={(e) => handleScaleChange(e.target.value)}
                  min={1}
                  className="w-full h-9 md:h-7 px-1.5 text-sm md:text-xs bg-background border border-border rounded text-foreground text-center focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Crop Ratio */}
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
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded cursor-pointer transition-colors ${
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

      {/* Bottom: replace + restore */}
      {image && (
        <div className="border-t border-border px-4 py-3 flex flex-col gap-2">
          <button
            onClick={() => replaceInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded cursor-pointer hover:text-foreground transition-colors"
          >
            <ImagePlus className="h-3.5 w-3.5" />
            {t("replaceImage")}
          </button>
          {transform.crop && (
            <button
              onClick={resetImage}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded cursor-pointer hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t("reset")}
            </button>
          )}
        </div>
      )}
    </>
  )
}

interface ResizeEditorProps {
  initialWidth?: number
  initialHeight?: number
  initialCropAspectRatio?: number | null
}

export function ResizeEditor({
  initialWidth,
  initialHeight,
  initialCropAspectRatio = null,
}: ResizeEditorProps) {
  const t = useTranslations("resize")
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
  } = useResizeEditor(initialWidth, initialHeight)

  const [cropAspectRatio, setCropAspectRatio] = useState<number | null>(initialCropAspectRatio)

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

  const startCropMode = useCallback(() => {
    if (!image) return
    setCropRect(calculateInitialCropRect(
      image.naturalWidth,
      image.naturalHeight,
      transform,
      canvasSize.width,
      canvasSize.height
    ))
    setMode("crop")
  }, [image, transform, canvasSize, setCropRect, setMode])

  const sidebarProps = {
    t,
    canvasSize,
    setCanvasSize,
    image,
    transform,
    fitMode,
    setFitMode,
    handlePositionChange,
    handleScaleChange,
    mode,
    cropAspectRatio,
    setCropAspectRatio,
    resetImage,
    replaceInputRef,
  }

  return (
    <div className="flex flex-col h-full">
      {/* Site Nav */}
      <nav className="shrink-0 h-11 flex items-center justify-between px-3 md:px-4 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-muted-foreground rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </button>

          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
            <LogoIcon className="h-3.5 w-3.5 text-foreground" />
            <span className="hidden sm:inline text-xs uppercase tracking-[0.3em] font-medium text-foreground">
              ImgSplit
            </span>
          </Link>
          <span className="hidden md:inline text-[10px] text-muted-foreground/40 mx-1">/</span>
          <span className="hidden md:inline text-[10px] uppercase tracking-[0.2em] text-muted-foreground truncate">
            {t("metadata.title").split("—")[0]?.trim() || "Image Resize"}
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-4 text-[10px] uppercase tracking-[0.2em]">
          <Link href="/" className="hidden md:inline text-muted-foreground hover:text-foreground transition-colors">
            {t("navHome")}
          </Link>
          <Link href="/tools" className="hidden md:inline text-muted-foreground hover:text-foreground transition-colors">
            {t("navTools")}
          </Link>
          <Link href="/watermark" className="hidden md:inline text-muted-foreground hover:text-foreground transition-colors">
            Watermark
          </Link>
          <Link href="/mosaic" className="hidden md:inline text-muted-foreground hover:text-foreground transition-colors">
            Mosaic
          </Link>
          <Link href="/collage" className="hidden md:inline text-muted-foreground hover:text-foreground transition-colors">
            Collage
          </Link>
          <Link href="/social-export" className="hidden md:inline text-muted-foreground hover:text-foreground transition-colors">
            Social Export
          </Link>
          <Link href="/remove-background" className="hidden md:inline text-muted-foreground hover:text-foreground transition-colors">
            Remove BG
          </Link>
          <LocaleSwitcher variant="compact" />
        </div>
      </nav>

      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-60 shrink-0 border-r border-border bg-background flex-col relative">
          {mode === "crop" && (
            <div className="absolute inset-0 bg-background/80 z-10" />
          )}
          <SidebarContent {...sidebarProps} />
        </div>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 bg-black/40 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="md:hidden fixed left-0 top-0 bottom-0 w-72 bg-background border-r border-border z-50 flex flex-col shadow-xl">
              <div className="h-11 flex items-center justify-between px-4 border-b border-border shrink-0">
                <span className="text-xs uppercase tracking-[0.2em] font-medium">{t("canvasSize")}</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SidebarContent {...sidebarProps} />
            </div>
          </>
        )}

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between h-11 px-2 md:px-3 border-b border-border bg-background">
            {/* Left: tools */}
            <div className="flex items-center gap-0.5 md:gap-1 overflow-x-auto">
              {image && mode !== "crop" && (
                <>
                  <ToolbarButton onClick={undo} disabled={!canUndo} title="Undo (Cmd+Z)">
                    <Undo2 className="h-3.5 w-3.5" />
                  </ToolbarButton>
                  <ToolbarButton onClick={redo} disabled={!canRedo} title="Redo (Cmd+Shift+Z)">
                    <Redo2 className="h-3.5 w-3.5" />
                  </ToolbarButton>

                  <div className="w-px h-4 bg-border mx-0.5 md:mx-1 shrink-0" />

                  <ToolbarButton onClick={rotateLeft} title={t("rotateLeft")}>
                    <RotateCcw className="h-3.5 w-3.5" />
                  </ToolbarButton>
                  <ToolbarButton onClick={rotateRight} title={t("rotateRight")}>
                    <RotateCw className="h-3.5 w-3.5" />
                  </ToolbarButton>
                  <ToolbarButton onClick={flipHorizontal} title={t("flipH")} className="hidden sm:flex">
                    <FlipHorizontal2 className="h-3.5 w-3.5" />
                  </ToolbarButton>
                  <ToolbarButton onClick={flipVertical} title={t("flipV")} className="hidden sm:flex">
                    <FlipVertical2 className="h-3.5 w-3.5" />
                  </ToolbarButton>

                  <div className="w-px h-4 bg-border mx-0.5 md:mx-1 shrink-0" />

                  <ToolbarButton onClick={startCropMode} title={t("cropMode")}>
                    <Crop className="h-3.5 w-3.5" />
                  </ToolbarButton>

                  {/* Align buttons — desktop only */}
                  <div className="hidden lg:contents">
                    <div className="w-px h-4 bg-border mx-1 shrink-0" />
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
                  </div>

                  {/* Mobile: settings button to open sidebar */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden w-8 h-8 flex items-center justify-center text-muted-foreground rounded cursor-pointer hover:bg-muted hover:text-foreground transition-colors ml-0.5"
                    title="Settings"
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}

              {mode === "crop" && (
                <p className="text-[10px] md:text-[10px] text-muted-foreground truncate">
                  {t("cropHint")}
                </p>
              )}
            </div>

            {/* Right: dimensions + download */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              <span className="hidden sm:inline text-[10px] text-muted-foreground tabular-nums">
                {canvasSize.width} × {canvasSize.height} {t("px")}
              </span>
              {image && mode !== "crop" && (
                <>
                  <div className="hidden sm:block w-px h-4 bg-border" />
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
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-border rounded-lg shadow-lg px-2 md:px-3 py-2">
                <button
                  onClick={applyCrop}
                  className="flex items-center gap-1.5 px-3 py-2 md:py-1.5 text-xs uppercase tracking-wider bg-accent text-accent-foreground rounded cursor-pointer hover:bg-accent/90 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t("applyCrop")}</span>
                </button>
                <button
                  onClick={cancelCrop}
                  className="flex items-center gap-1.5 px-3 py-2 md:py-1.5 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded cursor-pointer hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t("cancelCrop")}</span>
                </button>
                {transform.crop && (
                  <button
                    onClick={resetImage}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider border border-border text-muted-foreground rounded cursor-pointer hover:text-foreground transition-colors"
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
      </div>{/* close body wrapper */}

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
