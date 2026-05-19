"use client"

import { useState, useCallback } from "react"
import { ArrowLeftRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { validateCanvasSize } from "@/lib/resize-utils"

interface CanvasSizeControlProps {
  width: number
  height: number
  onChange: (size: { width: number; height: number }) => void
}

const PRESETS = [
  { key: "preset_1_1", w: 1080, h: 1080 },
  { key: "preset_4_3", w: 1200, h: 900 },
  { key: "preset_3_4", w: 900, h: 1200 },
  { key: "preset_16_9", w: 1920, h: 1080 },
  { key: "preset_9_16", w: 1080, h: 1920 },
] as const

export function CanvasSizeControl({
  width,
  height,
  onChange,
}: CanvasSizeControlProps) {
  const t = useTranslations("resize")
  const [inputW, setInputW] = useState(String(width))
  const [inputH, setInputH] = useState(String(height))
  const [error, setError] = useState<string | null>(null)

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
    (w: number, h: number) => {
      setInputW(String(w))
      setInputH(String(h))
      setError(null)
      onChange({ width: w, height: h })
    },
    [onChange]
  )

  const activePreset = PRESETS.find(
    (p) => p.w === width && p.h === height
  )?.key

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {t("canvasSize")}
      </p>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
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
            className="w-20 h-8 px-2 text-sm bg-background border border-border rounded text-foreground text-center focus:outline-none focus:border-accent"
          />
        </div>

        <button
          onClick={handleSwap}
          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          title={t("swap")}
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-1">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
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
            className="w-20 h-8 px-2 text-sm bg-background border border-border rounded text-foreground text-center focus:outline-none focus:border-accent"
          />
        </div>

        <span className="text-[10px] text-muted-foreground">{t("px")}</span>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.key}
            onClick={() => handlePreset(preset.w, preset.h)}
            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border rounded transition-colors ${
              activePreset === preset.key
                ? "border-accent text-accent bg-accent/5"
                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {t(preset.key)}
          </button>
        ))}
      </div>
    </div>
  )
}
