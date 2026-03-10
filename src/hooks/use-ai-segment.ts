"use client"

import { useState, useCallback } from "react"
import type { RecognizedElement, SegmentLayer } from "@/types"
import { generateLayerId, loadImage } from "@/lib/ai-segmentation"

interface UseAiSegmentReturn {
  layers: SegmentLayer[]
  isSegmenting: boolean
  progress: { current: number; total: number }
  error: string | null
  segment: (imageBlob: Blob, labels: RecognizedElement[]) => Promise<void>
  toggleLayerVisibility: (layerId: string) => void
  setLayers: (layers: SegmentLayer[]) => void
  reset: () => void
}

export function useAiSegment(): UseAiSegmentReturn {
  const [layers, setLayers] = useState<SegmentLayer[]>([])
  const [isSegmenting, setIsSegmenting] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [error, setError] = useState<string | null>(null)

  const segment = useCallback(async (imageBlob: Blob, labels: RecognizedElement[]) => {
    setIsSegmenting(true)
    setError(null)
    setLayers([])
    setProgress({ current: 0, total: labels.length })

    try {
      // Convert blob to data URL for API
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(imageBlob)
      })

      const response = await fetch("/api/segment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: dataUrl,
          labels: labels.map(l => ({ label_en: l.label_en, label_zh: l.label_zh })),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "Failed to segment image")
      }

      const data = await response.json()

      // Load mask images and create layers
      const newLayers: SegmentLayer[] = []
      for (let i = 0; i < data.segments.length; i++) {
        const seg = data.segments[i]
        setProgress({ current: i + 1, total: data.segments.length })

        let maskImage: HTMLImageElement | null = null
        try {
          maskImage = await loadImage(seg.maskUrl)
        } catch {
          console.warn(`Failed to load mask for ${seg.label_en}`)
        }

        newLayers.push({
          id: generateLayerId(),
          label_en: seg.label_en,
          label_zh: seg.label_zh,
          maskUrl: seg.maskUrl,
          maskImage,
          color: seg.color,
          visible: true,
        })

        // Update layers progressively so UI shows each layer as it loads
        setLayers([...newLayers])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsSegmenting(false)
    }
  }, [])

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    )
  }, [])

  const reset = useCallback(() => {
    setLayers([])
    setError(null)
    setIsSegmenting(false)
    setProgress({ current: 0, total: 0 })
  }, [])

  return {
    layers,
    isSegmenting,
    progress,
    error,
    segment,
    toggleLayerVisibility,
    setLayers,
    reset,
  }
}
