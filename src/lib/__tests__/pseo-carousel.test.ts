import { describe, it, expect } from "vitest"
import { getToolPageData, getToolPageLocales, getAllToolPageParams } from "@/lib/pseo"

describe("pseo carousel pages", () => {
  it("serves cortar-carrossel only in pt-BR", () => {
    expect(getToolPageData("cortar-carrossel", "pt-BR")).toBeTruthy()
    expect(getToolPageData("cortar-carrossel", "en")).toBeFalsy()
  })
  it("serves carousel-splitter in en", () => {
    expect(getToolPageData("carousel-splitter", "en")).toBeTruthy()
  })
  it("every generated param resolves to data", () => {
    const params = getAllToolPageParams().filter((p) => p.toolSlug.includes("carrossel") || p.toolSlug.includes("carousel") || p.toolSlug === "canva-image-splitter")
    for (const p of params) {
      expect(getToolPageData(p.toolSlug, p.locale)).toBeTruthy()
    }
    expect(params.length).toBeGreaterThan(0)
  })
  it("pt-BR carousel page exposes FAQ entries", () => {
    const data = getToolPageData("cortar-carrossel", "pt-BR")
    expect(data?.faqEntries.length).toBeGreaterThanOrEqual(3)
  })

  it("carousel-splitter is available in en, es, ja, ko, zh-CN", () => {
    const locales = getToolPageLocales("carousel-splitter")
    expect(locales).toContain("en")
    expect(locales).toContain("es")
    expect(locales).toContain("ja")
    expect(locales).toContain("ko")
    expect(locales).toContain("zh-CN")
    expect(locales).not.toContain("pt-BR")
  })

  it("canva-image-splitter is only in en", () => {
    const locales = getToolPageLocales("canva-image-splitter")
    expect(locales).toEqual(["en"])
  })

  it("all pt-BR slugs are available only in pt-BR", () => {
    const ptBRSlugs = ["cortar-carrossel", "cortar-imagens-carrossel", "cortar-carrossel-infinito"]
    for (const slug of ptBRSlugs) {
      expect(getToolPageData(slug, "pt-BR")).toBeTruthy()
      expect(getToolPageData(slug, "en")).toBeFalsy()
      expect(getToolPageData(slug, "zh-CN")).toBeFalsy()
    }
  })

  it("cortar-carrossel has People Also Ask FAQ questions", () => {
    const data = getToolPageData("cortar-carrossel", "pt-BR")
    const questions = data?.faqEntries.map((e) => e.question) ?? []
    expect(questions.some((q) => q.toLowerCase().includes("recortar"))).toBe(true)
    expect(questions.some((q) => q.toLowerCase().includes("cortar"))).toBe(true)
  })

  it("carousel pages have all required fields", () => {
    const slugs = ["carousel-splitter", "canva-image-splitter", "cortar-carrossel", "cortar-imagens-carrossel", "cortar-carrossel-infinito"]
    const localeMap: Record<string, string> = {
      "carousel-splitter": "en",
      "canva-image-splitter": "en",
      "cortar-carrossel": "pt-BR",
      "cortar-imagens-carrossel": "pt-BR",
      "cortar-carrossel-infinito": "pt-BR",
    }
    for (const slug of slugs) {
      const data = getToolPageData(slug, localeMap[slug])
      expect(data).toBeTruthy()
      expect(data?.seo.title).toBeTruthy()
      expect(data?.seo.description).toBeTruthy()
      expect(data?.hero.overline).toBeTruthy()
      expect(data?.scenarios.length).toBeGreaterThanOrEqual(3)
      expect(data?.howToSteps.length).toBeGreaterThanOrEqual(3)
      expect(data?.faqEntries.length).toBeGreaterThanOrEqual(3)
      expect(data?.relatedTools.length).toBeGreaterThanOrEqual(3)
    }
  })
})
