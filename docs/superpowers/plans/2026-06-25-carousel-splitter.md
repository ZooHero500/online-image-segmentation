# Carousel Splitter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增独立 `/carousel` 工具,把一张宽图无缝切成 2–10 张轮播幻灯片,并通过 pt-BR 本地化 + pSEO 落地页命中 `cortar carrossel` 词簇。

**Architecture:** 复用现有 grid 切割引擎的底层 canvas 纯函数(抽到 `image-canvas.ts`),新建专注的 `carousel-splitter.ts`(1×N + 比例预设,每张切片渲染到固定目标尺寸)。工作区镜像 grid 的三步流程(上传→调整→下载)与 Konva 编辑器。落地页接入既有 pSEO 系统,使用本地化 slug。

**Tech Stack:** Next.js 16(App Router)、React 19、next-intl、Konva/react-konva、Dexie、JSZip、vitest、Tailwind v4、bun。

## Global Constraints

- 包管理器只用 **bun**(`bun install` / `bun run <script>`);禁止 npm/yarn/pnpm。
- 纯客户端处理:所有图片操作在浏览器内完成,零上传、零后端。
- 现有 `grid-splitter` 的全部既有测试在重构后必须保持全绿(零回归证明)。
- 测试用 vitest:`bun run test`。构建用 `bun run build`。
- 站点域名 `https://imgsplit.com`;默认 locale `en`,`localePrefix: "as-needed"`。
- 新 locale 标识符为 `pt-BR`(与现有 `zh-CN` 同风格)。
- i18n:`pt-BR.json` 键集合必须与 `en.json` 完全对齐(无缺键)。
- pSEO 数据:每个声明的 (slug, locale) 必须有完整 `ToolPageData`。
- 提交信息结尾附:`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`。
- 当前工作分支:`feat/carousel-splitter`。

---

## Task 1: 抽出共享 canvas 纯函数到 `image-canvas.ts`(grid 零回归)

**Files:**
- Create: `src/lib/image-canvas.ts`
- Modify: `src/lib/grid-splitter.ts`(改为 import 共享函数,删除本地定义)
- Test: `src/lib/__tests__/image-canvas.test.ts`(新增)+ `src/lib/__tests__/grid-splitter.test.ts`(回归)

**Interfaces:**
- Produces:
  - `MAX_CANVAS_AREA: number`、`MAX_CANVAS_DIMENSION: number`、`JPEG_QUALITY: number`
  - `computeScale(w: number, h: number): number`
  - `resolveOutputMimeType(originalMimeType: string): string`

- [ ] **Step 1: 写失败测试** `src/lib/__tests__/image-canvas.test.ts`

```ts
import { describe, it, expect } from "vitest"
import { computeScale, resolveOutputMimeType, MAX_CANVAS_AREA } from "../image-canvas"

describe("computeScale", () => {
  it("returns 1 when image is within limits", () => {
    expect(computeScale(1000, 1000)).toBe(1)
  })
  it("downscales when area exceeds MAX_CANVAS_AREA", () => {
    const big = Math.ceil(Math.sqrt(MAX_CANVAS_AREA)) + 2000
    const scale = computeScale(big, big)
    expect(scale).toBeLessThan(1)
    expect(big * scale * big * scale).toBeLessThanOrEqual(MAX_CANVAS_AREA + 1)
  })
  it("clamps a very wide image by max dimension", () => {
    const scale = computeScale(40000, 100)
    expect(40000 * scale).toBeLessThanOrEqual(16384 + 0.5)
  })
})

describe("resolveOutputMimeType", () => {
  it("keeps jpeg and png", () => {
    expect(resolveOutputMimeType("image/jpeg")).toBe("image/jpeg")
    expect(resolveOutputMimeType("image/png")).toBe("image/png")
  })
  it("converts webp and unknown to png", () => {
    expect(resolveOutputMimeType("image/webp")).toBe("image/png")
    expect(resolveOutputMimeType("image/gif")).toBe("image/png")
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `bun run test src/lib/__tests__/image-canvas.test.ts`
Expected: FAIL(`../image-canvas` 不存在)

- [ ] **Step 3: 创建 `src/lib/image-canvas.ts`**

```ts
export const JPEG_QUALITY = 0.92
export const MAX_CANVAS_AREA = 16_777_216
export const MAX_CANVAS_DIMENSION = 16_384

export function resolveOutputMimeType(originalMimeType: string): string {
  if (originalMimeType === "image/webp") return "image/png"
  if (originalMimeType === "image/jpeg" || originalMimeType === "image/png") return originalMimeType
  return "image/png"
}

export function computeScale(w: number, h: number): number {
  let scale = 1
  if (w * h > MAX_CANVAS_AREA) scale = Math.sqrt(MAX_CANVAS_AREA / (w * h))
  if (w * scale > MAX_CANVAS_DIMENSION) scale = MAX_CANVAS_DIMENSION / w
  if (h * scale > MAX_CANVAS_DIMENSION) scale = MAX_CANVAS_DIMENSION / h
  return scale
}
```

- [ ] **Step 4: 重构 `src/lib/grid-splitter.ts`** —— 删除文件顶部的 3 个常量定义、`resolveOutputMimeType`、`computeScale` 三处本地定义,替换为顶部 import。`cropCell`、`splitGrid`、`getGridConfig`、`GridType`、`GridEditorState`、`GridSplitResult` 全部保持不变。

文件顶部改为:
```ts
import {
  JPEG_QUALITY,
  MAX_CANVAS_AREA,
  MAX_CANVAS_DIMENSION,
  computeScale,
  resolveOutputMimeType,
} from "@/lib/image-canvas"
```
(删除原 `const JPEG_QUALITY...`、`const MAX_CANVAS_AREA...`、`const MAX_CANVAS_DIMENSION...`、`function resolveOutputMimeType`、`function computeScale` 这些行。`MAX_CANVAS_AREA`/`MAX_CANVAS_DIMENSION` 若 grid 内未直接引用可不导入,只导入实际用到的;以 lint 结果为准。)

- [ ] **Step 5: 运行全部相关测试,确认 image-canvas 通过且 grid 零回归**

Run: `bun run test src/lib/__tests__/image-canvas.test.ts src/lib/__tests__/grid-splitter.test.ts`
Expected: PASS(两个文件全绿)

- [ ] **Step 6: 提交**

```bash
git add src/lib/image-canvas.ts src/lib/grid-splitter.ts src/lib/__tests__/image-canvas.test.ts
git commit -m "refactor: extract shared canvas helpers into image-canvas

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: 切割引擎 `carousel-splitter.ts`

