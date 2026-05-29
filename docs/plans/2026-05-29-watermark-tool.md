# Watermark Tool Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a standalone `/watermark` editor that lets users add text, logo, single-position, and repeated watermark layers to one image in the browser.

**Architecture:** Add a new Konva-based editor module instead of extending Resize. Store watermark state as serializable layer data, render previews with `react-konva`, and export by redrawing the base image plus enabled layers to an offscreen Canvas 2D surface.

**Tech Stack:** Next.js 16 App Router, React 19, next-intl, react-konva/konva, Browser Canvas 2D, existing `UploadZone` and upload utilities, Vitest, Bun.

---

## Constraints

- Use `bun` commands, not npm.
- Keep watermark and mosaic/blur as separate tools.
- Do not introduce server-side image processing.
- Do not couple the editor to Resize internals.
- Keep first release single-image. Batch export can be added later after the editor model is stable.
- Commit after each task.

## Task 1: Core Watermark Model and Presets

**Files:**
- Create: `src/lib/watermark.ts`
- Create: `src/lib/watermark-presets.ts`
- Create: `src/lib/__tests__/watermark.test.ts`

**Step 1: Write failing tests**

Create `src/lib/__tests__/watermark.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest"
import {
  createWatermarkLayer,
  createWatermarkState,
  getEnabledLayers,
  updateWatermarkLayer,
} from "../watermark"
import { WATERMARK_TEMPLATES, applyWatermarkTemplate } from "../watermark-presets"

describe("watermark model", () => {
  it("creates a default text layer", () => {
    const layer = createWatermarkLayer("text", { text: "ImgSplit" })

    expect(layer).toMatchObject({
      type: "text",
      repeatMode: "single",
      text: "ImgSplit",
      opacity: 0.35,
      rotation: -24,
      enabled: true,
    })
    expect(layer.id).toMatch(/^wm-/)
  })

  it("updates only the selected layer", () => {
    const first = createWatermarkLayer("text", { text: "A" })
    const second = createWatermarkLayer("text", { text: "B" })
    const state = createWatermarkState([first, second])

    const next = updateWatermarkLayer(state, second.id, { opacity: 0.7 })

    expect(next.layers[0].opacity).toBe(first.opacity)
    expect(next.layers[1].opacity).toBe(0.7)
  })

  it("returns enabled layers in draw order", () => {
    const hidden = createWatermarkLayer("text", { enabled: false })
    const visible = createWatermarkLayer("text", { text: "Visible" })
    const state = createWatermarkState([hidden, visible])

    expect(getEnabledLayers(state)).toEqual([visible])
  })
})

describe("watermark templates", () => {
  it("provides the approved template set", () => {
    expect(WATERMARK_TEMPLATES.map((template) => template.id)).toEqual([
      "corner-copyright",
      "center-mark",
      "diagonal-repeat",
      "dense-anti-theft",
      "brand-badge",
      "subtle-protection",
    ])
  })

  it("applies a repeated diagonal template", () => {
    const state = applyWatermarkTemplate("diagonal-repeat", {
      imageWidth: 1200,
      imageHeight: 800,
      text: "Copyright",
    })

    expect(state.layers[0]).toMatchObject({
      repeatMode: "repeat",
      text: "Copyright",
      rotation: -28,
    })
  })
})
```

**Step 2: Run test to verify it fails**

Run:

```bash
bunx vitest run src/lib/__tests__/watermark.test.ts
```

Expected: FAIL because `src/lib/watermark.ts` and `src/lib/watermark-presets.ts` do not exist.

**Step 3: Implement model**

Create `src/lib/watermark.ts`:

```ts
export type WatermarkLayerType = "text" | "image"
export type WatermarkRepeatMode = "single" | "repeat"
export type WatermarkOutputFormat = "image/png" | "image/jpeg" | "image/webp"

export interface WatermarkLayer {
  id: string
  type: WatermarkLayerType
  repeatMode: WatermarkRepeatMode
  text: string
  imageSrc: string | null
  imageName: string | null
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  fontSize: number
  fontFamily: string
  color: string
  spacingX: number
  spacingY: number
  enabled: boolean
}

export interface WatermarkState {
  layers: WatermarkLayer[]
  selectedLayerId: string | null
}

let nextWatermarkLayerId = 0

export function createWatermarkLayer(
  type: WatermarkLayerType,
  overrides: Partial<WatermarkLayer> = {}
): WatermarkLayer {
  return {
    id: `wm-${++nextWatermarkLayerId}`,
    type,
    repeatMode: "single",
    text: type === "text" ? "ImgSplit" : "",
    imageSrc: null,
    imageName: null,
    x: 0.5,
    y: 0.5,
    width: 240,
    height: 80,
    rotation: -24,
    opacity: 0.35,
    fontSize: 48,
    fontFamily: "Arial",
    color: "#ffffff",
    spacingX: 280,
    spacingY: 180,
    enabled: true,
    ...overrides,
  }
}

export function createWatermarkState(layers: WatermarkLayer[] = []): WatermarkState {
  return {
    layers,
    selectedLayerId: layers[0]?.id ?? null,
  }
}

export function updateWatermarkLayer(
  state: WatermarkState,
  layerId: string,
  patch: Partial<WatermarkLayer>
): WatermarkState {
  return {
    ...state,
    layers: state.layers.map((layer) =>
      layer.id === layerId ? { ...layer, ...patch } : layer
    ),
  }
}

export function getEnabledLayers(state: WatermarkState): WatermarkLayer[] {
  return state.layers.filter((layer) => layer.enabled)
}
```

**Step 4: Implement presets**

Create `src/lib/watermark-presets.ts`:

```ts
import {
  createWatermarkLayer,
  createWatermarkState,
  type WatermarkState,
} from "./watermark"

export type WatermarkTemplateId =
  | "corner-copyright"
  | "center-mark"
  | "diagonal-repeat"
  | "dense-anti-theft"
  | "brand-badge"
  | "subtle-protection"

export interface WatermarkTemplate {
  id: WatermarkTemplateId
  labelKey: string
  descriptionKey: string
}

export interface ApplyTemplateOptions {
  imageWidth: number
  imageHeight: number
  text?: string
}

export const WATERMARK_TEMPLATES: WatermarkTemplate[] = [
  { id: "corner-copyright", labelKey: "templateCorner", descriptionKey: "templateCornerDesc" },
  { id: "center-mark", labelKey: "templateCenter", descriptionKey: "templateCenterDesc" },
  { id: "diagonal-repeat", labelKey: "templateDiagonal", descriptionKey: "templateDiagonalDesc" },
  { id: "dense-anti-theft", labelKey: "templateDense", descriptionKey: "templateDenseDesc" },
  { id: "brand-badge", labelKey: "templateBrand", descriptionKey: "templateBrandDesc" },
  { id: "subtle-protection", labelKey: "templateSubtle", descriptionKey: "templateSubtleDesc" },
]

export function applyWatermarkTemplate(
  templateId: WatermarkTemplateId,
  options: ApplyTemplateOptions
): WatermarkState {
  const text = options.text ?? "Copyright"

  switch (templateId) {
    case "corner-copyright":
      return createWatermarkState([
        createWatermarkLayer("text", {
          text,
          x: 0.82,
          y: 0.9,
          rotation: 0,
          opacity: 0.55,
          fontSize: Math.max(24, Math.round(options.imageWidth * 0.035)),
        }),
      ])
    case "center-mark":
      return createWatermarkState([
        createWatermarkLayer("text", {
          text,
          x: 0.5,
          y: 0.5,
          rotation: 0,
          opacity: 0.28,
          fontSize: Math.max(48, Math.round(options.imageWidth * 0.08)),
        }),
      ])
    case "diagonal-repeat":
      return createWatermarkState([
        createWatermarkLayer("text", {
          text,
          repeatMode: "repeat",
          rotation: -28,
          opacity: 0.22,
          fontSize: Math.max(28, Math.round(options.imageWidth * 0.04)),
          spacingX: 320,
          spacingY: 200,
        }),
      ])
    case "dense-anti-theft":
      return createWatermarkState([
        createWatermarkLayer("text", {
          text,
          repeatMode: "repeat",
          rotation: -32,
          opacity: 0.32,
          fontSize: Math.max(22, Math.round(options.imageWidth * 0.032)),
          spacingX: 220,
          spacingY: 140,
        }),
      ])
    case "brand-badge":
      return createWatermarkState([
        createWatermarkLayer("text", {
          text,
          x: 0.16,
          y: 0.12,
          rotation: 0,
          opacity: 0.85,
          fontSize: Math.max(24, Math.round(options.imageWidth * 0.04)),
        }),
      ])
    case "subtle-protection":
      return createWatermarkState([
        createWatermarkLayer("text", {
          text,
          x: 0.5,
          y: 0.5,
          rotation: -24,
          opacity: 0.12,
          fontSize: Math.max(72, Math.round(options.imageWidth * 0.12)),
        }),
      ])
  }
}
```

