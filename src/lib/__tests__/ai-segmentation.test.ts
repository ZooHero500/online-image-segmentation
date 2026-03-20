import { describe, it, expect } from "vitest"
import { blobToBase64DataUrl, generateLayerId, LAYER_COLORS } from "../ai-segmentation"

describe("ai-segmentation", () => {
  describe("generateLayerId", () => {
    it("generates unique IDs", () => {
      const id1 = generateLayerId()
      const id2 = generateLayerId()
      expect(id1).not.toBe(id2)
    })

    it("generates valid UUID format", () => {
      const id = generateLayerId()
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      )
    })
  })

  describe("LAYER_COLORS", () => {
    it("has 10 distinct colors", () => {
      expect(LAYER_COLORS).toHaveLength(10)
      expect(new Set(LAYER_COLORS).size).toBe(10)
    })
  })

  describe("blobToBase64DataUrl", () => {
    it("converts blob to data URL", async () => {
      const blob = new Blob(["test"], { type: "text/plain" })
      const result = await blobToBase64DataUrl(blob)
      expect(result).toMatch(/^data:text\/plain;base64,/)
    })
  })
})
