import { describe, it, expect } from "vitest"
import {
  calculateFillTransform,
  constrainCropRect,
  validateCanvasSize,
} from "../resize-utils"

describe("calculateFillTransform", () => {
  it("should scale landscape image to cover square artboard", () => {
    const result = calculateFillTransform(800, 400, 500, 500)
    expect(result.scale).toBeCloseTo(1.25)
    expect(result.x).toBeCloseTo(-250)
    expect(result.y).toBeCloseTo(0)
  })

  it("should scale portrait image to cover square artboard", () => {
    const result = calculateFillTransform(400, 800, 500, 500)
    expect(result.scale).toBeCloseTo(1.25)
    expect(result.x).toBeCloseTo(0)
    expect(result.y).toBeCloseTo(-250)
  })

  it("should handle image same size as artboard", () => {
    const result = calculateFillTransform(500, 500, 500, 500)
    expect(result.scale).toBeCloseTo(1)
    expect(result.x).toBeCloseTo(0)
    expect(result.y).toBeCloseTo(0)
  })

  it("should handle wide artboard with square image", () => {
    const result = calculateFillTransform(500, 500, 800, 400)
    expect(result.scale).toBeCloseTo(1.6)
    expect(result.x).toBeCloseTo(0)
    expect(result.y).toBeCloseTo(-200)
  })
})

describe("constrainCropRect", () => {
  it("should not modify a rect already within bounds", () => {
    const crop = { x: 10, y: 10, width: 80, height: 80 }
    const bounds = { x: 0, y: 0, width: 100, height: 100 }
    const result = constrainCropRect(crop, bounds)
    expect(result).toEqual({ x: 10, y: 10, width: 80, height: 80 })
  })

  it("should clamp rect that exceeds right edge", () => {
    const crop = { x: 60, y: 10, width: 80, height: 40 }
    const bounds = { x: 0, y: 0, width: 100, height: 100 }
    const result = constrainCropRect(crop, bounds)
    expect(result.x + result.width).toBeLessThanOrEqual(bounds.x + bounds.width)
    expect(result.width).toBe(40)
  })

  it("should clamp rect that exceeds bottom edge", () => {
    const crop = { x: 10, y: 70, width: 40, height: 80 }
    const bounds = { x: 0, y: 0, width: 100, height: 100 }
    const result = constrainCropRect(crop, bounds)
    expect(result.y + result.height).toBeLessThanOrEqual(bounds.y + bounds.height)
    expect(result.height).toBe(30)
  })

  it("should clamp rect that goes past left/top", () => {
    const crop = { x: -20, y: -10, width: 80, height: 60 }
    const bounds = { x: 0, y: 0, width: 100, height: 100 }
    const result = constrainCropRect(crop, bounds)
    expect(result.x).toBe(0)
    expect(result.y).toBe(0)
  })

  it("should enforce minimum size of 20x20", () => {
    const crop = { x: 90, y: 90, width: 5, height: 5 }
    const bounds = { x: 0, y: 0, width: 100, height: 100 }
    const result = constrainCropRect(crop, bounds)
    expect(result.width).toBeGreaterThanOrEqual(20)
    expect(result.height).toBeGreaterThanOrEqual(20)
  })
})

describe("validateCanvasSize", () => {
  it("should accept valid dimensions", () => {
    expect(validateCanvasSize(500, 500)).toEqual({ valid: true })
    expect(validateCanvasSize(1920, 1080)).toEqual({ valid: true })
  })

  it("should reject zero or negative dimensions", () => {
    expect(validateCanvasSize(0, 500).valid).toBe(false)
    expect(validateCanvasSize(500, -10).valid).toBe(false)
  })

  it("should reject dimensions exceeding max (4096)", () => {
    expect(validateCanvasSize(5000, 500).valid).toBe(false)
    expect(validateCanvasSize(500, 5000).valid).toBe(false)
  })

  it("should reject non-integer dimensions", () => {
    expect(validateCanvasSize(500.5, 500).valid).toBe(false)
  })
})