**Step 5: Run tests**

Run:

```bash
bunx vitest run src/lib/__tests__/watermark.test.ts
```

Expected: PASS.

**Step 6: Commit**

```bash
git add src/lib/watermark.ts src/lib/watermark-presets.ts src/lib/__tests__/watermark.test.ts
git commit -m "feat(watermark): add model and templates"
```

## Task 2: Export Renderer

**Files:**
- Modify: `src/lib/watermark.ts`
- Modify: `src/lib/__tests__/watermark.test.ts`

**Step 1: Add failing export tests**

Append to `src/lib/__tests__/watermark.test.ts`:

```ts
import { exportWatermarkedImage } from "../watermark"

describe("exportWatermarkedImage", () => {
  it("draws the base image and enabled text layers", async () => {
    const calls: string[] = []
    const ctx = {
      clearRect: () => calls.push("clearRect"),
      drawImage: () => calls.push("drawImage"),
      fillText: () => calls.push("fillText"),
      fillRect: () => calls.push("fillRect"),
      measureText: () => ({ width: 120 }),
      save: () => calls.push("save"),
      restore: () => calls.push("restore"),
      translate: () => calls.push("translate"),
      rotate: () => calls.push("rotate"),
      globalAlpha: 1,
      fillStyle: "",
      font: "",
      textAlign: "center",
      textBaseline: "middle",
    }
    const canvas = {
      width: 0,
      height: 0,
      getContext: () => ctx,
      toBlob: (cb: BlobCallback, type?: string) => cb(new Blob(["ok"], { type })),
    } as unknown as HTMLCanvasElement
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "canvas") return canvas
      return originalCreateElement(tag)
    })

    const image = {
      naturalWidth: 800,
      naturalHeight: 600,
    } as HTMLImageElement
    const state = createWatermarkState([
      createWatermarkLayer("text", { text: "Owner" }),
    ])

    const blob = await exportWatermarkedImage(image, state, "image/png")

    expect(blob.type).toBe("image/png")
    expect(calls).toContain("drawImage")
    expect(calls).toContain("fillText")
  })
})
```

**Step 2: Run test to verify it fails**

Run:

```bash
bunx vitest run src/lib/__tests__/watermark.test.ts
```

Expected: FAIL because `exportWatermarkedImage` does not exist.

**Step 3: Implement export**

Add to `src/lib/watermark.ts`:

```ts
export async function exportWatermarkedImage(
  image: HTMLImageElement,
  state: WatermarkState,
  format: WatermarkOutputFormat,
  quality = 0.92
): Promise<Blob> {
  const canvas = document.createElement("canvas")
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Failed to get canvas context")

  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

  for (const layer of getEnabledLayers(state)) {
    if (layer.type === "text") {
      drawTextWatermark(ctx, layer, canvas.width, canvas.height)
    }
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to export watermark image"))),
      format,
      format === "image/png" ? undefined : quality
    )
  })
}

function drawTextWatermark(
  ctx: CanvasRenderingContext2D,
  layer: WatermarkLayer,
  width: number,
  height: number
) {
  ctx.save()
  ctx.globalAlpha = layer.opacity
  ctx.fillStyle = layer.color
  ctx.font = `${layer.fontSize}px ${layer.fontFamily}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  if (layer.repeatMode === "repeat") {
    for (let y = -height; y <= height * 2; y += layer.spacingY) {
      for (let x = -width; x <= width * 2; x += layer.spacingX) {
        drawRotatedText(ctx, layer.text, x, y, layer.rotation)
      }
    }
  } else {
    drawRotatedText(ctx, layer.text, layer.x * width, layer.y * height, layer.rotation)
  }

  ctx.restore()
}

function drawRotatedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  rotation: number
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.fillText(text, 0, 0)
  ctx.restore()
}
```

Logo export can be added in Task 4 when image layer loading exists in the editor.

**Step 4: Run tests**

Run:

```bash
bunx vitest run src/lib/__tests__/watermark.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/watermark.ts src/lib/__tests__/watermark.test.ts
git commit -m "feat(watermark): add canvas export renderer"
```

## Task 3: Route and Editor Shell

**Files:**
- Create: `src/app/[locale]/watermark/page.tsx`
- Create: `src/components/watermark/DynamicWatermarkEditor.tsx`
- Create: `src/components/watermark/WatermarkEditor.tsx`
- Modify: `src/messages/en.json`

**Step 1: Add English i18n keys**

Add a top-level `watermark` namespace to `src/messages/en.json`:

```json
"watermark": {
  "metadata": {
    "title": "Add Watermark to Photo Online - Free Browser Tool | ImgSplit",
    "description": "Add text, logo, and repeated watermarks to images online. Free, private, browser-based watermark maker with no upload."
  },
  "loadingEditor": "Loading editor...",
  "uploadTitle": "Add Watermark",
  "uploadDescription": "Upload an image to add text, logo, or repeated watermark templates.",
  "templates": "Templates",
  "layers": "Layers",
  "text": "Text",
  "logo": "Logo",
  "opacity": "Opacity",
  "rotation": "Rotation",
  "size": "Size",
  "spacing": "Spacing",
  "color": "Color",
  "repeat": "Repeat",
  "single": "Single",
  "download": "Download",
  "addText": "Add text",
  "addLogo": "Add logo",
  "replaceImage": "Replace image"
}
```

**Step 2: Create route**

Create `src/app/[locale]/watermark/page.tsx`:

```tsx
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { JsonLd } from "@/components/JsonLd"
import { routing } from "@/i18n/routing"
import { DynamicWatermarkEditor } from "@/components/watermark/DynamicWatermarkEditor"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "watermark.metadata" })
  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/watermark`
      : `${BASE_URL}/${locale}/watermark`

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [
            l,
            l === routing.defaultLocale
              ? `${BASE_URL}/watermark`
              : `${BASE_URL}/${l}/watermark`,
          ])
        ),
        "x-default": `${BASE_URL}/watermark`,
      },
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function WatermarkPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "watermark.metadata" })

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ImgSplit Watermark Tool",
          url: `${BASE_URL}/watermark`,
          description: t("description"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <DynamicWatermarkEditor />
    </main>
  )
}
```

**Step 3: Create dynamic wrapper**

Create `src/components/watermark/DynamicWatermarkEditor.tsx`:

```tsx
"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

function EditorLoading() {
  const t = useTranslations("watermark")
  return (
    <div className="flex h-64 items-center justify-center text-muted-foreground">
      {t("loadingEditor")}
    </div>
  )
}

const LazyWatermarkEditor = dynamic(
  () => import("./WatermarkEditor").then((mod) => ({ default: mod.WatermarkEditor })),
  { ssr: false, loading: () => <EditorLoading /> }
)

export function DynamicWatermarkEditor() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <LazyWatermarkEditor />
    </Suspense>
  )
}
```

**Step 4: Create upload shell**

Create `src/components/watermark/WatermarkEditor.tsx` with:

- `useTranslations("watermark")`
- `UploadZone` empty state
- image state from `UploadResult`
- header matching existing editor pages
- placeholder editor area after upload

The shell should compile before Konva-specific canvas work begins.

**Step 5: Verify**

Run:

```bash
bun run lint
```

Expected: PASS.

**Step 6: Commit**

```bash
git add 'src/app/[locale]/watermark/page.tsx' src/components/watermark/DynamicWatermarkEditor.tsx src/components/watermark/WatermarkEditor.tsx src/messages/en.json
git commit -m "feat(watermark): add editor route and shell"
```

## Task 4: Konva Canvas, Templates, and Controls

**Files:**
- Create: `src/components/watermark/WatermarkCanvas.tsx`
- Create: `src/components/watermark/WatermarkControls.tsx`
- Create: `src/components/watermark/WatermarkTemplatePicker.tsx`
- Modify: `src/components/watermark/WatermarkEditor.tsx`
- Modify: `src/lib/watermark.ts`
- Modify: `src/messages/en.json`

