# 九宫格切图工具实施计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增独立的 `/grid` 页面，支持微信朋友圈风格的 3×3 / 1×3 / 2×2 网格切图

**Architecture:** 独立路由页面 `app/[locale]/grid/`，使用原生 Canvas API（非 Konva）实现图片裁切。编辑器通过 CSS/DOM 定位图片（拖拽 + 缩放），最终切割时使用 Canvas。核心状态由 `use-grid-editor` hook 管理。

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, next-intl, Canvas API, jszip, vitest

**Spec:** `docs/superpowers/specs/2026-03-15-grid-splitter-design.md`

---

## File Map

### 新增文件

| 文件 | 职责 |
|------|------|
| `src/lib/grid-splitter.ts` | 网格切割核心算法：坐标换算、Canvas 裁切、白边间距 |
| `src/lib/__tests__/grid-splitter.test.ts` | grid-splitter 单元测试 |
| `src/hooks/use-grid-editor.ts` | 编辑器状态管理：gridType、offset、scale、withGap、拖拽/缩放逻辑 |
| `src/hooks/__tests__/use-grid-editor.test.ts` | use-grid-editor hook 单元测试 |
| `src/components/grid/GridTypeSelector.tsx` | 网格类型选择器（3×3 / 1×3 / 2×2） |
| `src/components/grid/GridSteps.tsx` | 顶部三步进度指示器 |
| `src/components/grid/GridEditor.tsx` | 核心编辑器：固定裁切框 + 图片拖拽/缩放 + 网格叠加线 |
| `src/components/grid/GridPreview.tsx` | 切片预览网格 + 下载按钮 |
| `src/components/grid/GridUploadZone.tsx` | Grid 专用上传区（简化版，单张图片） |
| `src/app/[locale]/grid/layout.tsx` | Grid 页面 layout + metadata |
| `src/app/[locale]/grid/page.tsx` | Grid 页面入口（server component，SEO + JSON-LD） |
| `src/app/[locale]/grid/GridPageClient.tsx` | Grid 页面客户端组件，组装所有交互组件 |

### 修改文件

| 文件 | 修改内容 |
|------|---------|
| `src/lib/zip-exporter.ts` | 新增 `exportGridAsZip` 函数 |
| `src/lib/__tests__/zip-exporter.test.ts` | 新增 `exportGridAsZip` 测试 |
| `src/messages/en.json` | 新增 `grid.*` 翻译 key |
| `src/messages/zh-CN.json` | 新增 `grid.*` 翻译 key |
| `src/app/sitemap.ts` | 新增 `/grid` 路由 |
| `src/app/[locale]/page.tsx` | 导航栏新增 Grid/Split 标签，Use Cases 新增 `/grid` 链接 |

---

## Chunk 1: 核心算法层

### Task 1: i18n 翻译

**Files:**
- Modify: `src/messages/en.json`
- Modify: `src/messages/zh-CN.json`

- [ ] **Step 1: 添加英文翻译**

在 `src/messages/en.json` 的 JSON 根对象末尾（`}` 之前）添加 `grid` 命名空间：

```json
"grid": {
  "metadata": {
    "title": "ImgSplit - Free Online Image Grid Splitter",
    "description": "Split images into 3×3, 1×3, or 2×2 grids for WeChat Moments, Instagram, and social media. Free, private, browser-based."
  },
  "steps": {
    "upload": "Upload",
    "adjust": "Adjust",
    "download": "Download"
  },
  "gridType": {
    "3x3": "3×3",
    "1x3": "1×3",
    "2x2": "2×2",
    "label": "Grid Type"
  },
  "gap": {
    "label": "White Border"
  },
  "editor": {
    "dragHint": "Drag to move · Scroll to zoom",
    "pinchHint": "Drag to move · Pinch to zoom"
  },
  "download": {
    "zip": "Download All (ZIP)",
    "readjust": "Readjust",
    "count": "{count} images",
    "tapToSave": "Tap an image to save individually",
    "failed": "Download failed. Please try again.",
    "generating": "Generating..."
  },
  "upload": {
    "title": "Upload Image",
    "dragHint": "Drag an image here",
    "clickHint": "or click to select",
    "formatHint": "PNG / JPG / WebP · Max 20MB"
  },
  "nav": {
    "grid": "Grid",
    "split": "Split"
  }
}
```

- [ ] **Step 2: 添加中文翻译**

在 `src/messages/zh-CN.json` 的 JSON 根对象末尾添加：

```json
"grid": {
  "metadata": {
    "title": "ImgSplit - 免费在线九宫格切图工具",
    "description": "将图片切割为 3×3、1×3 或 2×2 网格，适用于微信朋友圈、小红书等社交平台。免费、隐私安全、纯浏览器处理。"
  },
  "steps": {
    "upload": "上传图片",
    "adjust": "调整裁切",
    "download": "下载结果"
  },
  "gridType": {
    "3x3": "3×3",
    "1x3": "1×3",
    "2x2": "2×2",
    "label": "网格类型"
  },
  "gap": {
    "label": "白边间距"
  },
  "editor": {
    "dragHint": "拖拽移动 · 滚轮缩放",
    "pinchHint": "拖拽移动 · 双指缩放"
  },
  "download": {
    "zip": "下载全部 (ZIP)",
    "readjust": "重新调整",
    "count": "{count} 张图片",
    "tapToSave": "点击单张图片可单独保存",
    "failed": "下载失败，请重试",
    "generating": "生成中..."
  },
  "upload": {
    "title": "上传图片",
    "dragHint": "拖拽图片到此处",
    "clickHint": "或点击选择文件",
    "formatHint": "PNG / JPG / WebP · 单张最大 20MB"
  },
  "nav": {
    "grid": "Grid",
    "split": "Split"
  }
}
```

