import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useGridEditor } from "../use-grid-editor"

describe("useGridEditor", () => {
  const defaultImageSize = { width: 1000, height: 600 }
  const defaultContainerSize = { width: 400, height: 400 }

  it("should initialize with 3x3 grid type", () => {
    const { result } = renderHook(() =>
      useGridEditor(defaultImageSize, defaultContainerSize)
    )
    expect(result.current.state.gridType).toBe("3x3")
  })

  it("should initialize withGap as false", () => {
    const { result } = renderHook(() =>
      useGridEditor(defaultImageSize, defaultContainerSize)
    )
    expect(result.current.state.withGap).toBe(false)
  })

  it("should toggle withGap", () => {
    const { result } = renderHook(() =>
      useGridEditor(defaultImageSize, defaultContainerSize)
    )
    act(() => result.current.setWithGap(true))
    expect(result.current.state.withGap).toBe(true)
    act(() => result.current.setWithGap(false))
    expect(result.current.state.withGap).toBe(false)
  })

  it("should change grid type", () => {
    const { result } = renderHook(() =>
      useGridEditor(defaultImageSize, defaultContainerSize)
    )
    act(() => result.current.setGridType("1x3"))
    expect(result.current.state.gridType).toBe("1x3")
  })

  it("should auto-reset scale to fill crop frame via useEffect", async () => {
    const { result } = renderHook(() =>
      useGridEditor(
        { width: 1000, height: 600 },
        { width: 400, height: 400 }
      )
    )
    await act(async () => {})
    expect(result.current.state.scale).toBeCloseTo(400 / 600, 2)
  })

  it("should compute crop frame dimensions", () => {
    const { result } = renderHook(() =>
      useGridEditor(defaultImageSize, defaultContainerSize)
    )
    expect(result.current.frameSize.width).toBeLessThanOrEqual(400)
    expect(result.current.frameSize.height).toBeLessThanOrEqual(400)
    expect(result.current.frameSize.width).toBe(result.current.frameSize.height)
  })

  it("should compute wide frame for 1x3 grid", async () => {
    const { result } = renderHook(() =>
      useGridEditor(defaultImageSize, defaultContainerSize)
    )
    await act(async () => result.current.setGridType("1x3"))
    const { width, height } = result.current.frameSize
    expect(Math.abs(width - height * 3)).toBeLessThanOrEqual(1)
  })
})
