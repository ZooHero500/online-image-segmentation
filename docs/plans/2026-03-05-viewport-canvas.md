# Viewport Canvas Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the canvas workspace fill the browser viewport with Figma-style zoom and pan, instead of being sized by the uploaded image.

**Architecture:** Use Konva Stage's native `scaleX/scaleY` and `x/y` properties for viewport-level zoom/pan. Stage size equals the container viewport. Image and split lines live in world coordinates, rendered through Stage transform. A new `use-canvas-viewport` hook manages zoom/pan state.

**Tech Stack:** React 19, Konva.js (react-konva), TypeScript, Vitest

---

### Task 1: Create `use-canvas-viewport` hook with tests

**Files:**
- Create: `src/hooks/use-canvas-viewport.ts`
- Create: `src/hooks/__tests__/use-canvas-viewport.test.ts`

**Step 1: Write the failing test**

```typescript
// src/hooks/__tests__/use-canvas-viewport.test.ts
import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useCanvasViewport } from "../use-canvas-viewport"

describe("useCanvasViewport", () => {
  const defaultOptions = {
    containerWidth: 800,
    containerHeight: 600,
    imageWidth: 1600,
    imageHeight: 1200,
  }

  it("should calculate initial fit-to-view scale", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))
    // 800/1600=0.5, 600/1200=0.5, min=0.5, with 5% padding => 0.5 * 0.95 = 0.475
    expect(result.current.scale).toBeCloseTo(0.475, 2)
  })

  it("should center image initially", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))
    const s = result.current.scale
    const imgW = 1600 * s
    const imgH = 1200 * s
    // centered: (containerW - imgW) / 2
    expect(result.current.position.x).toBeCloseTo((800 - imgW) / 2, 0)
    expect(result.current.position.y).toBeCloseTo((600 - imgH) / 2, 0)
  })

  it("should zoom in at a point", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))
    const oldScale = result.current.scale

    act(() => {
      result.current.zoomAtPoint(400, 300, 1.1) // zoom in 10% at center
    })

    expect(result.current.scale).toBeCloseTo(oldScale * 1.1, 4)
  })

  it("should clamp scale to min/max", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))

    act(() => {
      result.current.zoomAtPoint(400, 300, 0.001) // try to zoom out beyond min
    })
    expect(result.current.scale).toBeGreaterThanOrEqual(0.1)

    act(() => {
      result.current.zoomAtPoint(400, 300, 10000) // try to zoom in beyond max
    })
    expect(result.current.scale).toBeLessThanOrEqual(10)
  })

  it("should pan by delta", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))
    const oldPos = { ...result.current.position }

    act(() => {
      result.current.panBy(50, -30)
    })

    expect(result.current.position.x).toBe(oldPos.x + 50)
    expect(result.current.position.y).toBe(oldPos.y - 30)
  })

  it("should reset to fit view", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))

    act(() => {
      result.current.zoomAtPoint(400, 300, 3)
      result.current.panBy(200, 100)
    })

    act(() => {
      result.current.fitToView()
    })

    expect(result.current.scale).toBeCloseTo(0.475, 2)
  })

  it("should reset to 100%", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))

    act(() => {
      result.current.resetTo100()
    })

    expect(result.current.scale).toBe(1)
  })

  it("should convert screen to world coordinates", () => {
    const { result } = renderHook(() => useCanvasViewport(defaultOptions))
    const { scale, position } = result.current

    const world = result.current.screenToWorld(400, 300)
    expect(world.x).toBeCloseTo((400 - position.x) / scale, 1)
    expect(world.y).toBeCloseTo((300 - position.y) / scale, 1)
  })

  it("should return no image scale when no image", () => {
    const { result } = renderHook(() =>
      useCanvasViewport({ containerWidth: 800, containerHeight: 600, imageWidth: 0, imageHeight: 0 })
    )
    expect(result.current.scale).toBe(1)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `bunx vitest run src/hooks/__tests__/use-canvas-viewport.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

