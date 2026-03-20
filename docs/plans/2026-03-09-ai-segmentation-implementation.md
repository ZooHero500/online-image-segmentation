# AI 智能图像分割 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add AI-powered image segmentation using Grok Vision (element recognition) + Replicate Lang-SAM (segmentation), with PS-style layer panel and mask overlay on canvas.

**Architecture:** Next.js API Routes proxy third-party APIs (Grok Vision for recognition, Replicate Lang-SAM for segmentation). Frontend adds a new "AI 分割" mode to the workspace, independent from manual split. Konva canvas renders mask overlays, right panel shows layer controls.

**Tech Stack:** Next.js API Routes, OpenAI SDK (xAI compatible), Replicate JS SDK, Konva.js, shadcn/ui, next-intl

**Design doc:** `docs/plans/2026-03-09-ai-segmentation-design.md`

---

## Task 1: Install Dependencies & Environment Setup

**Files:**
- Modify: `package.json`
- Modify: `.env.local`
- Create: `.env.example`

**Step 1: Install dependencies**

```bash
bun add replicate openai
```

- `replicate` — Replicate JS SDK for calling Lang-SAM
- `openai` — OpenAI-compatible SDK for calling Grok Vision via xAI API

**Step 2: Add API keys to .env.local**

Append to `.env.local`:
```
# AI Segmentation
XAI_API_KEY=your-xai-api-key-here
REPLICATE_API_TOKEN=your-replicate-api-token-here
```

**Step 3: Create .env.example**

```
# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=

# AI Segmentation
XAI_API_KEY=
REPLICATE_API_TOKEN=
```

**Step 4: Verify build**

```bash
bun run build
```

Expected: Build succeeds with no errors.

**Step 5: Commit**

```bash
git add package.json bun.lock .env.example
git commit -m "chore: add replicate and openai SDK dependencies"
```

Note: Do NOT commit `.env.local` (contains secrets).

---

## Task 2: Add AI Segmentation Types

**Files:**
- Modify: `src/types/index.ts`
- Test: `src/lib/__tests__/ai-segmentation.test.ts` (created in Task 5)

**Step 1: Add types to src/types/index.ts**

Append after the existing `BatchZipExportOptions` interface:

```typescript
/** AI 识别出的图片元素 */
export interface RecognizedElement {
  /** 英文标签（用于 Lang-SAM 分割） */
  label_en: string
  /** 中文标签（用于界面显示） */
  label_zh: string
  /** 识别置信度 0-1 */
  confidence: number
}

/** AI 分割图层 */
export interface SegmentLayer {
  /** 唯一 ID */
  id: string
  /** 英文标签 */
  label_en: string
  /** 中文标签 */
  label_zh: string
  /** 分割遮罩图片 URL（来自 Replicate） */
  maskUrl: string
  /** 遮罩加载后的 HTMLImageElement */
  maskImage: HTMLImageElement | null
  /** 图层显示颜色（十六进制） */
  color: string
  /** 是否可见 */
  visible: boolean
}

/** AI 分割工作流步骤 */
export type AiSegmentStep = 'upload' | 'analyze' | 'select' | 'segment' | 'result'

/** /api/analyze 请求体 */
export interface AnalyzeRequest {
  /** Base64 编码的图片数据 */
  image: string
}

/** /api/analyze 响应体 */
export interface AnalyzeResponse {
  elements: RecognizedElement[]
}

/** /api/segment 请求体 */
export interface SegmentRequest {
  /** 图片 URL 或 Base64 */
  image: string
  /** 要分割的标签（英文） */
  labels: string[]
}

/** /api/segment 单个分割结果 */
export interface SegmentResultItem {
  label_en: string
  label_zh: string
  /** 分割后的遮罩图片 URL */
  maskUrl: string
  /** 分配的图层颜色 */
  color: string
}

/** /api/segment 响应体 */
export interface SegmentResponse {
  segments: SegmentResultItem[]
}
```

**Step 2: Verify TypeScript**

```bash
bunx tsc --noEmit
```

Expected: No errors.

**Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add AI segmentation type definitions"
```

---

## Task 3: Create /api/analyze Route (Grok Vision)

**Files:**
- Create: `src/app/api/analyze/route.ts`

**Step 1: Create the API route**

```typescript
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
})

