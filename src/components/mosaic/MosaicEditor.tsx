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
import { toast } from "sonner"
import {
  Download,
  Eraser,
  EyeOff,
  ImagePlus,
  Layers,
  Paintbrush,
  RotateCcw,
  Shield,
  Square,
  Trash2,
  Upload,
} from "lucide-react"
import { Link } from "@/i18n/navigation"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { LogoIcon } from "@/components/LogoIcon"
import { UploadZone } from "@/components/UploadZone"
import {
  createPrivacyMaskBrushStroke,
  createPrivacyMaskImageLayer,
  createPrivacyMaskRegion,
  createPrivacyMaskState,
  exportPrivacyMaskedImage,
  getPrivacyMaskBaseName,
  getPrivacyMaskOutputExtension,
  normalizePrivacyMaskRegion,
  removePrivacyMaskImageLayer,
  removePrivacyMaskRegion,
  renderPrivacyMaskToCanvas,
  updatePrivacyMaskImageLayer,
  updatePrivacyMaskRegion,
  type PrivacyMaskBrushMode,
  type PrivacyMaskBrushStroke,
  type PrivacyMaskEffect,
  type PrivacyMaskImageAssets,
  type PrivacyMaskImageLayer,
  type PrivacyMaskOutputFormat,
  type PrivacyMaskRegion,
  type PrivacyMaskState,
} from "@/lib/privacy-mask"
import { ACCEPTED_TYPES } from "@/lib/upload-utils"
import type { UploadResult } from "@/types"

const OUTPUT_FORMATS: Array<{
  label: string
  value: PrivacyMaskOutputFormat
}> = [
  { label: "PNG", value: "image/png" },
  { label: "JPEG", value: "image/jpeg" },
  { label: "WebP", value: "image/webp" },
]

const EFFECTS: Array<{
  value: PrivacyMaskEffect
  icon: typeof EyeOff
  strength: number
}> = [
  { value: "mosaic", icon: Square, strength: 18 },
  { value: "blur", icon: EyeOff, strength: 18 },
  { value: "solid", icon: Shield, strength: 100 },
]

const COLOR_SWATCHES = [
  "#111827",
  "#000000",
  "#ffffff",
  "#ef4444",
  "#2563eb",
  "#f59e0b",
]

const MIN_REGION_SIZE = 8

interface Point {
  x: number
  y: number
}

type ResizeHandle = "nw" | "ne" | "sw" | "se"
type ToolMode = "region" | "brush" | "erase"

type Interaction =
  | {
      type: "draw"
      start: Point
      effect: PrivacyMaskEffect
      strength: number
      color: string
    }
  | {
      type: "move"
      start: Point
      region: PrivacyMaskRegion
    }
  | {
      type: "resize"
      start: Point
      region: PrivacyMaskRegion
      handle: ResizeHandle
    }
  | {
      type: "brush"
    }
  | {
      type: "imageMove"
      start: Point
      layer: PrivacyMaskImageLayer
    }
  | {
      type: "imageResize"
      start: Point
      layer: PrivacyMaskImageLayer
      handle: ResizeHandle
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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("Failed to read mask image"))
    reader.readAsDataURL(file)
  })
}

function loadImageFromSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Failed to load mask image"))
    image.src = src
  })
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
  disabled,
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
      <span className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>
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

function getRegionLabel(effect: PrivacyMaskEffect) {
  if (effect === "solid") return "cover"
  return effect
}