```typescript
// src/hooks/use-canvas-viewport.ts
"use client"

import { useCallback, useMemo, useState } from "react"

const MIN_SCALE = 0.1
const MAX_SCALE = 10
const FIT_PADDING = 0.95 // 5% padding around image

interface UseCanvasViewportOptions {
  containerWidth: number
  containerHeight: number
  imageWidth: number
  imageHeight: number
}

interface UseCanvasViewportReturn {
  scale: number
  position: { x: number; y: number }
  zoomAtPoint: (screenX: number, screenY: number, factor: number) => void
  panBy: (dx: number, dy: number) => void
  fitToView: () => void
  resetTo100: () => void
  screenToWorld: (screenX: number, screenY: number) => { x: number; y: number }
  worldToScreen: (worldX: number, worldY: number) => { x: number; y: number }
  zoomPercent: number
}

function clampScale(s: number): number {
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, s))
}

function calculateFitScale(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number
): number {
  if (imageW <= 0 || imageH <= 0) return 1
  return Math.min(containerW / imageW, containerH / imageH) * FIT_PADDING
}

function calculateCenterPosition(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  scale: number
): { x: number; y: number } {
  return {
    x: (containerW - imageW * scale) / 2,
    y: (containerH - imageH * scale) / 2,
  }
}

export function useCanvasViewport({
  containerWidth,
  containerHeight,
  imageWidth,
  imageHeight,
}: UseCanvasViewportOptions): UseCanvasViewportReturn {
  const fitScale = useMemo(
    () => calculateFitScale(containerWidth, containerHeight, imageWidth, imageHeight),
    [containerWidth, containerHeight, imageWidth, imageHeight]
  )

  const fitPosition = useMemo(
    () => calculateCenterPosition(containerWidth, containerHeight, imageWidth, imageHeight, fitScale),
    [containerWidth, containerHeight, imageWidth, imageHeight, fitScale]
  )

  const [scale, setScale] = useState(fitScale)
  const [position, setPosition] = useState(fitPosition)

  const zoomAtPoint = useCallback(
    (screenX: number, screenY: number, factor: number) => {
      setScale((prevScale) => {
        const newScale = clampScale(prevScale * factor)
        const ratio = newScale / prevScale
        setPosition((prev) => ({
          x: screenX - (screenX - prev.x) * ratio,
          y: screenY - (screenY - prev.y) * ratio,
        }))
        return newScale
      })
    },
    []
  )

  const panBy = useCallback((dx: number, dy: number) => {
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
  }, [])

  const fitToView = useCallback(() => {
    const s = calculateFitScale(containerWidth, containerHeight, imageWidth, imageHeight)
    setScale(s)
    setPosition(calculateCenterPosition(containerWidth, containerHeight, imageWidth, imageHeight, s))
  }, [containerWidth, containerHeight, imageWidth, imageHeight])

  const resetTo100 = useCallback(() => {
    setScale(1)
    setPosition(calculateCenterPosition(containerWidth, containerHeight, imageWidth, imageHeight, 1))
  }, [containerWidth, containerHeight, imageWidth, imageHeight])

  const screenToWorld = useCallback(
    (screenX: number, screenY: number) => ({
      x: (screenX - position.x) / scale,
      y: (screenY - position.y) / scale,
    }),
    [scale, position]
  )

  const worldToScreen = useCallback(
    (worldX: number, worldY: number) => ({
      x: worldX * scale + position.x,
      y: worldY * scale + position.y,
    }),
    [scale, position]
  )

  const zoomPercent = Math.round(scale * 100)

  return {
    scale,
    position,
    zoomAtPoint,
    panBy,
    fitToView,
    resetTo100,
    screenToWorld,
    worldToScreen,
    zoomPercent,
  }
}
```

**Step 4: Run test to verify it passes**

Run: `bunx vitest run src/hooks/__tests__/use-canvas-viewport.test.ts`
Expected: ALL PASS

**Step 5: Commit**

```bash
git add src/hooks/use-canvas-viewport.ts src/hooks/__tests__/use-canvas-viewport.test.ts
git commit -m "feat: add use-canvas-viewport hook with zoom/pan state management"
```

---

### Task 2: Create `ZoomIndicator` component

**Files:**
- Create: `src/components/ZoomIndicator.tsx`

**Step 1: Write the component**

