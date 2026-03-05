"use client"

import { useCallback, useRef, useState } from "react"

interface UseUndoRedoOptions<T> {
  initialState: T
  maxStackSize?: number
}

interface UseUndoRedoReturn<T> {
  state: T
  setState: (newState: T) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

export function useUndoRedo<T>({
  initialState,
  maxStackSize = 50,
}: UseUndoRedoOptions<T>): UseUndoRedoReturn<T> {
  const [state, setStateInternal] = useState<T>(initialState)
  const undoStack = useRef<T[]>([])
  const redoStack = useRef<T[]>([])

  const setState = useCallback(
    (newState: T) => {
      setStateInternal((prev) => {
        undoStack.current.push(prev)
        if (undoStack.current.length > maxStackSize) {
          undoStack.current.shift()
        }
        redoStack.current = []
        return newState
      })
    },
    [maxStackSize]
  )

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return
    setStateInternal((prev) => {
      const previousState = undoStack.current.pop()!
      redoStack.current.push(prev)
      return previousState
    })
  }, [])

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return
    setStateInternal((prev) => {
      const nextState = redoStack.current.pop()!
      undoStack.current.push(prev)
      return nextState
    })
  }, [])

  return {
    state,
    setState,
    undo,
    redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
  }
}
