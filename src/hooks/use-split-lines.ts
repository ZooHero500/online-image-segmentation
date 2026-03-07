"use client"

import { useCallback, useMemo } from "react"
import { useUndoRedo } from "./use-undo-redo"
import type { SplitLine } from "@/types"

interface UseSplitLinesOptions {
  workspaceWidth: number
  workspaceHeight: number
  snapThreshold?: number
  maxLinesPerDirection?: number
}

interface UseSplitLinesReturn {
  lines: SplitLine[]
  addLine: (orientation: "horizontal" | "vertical") => void
  addLineAtPosition: (orientation: "horizontal" | "vertical", position: number) => void
  updateLinePosition: (id: string, position: number) => void
  removeLine: (id: string) => void
  canAddHorizontal: boolean
  canAddVertical: boolean
  calculateSnap: (
    position: number,
    orientation: "horizontal" | "vertical"
  ) => number
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  setLines: (lines: SplitLine[]) => void
}

let lineIdCounter = 0
function generateLineId(): string {
  return `line-${++lineIdCounter}-${Date.now()}`
}

export function useSplitLines({
  workspaceWidth,
  workspaceHeight,
  snapThreshold = 8,
  maxLinesPerDirection = 20,
}: UseSplitLinesOptions): UseSplitLinesReturn {
  const {
    state: lines,
    setState: setLinesWithHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<SplitLine[]>({ initialState: [] })

  const horizontalCount = useMemo(
    () => lines.filter((l) => l.orientation === "horizontal").length,
    [lines]
  )
  const verticalCount = useMemo(
    () => lines.filter((l) => l.orientation === "vertical").length,
    [lines]
  )

  const canAddHorizontal = horizontalCount < maxLinesPerDirection
  const canAddVertical = verticalCount < maxLinesPerDirection

  const clampPosition = useCallback(
    (position: number, orientation: "horizontal" | "vertical"): number => {
      const max = orientation === "horizontal" ? workspaceHeight : workspaceWidth
      return Math.max(0, Math.min(position, max))
    },
    [workspaceWidth, workspaceHeight]
  )

  const calculateSnap = useCallback(
    (position: number, orientation: "horizontal" | "vertical"): number => {
      const max = orientation === "horizontal" ? workspaceHeight : workspaceWidth
      const targets = [
        0,
        max,
        ...lines
          .filter((l) => l.orientation === orientation)
          .map((l) => l.position),
      ]

      for (const target of targets) {
        if (Math.abs(position - target) <= snapThreshold) {
          return target
        }
      }
      return position
    },
    [lines, workspaceWidth, workspaceHeight, snapThreshold]
  )

  const addLine = useCallback(
    (orientation: "horizontal" | "vertical") => {
      const count =
        orientation === "horizontal" ? horizontalCount : verticalCount
      if (count >= maxLinesPerDirection) return

      const center =
        orientation === "horizontal" ? workspaceHeight / 2 : workspaceWidth / 2
      const newLine: SplitLine = {
        id: generateLineId(),
        orientation,
        position: center,
      }
      setLinesWithHistory([...lines, newLine])
    },
    [
      lines,
      setLinesWithHistory,
      workspaceWidth,
      workspaceHeight,
      horizontalCount,
      verticalCount,
      maxLinesPerDirection,
    ]
  )

  const addLineAtPosition = useCallback(
    (orientation: "horizontal" | "vertical", position: number) => {
      const count =
        orientation === "horizontal" ? horizontalCount : verticalCount
      if (count >= maxLinesPerDirection) return

      const clamped = clampPosition(position, orientation)
      const newLine: SplitLine = {
        id: generateLineId(),
        orientation,
        position: clamped,
      }
      setLinesWithHistory([...lines, newLine])
    },
    [
      lines,
      setLinesWithHistory,
      clampPosition,
      horizontalCount,
      verticalCount,
      maxLinesPerDirection,
    ]
  )

  const updateLinePosition = useCallback(
    (id: string, position: number) => {
      const line = lines.find((l) => l.id === id)
      if (!line) return
      const clamped = clampPosition(position, line.orientation)
      setLinesWithHistory(
        lines.map((l) => (l.id === id ? { ...l, position: clamped } : l))
      )
    },
    [lines, setLinesWithHistory, clampPosition]
  )

  const removeLine = useCallback(
    (id: string) => {
      setLinesWithHistory(lines.filter((l) => l.id !== id))
    },
    [lines, setLinesWithHistory]
  )

  const setLines = useCallback(
    (newLines: SplitLine[]) => {
      setLinesWithHistory(newLines)
    },
    [setLinesWithHistory]
  )

  return {
    lines,
    addLine,
    addLineAtPosition,
    updateLinePosition,
    removeLine,
    canAddHorizontal,
    canAddVertical,
    calculateSnap,
    undo,
    redo,
    canUndo,
    canRedo,
    setLines,
  }
}
