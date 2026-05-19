import { describe, it, expect } from "vitest"
import { calculateSnap, type SnapResult } from "../resize-snap"

describe("calculateSnap", () => {
  const artboard = { width: 500, height: 500 }

  it("should snap image left edge to artboard left edge", () => {
    const result = calculateSnap(3, 10, 200, 150, artboard, 8)
    expect(result.snappedX).toBe(0)
    expect(result.guidesX).toContainEqual({ pos: 0, type: "edge" })
  })

  it("should snap image right edge to artboard right edge", () => {
    const result = calculateSnap(295, 10, 200, 150, artboard, 8)
    expect(result.snappedX).toBe(300)
    expect(result.guidesX).toContainEqual({ pos: 500, type: "edge" })
  })

  it("should snap image center to artboard center horizontally", () => {
    const result = calculateSnap(148, 10, 200, 150, artboard, 8)
    expect(result.snappedX).toBe(150)
    expect(result.guidesX).toContainEqual({ pos: 250, type: "center" })
  })

  it("should snap image center to artboard center vertically", () => {
    const result = calculateSnap(10, 173, 200, 150, artboard, 8)
    expect(result.snappedY).toBe(175)
    expect(result.guidesY).toContainEqual({ pos: 250, type: "center" })
  })

  it("should snap image top edge to artboard top edge", () => {
    const result = calculateSnap(100, 5, 200, 150, artboard, 8)
    expect(result.snappedY).toBe(0)
  })

  it("should snap image bottom edge to artboard bottom edge", () => {
    const result = calculateSnap(100, 345, 200, 150, artboard, 8)
    expect(result.snappedY).toBe(350)
  })

  it("should not snap when outside threshold", () => {
    const result = calculateSnap(50, 50, 200, 150, artboard, 8)
    expect(result.snappedX).toBe(50)
    expect(result.snappedY).toBe(50)
    expect(result.guidesX).toHaveLength(0)
    expect(result.guidesY).toHaveLength(0)
  })

  it("should prefer closest snap when multiple edges match", () => {
    const result = calculateSnap(1, 100, 200, 150, artboard, 8)
    expect(result.snappedX).toBe(0)
  })

  it("should snap both axes independently", () => {
    const result = calculateSnap(3, 345, 200, 150, artboard, 8)
    expect(result.snappedX).toBe(0)
    expect(result.snappedY).toBe(350)
  })
})
