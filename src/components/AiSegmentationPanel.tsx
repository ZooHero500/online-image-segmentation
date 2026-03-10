"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import {
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Download,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useAiAnalyze } from "@/hooks/use-ai-analyze"
import { useAiSegment } from "@/hooks/use-ai-segment"
import { downloadBlob } from "@/lib/ai-segmentation"
import type { RecognizedElement, AiSegmentStep, SegmentLayer } from "@/types"

interface AiSegmentationPanelProps {
  imageBlob: Blob | null
  onLayersChange: (layers: SegmentLayer[]) => void
  onHoverLayer: (layerId: string | null) => void
  onIsolateLayer: (layerId: string | null) => void
}

export function AiSegmentationPanel({
  imageBlob,
  onLayersChange,
  onHoverLayer,
  onIsolateLayer,
}: AiSegmentationPanelProps) {
  const t = useTranslations("aiSegmentation")
  const [step, setStep] = useState<AiSegmentStep>("upload")
  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(new Set())
  const [customInput, setCustomInput] = useState("")
  const [customLabels, setCustomLabels] = useState<RecognizedElement[]>([])
  const [isolatedLayerId, setIsolatedLayerId] = useState<string | null>(null)

  const {
    elements,
    isAnalyzing,
    error: analyzeError,
    analyze,
    reset: resetAnalyze,
  } = useAiAnalyze()

  const {
    layers,
    isSegmenting,
    progress,
    error: segmentError,
    segment,
    toggleLayerVisibility,
    reset: resetSegment,
  } = useAiSegment()

  // Sync layers to parent
  const updateLayers = useCallback(
    (newLayers: SegmentLayer[]) => {
      onLayersChange(newLayers)
    },
    [onLayersChange]
  )

  // Step 1: Start analysis
  const handleAnalyze = useCallback(async () => {
    if (!imageBlob) return
    setStep("analyze")
    await analyze(imageBlob)
    setStep("select")
    // Default: select first 2 elements
    const allElements = elements
    const defaults = new Set(allElements.slice(0, 2).map((e) => e.label_en))
    setSelectedLabels(defaults)
  }, [imageBlob, analyze, elements])

  // Retry analysis
  const handleReanalyze = useCallback(async () => {
    resetAnalyze()
    setCustomLabels([])
    setSelectedLabels(new Set())
    if (!imageBlob) return
    setStep("analyze")
    await analyze(imageBlob)
    setStep("select")
  }, [imageBlob, analyze, resetAnalyze])

  // Toggle label selection
  const handleToggleLabel = useCallback((labelEn: string) => {
    setSelectedLabels((prev) => {
      const next = new Set(prev)
      if (next.has(labelEn)) {
        next.delete(labelEn)
      } else {
        next.add(labelEn)
      }
      return next
    })
  }, [])

  // Add custom label
  const handleAddCustom = useCallback(() => {
    const trimmed = customInput.trim()
    if (!trimmed) return
    const newLabel: RecognizedElement = {
      label_en: trimmed,
      label_zh: trimmed,
      confidence: 1,
    }
    setCustomLabels((prev) => [...prev, newLabel])
    setSelectedLabels((prev) => new Set([...prev, trimmed]))
    setCustomInput("")
  }, [customInput])

  // Start segmentation
  const handleSegment = useCallback(async () => {
    if (!imageBlob) return
    const allLabels = [...elements, ...customLabels]
    const selected = allLabels.filter((e) => selectedLabels.has(e.label_en))
    if (selected.length === 0) return
    setStep("segment")
    await segment(imageBlob, selected)
    setStep("result")
  }, [imageBlob, elements, customLabels, selectedLabels, segment])

  // Toggle layer visibility
  const handleToggleVisibility = useCallback(
    (layerId: string) => {
      toggleLayerVisibility(layerId)
    },
    [toggleLayerVisibility]
  )

  // Isolate a single layer
  const handleIsolate = useCallback(
    (layerId: string) => {
      const newId = isolatedLayerId === layerId ? null : layerId
      setIsolatedLayerId(newId)
      onIsolateLayer(newId)
    },
    [isolatedLayerId, onIsolateLayer]
  )

  // Export single layer as PNG
  const handleExportOne = useCallback(
    async (layer: SegmentLayer) => {
      if (!layer.maskUrl) return
      const response = await fetch(layer.maskUrl)
      const blob = await response.blob()
      downloadBlob(blob, `${layer.label_en}.png`)
    },
    []
  )

  // Export all visible layers as ZIP
  const handleExportAll = useCallback(async () => {
    const { default: JSZip } = await import("jszip")
    const zip = new JSZip()
    const visibleLayers = layers.filter((l) => l.visible)

    for (const layer of visibleLayers) {
      if (!layer.maskUrl) continue
      const response = await fetch(layer.maskUrl)
      const blob = await response.blob()
      zip.file(`${layer.label_en}.png`, blob)
    }

    const zipBlob = await zip.generateAsync({ type: "blob" })
    downloadBlob(zipBlob, "ai-segments.zip")
  }, [layers])

  // Back to select step
  const handleBackToSelect = useCallback(() => {
    resetSegment()
    setStep("select")
    setIsolatedLayerId(null)
    onIsolateLayer(null)
    onLayersChange([])
  }, [resetSegment, onIsolateLayer, onLayersChange])

  // Auto-start analysis when image is available
  const handleStart = useCallback(() => {
    if (imageBlob) {
      handleAnalyze()
    }
  }, [imageBlob, handleAnalyze])

  const allLabels = [...elements, ...customLabels]

  return (
    <div className="flex flex-col h-full w-80 border-l bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <Sparkles className="h-4 w-4" strokeWidth={1.5} />
        <h2 className="text-sm font-medium">{t("title")}</h2>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 px-4 py-3 border-b text-xs">
        <StepDot
          active={step === "analyze" || step === "upload"}
          done={step === "select" || step === "segment" || step === "result"}
          label={t("stepAnalyze")}
        />
        <StepLine />
        <StepDot
          active={step === "select"}
          done={step === "segment" || step === "result"}
          label={t("stepSelect")}
        />
        <StepLine />
        <StepDot
          active={step === "segment"}
          done={step === "result"}
          label={t("stepSegment")}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Upload / Start state */}
        {step === "upload" && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            {imageBlob ? (
              <Button onClick={handleStart} className="gap-2">
                <Sparkles className="h-4 w-4" />
                {t("stepAnalyze")}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                {t("noImage")}
              </p>
            )}
          </div>
        )}

        {/* Analyzing state */}
        {step === "analyze" && isAnalyzing && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-muted animate-pulse rounded" />
            ))}
            <p className="text-xs text-muted-foreground text-center">
              {t("analyzing")}
            </p>
          </div>
        )}

        {/* Analyze error */}
        {analyzeError && (
          <div className="text-center space-y-3">
            <p className="text-sm text-destructive">{t("analyzeFailed")}</p>
            <Button variant="outline" size="sm" onClick={handleReanalyze}>
              <RefreshCw className="h-3 w-3 mr-1" />
              {t("reanalyze")}
            </Button>
          </div>
        )}

        {/* Select elements */}
        {step === "select" && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {t("elementsFound", { count: allLabels.length })}
            </p>
            <p className="text-sm font-medium">{t("selectElements")}</p>

            <div className="space-y-2">
              {allLabels.map((el) => (
                <label
                  key={el.label_en}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedLabels.has(el.label_en)}
                    onCheckedChange={() => handleToggleLabel(el.label_en)}
                  />
                  <span className="text-sm">{el.label_zh}</span>
                  {el.confidence < 1 && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {Math.round(el.confidence * 100)}%
                    </span>
                  )}
                </label>
              ))}
            </div>

            {/* Custom input */}
            <div className="flex gap-2">
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
                placeholder={t("customLabel")}
                className="text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddCustom}
                disabled={!customInput.trim()}
              >
                {t("addCustom")}
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReanalyze}
                className="gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                {t("reanalyze")}
              </Button>
              <Button
                size="sm"
                onClick={handleSegment}
                disabled={selectedLabels.size === 0}
                className="flex-1 gap-1"
              >
                <Sparkles className="h-3 w-3" />
                {t("startSegment")}
              </Button>
            </div>
          </div>
        )}

        {/* Segmenting state */}
        {step === "segment" && isSegmenting && (
          <div className="space-y-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {t("segmenting", {
                current: progress.current,
                total: progress.total,
              })}
            </p>
          </div>
        )}

        {/* Segment error */}
        {segmentError && (
          <div className="text-center space-y-3">
            <p className="text-sm text-destructive">{t("segmentFailed")}</p>
            <Button variant="outline" size="sm" onClick={handleBackToSelect}>
              <ChevronLeft className="h-3 w-3 mr-1" />
              {t("backToSelect")}
            </Button>
          </div>
        )}

        {/* Result: Layer panel */}
        {step === "result" && layers.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm font-medium">{t("layers")}</p>

            <div className="space-y-1">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors group cursor-pointer"
                  onClick={() => handleIsolate(layer.id)}
                  onMouseEnter={() => onHoverLayer(layer.id)}
                  onMouseLeave={() => onHoverLayer(null)}
                >
                  <button
                    className="p-1 hover:bg-muted rounded transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleVisibility(layer.id)
                    }}
                    aria-label={layer.visible ? "Hide layer" : "Show layer"}
                  >
                    {layer.visible ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </button>

                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: layer.color }}
                  />

                  <span
                    className={`text-sm flex-1 ${
                      isolatedLayerId === layer.id ? "font-medium" : ""
                    } ${!layer.visible ? "text-muted-foreground" : ""}`}
                  >
                    {layer.label_zh}
                  </span>

                  <button
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-muted rounded transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleExportOne(layer)
                    }}
                    aria-label={t("exportOne")}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Export actions */}
            <div className="space-y-2 pt-2 border-t">
              <Button
                size="sm"
                onClick={handleExportAll}
                className="w-full gap-1"
              >
                <Download className="h-3 w-3" />
                {t("exportAllZip")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToSelect}
                className="w-full gap-1"
              >
                <ChevronLeft className="h-3 w-3" />
                {t("backToSelect")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Sub-components ---

function StepDot({
  active,
  done,
  label,
}: {
  active: boolean
  done: boolean
  label: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-2 h-2 rounded-full transition-colors ${
          done
            ? "bg-primary"
            : active
              ? "bg-primary animate-pulse"
              : "bg-muted-foreground/30"
        }`}
      />
      <span
        className={`${
          active || done ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  )
}

function StepLine() {
  return <div className="flex-1 h-px bg-border" />
}