const SYSTEM_PROMPT = `You are an image analysis assistant. Analyze the given image and identify all visually distinct, independently segmentable elements.

Return a JSON array where each element has:
- label_en: English label (concise, lowercase, for segmentation model input)
- label_zh: Chinese label (for UI display)
- confidence: float 0-1

Rules:
- Only include elements that can be visually separated (not abstract concepts)
- Order by visual prominence (most prominent first)
- Max 10 elements
- Always include "background" as the last element if applicable
- Be specific: "person" not "human", "tree" not "plant"

Example output:
[
  {"label_en": "person", "label_zh": "人物", "confidence": 0.95},
  {"label_en": "dog", "label_zh": "狗", "confidence": 0.88},
  {"label_en": "background", "label_zh": "背景", "confidence": 0.80}
]

Return ONLY the JSON array, no other text.`

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      )
    }

    if (!process.env.XAI_API_KEY) {
      return NextResponse.json(
        { error: "XAI_API_KEY not configured" },
        { status: 500 }
      )
    }

    const response = await client.chat.completions.create({
      model: "grok-2-vision-latest",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: image },
            },
            {
              type: "text",
              text: "Analyze this image and list all segmentable visual elements.",
            },
          ],
        },
      ],
      temperature: 0.1,
    })

    const content = response.choices[0]?.message?.content ?? "[]"

    // Parse JSON from response (handle possible markdown code blocks)
    const jsonStr = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim()
    const elements = JSON.parse(jsonStr)

    return NextResponse.json({ elements })
  } catch (error) {
    console.error("Analyze API error:", error)
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    )
  }
}
```

**Step 2: Test manually with curl**

Start dev server and test:

```bash
bun dev &
# In another terminal, test with a small base64 image or URL:
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png"}'
```

Expected: JSON response with `elements` array.

**Step 3: Commit**

```bash
git add src/app/api/analyze/route.ts
git commit -m "feat: add /api/analyze route for Grok Vision image recognition"
```

---

## Task 4: Create /api/segment Route (Replicate Lang-SAM)

**Files:**
- Create: `src/app/api/segment/route.ts`

**Step 1: Create the API route**

```typescript
import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

const LAYER_COLORS = [
  "#3B82F6", // blue
  "#22C55E", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
  "#14B8A6", // teal
  "#6366F1", // indigo
]

export async function POST(request: NextRequest) {
  try {
    const { image, labels } = await request.json()

    if (!image || !labels?.length) {
      return NextResponse.json(
        { error: "Image and labels are required" },
        { status: 400 }
      )
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN not configured" },
        { status: 500 }
      )
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })

    // Process each label sequentially to avoid rate limits
    const segments: Array<{
      label_en: string
      label_zh: string
      maskUrl: string
      color: string
    }> = []

    for (let i = 0; i < labels.length; i++) {
      const label = labels[i]

      const output = await replicate.run(
        "tmappdev/lang-segment-anything:9f69a43b4a1a2bbb24e78e1e42ea3c28e30b9f52b86102a3ef7e0b3dda16929c",
        {
          input: {
            image,
            text_prompt: label.label_en,
          },
        }
      )

      // Lang-SAM returns an image URL of the segmented result
      const maskUrl = typeof output === "string" ? output : String(output)

      segments.push({
        label_en: label.label_en,
        label_zh: label.label_zh,
        maskUrl,
        color: LAYER_COLORS[i % LAYER_COLORS.length],
      })
    }

    return NextResponse.json({ segments })
  } catch (error) {
    console.error("Segment API error:", error)
    return NextResponse.json(
      { error: "Failed to segment image" },
      { status: 500 }
    )
  }
}
```

**Step 2: Test manually with curl**

```bash
curl -X POST http://localhost:3000/api/segment \
  -H "Content-Type: application/json" \
  -d '{"image": "https://example.com/test.jpg", "labels": [{"label_en": "person", "label_zh": "人物"}]}'
```

Expected: JSON with `segments` array containing `maskUrl`.

**Step 3: Commit**

```bash
git add src/app/api/segment/route.ts
git commit -m "feat: add /api/segment route for Replicate Lang-SAM segmentation"
```

---

## Task 5: Create ai-segmentation Library

**Files:**
- Create: `src/lib/ai-segmentation.ts`
- Create: `src/lib/__tests__/ai-segmentation.test.ts`

**Step 1: Write tests**

```typescript
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
```

**Step 2: Run tests to verify they fail**

```bash
bun test src/lib/__tests__/ai-segmentation.test.ts
```

Expected: FAIL — module not found.

**Step 3: Implement the library**

```typescript
const LAYER_COLORS = [
  "#3B82F6", // blue
  "#22C55E", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
  "#14B8A6", // teal
  "#6366F1", // indigo
]

let counter = 0

export function generateLayerId(): string {
  return `layer-${Date.now()}-${++counter}`
}

export function assignLayerColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => LAYER_COLORS[i % LAYER_COLORS.length])
}

export function blobToBase64DataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}
```

**Step 4: Run tests to verify they pass**

```bash
bun test src/lib/__tests__/ai-segmentation.test.ts
```

Expected: All 3 tests PASS.

**Step 5: Commit**

```bash
git add src/lib/ai-segmentation.ts src/lib/__tests__/ai-segmentation.test.ts
git commit -m "feat: add ai-segmentation library with color assignment and utils"
```

---

## Task 6: Create use-ai-analyze Hook

**Files:**
- Create: `src/hooks/use-ai-analyze.ts`

**Step 1: Create the hook**

```typescript
"use client"

import { useState, useCallback } from "react"
import type { RecognizedElement } from "@/types"
import { blobToBase64DataUrl } from "@/lib/ai-segmentation"

