import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useCanvasViewport } from "../use-canvas-viewport"

describe("useCanvasViewport", () => {
  const defaultOptions = {
    containerWidth: 800,
    containerHeight: 600,
    imageWidth: 1600,
    imageHeight: 1200,
  }

  it("should calculate initial fit-to-view scale", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))
    // 800/1600=0.5, 600/1200=0.5, min=0.5, with 5% padding => 0.5 * 0.95 = 0.475
    expect(result.current.scale).toBeCloseTo(0.475, 2)
  })

  it("should center image initially", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))
    const s = result.current.scale
    const imgW = 1600 * s
    const imgH = 1200 * s
    // centered: (containerW - imgW) / 2
    expect(result.current.position.x).toBeCloseTo((800 - imgW) / 2, 0)
    expect(result.current.position.y).toBeCloseTo((600 - imgH) / 2, 0)
  })

  it("should zoom in at a point", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))
    const oldScale = result.current.scale

    act(() => {
      result.current.zoomAtPoint(400, 300, 1.1) // zoom in 10% at center
    })

    expect(result.current.scale).toBeCloseTo(oldScale * 1.1, 4)
  })

  it("should clamp scale to min/max", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))

    act(() => {
      result.current.zoomAtPoint(400, 300, 0.001) // try to zoom out beyond min
    })
    expect(result.current.scale).toBeGreaterThanOrEqual(0.1)

    act(() => {
      result.current.zoomAtPoint(400, 300, 10000) // try to zoom in beyond max
    })
    expect(result.current.scale).toBeLessThanOrEqual(10)
  })

  it("should pan by delta", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))
    const oldPos = { ...result.current.position }

    act(() => {
      result.current.panBy(50, -30)
    })

    expect(result.current.position.x).toBe(oldPos.x + 50)
    expect(result.current.position.y).toBe(oldPos.y - 30)
  })

  it("should reset to fit view", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))

    act(() => {
      result.current.zoomAtPoint(400, 300, 3)
      result.current.panBy(200, 100)
    })

    act(() => {
      result.current.fitToView()
    })

    expect(result.current.scale).toBeCloseTo(0.475, 2)
  })

  it("should reset to 100%", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))

    act(() => {
      result.current.resetTo100()
    })

    expect(result.current.scale).toBe(1)
  })

  it("should convert screen to world coordinates", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))
    const { scale, position } = result.current

    const world = result.current.screenToWorld(400, 300)
    expect(world.x).toBeCloseTo((400 - position.x) / scale, 1)
    expect(world.y).toBeCloseTo((300 - position.y) / scale, 1)
  })

  it("should return no image scale when no image", () => {
    const { result } = renderHook(() =>
      useCanvasViewport({ containerWidth: 800, containerHeight: 600, imageWidth: 0, imageHeight: 0 })
    )
    expect(result.current.scale).toBe(1)
  })
})