```tsx
// src/components/ZoomIndicator.tsx
"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ZoomIndicatorProps {
  zoomPercent: number
  onFitToView: () => void
  onResetTo100: () => void
  onZoomChange: (percent: number) => void
}

export function ZoomIndicator({
  zoomPercent,
  onFitToView,
  onResetTo100,
  onZoomChange,
}: ZoomIndicatorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = useCallback(() => {
    setInputValue(String(zoomPercent))
    setIsEditing(true)
  }, [zoomPercent])

  const handleSubmit = useCallback(() => {
    const val = parseInt(inputValue, 10)
    if (!isNaN(val) && val >= 10 && val <= 1000) {
      onZoomChange(val)
    }
    setIsEditing(false)
  }, [inputValue, onZoomChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit()
      if (e.key === "Escape") setIsEditing(false)
    },
    [handleSubmit]
  )

  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm border rounded-md px-2 py-1 text-xs z-10">
      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={onFitToView}>
        Fit
      </Button>
      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={onResetTo100}>
        100%
      </Button>
      <div className="w-px h-4 bg-border mx-1" />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="w-12 h-6 text-center text-xs bg-transparent border rounded px-1"
        />
      ) : (
        <button
          onClick={handleClick}
          className="h-6 px-2 text-xs hover:bg-accent rounded cursor-pointer"
        >
          {zoomPercent}%
        </button>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/ZoomIndicator.tsx
git commit -m "feat: add ZoomIndicator component with fit/100%/custom zoom controls"
```

---

### Task 3: Refactor `SplitEditor` — Stage fills viewport, integrate viewport hook

This is the core task. Replace image-sized Stage with viewport-sized Stage.

**Files:**
- Modify: `src/components/SplitEditor.tsx`

**Step 1: Replace scale calculation and Stage sizing**

Key changes in `SplitEditor.tsx`:

1. **Remove** the old `scale` useMemo (lines 86-94) and `stageWidth/stageHeight` (lines 200-201).

2. **Add** the viewport hook:
```typescript
import { useCanvasViewport } from "@/hooks/use-canvas-viewport"
import { ZoomIndicator } from "./ZoomIndicator"

// Inside the component, after containerSize state:
const viewport = useCanvasViewport({
  containerWidth: containerSize.width - RULER_THICKNESS,
  containerHeight: containerSize.height - RULER_THICKNESS,
  imageWidth,
  imageHeight,
})

const stageWidth = containerSize.width - RULER_THICKNESS
const stageHeight = containerSize.height - RULER_THICKNESS
```

3. **Change** the editor area grid sizing from `width: stageWidth + RULER_THICKNESS` to `width: 100%, height: 100%`:
```typescript
<div
  ref={editorAreaRef}
  className="relative"
  style={{
    display: "grid",
    gridTemplateColumns: `${RULER_THICKNESS}px 1fr`,
    gridTemplateRows: `${RULER_THICKNESS}px 1fr`,
    width: "100%",
    height: "100%",
  }}
>
```

4. **Change** the containerRef div to fill the parent and set a fixed height:
```typescript
<div
  ref={containerRef}
  className="relative w-full bg-muted/30 rounded-lg overflow-hidden flex-1"
  style={{ minHeight: 400 }}
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
```

5. **Update** Stage to use viewport transform:
```tsx
<Stage
  width={stageWidth}
  height={stageHeight}
  scaleX={viewport.scale}
  scaleY={viewport.scale}
  x={viewport.position.x}
  y={viewport.position.y}
  onClick={(e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedLineId(null)
    }
  }}
  onWheel={(e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    const scaleBy = 1.05
    const factor = e.evt.deltaY < 0 ? scaleBy : 1 / scaleBy
    const stage = e.target.getStage()
    if (!stage) return
    const pointer = stage.getPointerPosition()
    if (!pointer) return
    viewport.zoomAtPoint(pointer.x, pointer.y, factor)
  }}
>
```

6. **Update** Image rendering — no more manual scale, Stage handles it:
```tsx
<Layer>
  <KonvaImage
    image={image}
    width={imageWidth}
    height={imageHeight}
  />
</Layer>
```

