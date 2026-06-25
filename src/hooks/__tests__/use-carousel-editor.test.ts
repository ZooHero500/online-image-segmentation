import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useCarouselEditor } from "../use-carousel-editor"

describe("useCarouselEditor", () => {
  it("defaults to 3 slides and 4:5", () => {
    const { result } = renderHook(() =>
      useCarouselEditor({ width: 3240, height: 1350 }, { width: 600, height: 400 }),
    )
    expect(result.current.state.slideCount).toBe(3)
    expect(result.current.state.aspect).toBe("4:5")
  })

  it("clamps slideCount via setSlideCount", () => {
    const { result } = renderHook(() =>
      useCarouselEditor({ width: 3240, height: 1350 }, { width: 600, height: 400 }),
    )
    act(() => result.current.setSlideCount(99))
    expect(result.current.state.slideCount).toBe(10)
  })

  it("frame aspect tracks composite aspect for the chosen preset", () => {
    const { result } = renderHook(() =>
      useCarouselEditor({ width: 3240, height: 1350 }, { width: 600, height: 400 }),
    )
    act(() => result.current.setAspect("1:1"))
    act(() => result.current.setSlideCount(2))
    const ratio = result.current.frameSize.width / result.current.frameSize.height
    expect(ratio).toBeCloseTo(2, 1) // 2 slides * (1080/1080)
  })
})