**Step 1: Add missing i18n keys**

Add template labels and controls under `watermark` in `src/messages/en.json`:

```json
"templateCorner": "Corner copyright",
"templateCornerDesc": "A clean bottom-corner ownership mark.",
"templateCenter": "Center mark",
"templateCenterDesc": "A single centered watermark for previews.",
"templateDiagonal": "Diagonal repeat",
"templateDiagonalDesc": "Repeated diagonal copyright text.",
"templateDense": "Dense protection",
"templateDenseDesc": "More visible repeated marks for anti-theft use.",
"templateBrand": "Brand badge",
"templateBrandDesc": "A compact brand-style mark near the corner.",
"templateSubtle": "Subtle protection",
"templateSubtleDesc": "Large, low-opacity protection across the image.",
"deleteLayer": "Delete layer",
"duplicateLayer": "Duplicate layer",
"toggleLayer": "Toggle layer",
"watermarkText": "Watermark text",
"uploadLogo": "Upload logo"
```

**Step 2: Implement template picker**

Create `WatermarkTemplatePicker` that maps `WATERMARK_TEMPLATES` and calls:

```ts
onApplyTemplate(template.id)
```

Use compact buttons/cards, not large marketing cards.

**Step 3: Implement controls**

Create `WatermarkControls` props:

```ts
interface WatermarkControlsProps {
  state: WatermarkState
  selectedLayer: WatermarkLayer | null
  onSelectLayer: (id: string) => void
  onUpdateLayer: (id: string, patch: Partial<WatermarkLayer>) => void
  onAddTextLayer: () => void
  onLogoFile: (file: File) => void
  onDeleteLayer: (id: string) => void
  onDuplicateLayer: (id: string) => void
}
```

Controls must include:

- layer list
- text input for text layers
- logo upload for image layers
- opacity slider
- rotation number input or slider
- font size or layer size control
- color input for text
- repeat mode toggle
- spacing controls when repeated

**Step 4: Implement Konva canvas**

Create `WatermarkCanvas` with:

- `Stage`, `Layer`, `Image`, `Text`, and `Group` from `react-konva`
- fit-to-container preview scale
- base image rendering
- single text layers as draggable Konva `Text`
- repeated text layers as generated repeated `Text` nodes
- selected layer visual feedback
- `onDragEnd` converts preview coordinates back to normalized `x` and `y`

Keep repeated layers panel-controlled only.

**Step 5: Wire editor state**

Modify `WatermarkEditor.tsx` to:

- initialize template state after upload with `applyWatermarkTemplate("diagonal-repeat", ...)`
- apply templates from picker
- add text layers
- upload logo files as object URLs
- clean object URLs on replacement/unmount
- select/update/duplicate/delete/toggle layers

**Step 6: Verify**

Run:

```bash
bun run lint
```

Expected: PASS.

Also run the targeted model tests:

```bash
bunx vitest run src/lib/__tests__/watermark.test.ts
```

Expected: PASS.

**Step 7: Commit**

```bash
git add src/components/watermark src/lib/watermark.ts src/messages/en.json
git commit -m "feat(watermark): add konva editor controls"
```

## Task 5: Download Flow and Logo Export

**Files:**
- Modify: `src/lib/watermark.ts`
- Modify: `src/components/watermark/WatermarkEditor.tsx`
- Modify: `src/lib/__tests__/watermark.test.ts`

**Step 1: Add failing tests for image layers**

Extend `watermark.test.ts` so export includes image watermark layers. Mock `drawImage` calls and assert the base image plus watermark image are both drawn.

**Step 2: Add image asset support to export**

In `src/lib/watermark.ts`, add an optional image map:

```ts
export type WatermarkImageAssetMap = Record<string, HTMLImageElement>

export async function exportWatermarkedImage(
  image: HTMLImageElement,
  state: WatermarkState,
  format: WatermarkOutputFormat,
  quality = 0.92,
  imageAssets: WatermarkImageAssetMap = {}
): Promise<Blob>
```

For `type === "image"`, draw the loaded logo from `imageAssets[layer.id]`. Support both single and repeated image layers.

**Step 3: Wire download button**

In `WatermarkEditor.tsx`:

- keep loaded logo images by layer id
- call `exportWatermarkedImage(image, state, "image/png", 0.92, logoImages)`
- download as `<original-name>-watermarked.png`
- show toast on export failure

**Step 4: Verify**

Run:

```bash
bunx vitest run src/lib/__tests__/watermark.test.ts
bun run lint
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/watermark.ts src/lib/__tests__/watermark.test.ts src/components/watermark/WatermarkEditor.tsx
git commit -m "feat(watermark): support export downloads"
```

## Task 6: Localization, pSEO, Tools Hub, and Sitemap

**Files:**
- Modify: `src/messages/zh-CN.json`
- Modify: `src/messages/ja.json`
- Modify: `src/messages/ko.json`
- Modify: `src/messages/es.json`
- Modify: `src/lib/pseo/index.ts`
- Modify: `src/lib/pseo/en.ts`
- Modify: `src/lib/pseo/zh-CN.ts`
- Modify: `src/lib/pseo/ja.ts`
- Modify: `src/lib/pseo/ko.ts`
- Modify: `src/lib/pseo/es.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/[locale]/tools/page.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/[toolSlug]/page.tsx`

**Step 1: Add 5-language editor translations**

Mirror the final `watermark` namespace from `en.json` into:

- `src/messages/zh-CN.json`
- `src/messages/ja.json`
- `src/messages/ko.json`
- `src/messages/es.json`

**Step 2: Register pSEO slugs**

Add to `slugMeta` in `src/lib/pseo/index.ts`:

```ts
{ slug: "add-watermark-to-photo", category: "use-case" },
{ slug: "text-watermark-tool", category: "use-case" },
{ slug: "photo-logo-watermark", category: "use-case" },
{ slug: "copyright-watermark", category: "use-case" },
```

**Step 3: Add localized pSEO data**

Add `ToolPageData` entries to all five locale files. Each page should use CTA links to `/watermark`.

Required pages:

- `add-watermark-to-photo`
- `text-watermark-tool`
- `photo-logo-watermark`
- `copyright-watermark`

**Step 4: Add base route to sitemap**

Modify `src/app/sitemap.ts` to add `/watermark` with localized alternates, matching the existing `/grid` and `/resize` blocks.

**Step 5: Add tools hub and footer links**

Update all existing tool listing surfaces that already include Compress/Resize so Watermark appears consistently. Keep the tools hub JSON-LD item list updated.

**Step 6: Verify**

Run:

```bash
bun run lint
bun run build
```

Expected: PASS. If build is too slow locally, at minimum run lint and document the skipped build in the final handoff.

**Step 7: Commit**

```bash
git add src/messages src/lib/pseo src/app/sitemap.ts 'src/app/[locale]/tools/page.tsx' 'src/app/[locale]/page.tsx' 'src/app/[locale]/[toolSlug]/page.tsx'
git commit -m "feat(watermark): add seo and localization"
```

## Task 7: Progress Tracking and Final Verification

**Files:**
- Modify: `docs/ideation/PROGRESS.md`

**Step 1: Update progress**

Update Phase 2 item `③ 图片水印工具`:

- Status: `🟡 开发中` while implementation is underway.
- After verification passes, set to `🟢 已完成`.
- Add completed subtasks for model, templates, Konva editor, export, pSEO, and i18n.
- Add a changelog row for `2026-05-29`.

**Step 2: Final verification**

Run:

```bash
bunx vitest run src/lib/__tests__/watermark.test.ts
bun run lint
bun run build
```

Expected: all pass.

**Step 3: Manual browser check**

Start the dev server:

```bash
bun run dev
```

Open `/watermark` and verify:

- upload works
- templates apply
- text edits update preview
- opacity/rotation/spacing controls work
- single text layer drags correctly
- repeated layer renders without dragging individual tiles
- download produces a watermarked image
- pSEO pages link to the editor

**Step 4: Commit**

```bash
git add docs/ideation/PROGRESS.md
git commit -m "docs(ideation): update watermark progress"
```

## Execution Notes

- Commit exactly one task at a time.
- Keep implementation local to the new watermark module unless a shared app surface must link to it.
- If component code grows beyond one file, prefer small local components under `src/components/watermark/`.
- If repeated text preview becomes slow, cap preview tiles but keep export complete.
- If logo layer support gets risky, ship text watermark first and leave logo as the next batch only after explicit approval.