7. **Update** split line rendering — remove `* scale` since Stage transform handles scaling. Lines span the visible world:
```tsx
{lines.map((line) => {
  const isHorizontal = line.orientation === "horizontal"
  // Calculate visible world bounds for full-viewport lines
  const worldLeft = -viewport.position.x / viewport.scale
  const worldTop = -viewport.position.y / viewport.scale
  const worldRight = worldLeft + stageWidth / viewport.scale
  const worldBottom = worldTop + stageHeight / viewport.scale

  const points = isHorizontal
    ? [worldLeft, line.position, worldRight, line.position]
    : [line.position, worldTop, line.position, worldBottom]

  return (
    <Line
      key={line.id}
      points={points}
      stroke={isAboutToDelete ? "#f97316" : isSelected ? "#3b82f6" : "#ef4444"}
      strokeWidth={(isSelected ? 3 : 2) / viewport.scale}
      opacity={isAboutToDelete ? 0.5 : 1}
      hitStrokeWidth={20 / viewport.scale}
      draggable
      onClick={() => setSelectedLineId(line.id)}
      onTap={() => setSelectedLineId(line.id)}
      dragBoundFunc={(pos) => {
        // pos is in screen coordinates when Stage has transform
        if (isHorizontal) {
          const worldY = (pos.y - viewport.position.y) / viewport.scale
          const snapped = calculateSnap(worldY, "horizontal")
          return { x: pos.x, y: snapped * viewport.scale + viewport.position.y }
        } else {
          const worldX = (pos.x - viewport.position.x) / viewport.scale
          const snapped = calculateSnap(worldX, "vertical")
          return { x: snapped * viewport.scale + viewport.position.x, y: pos.y }
        }
      }}
      onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => {
        const node = e.target
        const stageContainer = stageContainerRef.current
        if (!stageContainer) return
        const stageRect = stageContainer.getBoundingClientRect()
        if (isHorizontal) {
          const screenY = stageRect.top + (node.y() + line.position) * viewport.scale + viewport.position.y
          const near = isNearRulerZone(screenY, "horizontal")
          setLineNearRuler(near ? line.id : null)
        } else {
          const screenX = stageRect.left + (node.x() + line.position) * viewport.scale + viewport.position.x
          const near = isNearRulerZone(screenX, "vertical")
          setLineNearRuler(near ? line.id : null)
        }
      }}
      onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
        const node = e.target
        const stageContainer = stageContainerRef.current
        if (stageContainer && lineNearRuler === line.id) {
          removeLine(line.id)
          setLineNearRuler(null)
          if (selectedLineId === line.id) setSelectedLineId(null)
          node.y(0)
          node.x(0)
          return
        }
        setLineNearRuler(null)
        if (isHorizontal) {
          const newPos = node.y() / viewport.scale
          updateLinePosition(line.id, Math.round(line.position + newPos))
          node.y(0)
        } else {
          const newPos = node.x() / viewport.scale
          updateLinePosition(line.id, Math.round(line.position + newPos))
          node.x(0)
        }
      }}
    />
  )
})}
```

8. **Update** SplitRegionOverlay — remove `* scale`:
```tsx
<SplitRegionOverlay
  lines={lines}
  imageWidth={imageWidth}
  imageHeight={imageHeight}
  scale={1}
/>
```
And in the SplitRegionOverlay component, keep the scale param but it's now always 1 (or remove scale param entirely and use raw coordinates since Stage handles transform).

9. **Add** space+drag panning and keyboard shortcuts for zoom:
```typescript
// New state for panning mode
const [isPanning, setIsPanning] = useState(false)
const isPanningRef = useRef(false)

// Space key for pan mode
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" && !e.repeat && !isPanningRef.current) {
      e.preventDefault()
      isPanningRef.current = true
      setIsPanning(true)
    }
  }
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      isPanningRef.current = false
      setIsPanning(false)
    }
  }
  window.addEventListener("keydown", handleKeyDown)
  window.addEventListener("keyup", handleKeyUp)
  return () => {
    window.removeEventListener("keydown", handleKeyDown)
    window.removeEventListener("keyup", handleKeyUp)
  }
}, [])
```

Add to Stage:
```tsx
<Stage
  // ... existing props
  draggable={isPanning}
  onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
    if (e.target === e.target.getStage()) {
      const stage = e.target.getStage()!
      viewport.panBy(
        stage.x() - viewport.position.x,
        stage.y() - viewport.position.y
      )
    }
  }}
  style={{ cursor: isPanning ? "grab" : "default" }}
>
```

