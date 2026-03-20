"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { RecognizedElement } from "@/types"
import { blobToBase64DataUrl } from "@/lib/ai-segmentation"

interface UseAiAnalyzeReturn {
  elements: RecognizedElement[]
  isAnalyzing: boolean
  error: string | null
  analyze: (imageBlob: Blob) => Promise<RecognizedElement[]>
  reset: () => void
}

export function useAiAnalyze(): UseAiAnalyzeReturn {
  const [elements, setElements] = useState<RecognizedElement[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const analyze = useCallback(async (imageBlob: Blob): Promise<RecognizedElement[]> => {
    // Abort any in-flight request
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsAnalyzing(true)
    setError(null)
    setElements([])

    try {
      const dataUrl = await blobToBase64DataUrl(imageBlob)

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "Failed to analyze image")
      }

      const data = await response.json()
      const result: RecognizedElement[] = data.elements
      setElements(result)
      return result
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return []
      }
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
      return []
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const reset = useCallback(() => {
    abortControllerRef.current?.abort()
    setElements([])
    setError(null)
    setIsAnalyzing(false)
  }, [])

  return { elements, isAnalyzing, error, analyze, reset }
}