- [ ] **Step 3: 验证 JSON 合法性**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/messages/en.json','utf8')); JSON.parse(require('fs').readFileSync('src/messages/zh-CN.json','utf8')); console.log('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add src/messages/en.json src/messages/zh-CN.json
git commit -m "feat(grid): add i18n translations for grid splitter"
```

---

### Task 2: 网格切割算法 — grid-splitter.ts

**Files:**
- Create: `src/lib/grid-splitter.ts`
- Create: `src/lib/__tests__/grid-splitter.test.ts`

**Context:** 参考 `src/lib/image-splitter.ts` 中的 `computeScale`、`cropRegion`、`resolveOutputMimeType` 模式。`grid-splitter.ts` 是独立模块，不修改现有 `image-splitter.ts`。

- [ ] **Step 1: 写 grid-splitter 测试**

创建 `src/lib/__tests__/grid-splitter.test.ts`，遵循 `image-splitter.test.ts` 的 mock 模式：

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest"
import { splitGrid, getGridConfig } from "../grid-splitter"
import type { GridType } from "../grid-splitter"

function createMockImage(width: number, height: number): HTMLImageElement {
  return {
    naturalWidth: width,
    naturalHeight: height,
    width,
    height,
    complete: true,
  } as unknown as HTMLImageElement
}

function createMockCanvas() {
  const ctx = {
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: "",
  }
  const canvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => ctx),
    toBlob: vi.fn((cb: BlobCallback, type?: string) => {
      cb(new Blob(["test"], { type: type || "image/png" }))
    }),
  }
  return { canvas, ctx }
}

describe("getGridConfig", () => {
  it("should return 3 rows, 3 cols for 3x3", () => {
    expect(getGridConfig("3x3")).toEqual({ rows: 3, cols: 3, aspectRatio: 1 })
  })

  it("should return 1 row, 3 cols for 1x3", () => {
    expect(getGridConfig("1x3")).toEqual({ rows: 1, cols: 3, aspectRatio: 3 })
  })

  it("should return 2 rows, 2 cols for 2x2", () => {
    expect(getGridConfig("2x2")).toEqual({ rows: 2, cols: 2, aspectRatio: 1 })
  })
})

describe("splitGrid", () => {
  beforeEach(() => {
    const { canvas } = createMockCanvas()
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") return canvas as unknown as HTMLCanvasElement
      return document.createElement(tag)
    })
  })

  it("should produce 9 blobs for 3x3 grid", async () => {
    const image = createMockImage(900, 900)
    const results = await splitGrid(image, {
      gridType: "3x3",
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      withGap: false,
    }, { displayWidth: 300, displayHeight: 300 }, "image/png")

    expect(results).toHaveLength(9)
  })

  it("should produce 3 blobs for 1x3 grid", async () => {
    const image = createMockImage(900, 300)
    const results = await splitGrid(image, {
      gridType: "1x3",
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      withGap: false,
    }, { displayWidth: 300, displayHeight: 100 }, "image/png")

    expect(results).toHaveLength(3)
  })

  it("should produce 4 blobs for 2x2 grid", async () => {
    const image = createMockImage(600, 600)
    const results = await splitGrid(image, {
      gridType: "2x2",
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      withGap: false,
    }, { displayWidth: 300, displayHeight: 300 }, "image/png")

    expect(results).toHaveLength(4)
  })

  it("should preserve JPEG mime type", async () => {
    const image = createMockImage(900, 900)
    const results = await splitGrid(image, {
      gridType: "3x3",
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      withGap: false,
    }, { displayWidth: 300, displayHeight: 300 }, "image/jpeg")

    expect(results[0].blob.type).toBe("image/jpeg")
  })

  it("should convert WebP to PNG", async () => {
    const image = createMockImage(900, 900)
    const results = await splitGrid(image, {
      gridType: "3x3",
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      withGap: false,
    }, { displayWidth: 300, displayHeight: 300 }, "image/webp")

    expect(results[0].blob.type).toBe("image/png")
  })

  it("should number blobs sequentially (left-to-right, top-to-bottom)", async () => {
    const image = createMockImage(600, 600)
    const results = await splitGrid(image, {
      gridType: "2x2",
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      withGap: false,
    }, { displayWidth: 300, displayHeight: 300 }, "image/png")

    expect(results[0].index).toBe(1)
    expect(results[1].index).toBe(2)
    expect(results[2].index).toBe(3)
    expect(results[3].index).toBe(4)
  })
})
```

- [ ] **Step 2: 运行测试验证失败**

Run: `bunx vitest run src/lib/__tests__/grid-splitter.test.ts`
Expected: FAIL — module `../grid-splitter` not found

- [ ] **Step 3: 实现 grid-splitter.ts**

创建 `src/lib/grid-splitter.ts`：

```typescript
const JPEG_QUALITY = 0.92
const MAX_CANVAS_AREA = 16_777_216
const MAX_CANVAS_DIMENSION = 16_384

export type GridType = "3x3" | "1x3" | "2x2"

export interface GridEditorState {
  gridType: GridType
  offsetX: number
  offsetY: number
  scale: number
  withGap: boolean
}

export interface GridSplitResult {
  index: number
  blob: Blob
  width: number
  height: number
}

interface DisplaySize {
  displayWidth: number
  displayHeight: number
}

export function getGridConfig(gridType: GridType): {
  rows: number
  cols: number
  aspectRatio: number
} {
  switch (gridType) {
    case "3x3":
      return { rows: 3, cols: 3, aspectRatio: 1 }
    case "1x3":
      return { rows: 1, cols: 3, aspectRatio: 3 }
    case "2x2":
      return { rows: 2, cols: 2, aspectRatio: 1 }
  }
}

function resolveOutputMimeType(originalMimeType: string): string {
  if (originalMimeType === "image/webp") return "image/png"
  if (
    originalMimeType === "image/jpeg" ||
    originalMimeType === "image/png"
  )
    return originalMimeType
  return "image/png"
}

function computeScale(w: number, h: number): number {
  let scale = 1
  if (w * h > MAX_CANVAS_AREA) {
    scale = Math.sqrt(MAX_CANVAS_AREA / (w * h))
  }
  if (w * scale > MAX_CANVAS_DIMENSION) {
    scale = MAX_CANVAS_DIMENSION / w
  }
  if (h * scale > MAX_CANVAS_DIMENSION) {
    scale = MAX_CANVAS_DIMENSION / h
  }
  return scale
}

function cropCell(
  image: HTMLImageElement,
  srcX: number,
  srcY: number,
  srcW: number,
  srcH: number,
  withGap: boolean,
  mimeType: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const scale = computeScale(srcW, srcH)
    const canvas = document.createElement("canvas")
    const cellW = Math.round(srcW * scale)
    const cellH = Math.round(srcH * scale)
    canvas.width = cellW
    canvas.height = cellH

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      reject(new Error("Failed to get canvas 2d context"))
      return
    }

    if (withGap) {
      // Fill white background first
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, cellW, cellH)
      // Draw image into 94% center area (3% margin each side)
      const margin = 0.03
      const insetX = Math.round(cellW * margin)
      const insetY = Math.round(cellH * margin)
      const innerW = cellW - insetX * 2
      const innerH = cellH - insetY * 2
      ctx.drawImage(image, srcX, srcY, srcW, srcH, insetX, insetY, innerW, innerH)
    } else {
      ctx.drawImage(image, srcX, srcY, srcW, srcH, 0, 0, cellW, cellH)
    }

    const quality = mimeType === "image/jpeg" ? JPEG_QUALITY : undefined
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }
        reject(new Error("Failed to create blob from canvas"))
      },
      mimeType,
      quality
    )
  })
}

export async function splitGrid(
  image: HTMLImageElement,
  state: GridEditorState,
  displaySize: DisplaySize,
  originalMimeType: string
): Promise<GridSplitResult[]> {
  const mimeType = resolveOutputMimeType(originalMimeType)
  const { rows, cols } = getGridConfig(state.gridType)

  // Convert display coordinates to source image coordinates
  const scaleRatio = image.naturalWidth / (displaySize.displayWidth * state.scale)
  const srcX = -state.offsetX * scaleRatio
  const srcY = -state.offsetY * scaleRatio
  const srcW = displaySize.displayWidth * scaleRatio
  const srcH = displaySize.displayHeight * scaleRatio

  const cellW = srcW / cols
  const cellH = srcH / rows

  const results: GridSplitResult[] = []
  let index = 1

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const blob = await cropCell(
        image,
        srcX + c * cellW,
        srcY + r * cellH,
        cellW,
        cellH,
        state.withGap,
        mimeType
      )
      results.push({
        index,
        blob,
        width: Math.round(cellW),
        height: Math.round(cellH),
      })
      index++
    }
  }

  return results
}
```