10. **Add** zoom keyboard shortcuts to the handleKeyDown:
```typescript
// Cmd+0 = fit to view
if (isCmd && e.key === "0") {
  e.preventDefault()
  viewport.fitToView()
  return
}
// Cmd+1 = 100%
if (isCmd && e.key === "1") {
  e.preventDefault()
  viewport.resetTo100()
  return
}
```

11. **Add** canvas background color — a Rect behind the image:
```tsx
<Layer listening={false}>
  {/* Canvas background */}
  <Rect
    x={-viewport.position.x / viewport.scale}
    y={-viewport.position.y / viewport.scale}
    width={stageWidth / viewport.scale}
    height={stageHeight / viewport.scale}
    fill="#1e1e1e"
    listening={false}
  />
  <KonvaImage
    image={image}
    width={imageWidth}
    height={imageHeight}
  />
</Layer>
```

12. **Add** ZoomIndicator after the Stage container:
```tsx
<ZoomIndicator
  zoomPercent={viewport.zoomPercent}
  onFitToView={viewport.fitToView}
  onResetTo100={viewport.resetTo100}
  onZoomChange={(percent) => {
    const factor = percent / 100 / viewport.scale
    viewport.zoomAtPoint(stageWidth / 2, stageHeight / 2, factor)
  }}
/>
```

**Step 2: Verify the app runs**

Run: `bun dev`
Open in browser, upload an image, verify:
- Canvas fills the viewport area
- Image is centered with padding
- Scroll wheel zooms at pointer
- Space+drag pans
- Cmd+0 fits, Cmd+1 resets to 100%
- Split lines span the viewport
- Zoom indicator shows percentage

**Step 3: Commit**

```bash
git add src/components/SplitEditor.tsx
git commit -m "feat: refactor SplitEditor to fill viewport with zoom/pan support"
```

---

### Task 4: Update `Ruler.tsx` to support viewport transform

**Files:**
- Modify: `src/components/Ruler.tsx`

**Step 1: Update Ruler props and rendering**

Add `viewportScale` and `viewportOffset` props:

```typescript
interface RulerProps {
  orientation: "horizontal" | "vertical"
  length: number
  viewportScale: number      // NEW: current zoom level
  viewportOffset: number     // NEW: viewport position offset for this axis
  imageSize: number
  thickness?: number
  lines: SplitLine[]
  onDragStart: (orientation: "horizontal" | "vertical") => void
}
```

Update the draw function to render ticks based on visible world range:

```typescript
const draw = useCallback(() => {
  const canvas = canvasRef.current
  if (!canvas) return

  const dpr = window.devicePixelRatio || 1
  const isHorizontal = orientation === "horizontal"
  const w = isHorizontal ? length : thickness
  const h = isHorizontal ? thickness : length

  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`

  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.scale(dpr, dpr)

  // Background
  ctx.fillStyle = RULER_BG
  ctx.fillRect(0, 0, w, h)

  // Calculate visible world range
  const worldStart = -viewportOffset / viewportScale
  const worldEnd = worldStart + length / viewportScale

  // Tick step based on viewport scale (pixels per world unit)
  const step = calculateTickStep(viewportScale)

  ctx.fillStyle = RULER_TEXT
  ctx.strokeStyle = RULER_TICK
  ctx.lineWidth = 0.5
  ctx.font = "9px sans-serif"

  // Start from first visible tick
  const firstTick = Math.floor(worldStart / step) * step

  for (let value = firstTick; value <= worldEnd; value += step) {
    const screenPos = value * viewportScale + viewportOffset
    if (screenPos < 0 || screenPos > length) continue

    if (isHorizontal) {
      ctx.beginPath()
      ctx.moveTo(screenPos, thickness)
      ctx.lineTo(screenPos, thickness * 0.4)
      ctx.stroke()
      ctx.textAlign = "left"
      ctx.textBaseline = "top"
      ctx.fillText(`${Math.round(value)}`, screenPos + 2, 1)
    } else {
      ctx.beginPath()
      ctx.moveTo(thickness, screenPos)
      ctx.lineTo(thickness * 0.4, screenPos)
      ctx.stroke()
      ctx.save()
      ctx.translate(1, screenPos + 2)
      ctx.textAlign = "left"
      ctx.textBaseline = "top"
      ctx.fillText(`${Math.round(value)}`, 0, 0)
      ctx.restore()
    }

    // Minor ticks
    const subStep = step >= 10 ? step / 5 : step / 2
    for (let sub = subStep; sub < step; sub += subStep) {
      const subValue = value + sub
      const subPos = subValue * viewportScale + viewportOffset
      if (subPos < 0 || subPos > length) continue

      if (isHorizontal) {
        ctx.beginPath()
        ctx.moveTo(subPos, thickness)
        ctx.lineTo(subPos, thickness * 0.7)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.moveTo(thickness, subPos)
        ctx.lineTo(thickness * 0.7, subPos)
        ctx.stroke()
      }
    }
  }

  // Line markers (triangles) — convert world pos to screen
  const relevantLines = lines.filter((l) => l.orientation === orientation)
  ctx.fillStyle = RULER_MARKER
  for (const line of relevantLines) {
    const pos = line.position * viewportScale + viewportOffset
    if (pos < 0 || pos > length) continue

    const markerSize = 5
    ctx.beginPath()
    if (isHorizontal) {
      ctx.moveTo(pos - markerSize, thickness)
      ctx.lineTo(pos + markerSize, thickness)
      ctx.lineTo(pos, thickness - markerSize)
    } else {
      ctx.moveTo(thickness, pos - markerSize)
      ctx.lineTo(thickness, pos + markerSize)
      ctx.lineTo(thickness - markerSize, pos)
    }
    ctx.closePath()
    ctx.fill()
  }

  // Border
  ctx.strokeStyle = "#333"
  ctx.lineWidth = 1
  ctx.beginPath()
  if (isHorizontal) {
    ctx.moveTo(0, thickness - 0.5)
    ctx.lineTo(length, thickness - 0.5)
  } else {
    ctx.moveTo(thickness - 0.5, 0)
    ctx.lineTo(thickness - 0.5, length)
  }
  ctx.stroke()
}, [orientation, length, viewportScale, viewportOffset, imageSize, thickness, lines])
```

**Step 2: Update Ruler usage in SplitEditor.tsx**

```tsx
<Ruler
  orientation="horizontal"
  length={stageWidth}
  viewportScale={viewport.scale}
  viewportOffset={viewport.position.x}
  imageSize={imageWidth}
  thickness={RULER_THICKNESS}
  lines={lines}
  onDragStart={startDrag}
/>
<Ruler
  orientation="vertical"
  length={stageHeight}
  viewportScale={viewport.scale}
  viewportOffset={viewport.position.y}
  imageSize={imageHeight}
  thickness={RULER_THICKNESS}
  lines={lines}
  onDragStart={startDrag}
