import type { ToolCategory, ToolPageConfig, ToolPageData } from "./types"
export type { ToolCategory, ToolPageConfig, ToolPageData, ScenarioCard, HowToStep, FaqEntry, RelatedTool, ToolPageSeo } from "./types"

import en from "./en"
import zhCN from "./zh-CN"
import ja from "./ja"
import ko from "./ko"
import es from "./es"

// ─── Assemble ───

const localeData: Record<string, Record<string, ToolPageData>> = {
  en,
  "zh-CN": zhCN,
  ja,
  ko,
  es,
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