**Files:**
- Create: `src/lib/carousel-splitter.ts`
- Test: `src/lib/__tests__/carousel-splitter.test.ts`

**Interfaces:**
- Consumes(Task 1):`computeScale`、`resolveOutputMimeType`、`JPEG_QUALITY`(from `@/lib/image-canvas`)
- Produces:
  - `type AspectPreset = "4:5" | "1:1" | "original"`
  - `interface CarouselEditorState { slideCount: number; aspect: AspectPreset; offsetX: number; offsetY: number; scale: number }`
  - `interface CarouselSlide { index: number; blob: Blob; width: number; height: number }`
  - `interface CarouselDisplaySize { displayWidth: number; displayHeight: number }`
  - `const MIN_SLIDES = 2`、`const MAX_SLIDES = 10`
  - `clampSlideCount(n: number): number`
  - `getSlideSize(aspect: AspectPreset, image: HTMLImageElement, slideCount: number): { w: number; h: number }`
  - `getCompositeAspect(aspect: AspectPreset, image: HTMLImageElement, slideCount: number): number`(composite 宽高比 = N×单片宽 / 单片高,供编辑器 frame 用)
  - `splitCarousel(image: HTMLImageElement, state: CarouselEditorState, displaySize: CarouselDisplaySize, originalMimeType: string): Promise<CarouselSlide[]>`

- [ ] **Step 1: 写失败测试** `src/lib/__tests__/carousel-splitter.test.ts`

```ts
import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  splitCarousel, getSlideSize, clampSlideCount, getCompositeAspect,
  MIN_SLIDES, MAX_SLIDES,
} from "../carousel-splitter"

function createMockImage(width: number, height: number): HTMLImageElement {
  return { naturalWidth: width, naturalHeight: height, width, height, complete: true } as unknown as HTMLImageElement
}
function mockCanvas() {
  const ctx = { drawImage: vi.fn(), fillRect: vi.fn(), fillStyle: "" }
  const canvas = {
    width: 0, height: 0,
    getContext: vi.fn(() => ctx),
    toBlob: vi.fn((cb: BlobCallback, type?: string) => cb(new Blob(["x"], { type: type || "image/png" }))),
  }
  return { canvas, ctx }
}

describe("clampSlideCount", () => {
  it("clamps below min and above max", () => {
    expect(clampSlideCount(1)).toBe(MIN_SLIDES)
    expect(clampSlideCount(99)).toBe(MAX_SLIDES)
    expect(clampSlideCount(5)).toBe(5)
  })
  it("rounds non-integers", () => {
    expect(clampSlideCount(3.7)).toBe(4)
  })
})

describe("getSlideSize", () => {
  const img = createMockImage(3000, 2000)
  it("returns 1080x1350 for 4:5", () => {
    expect(getSlideSize("4:5", img, 3)).toEqual({ w: 1080, h: 1350 })
  })
  it("returns 1080x1080 for 1:1", () => {
    expect(getSlideSize("1:1", img, 3)).toEqual({ w: 1080, h: 1080 })
  })
  it("derives native column size for original", () => {
    expect(getSlideSize("original", img, 3)).toEqual({ w: 1000, h: 2000 })
  })
})

describe("getCompositeAspect", () => {
  it("4:5 with 3 slides => 3 * (1080/1350)", () => {
    expect(getCompositeAspect("4:5", createMockImage(100, 100), 3)).toBeCloseTo(3 * (1080 / 1350))
  })
})

describe("splitCarousel", () => {
  beforeEach(() => {
    const { canvas } = mockCanvas()
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") return canvas as unknown as HTMLCanvasElement
      return document.createElement(tag)
    })
  })

  it("produces N slides", async () => {
    const image = createMockImage(3240, 1350)
    const slides = await splitCarousel(
      image,
      { slideCount: 3, aspect: "4:5", offsetX: 0, offsetY: 0, scale: 1 },
      { displayWidth: 3240, displayHeight: 1350 },
      "image/png",
    )
    expect(slides).toHaveLength(3)
    expect(slides.map((s) => s.index)).toEqual([1, 2, 3])
  })

  it("each 4:5 slide reports 1080x1350", async () => {
    const image = createMockImage(3240, 1350)
    const slides = await splitCarousel(
      image,
      { slideCount: 3, aspect: "4:5", offsetX: 0, offsetY: 0, scale: 1 },
      { displayWidth: 3240, displayHeight: 1350 },
      "image/png",
    )
    for (const s of slides) { expect(s.width).toBe(1080); expect(s.height).toBe(1350) }
  })

  it("clamps an out-of-range slideCount", async () => {
    const image = createMockImage(2000, 1000)
    const slides = await splitCarousel(
      image,
      { slideCount: 50, aspect: "1:1", offsetX: 0, offsetY: 0, scale: 1 },
      { displayWidth: 2000, displayHeight: 1000 },
      "image/png",
    )
    expect(slides).toHaveLength(MAX_SLIDES)
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `bun run test src/lib/__tests__/carousel-splitter.test.ts`
Expected: FAIL(`../carousel-splitter` 不存在)

- [ ] **Step 3: 创建 `src/lib/carousel-splitter.ts`**

```ts
import { JPEG_QUALITY, computeScale, resolveOutputMimeType } from "@/lib/image-canvas"

export const MIN_SLIDES = 2
export const MAX_SLIDES = 10

export type AspectPreset = "4:5" | "1:1" | "original"

export interface CarouselEditorState {
  slideCount: number
  aspect: AspectPreset
  offsetX: number
  offsetY: number
  scale: number
}

export interface CarouselSlide {
  index: number
  blob: Blob
  width: number
  height: number
}

export interface CarouselDisplaySize {
  displayWidth: number
  displayHeight: number
}

export function clampSlideCount(n: number): number {
  const rounded = Math.round(n)
  return Math.min(MAX_SLIDES, Math.max(MIN_SLIDES, rounded))
}

export function getSlideSize(
  aspect: AspectPreset,
  image: HTMLImageElement,
  slideCount: number,
): { w: number; h: number } {
  const n = clampSlideCount(slideCount)
  if (aspect === "4:5") return { w: 1080, h: 1350 }
  if (aspect === "1:1") return { w: 1080, h: 1080 }
  // original: slice native image into N columns at native height
  return { w: Math.round(image.naturalWidth / n), h: image.naturalHeight }
}

