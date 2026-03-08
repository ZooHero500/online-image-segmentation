"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface UseRulerDragOptions {
  editorRef: React.RefObject<HTMLDivElement | null>
  stageContainerRef: React.RefObject<HTMLDivElement | null>
  viewportScale: number
  viewportPosition: { x: number; y: number }
  addLineAtPosition: (orientation: "horizontal" | "vertical", position: number) => void
  removeLine: (id: string) => void
  calculateSnap: (position: number, orientation: "horizontal" | "vertical") => number
  canAddHorizontal: boolean
  canAddVertical: boolean
  rulerThickness: number
  messages: {
    horizontalLimitReached: string
    verticalLimitReached: string
  }
}

interface UseRulerDragReturn {
  isDragging: boolean
  dragOrientation: "horizontal" | "vertical" | null
  previewPosition: number
  startDrag: (orientation: "horizontal" | "vertical") => void
  isNearRulerZone: (currentScreenPos: number, orientation: "horizontal" | "vertical") => boolean
}

export function useRulerDrag({
  editorRef,
  stageContainerRef,
  viewportScale,
  viewportPosition,
  addLineAtPosition,
  removeLine,
  calculateSnap,
  canAddHorizontal,
  canAddVertical,
  rulerThickness,
  messages,
}: UseRulerDragOptions): UseRulerDragReturn {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOrientation, setDragOrientation] = useState<"horizontal" | "vertical" | null>(null)
  const [previewPosition, setPreviewPosition] = useState(0)

  // Use ref for frequently-changing viewport values to avoid effect re-registration
  const viewportRef = useRef({ scale: viewportScale, position: viewportPosition })
  useEffect(() => {
    viewportRef.current = { scale: viewportScale, position: viewportPosition }
  }, [viewportScale, viewportPosition])

  const dragStateRef = useRef({
    isDragging: false,
    orientation: null as "horizontal" | "vertical" | null,
    rafId: 0,
  })

  const startDrag = useCallback(
    (orientation: "horizontal" | "vertical") => {
      const canAdd = orientation === "horizontal" ? canAddHorizontal : canAddVertical
      if (!canAdd) {
        toast.error(
          orientation === "horizontal"
            ? messages.horizontalLimitReached
            : messages.verticalLimitReached
        )
        return
      }
      dragStateRef.current.isDragging = true
      dragStateRef.current.orientation = orientation
      setIsDragging(true)
      setDragOrientation(orientation)
    },
    [canAddHorizontal, canAddVertical, messages]
  )

  const isNearRulerZone = useCallback(
    (currentScreenPos: number, orientation: "horizontal" | "vertical"): boolean => {
      const editor = editorRef.current
      if (!editor) return false
      const editorRect = editor.getBoundingClientRect()

      if (orientation === "horizontal") {
        return currentScreenPos - editorRect.top < rulerThickness
      } else {
        return currentScreenPos - editorRect.left < rulerThickness
      }
    },
    [editorRef, rulerThickness]
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStateRef.current.isDragging) return

      cancelAnimationFrame(dragStateRef.current.rafId)
      dragStateRef.current.rafId = requestAnimationFrame(() => {
        const editor = editorRef.current
        const stageContainer = stageContainerRef.current
        if (!editor || !stageContainer) return

        const { scale, position } = viewportRef.current
        const stageRect = stageContainer.getBoundingClientRect()
        const editorRect = editor.getBoundingClientRect()
        const orientation = dragStateRef.current.orientation

        if (orientation === "horizontal") {
          const stageScreenY = e.clientY - stageRect.top
          const imagePos = (stageScreenY - position.y) / scale
          const snapped = calculateSnap(imagePos, "horizontal")
          const screenPos = (snapped * scale + position.y) + (stageRect.top - editorRect.top)
          setPreviewPosition(screenPos)
        } else if (orientation === "vertical") {
          const stageScreenX = e.clientX - stageRect.left
          const imagePos = (stageScreenX - position.x) / scale
          const snapped = calculateSnap(imagePos, "vertical")
          const screenPos = (snapped * scale + position.x) + (stageRect.left - editorRect.left)
          setPreviewPosition(screenPos)
        }
      })
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!dragStateRef.current.isDragging) return

      const orientation = dragStateRef.current.orientation
      const stageContainer = stageContainerRef.current

      dragStateRef.current.isDragging = false
      dragStateRef.current.orientation = null
      setIsDragging(false)
      setDragOrientation(null)

      if (!orientation || !stageContainer) return

      const { scale, position } = viewportRef.current
      const stageRect = stageContainer.getBoundingClientRect()
      const isInsideCanvas =
        e.clientX >= stageRect.left &&
        e.clientX <= stageRect.right &&
        e.clientY >= stageRect.top &&
        e.clientY <= stageRect.bottom

      if (isInsideCanvas) {
        let imagePos: number
        if (orientation === "horizontal") {
          imagePos = (e.clientY - stageRect.top - position.y) / scale
        } else {
          imagePos = (e.clientX - stageRect.left - position.x) / scale
        }
        const snapped = calculateSnap(imagePos, orientation)
        addLineAtPosition(orientation, Math.round(snapped))
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      cancelAnimationFrame(dragStateRef.current.rafId)
    }
  }, [editorRef, stageContainerRef, addLineAtPosition, calculateSnap])

  return {
    isDragging,
    dragOrientation,
    previewPosition,
    startDrag,
    isNearRulerZone,
  }
}
