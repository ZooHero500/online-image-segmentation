"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
  Download,
  ImagePlus,
  LayoutTemplate,
  Maximize2,
  Minimize2,
  Minus,
  Palette,
  Plus,
  RotateCcw,
  RotateCw,
  SlidersHorizontal,
  Trash2,
  Upload,
} from "lucide-react"
import { Link } from "@/i18n/navigation"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { LogoIcon } from "@/components/LogoIcon"
import { UploadZone } from "@/components/UploadZone"
import {
  assignImagesToFrames,
  calculateFrameRects,
  createCollageFrameImage,
  createCollageState,
  exportCollageImage,
  getCollageBaseName,
  getCollageOutputExtension,
  getFramePathData,
  renderCollageToCanvas,
  switchCollageTemplate,
  updateFrameImage,
  type CollageFitMode,
  type CollageImageAsset,
  type CollageImageAssetMap,
  type CollageOutputFormat,
} from "@/lib/collage"
import {
  COLLAGE_ARTBOARDS,
  COLLAGE_TEMPLATES,
  type CollageArtboard,
  type CollageTemplate,
  type CollageTemplateId,
} from "@/lib/collage-presets"
import { ACCEPTED_TYPES, loadImage, validateFiles } from "@/lib/upload-utils"
import type { UploadResult } from "@/types"

const OUTPUT_FORMATS: Array<{ label: string; value: CollageOutputFormat }> = [
  { label: "PNG", value: "image/png" },
  { label: "JPEG", value: "image/jpeg" },
  { label: "WebP", value: "image/webp" },
]

const BACKGROUND_SWATCHES = [
  "#ffffff",
  "#f8fafc",
  "#111827",
  "#f4efe6",
  "#d9ead3",
  "#f6d6d6",
]

const TEMPLATE_IDS = new Set(COLLAGE_TEMPLATES.map((template) => template.id))

interface UploadedCollageImage extends CollageImageAsset {
  file: File
  previewUrl: string
}

interface CanvasPoint {
  x: number
  y: number
}

interface DragState {
  frameId: string
  start: CanvasPoint
  offsetX: number
  offsetY: number
}

let nextImageId = 0

function createImageId() {
  nextImageId += 1
  return `ci-${nextImageId}`
}