export function getCompositeAspect(
  aspect: AspectPreset,
  image: HTMLImageElement,
  slideCount: number,
): number {
  const n = clampSlideCount(slideCount)
  const { w, h } = getSlideSize(aspect, image, n)
  return (n * w) / h
}

function renderSlideToBlob(
  image: HTMLImageElement,
  srcX: number, srcY: number, srcW: number, srcH: number,
  targetW: number, targetH: number,
  mimeType: string,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Cap target by canvas limits (1080x1350 never trips this; native "original" might).
    const scale = computeScale(targetW, targetH)
    const outW = Math.round(targetW * scale)
    const outH = Math.round(targetH * scale)
    const canvas = document.createElement("canvas")
    canvas.width = outW
    canvas.height = outH
    const ctx = canvas.getContext("2d")
    if (!ctx) { reject(new Error("Failed to get canvas 2d context")); return }
    ctx.drawImage(image, srcX, srcY, srcW, srcH, 0, 0, outW, outH)
    const quality = mimeType === "image/jpeg" ? JPEG_QUALITY : undefined
    canvas.toBlob(
      (blob) => { blob ? resolve(blob) : reject(new Error("Failed to create blob from canvas")) },
      mimeType, quality,
    )
  })
}

export async function splitCarousel(
  image: HTMLImageElement,
  state: CarouselEditorState,
  displaySize: CarouselDisplaySize,
  originalMimeType: string,
): Promise<CarouselSlide[]> {
  const mimeType = resolveOutputMimeType(originalMimeType)
  const slideCount = clampSlideCount(state.slideCount)
  const { w: targetW, h: targetH } = getSlideSize(state.aspect, image, slideCount)

  // Display→source coordinate conversion, identical model to splitGrid.
  const srcX = -state.offsetX / state.scale
  const srcY = -state.offsetY / state.scale
  const srcW = displaySize.displayWidth / state.scale
  const srcH = displaySize.displayHeight / state.scale
  const cellSrcW = srcW / slideCount
  const cellSrcH = srcH

  const slides: CarouselSlide[] = []
  for (let c = 0; c < slideCount; c++) {
    const blob = await renderSlideToBlob(
      image,
      srcX + c * cellSrcW, srcY, cellSrcW, cellSrcH,
      targetW, targetH, mimeType,
    )
    slides.push({ index: c + 1, blob, width: targetW, height: targetH })
  }
  return slides
}
```

> 注:`width/height` 报告**目标尺寸**(`targetW/targetH`),即便 `computeScale` 对超大 original 做了降采样,对外承诺的逻辑尺寸不变;测试断言基于目标尺寸。

- [ ] **Step 4: 运行确认通过**

Run: `bun run test src/lib/__tests__/carousel-splitter.test.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/lib/carousel-splitter.ts src/lib/__tests__/carousel-splitter.test.ts
git commit -m "feat: add carousel splitter engine

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: 导出与上传交接 helper

**Files:**
- Modify: `src/lib/zip-exporter.ts`(追加 carousel 函数)
- Create: `src/lib/pending-carousel-upload.ts`
- Test: `src/lib/__tests__/zip-exporter.test.ts`(追加 carousel 用例;若文件不存在则创建)

**Interfaces:**
- Produces:
  - `exportCarouselAsZip(blobs: Blob[], fileExtension: string): Promise<Blob>`
  - `getCarouselZipFileName(): string`
  - `setPendingCarouselUpload(file: File): void`
  - `consumePendingCarouselUpload(): File | null`

- [ ] **Step 1: 写失败测试**(追加到 `src/lib/__tests__/zip-exporter.test.ts`)

```ts
import { describe, it, expect } from "vitest"
import { exportCarouselAsZip, getCarouselZipFileName } from "../zip-exporter"

describe("exportCarouselAsZip", () => {
  it("names entries carousel-N and returns a blob", async () => {
    const blobs = [new Blob(["a"]), new Blob(["b"])]
    const zip = await exportCarouselAsZip(blobs, "png")
    expect(zip).toBeInstanceOf(Blob)
  })
  it("zip filename is stable", () => {
    expect(getCarouselZipFileName()).toBe("carousel_split.zip")
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `bun run test src/lib/__tests__/zip-exporter.test.ts`
Expected: FAIL(`exportCarouselAsZip` 未导出)

- [ ] **Step 3: 追加到 `src/lib/zip-exporter.ts` 末尾**

```ts
export async function exportCarouselAsZip(
  blobs: Blob[],
  fileExtension: string,
): Promise<Blob> {
  const { default: JSZip } = await import("jszip")
  const zip = new JSZip()
  for (let i = 0; i < blobs.length; i++) {
    zip.file(`carousel-${i + 1}.${fileExtension}`, blobs[i])
  }
  return zip.generateAsync({ type: "blob", mimeType: "application/zip" })
}

export function getCarouselZipFileName(): string {
  return "carousel_split.zip"
}
```

- [ ] **Step 4: 创建 `src/lib/pending-carousel-upload.ts`**

```ts
let pendingFile: File | null = null

export function setPendingCarouselUpload(file: File) {
  pendingFile = file
}

export function consumePendingCarouselUpload(): File | null {
  const f = pendingFile
  pendingFile = null
  return f
}
```

- [ ] **Step 5: 运行确认通过 + 提交**

Run: `bun run test src/lib/__tests__/zip-exporter.test.ts`
Expected: PASS

```bash
git add src/lib/zip-exporter.ts src/lib/pending-carousel-upload.ts src/lib/__tests__/zip-exporter.test.ts
git commit -m "feat: add carousel zip export and pending-upload handoff

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: 编辑器状态 hook `use-carousel-editor.ts`

**Files:**
- Create: `src/hooks/use-carousel-editor.ts`
- Test: `src/hooks/__tests__/use-carousel-editor.test.ts`(若 `src/hooks/__tests__` 不存在则创建目录)

**Interfaces:**
- Consumes(Task 2):`getCompositeAspect`、`clampSlideCount`、`type AspectPreset`、`type CarouselEditorState`(from `@/lib/carousel-splitter`)
- Produces:hook 返回 `{ state, frameSize, scaleRange, setSlideCount, setAspect, setOffset, handleScale, resetToFit }`,其中 `state: CarouselEditorState`,`frameSize: { width: number; height: number }`。