/>
```

**Step 3: Verify rulers scroll with zoom/pan**

Run: `bun dev`
Verify: rulers show correct world coordinates, ticks update as you zoom/pan, line markers track correctly.

**Step 4: Commit**

```bash
git add src/components/Ruler.tsx src/components/SplitEditor.tsx
git commit -m "feat: update Ruler to render based on viewport transform"
```

---

### Task 5: Update `use-ruler-drag.ts` for viewport coordinates

**Files:**
- Modify: `src/hooks/use-ruler-drag.ts`

**Step 1: Add viewport params to the hook**

```typescript
interface UseRulerDragOptions {
  editorRef: React.RefObject<HTMLDivElement | null>
  stageContainerRef: React.RefObject<HTMLDivElement | null>
  viewportScale: number          // NEW: replaces scale
  viewportPosition: { x: number; y: number }  // NEW
  addLineAtPosition: (orientation: "horizontal" | "vertical", position: number) => void
  removeLine: (id: string) => void
  calculateSnap: (position: number, orientation: "horizontal" | "vertical") => number
  canAddHorizontal: boolean
  canAddVertical: boolean
  rulerThickness: number
}
```

**Step 2: Update coordinate conversion in mousemove/mouseup**

In `handleMouseMove`:
```typescript
if (orientation === "horizontal") {
  // Convert screen position to world (image) coordinate
  const stageScreenY = e.clientY - stageRect.top
  const imagePos = (stageScreenY - viewportPosition.y) / viewportScale
  const snapped = calculateSnap(imagePos, "horizontal")
  // Convert back to editor-relative screen position
  const screenPos = (snapped * viewportScale + viewportPosition.y) + (stageRect.top - editorRect.top)
  setPreviewPosition(screenPos)
} else if (orientation === "vertical") {
  const stageScreenX = e.clientX - stageRect.left
  const imagePos = (stageScreenX - viewportPosition.x) / viewportScale
  const snapped = calculateSnap(imagePos, "vertical")
  const screenPos = (snapped * viewportScale + viewportPosition.x) + (stageRect.left - editorRect.left)
  setPreviewPosition(screenPos)
}
```

In `handleMouseUp`:
```typescript
if (isInsideCanvas) {
  let imagePos: number
  if (orientation === "horizontal") {
    imagePos = (e.clientY - stageRect.top - viewportPosition.y) / viewportScale
  } else {
    imagePos = (e.clientX - stageRect.left - viewportPosition.x) / viewportScale
  }
  const snapped = calculateSnap(imagePos, orientation)
  addLineAtPosition(orientation, Math.round(snapped))
}
```

**Step 3: Update the hook call in SplitEditor.tsx**

```typescript
const {
  isDragging,
  dragOrientation,
  previewPosition,
  startDrag,
  isNearRulerZone,
} = useRulerDrag({
  editorRef: editorAreaRef,
  stageContainerRef,
  viewportScale: viewport.scale,
  viewportPosition: viewport.position,
  addLineAtPosition,
  removeLine,
  calculateSnap,
  canAddHorizontal,
  canAddVertical,
  rulerThickness: RULER_THICKNESS,
})
```

**Step 4: Verify ruler drag creates lines at correct positions**

Run: `bun dev`
Verify: drag from ruler creates lines at correct world coordinates when zoomed/panned.

**Step 5: Commit**

```bash
git add src/hooks/use-ruler-drag.ts src/components/SplitEditor.tsx
git commit -m "feat: update ruler drag hook for viewport coordinate conversion"
```

---

### Task 6: Update workspace layout to fill viewport

**Files:**
- Modify: `src/app/workspace/page.tsx`

**Step 1: Make the editor area fill available space**

The workspace main area needs `overflow-hidden` instead of `overflow-y-auto` and the editor should use `flex-1` to fill:

```tsx
<main className="flex-1 flex flex-col overflow-hidden p-4">
  <DynamicSplitEditor
    key={editorKey}
    initialState={initialState}
    showShortcutHints
  />
</main>
```

**Step 2: Verify full viewport behavior**

Run: `bun dev`
Navigate to /workspace, verify:
- Editor fills the available viewport minus sidebar
- No scrollbars on the main area (zoom/pan handles navigation)
- Resize browser window — Stage resizes accordingly

**Step 3: Commit**

```bash
git add src/app/workspace/page.tsx
git commit -m "feat: update workspace layout for full viewport editor"
```

---

### Task 7: Run all tests and fix any regressions

**Files:**
- Possibly modify: any files with broken tests

**Step 1: Run the full test suite**

Run: `bunx vitest run`
Expected: ALL PASS

**Step 2: Fix any failures**

If tests reference the old `scale` prop name or old coordinate calculations, update them to match the new viewport-based approach.

**Step 3: Manual verification checklist**

- [ ] Upload small image (e.g. 100x100) — fills viewport, centered
- [ ] Upload large image (e.g. 4000x3000) — fits in viewport, centered
- [ ] Scroll wheel zooms at pointer position
- [ ] Space+drag pans canvas
- [ ] Cmd+0 fits to view, Cmd+1 goes to 100%
- [ ] Zoom indicator shows correct percentage
- [ ] Click zoom percentage to type custom value
- [ ] Split lines span full viewport
- [ ] Drag from ruler creates lines at correct position
- [ ] Drag lines to ruler deletes them
- [ ] Snap works correctly when zoomed
- [ ] Rulers show correct world coordinates when zoomed/panned
- [ ] Ruler markers track split line positions
- [ ] Generate split works correctly
- [ ] History loading works
- [ ] Undo/redo works

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve test regressions from viewport canvas refactor"
```