- [ ] **Step 4: 运行测试验证通过**

Run: `bunx vitest run src/lib/__tests__/grid-splitter.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/grid-splitter.ts src/lib/__tests__/grid-splitter.test.ts
git commit -m "feat(grid): add grid splitter algorithm with tests"
```

---

### Task 3: ZIP 导出扩展 — exportGridAsZip

**Files:**
- Modify: `src/lib/zip-exporter.ts`
- Modify: `src/lib/__tests__/zip-exporter.test.ts`

- [ ] **Step 1: 添加 exportGridAsZip 测试**

在 `src/lib/__tests__/zip-exporter.test.ts` 末尾添加：

```typescript
import { exportGridAsZip, getGridZipFileName } from "../zip-exporter"

describe("exportGridAsZip", () => {
  it("should create ZIP with sequential naming", async () => {
    const blobs = [
      new Blob(["1"], { type: "image/png" }),
      new Blob(["2"], { type: "image/png" }),
      new Blob(["3"], { type: "image/png" }),
    ]

    const zipBlob = await exportGridAsZip(blobs, "jpg")
    expect(zipBlob).toBeInstanceOf(Blob)
    expect(zipBlob.type).toBe("application/zip")

    const JSZip = (await import("jszip")).default
    const zip = await JSZip.loadAsync(zipBlob)
    const fileNames = Object.keys(zip.files)

    expect(fileNames).toEqual(["grid-1.jpg", "grid-2.jpg", "grid-3.jpg"])
  })

  it("should handle 9 files for 3x3 grid", async () => {
    const blobs = Array.from({ length: 9 }, (_, i) =>
      new Blob([String(i)], { type: "image/jpeg" })
    )

    const zipBlob = await exportGridAsZip(blobs, "jpg")
    const JSZip = (await import("jszip")).default
    const zip = await JSZip.loadAsync(zipBlob)
    const fileNames = Object.keys(zip.files)

    expect(fileNames).toHaveLength(9)
    expect(fileNames[0]).toBe("grid-1.jpg")
    expect(fileNames[8]).toBe("grid-9.jpg")
  })
})

describe("getGridZipFileName", () => {
  it("should return grid_split.zip", () => {
    expect(getGridZipFileName()).toBe("grid_split.zip")
  })
})
```

- [ ] **Step 2: 运行测试验证失败**

Run: `bunx vitest run src/lib/__tests__/zip-exporter.test.ts`
Expected: FAIL — `exportGridAsZip` not found

- [ ] **Step 3: 在 zip-exporter.ts 中添加 exportGridAsZip**

在 `src/lib/zip-exporter.ts` 末尾添加：

```typescript
export async function exportGridAsZip(
  blobs: Blob[],
  fileExtension: string
): Promise<Blob> {
  const { default: JSZip } = await import("jszip")
  const zip = new JSZip()

  for (let i = 0; i < blobs.length; i++) {
    zip.file(`grid-${i + 1}.${fileExtension}`, blobs[i])
  }

  return zip.generateAsync({ type: "blob", mimeType: "application/zip" })
}

export function getGridZipFileName(): string {
  return "grid_split.zip"
}
```

- [ ] **Step 4: 运行测试验证通过**

Run: `bunx vitest run src/lib/__tests__/zip-exporter.test.ts`
Expected: All tests PASS（包括现有测试和新增测试）

- [ ] **Step 5: Commit**

```bash
git add src/lib/zip-exporter.ts src/lib/__tests__/zip-exporter.test.ts
git commit -m "feat(grid): add exportGridAsZip to zip-exporter"
```

---

## Chunk 2: Hook 与 UI 组件

### Task 4: use-grid-editor hook

**Files:**
- Create: `src/hooks/use-grid-editor.ts`
- Create: `src/hooks/__tests__/use-grid-editor.test.ts`

**Context:** 参考 `src/hooks/use-canvas-viewport.ts` 的缩放/平移模式。此 hook 管理 gridType、offset、scale、withGap 状态，提供事件处理函数。

- [ ] **Step 1: 写 hook 测试**

创建 `src/hooks/__tests__/use-grid-editor.test.ts`：