export function MosaicEditor() {
  const t = useTranslations("mosaic")
  const [source, setSource] = useState<UploadResult | null>(null)
  const [maskState, setMaskState] = useState<PrivacyMaskState>(() =>
    createPrivacyMaskState()
  )
  const [imageAssets, setImageAssets] = useState<PrivacyMaskImageAssets>({})
  const [toolMode, setToolMode] = useState<ToolMode>("region")
  const [activeEffect, setActiveEffect] =
    useState<PrivacyMaskEffect>("mosaic")
  const [activeStrength, setActiveStrength] = useState(18)
  const [activeColor, setActiveColor] = useState("#111827")
  const [brushSize, setBrushSize] = useState(32)
  const [outputFormat, setOutputFormat] =
    useState<PrivacyMaskOutputFormat>("image/png")
  const [quality, setQuality] = useState(92)
  const [isRendering, setIsRendering] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const [draftRegion, setDraftRegion] = useState<PrivacyMaskRegion | null>(null)
  const [draftStroke, setDraftStroke] =
    useState<PrivacyMaskBrushStroke | null>(null)
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<SVGSVGElement>(null)
  const maskImageInputRef = useRef<HTMLInputElement>(null)
  const interactionRef = useRef<Interaction | null>(null)

  const selectedRegion = useMemo(
    () =>
      maskState.regions.find(
        (region) => region.id === maskState.selectedRegionId
      ) ?? null,
    [maskState]
  )

  const selectedImageLayer = useMemo(
    () =>
      maskState.imageLayers.find(
        (layer) => layer.id === maskState.selectedImageLayerId
      ) ?? null,
    [maskState]
  )

  const currentEffect = selectedRegion?.effect ?? activeEffect
  const currentStrength = selectedRegion?.strength ?? activeStrength
  const currentColor = selectedRegion?.color ?? activeColor
  const hasLayers =
    maskState.regions.length > 0 ||
    maskState.strokes.length > 0 ||
    maskState.imageLayers.length > 0

  const updateDisplaySize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    setDisplaySize({ width: rect.width, height: rect.height })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new ResizeObserver(updateDisplaySize)
    observer.observe(canvas)
    const frame = requestAnimationFrame(updateDisplaySize)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [source, updateDisplaySize])

  useEffect(() => {
    if (!source || !canvasRef.current || isInteracting) return

    let cancelled = false
    setIsRendering(true)

    renderPrivacyMaskToCanvas(
      canvasRef.current,
      source.image,
      maskState,
      imageAssets
    )
      .then(() => {
        if (!cancelled) updateDisplaySize()
      })
      .catch(() => {
        if (!cancelled) toast.error(t("previewFailed"))
      })
      .finally(() => {
        if (!cancelled) setIsRendering(false)
      })

    return () => {
      cancelled = true
    }
  }, [source, maskState, imageAssets, isInteracting, t, updateDisplaySize])

  const handleImageLoaded = useCallback((result: UploadResult) => {
    setSource(result)
    setMaskState(createPrivacyMaskState())
    setImageAssets({})
    setDraftRegion(null)
    setDraftStroke(null)
  }, [])

  const handleReplaceImage = useCallback(() => {
    setSource(null)
    setMaskState(createPrivacyMaskState())
    setImageAssets({})
    setDraftRegion(null)
    setDraftStroke(null)
  }, [])

  const getPointFromEvent = useCallback(
    (event: React.PointerEvent<SVGElement>): Point | null => {
      if (!source || !overlayRef.current) return null
      const rect = overlayRef.current.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return null

      return {
        x: clamp(
          ((event.clientX - rect.left) / rect.width) * source.image.naturalWidth,
          0,
          source.image.naturalWidth
        ),
        y: clamp(
          ((event.clientY - rect.top) / rect.height) * source.image.naturalHeight,
          0,
          source.image.naturalHeight
        ),
      }
    },
    [source]
  )

  const createDraftFromPoints = useCallback(
    (
      start: Point,
      end: Point,
      effect: PrivacyMaskEffect,
      strength: number,
      color: string
    ) => {
      if (!source) return null
      const rect = normalizePrivacyMaskRegion(
        {
          x: start.x,
          y: start.y,
          width: end.x - start.x,
          height: end.y - start.y,
        },
        source.image.naturalWidth,
        source.image.naturalHeight
      )

      return createPrivacyMaskRegion({
        id: "pm-draft",
        ...rect,
        effect,
        strength,
        color,
      })
    },
    [source]
  )

  const createDraftStroke = useCallback(
    (point: Point, mode: PrivacyMaskBrushMode) =>
      createPrivacyMaskBrushStroke({
        id: "pbs-draft",
        mode,
        points: [point],
        size: brushSize,
        effect: activeEffect,
        strength: activeEffect === "solid" ? 100 : activeStrength,
        color: activeColor,
      }),
    [activeColor, activeEffect, activeStrength, brushSize]
  )

  const handleOverlayPointerDown = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (!source) return
      const point = getPointFromEvent(event)
      if (!point) return

      event.currentTarget.setPointerCapture(event.pointerId)

      if (toolMode === "brush" || toolMode === "erase") {
        const stroke = createDraftStroke(
          point,
          toolMode === "erase" ? "erase" : "mask"
        )
        interactionRef.current = { type: "brush" }
        setIsInteracting(true)
        setDraftStroke(stroke)
        setMaskState((prev) => ({
          ...prev,
          selectedRegionId: null,
          selectedImageLayerId: null,
        }))
        return
      }

      interactionRef.current = {
        type: "draw",
        start: point,
        effect: activeEffect,
        strength: activeEffect === "solid" ? 100 : activeStrength,
        color: activeColor,
      }
      setIsInteracting(true)
      setDraftRegion(
        createDraftFromPoints(
          point,
          point,
          activeEffect,
          activeEffect === "solid" ? 100 : activeStrength,
          activeColor
        )
      )
      setMaskState((prev) => ({
        ...prev,
        selectedRegionId: null,
        selectedImageLayerId: null,
      }))
    },
    [
      source,
      getPointFromEvent,
      toolMode,
      createDraftStroke,
      activeEffect,
      activeStrength,
      activeColor,
      createDraftFromPoints,
    ]
  )

  const handleRegionPointerDown = useCallback(
    (region: PrivacyMaskRegion, event: React.PointerEvent<SVGRectElement>) => {
      const point = getPointFromEvent(event)
      if (!point) return

      event.stopPropagation()
      event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId)
      interactionRef.current = {
        type: "move",
        start: point,
        region,
      }
      setIsInteracting(true)
      setMaskState((prev) => ({
        ...prev,
        selectedRegionId: region.id,
        selectedImageLayerId: null,
      }))
    },
    [getPointFromEvent]
  )

  const handleHandlePointerDown = useCallback(
    (
      region: PrivacyMaskRegion,
      handle: ResizeHandle,
      event: React.PointerEvent<SVGRectElement>
    ) => {
      const point = getPointFromEvent(event)
      if (!point) return

      event.stopPropagation()
      event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId)
      interactionRef.current = {
        type: "resize",
        start: point,
        region,
        handle,
      }
      setIsInteracting(true)
      setMaskState((prev) => ({
        ...prev,
        selectedRegionId: region.id,
        selectedImageLayerId: null,
      }))
    },
    [getPointFromEvent]
  )

  const handleImageLayerPointerDown = useCallback(
    (layer: PrivacyMaskImageLayer, event: React.PointerEvent<SVGRectElement>) => {
      const point = getPointFromEvent(event)
      if (!point) return

      event.stopPropagation()
      event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId)
      interactionRef.current = {
        type: "imageMove",
        start: point,
        layer,
      }
      setIsInteracting(true)
      setMaskState((prev) => ({
        ...prev,
        selectedRegionId: null,
        selectedImageLayerId: layer.id,
      }))
    },
    [getPointFromEvent]
  )

  const handleImageHandlePointerDown = useCallback(
    (
      layer: PrivacyMaskImageLayer,
      handle: ResizeHandle,
      event: React.PointerEvent<SVGRectElement>
    ) => {
      const point = getPointFromEvent(event)
      if (!point) return

      event.stopPropagation()
      event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId)
      interactionRef.current = {
        type: "imageResize",
        start: point,
        layer,
        handle,
      }
      setIsInteracting(true)
      setMaskState((prev) => ({
        ...prev,
        selectedRegionId: null,
        selectedImageLayerId: layer.id,
      }))
    },
    [getPointFromEvent]
  )

  const updateInteraction = useCallback(
    (point: Point) => {
      if (!source || !interactionRef.current) return
      const interaction = interactionRef.current

      if (interaction.type === "draw") {
        setDraftRegion(
          createDraftFromPoints(
            interaction.start,
            point,
            interaction.effect,
            interaction.strength,
            interaction.color
          )
        )
        return
      }

      if (interaction.type === "brush") {
        setDraftStroke((prev) =>
          prev ? { ...prev, points: [...prev.points, point] } : prev
        )
        return
      }

      if (interaction.type === "move") {
        const dx = point.x - interaction.start.x
        const dy = point.y - interaction.start.y
        const nextX = clamp(
          interaction.region.x + dx,
          0,
          source.image.naturalWidth - interaction.region.width
        )
        const nextY = clamp(
          interaction.region.y + dy,
          0,
          source.image.naturalHeight - interaction.region.height
        )

        setMaskState((prev) =>
          updatePrivacyMaskRegion(prev, interaction.region.id, {
            x: nextX,
            y: nextY,
          })
        )
        return
      }

      if (interaction.type === "imageMove") {
        const dx = point.x - interaction.start.x
        const dy = point.y - interaction.start.y
        const nextX = clamp(
          interaction.layer.x + dx,
          -interaction.layer.width / 2,
          source.image.naturalWidth - interaction.layer.width / 2
        )
        const nextY = clamp(
          interaction.layer.y + dy,
          -interaction.layer.height / 2,
          source.image.naturalHeight - interaction.layer.height / 2
        )

        setMaskState((prev) =>
          updatePrivacyMaskImageLayer(prev, interaction.layer.id, {
            x: nextX,
            y: nextY,
          })
        )
        return
      }

      if (interaction.type === "imageResize") {
        const nextLayer = getResizedImageLayer(
          interaction.layer,
          interaction.handle,
          point,
          source.image.naturalWidth,
          source.image.naturalHeight
        )
        setMaskState((prev) =>
          updatePrivacyMaskImageLayer(prev, interaction.layer.id, nextLayer)
        )
        return
      }

      const nextRect = getResizedRegion(
        interaction.region,
        interaction.handle,
        point,
        source.image.naturalWidth,
        source.image.naturalHeight
      )
      setMaskState((prev) =>
        updatePrivacyMaskRegion(prev, interaction.region.id, nextRect)
      )
    },
    [source, createDraftFromPoints]
  )

  const handleOverlayPointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const point = getPointFromEvent(event)
      if (!point) return
      updateInteraction(point)
    },
    [getPointFromEvent, updateInteraction]
  )

  const finishInteraction = useCallback(() => {
    const interaction = interactionRef.current
    if (interaction?.type === "draw" && draftRegion) {
      if (
        draftRegion.width >= MIN_REGION_SIZE &&
        draftRegion.height >= MIN_REGION_SIZE
      ) {
        const region = createPrivacyMaskRegion({
          x: draftRegion.x,
          y: draftRegion.y,
          width: draftRegion.width,
          height: draftRegion.height,
          effect: draftRegion.effect,
          strength: draftRegion.strength,
          color: draftRegion.color,
        })
        setMaskState((prev) => ({
          ...prev,
          regions: [...prev.regions, region],
          selectedRegionId: region.id,
          selectedImageLayerId: null,
        }))
      }
    }

    if (interaction?.type === "brush" && draftStroke) {
      if (draftStroke.points.length > 0) {
        const stroke = createPrivacyMaskBrushStroke({
          mode: draftStroke.mode,
          points: draftStroke.points,
          size: draftStroke.size,
          effect: draftStroke.effect,
          strength: draftStroke.strength,
          color: draftStroke.color,
        })
        setMaskState((prev) => ({
          ...prev,
          strokes: [...prev.strokes, stroke],
          selectedRegionId: null,
          selectedImageLayerId: null,
        }))
      }
    }

    interactionRef.current = null
    setDraftRegion(null)
    setDraftStroke(null)
    setIsInteracting(false)
  }, [draftRegion, draftStroke])

  const handleOverlayPointerUp = useCallback(() => {
    finishInteraction()
  }, [finishInteraction])

  const updateSelectedRegion = useCallback(
    (patch: Partial<PrivacyMaskRegion>) => {
      setMaskState((prev) => {
        if (!prev.selectedRegionId) return prev
        return updatePrivacyMaskRegion(prev, prev.selectedRegionId, patch)
      })
    },
    []
  )

  const updateSelectedImageLayer = useCallback(
    (patch: Partial<PrivacyMaskImageLayer>) => {
      setMaskState((prev) => {
        if (!prev.selectedImageLayerId) return prev
        return updatePrivacyMaskImageLayer(prev, prev.selectedImageLayerId, patch)
      })
    },
    []
  )

  const selectEffect = useCallback(
    (effect: PrivacyMaskEffect) => {
      const defaultStrength =
        EFFECTS.find((item) => item.value === effect)?.strength ?? activeStrength

      setActiveEffect(effect)
      setActiveStrength(defaultStrength)
      if (selectedRegion) {
        updateSelectedRegion({
          effect,
          strength: effect === "solid" ? 100 : defaultStrength,
        })
      }
    },
    [activeStrength, selectedRegion, updateSelectedRegion]
  )

  const handleStrengthChange = useCallback(
    (value: number) => {
      setActiveStrength(value)
      if (selectedRegion) {
        updateSelectedRegion({ strength: value })
      }
    },
    [selectedRegion, updateSelectedRegion]
  )

  const handleColorChange = useCallback(
    (color: string) => {
      setActiveColor(color)
      if (selectedRegion) {
        updateSelectedRegion({ color })
      }
    },
    [selectedRegion, updateSelectedRegion]
  )

  const removeSelectedLayer = useCallback(() => {
    setMaskState((prev) => {
      if (prev.selectedImageLayerId) {
        return removePrivacyMaskImageLayer(prev, prev.selectedImageLayerId)
      }
      if (prev.selectedRegionId) {
        return removePrivacyMaskRegion(prev, prev.selectedRegionId)
      }
      return prev
    })
  }, [])

  const clearRegions = useCallback(() => {
    setMaskState(createPrivacyMaskState())
    setImageAssets({})
  }, [])

  const addImageMaskLayer = useCallback(
    async (file: File) => {
      if (!source || !ACCEPTED_TYPES.includes(file.type)) {
        toast.error(t("maskImageLoadFailed"))
        return
      }

      try {
        const imageSrc = await readFileAsDataUrl(file)
        const maskImage = await loadImageFromSrc(imageSrc)
        const aspectRatio =
          maskImage.naturalWidth > 0 && maskImage.naturalHeight > 0
            ? maskImage.naturalWidth / maskImage.naturalHeight
            : 1
        let width = clamp(
          Math.round(source.image.naturalWidth * 0.28),
          48,
          source.image.naturalWidth
        )
        let height = Math.max(24, Math.round(width / aspectRatio))
        if (height > source.image.naturalHeight) {
          height = source.image.naturalHeight
          width = Math.max(24, Math.round(height * aspectRatio))
        }
        const layer = createPrivacyMaskImageLayer({
          imageSrc,
          imageName: file.name,
          x: Math.max(0, (source.image.naturalWidth - width) / 2),
          y: Math.max(0, (source.image.naturalHeight - height) / 2),
          width,
          height,
          opacity: 0.85,
        })

        setImageAssets((prev) => ({ ...prev, [imageSrc]: maskImage }))
        setMaskState((prev) => ({
          ...prev,
          imageLayers: [...prev.imageLayers, layer],
          selectedRegionId: null,
          selectedImageLayerId: layer.id,
        }))
      } catch {
        toast.error(t("maskImageLoadFailed"))
      }
    },
    [source, t]
  )

  const handleMaskImageInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) void addImageMaskLayer(file)
      event.target.value = ""
    },
    [addImageMaskLayer]
  )

  const handleDownload = useCallback(async () => {
    if (!source) return
    setIsExporting(true)
    try {
      const blob = await exportPrivacyMaskedImage(
        source.image,
        maskState,
        outputFormat,
        quality / 100,
        imageAssets
      )
      const ext = getPrivacyMaskOutputExtension(outputFormat)
      const baseName = getPrivacyMaskBaseName(source.file.name)
      downloadBlob(blob, `${baseName}_masked.${ext}`)
      toast.success(t("downloadReady"))
    } catch {
      toast.error(t("exportFailed"))
    } finally {
      setIsExporting(false)
    }
  }, [source, maskState, outputFormat, quality, imageAssets, t])

  return (
    <>
      <input
        ref={maskImageInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleMaskImageInput}
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
            <div className="hidden items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:flex">
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
              <Link href="/collage" className="transition-colors hover:text-foreground">
                Collage
              </Link>
              <Link href="/tools" className="transition-colors hover:text-foreground">
                Tools
              </Link>
              <span className="font-medium text-foreground">Mosaic</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {source && (
              <button
                onClick={handleReplaceImage}
                className="flex cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
              >
                <Upload className="h-3.5 w-3.5" />
                {t("replaceImage")}
              </button>
            )}
            <LocaleSwitcher variant="compact" />
          </div>
        </div>
      </nav>

      {!source ? (
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
            <UploadZone onImageLoaded={handleImageLoaded} />
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <div className="flex min-h-0 flex-1 items-center justify-center bg-muted/20 p-3 md:p-5">
            <div className="relative max-h-full max-w-full overflow-auto border border-border bg-background p-2 shadow-sm">
              {isRendering && (
                <div className="absolute left-3 top-3 z-20 rounded bg-background/90 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t("rendering")}
                </div>
              )}
              <div className="relative inline-block max-w-full align-top">
                <canvas
                  ref={canvasRef}
                  className="block h-auto max-h-[calc(100vh-9rem)] max-w-full select-none"
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
                    viewBox={`0 0 ${displaySize.width} ${displaySize.height}`}
                    onPointerDown={handleOverlayPointerDown}
                    onPointerMove={handleOverlayPointerMove}
                    onPointerUp={handleOverlayPointerUp}
                    onPointerCancel={handleOverlayPointerUp}
                    aria-hidden="true"
                  >
                    {maskState.regions.map((region, index) => (
                      <RegionOverlay
                        key={region.id}
                        region={region}
                        index={index}
                        selected={region.id === maskState.selectedRegionId}
                        displaySize={displaySize}
                        imageWidth={source.image.naturalWidth}
                        imageHeight={source.image.naturalHeight}
                        onRegionPointerDown={handleRegionPointerDown}
                        onHandlePointerDown={handleHandlePointerDown}
                      />
                    ))}
                    {maskState.imageLayers.map((layer, index) => (
                      <ImageLayerOverlay
                        key={layer.id}
                        layer={layer}
                        index={index}
                        selected={layer.id === maskState.selectedImageLayerId}
                        displaySize={displaySize}
                        imageWidth={source.image.naturalWidth}
                        imageHeight={source.image.naturalHeight}
                        onLayerPointerDown={handleImageLayerPointerDown}
                        onHandlePointerDown={handleImageHandlePointerDown}
                      />
                    ))}
                    {draftRegion && (
                      <RegionOverlay
                        region={draftRegion}
                        index={maskState.regions.length}
                        selected
                        draft
                        displaySize={displaySize}
                        imageWidth={source.image.naturalWidth}
                        imageHeight={source.image.naturalHeight}
                        onRegionPointerDown={handleRegionPointerDown}
                        onHandlePointerDown={handleHandlePointerDown}
                      />
                    )}
                    {draftStroke && (
                      <StrokeOverlay
                        stroke={draftStroke}
                        displaySize={displaySize}
                        imageWidth={source.image.naturalWidth}
                        imageHeight={source.image.naturalHeight}
                      />
                    )}
                  </svg>
                )}
              </div>
            </div>
          </div>

          <aside className="flex min-h-0 shrink-0 flex-col border-t border-border bg-background md:w-80 md:border-l md:border-t-0 lg:w-96">
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
              <section>
                <SectionTitle icon={<Paintbrush className="h-3.5 w-3.5" />}>
                  {t("tool")}
                </SectionTitle>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: "region", label: "regionTool", icon: Square },
                    { value: "brush", label: "brushTool", icon: Paintbrush },
                    { value: "erase", label: "eraserTool", icon: Eraser },
                  ] as const).map((tool) => {
                    const Icon = tool.icon
                    return (
                      <button
                        key={tool.value}
                        type="button"
                        onClick={() => setToolMode(tool.value)}
                        className={`flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 rounded border px-2 py-2 text-xs uppercase tracking-wider transition-colors ${
                          toolMode === tool.value
                            ? "border-accent bg-accent/5 text-accent"
                            : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {t(tool.label)}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => maskImageInputRef.current?.click()}
                  className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded border border-border py-2 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  {t("addImageMask")}
                </button>
              </section>

              {!selectedImageLayer ? (
                <section>
                <SectionTitle>{t("effect")}</SectionTitle>
                  <div className="grid grid-cols-3 gap-2">
                    {EFFECTS.map((effect) => {
                      const Icon = effect.icon
                      return (
                        <button
                          key={effect.value}
                          type="button"
                          onClick={() => selectEffect(effect.value)}
                          className={`flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded border px-2 py-2 text-xs uppercase tracking-wider transition-colors ${
                            currentEffect === effect.value
                              ? "border-accent bg-accent/5 text-accent"
                              : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {t(effect.value)}
                        </button>
                      )
                    })}
                  </div>
                </section>
              ) : null}

              <section>
                <SectionTitle>{t("settings")}</SectionTitle>
                {selectedImageLayer ? (
                  <div className="space-y-4">
                    <RangeField
                      label={t("imageOpacity")}
                      value={Math.round(selectedImageLayer.opacity * 100)}
                      min={5}
                      max={100}
                      suffix="%"
                      onChange={(value) =>
                        updateSelectedImageLayer({ opacity: value / 100 })
                      }
                    />
                    <RangeField
                      label={t("imageRotation")}
                      value={selectedImageLayer.rotation}
                      min={-180}
                      max={180}
                      suffix="°"
                      onChange={(value) =>
                        updateSelectedImageLayer({ rotation: value })
                      }
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(toolMode === "brush" || toolMode === "erase") && (
                      <RangeField
                        label={t("brushSize")}
                        value={brushSize}
                        min={4}
                        max={160}
                        suffix="px"
                        onChange={setBrushSize}
                      />
                    )}
                    <RangeField
                      label={t(currentEffect === "blur" ? "blurStrength" : "mosaicSize")}
                      value={currentStrength}
                      min={currentEffect === "blur" ? 1 : 4}
                      max={80}
                      suffix="px"
                      disabled={currentEffect === "solid" || toolMode === "erase"}
                      onChange={handleStrengthChange}
                    />

                    {currentEffect === "solid" && toolMode !== "erase" && (
                      <div>
                        <span className="mb-2 block text-xs text-muted-foreground">
                          {t("coverColor")}
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={currentColor}
                            onChange={(event) => handleColorChange(event.target.value)}
                            className="h-8 w-10 rounded border border-border bg-background"
                          />
                          {COLOR_SWATCHES.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => handleColorChange(color)}
                              className={`h-7 w-7 cursor-pointer rounded border ${
                                currentColor === color
                                  ? "border-accent"
                                  : "border-border"
                              }`}
                              style={{ backgroundColor: color }}
                              aria-label={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>

              <section>
                <SectionTitle icon={<Layers className="h-3.5 w-3.5" />}>
                  {t("layers")}
                </SectionTitle>
                {hasLayers ? (
                  <div className="space-y-2">
                    {maskState.regions.map((region, index) => (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() =>
                          setMaskState((prev) => ({
                            ...prev,
                            selectedRegionId: region.id,
                            selectedImageLayerId: null,
                          }))
                        }
                        className={`flex w-full cursor-pointer items-center justify-between rounded border px-3 py-2 text-left transition-colors ${
                          region.id === maskState.selectedRegionId
                            ? "border-accent bg-accent/5"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block text-xs text-foreground">
                            {t("region")} {index + 1}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            {t(getRegionLabel(region.effect))}
                          </span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {Math.round(region.width)} x {Math.round(region.height)}
                        </span>
                      </button>
                    ))}
                    {maskState.imageLayers.map((layer, index) => (
                      <button
                        key={layer.id}
                        type="button"
                        onClick={() =>
                          setMaskState((prev) => ({
                            ...prev,
                            selectedRegionId: null,
                            selectedImageLayerId: layer.id,
                          }))
                        }
                        className={`flex w-full cursor-pointer items-center justify-between rounded border px-3 py-2 text-left transition-colors ${
                          layer.id === maskState.selectedImageLayerId
                            ? "border-accent bg-accent/5"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-xs text-foreground">
                            {t("imageMask")} {index + 1}
                          </span>
                          <span className="block max-w-44 truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            {layer.imageName}
                          </span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {Math.round(layer.opacity * 100)}%
                        </span>
                      </button>
                    ))}
                    {maskState.strokes.length > 0 && (
                      <div className="flex items-center justify-between rounded border border-border bg-muted/30 px-3 py-2">
                        <span className="text-xs text-foreground">
                          {t("brushStrokes")}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {maskState.strokes.length}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="rounded border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                    {t("emptyLayers")}
                  </p>
                )}

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={removeSelectedLayer}
                    disabled={!selectedRegion && !selectedImageLayer}
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded border border-border py-2 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t("deleteLayer")}
                  </button>
                  <button
                    type="button"
                    onClick={clearRegions}
                    disabled={!hasLayers}
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded border border-border py-2 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t("clear")}
                  </button>
                </div>
              </section>

              <section>
                <SectionTitle>{t("export")}</SectionTitle>
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

function RegionOverlay({
  region,
  index,
  selected,
  draft,
  displaySize,
  imageWidth,
  imageHeight,
  onRegionPointerDown,
  onHandlePointerDown,
}: {
  region: PrivacyMaskRegion
  index: number
  selected: boolean
  draft?: boolean
  displaySize: { width: number; height: number }
  imageWidth: number
  imageHeight: number
  onRegionPointerDown: (
    region: PrivacyMaskRegion,
    event: React.PointerEvent<SVGRectElement>
  ) => void
  onHandlePointerDown: (
    region: PrivacyMaskRegion,
    handle: ResizeHandle,
    event: React.PointerEvent<SVGRectElement>
  ) => void
}) {
  const rect = {
    x: (region.x / imageWidth) * displaySize.width,
    y: (region.y / imageHeight) * displaySize.height,
    width: (region.width / imageWidth) * displaySize.width,
    height: (region.height / imageHeight) * displaySize.height,
  }
  const stroke = selected ? "#2563eb" : "#111827"
  const fill =
    region.effect === "solid"
      ? withAlpha(region.color, 0.22)
      : "rgba(17, 24, 39, 0.16)"
  const handleSize = 10
  const handles: Array<{ id: ResizeHandle; x: number; y: number }> = [
    { id: "nw", x: rect.x, y: rect.y },
    { id: "ne", x: rect.x + rect.width, y: rect.y },
    { id: "sw", x: rect.x, y: rect.y + rect.height },
    { id: "se", x: rect.x + rect.width, y: rect.y + rect.height },
  ]

  return (
    <g opacity={region.enabled ? 1 : 0.45}>
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill={fill}
        stroke={stroke}
        strokeWidth={selected ? 2 : 1.25}
        strokeDasharray={draft ? "5 4" : undefined}
        className="cursor-move"
        onPointerDown={(event) => onRegionPointerDown(region, event)}
      />
      <text
        x={rect.x + 8}
        y={rect.y + 18}
        fill={selected ? "#2563eb" : "#111827"}
        fontSize="11"
        fontWeight="600"
        pointerEvents="none"
      >
        {index + 1}
      </text>
      {selected &&
        handles.map((handle) => (
          <rect
            key={handle.id}
            x={handle.x - handleSize / 2}
            y={handle.y - handleSize / 2}
            width={handleSize}
            height={handleSize}
            rx={2}
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth={1.5}
            className={
              handle.id === "nw" || handle.id === "se"
                ? "cursor-nwse-resize"
                : "cursor-nesw-resize"
            }
            onPointerDown={(event) =>
              onHandlePointerDown(region, handle.id, event)
            }
          />
        ))}
    </g>
  )
}

function ImageLayerOverlay({
  layer,
  index,
  selected,
  displaySize,
  imageWidth,
  imageHeight,
  onLayerPointerDown,
  onHandlePointerDown,
}: {
  layer: PrivacyMaskImageLayer
  index: number
  selected: boolean
  displaySize: { width: number; height: number }
  imageWidth: number
  imageHeight: number
  onLayerPointerDown: (
    layer: PrivacyMaskImageLayer,
    event: React.PointerEvent<SVGRectElement>
  ) => void
  onHandlePointerDown: (
    layer: PrivacyMaskImageLayer,
    handle: ResizeHandle,
    event: React.PointerEvent<SVGRectElement>
  ) => void
}) {
  const rect = {
    x: (layer.x / imageWidth) * displaySize.width,
    y: (layer.y / imageHeight) * displaySize.height,
    width: (layer.width / imageWidth) * displaySize.width,
    height: (layer.height / imageHeight) * displaySize.height,
  }
  const centerX = rect.x + rect.width / 2
  const centerY = rect.y + rect.height / 2
  const transform = `rotate(${layer.rotation} ${centerX} ${centerY})`
  const stroke = selected ? "#2563eb" : "#111827"
  const handleSize = 10
  const handles: Array<{ id: ResizeHandle; x: number; y: number }> = [
    { id: "nw", x: rect.x, y: rect.y },
    { id: "ne", x: rect.x + rect.width, y: rect.y },
    { id: "sw", x: rect.x, y: rect.y + rect.height },
    { id: "se", x: rect.x + rect.width, y: rect.y + rect.height },
  ]

  return (
    <g opacity={layer.enabled ? 1 : 0.45} transform={transform}>
      {selected && (
        <image
          href={layer.imageSrc}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          opacity={Math.min(layer.opacity, 0.35)}
          preserveAspectRatio="none"
          pointerEvents="none"
        />
      )}
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill={selected ? "rgba(37, 99, 235, 0.08)" : "rgba(17, 24, 39, 0.02)"}
        stroke={stroke}
        strokeWidth={selected ? 2 : 1.25}
        strokeDasharray="6 4"
        className="cursor-move"
        onPointerDown={(event) => onLayerPointerDown(layer, event)}
      />
      <text
        x={rect.x + 8}
        y={rect.y + 18}
        fill={selected ? "#2563eb" : "#111827"}
        fontSize="11"
        fontWeight="600"
        pointerEvents="none"
      >
        IMG {index + 1}
      </text>
      {selected &&
        handles.map((handle) => (
          <rect
            key={handle.id}
            x={handle.x - handleSize / 2}
            y={handle.y - handleSize / 2}
            width={handleSize}
            height={handleSize}
            rx={2}
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth={1.5}
            className={
              handle.id === "nw" || handle.id === "se"
                ? "cursor-nwse-resize"
                : "cursor-nesw-resize"
            }
            onPointerDown={(event) =>
              onHandlePointerDown(layer, handle.id, event)
            }
          />
        ))}
    </g>
  )
}

function StrokeOverlay({
  stroke,
  displaySize,
  imageWidth,
  imageHeight,
}: {
  stroke: PrivacyMaskBrushStroke
  displaySize: { width: number; height: number }
  imageWidth: number
  imageHeight: number
}) {
  const points = stroke.points.map((point) => ({
    x: (point.x / imageWidth) * displaySize.width,
    y: (point.y / imageHeight) * displaySize.height,
  }))
  const strokeWidth = Math.max(
    2,
    (stroke.size / Math.max(1, imageWidth)) * displaySize.width
  )
  const color =
    stroke.mode === "erase"
      ? "#ffffff"
      : stroke.effect === "solid"
        ? stroke.color
        : "#2563eb"
  const dash = stroke.mode === "erase" ? `${strokeWidth * 0.7} ${strokeWidth * 0.5}` : undefined
  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ")
  const firstPoint = points[0]

  if (!firstPoint) return null

  if (points.length === 1) {
    return (
      <g pointerEvents="none">
        <circle
          cx={firstPoint.x}
          cy={firstPoint.y}
          r={strokeWidth / 2 + 1}
          fill="none"
          stroke="rgba(17, 24, 39, 0.45)"
          strokeWidth={2}
        />
        <circle
          cx={firstPoint.x}
          cy={firstPoint.y}
          r={strokeWidth / 2}
          fill={color}
          opacity={stroke.mode === "erase" ? 0.72 : 0.34}
        />
      </g>
    )
  }

  return (
    <g pointerEvents="none">
      <polyline
        points={polylinePoints}
        fill="none"
        stroke="rgba(17, 24, 39, 0.35)"
        strokeWidth={strokeWidth + 3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dash}
        opacity={stroke.mode === "erase" ? 0.78 : 0.45}
      />
    </g>
  )
}

function getResizedRegion(
  region: PrivacyMaskRegion,
  handle: ResizeHandle,
  point: Point,
  imageWidth: number,
  imageHeight: number
): Partial<PrivacyMaskRegion> {
  const left = region.x
  const top = region.y
  const right = region.x + region.width
  const bottom = region.y + region.height

  const rect = (() => {
    if (handle === "nw") {
      return { x: point.x, y: point.y, width: right - point.x, height: bottom - point.y }
    }
    if (handle === "ne") {
      return { x: left, y: point.y, width: point.x - left, height: bottom - point.y }
    }
    if (handle === "sw") {
      return { x: point.x, y: top, width: right - point.x, height: point.y - top }
    }
    return { x: left, y: top, width: point.x - left, height: point.y - top }
  })()

  const normalized = normalizePrivacyMaskRegion(rect, imageWidth, imageHeight)
  return {
    x: normalized.x,
    y: normalized.y,
    width: Math.max(MIN_REGION_SIZE, normalized.width),
    height: Math.max(MIN_REGION_SIZE, normalized.height),
  }
}

function getResizedImageLayer(
  layer: PrivacyMaskImageLayer,
  handle: ResizeHandle,
  point: Point,
  imageWidth: number,
  imageHeight: number
): Partial<PrivacyMaskImageLayer> {
  const aspectRatio = layer.height > 0 ? layer.width / layer.height : 1
  const anchor = {
    x: handle === "nw" || handle === "sw" ? layer.x + layer.width : layer.x,
    y: handle === "nw" || handle === "ne" ? layer.y + layer.height : layer.y,
  }
  const rawWidth = Math.abs(point.x - anchor.x)
  const rawHeight = Math.abs(point.y - anchor.y)
  let width = Math.max(MIN_REGION_SIZE, rawWidth, rawHeight * aspectRatio)
  let height = Math.max(MIN_REGION_SIZE, width / aspectRatio)

  if (width > imageWidth) {
    width = imageWidth
    height = width / aspectRatio
  }
  if (height > imageHeight) {
    height = imageHeight
    width = height * aspectRatio
  }

  const x = handle === "nw" || handle === "sw" ? anchor.x - width : anchor.x
  const y = handle === "nw" || handle === "ne" ? anchor.y - height : anchor.y

  return {
    x: clamp(x, 0, Math.max(0, imageWidth - width)),
    y: clamp(y, 0, Math.max(0, imageHeight - height)),
    width,
    height,
  }
}

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace("#", "")
  if (normalized.length !== 6) return `rgba(17, 24, 39, ${alpha})`
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
