"use client"

import { useState, useCallback } from "react"
import { ArrowLeftRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { validateCanvasSize } from "@/lib/resize-utils"
import { RATIO_RESIZE_PRESETS, SOCIAL_RESIZE_PRESETS } from "@/lib/resize-presets"

interface CanvasSizeControlProps {
  width: number
  height: number
  onChange: (size: { width: number; height: number }) => void
}

export function CanvasSizeControl({
  width,
  height,
  onChange,
}: CanvasSizeControlProps) {
  const t = useTranslations("resize")
  const [inputW, setInputW] = useState(String(width))
  const [inputH, setInputH] = useState(String(height))
  const [error, setError] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  const applySize = useCallback(
    (w: string, h: string) => {
      const numW = parseInt(w, 10)
      const numH = parseInt(h, 10)
      if (isNaN(numW) || isNaN(numH)) {
        setError(t("invalidSize"))
        return
      }
      const validation = validateCanvasSize(numW, numH)
      if (!validation.valid) {
        setError(t("invalidSize"))
        return
      }
      setError(null)
      onChange({ width: numW, height: numH })
    },
    [onChange, t]
  )

  const handleBlurW = useCallback(() => {
    applySize(inputW, inputH)
  }, [inputW, inputH, applySize])

  const handleBlurH = useCallback(() => {
    applySize(inputW, inputH)
  }, [inputW, inputH, applySize])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        applySize(inputW, inputH)
      }
    },
    [inputW, inputH, applySize]
  )

  const handleSwap = useCallback(() => {
    setInputW(inputH)
    setInputH(inputW)
    applySize(inputH, inputW)
  }, [inputW, inputH, applySize])

  const handlePreset = useCallback(
    (preset: (typeof RATIO_RESIZE_PRESETS)[number]) => {
      setSelectedPreset(preset.slug)
      setInputW(String(preset.width))
      setInputH(String(preset.height))
      setError(null)
      onChange({ width: preset.width, height: preset.height })
    },
    [onChange]
  )

  const matchingPreset = [...RATIO_RESIZE_PRESETS, ...SOCIAL_RESIZE_PRESETS].find(
    (p) => p.width === width && p.height === height
  )?.slug
  const activePreset = selectedPreset ?? matchingPreset

  const renderPresetButton = (preset: (typeof RATIO_RESIZE_PRESETS)[number]) => (
    <button
      key={preset.slug}
      onClick={() => handlePreset(preset)}
      title={`${t(preset.labelKey)} · ${preset.width} × ${preset.height}`}
      className={`flex min-w-0 items-center justify-between gap-2 px-3 py-2.5 md:py-2 text-xs rounded cursor-pointer transition-colors ${
        activePreset === preset.slug
          ? "bg-accent/10 text-accent"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className="min-w-0 flex-1 truncate whitespace-nowrap text-left uppercase tracking-wide">
        {t(preset.labelKey)}
      </span>
      <span className="shrink-0 whitespace-nowrap text-[10px] tabular-nums text-muted-foreground/70">
        {preset.width} × {preset.height}
      </span>
    </button>
  )

  return (
    <div className="flex flex-col gap-5">
      {/* Section: Canvas Size */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
          {t("canvasSize")}
        </p>
        <div className="flex items-center gap-1.5">
          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
              {t("width")}
            </label>
            <input
              type="number"
              value={inputW}
              onChange={(e) => setInputW(e.target.value)}
              onBlur={handleBlurW}
              onKeyDown={handleKeyDown}
              min={1}
              max={4096}
              className="w-full h-10 md:h-8 px-2 text-sm bg-background border border-border rounded text-foreground text-center focus:outline-none focus:border-accent"
            />
          </div>

          <button
            onClick={handleSwap}
            className="w-9 h-9 md:w-7 md:h-7 flex items-center justify-center text-muted-foreground cursor-pointer hover:text-foreground transition-colors mt-4"
            title={t("swap")}
          >
            <ArrowLeftRight className="h-3.5 w-3.5 md:h-3 md:w-3" />
          </button>

          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
              {t("height")}
            </label>
            <input
              type="number"
              value={inputH}
              onChange={(e) => setInputH(e.target.value)}
              onBlur={handleBlurH}
              onKeyDown={handleKeyDown}
              min={1}
              max={4096}
              className="w-full h-10 md:h-8 px-2 text-sm bg-background border border-border rounded text-foreground text-center focus:outline-none focus:border-accent"
            />
          </div>
        </div>
        {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
      </div>

      {/* Section: Presets */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
          {t("presets")}
        </p>
        <div className="flex flex-col gap-1">
          {RATIO_RESIZE_PRESETS.map(renderPresetButton)}
        </div>
      </div>

      {/* Section: Social Presets */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
          {t("socialPresets")}
        </p>
        <div className="flex flex-col gap-1">
          {SOCIAL_RESIZE_PRESETS.map(renderPresetButton)}
        </div>
      </div>
    </div>
  )
}