```typescript
import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useGridEditor } from "../use-grid-editor"

describe("useGridEditor", () => {
  const defaultImageSize = { width: 1000, height: 600 }
  const defaultContainerSize = { width: 400, height: 400 }

  it("should initialize with 3x3 grid type", () => {
    const { result } = renderHook(() =>
      useGridEditor(defaultImageSize, defaultContainerSize)
    )
    expect(result.current.state.gridType).toBe("3x3")
  })

  it("should initialize withGap as false", () => {
    const { result } = renderHook(() =>
      useGridEditor(defaultImageSize, defaultContainerSize)
    )
    expect(result.current.state.withGap).toBe(false)
  })

  it("should toggle withGap", () => {
    const { result } = renderHook(() =>
      useGridEditor(defaultImageSize, defaultContainerSize)
    )
    act(() => result.current.setWithGap(true))
    expect(result.current.state.withGap).toBe(true)
    act(() => result.current.setWithGap(false))
    expect(result.current.state.withGap).toBe(false)
  })

  it("should change grid type", () => {
    const { result } = renderHook(() =>
      useGridEditor(defaultImageSize, defaultContainerSize)
    )
    act(() => result.current.setGridType("1x3"))
    expect(result.current.state.gridType).toBe("1x3")
  })

  it("should auto-reset scale to fill crop frame via useEffect", async () => {
    const { result } = renderHook(() =>
      useGridEditor(
        { width: 1000, height: 600 },
        { width: 400, height: 400 }
      )
    )
    // useEffect triggers resetToFit, setting scale = max(400/1000, 400/600) = 400/600 ≈ 0.667
    await act(async () => {})
    expect(result.current.state.scale).toBeCloseTo(400 / 600, 2)
  })

  it("should compute crop frame dimensions", () => {
    const { result } = renderHook(() =>
      useGridEditor(defaultImageSize, defaultContainerSize)
    )
    // 3x3 → 1:1 aspect, should fit within container
    expect(result.current.frameSize.width).toBeLessThanOrEqual(400)
    expect(result.current.frameSize.height).toBeLessThanOrEqual(400)
    expect(result.current.frameSize.width).toBe(result.current.frameSize.height)
  })

  it("should compute wide frame for 1x3 grid", async () => {
    const { result } = renderHook(() =>
      useGridEditor(defaultImageSize, defaultContainerSize)
    )
    await act(async () => result.current.setGridType("1x3"))
    // 1x3 → 3:1 aspect ratio, allow ±1px for rounding
    const { width, height } = result.current.frameSize
    expect(Math.abs(width - height * 3)).toBeLessThanOrEqual(1)
  })
})
```

- [ ] **Step 2: 运行测试验证失败**

Run: `bunx vitest run src/hooks/__tests__/use-grid-editor.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: 实现 use-grid-editor hook**

创建 `src/hooks/use-grid-editor.ts`：

```typescript
"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { getGridConfig, type GridType, type GridEditorState } from "@/lib/grid-splitter"

interface ImageSize {
  width: number
  height: number
}

interface FrameSize {
  width: number
  height: number
}

export function useGridEditor(
  imageSize: ImageSize,
  containerSize: ImageSize
) {
  const [gridType, setGridTypeState] = useState<GridType>("3x3")
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScaleState] = useState(1)
  const [withGap, setWithGap] = useState(false)

  // Calculate frame size based on grid type and container
  const frameSize = useMemo<FrameSize>(() => {
    const { aspectRatio } = getGridConfig(gridType)
    const maxW = containerSize.width
    const maxH = containerSize.height

    let w: number, h: number
    if (aspectRatio >= 1) {
      // Wide or square frame
      w = maxW
      h = maxW / aspectRatio
      if (h > maxH) {
        h = maxH
        w = maxH * aspectRatio
      }
    } else {
      // Tall frame
      h = maxH
      w = maxH * aspectRatio
      if (w > maxW) {
        w = maxW
        h = maxW / aspectRatio
      }
    }
    return { width: Math.round(w), height: Math.round(h) }
  }, [gridType, containerSize.width, containerSize.height])

  // Calculate min/max scale
  const scaleRange = useMemo(() => {
    const scaleToFillW = frameSize.width / imageSize.width
    const scaleToFillH = frameSize.height / imageSize.height
    const minScale = Math.max(scaleToFillW, scaleToFillH)
    const maxScale = Math.max(minScale, 3)
    return { minScale, maxScale }
  }, [frameSize, imageSize])

  // Clamp offset so image always covers the frame
  const clampOffset = useCallback(
    (ox: number, oy: number, s: number) => {
      const scaledW = imageSize.width * s
      const scaledH = imageSize.height * s
      const clampedX = Math.min(0, Math.max(frameSize.width - scaledW, ox))
      const clampedY = Math.min(0, Math.max(frameSize.height - scaledH, oy))
      return { x: clampedX, y: clampedY }
    },
    [imageSize, frameSize]
  )

  // Reset scale and offset to fit the image centered in frame
  const resetToFit = useCallback(() => {
    const { minScale } = scaleRange
    setScaleState(minScale)
    const scaledW = imageSize.width * minScale
    const scaledH = imageSize.height * minScale
    setOffsetX((frameSize.width - scaledW) / 2)
    setOffsetY((frameSize.height - scaledH) / 2)
  }, [scaleRange, imageSize, frameSize])

  // Auto-reset when gridType or image changes
  const setGridType = useCallback(
    (type: GridType) => {
      setGridTypeState(type)
    },
    []
  )

  // Reset to fit whenever frameSize changes (which depends on gridType)
  useEffect(() => {
    if (imageSize.width > 1) {
      resetToFit()
    }
  }, [frameSize.width, frameSize.height]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDrag = useCallback(
    (deltaX: number, deltaY: number) => {
      const clamped = clampOffset(offsetX + deltaX, offsetY + deltaY, scale)
      setOffsetX(clamped.x)
      setOffsetY(clamped.y)
    },
    [clampOffset, scale, offsetX, offsetY]
  )

  const handleZoom = useCallback(
    (delta: number, centerX: number, centerY: number) => {
      const { minScale, maxScale } = scaleRange
      const factor = delta > 0 ? 0.9 : 1.1
      const newScale = Math.min(maxScale, Math.max(minScale, scale * factor))
      if (newScale === scale) return

      // Zoom toward the cursor position
      const ratio = newScale / scale
      const newOffsetX = centerX - (centerX - offsetX) * ratio
      const newOffsetY = centerY - (centerY - offsetY) * ratio
      const clamped = clampOffset(newOffsetX, newOffsetY, newScale)

      setScaleState(newScale)
      setOffsetX(clamped.x)
      setOffsetY(clamped.y)
    },
    [scale, offsetX, offsetY, scaleRange, clampOffset]
  )

  const state: GridEditorState = {
    gridType,
    offsetX,
    offsetY,
    scale,
    withGap,
  }

  return {
    state,
    frameSize,
    scaleRange,
    setGridType,
    setWithGap,
    handleDrag,
    handleZoom,
    resetToFit,
  }
}
```

- [ ] **Step 4: 运行测试验证通过**

Run: `bunx vitest run src/hooks/__tests__/use-grid-editor.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/use-grid-editor.ts src/hooks/__tests__/use-grid-editor.test.ts
git commit -m "feat(grid): add use-grid-editor hook with tests"
```

---

### Task 5: Grid UI 组件 — GridSteps, GridTypeSelector, GridUploadZone

**Files:**
- Create: `src/components/grid/GridSteps.tsx`
- Create: `src/components/grid/GridTypeSelector.tsx`
- Create: `src/components/grid/GridUploadZone.tsx`

这三个组件都比较简单，放在一个 task 中。

- [ ] **Step 1: 创建 GridSteps 组件**

创建 `src/components/grid/GridSteps.tsx`：

```typescript
"use client"

