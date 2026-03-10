import { describe, it, expect } from "vitest"
import { assignLayerColors, blobToBase64DataUrl, generateLayerId } from "../ai-segmentation"

describe("ai-segmentation", () => {
  describe("generateLayerId", () => {
    it("generates unique IDs", () => {
      const id1 = generateLayerId()
      const id2 = generateLayerId()
      expect(id1).not.toBe(id2)
    })
  })

  describe("assignLayerColors", () => {
    it("assigns distinct colors to labels", () => {
      const colors = assignLayerColors(3)
      expect(colors).toHaveLength(3)
      expect(new Set(colors).size).toBe(3) // all unique
    })

    it("cycles colors when more labels than palette", () => {
      const colors = assignLayerColors(12)
      expect(colors).toHaveLength(12)
      expect(colors[0]).toBe(colors[10]) // wraps around
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
