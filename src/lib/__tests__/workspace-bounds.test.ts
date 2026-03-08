import { describe, expect, it } from "vitest"
import { calculateWorkspaceBounds } from "../workspace-bounds"

describe("calculateWorkspaceBounds", () => {
  it("should expand height when an image is dragged below the initial row", () => {
    const bounds = calculateWorkspaceBounds(
      [
        { x: 0, y: 0 },
        { x: 0, y: 1000 },
      ],
      [
        { w: 600, h: 1000 },
        { w: 600, h: 900 },
      ]
    )

    expect(bounds.width).toBe(600)
    expect(bounds.height).toBe(1900)
  })

  it("should expand width and height from the furthest image edges", () => {
    const bounds = calculateWorkspaceBounds(
      [
        { x: 120, y: 40 },
        { x: 900, y: 680 },
      ],
      [
        { w: 640, h: 480 },
        { w: 320, h: 240 },
      ]
    )

    expect(bounds.width).toBe(1220)
    expect(bounds.height).toBe(920)
  })

  it("should return a minimal non-zero workspace for empty input", () => {
    const bounds = calculateWorkspaceBounds([], [])

    expect(bounds.width).toBe(1)
    expect(bounds.height).toBe(1)
  })
})