import { useTranslations } from "next-intl"
import { CheckCircle2 } from "lucide-react"

interface GridStepsProps {
  currentStep: 1 | 2 | 3
}

export function GridSteps({ currentStep }: GridStepsProps) {
  const t = useTranslations("grid.steps")

  const steps = [
    { key: 1 as const, label: t("upload") },
    { key: 2 as const, label: t("adjust") },
    { key: 3 as const, label: t("download") },
  ]

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 py-4 md:py-6">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            {step.key < currentStep ? (
              <div className="w-6 h-6 bg-[#1A1A1A] flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#F9F8F6]" strokeWidth={1.5} />
              </div>
            ) : (
              <div
                className={`w-6 h-6 flex items-center justify-center text-[11px] font-medium ${
                  step.key === currentStep
                    ? "bg-[#D4AF37] text-[#F9F8F6]"
                    : "bg-[#EBE5DE] text-[#6C6863]"
                }`}
              >
                {step.key}
              </div>
            )}
            <span
              className={`text-xs uppercase tracking-[0.15em] ${
                step.key === currentStep
                  ? "text-[#1A1A1A] font-medium"
                  : "text-[#6C6863]"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`hidden md:block w-8 h-px ${
                step.key < currentStep ? "bg-[#1A1A1A]" : "bg-[#EBE5DE]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: 创建 GridTypeSelector 组件**

创建 `src/components/grid/GridTypeSelector.tsx`：

```typescript
"use client"

import { useTranslations } from "next-intl"
import type { GridType } from "@/lib/grid-splitter"

interface GridTypeSelectorProps {
  value: GridType
  onChange: (type: GridType) => void
  withGap: boolean
  onGapChange: (v: boolean) => void
  layout?: "vertical" | "horizontal"
}

const GRID_OPTIONS: { type: GridType; rows: number; cols: number }[] = [
  { type: "3x3", rows: 3, cols: 3 },
  { type: "1x3", rows: 1, cols: 3 },
  { type: "2x2", rows: 2, cols: 2 },
]

function GridIcon({ rows, cols }: { rows: number; cols: number }) {
  const cells = Array.from({ length: rows * cols })
  return (
    <div
      className="grid gap-[1px]"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: cols >= rows ? 20 : Math.round(20 * (cols / rows)),
        height: rows >= cols ? 20 : Math.round(20 * (rows / cols)),
      }}
    >
      {cells.map((_, i) => (
        <div key={i} className="bg-current" />
      ))}
    </div>
  )
}

export function GridTypeSelector({
  value,
  onChange,
  withGap,
  onGapChange,
  layout = "vertical",
}: GridTypeSelectorProps) {
  const t = useTranslations("grid")

  const isHorizontal = layout === "horizontal"

  return (
    <div className={isHorizontal ? "flex items-center gap-2 overflow-x-auto" : ""}>
      {!isHorizontal && (
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#6C6863] mb-3">
          {t("gridType.label")}
        </div>
      )}
      <div className={`flex ${isHorizontal ? "gap-2" : "flex-col gap-2 mb-6"}`}>
        {GRID_OPTIONS.map((opt) => (
          <button
            key={opt.type}
            onClick={() => onChange(opt.type)}
            className={`flex items-center gap-2.5 px-3 py-2.5 transition-colors duration-300 flex-shrink-0 ${
              value === opt.type
                ? "bg-[#1A1A1A] text-[#F9F8F6]"
                : "border border-[#EBE5DE] text-[#6C6863] hover:border-[#1A1A1A]/30"
            }`}
          >
            <GridIcon rows={opt.rows} cols={opt.cols} />
            <span className="text-xs tracking-[0.1em]">
              {t(`gridType.${opt.type}`)}
            </span>
          </button>
        ))}
      </div>

      {!isHorizontal && (
        <>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#6C6863] mb-3">
            {t("gap.label")}
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs text-[#1A1A1A]">{t("gap.label")}</span>
            <button
              role="switch"
              aria-checked={withGap}
              onClick={() => onGapChange(!withGap)}
              className={`relative w-9 h-5 transition-colors duration-300 ${
                withGap ? "bg-[#D4AF37]" : "bg-[#EBE5DE]"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-transform duration-300 ${
                  withGap ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>
        </>
      )}

      {isHorizontal && (
        <button
          onClick={() => onGapChange(!withGap)}
          className={`flex items-center gap-2 px-3 py-2.5 flex-shrink-0 transition-colors duration-300 ${
            withGap
              ? "bg-[#D4AF37] text-[#F9F8F6]"
              : "border border-[#EBE5DE] text-[#6C6863] hover:border-[#1A1A1A]/30"
          }`}
        >
          <span className="text-xs tracking-[0.1em]">{t("gap.label")}</span>
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 3: 创建 GridUploadZone 组件**

创建 `src/components/grid/GridUploadZone.tsx`：

```typescript
"use client"

import { useCallback, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { validateFiles, loadImage, ACCEPTED_TYPES } from "@/lib/upload-utils"

interface GridUploadZoneProps {
  onImageLoaded: (image: HTMLImageElement, file: File) => void
}

export function GridUploadZone({ onImageLoaded }: GridUploadZoneProps) {
  const t = useTranslations("grid.upload")
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const tUpload = useTranslations("upload")

  const processFile = useCallback(
    async (files: FileList) => {
      setError(null)
      const file = files[0]
      if (!file) return

      const result = validateFiles([file])
      if (!result.valid) {
        setError(tUpload(result.error!.key, result.error!.params))
        return
      }

      try {
        const image = await loadImage(result.files[0])
        onImageLoaded(image, result.files[0])
      } catch {
        setError(tUpload("loadFailed"))
      }
    },
    [onImageLoaded, tUpload]
  )

  return (
    <div
      className={`flex flex-col items-center justify-center border-t border-b p-16 md:p-24 transition-all duration-700 cursor-pointer ${
        isDragOver
          ? "border-[#D4AF37] bg-[#D4AF37]/5"
          : "border-[#1A1A1A]/20 hover:border-[#1A1A1A]/40"
      }`}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        if (e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files)
      }}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false) }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) processFile(e.target.files)
          if (inputRef.current) inputRef.current.value = ""
        }}
      />
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#6C6863] mb-6">
          {t("title")}
        </p>
        <p className="font-serif text-2xl md:text-3xl text-[#1A1A1A] mb-4">
          {t("dragHint")}
        </p>
        <p className="text-sm text-[#1A1A1A] hover:text-[#D4AF37] transition-colors duration-500">
          {t("clickHint")}
        </p>
        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-[#6C6863]/70">
          {t("formatHint")}
        </p>
      </div>
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/grid/GridSteps.tsx src/components/grid/GridTypeSelector.tsx src/components/grid/GridUploadZone.tsx
git commit -m "feat(grid): add GridSteps, GridTypeSelector, GridUploadZone components"
```

---

### Task 6: GridEditor 核心编辑器组件

**Files:**
- Create: `src/components/grid/GridEditor.tsx`

**Context:** 这是最核心的交互组件。使用 CSS/DOM 实现图片定位（不使用 Konva），固定裁切框叠加网格线，支持鼠标拖拽 + 滚轮缩放 + 触控手势。

- [ ] **Step 1: 创建 GridEditor 组件**

创建 `src/components/grid/GridEditor.tsx`：

```typescript
"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import type { GridType } from "@/lib/grid-splitter"
import { getGridConfig } from "@/lib/grid-splitter"

interface GridEditorProps {
  image: HTMLImageElement
  imageUrl: string
  gridType: GridType
  offsetX: number
  offsetY: number
  scale: number
  frameWidth: number
  frameHeight: number
  onDrag: (deltaX: number, deltaY: number) => void
  onZoom: (delta: number, centerX: number, centerY: number) => void
}

export function GridEditor({
  image,
  imageUrl,
  gridType,
  offsetX,
  offsetY,
  scale,
  frameWidth,
  frameHeight,
  onDrag,
  onZoom,
}: GridEditorProps) {
  const t = useTranslations("grid.editor")
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const lastTouchDist = useRef<number | null>(null)

  // Mouse drag
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      lastPos.current = { x: e.clientX, y: e.clientY }
      onDrag(dx, dy)
    },
    [onDrag]
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  // Wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const centerX = e.clientX - rect.left
      const centerY = e.clientY - rect.top
      onZoom(e.deltaY, centerX, centerY)
    },
    [onZoom]
  )

  // Touch pinch zoom
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        if (lastTouchDist.current !== null) {
          const delta = lastTouchDist.current - dist
          const rect = containerRef.current?.getBoundingClientRect()
          if (rect) {
            const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left
            const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top
            onZoom(delta, cx, cy)
          }
        }
        lastTouchDist.current = dist
      }
    },
    [onZoom]
  )

  const handleTouchEnd = useCallback(() => {
    lastTouchDist.current = null
  }, [])

  const { rows, cols } = getGridConfig(gridType)
  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#EBE5DE]/50 p-4 md:p-6 min-h-[280px] relative">
      {/* Crop frame */}
      <div
        ref={containerRef}
        className="relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.15)] cursor-grab active:cursor-grabbing"
        style={{ width: frameWidth, height: frameHeight }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image layer */}
        <img
          src={imageUrl}
          alt=""
          draggable={false}
          className="absolute pointer-events-none select-none"
          style={{
            width: image.naturalWidth * scale,
            height: image.naturalHeight * scale,
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            willChange: "transform",
          }}
        />

        {/* Grid overlay lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {Array.from({ length: rows * cols }).map((_, i) => {
            const r = Math.floor(i / cols)
            const c = i % cols
            return (
              <div
                key={i}
                style={{
                  borderRight: c < cols - 1 ? "1px solid rgba(255,255,255,0.5)" : "none",
                  borderBottom: r < rows - 1 ? "1px solid rgba(255,255,255,0.5)" : "none",
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Hint text */}
      <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-[#6C6863]">
        {isTouchDevice ? t("pinchHint") : t("dragHint")}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/grid/GridEditor.tsx
git commit -m "feat(grid): add GridEditor component with drag/zoom interaction"
```

---

### Task 7: GridPreview 组件

**Files:**
- Create: `src/components/grid/GridPreview.tsx`

- [ ] **Step 1: 创建 GridPreview 组件**

创建 `src/components/grid/GridPreview.tsx`：

```typescript
"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import type { GridType, GridEditorState, GridSplitResult } from "@/lib/grid-splitter"
import { splitGrid, getGridConfig } from "@/lib/grid-splitter"
import { exportGridAsZip, getGridZipFileName } from "@/lib/zip-exporter"

interface GridPreviewProps {
  image: HTMLImageElement
  mimeType: string
  state: GridEditorState
  frameWidth: number
  frameHeight: number
  onShowResults: (results: GridSplitResult[]) => void
}

export function GridPreview({
  image,
  mimeType,
  state,
  frameWidth,
  frameHeight,
  onShowResults,
}: GridPreviewProps) {
  const t = useTranslations("grid.download")
  const [isGenerating, setIsGenerating] = useState(false)

  const { rows, cols } = getGridConfig(state.gridType)

  const handleDownload = useCallback(async () => {
    setIsGenerating(true)
    try {
      const results = await splitGrid(
        image,
        state,
        { displayWidth: frameWidth, displayHeight: frameHeight },
        mimeType
      )
      onShowResults(results)

      const ext = mimeType === "image/jpeg" ? "jpg" : "png"
      const zipBlob = await exportGridAsZip(
        results.map((r) => r.blob),
        ext
      )

      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = getGridZipFileName()
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error(t("failed"))
    } finally {
      setIsGenerating(false)
    }
  }, [image, state, frameWidth, frameHeight, mimeType, onShowResults, t])

  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#6C6863] mb-3">
        {t("count", { count: rows * cols })}
      </div>

      {/* Preview grid (placeholder cells) */}
      <div
        className="grid gap-[2px] mb-6"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-[#EBE5DE] flex items-center justify-center"
          >
            <span className="text-[10px] text-[#6C6863]/50">{i + 1}</span>
          </div>
        ))}
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full py-3 bg-[#1A1A1A] text-[#F9F8F6] text-xs uppercase tracking-[0.15em] hover:bg-[#D4AF37] transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? t("generating") : t("zip")}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/grid/GridPreview.tsx
git commit -m "feat(grid): add GridPreview component with download logic"
```

---

## Chunk 3: 页面组装与集成

### Task 8: Grid 页面路由

**Files:**
- Create: `src/app/[locale]/grid/layout.tsx`
- Create: `src/app/[locale]/grid/page.tsx`

- [ ] **Step 1: 创建 Grid layout**

创建 `src/app/[locale]/grid/layout.tsx`：

```typescript
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "grid.metadata" })

  const path = "/grid"
  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}${path}`
      : `${BASE_URL}/${locale}${path}`

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? `${BASE_URL}${path}`
            : `${BASE_URL}/${l}${path}`,
        ])
      ),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonicalUrl,
      siteName: "ImgSplit",
      type: "website",
    },
  }
}

