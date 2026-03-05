import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useSplitLines } from "../use-split-lines"

describe("useSplitLines", () => {
  const defaultOptions = { imageWidth: 400, imageHeight: 300 }

  it("should initialize with empty lines", () => {
    const { result } = renderHook(() => useSplitLines(defaultOptions))
    expect(result.current.lines).toEqual([])
  })

  it("should add a horizontal line at center", () => {
    const { result } = renderHook(() => useSplitLines(defaultOptions))

    act(() => result.current.addLine("horizontal"))

    expect(result.current.lines).toHaveLength(1)
    expect(result.current.lines[0].orientation).toBe("horizontal")
    expect(result.current.lines[0].position).toBe(150) // center of 300
  })

  it("should add a vertical line at center", () => {
    const { result } = renderHook(() => useSplitLines(defaultOptions))

    act(() => result.current.addLine("vertical"))

    expect(result.current.lines).toHaveLength(1)
    expect(result.current.lines[0].orientation).toBe("vertical")
    expect(result.current.lines[0].position).toBe(200) // center of 400
  })

  it("should remove a line by id", () => {
    const { result } = renderHook(() => useSplitLines(defaultOptions))

    act(() => result.current.addLine("horizontal"))
    const lineId = result.current.lines[0].id

    act(() => result.current.removeLine(lineId))
    expect(result.current.lines).toHaveLength(0)
  })

  it("should update line position", () => {
    const { result } = renderHook(() => useSplitLines(defaultOptions))

    act(() => result.current.addLine("horizontal"))
    const lineId = result.current.lines[0].id

    act(() => result.current.updateLinePosition(lineId, 200))
    expect(result.current.lines[0].position).toBe(200)
  })

  it("should clamp position within image bounds for horizontal line", () => {
    const { result } = renderHook(() => useSplitLines(defaultOptions))

    act(() => result.current.addLine("horizontal"))
    const lineId = result.current.lines[0].id

    act(() => result.current.updateLinePosition(lineId, -50))
    expect(result.current.lines[0].position).toBe(0)

    act(() => result.current.updateLinePosition(lineId, 500))
    expect(result.current.lines[0].position).toBe(300)
  })

  it("should clamp position within image bounds for vertical line", () => {
    const { result } = renderHook(() => useSplitLines(defaultOptions))

    act(() => result.current.addLine("vertical"))
    const lineId = result.current.lines[0].id

    act(() => result.current.updateLinePosition(lineId, 500))
    expect(result.current.lines[0].position).toBe(400)
  })

  it("should snap to edges when within threshold", () => {
    const { result } = renderHook(() =>
      useSplitLines({ ...defaultOptions, snapThreshold: 8 })
    )

    // Snap to top edge
    const snapped = result.current.calculateSnap(5, "horizontal")
    expect(snapped).toBe(0)
  })

  it("should snap to other split lines when within threshold", () => {
    const { result } = renderHook(() =>
      useSplitLines({ ...defaultOptions, snapThreshold: 8 })
    )

    act(() => result.current.addLine("horizontal"))
    act(() => result.current.updateLinePosition(result.current.lines[0].id, 100))

    // Should snap to existing line at 100
    const snapped = result.current.calculateSnap(105, "horizontal")
    expect(snapped).toBe(100)
  })

  it("should not snap when outside threshold", () => {
    const { result } = renderHook(() =>
      useSplitLines({ ...defaultOptions, snapThreshold: 8 })
    )

    const snapped = result.current.calculateSnap(50, "horizontal")
    expect(snapped).toBe(50)
  })

  it("should limit horizontal lines to max 20", () => {
    const { result } = renderHook(() =>
      useSplitLines({ ...defaultOptions, maxLinesPerDirection: 20 })
    )

    for (let i = 0; i < 20; i++) {
      act(() => result.current.addLine("horizontal"))
    }

    expect(result.current.canAddHorizontal).toBe(false)
    expect(result.current.canAddVertical).toBe(true)
  })

  it("should support undo/redo", () => {
    const { result } = renderHook(() => useSplitLines(defaultOptions))

    act(() => result.current.addLine("horizontal"))
    expect(result.current.lines).toHaveLength(1)

    act(() => result.current.undo())
    expect(result.current.lines).toHaveLength(0)

    act(() => result.current.redo())
    expect(result.current.lines).toHaveLength(1)
  })
})