> 该 hook 镜像 `src/hooks/use-grid-editor.ts` 的几何逻辑(frameSize 由 composite 宽高比 fit 进容器、scaleRange、resetToFit、handleScale 重定位+clamp、setOffset),差异点:用 `getCompositeAspect(aspect, image, slideCount)` 替代 `getGridConfig().aspectRatio`,并用 `slideCount`+`aspect` 两个 state 替代 `gridType`/`withGap`。

- [ ] **Step 1: 写失败测试** `src/hooks/__tests__/use-carousel-editor.test.ts`

```ts
import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useCarouselEditor } from "../use-carousel-editor"

describe("useCarouselEditor", () => {
  it("defaults to 3 slides and 4:5", () => {
    const { result } = renderHook(() =>
      useCarouselEditor({ width: 3240, height: 1350 }, { width: 600, height: 400 }),
    )
    expect(result.current.state.slideCount).toBe(3)
    expect(result.current.state.aspect).toBe("4:5")
  })

  it("clamps slideCount via setSlideCount", () => {
    const { result } = renderHook(() =>
      useCarouselEditor({ width: 3240, height: 1350 }, { width: 600, height: 400 }),
    )
    act(() => result.current.setSlideCount(99))
    expect(result.current.state.slideCount).toBe(10)
  })

  it("frame aspect tracks composite aspect for the chosen preset", () => {
    const { result } = renderHook(() =>
      useCarouselEditor({ width: 3240, height: 1350 }, { width: 600, height: 400 }),
    )
    act(() => result.current.setAspect("1:1"))
    act(() => result.current.setSlideCount(2))
    const ratio = result.current.frameSize.width / result.current.frameSize.height
    expect(ratio).toBeCloseTo(2, 1) // 2 slides * (1080/1080)
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `bun run test src/hooks/__tests__/use-carousel-editor.test.ts`
Expected: FAIL(模块不存在)

- [ ] **Step 3: 创建 `src/hooks/use-carousel-editor.ts`**

```ts
"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import {
  clampSlideCount, getCompositeAspect,
  type AspectPreset, type CarouselEditorState,
} from "@/lib/carousel-splitter"

interface Size { width: number; height: number }

// Minimal HTMLImageElement-like shape so geometry can be computed without a real <img>.
function asImage(size: Size): HTMLImageElement {
  return { naturalWidth: size.width, naturalHeight: size.height } as HTMLImageElement
}

export function useCarouselEditor(imageSize: Size, containerSize: Size) {
  const [slideCount, setSlideCountState] = useState(3)
  const [aspect, setAspectState] = useState<AspectPreset>("4:5")
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScaleState] = useState(1)

  const frameSize = useMemo<Size>(() => {
    const aspectRatio = getCompositeAspect(aspect, asImage(imageSize), slideCount)
    const maxW = containerSize.width
    const maxH = containerSize.height
    let w: number, h: number
    if (aspectRatio >= 1) {
      w = maxW; h = maxW / aspectRatio
      if (h > maxH) { h = maxH; w = maxH * aspectRatio }
    } else {
      h = maxH; w = maxH * aspectRatio
      if (w > maxW) { w = maxW; h = maxW / aspectRatio }
    }
    return { width: Math.round(w), height: Math.round(h) }
  }, [aspect, slideCount, imageSize, containerSize.width, containerSize.height])

  const scaleRange = useMemo(() => {
    const scaleToFillW = frameSize.width / imageSize.width
    const scaleToFillH = frameSize.height / imageSize.height
    const minScale = Math.max(scaleToFillW, scaleToFillH)
    const maxScale = Math.max(minScale * 3, 3)
    return { minScale, maxScale }
  }, [frameSize, imageSize])

  const resetToFit = useCallback(() => {
    const { minScale } = scaleRange
    setScaleState(minScale)
    const scaledW = imageSize.width * minScale
    const scaledH = imageSize.height * minScale
    setOffsetX((frameSize.width - scaledW) / 2)
    setOffsetY((frameSize.height - scaledH) / 2)
  }, [scaleRange, imageSize, frameSize])

  const setSlideCount = useCallback((n: number) => setSlideCountState(clampSlideCount(n)), [])
  const setAspect = useCallback((a: AspectPreset) => setAspectState(a), [])

  useEffect(() => {
    if (imageSize.width > 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetToFit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameSize.width, frameSize.height, imageSize.width, imageSize.height])

  const setOffset = useCallback((x: number, y: number) => { setOffsetX(x); setOffsetY(y) }, [])

  const handleScale = useCallback((newScale: number) => {
    const { minScale, maxScale } = scaleRange
    const clamped = Math.min(maxScale, Math.max(minScale, newScale))
    if (clamped === scale) return
    const cx = frameSize.width / 2
    const cy = frameSize.height / 2
    const ratio = clamped / scale
    const newOX = cx - (cx - offsetX) * ratio
    const newOY = cy - (cy - offsetY) * ratio
    const scaledW = imageSize.width * clamped
    const scaledH = imageSize.height * clamped
    const clampedX = Math.min(0, Math.max(frameSize.width - scaledW, newOX))
    const clampedY = Math.min(0, Math.max(frameSize.height - scaledH, newOY))
    setScaleState(clamped); setOffsetX(clampedX); setOffsetY(clampedY)
  }, [scale, offsetX, offsetY, scaleRange, frameSize, imageSize])

  const state: CarouselEditorState = { slideCount, aspect, offsetX, offsetY, scale }

  return { state, frameSize, scaleRange, setSlideCount, setAspect, setOffset, handleScale, resetToFit }
}
```

- [ ] **Step 4: 运行确认通过 + 提交**

Run: `bun run test src/hooks/__tests__/use-carousel-editor.test.ts`
Expected: PASS

```bash
git add src/hooks/use-carousel-editor.ts src/hooks/__tests__/use-carousel-editor.test.ts
git commit -m "feat: add use-carousel-editor hook

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: 控件组件(份数选择 + 比例选择 + 步骤 + 上传)

**Files:**
- Create: `src/components/carousel/CarouselCountSelector.tsx`
- Create: `src/components/carousel/AspectSelector.tsx`
- Create: `src/components/carousel/CarouselSteps.tsx`
- Create: `src/components/carousel/CarouselUploadZone.tsx`