interface UseAiAnalyzeReturn {
  elements: RecognizedElement[]
  isAnalyzing: boolean
  error: string | null
  analyze: (imageBlob: Blob) => Promise<void>
  reset: () => void
}

export function useAiAnalyze(): UseAiAnalyzeReturn {
  const [elements, setElements] = useState<RecognizedElement[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (imageBlob: Blob) => {
    setIsAnalyzing(true)
    setError(null)
    setElements([])

    try {
      const dataUrl = await blobToBase64DataUrl(imageBlob)

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "Failed to analyze image")
      }

      const data = await response.json()
      setElements(data.elements)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setElements([])
    setError(null)
    setIsAnalyzing(false)
  }, [])

  return { elements, isAnalyzing, error, analyze, reset }
}
```

**Step 2: Verify TypeScript**

```bash
bunx tsc --noEmit
```

Expected: No errors.

**Step 3: Commit**

```bash
git add src/hooks/use-ai-analyze.ts
git commit -m "feat: add use-ai-analyze hook for Grok Vision recognition"
```

---

## Task 7: Create use-ai-segment Hook

**Files:**
- Create: `src/hooks/use-ai-segment.ts`

**Step 1: Create the hook**

```typescript
"use client"

import { useState, useCallback } from "react"
import type { RecognizedElement, SegmentLayer } from "@/types"
import { generateLayerId, loadImage } from "@/lib/ai-segmentation"

interface UseAiSegmentReturn {
  layers: SegmentLayer[]
  isSegmenting: boolean
  progress: { current: number; total: number }
  error: string | null
  segment: (imageBlob: Blob, labels: RecognizedElement[]) => Promise<void>
  toggleLayerVisibility: (layerId: string) => void
  setLayers: (layers: SegmentLayer[]) => void
  reset: () => void
}

export function useAiSegment(): UseAiSegmentReturn {
  const [layers, setLayers] = useState<SegmentLayer[]>([])
  const [isSegmenting, setIsSegmenting] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [error, setError] = useState<string | null>(null)

  const segment = useCallback(async (imageBlob: Blob, labels: RecognizedElement[]) => {
    setIsSegmenting(true)
    setError(null)
    setLayers([])
    setProgress({ current: 0, total: labels.length })

    try {
      // Convert blob to data URL for API
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(imageBlob)
      })

      const response = await fetch("/api/segment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: dataUrl,
          labels: labels.map(l => ({ label_en: l.label_en, label_zh: l.label_zh })),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "Failed to segment image")
      }

      const data = await response.json()

      // Load mask images and create layers
      const newLayers: SegmentLayer[] = []
      for (let i = 0; i < data.segments.length; i++) {
        const seg = data.segments[i]
        setProgress({ current: i + 1, total: data.segments.length })

        let maskImage: HTMLImageElement | null = null
        try {
          maskImage = await loadImage(seg.maskUrl)
        } catch {
          console.warn(`Failed to load mask for ${seg.label_en}`)
        }

        newLayers.push({
          id: generateLayerId(),
          label_en: seg.label_en,
          label_zh: seg.label_zh,
          maskUrl: seg.maskUrl,
          maskImage,
          color: seg.color,
          visible: true,
        })

        // Update layers progressively so UI shows each layer as it loads
        setLayers([...newLayers])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsSegmenting(false)
    }
  }, [])

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    )
  }, [])

  const reset = useCallback(() => {
    setLayers([])
    setError(null)
    setIsSegmenting(false)
    setProgress({ current: 0, total: 0 })
  }, [])

  return {
    layers,
    isSegmenting,
    progress,
    error,
    segment,
    toggleLayerVisibility,
    setLayers,
    reset,
  }
}
```

**Step 2: Verify TypeScript**

```bash
bunx tsc --noEmit
```

Expected: No errors.

**Step 3: Commit**

```bash
git add src/hooks/use-ai-segment.ts
git commit -m "feat: add use-ai-segment hook with progressive layer loading"
```

---

## Task 8: Add i18n Messages

**Files:**
- Modify: `src/messages/en.json`
- Modify: `src/messages/zh-CN.json`

**Step 1: Add English messages**

Add `"aiSegmentation"` key to `en.json` (after the `"history"` section):

```json
"aiSegmentation": {
  "title": "AI Segmentation",
  "sidebarButton": "AI Split",
  "backToManual": "Manual Split",
  "stepAnalyze": "Analyze",
  "stepSelect": "Select",
  "stepSegment": "Segment",
  "analyzing": "Analyzing image...",
  "analyzeFailed": "Failed to analyze image. Please try again.",
  "elementsFound": "{count} elements found",
  "selectElements": "Select elements to segment:",
  "customLabel": "Custom keyword...",
  "addCustom": "Add",
  "reanalyze": "Re-analyze",
  "startSegment": "Start Segmentation",
  "segmenting": "Segmenting... ({current}/{total})",
  "segmentFailed": "Segmentation failed. Please try again.",
  "layers": "Layers",
  "displayMode": "Display mode:",
  "maskOverlay": "Overlay",
  "isolatedPreview": "Isolated",
  "exportOne": "Export",
  "exportAllZip": "Export All (ZIP)",
  "backToSelect": "Back to Select",
  "noImage": "Upload or select an image first",
  "selectAtLeastOne": "Select at least one element"
}
```

**Step 2: Add Chinese messages**

Add `"aiSegmentation"` key to `zh-CN.json`:

```json
"aiSegmentation": {
  "title": "AI 智能分割",
  "sidebarButton": "AI 分割",
  "backToManual": "手动分割",
  "stepAnalyze": "识别",
  "stepSelect": "选择",
  "stepSegment": "分割",
  "analyzing": "正在识别图片内容...",
  "analyzeFailed": "图片识别失败，请重试。",
  "elementsFound": "识别到 {count} 个元素",
  "selectElements": "选择要分割的元素：",
  "customLabel": "自定义关键词...",
  "addCustom": "添加",
  "reanalyze": "重新识别",
  "startSegment": "开始分割",
  "segmenting": "正在分割... ({current}/{total})",
  "segmentFailed": "分割失败，请重试。",
  "layers": "图层",
  "displayMode": "显示模式：",
  "maskOverlay": "遮罩叠加",
  "isolatedPreview": "独立预览",
  "exportOne": "导出",
  "exportAllZip": "全部导出 (ZIP)",
  "backToSelect": "返回重新选择",
  "noImage": "请先上传或选择一张图片",
  "selectAtLeastOne": "请至少选择一个元素"
}
```

**Step 3: Verify build**

```bash
bun run build
```

Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/messages/en.json src/messages/zh-CN.json
git commit -m "feat: add AI segmentation i18n messages (en + zh-CN)"
```

