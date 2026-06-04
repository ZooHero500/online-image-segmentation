import type { ToolCategory, ToolPageConfig, ToolPageData } from "./types"
export type { ToolCategory, ToolPageConfig, ToolPageData, ScenarioCard, HowToStep, FaqEntry, RelatedTool, ToolPageSeo } from "./types"

import en from "./en"
import zhCN from "./zh-CN"
import ja from "./ja"
import ko from "./ko"
import es from "./es"
import { watermarkPagesByLocale } from "./watermark-pages"
import { mosaicPagesByLocale } from "./mosaic-pages"
import { collagePagesByLocale } from "./collage-pages"

// ─── Assemble ───

const localeData: Record<string, Record<string, ToolPageData>> = {
  en: { ...en, ...watermarkPagesByLocale.en, ...mosaicPagesByLocale.en, ...collagePagesByLocale.en },
  "zh-CN": { ...zhCN, ...watermarkPagesByLocale["zh-CN"], ...mosaicPagesByLocale["zh-CN"], ...collagePagesByLocale["zh-CN"] },
  ja: { ...ja, ...watermarkPagesByLocale.ja, ...mosaicPagesByLocale.ja, ...collagePagesByLocale.ja },
  ko: { ...ko, ...watermarkPagesByLocale.ko, ...mosaicPagesByLocale.ko, ...collagePagesByLocale.ko },
  es: { ...es, ...watermarkPagesByLocale.es, ...mosaicPagesByLocale.es, ...collagePagesByLocale.es },
}

const slugMeta: { slug: string; category: ToolCategory }[] = [
  { slug: "split-in-half", category: "direction" },
  { slug: "split-horizontally", category: "direction" },
  { slug: "split-vertically", category: "direction" },
  { slug: "split-into-equal-parts", category: "direction" },
  { slug: "split-long-screenshot", category: "use-case" },
  { slug: "split-for-instagram", category: "use-case" },
  { slug: "split-for-wechat", category: "use-case" },
  { slug: "split-for-print", category: "use-case" },
  { slug: "no-photoshop-slicer", category: "use-case" },
  { slug: "photo-splitter", category: "use-case" },
  { slug: "image-cutter", category: "use-case" },
  { slug: "grid-maker", category: "use-case" },
  { slug: "compress-image", category: "use-case" },
  { slug: "compress-jpeg", category: "use-case" },
  { slug: "compress-png", category: "use-case" },
  { slug: "png-to-webp", category: "use-case" },
  { slug: "png-to-jpg", category: "use-case" },
  { slug: "jpg-to-png", category: "use-case" },
  { slug: "jpg-to-webp", category: "use-case" },
  { slug: "webp-to-png", category: "use-case" },
  { slug: "webp-to-jpg", category: "use-case" },
  { slug: "reduce-image-size", category: "use-case" },
  { slug: "crop-image", category: "use-case" },
  { slug: "crop-for-instagram", category: "use-case" },
  { slug: "instagram-story-crop", category: "use-case" },
  { slug: "youtube-thumbnail-crop", category: "use-case" },
  { slug: "watermark-maker", category: "use-case" },
  { slug: "add-watermark-to-photo", category: "use-case" },
  { slug: "add-watermark-to-image", category: "use-case" },
  { slug: "online-watermark-tool", category: "use-case" },
  { slug: "blur-face", category: "use-case" },
  { slug: "blur-face-in-photo", category: "use-case" },
  { slug: "pixelate-image", category: "use-case" },
  { slug: "pixelate-image-online", category: "use-case" },
  { slug: "censor-image-online", category: "use-case" },
  { slug: "mosaic-tool", category: "use-case" },
  { slug: "redact-image", category: "use-case" },
  { slug: "redact-image-online", category: "use-case" },
  { slug: "photo-collage-maker", category: "use-case" },
  { slug: "photo-grid-maker", category: "use-case" },
  { slug: "instagram-story-collage", category: "use-case" },
  { slug: "free-photo-collage-maker", category: "use-case" },
  { slug: "picture-grid-maker", category: "use-case" },
  { slug: "instagram-collage-maker", category: "use-case" },
]

const toolPages: ToolPageConfig[] = slugMeta.map(({ slug, category }) => ({
  slug,
  category,
  locales: Object.fromEntries(
    Object.entries(localeData)
      .map(([locale, pages]) => [locale, pages[slug]])
      .filter(([, data]) => data != null)
  ),
}))

// ─── Public API ───

export function getAllToolSlugs(): string[] {
  return toolPages.map((page) => page.slug)
}

export function getToolPageData(slug: string, locale: string): ToolPageData | null {
  const config = toolPages.find((page) => page.slug === slug)
  if (!config) return null
  return config.locales[locale] ?? null
}

export function getAllToolPages(): ToolPageConfig[] {
  return toolPages
}

export function getToolPagesByCategory(category: ToolCategory): ToolPageConfig[] {
  return toolPages.filter((page) => page.category === category)
}