export default function GridLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

- [ ] **Step 2: 创建 Grid page（Server Component — SEO + JSON-LD）**

创建 `src/app/[locale]/grid/page.tsx`，遵循落地页模式（server component 渲染 JSON-LD + 委托给 client component）：

```typescript
import { getTranslations, setRequestLocale } from "next-intl/server"
import { JsonLd } from "@/components/JsonLd"
import { GridPageClient } from "./GridPageClient"

export default async function GridPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("grid")

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ImgSplit Grid",
          url: "https://imgsplit.com/grid",
          description: t("metadata.description"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <GridPageClient />
    </>
  )
}
```

- [ ] **Step 3: 创建 GridPageClient（Client Component — 交互逻辑）**

创建 `src/app/[locale]/grid/GridPageClient.tsx`：

```typescript
"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { LogoIcon } from "@/components/LogoIcon"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { GridSteps } from "@/components/grid/GridSteps"
import { GridUploadZone } from "@/components/grid/GridUploadZone"
import { GridTypeSelector } from "@/components/grid/GridTypeSelector"
import { GridEditor } from "@/components/grid/GridEditor"
import { GridPreview } from "@/components/grid/GridPreview"
import { useGridEditor } from "@/hooks/use-grid-editor"
import { getGridConfig } from "@/lib/grid-splitter"
import type { GridSplitResult } from "@/lib/grid-splitter"

type Step = 1 | 2 | 3

export function GridPageClient() {
  const tNav = useTranslations("grid.nav")
  const tDownload = useTranslations("grid.download")

  const [step, setStep] = useState<Step>(1)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [mimeType, setMimeType] = useState<string>("image/png")
  const [results, setResults] = useState<GridSplitResult[] | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400 })

  const editor = useGridEditor(
    image ? { width: image.naturalWidth, height: image.naturalHeight } : { width: 1, height: 1 },
    containerSize
  )

  const handleImageLoaded = useCallback((img: HTMLImageElement, file: File) => {
    const url = URL.createObjectURL(file)
    setImage(img)
    setImageUrl(url)
    setMimeType(file.type)
    setStep(2)
    requestAnimationFrame(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({
          width: Math.min(rect.width - 48, 600),
          height: Math.min(rect.height - 48, 600),
        })
      }
    })
  }, [])

  const handleShowResults = useCallback((r: GridSplitResult[]) => {
    setResults(r)
    setStep(3)
  }, [])

  const handleReadjust = useCallback(() => {
    setResults(null)
    setStep(2)
  }, [])

  // Pre-compute result preview URLs, memoized to avoid re-creating on every render
  const resultUrls = useMemo(() => {
    if (!results) return []
    return results.map((r) => URL.createObjectURL(r.blob))
  }, [results])

  // Cleanup object URLs when results change
  useEffect(() => {
    return () => {
      resultUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [resultUrls])

  const handleSaveSingle = useCallback(
    (result: GridSplitResult) => {
      const ext = mimeType === "image/jpeg" ? "jpg" : "png"
      const url = URL.createObjectURL(result.blob)

      // iOS Safari doesn't support <a download> — open in new tab instead
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      if (isIOS) {
        window.open(url, "_blank")
      } else {
        const a = document.createElement("a")
        a.href = url
        a.download = `grid-${result.index}.${ext}`
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
    },
    [mimeType]
  )

  const handleDownloadAll = useCallback(async () => {
    if (!results) return
    const { exportGridAsZip, getGridZipFileName } = await import("@/lib/zip-exporter")
    const ext = mimeType === "image/jpeg" ? "jpg" : "png"
    const zipBlob = await exportGridAsZip(results.map((r) => r.blob), ext)
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = getGridZipFileName()
    a.click()
    URL.revokeObjectURL(url)
  }, [results, mimeType])

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-[#F9F8F6]/90 backdrop-blur-sm border-b border-[#1A1A1A]/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <LogoIcon className="h-4 w-4 text-[#1A1A1A]" />
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#1A1A1A]">
                ImgSplit
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <span className="uppercase tracking-[0.2em] text-[#D4AF37] border-b border-[#D4AF37] pb-0.5">
              {tNav("grid")}
            </span>
            <Link
              href="/workspace"
              className="uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
            >
              {tNav("split")}
            </Link>
            <LocaleSwitcher variant="compact" />
          </div>
        </div>
      </nav>

      <GridSteps currentStep={step} />

      <div className="flex-1 flex flex-col">
        {step === 1 && (
          <div className="max-w-[800px] mx-auto w-full px-4 md:px-8 py-8">
            <GridUploadZone onImageLoaded={handleImageLoaded} />
          </div>
        )}

        {step === 2 && image && (
          <div className="flex-1 flex flex-col md:flex-row gap-0 px-4 md:px-8 pb-4 md:pb-8 max-w-[1400px] mx-auto w-full">
            <div className="hidden md:block w-[180px] flex-shrink-0 p-4">
              <GridTypeSelector
                value={editor.state.gridType}
                onChange={editor.setGridType}
                withGap={editor.state.withGap}
                onGapChange={editor.setWithGap}
                layout="vertical"
              />
            </div>
            <div className="md:hidden px-2 py-3">
              <GridTypeSelector
                value={editor.state.gridType}
                onChange={editor.setGridType}
                withGap={editor.state.withGap}
                onGapChange={editor.setWithGap}
                layout="horizontal"
              />
            </div>
            <div ref={containerRef} className="flex-1 flex items-center justify-center">
              <GridEditor
                image={image}
                imageUrl={imageUrl}
                gridType={editor.state.gridType}
                offsetX={editor.state.offsetX}
                offsetY={editor.state.offsetY}
                scale={editor.state.scale}
                frameWidth={editor.frameSize.width}
                frameHeight={editor.frameSize.height}
                onDrag={editor.handleDrag}
                onZoom={editor.handleZoom}
              />
            </div>
            <div className="hidden md:block w-[180px] flex-shrink-0 p-4">
              <GridPreview
                image={image}
                mimeType={mimeType}
                state={editor.state}
                frameWidth={editor.frameSize.width}
                frameHeight={editor.frameSize.height}
                onShowResults={handleShowResults}
              />
            </div>
            <div className="md:hidden px-2 py-3">
              <GridPreview
                image={image}
                mimeType={mimeType}
                state={editor.state}
                frameWidth={editor.frameSize.width}
                frameHeight={editor.frameSize.height}
                onShowResults={handleShowResults}
              />
            </div>
          </div>
        )}

        {step === 3 && results && (
          <div className="max-w-[600px] mx-auto w-full px-4 md:px-8 py-8">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#6C6863] mb-4">
              {tDownload("count", { count: results.length })}
            </div>

            <div
              className="grid gap-1 mb-6"
              style={{
                gridTemplateColumns: `repeat(${getGridConfig(editor.state.gridType).cols}, 1fr)`,
              }}
            >
              {results.map((result, i) => (
                <button
                  key={result.index}
                  onClick={() => handleSaveSingle(result)}
                  className="relative aspect-square overflow-hidden group cursor-pointer"
                >
                  <img
                    src={resultUrls[i]}
                    alt={`Grid ${result.index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white/0 group-hover:text-white/80 text-xs uppercase tracking-[0.15em] transition-colors duration-300">
                      {result.index}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleDownloadAll}
              className="w-full py-3 bg-[#1A1A1A] text-[#F9F8F6] text-xs uppercase tracking-[0.15em] hover:bg-[#D4AF37] transition-colors duration-500 mb-3"
            >
              {tDownload("zip")}
            </button>
            <button
              onClick={handleReadjust}
              className="w-full py-3 border border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-[0.15em] hover:bg-[#1A1A1A] hover:text-[#F9F8F6] transition-colors duration-500"
            >
              {tDownload("readjust")}
            </button>
            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-[#6C6863]">
              {tDownload("tapToSave")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 验证构建通过**

Run: `bun run build 2>&1 | tail -20`
Expected: Build succeeds, `/grid` page included in output

- [ ] **Step 4: Commit**

```bash
git add src/app/\\[locale\\]/grid/layout.tsx src/app/\\[locale\\]/grid/page.tsx src/app/\\[locale\\]/grid/GridPageClient.tsx
git commit -m "feat(grid): add /grid page with full 3-step workflow"
```

---

### Task 9: Sitemap 更新

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: 在 sitemap.ts 中添加 /grid 路由**

在 `src/app/sitemap.ts` 中，在现有的 `return entries` 之前（第 31 行），插入以下代码块：

```typescript
// Add /grid page
for (const locale of routing.locales) {
  const url =
    locale === routing.defaultLocale
      ? `${BASE_URL}/grid`
      : `${BASE_URL}/${locale}/grid`

  entries.push({
    url,
    lastModified: new Date("2026-03-15"),
    changeFrequency: "weekly",
    priority: 0.9,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? `${BASE_URL}/grid`
            : `${BASE_URL}/${l}/grid`,
        ])
      ),
    },
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(grid): add /grid to sitemap"
```

---

### Task 10: 落地页导航集成

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: 在导航栏添加 Grid 和 Split 链接**

在 `src/app/[locale]/page.tsx` 文件顶部添加 `import { Link } from "@/i18n/navigation"` 导入。

在 `<nav>` 中，将 `<LocaleSwitcher variant="compact" />` 之前的位置插入两个链接。找到以下代码：

```tsx
            <LocaleSwitcher variant="compact" />
```

在其前面添加：

```tsx
            <Link
              href="/grid"
              className="hidden md:inline uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
            >
              Grid
            </Link>
            <Link
              href="/workspace"
              className="hidden md:inline uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
            >
              Split
            </Link>
```

- [ ] **Step 2: 在 UseCaseCard 中添加可选 href prop，社交媒体卡片链接到 /grid**

修改 `UseCaseCard` 组件定义（在 `page.tsx` 底部），添加 `href` prop：

```tsx
function UseCaseCard({
  title,
  description,
  result,
  href,
}: {
  title: string
  description: string
  result: string
  href?: string
}) {
  const content = (
    <div className="group border-t border-[#F9F8F6]/10 p-8 md:p-12 transition-colors duration-700 hover:bg-[#F9F8F6]/[0.03]">
      <h3 className="text-sm uppercase tracking-[0.15em] text-[#F9F8F6] mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-[#F9F8F6]/50 leading-relaxed mb-6">{description}</p>
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
        <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} />
        {result}
      </div>
    </div>
  )
  if (href) {
    return <a href={href}>{content}</a>
  }
  return content
}
```

然后在社交媒体的 `UseCaseCard` 调用处添加 `href="/grid"` prop：

```tsx
            <UseCaseCard
              title={t("useCases.socialTitle")}
              description={t("useCases.socialDesc")}
              result={t("useCases.socialResult")}
              href="/grid"
            />
```

- [ ] **Step 3: 在 Features "网格分割" 卡片中添加 /grid 链接**

修改 `FeatureCard` 组件定义，添加可选 `href` prop（与 UseCaseCard 相同模式）：添加 `href?: string` 参数，若存在则用 `<a href={href}>` 包裹。

然后在 `gridTitle` 的 `FeatureCard` 调用处添加 `href="/grid"` prop：

```tsx
            <FeatureCard
              icon={<Grid3X3 className="h-4 w-4" strokeWidth={1.5} />}
              title={t("features.gridTitle")}
              description={t("features.gridDesc")}
              href="/grid"
            />
```

- [ ] **Step 4: 验证构建通过**

Run: `bun run build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/app/\\[locale\\]/page.tsx
git commit -m "feat(grid): add Grid link to landing page navigation"
```

---

### Task 11: 全量测试 + 最终验证

- [ ] **Step 1: 运行所有测试**

Run: `bunx vitest run`
Expected: All tests PASS（包括现有测试和新增的 grid-splitter、zip-exporter、use-grid-editor 测试）

- [ ] **Step 2: 运行 lint**

Run: `bun run lint`
Expected: No errors

- [ ] **Step 3: 运行构建**

Run: `bun run build`
Expected: Build succeeds，输出中包含 `/grid` 页面

- [ ] **Step 4: 本地验证**

Run: `bun run dev`
手动验证：
1. 访问 `/grid` — 应显示上传页面
2. 上传一张图片 — 应进入步骤 2 编辑器
3. 拖拽图片 — 应在裁切框内移动
4. 切换网格类型 — 裁切框比例应变化
5. 点击下载 — 应下载 ZIP
6. 访问 `/zh-CN/grid` — 应显示中文界面
7. 导航栏 Grid 链接 — 应存在且可点击

- [ ] **Step 5: Final commit（如有遗漏修复）**

Stage only the files you actually fixed, then commit:

```bash
git commit -m "feat(grid): final adjustments after verification"
```