**Interfaces:**
- Produces(组件 props):
  - `CarouselCountSelector({ value: number; onChange: (n: number) => void }): JSX.Element`
  - `AspectSelector({ value: AspectPreset; onChange: (a: AspectPreset) => void }): JSX.Element`
  - `CarouselSteps({ step: 1 | 2 | 3 }): JSX.Element`
  - `CarouselUploadZone({ onImageLoaded: (img: HTMLImageElement, file: File) => void }): JSX.Element`

> `CarouselSteps` 与 `CarouselUploadZone` 镜像 `src/components/grid/GridSteps.tsx`、`src/components/grid/GridUploadZone.tsx`(直接照搬其结构与样式,文案 key 换成 `carousel.*`,upload 用 `@/lib/upload-utils` 的 `loadImage`)。先阅读这两个现有组件再落地。

- [ ] **Step 1: 读现有 grid 组件作模板**

Run: `cat src/components/grid/GridSteps.tsx src/components/grid/GridUploadZone.tsx src/components/grid/GridTypeSelector.tsx`
Expected: 看到结构,作为镜像基础。

- [ ] **Step 2: 创建 `CarouselCountSelector.tsx`**

```tsx
"use client"

import { useTranslations } from "next-intl"
import { MIN_SLIDES, MAX_SLIDES } from "@/lib/carousel-splitter"

interface Props { value: number; onChange: (n: number) => void }

export function CarouselCountSelector({ value, onChange }: Props) {
  const t = useTranslations("carousel.count")
  const counts = Array.from({ length: MAX_SLIDES - MIN_SLIDES + 1 }, (_, i) => MIN_SLIDES + i)
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{t("label")}</span>
      <div className="flex flex-wrap gap-1.5">
        {counts.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            className={
              "h-9 w-9 rounded-md border text-sm transition " +
              (value === n
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-accent")
            }
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 创建 `AspectSelector.tsx`**

```tsx
"use client"

import { useTranslations } from "next-intl"
import type { AspectPreset } from "@/lib/carousel-splitter"

interface Props { value: AspectPreset; onChange: (a: AspectPreset) => void }

const OPTIONS: { key: AspectPreset; labelKey: string }[] = [
  { key: "4:5", labelKey: "ratio45" },
  { key: "1:1", labelKey: "ratio11" },
  { key: "original", labelKey: "ratioOriginal" },
]

