import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useUndoRedo } from "../use-undo-redo"

describe("useUndoRedo", () => {
  it("should initialize with given state", () => {
    const { result } = renderHook(() =>
      useUndoRedo({ initialState: [1, 2, 3] })
    )
    expect(result.current.state).toEqual([1, 2, 3])
  })

  it("should update state and push to undo stack", () => {
    const { result } = renderHook(() =>
      useUndoRedo({ initialState: "a" })
    )

    act(() => result.current.setState("b"))
    expect(result.current.state).toBe("b")
    expect(result.current.canUndo).toBe(true)
  })

  it("should undo to previous state", () => {
    const { result } = renderHook(() =>
      useUndoRedo({ initialState: "a" })
    )

    act(() => result.current.setState("b"))
    act(() => result.current.undo())

    expect(result.current.state).toBe("a")
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(true)
  })

  it("should redo to next state", () => {
    const { result } = renderHook(() =>
      useUndoRedo({ initialState: "a" })
    )

    act(() => result.current.setState("b"))
    act(() => result.current.undo())
    act(() => result.current.redo())

    expect(result.current.state).toBe("b")
    expect(result.current.canRedo).toBe(false)
  })

  it("should clear redo stack on new state change", () => {
    const { result } = renderHook(() =>
      useUndoRedo({ initialState: "a" })
    )

    act(() => result.current.setState("b"))
    act(() => result.current.undo())
    expect(result.current.canRedo).toBe(true)

    act(() => result.current.setState("c"))
    expect(result.current.canRedo).toBe(false)
    expect(result.current.state).toBe("c")
  })

  it("should respect max stack size", () => {
    const { result } = renderHook(() =>
      useUndoRedo({ initialState: 0, maxStackSize: 3 })
    )

    act(() => result.current.setState(1))
    act(() => result.current.setState(2))
    act(() => result.current.setState(3))
    act(() => result.current.setState(4))

    // Can only undo 3 times (stack size limit)
    act(() => result.current.undo())
    act(() => result.current.undo())
    act(() => result.current.undo())
    expect(result.current.canUndo).toBe(false)
    expect(result.current.state).toBe(1)
  })

  it("should not undo when nothing to undo", () => {
    const { result } = renderHook(() =>
      useUndoRedo({ initialState: "a" })
    )

    expect(result.current.canUndo).toBe(false)
    act(() => result.current.undo())
    expect(result.current.state).toBe("a")
  })

  it("should not redo when nothing to redo", () => {
    const { result } = renderHook(() =>
      useUndoRedo({ initialState: "a" })
    )

    expect(result.current.canRedo).toBe(false)
    act(() => result.current.redo())
    expect(result.current.state).toBe("a")
  })

  it("should default max stack size to 50", () => {
    const { result } = renderHook(() =>
      useUndoRedo({ initialState: 0 })
    )

    for (let i = 1; i <= 55; i++) {
      act(() => result.current.setState(i))
    }

    // Can only undo 50 times
    let undoCount = 0
    while (result.current.canUndo) {
      act(() => result.current.undo())
      undoCount++
    }
    expect(undoCount).toBe(50)
  })
})
