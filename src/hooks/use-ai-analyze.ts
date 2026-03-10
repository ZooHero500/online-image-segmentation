"use client"

import { useState, useCallback } from "react"
import type { RecognizedElement } from "@/types"
import { blobToBase64DataUrl } from "@/lib/ai-segmentation"

interface UseAiAnalyzeReturn {
  elements: RecognizedElement[]
  isAnalyzing: boolean
  error: string | null
  analyze: (imageBlob: Blob) => Promise<void>
  reset: () => void
}

export function useAiAnalyze(): UseAiAnalyzeReturn {
  const [elements, setElements] = useState<RecognizedElement[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (imageBlob: Blob) => {
    setIsAnalyzing(true)
    setError(null)
    setElements([])

    try {
      const dataUrl = await blobToBase64DataUrl(imageBlob)

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "Failed to analyze image")
      }

      const data = await response.json()
      setElements(data.elements)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setElements([])
    setError(null)
    setIsAnalyzing(false)
  }, [])

  return { elements, isAnalyzing, error, analyze, reset }
}
