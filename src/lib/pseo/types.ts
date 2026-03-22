export type ToolCategory = "direction" | "use-case"

export interface ScenarioCard {
  icon: string
  title: string
  description: string
}

export interface HowToStep {
  stepNumber: number
  title: string
  description: string
}

export interface FaqEntry {
  question: string
  answer: string
}

export interface RelatedTool {
  slug: string
  title: string
  description: string
}

export interface ToolPageSeo {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
}

export interface ToolPageData {
  slug: string
  category: ToolCategory
  seo: ToolPageSeo
  hero: {
    overline: string
    headlinePart1: string
    headlineAccent: string
    headlinePart2: string
    description: string
  }
  scenarios: ScenarioCard[]
  howToSteps: HowToStep[]
  faqEntries: FaqEntry[]
  relatedTools: RelatedTool[]
  platformInfo?: string
}

export interface ToolPageConfig {
  slug: string
  category: ToolCategory
  locales: Record<string, ToolPageData>
}