---

## Task 9: Create AiSegmentationPanel Component

This is the right-side panel containing the 3-step workflow (analyze → select → segment/layers).

**Files:**
- Create: `src/components/AiSegmentationPanel.tsx`

**Step 1: Create the component**

```typescript
"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import {
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Download,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useAiAnalyze } from "@/hooks/use-ai-analyze"
import { useAiSegment } from "@/hooks/use-ai-segment"
import { downloadBlob } from "@/lib/ai-segmentation"
import type { RecognizedElement, AiSegmentStep, SegmentLayer } from "@/types"

interface AiSegmentationPanelProps {
  imageBlob: Blob | null
  onLayersChange: (layers: SegmentLayer[]) => void
  onHoverLayer: (layerId: string | null) => void
  onIsolateLayer: (layerId: string | null) => void
}

export function AiSegmentationPanel({
  imageBlob,
  onLayersChange,
  onHoverLayer,
  onIsolateLayer,
}: AiSegmentationPanelProps) {
  const t = useTranslations("aiSegmentation")
  const [step, setStep] = useState<AiSegmentStep>("upload")
  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(new Set())
  const [customInput, setCustomInput] = useState("")
  const [customLabels, setCustomLabels] = useState<RecognizedElement[]>([])
  const [isolatedLayerId, setIsolatedLayerId] = useState<string | null>(null)

  const {
    elements,
    isAnalyzing,
    error: analyzeError,
    analyze,
    reset: resetAnalyze,
  } = useAiAnalyze()

  const {
    layers,
    isSegmenting,
    progress,
    error: segmentError,
    segment,
    toggleLayerVisibility,
    reset: resetSegment,
  } = useAiSegment()

  // Sync layers to parent
  const updateLayers = useCallback(
    (newLayers: SegmentLayer[]) => {
      onLayersChange(newLayers)
    },
    [onLayersChange]
  )

  // Step 1: Start analysis
  const handleAnalyze = useCallback(async () => {
    if (!imageBlob) return
    setStep("analyze")
    await analyze(imageBlob)
    setStep("select")
    // Default: select first 2 elements
    const allElements = elements
    const defaults = new Set(allElements.slice(0, 2).map((e) => e.label_en))
    setSelectedLabels(defaults)
  }, [imageBlob, analyze, elements])

  // Retry analysis
  const handleReanalyze = useCallback(async () => {
    resetAnalyze()
    setCustomLabels([])
    setSelectedLabels(new Set())
    if (!imageBlob) return
    setStep("analyze")
    await analyze(imageBlob)
    setStep("select")
  }, [imageBlob, analyze, resetAnalyze])

  // Toggle label selection
  const handleToggleLabel = useCallback((labelEn: string) => {
    setSelectedLabels((prev) => {
      const next = new Set(prev)
      if (next.has(labelEn)) {
        next.delete(labelEn)
      } else {
        next.add(labelEn)
      }
      return next
    })
  }, [])

  // Add custom label
  const handleAddCustom = useCallback(() => {
    const trimmed = customInput.trim()
    if (!trimmed) return
    const newLabel: RecognizedElement = {
      label_en: trimmed,
      label_zh: trimmed,
      confidence: 1,
    }
    setCustomLabels((prev) => [...prev, newLabel])
    setSelectedLabels((prev) => new Set([...prev, trimmed]))
    setCustomInput("")
  }, [customInput])

  // Start segmentation
  const handleSegment = useCallback(async () => {
    if (!imageBlob) return
    const allLabels = [...elements, ...customLabels]
    const selected = allLabels.filter((e) => selectedLabels.has(e.label_en))
    if (selected.length === 0) return
    setStep("segment")
    await segment(imageBlob, selected)
    setStep("result")
  }, [imageBlob, elements, customLabels, selectedLabels, segment])

  // Toggle layer visibility
  const handleToggleVisibility = useCallback(
    (layerId: string) => {
      toggleLayerVisibility(layerId)
    },
    [toggleLayerVisibility]
  )

  // Isolate a single layer
  const handleIsolate = useCallback(
    (layerId: string) => {
      const newId = isolatedLayerId === layerId ? null : layerId
      setIsolatedLayerId(newId)
      onIsolateLayer(newId)
    },
    [isolatedLayerId, onIsolateLayer]
  )

  // Export single layer as PNG
  const handleExportOne = useCallback(
    async (layer: SegmentLayer) => {
      if (!layer.maskUrl) return
      const response = await fetch(layer.maskUrl)
      const blob = await response.blob()
      downloadBlob(blob, `${layer.label_en}.png`)
    },
    []
  )

  // Export all visible layers as ZIP
  const handleExportAll = useCallback(async () => {
    const { default: JSZip } = await import("jszip")
    const zip = new JSZip()
    const visibleLayers = layers.filter((l) => l.visible)

    for (const layer of visibleLayers) {
      if (!layer.maskUrl) continue
      const response = await fetch(layer.maskUrl)
      const blob = await response.blob()
      zip.file(`${layer.label_en}.png`, blob)
    }

    const zipBlob = await zip.generateAsync({ type: "blob" })
    downloadBlob(zipBlob, "ai-segments.zip")
  }, [layers])

  // Back to select step
  const handleBackToSelect = useCallback(() => {
    resetSegment()
    setStep("select")
    setIsolatedLayerId(null)
    onIsolateLayer(null)
    onLayersChange([])
  }, [resetSegment, onIsolateLayer, onLayersChange])

  // Auto-start analysis when image is available
  const handleStart = useCallback(() => {
    if (imageBlob) {
      handleAnalyze()
    }
  }, [imageBlob, handleAnalyze])

  const allLabels = [...elements, ...customLabels]

  return (
    <div className="flex flex-col h-full w-80 border-l bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <Sparkles className="h-4 w-4" strokeWidth={1.5} />
        <h2 className="text-sm font-medium">{t("title")}</h2>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 px-4 py-3 border-b text-xs">
        <StepDot
          active={step === "analyze" || step === "upload"}
          done={step === "select" || step === "segment" || step === "result"}
          label={t("stepAnalyze")}
        />
        <StepLine />
        <StepDot
          active={step === "select"}
          done={step === "segment" || step === "result"}
          label={t("stepSelect")}
        />
        <StepLine />
        <StepDot
          active={step === "segment"}
          done={step === "result"}
          label={t("stepSegment")}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Upload / Start state */}
        {step === "upload" && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            {imageBlob ? (
              <Button onClick={handleStart} className="gap-2">
                <Sparkles className="h-4 w-4" />
                {t("stepAnalyze")}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                {t("noImage")}
              </p>
            )}
          </div>
        )}

        {/* Analyzing state */}
        {step === "analyze" && isAnalyzing && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-muted animate-pulse rounded" />
            ))}
            <p className="text-xs text-muted-foreground text-center">
              {t("analyzing")}
            </p>
          </div>
        )}

        {/* Analyze error */}
        {analyzeError && (
          <div className="text-center space-y-3">
            <p className="text-sm text-destructive">{t("analyzeFailed")}</p>
            <Button variant="outline" size="sm" onClick={handleReanalyze}>
              <RefreshCw className="h-3 w-3 mr-1" />
              {t("reanalyze")}
            </Button>
          </div>
        )}

        {/* Select elements */}
        {step === "select" && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {t("elementsFound", { count: allLabels.length })}
            </p>
            <p className="text-sm font-medium">{t("selectElements")}</p>

            <div className="space-y-2">
              {allLabels.map((el) => (
                <label
                  key={el.label_en}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedLabels.has(el.label_en)}
                    onCheckedChange={() => handleToggleLabel(el.label_en)}
                  />
                  <span className="text-sm">{el.label_zh}</span>
                  {el.confidence < 1 && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {Math.round(el.confidence * 100)}%
                    </span>
                  )}
                </label>
              ))}
            </div>

            {/* Custom input */}
            <div className="flex gap-2">
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
                placeholder={t("customLabel")}
                className="text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddCustom}
                disabled={!customInput.trim()}
              >
                {t("addCustom")}
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReanalyze}
                className="gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                {t("reanalyze")}
              </Button>
              <Button
                size="sm"
                onClick={handleSegment}
                disabled={selectedLabels.size === 0}
                className="flex-1 gap-1"
              >
                <Sparkles className="h-3 w-3" />
                {t("startSegment")}
              </Button>
            </div>
          </div>
        )}

        {/* Segmenting state */}
        {step === "segment" && isSegmenting && (
          <div className="space-y-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {t("segmenting", {
                current: progress.current,
                total: progress.total,
              })}
            </p>
          </div>
        )}

        {/* Segment error */}
        {segmentError && (
          <div className="text-center space-y-3">
            <p className="text-sm text-destructive">{t("segmentFailed")}</p>
            <Button variant="outline" size="sm" onClick={handleBackToSelect}>
              <ChevronLeft className="h-3 w-3 mr-1" />
              {t("backToSelect")}
            </Button>
          </div>
        )}

        {/* Result: Layer panel */}
        {step === "result" && layers.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm font-medium">{t("layers")}</p>

            <div className="space-y-1">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors group cursor-pointer"
                  onClick={() => handleIsolate(layer.id)}
                  onMouseEnter={() => onHoverLayer(layer.id)}
                  onMouseLeave={() => onHoverLayer(null)}
                >
                  <button
                    className="p-1 hover:bg-muted rounded transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleVisibility(layer.id)
                    }}
                    aria-label={layer.visible ? "Hide layer" : "Show layer"}
                  >
                    {layer.visible ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </button>

                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: layer.color }}
                  />

                  <span
                    className={`text-sm flex-1 ${
                      isolatedLayerId === layer.id ? "font-medium" : ""
                    } ${!layer.visible ? "text-muted-foreground" : ""}`}
                  >
                    {layer.label_zh}
                  </span>

                  <button
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-muted rounded transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleExportOne(layer)
                    }}
                    aria-label={t("exportOne")}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Export actions */}
            <div className="space-y-2 pt-2 border-t">
              <Button
                size="sm"
                onClick={handleExportAll}
                className="w-full gap-1"
              >
                <Download className="h-3 w-3" />
                {t("exportAllZip")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToSelect}
                className="w-full gap-1"
              >
                <ChevronLeft className="h-3 w-3" />
                {t("backToSelect")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Sub-components ---

function StepDot({
  active,
  done,
  label,
}: {
  active: boolean
  done: boolean
  label: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-2 h-2 rounded-full transition-colors ${
          done
            ? "bg-primary"
            : active
              ? "bg-primary animate-pulse"
              : "bg-muted-foreground/30"
        }`}
      />
      <span
        className={`${
          active || done ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  )
}

function StepLine() {
  return <div className="flex-1 h-px bg-border" />
}
```

**Step 2: Verify TypeScript**

```bash
bunx tsc --noEmit
```

Expected: No errors. If `Checkbox` or `Input` from shadcn are not yet installed, run:

```bash
bunx shadcn@latest add checkbox input
```

**Step 3: Commit**

```bash
git add src/components/AiSegmentationPanel.tsx
git commit -m "feat: add AiSegmentationPanel with 3-step workflow UI"
```

---

## Task 10: Create AiSegmentationCanvas Component

This renders mask overlays on the Konva canvas.

**Files:**
- Create: `src/components/AiSegmentationCanvas.tsx`

**Step 1: Create the component**

```typescript
"use client"

import { useRef, useEffect, useMemo, useState, useCallback } from "react"
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva"
import type { SegmentLayer } from "@/types"

interface AiSegmentationCanvasProps {
  imageBlob: Blob | null
  layers: SegmentLayer[]
  hoveredLayerId: string | null
  isolatedLayerId: string | null
}

const CHECKERBOARD_SIZE = 10
const MASK_OPACITY = 0.3
const MASK_HOVER_OPACITY = 0.6

export function AiSegmentationCanvas({
  imageBlob,
  layers,
  hoveredLayerId,
  isolatedLayerId,
}: AiSegmentationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [mainImage, setMainImage] = useState<HTMLImageElement | null>(null)

  // Load main image from blob
  useEffect(() => {
    if (!imageBlob) return
    const url = URL.createObjectURL(imageBlob)
    const img = new Image()
    img.onload = () => setMainImage(img)
    img.src = url
    return () => URL.revokeObjectURL(url)
  }, [imageBlob])

  // Track container size
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setContainerSize({ width, height })
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Calculate scale to fit image in container
  const scale = useMemo(() => {
    if (!mainImage || !containerSize.width || !containerSize.height) return 1
    const scaleX = containerSize.width / mainImage.width
    const scaleY = containerSize.height / mainImage.height
    return Math.min(scaleX, scaleY, 1) * 0.9 // 90% to leave padding
  }, [mainImage, containerSize])

  // Calculate offset to center image
  const offset = useMemo(() => {
    if (!mainImage) return { x: 0, y: 0 }
    const scaledW = mainImage.width * scale
    const scaledH = mainImage.height * scale
    return {
      x: (containerSize.width - scaledW) / 2,
      y: (containerSize.height - scaledH) / 2,
    }
  }, [mainImage, containerSize, scale])

  // Determine which layers to show
  const visibleLayers = useMemo(() => {
    if (isolatedLayerId) {
      return layers.filter((l) => l.id === isolatedLayerId && l.maskImage)
    }
    return layers.filter((l) => l.visible && l.maskImage)
  }, [layers, isolatedLayerId])

  return (
    <div ref={containerRef} className="flex-1 bg-muted/30 relative overflow-hidden">
      {containerSize.width > 0 && containerSize.height > 0 && (
        <Stage width={containerSize.width} height={containerSize.height}>
          <Layer>
            {/* Main image */}
            {mainImage && (
              <KonvaImage
                image={mainImage}
                x={offset.x}
                y={offset.y}
                width={mainImage.width * scale}
                height={mainImage.height * scale}
              />
            )}

            {/* Mask overlays */}
            {visibleLayers.map((layer) => (
              <KonvaImage
                key={layer.id}
                image={layer.maskImage!}
                x={offset.x}
                y={offset.y}
                width={mainImage ? mainImage.width * scale : 0}
                height={mainImage ? mainImage.height * scale : 0}
                opacity={
                  hoveredLayerId === layer.id
                    ? MASK_HOVER_OPACITY
                    : isolatedLayerId
                      ? 1
                      : MASK_OPACITY
                }
              />
            ))}
          </Layer>
        </Stage>
      )}
    </div>
  )
}
```

**Step 2: Verify TypeScript**

```bash
bunx tsc --noEmit
```

Expected: No errors.

**Step 3: Commit**

```bash
git add src/components/AiSegmentationCanvas.tsx
git commit -m "feat: add AiSegmentationCanvas with mask overlay rendering"
```

---

## Task 11: Create Main AiSegmentation Component

This orchestrates the canvas and panel together.

**Files:**
- Create: `src/components/AiSegmentation.tsx`

**Step 1: Create the component**

```typescript
"use client"

import { useState, useCallback } from "react"
import { AiSegmentationPanel } from "@/components/AiSegmentationPanel"
import { AiSegmentationCanvas } from "@/components/AiSegmentationCanvas"
import { UploadZone } from "@/components/UploadZone"
import type { SegmentLayer } from "@/types"

interface AiSegmentationProps {
  initialImageBlob?: Blob
}

export function AiSegmentation({ initialImageBlob }: AiSegmentationProps) {
  const [imageBlob, setImageBlob] = useState<Blob | null>(
    initialImageBlob ?? null
  )
  const [layers, setLayers] = useState<SegmentLayer[]>([])
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null)
  const [isolatedLayerId, setIsolatedLayerId] = useState<string | null>(null)

  const handleUpload = useCallback(
    (files: Array<{ file: File; image: HTMLImageElement; mimeType: string }>) => {
      if (files.length > 0) {
        setImageBlob(files[0].file)
      }
    },
    []
  )

  const handleLayersChange = useCallback((newLayers: SegmentLayer[]) => {
    setLayers(newLayers)
  }, [])

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Canvas area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {imageBlob ? (
          <AiSegmentationCanvas
            imageBlob={imageBlob}
            layers={layers}
            hoveredLayerId={hoveredLayerId}
            isolatedLayerId={isolatedLayerId}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <UploadZone onUpload={handleUpload} />
          </div>
        )}
      </div>

      {/* Right panel */}
      <AiSegmentationPanel
        imageBlob={imageBlob}
        onLayersChange={handleLayersChange}
        onHoverLayer={setHoveredLayerId}
        onIsolateLayer={setIsolatedLayerId}
      />
    </div>
  )
}
```

**Step 2: Verify TypeScript**

```bash
bunx tsc --noEmit
```

Expected: No errors.

**Step 3: Commit**

```bash
git add src/components/AiSegmentation.tsx
git commit -m "feat: add AiSegmentation orchestrator component"
```

---

## Task 12: Integrate into Workspace Page

**Files:**
- Modify: `src/app/[locale]/workspace/page.tsx`
- Modify: `src/components/HistorySidebar.tsx`

**Step 1: Add mode state to workspace page**

Modify `src/app/[locale]/workspace/page.tsx`:

- Add `mode` state: `'manual' | 'ai'`
- Add `onSwitchToAi` / `onSwitchToManual` callbacks passed to sidebar
- Conditionally render `DynamicSplitEditor` or `AiSegmentation`

```typescript
"use client"

import { useCallback, useState } from "react"
import { DynamicSplitEditor } from "@/components/DynamicSplitEditor"
import { AiSegmentation } from "@/components/AiSegmentation"
import { HistorySidebar } from "@/components/HistorySidebar"
import { useHistory } from "@/hooks/use-history"
import type { SplitLine } from "@/types"

type WorkspaceMode = "manual" | "ai"

interface EditorState {
  imageBlob: Blob
  lines: SplitLine[]
  originalFileName: string
  originalMimeType: string
  images?: Array<{ blob: Blob; fileName: string; mimeType: string }>
}

export default function WorkspacePage() {
  const [mode, setMode] = useState<WorkspaceMode>("manual")
  const [editorKey, setEditorKey] = useState(0)
  const [initialState, setInitialState] = useState<EditorState | undefined>()
  const { saveCurrentWork } = useHistory()

  const handleLoadRecord = useCallback((record: EditorState) => {
    setInitialState(record)
    setEditorKey((k) => k + 1)
    setMode("manual")
  }, [])

  const handleNewCanvas = useCallback(() => {
    setInitialState(undefined)
    setEditorKey((k) => k + 1)
    setMode("manual")
  }, [])

  const handleSaveHistory = useCallback(
    async (data: {
      originalFileName: string
      originalMimeType: string
      lines: SplitLine[]
      imageBlob: Blob
      thumbnailDataUrl: string
      images?: Array<{ blob: Blob; fileName: string; mimeType: string }>
    }) => {
      await saveCurrentWork(data)
    },
    [saveCurrentWork]
  )

  return (
    <div className="flex h-screen">
      <HistorySidebar
        onLoadRecord={handleLoadRecord}
        onNewCanvas={handleNewCanvas}
        mode={mode}
        onSwitchMode={setMode}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {mode === "manual" ? (
          <div className="flex-1 flex flex-col overflow-hidden p-4">
            <DynamicSplitEditor
              key={editorKey}
              initialState={initialState}
              onSaveHistory={handleSaveHistory}
              showShortcutHints
            />
          </div>
        ) : (
          <AiSegmentation />
        )}
      </main>
    </div>
  )
}
```

**Step 2: Add mode toggle to HistorySidebar**

Modify `src/components/HistorySidebar.tsx` to accept `mode` and `onSwitchMode` props:

- Add new props to interface:
  ```typescript
  mode: "manual" | "ai"
  onSwitchMode: (mode: "manual" | "ai") => void
  ```
- Add mode toggle buttons above the history title section:
  ```tsx
  <div className="flex gap-1 p-3 border-b">
    <Button
      size="sm"
      variant={mode === "manual" ? "default" : "outline"}
      onClick={() => onSwitchMode("manual")}
      className="flex-1 gap-1 text-xs"
    >
      <Scissors className="h-3 w-3" />
      {t("backToHome").includes("Home") ? "Manual" : "手动分割"}
    </Button>
    <Button
      size="sm"
      variant={mode === "ai" ? "default" : "outline"}
      onClick={() => onSwitchMode("ai")}
      className="flex-1 gap-1 text-xs"
    >
      <Sparkles className="h-3 w-3" />
      {tAi("sidebarButton")}
    </Button>
  </div>
  ```
  Import `Sparkles` from lucide-react, add `const tAi = useTranslations("aiSegmentation")`

**Step 3: Verify dev server**

```bash
bun dev
```

Open browser, verify:
- Sidebar shows Manual / AI toggle buttons
- Clicking "AI 分割" switches to AI segmentation view
- Clicking "手动分割" switches back to manual editor

**Step 4: Commit**

```bash
git add src/app/[locale]/workspace/page.tsx src/components/HistorySidebar.tsx
git commit -m "feat: integrate AI segmentation mode into workspace"
```

---

## Task 13: End-to-End Verification & Polish

**Files:**
- All previously created/modified files

**Step 1: Full build check**

```bash
bun run build
```

Expected: Build succeeds with no errors.

**Step 2: Lint check**

```bash
bun run lint
```

Fix any lint errors.

**Step 3: Run all tests**

```bash
bun test
```

Expected: All tests pass.

**Step 4: Manual E2E test**

1. Start dev server: `bun dev`
2. Open `http://localhost:3000/workspace`
3. Verify manual split mode works as before (regression check)
4. Click "AI 分割" in sidebar
5. Upload an image (or use existing image)
6. Click analyze button
7. Verify skeleton loading state appears
8. Verify element checkboxes appear after analysis
9. Select elements, click "开始分割"
10. Verify progress bar shows
11. Verify layer panel appears with eye/download icons
12. Test layer visibility toggle
13. Test layer hover highlight
14. Test single layer isolation (click layer row)
15. Test single export and ZIP export
16. Test "返回重新选择" navigation
17. Test "重新识别" button
18. Switch language to English, verify all text translated
19. Switch back to manual mode, verify editor still works

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete AI segmentation feature with Grok Vision + Lang-SAM"
```

---

## Task Dependencies

```
Task 1 (deps & env)
  ↓
Task 2 (types)
  ↓
  ├── Task 3 (API: analyze)
  ├── Task 4 (API: segment)
  └── Task 5 (lib: utils)
       ↓
  ├── Task 6 (hook: analyze)
  └── Task 7 (hook: segment)
       ↓
  └── Task 8 (i18n)
       ↓
  ├── Task 9  (panel component)
  ├── Task 10 (canvas component)
  └── Task 11 (orchestrator)
       ↓
  └── Task 12 (workspace integration)
       ↓
  └── Task 13 (verification)
```
