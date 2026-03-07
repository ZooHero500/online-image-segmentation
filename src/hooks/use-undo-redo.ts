"use client"

import { useCallback, useState } from "react"

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

interface UndoRedoState<T> {
  current: T
  undoStack: T[]
  redoStack: T[]
}

export function useUndoRedo<T>({
  initialState,
  maxStackSize = 50,
}: UseUndoRedoOptions<T>): UseUndoRedoReturn<T> {
  const [internal, setInternal] = useState<UndoRedoState<T>>({
    current: initialState,
    undoStack: [],
    redoStack: [],
  })

  const setState = useCallback(
    (newState: T) => {
      setInternal((prev) => {
        const newUndo = [...prev.undoStack, prev.current]
        if (newUndo.length > maxStackSize) {
          newUndo.shift()
        }
        return {
          current: newState,
          undoStack: newUndo,
          redoStack: [],
        }
      })
    },
    [maxStackSize]
  )

  const undo = useCallback(() => {
    setInternal((prev) => {
      if (prev.undoStack.length === 0) return prev
      const newUndo = prev.undoStack.slice(0, -1)
      const previousState = prev.undoStack[prev.undoStack.length - 1]
      return {
        current: previousState,
        undoStack: newUndo,
        redoStack: [...prev.redoStack, prev.current],
      }
    })
  }, [])

  const redo = useCallback(() => {
    setInternal((prev) => {
      if (prev.redoStack.length === 0) return prev
      const newRedo = prev.redoStack.slice(0, -1)
      const nextState = prev.redoStack[prev.redoStack.length - 1]
      return {
        current: nextState,
        undoStack: [...prev.undoStack, prev.current],
        redoStack: newRedo,
      }
    })
  }, [])

  return {
    state: internal.current,
    setState,
    undo,
    redo,
    canUndo: internal.undoStack.length > 0,
    canRedo: internal.redoStack.length > 0,
  }
}