export function AspectSelector({ value, onChange }: Props) {
  const t = useTranslations("carousel.aspect")
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{t("label")}</span>
      <div className="flex gap-1.5">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            aria-pressed={value === o.key}
            className={
              "h-9 flex-1 rounded-md border px-2 text-sm transition " +
              (value === o.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-accent")
            }
          >
            {t(o.labelKey)}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 创建 `CarouselSteps.tsx` 与 `CarouselUploadZone.tsx`** —— 照搬 `GridSteps.tsx` / `GridUploadZone.tsx` 的实现,把 `useTranslations("grid.steps")`→`useTranslations("carousel.steps")`,`useTranslations("grid...")` 对应换成 `carousel.*`;`CarouselUploadZone` 的 `onImageLoaded` 签名为 `(img: HTMLImageElement, file: File) => void`,内部用 `loadImage`(from `@/lib/upload-utils`)。保持 class 名与无障碍属性一致。

- [ ] **Step 5: 构建校验(类型 + 编译) + 提交**

Run: `bun run build`
Expected: 构建成功(无类型错误);此时这些组件尚未被页面引用,仅验证可编译。若 build 因「未使用」报错,放到 Task 7 一起验证亦可——以实际报错为准。

```bash
git add src/components/carousel/
git commit -m "feat: add carousel control components

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Konva 画布编辑器 + 切片预览

**Files:**
- Create: `src/components/carousel/CarouselEditor.tsx`
- Create: `src/components/carousel/CarouselPreview.tsx`

**Interfaces:**
- Consumes:`use-carousel-editor` 的 `frameSize`/`state`/`setOffset`/`handleScale`/`scaleRange`;`splitCarousel`、`CarouselSlide`(Task 2)
- Produces:
  - `CarouselEditor({ image, imageUrl, frameSize, state, scaleRange, onOffsetChange, onScaleChange, slideCount }): JSX.Element`
  - `CarouselPreview({ slides }: { slides: CarouselSlide[] }): JSX.Element`

> `CarouselEditor` 镜像 `src/components/grid/DynamicGridEditor.tsx`(react-konva 的 Stage/Layer/Image + 拖拽 + zoom slider)。**唯一新增**:在 Stage 上叠加 `slideCount - 1` 条竖直分隔线(`Konva.Line`),x 坐标 = `frameSize.width / slideCount * i`(i=1..N-1),示意切割位置。先读现有 grid 编辑器作模板。

- [ ] **Step 1: 读现有 grid Konva 编辑器与预览作模板**

Run: `cat src/components/grid/DynamicGridEditor.tsx src/components/grid/DynamicGridPreview.tsx`
Expected: 看到 react-konva 用法(注意它如何 dynamic import 避免 SSR、如何接 image/offset/scale)。

- [ ] **Step 2: 创建 `CarouselEditor.tsx`** —— 照搬 `DynamicGridEditor.tsx` 的 Stage/Layer/KonvaImage + drag(`onDragEnd`→`onOffsetChange`)+ zoom slider(`onScaleChange`,范围用 `scaleRange`)结构。在图层中追加分隔线:

```tsx
{Array.from({ length: Math.max(0, slideCount - 1) }, (_, i) => i + 1).map((i) => (
  <Line
    key={i}
    points={[(frameSize.width / slideCount) * i, 0, (frameSize.width / slideCount) * i, frameSize.height]}
    stroke="#ffffff"
    strokeWidth={2}
    dash={[6, 4]}
    listening={false}
  />
))}
```
(`Line` from `react-konva`;其余 import / dynamic SSR 处理与 grid 版一致。)

- [ ] **Step 3: 创建 `CarouselPreview.tsx`** —— 横向 flex 排列 `slides`,每个 `slide.blob` 用 `URL.createObjectURL` 生成缩略图,首尾相邻无间隙展示「滑动衔接」。镜像 `DynamicGridPreview.tsx` 的 objectURL 生命周期管理(`useEffect` 创建 + `revokeObjectURL` 清理)。

```tsx
"use client"

import { useEffect, useState } from "react"
import type { CarouselSlide } from "@/lib/carousel-splitter"

export function CarouselPreview({ slides }: { slides: CarouselSlide[] }) {
  const [urls, setUrls] = useState<string[]>([])
  useEffect(() => {
    const next = slides.map((s) => URL.createObjectURL(s.blob))
    setUrls(next)
    return () => next.forEach((u) => URL.revokeObjectURL(u))
  }, [slides])
  return (
    <div className="flex overflow-x-auto rounded-md border border-border">
      {urls.map((u, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={u} alt={`slide ${i + 1}`} className="h-32 w-auto shrink-0" />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: 构建校验 + 提交**

Run: `bun run build`
Expected: 构建成功(若因未引用报错,合并到 Task 7 验证)。

```bash
git add src/components/carousel/CarouselEditor.tsx src/components/carousel/CarouselPreview.tsx
git commit -m "feat: add carousel konva editor and preview

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: 工作区 `/carousel/workspace`

**Files:**
- Create: `src/app/[locale]/carousel/workspace/page.tsx`
- Create: `src/app/[locale]/carousel/workspace/layout.tsx`
- Create: `src/app/[locale]/carousel/workspace/CarouselWorkspaceClient.tsx`

**Interfaces:**
- Consumes:全部 Task 2–6 产物;`loadImage`(`@/lib/upload-utils`)、`consumePendingCarouselUpload`(Task 3)、`exportCarouselAsZip`/`getCarouselZipFileName`(Task 3)。

> `CarouselWorkspaceClient` 镜像 `src/app/[locale]/grid/workspace/GridWorkspaceClient.tsx`(300 行)的 3 步状态机与下载逻辑(含 iOS 单张保存分支),差异:用 `useCarouselEditor` 替 `useGridEditor`;调 `splitCarousel(image, editor.state, { displayWidth: editor.frameSize.width, displayHeight: editor.frameSize.height }, mimeType)`;Step 2 控件换成 `CarouselCountSelector` + `AspectSelector` + `CarouselEditor` + `CarouselPreview`;打包用 `exportCarouselAsZip`/`getCarouselZipFileName`;pending 用 `consumePendingCarouselUpload`。`layout.tsx` 与 `page.tsx` 镜像 grid 的 workspace 对应文件(metadata noindex、setRequestLocale)。

- [ ] **Step 1: 读 grid workspace 三件套作模板**

Run: `cat "src/app/[locale]/grid/workspace/page.tsx" "src/app/[locale]/grid/workspace/layout.tsx" "src/app/[locale]/grid/workspace/GridWorkspaceClient.tsx"`
Expected: 完整看到模板。

- [ ] **Step 2: 创建 `page.tsx` 与 `layout.tsx`** —— 镜像 grid workspace 的 `page.tsx`/`layout.tsx`,把渲染的 client 组件换成 `CarouselWorkspaceClient`,metadata 标题/路径换成 carousel(workspace 页保持 `robots: { index: false }`,与 grid 一致)。

- [ ] **Step 3: 创建 `CarouselWorkspaceClient.tsx`** —— 按上面「镜像差异」落地完整 300 行级别的客户端组件。核心切割调用:

```tsx
const slides = await splitCarousel(
  image,
  editor.state,
  { displayWidth: editor.frameSize.width, displayHeight: editor.frameSize.height },
  mimeType,
)
```

下载全部:
```tsx
const { exportCarouselAsZip, getCarouselZipFileName } = await import("@/lib/zip-exporter")
const ext = mimeType === "image/jpeg" ? "jpg" : "png"
const zipBlob = await exportCarouselAsZip(slides.map((s) => s.blob), ext)
const url = URL.createObjectURL(zipBlob)
const a = document.createElement("a")
a.href = url; a.download = getCarouselZipFileName(); a.click()
setTimeout(() => URL.revokeObjectURL(url), 1000)
```

- [ ] **Step 4: 手动验证(dev server)**

Run: `bun run dev`,浏览器打开 `http://localhost:3000/carousel/workspace`
Expected:能上传宽图 → 选 2–10 份 + 三种比例 → 画布拖拽/缩放 + 看到分隔线 → 预览横排无缝 → 单张保存与打包下载均生效。

- [ ] **Step 5: 构建校验 + 提交**

Run: `bun run build`
Expected: 成功。

```bash
git add "src/app/[locale]/carousel/workspace/"
git commit -m "feat: add carousel workspace route

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: 落地页 `/carousel` + 工具目录登记

**Files:**
- Create: `src/app/[locale]/carousel/page.tsx`
- Create: `src/app/[locale]/carousel/layout.tsx`
- Create: `src/app/[locale]/carousel/CarouselLandingContent.tsx`
- Modify: `src/lib/tools/catalog.ts`

**Interfaces:**
- Consumes:`CarouselUploadZone`、`setPendingCarouselUpload`(跳转 workspace 前暂存上传)。

> 三件套镜像 `src/app/[locale]/grid/page.tsx`、`layout.tsx`、`GridLandingContent.tsx`。落地页「立即开始」流程:上传 → `setPendingCarouselUpload(file)` → 跳 `/carousel/workspace`(对齐 grid 的 pending 模式)。

- [ ] **Step 1: 读 grid landing 三件套**

Run: `cat "src/app/[locale]/grid/page.tsx" "src/app/[locale]/grid/layout.tsx" "src/app/[locale]/grid/GridLandingContent.tsx"`
Expected: 模板。

- [ ] **Step 2: 创建 carousel 三件套** —— 镜像之,文案 key 用 `carousel.*`,metadata(title/description/canonical/OG)用 carousel 内容,pending 用 `setPendingCarouselUpload`。

- [ ] **Step 3: 在 `src/lib/tools/catalog.ts` 注册 carousel 工具**

在 `CoreToolId` 联合类型加 `| "carousel"`,`CoreToolIcon` 加 `| "carousel"`(或复用 `"grid"` 图标——以现有 icon 渲染实现支持的值为准,先读 icon 渲染处),`labelKey` 加 `| "toolCarousel"`,`descriptionKey` 加 `| "existingToolCarouselDesc"`,并在 `CORE_TOOLS` 数组追加:

```ts
{
  id: "carousel",
  labelKey: "toolCarousel",
  descriptionKey: "existingToolCarouselDesc",
  href: "/carousel",
  quickAccessHref: "/carousel/workspace",
  sitemapPriority: 0.9,
  icon: "carousel",
},
```
> 若 `CoreToolIcon` 新增了 `"carousel"`,需在图标渲染组件(grep `CoreToolIcon` 或 `icon ===` 的 switch)补一个 case;最简做法复用现有 `grid` 图标值,避免改图标组件。实施时先 grep 确认。

- [ ] **Step 4: 构建校验 + 提交**

Run: `bun run build`
Expected: 成功(`/carousel` landing 进入静态生成)。

```bash
git add "src/app/[locale]/carousel/page.tsx" "src/app/[locale]/carousel/layout.tsx" "src/app/[locale]/carousel/CarouselLandingContent.tsx" src/lib/tools/catalog.ts
git commit -m "feat: add carousel landing page and tool catalog entry

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 9: i18n —— carousel UI 文案 + pt-BR locale

**Files:**
- Modify: `src/messages/en.json`、`zh-CN.json`、`ja.json`、`ko.json`、`es.json`(加 `carousel`、`toolCarousel`、`existingToolCarouselDesc` 等键)
- Create: `src/messages/pt-BR.json`(整套,从 en.json 翻译为葡语)
- Modify: `src/i18n/routing.ts`(locales 加 `"pt-BR"`)
- Modify: `src/app/[locale]/[toolSlug]/page.tsx`(OG locale 映射加 `"pt-BR": "pt_BR"`)
- Test: `src/lib/__tests__/i18n-parity.test.ts`(新增:键对齐校验)

**Interfaces:**
- Produces:`carousel.steps.*`、`carousel.count.{label}`、`carousel.aspect.{label,ratio45,ratio11,ratioOriginal}`、`carousel.upload.*`、`carousel.download.*`、`carousel.metadata.{title,description}`、`carousel.hero.*` 等 UI key(以 Task 5–8 实际用到的 `useTranslations` key 为准);顶层 `toolCarousel`、`existingToolCarouselDesc`。

- [ ] **Step 1: 汇总 carousel 用到的全部 i18n key**

Run: `grep -rhoE "useTranslations\(\"[^\"]+\"\)|t\(\"[^\"]+\"\)|t[A-Za-z]+\(\"[^\"]+\"\)" src/components/carousel "src/app/[locale]/carousel" | sort -u`
Expected: 得到 carousel namespace 下所有 key 的清单,作为下面填充依据。

- [ ] **Step 2: 在 `src/messages/en.json` 增加 `carousel` 命名空间与顶层键**(英文基准)

按 Step 1 清单补齐。示例骨架(实际以清单为准,不可缺键):
```json
"carousel": {
  "metadata": { "title": "Free Carousel Splitter for Instagram | ImgSplit", "description": "Split one wide image into 2–10 seamless Instagram carousel slides. 4:5 and 1:1 presets. Free, private, browser-based." },
  "steps": { "upload": "Upload", "adjust": "Adjust", "download": "Download" },
  "count": { "label": "Slides" },
  "aspect": { "label": "Aspect", "ratio45": "4:5", "ratio11": "1:1", "ratioOriginal": "Original" },
  "upload": { "title": "Carousel Splitter", "description": "Upload a wide image to slice into seamless carousel slides." },
  "download": { "generate": "Generate", "zip": "Download All", "reupload": "Re-upload", "readjust": "Adjust" },
  "hero": { "title": "Seamless Instagram Carousel Splitter", "subtitle": "Slice a wide design into 2–10 perfectly aligned slides." }
}
```
并在顶层(与 `toolGrid` 同级)补 `"toolCarousel": "Carousel Splitter"`,在 existing-tools 描述区补 `"existingToolCarouselDesc": "Split a wide image into seamless carousel slides."`(键名与 catalog 的 labelKey/descriptionKey 一致)。

- [ ] **Step 3: 在 `zh-CN/ja/ko/es` 四个 json 补同结构键**(对应语言翻译)。

- [ ] **Step 4: 创建 `src/messages/pt-BR.json`** —— 复制 `en.json` 全文,逐键翻译为巴西葡语(含 carousel 命名空间)。carousel 关键文案对齐目标词:metadata.title 含「Cortar Carrossel」,hero 用「Cortar Carrossel Infinito do Instagram」等。

- [ ] **Step 5: `src/i18n/routing.ts` 加 locale**

```ts
locales: ["en", "zh-CN", "ja", "ko", "es", "pt-BR"],
```

- [ ] **Step 6: `src/app/[locale]/[toolSlug]/page.tsx` OG 映射加 pt-BR**

把 `{ en: "en_US", "zh-CN": "zh_CN", ja: "ja_JP", ko: "ko_KR", es: "es_ES" }` 改为追加 `"pt-BR": "pt_BR"`。

- [ ] **Step 7: 写 i18n 键对齐测试** `src/lib/__tests__/i18n-parity.test.ts`

```ts
import { describe, it, expect } from "vitest"
import en from "@/messages/en.json"
import ptBR from "@/messages/pt-BR.json"

function keyPaths(obj: unknown, prefix = ""): string[] {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
      keyPaths(v, prefix ? `${prefix}.${k}` : k),
    )
  }
  return [prefix]
}

describe("i18n parity", () => {
  it("pt-BR has the same key set as en", () => {
    const enKeys = new Set(keyPaths(en))
    const ptKeys = new Set(keyPaths(ptBR))
    const missing = [...enKeys].filter((k) => !ptKeys.has(k))
    expect(missing).toEqual([])
  })
})
```

- [ ] **Step 8: 运行测试 + 构建 + 提交**

Run: `bun run test src/lib/__tests__/i18n-parity.test.ts && bun run build`
Expected: 测试 PASS(无缺键);构建成功。

```bash
git add src/messages/ src/i18n/routing.ts "src/app/[locale]/[toolSlug]/page.tsx" src/lib/__tests__/i18n-parity.test.ts
git commit -m "feat: add carousel i18n strings and pt-BR locale

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 10: pSEO 落地页内容 `carousel-pages.ts`

**Files:**
- Create: `src/lib/pseo/carousel-pages.ts`
- Modify: `src/lib/pseo/index.ts`(合入 carousel pages + pt-BR 维度)
- Modify: `src/lib/pseo/types.ts`(若 `ToolPageData`/`LocaleKey` 需要,确认 OG locale 注释——通常无需改类型)
- Test: `src/lib/__tests__/pseo-carousel.test.ts`

**Interfaces:**
- Consumes:`ToolPageData`、`ToolCategory`(`@/lib/pseo/types`)
- Produces:`carouselPagesByLocale: Record<string, Record<string, ToolPageData>>`(键含 `en/zh-CN/ja/ko/es/pt-BR`);并在 `pseo/index.ts` 的 `localeData` 合入,使 `getToolPageData(slug, locale)` 与 `getAllToolPageParams()` 覆盖 carousel slug。

> slug 计划(v1):`cortar-carrossel`、`cortar-imagens-carrossel`、`cortar-carrossel-infinito`(仅 pt-BR)、`carousel-splitter`(en/es/ja/ko/zh-CN)、`canva-image-splitter`(en)。`getAllToolPageParams` 只为有内容的 (slug,locale) 生成页,所以「pt-BR 专属 slug 只填 pt-BR」即可。

- [ ] **Step 1: 读 `social-export-pages.ts` 与 `index.ts` 的合入方式作模板**

Run: `cat src/lib/pseo/social-export-pages.ts; sed -n '1,140p' src/lib/pseo/index.ts`
Expected: 看到 `*PagesByLocale` 导出形态、`slugMeta` 注册、`localeData` 合并、`getAllToolPageParams`/`getToolPageData`/`getToolPageLocales` 实现。

- [ ] **Step 2: 创建 `src/lib/pseo/carousel-pages.ts`** —— 导出 `carouselPagesByLocale`,为上述每个 (slug,locale) 提供完整 `ToolPageData`(`slug`/`category: "use-case"`/`seo`/`hero`/`scenarios`(3–4)/`howToSteps`(3)/`faqEntries`/`relatedTools`)。pt-BR 的 FAQ 命中 People Also Ask:

```
- Como recortar um carrossel?
- Como posso cortar um carrossel em partes?
- Qual app cortar carrossel?
- Preciso instalar algo para cortar o carrossel?
```
`relatedTools` 指向 `/grid`、`/collage`、`/social-export`(各 locale 对应文案,参考 social-export-pages 的 relatedTools 写法)。

- [ ] **Step 3: 在 `src/lib/pseo/index.ts` 合入**

- import:`import { carouselPagesByLocale } from "./carousel-pages"`
- 在 `localeData` 每个语言行 spread:`...carouselPagesByLocale.en` 等;并**新增 `"pt-BR"` 行**:`"pt-BR": { ...carouselPagesByLocale["pt-BR"] }`
- 在 `slugMeta` 追加:`{ slug: "carousel-splitter", category: "use-case" }`、`{ slug: "cortar-carrossel", category: "use-case" }`、`{ slug: "cortar-imagens-carrossel", category: "use-case" }`、`{ slug: "cortar-carrossel-infinito", category: "use-case" }`、`{ slug: "canva-image-splitter", category: "use-case" }`
> 确认 `getAllToolPageParams()` 是按「localeData[locale] 是否含该 slug」生成 params;若它依赖 `slugMeta` × 全 locale 笛卡尔积再过滤,需保证仅在有内容处产出(读 Step 1 的实现确认逻辑,必要时按其既有过滤方式对齐)。

- [ ] **Step 4: 写测试** `src/lib/__tests__/pseo-carousel.test.ts`

```ts
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
})
```

- [ ] **Step 5: 运行测试 + 构建 + 提交**

Run: `bun run test src/lib/__tests__/pseo-carousel.test.ts && bun run build`
Expected: 测试 PASS;构建生成 `/pt-BR/cortar-carrossel`、`/carousel-splitter` 等静态页。

```bash
git add src/lib/pseo/ src/lib/__tests__/pseo-carousel.test.ts
git commit -m "feat: add carousel pSEO landing pages with localized slugs

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 11: 全量校验与收尾

**Files:**
- Modify(按需):sitemap 生成器(确认收录 carousel 工具与新 slug)

- [ ] **Step 1: 确认 sitemap 收录机制**

Run: `grep -rinE "sitemap|getAllToolPageParams|CORE_TOOLS" src/app --include=*.ts --include=*.tsx | grep -i sitemap`
Expected: 找到 sitemap 源;确认它遍历 `CORE_TOOLS`(含新 carousel)与 `getAllToolPageParams()`(含新 slug)。若 sitemap 硬编码工具列表,则补加 carousel 条目。

- [ ] **Step 2: 跑全部测试**

Run: `bun run test`
Expected: 全绿(含 grid 回归、carousel 引擎、i18n parity、pseo)。

- [ ] **Step 3: Lint + 构建**

Run: `bun run lint && bun run build`
Expected: 无错误;构建成功。

- [ ] **Step 4: 冒烟手测(dev)**

Run: `bun run dev`,依次访问:
- `/carousel`(en 落地页)
- `/carousel/workspace`(完整切割流程)
- `/pt-BR/cortar-carrossel`(葡语落地页,检查 lang/hreflang/canonical)
- `/carousel-splitter`(en pSEO 页)

Expected: 均正常渲染;切割流程端到端可用。

- [ ] **Step 5: 收尾提交(若 sitemap 有改动)**

```bash
git add -A
git commit -m "chore: ensure sitemap covers carousel tool and slugs

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review 记录

- **Spec coverage**:§3 文件结构 → Task 1/5/6/7/8/10;§4 引擎 → Task 1/2;§5 工作区 → Task 4/5/6/7;§6 pSEO+布线 → Task 8/9/10;§7 测试 → Task 1/2/3/4/9/10/11;§8 验收 → Task 11。全部覆盖。
- **Placeholder scan**:逻辑/数据任务(1–4、9、10)含完整代码与测试;UI 任务(5–8)给出 props 接口、关键新增代码(分隔线、下载、切割调用)+ 明确的「镜像哪个现有文件 + 改什么」,无 "TBD/TODO"。
- **Type consistency**:`CarouselEditorState`/`AspectPreset`/`CarouselSlide`/`splitCarousel` 签名跨 Task 2/4/6/7 一致;`exportCarouselAsZip`/`getCarouselZipFileName`/`consumePendingCarouselUpload` 命名跨 Task 3/7 一致;catalog 的 `toolCarousel`/`existingToolCarouselDesc` 与 Task 9 i18n 键一致。
- **已知需实施时确认点**(已在对应步骤标注):CoreToolIcon 是否需改图标组件(Task 8 Step 3)、`getAllToolPageParams` 的生成逻辑(Task 10 Step 3)、sitemap 收录方式(Task 11 Step 1)。
