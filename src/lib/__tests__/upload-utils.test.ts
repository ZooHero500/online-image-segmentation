import { describe, it, expect } from "vitest"
import { validateFiles, ACCEPTED_TYPES, MAX_SIZE, MAX_TOTAL_SIZE } from "../upload-utils"

describe("validateFiles", () => {
  function makeFile(name: string, size: number, type: string): File {
    const buffer = new ArrayBuffer(size)
    return new File([buffer], name, { type })
  }

  it("should accept valid PNG file", () => {
    const file = makeFile("test.png", 1024, "image/png")
    const result = validateFiles([file])
    expect(result.valid).toBe(true)
    expect(result.files).toHaveLength(1)
  })

  it("should accept valid JPG file", () => {
    const file = makeFile("test.jpg", 1024, "image/jpeg")
    const result = validateFiles([file])
    expect(result.valid).toBe(true)
  })

  it("should accept valid WebP file", () => {
    const file = makeFile("test.webp", 1024, "image/webp")
    const result = validateFiles([file])
    expect(result.valid).toBe(true)
  })

  it("should reject unsupported file type", () => {
    const file = makeFile("test.gif", 1024, "image/gif")
    const result = validateFiles([file])
    expect(result.valid).toBe(false)
    expect(result.error).toContain("不支持")
  })

  it("should reject file exceeding 20MB", () => {
    const file = makeFile("big.png", MAX_SIZE + 1, "image/png")
    const result = validateFiles([file])
    expect(result.valid).toBe(false)
    expect(result.error).toContain("过大")
  })

  it("should accept multiple valid files", () => {
    const files = [
      makeFile("a.png", 1024, "image/png"),
      makeFile("b.jpg", 2048, "image/jpeg"),
    ]
    const result = validateFiles(files)
    expect(result.valid).toBe(true)
    expect(result.files).toHaveLength(2)
  })

  it("should warn but still accept when total exceeds 50MB", () => {
    const files = [
      makeFile("a.png", 18 * 1024 * 1024, "image/png"),
      makeFile("b.png", 18 * 1024 * 1024, "image/png"),
      makeFile("c.png", 18 * 1024 * 1024, "image/png"),
    ]
    const result = validateFiles(files)
    expect(result.valid).toBe(true)
    expect(result.totalSizeWarning).toBe(true)
  })
})
