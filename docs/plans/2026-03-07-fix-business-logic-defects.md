# Fix Business Logic Defects Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 7 business logic defects identified in the online image segmentation tool, ranging from crash-causing zero-size regions to stale state after image removal.

**Architecture:** Each fix is isolated to a specific module (image-splitter, use-undo-redo, use-split-lines, SplitEditor). Fixes are ordered by severity: crash-causing bugs first, then data-integrity issues, then UX inconsistencies. All changes are backward-compatible.

**Tech Stack:** TypeScript, React hooks, Vitest + @testing-library/react, Canvas API, Konva.js

---

### Task 1: Filter zero-size regions in `computeRegions`

Duplicate or edge-position split lines produce regions with 0 width/height, causing `canvas.toBlob` to fail or produce empty blobs.

**Files:**
- Modify: `src/lib/image-splitter.ts:15-55` (the `computeRegions` function)
- Test: `src/lib/__tests__/image-splitter.test.ts`

**Step 1: Write failing tests for zero-size regions**

Add these tests at the end of the `describe("splitImage", ...)` block in `src/lib/__tests__/image-splitter.test.ts`:

```typescript
it("should filter out zero-height regions from duplicate horizontal lines", async () => {
  const image = createMockImage(100, 300)
  const lines: SplitLine[] = [
    { id: "1", orientation: "horizontal", position: 100 },
    { id: "2", orientation: "horizontal", position: 100 }, // duplicate
  ]

  const results = await splitImage(image, lines, "image/png")

  // Should produce 2 regions (0→100, 100→300), not 3 with a zero-height one
  expect(results).toHaveLength(2)
  expect(results[0]).toMatchObject({ row: 1, col: 1, width: 100, height: 100 })
  expect(results[1]).toMatchObject({ row: 2, col: 1, width: 100, height: 200 })
})

it("should filter out zero-width regions from duplicate vertical lines", async () => {
  const image = createMockImage(300, 100)
  const lines: SplitLine[] = [
    { id: "1", orientation: "vertical", position: 150 },
    { id: "2", orientation: "vertical", position: 150 }, // duplicate
  ]

  const results = await splitImage(image, lines, "image/png")

  expect(results).toHaveLength(2)
  expect(results[0]).toMatchObject({ row: 1, col: 1, width: 150 })
  expect(results[1]).toMatchObject({ row: 1, col: 2, width: 150 })
})

it("should filter out regions from lines at image boundary (position 0)", async () => {
  const image = createMockImage(100, 200)
  const lines: SplitLine[] = [
    { id: "1", orientation: "horizontal", position: 0 },
  ]

  const results = await splitImage(image, lines, "image/png")

  // Line at 0 produces edges [0, 0, 200] → regions h=0 and h=200
  // The zero-height region should be filtered
  expect(results).toHaveLength(1)
  expect(results[0]).toMatchObject({ row: 1, col: 1, width: 100, height: 200 })
})

it("should filter out regions from lines at image boundary (position = imageSize)", async () => {
  const image = createMockImage(100, 200)
  const lines: SplitLine[] = [
    { id: "1", orientation: "horizontal", position: 200 },
  ]

  const results = await splitImage(image, lines, "image/png")

  expect(results).toHaveLength(1)
  expect(results[0]).toMatchObject({ row: 1, col: 1, width: 100, height: 200 })
})
```

**Step 2: Run tests to verify they fail**

Run: `cd /Users/wuzhiqiang/Documents/WWW/MySelf/online-image-segmentation/.claude/worktrees/humming-crunching-squid && bun test src/lib/__tests__/image-splitter.test.ts`

Expected: 4 new tests FAIL (zero-size regions are not filtered)

**Step 3: Implement the fix in `computeRegions`**

In `src/lib/image-splitter.ts`, modify the `computeRegions` function to deduplicate edge positions and filter zero-size regions:

```typescript
function computeRegions(
  imageWidth: number,
  imageHeight: number,
  lines: SplitLine[]
): { x: number; y: number; w: number; h: number; row: number; col: number }[] {
  const hPositions = [
    ...new Set(
      lines
        .filter((l) => l.orientation === "horizontal")
        .map((l) => l.position)
    ),
  ].sort((a, b) => a - b)
  const vPositions = [
    ...new Set(
      lines
        .filter((l) => l.orientation === "vertical")
        .map((l) => l.position)
    ),
  ].sort((a, b) => a - b)

  const yEdges = [0, ...hPositions, imageHeight]
  const xEdges = [0, ...vPositions, imageWidth]

  const regions: {
    x: number
    y: number
    w: number
    h: number
    row: number
    col: number
  }[] = []

  let actualRow = 0
  for (let r = 0; r < yEdges.length - 1; r++) {
    const h = yEdges[r + 1] - yEdges[r]
    if (h <= 0) continue
    actualRow++
    let actualCol = 0
    for (let c = 0; c < xEdges.length - 1; c++) {
      const w = xEdges[c + 1] - xEdges[c]
      if (w <= 0) continue
      actualCol++
      regions.push({
        x: xEdges[c],
        y: yEdges[r],
        w,
        h,
        row: actualRow,
        col: actualCol,
      })
    }
  }

  return regions
}
```

**Step 4: Run tests to verify they pass**

Run: `cd /Users/wuzhiqiang/Documents/WWW/MySelf/online-image-segmentation/.claude/worktrees/humming-crunching-squid && bun test src/lib/__tests__/image-splitter.test.ts`

Expected: ALL tests PASS (including existing ones)

**Step 5: Commit**

```bash
git add src/lib/image-splitter.ts src/lib/__tests__/image-splitter.test.ts
git commit -m "fix: filter zero-size regions from duplicate/edge split lines"
```

---

### Task 2: Fix `useUndoRedo` ref mutation in state updaters (React Strict Mode safety)

`setState`, `undo`, and `redo` mutate refs inside `setStateInternal` updater functions. React Strict Mode calls updaters twice, causing double push/pop and potential state corruption (e.g., `pop()` returns `undefined` on second call).

**Files:**
- Modify: `src/hooks/use-undo-redo.ts`
- Test: `src/hooks/__tests__/use-undo-redo.test.ts`

**Step 1: Write failing test for double-invocation safety**

Add at the end of `src/hooks/__tests__/use-undo-redo.test.ts`:

```typescript
it("should track canUndo and canRedo correctly as state", () => {
  const { result } = renderHook(() =>
    useUndoRedo({ initialState: "a" })
  )

  // Initially no undo/redo
  expect(result.current.canUndo).toBe(false)
  expect(result.current.canRedo).toBe(false)

  // After setState, canUndo should be true
  act(() => result.current.setState("b"))
  expect(result.current.canUndo).toBe(true)
  expect(result.current.canRedo).toBe(false)

  // After undo, canRedo should be true, canUndo false
  act(() => result.current.undo())
  expect(result.current.canUndo).toBe(false)
  expect(result.current.canRedo).toBe(true)

  // After redo, back to canUndo=true, canRedo=false
  act(() => result.current.redo())
  expect(result.current.canUndo).toBe(true)
  expect(result.current.canRedo).toBe(false)
})
```

Note: This test may already pass in non-Strict-Mode jsdom. The real fix is structural — moving from ref mutation inside updaters to a single state object.

**Step 2: Run test to verify baseline**

Run: `cd /Users/wuzhiqiang/Documents/WWW/MySelf/online-image-segmentation/.claude/worktrees/humming-crunching-squid && bun test src/hooks/__tests__/use-undo-redo.test.ts`

Expected: PASS (the structural issue only manifests in React Strict Mode, but the refactor is still necessary for correctness)

**Step 3: Refactor `useUndoRedo` to use a single state object**

Replace the entire `src/hooks/use-undo-redo.ts` with:

```typescript
"use client"

import { useCallback, useState } from "react"

interface UseUndoRedoOptions<T> {
  initialState: T
  maxStackSize?: number
}

interface UseUndoRedoReturn<T> {
  state: T
  setState: (newState: T) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

interface UndoRedoState<T> {
  current: T
  undoStack: T[]
  redoStack: T[]
}

export function useUndoRedo<T>({
  initialState,
  maxStackSize = 50,
}: UseUndoRedoOptions<T>): UseUndoRedoReturn<T> {
  const [internal, setInternal] = useState<UndoRedoState<T>>({
    current: initialState,
    undoStack: [],
    redoStack: [],
  })

  const setState = useCallback(
    (newState: T) => {
      setInternal((prev) => {
        const newUndo = [...prev.undoStack, prev.current]
        if (newUndo.length > maxStackSize) {
          newUndo.shift()
        }
        return {
          current: newState,
          undoStack: newUndo,
          redoStack: [],
        }
      })
    },
    [maxStackSize]
  )

  const undo = useCallback(() => {
    setInternal((prev) => {
      if (prev.undoStack.length === 0) return prev
      const newUndo = prev.undoStack.slice(0, -1)
      const previousState = prev.undoStack[prev.undoStack.length - 1]
      return {
        current: previousState,
        undoStack: newUndo,
        redoStack: [...prev.redoStack, prev.current],
      }
    })
  }, [])

  const redo = useCallback(() => {
    setInternal((prev) => {
      if (prev.redoStack.length === 0) return prev
      const newRedo = prev.redoStack.slice(0, -1)
      const nextState = prev.redoStack[prev.redoStack.length - 1]
      return {
        current: nextState,
        undoStack: [...prev.undoStack, prev.current],
        redoStack: newRedo,
      }
    })
  }, [])

  return {
    state: internal.current,
    setState,
    undo,
    redo,
    canUndo: internal.undoStack.length > 0,
    canRedo: internal.redoStack.length > 0,
  }
}
```

Key changes:
- `undoStack` and `redoStack` are now part of React state (not refs)
- All mutations inside updaters are pure (create new arrays, no mutation)
- `canUndo`/`canRedo` derived from state, so they always re-render correctly
- Safe under React Strict Mode double-invocation

**Step 4: Run ALL undo-redo tests**

Run: `cd /Users/wuzhiqiang/Documents/WWW/MySelf/online-image-segmentation/.claude/worktrees/humming-crunching-squid && bun test src/hooks/__tests__/use-undo-redo.test.ts`

Expected: ALL tests PASS

**Step 5: Run split-lines tests (which depend on undo-redo)**

Run: `cd /Users/wuzhiqiang/Documents/WWW/MySelf/online-image-segmentation/.claude/worktrees/humming-crunching-squid && bun test src/hooks/__tests__/use-split-lines.test.ts`

Expected: ALL tests PASS

**Step 6: Commit**

```bash
git add src/hooks/use-undo-redo.ts src/hooks/__tests__/use-undo-redo.test.ts
git commit -m "fix: refactor useUndoRedo to pure state for React Strict Mode safety"
```

---

### Task 3: Clear stale results when removing images

When users remove images from a multi-image session, old `batchResults`/`splitResults` remain. This causes key format mismatches between batch keys (`${imageIndex}-${row}-${col}`) and single-image keys (`${row}-${col}`), breaking download-selected functionality.

**Files:**
- Modify: `src/components/SplitEditor.tsx:415-424` (the `handleRemoveImage` callback)

**Step 1: Add `clearResults` call to `handleRemoveImage`**

In `src/components/SplitEditor.tsx`, find the `handleRemoveImage` callback and add `clearResults()`:

```typescript
const handleRemoveImage = useCallback((index: number) => {
  setImages((prev) => {
    if (prev.length <= 1) return prev
    return prev.filter((_, i) => i !== index)
  })
  setImagePositions((prev) => {
    if (prev.length <= 1) return prev
    return prev.filter((_, i) => i !== index)
  })
  clearResults()
}, [clearResults])
```

**Step 2: Verify the fix manually or run existing tests**

Run: `cd /Users/wuzhiqiang/Documents/WWW/MySelf/online-image-segmentation/.claude/worktrees/humming-crunching-squid && bun test`

Expected: ALL existing tests PASS (no regressions)

**Step 3: Commit**

```bash
git add src/components/SplitEditor.tsx
git commit -m "fix: clear stale split results when removing images"
```

---

### Task 4: Add line-intersection validation for multi-image batch split

In single-image mode, there's a check: `if (localLines.length === 0) toast.error(...)`. Multi-image mode skips this, allowing silent no-op splits.

**Files:**
- Modify: `src/components/SplitEditor.tsx:497-536` (the `handleGenerate` callback)

**Step 1: Add validation in the multi-image branch**

In `src/components/SplitEditor.tsx`, inside `handleGenerate`, after computing `linesPerImage` for the multi-image case, add validation:

```typescript
if (isMultiImage) {
  // Convert workspace lines to per-image local lines
  const linesPerImage = images.map((item, index) => {
    const pos = imagePositions[index] ?? { x: 0, y: 0 }
    return getLocalLines(
      lines,
      pos,
      item.image.naturalWidth,
      item.image.naturalHeight
    )
  })

  // Check if any image has intersecting lines
  const hasAnyLines = linesPerImage.some((l) => l.length > 0)
  if (!hasAnyLines) {
    toast.error("分割线未穿过任何图片")
    return
  }

  await generateBatchSplit(images, linesPerImage)
} else {
  // ... existing single-image code unchanged
}
```

**Step 2: Run existing tests**

Run: `cd /Users/wuzhiqiang/Documents/WWW/MySelf/online-image-segmentation/.claude/worktrees/humming-crunching-squid && bun test`

Expected: ALL tests PASS

**Step 3: Commit**

```bash
git add src/components/SplitEditor.tsx
git commit -m "fix: validate line intersection before multi-image batch split"
```

---

### Task 5: Fix history saving to convert workspace lines to image-local coordinates

History saves workspace-coordinate lines, but loads them for a single image at (0,0). When the original image was at a non-zero offset (multi-image layout), lines are misaligned.

**Files:**
- Modify: `src/components/SplitEditor.tsx:543-582` (the history saving section inside `handleGenerate`)

**Step 1: Convert workspace lines to local coordinates before saving**

In `src/components/SplitEditor.tsx`, inside the `handleGenerate` callback, find the history saving block (`if (onSaveHistory && images.length > 0)`). Replace `lines: [...lines]` with local-coordinate conversion:

```typescript
if (onSaveHistory && images.length > 0) {
  try {
    const firstImage = images[0].image
    const thumbCanvas = document.createElement("canvas")
    const thumbSize = 128
    const ratio = Math.min(thumbSize / firstImage.naturalWidth, thumbSize / firstImage.naturalHeight)
    thumbCanvas.width = firstImage.naturalWidth * ratio
    thumbCanvas.height = firstImage.naturalHeight * ratio
    const thumbCtx = thumbCanvas.getContext("2d")
    if (thumbCtx) {
      thumbCtx.drawImage(firstImage, 0, 0, thumbCanvas.width, thumbCanvas.height)
      const thumbnailDataUrl = thumbCanvas.toDataURL("image/jpeg", 0.6)
      const fullCanvas = document.createElement("canvas")
      fullCanvas.width = firstImage.naturalWidth
      fullCanvas.height = firstImage.naturalHeight
      const fullCtx = fullCanvas.getContext("2d")
      if (fullCtx) {
        fullCtx.drawImage(firstImage, 0, 0)
        const mimeForBlob = ["image/png", "image/jpeg"].includes(images[0].mimeType)
          ? images[0].mimeType
          : "image/png"
        const imageBlob = await new Promise<Blob>((resolve, reject) =>
          fullCanvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("toBlob returned null"))),
            mimeForBlob
          )
        )
        // Convert workspace lines to first image's local coordinates for history
        const pos = imagePositions[0] ?? { x: 0, y: 0 }
        const localLines = getLocalLines(
          lines,
          pos,
          firstImage.naturalWidth,
          firstImage.naturalHeight
        )
        onSaveHistory({
          originalFileName: images[0].fileName,
          originalMimeType: images[0].mimeType,
          lines: localLines,
          imageBlob,
          thumbnailDataUrl,
        })
      }
    }
  } catch (err) {
    console.error("Save history failed:", err)
  }
}
```

The key change is `lines: localLines` instead of `lines: [...lines]`. The `getLocalLines` function already exists in the component and filters/converts workspace lines to local coordinates.

**Step 2: Run tests**

Run: `cd /Users/wuzhiqiang/Documents/WWW/MySelf/online-image-segmentation/.claude/worktrees/humming-crunching-squid && bun test`

Expected: ALL tests PASS

**Step 3: Commit**

```bash
git add src/components/SplitEditor.tsx
git commit -m "fix: save image-local lines in history instead of workspace lines"
```

---

### Task 6: Report actual exported dimensions in `SplitResult`

When `computeScale` reduces a region for large images, `SplitResult.width/height` still reports original dimensions. The user sees incorrect size info.

**Files:**
- Modify: `src/lib/image-splitter.ts:80-155` (`cropRegion` return type and `splitImage`)

**Step 1: Write failing test**

Add at the end of `describe("splitImage", ...)` in `src/lib/__tests__/image-splitter.test.ts`:

```typescript
it("should report scaled dimensions when region exceeds canvas limits", async () => {
  // Create an image where a region would exceed MAX_CANVAS_AREA (16,777,216)
  // 5000 x 5000 = 25,000,000 > 16,777,216
  const image = createMockImage(5000, 5000)

  const results = await splitImage(image, [], "image/png")

  // Scale factor: sqrt(16777216 / 25000000) ≈ 0.819
  // Scaled: round(5000 * 0.819) = 4096 (approximately)
  expect(results).toHaveLength(1)
  expect(results[0].width).toBeLessThan(5000)
  expect(results[0].height).toBeLessThan(5000)
  expect(results[0].width).toBeGreaterThan(0)
  expect(results[0].height).toBeGreaterThan(0)
})
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/wuzhiqiang/Documents/WWW/MySelf/online-image-segmentation/.claude/worktrees/humming-crunching-squid && bun test src/lib/__tests__/image-splitter.test.ts`

Expected: FAIL — `results[0].width` is `5000` (original size, not scaled)

**Step 3: Modify `cropRegion` to return actual dimensions and update `splitImage`**

In `src/lib/image-splitter.ts`, change `cropRegion` to return `{ blob, actualWidth, actualHeight }`:

```typescript
function cropRegion(
  image: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  mimeType: string
): Promise<{ blob: Blob; actualWidth: number; actualHeight: number }> {
  return new Promise((resolve, reject) => {
    const scale = computeScale(w, h)
    const canvas = document.createElement("canvas")
    const actualWidth = Math.round(w * scale)
    const actualHeight = Math.round(h * scale)
    canvas.width = actualWidth
    canvas.height = actualHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      reject(new Error("Failed to get canvas 2d context"))
      return
    }
    if (scale < 1) {
      ctx.scale(scale, scale)
    }
    ctx.drawImage(image, x, y, w, h, 0, 0, w, h)
    const quality = mimeType === "image/jpeg" ? JPEG_QUALITY : undefined
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({ blob, actualWidth, actualHeight })
          return
        }
        // Fallback: try toDataURL when toBlob returns null
        try {
          resolve({
            blob: dataUrlToBlob(canvas.toDataURL(mimeType, quality), mimeType),
            actualWidth,
            actualHeight,
          })
        } catch {
          reject(new Error("Failed to create blob from canvas"))
        }
      },
      mimeType,
      quality
    )
  })
}
```

Then update `splitImage` to use the returned dimensions:

```typescript
export async function splitImage(
  image: HTMLImageElement,
  lines: SplitLine[],
  originalMimeType: string
): Promise<SplitResult[]> {
  const mimeType = resolveOutputMimeType(originalMimeType)
  const regions = computeRegions(
    image.naturalWidth,
    image.naturalHeight,
    lines
  )

  const results: SplitResult[] = []

  for (const region of regions) {
    const { blob, actualWidth, actualHeight } = await cropRegion(
      image,
      region.x,
      region.y,
      region.w,
      region.h,
      mimeType
    )
    results.push({
      row: region.row,
      col: region.col,
      blob,
      width: actualWidth,
      height: actualHeight,
    })
  }

  return results
}
```

**Step 4: Run ALL image-splitter tests**

Run: `cd /Users/wuzhiqiang/Documents/WWW/MySelf/online-image-segmentation/.claude/worktrees/humming-crunching-squid && bun test src/lib/__tests__/image-splitter.test.ts`

Expected: ALL tests PASS. Note: Existing tests use images <=300px, so `computeScale` returns 1 and dimensions remain unchanged — backward-compatible.

**Step 5: Commit**

```bash
git add src/lib/image-splitter.ts src/lib/__tests__/image-splitter.test.ts
git commit -m "fix: report actual exported dimensions in SplitResult"
```

---

### Task 7: Run full test suite and verify no regressions

**Step 1: Run all tests**

Run: `cd /Users/wuzhiqiang/Documents/WWW/MySelf/online-image-segmentation/.claude/worktrees/humming-crunching-squid && bun test`

Expected: ALL tests PASS

**Step 2: Run build check**

Run: `cd /Users/wuzhiqiang/Documents/WWW/MySelf/online-image-segmentation/.claude/worktrees/humming-crunching-squid && bun run build`

Expected: Build succeeds with no TypeScript errors

**Step 3: Final commit if any fixups needed**

If any test/build issues were found and fixed, commit the fixes.