function isCollageTemplateId(value: string | null): value is CollageTemplateId {
  return value != null && TEMPLATE_IDS.has(value as CollageTemplateId)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

function SectionTitle({
  icon,
  children,
}: {
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <p className="mb-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
      {icon}
      {children}
    </p>
  )
}

function RangeField({
  label,
  value,
  min,
  max,
  suffix,
  disabled = false,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  suffix?: string
  disabled?: boolean
  onChange: (value: number) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-[11px] text-foreground">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-foreground disabled:opacity-40"
      />
    </label>
  )
}

function TemplatePreview({ template }: { template: CollageTemplate }) {
  const getClipPath = (slot: CollageTemplate["slots"][number]) => {
    if (!slot.polygon?.length) return undefined
    return `polygon(${slot.polygon
      .map((point) => `${point.x * 100}% ${point.y * 100}%`)
      .join(", ")})`
  }

  return (
    <span
      className="relative block w-12 shrink-0 overflow-hidden rounded border border-current/20 bg-muted"
      style={{ aspectRatio: template.aspectRatio }}
    >
      {template.slots.map((slot) => (
        <span
          key={slot.id}
          className="absolute border border-background/80 bg-current/15"
          style={{
            left: `${slot.x * 100}%`,
            top: `${slot.y * 100}%`,
            width: `${slot.width * 100}%`,
            height: `${slot.height * 100}%`,
            clipPath: getClipPath(slot),
          }}
        />
      ))}
    </span>
  )
}

function createUploadedImage(result: UploadResult): UploadedCollageImage {
  return {
    id: createImageId(),
    fileName: result.file.name,
    file: result.file,
    image: result.image,
    previewUrl: URL.createObjectURL(result.file),
  }
}

export function CollageEditor() {
  const t = useTranslations("collage")
  const uploadT = useTranslations("upload")
  const searchParams = useSearchParams()
  const requestedTemplate = searchParams.get("template")
  const initialTemplate: CollageTemplateId = isCollageTemplateId(requestedTemplate)
    ? requestedTemplate
    : "four-grid"

  const [images, setImages] = useState<UploadedCollageImage[]>([])
  const [collageState, setCollageState] = useState(() =>
    createCollageState(initialTemplate)
  )
  const [outputFormat, setOutputFormat] =
    useState<CollageOutputFormat>("image/png")
  const [quality, setQuality] = useState(92)
  const [isRendering, setIsRendering] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [canvasEpoch, setCanvasEpoch] = useState(0)
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })
  const [previewAreaSize, setPreviewAreaSize] = useState({
    width: 0,
    height: 0,
  })
  const previewAreaRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<SVGSVGElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingUploadFrameIdRef = useRef<string | null>(null)
  const objectUrlsRef = useRef<string[]>([])
  const dragRef = useRef<DragState | null>(null)

  const assetMap = useMemo<CollageImageAssetMap>(
    () =>
      Object.fromEntries(
        images.map((image) => [image.id, image.image])
      ) as CollageImageAssetMap,
    [images]
  )
  const frameRects = useMemo(
    () => calculateFrameRects(collageState),
    [collageState]
  )
  const selectedFrame = useMemo(
    () =>
      collageState.frames.find(
        (frame) => frame.id === collageState.selectedFrameId
      ) ?? null,
    [collageState.frames, collageState.selectedFrameId]
  )
  const selectedAsset = selectedFrame?.image
    ? images.find((image) => image.id === selectedFrame.image?.imageId) ?? null
    : null
  const hasImages = images.length > 0
  const previewDisplaySize = useMemo(() => {
    if (previewAreaSize.width <= 0 || previewAreaSize.height <= 0) return null

    const frameChrome = 28
    const availableWidth = Math.max(1, previewAreaSize.width - frameChrome)
    const availableHeight = Math.max(1, previewAreaSize.height - frameChrome)
    const scale = Math.min(
      1,
      availableWidth / collageState.artboard.width,
      availableHeight / collageState.artboard.height
    )

    return {
      width: Math.floor(collageState.artboard.width * scale),
      height: Math.floor(collageState.artboard.height * scale),
    }
  }, [
    collageState.artboard.height,
    collageState.artboard.width,
    previewAreaSize.height,
    previewAreaSize.width,
  ])

  const syncDisplaySize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    setDisplaySize({ width: rect.width, height: rect.height })
  }, [])

  useEffect(() => {
    return () => {
      for (const url of objectUrlsRef.current) {
        URL.revokeObjectURL(url)
      }
      objectUrlsRef.current = []
    }
  }, [])

  useEffect(() => {
    if (!hasImages || !canvasRef.current) return

    try {
      setIsRendering(true)
      renderCollageToCanvas(canvasRef.current, collageState, assetMap)
      requestAnimationFrame(syncDisplaySize)
    } catch {
      toast.error(t("previewFailed"))
    } finally {
      setIsRendering(false)
    }
  }, [assetMap, collageState, hasImages, syncDisplaySize, t])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new ResizeObserver(syncDisplaySize)
    observer.observe(canvas)
    const frame = requestAnimationFrame(syncDisplaySize)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [canvasEpoch, hasImages, syncDisplaySize])

  useEffect(() => {
    const previewArea = previewAreaRef.current
    if (!previewArea) return

    const updatePreviewAreaSize = () => {
      const rect = previewArea.getBoundingClientRect()
      const style = window.getComputedStyle(previewArea)
      const horizontalPadding =
        Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight)
      const verticalPadding =
        Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom)

      setPreviewAreaSize({
        width: Math.max(0, rect.width - horizontalPadding),
        height: Math.max(0, rect.height - verticalPadding),
      })
    }
    const observer = new ResizeObserver(updatePreviewAreaSize)
    observer.observe(previewArea)
    const frame = requestAnimationFrame(updatePreviewAreaSize)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [hasImages])

  const addUploadedImages = useCallback((results: UploadResult[], targetFrameId?: string | null) => {
    const newImages = results.map(createUploadedImage)
    objectUrlsRef.current.push(...newImages.map((image) => image.previewUrl))

    setImages((prev) => [...prev, ...newImages])
    setCollageState((prev) => {
      if (!targetFrameId || !newImages[0]) {
        return assignImagesToFrames(prev, newImages)
      }

      const [firstImage, ...restImages] = newImages
      const next = {
        ...prev,
        selectedFrameId: targetFrameId,
        frames: prev.frames.map((frame) =>
          frame.id === targetFrameId
            ? { ...frame, image: createCollageFrameImage(firstImage.id) }
            : frame
        ),
      }

      return restImages.length > 0 ? assignImagesToFrames(next, restImages) : next
    })
  }, [])

  const processFiles = useCallback(
    async (files: File[], targetFrameId?: string | null) => {
      if (files.length === 0) return

      const validation = validateFiles(
        files,
        images.reduce((sum, image) => sum + image.file.size, 0)
      )
      if (!validation.valid) {
        toast.error(uploadT(validation.error!.key, validation.error!.params))
        return
      }

      if (validation.totalSizeWarning) {
        const totalSize = validation.files.reduce((sum, file) => sum + file.size, 0)
        toast.warning(
          uploadT("totalSizeWarning", {
            size: (totalSize / 1024 / 1024).toFixed(1),
          })
        )
      }

      try {
        const results = await Promise.all(
          validation.files.map(async (file) => ({
            file,
            image: await loadImage(file),
            mimeType: file.type,
          }))
        )
        addUploadedImages(results, targetFrameId)
      } catch {
        toast.error(uploadT("loadFailed"))
      }
    },
    [addUploadedImages, images, uploadT]
  )

  const handleAddMoreFiles = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files?.length) return

      const targetFrameId = pendingUploadFrameIdRef.current
      pendingUploadFrameIdRef.current = null
      await processFiles(Array.from(files), targetFrameId)
      event.target.value = ""
    },
    [processFiles]
  )

  const openFilePicker = useCallback((targetFrameId: string | null = null) => {
    pendingUploadFrameIdRef.current = targetFrameId
    fileInputRef.current?.click()
  }, [])

  const replaceImages = useCallback(() => {
    for (const url of objectUrlsRef.current) {
      URL.revokeObjectURL(url)
    }
    objectUrlsRef.current = []
    setImages([])
    setCollageState(createCollageState(collageState.templateId))
  }, [collageState.templateId])

  const removeImage = useCallback((imageId: string) => {
    setImages((prev) => {
      const target = prev.find((image) => image.id === imageId)
      if (target) {
        URL.revokeObjectURL(target.previewUrl)
        objectUrlsRef.current = objectUrlsRef.current.filter(
          (url) => url !== target.previewUrl
        )
      }
      return prev.filter((image) => image.id !== imageId)
    })
    setCollageState((prev) => ({
      ...prev,
      frames: prev.frames.map((frame) =>
        frame.image?.imageId === imageId ? { ...frame, image: null } : frame
      ),
    }))
  }, [])

  const selectTemplate = useCallback(
    (templateId: CollageTemplateId) => {
      setCollageState((prev) => switchCollageTemplate(prev, templateId, images))
      setCanvasEpoch((epoch) => epoch + 1)
    },
    [images]
  )

  const selectArtboard = useCallback((artboard: CollageArtboard) => {
    setCollageState((prev) => ({ ...prev, artboard }))
  }, [])

  const assignImageToSelectedFrame = useCallback((imageId: string) => {
    setCollageState((prev) => {
      const frameId = prev.selectedFrameId ?? prev.frames[0]?.id
      if (!frameId) return prev

      return {
        ...prev,
        selectedFrameId: frameId,
        frames: prev.frames.map((frame) =>
          frame.id === frameId
            ? { ...frame, image: createCollageFrameImage(imageId) }
            : frame
        ),
      }
    })
  }, [])

  const clearSelectedFrame = useCallback(() => {
    if (!selectedFrame) return
    setCollageState((prev) => updateFrameImage(prev, selectedFrame.id, null))
  }, [selectedFrame])

  const updateSelectedImage = useCallback(
    (patch: Parameters<typeof updateFrameImage>[2]) => {
      if (!selectedFrame?.image || !patch) return
      setCollageState((prev) => updateFrameImage(prev, selectedFrame.id, patch))
    },
    [selectedFrame]
  )

  const getCanvasPoint = useCallback((event: React.PointerEvent): CanvasPoint => {
    const overlay = overlayRef.current
    if (!overlay) return { x: 0, y: 0 }
    const rect = overlay.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * collageState.artboard.width,
      y: ((event.clientY - rect.top) / rect.height) * collageState.artboard.height,
    }
  }, [collageState.artboard.height, collageState.artboard.width])

  const handleFramePointerDown = useCallback(
    (event: React.PointerEvent<SVGPathElement>, frameId: string) => {
      event.preventDefault()
      const frame = collageState.frames.find((item) => item.id === frameId)
      setCollageState((prev) => ({ ...prev, selectedFrameId: frameId }))
      overlayRef.current?.setPointerCapture(event.pointerId)

      if (!frame?.image) {
        openFilePicker(frameId)
        return
      }
      dragRef.current = {
        frameId,
        start: getCanvasPoint(event),
        offsetX: frame.image.offsetX,
        offsetY: frame.image.offsetY,
      }
    },
    [collageState.frames, getCanvasPoint, openFilePicker]
  )

  const handleFrameDragOver = useCallback(
    (event: React.DragEvent<SVGPathElement>, frameId: string) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = "copy"
      setCollageState((prev) => ({ ...prev, selectedFrameId: frameId }))
    },
    []
  )

  const handleFrameDrop = useCallback(
    (event: React.DragEvent<SVGPathElement>, frameId: string) => {
      event.preventDefault()
      void processFiles(Array.from(event.dataTransfer.files), frameId)
    },
    [processFiles]
  )

  const handleOverlayPointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const drag = dragRef.current
      if (!drag) return

      const point = getCanvasPoint(event)
      const dx = point.x - drag.start.x
      const dy = point.y - drag.start.y
      setCollageState((prev) =>
        updateFrameImage(prev, drag.frameId, {
          offsetX: drag.offsetX + dx,
          offsetY: drag.offsetY + dy,
        })
      )
    },
    [getCanvasPoint]
  )

  const handleOverlayPointerUp = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      dragRef.current = null
      if (overlayRef.current?.hasPointerCapture(event.pointerId)) {
        overlayRef.current.releasePointerCapture(event.pointerId)
      }
    },
    []
  )

  const handleDownload = useCallback(async () => {
    setIsExporting(true)
    try {
      const blob = await exportCollageImage(
        collageState,
        assetMap,
        outputFormat,
        quality / 100
      )
      const extension = getCollageOutputExtension(outputFormat)
      const baseName = getCollageBaseName(images.map((image) => image.fileName))
      downloadBlob(blob, `${baseName}.${extension}`)
      toast.success(t("downloadReady"))
    } catch {
      toast.error(t("exportFailed"))
    } finally {
      setIsExporting(false)
    }
  }, [assetMap, collageState, images, outputFormat, quality, t])

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={handleAddMoreFiles}
      />

      <nav className="shrink-0 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-12 max-w-[1600px] items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <LogoIcon className="h-3.5 w-3.5 text-foreground" />
              <span className="text-[11px] font-medium uppercase tracking-[0.25em]">
                ImgSplit
              </span>
            </Link>
            <div className="hidden items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:flex">
              <Link href="/" className="transition-colors hover:text-foreground">
                Split
              </Link>
              <Link href="/grid" className="transition-colors hover:text-foreground">
                Grid
              </Link>
              <Link href="/resize" className="transition-colors hover:text-foreground">
                Resize
              </Link>
              <Link href="/compress" className="transition-colors hover:text-foreground">
                Compress
              </Link>
              <Link href="/watermark" className="transition-colors hover:text-foreground">
                Watermark
              </Link>
              <Link href="/mosaic" className="transition-colors hover:text-foreground">
                Mosaic
              </Link>
              <span className="font-medium text-foreground">Collage</span>
              <Link href="/tools" className="transition-colors hover:text-foreground">
                Tools
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasImages && (
              <button
                type="button"
                onClick={replaceImages}
                className="flex cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
              >
                <Upload className="h-3.5 w-3.5" />
                {t("replaceImages")}
              </button>
            )}
            <LocaleSwitcher variant="compact" />
          </div>
        </div>
      </nav>

      {!hasImages ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl space-y-6 px-4">
            <div className="text-center">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {t("uploadTitle")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("uploadDescription")}
              </p>
            </div>
            <UploadZone onImagesLoaded={addUploadedImages} />
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <aside className="shrink-0 border-b border-border bg-background lg:w-72 lg:border-b-0 lg:border-r">
            <div className="max-h-56 space-y-4 overflow-y-auto p-4 lg:max-h-none">
              <section>
                <SectionTitle icon={<LayoutTemplate className="h-3.5 w-3.5" />}>
                  {t("templates")}
                </SectionTitle>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                  {COLLAGE_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => selectTemplate(template.id)}
                      className={`flex min-h-16 cursor-pointer items-center gap-3 rounded border p-2 text-left transition-colors ${
                        collageState.templateId === template.id
                          ? "border-accent bg-accent/5 text-accent"
                          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <TemplatePreview template={template} />
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-medium uppercase tracking-[0.16em]">
                          {t(template.labelKey)}
                        </span>
                        <span className="mt-1 hidden text-[11px] leading-snug text-muted-foreground lg:block">
                          {t(template.descriptionKey)}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <SectionTitle icon={<ImagePlus className="h-3.5 w-3.5" />}>
                  {t("photos")}
                </SectionTitle>
                <button
                  type="button"
                  onClick={() => openFilePicker()}
                  className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded border border-border py-2 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  {t("addPhotos")}
                </button>
              </section>
            </div>
          </aside>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div
              ref={previewAreaRef}
              className="flex min-h-0 flex-1 items-center justify-center bg-muted/20 p-3 md:p-5"
            >
              <div className="relative max-h-full max-w-full border border-border bg-background p-2 shadow-sm">
                {isRendering && (
                  <div className="absolute left-3 top-3 z-20 rounded bg-background/90 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {t("rendering")}
                  </div>
                )}
                <div className="relative block max-h-full max-w-full">
                  <canvas
                    key={canvasEpoch}
                    ref={canvasRef}
                    className="block select-none"
                    style={
                      previewDisplaySize
                        ? {
                            width: previewDisplaySize.width,
                            height: previewDisplaySize.height,
                          }
                        : {
                            maxWidth: "100%",
                            maxHeight: "100%",
                          }
                    }
                    aria-label={t("previewCanvas")}
                  />
                  {displaySize.width > 0 && displaySize.height > 0 && (
                    <svg
                      ref={overlayRef}
                      className="absolute left-0 top-0 z-10 touch-none"
                      style={{
                        width: displaySize.width,
                        height: displaySize.height,
                      }}
                      viewBox={`0 0 ${collageState.artboard.width} ${collageState.artboard.height}`}
                      preserveAspectRatio="none"
                      onPointerMove={handleOverlayPointerMove}
                      onPointerUp={handleOverlayPointerUp}
                      onPointerCancel={handleOverlayPointerUp}
                      aria-hidden="true"
                    >
                      {frameRects.map((rect) => {
                        const frame = collageState.frames.find(
                          (item) => item.id === rect.frameId
                        )
                        const selected = frame?.id === collageState.selectedFrameId
                        const empty = !frame?.image
                        return (
                          <g key={rect.frameId}>
                            <path
                              d={getFramePathData(rect, collageState.cornerRadius)}
                              fill={empty ? "rgba(255,255,255,0.55)" : "transparent"}
                              stroke={selected ? "rgb(212, 149, 87)" : "rgba(17, 24, 39, 0.22)"}
                              strokeWidth={selected ? 4 : 2}
                              vectorEffect="non-scaling-stroke"
                              className={empty ? "cursor-copy" : "cursor-move"}
                              onDragOver={(event) =>
                                handleFrameDragOver(event, rect.frameId)
                              }
                              onDrop={(event) =>
                                handleFrameDrop(event, rect.frameId)
                              }
                              onPointerDown={(event) =>
                                handleFramePointerDown(event, rect.frameId)
                              }
                            />
                            {empty && (
                              <>
                                <text
                                  x={rect.x + rect.width / 2}
                                  y={rect.y + rect.height / 2 - (rect.height > 180 ? 20 : 0)}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="fill-muted-foreground text-5xl"
                                  pointerEvents="none"
                                >
                                  +
                                </text>
                                {rect.width > 260 && rect.height > 160 && (
                                  <text
                                    x={rect.x + rect.width / 2}
                                    y={rect.y + rect.height / 2 + 36}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="fill-muted-foreground text-2xl uppercase tracking-[0.2em]"
                                    pointerEvents="none"
                                  >
                                    {t("dropOrClick")}
                                  </text>
                                )}
                              </>
                            )}
                          </g>
                        )
                      })}
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-border bg-background p-3">
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image) => {
                  const used = collageState.frames.some(
                    (frame) => frame.image?.imageId === image.id
                  )
                  const selected = selectedAsset?.id === image.id
                  return (
                    <div
                      key={image.id}
                      className={`group relative h-20 w-20 shrink-0 overflow-hidden rounded border ${
                        selected
                          ? "border-accent"
                          : used
                            ? "border-foreground/30"
                            : "border-border"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => assignImageToSelectedFrame(image.id)}
                        className="h-full w-full cursor-pointer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.previewUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-background/90 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                        aria-label={t("removePhoto")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                })}
                <button
                  type="button"
                  onClick={() => openFilePicker()}
                  className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded border border-dashed border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  aria-label={t("addPhotos")}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <aside className="flex min-h-0 shrink-0 flex-col border-t border-border bg-background lg:w-80 lg:border-l lg:border-t-0 xl:w-96">
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
              <section>
                <SectionTitle icon={<SlidersHorizontal className="h-3.5 w-3.5" />}>
                  {t("settings")}
                </SectionTitle>
                <label className="block">
                  <span className="mb-2 block text-xs text-muted-foreground">
                    {t("outputSize")}
                  </span>
                  <select
                    value={collageState.artboard.id}
                    onChange={(event) => {
                      const artboard = COLLAGE_ARTBOARDS.find(
                        (item) => item.id === event.target.value
                      )
                      if (artboard) selectArtboard(artboard)
                    }}
                    className="h-9 w-full rounded border border-border bg-background px-3 text-sm"
                  >
                    {COLLAGE_ARTBOARDS.map((artboard) => (
                      <option key={artboard.id} value={artboard.id}>
                        {t(artboard.labelKey)} ({artboard.width} x {artboard.height})
                      </option>
                    ))}
                  </select>
                </label>

                <div className="mt-4 space-y-4">
                  <RangeField
                    label={t("spacing")}
                    value={collageState.spacing}
                    min={0}
                    max={96}
                    suffix="px"
                    onChange={(spacing) =>
                      setCollageState((prev) => ({ ...prev, spacing }))
                    }
                  />
                  <RangeField
                    label={t("margin")}
                    value={collageState.margin}
                    min={0}
                    max={180}
                    suffix="px"
                    onChange={(margin) =>
                      setCollageState((prev) => ({ ...prev, margin }))
                    }
                  />
                  <RangeField
                    label={t("cornerRadius")}
                    value={collageState.cornerRadius}
                    min={0}
                    max={120}
                    suffix="px"
                    onChange={(cornerRadius) =>
                      setCollageState((prev) => ({ ...prev, cornerRadius }))
                    }
                  />
                </div>
              </section>

              <section>
                <SectionTitle icon={<Palette className="h-3.5 w-3.5" />}>
                  {t("background")}
                </SectionTitle>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={collageState.backgroundColor}
                    disabled={collageState.transparentBackground}
                    onChange={(event) =>
                      setCollageState((prev) => ({
                        ...prev,
                        backgroundColor: event.target.value,
                      }))
                    }
                    className="h-8 w-10 rounded border border-border bg-background disabled:opacity-40"
                  />
                  {BACKGROUND_SWATCHES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setCollageState((prev) => ({
                          ...prev,
                          backgroundColor: color,
                          transparentBackground: false,
                        }))
                      }
                      className={`h-7 w-7 cursor-pointer rounded border ${
                        collageState.backgroundColor === color &&
                        !collageState.transparentBackground
                          ? "border-accent"
                          : "border-border"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={color}
                    />
                  ))}
                </div>
                <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={collageState.transparentBackground}
                    onChange={(event) =>
                      setCollageState((prev) => ({
                        ...prev,
                        transparentBackground: event.target.checked,
                      }))
                    }
                  />
                  {t("transparent")}
                </label>
              </section>

              <section>
                <SectionTitle>
                  {selectedAsset ? t("selectedPhoto") : t("emptyFrame")}
                </SectionTitle>
                {selectedFrame?.image ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {(["fill", "fit"] as CollageFitMode[]).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => updateSelectedImage({ fitMode: mode })}
                          className={`flex cursor-pointer items-center justify-center gap-1.5 rounded border py-2 text-xs uppercase tracking-wider transition-colors ${
                            selectedFrame.image?.fitMode === mode
                              ? "border-accent bg-accent/5 text-accent"
                              : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {mode === "fill" ? (
                            <Maximize2 className="h-3.5 w-3.5" />
                          ) : (
                            <Minimize2 className="h-3.5 w-3.5" />
                          )}
                          {t(mode)}
                        </button>
                      ))}
                    </div>

                    <RangeField
                      label={t("scale")}
                      value={Math.round(selectedFrame.image.scale * 100)}
                      min={60}
                      max={260}
                      suffix="%"
                      onChange={(value) =>
                        updateSelectedImage({ scale: clamp(value / 100, 0.6, 2.6) })
                      }
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateSelectedImage({
                            rotation: selectedFrame.image!.rotation - 90,
                          })
                        }
                        className="flex cursor-pointer items-center justify-center gap-1.5 rounded border border-border py-2 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={t("rotateLeft")}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateSelectedImage({
                            scale: clamp(selectedFrame.image!.scale - 0.1, 0.6, 2.6),
                          })
                        }
                        className="flex cursor-pointer items-center justify-center rounded border border-border py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={t("scaleDown")}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateSelectedImage({
                            rotation: selectedFrame.image!.rotation + 90,
                          })
                        }
                        className="flex cursor-pointer items-center justify-center gap-1.5 rounded border border-border py-2 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={t("rotateRight")}
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={clearSelectedFrame}
                      className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded border border-border py-2 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t("clearFrame")}
                    </button>
                  </div>
                ) : (
                  <p className="rounded border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                    {t("emptyFrameHint")}
                  </p>
                )}
              </section>

              <section>
                <SectionTitle>{t("format")}</SectionTitle>
                <div className="grid grid-cols-3 gap-2">
                  {OUTPUT_FORMATS.map((format) => (
                    <button
                      key={format.value}
                      type="button"
                      onClick={() => setOutputFormat(format.value)}
                      className={`rounded py-2 text-xs uppercase tracking-wider transition-colors ${
                        outputFormat === format.value
                          ? "bg-accent/10 text-accent"
                          : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
                {outputFormat !== "image/png" && (
                  <div className="mt-4">
                    <RangeField
                      label={t("quality")}
                      value={quality}
                      min={10}
                      max={100}
                      suffix="%"
                      onChange={setQuality}
                    />
                  </div>
                )}
              </section>
            </div>

            <div className="border-t border-border p-4">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isExporting}
                className="flex w-full cursor-pointer items-center justify-center gap-2 bg-foreground px-4 py-3 text-xs uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {isExporting ? t("exporting") : t("download")}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
