# Resize Editor Interaction Polish — Design Spec

## Goal

Elevate the resize editor from functional MVP to professional-quality tool with proper viewport control, snap alignment, visual feedback, and status information.

## Scope

### Tier 1: Must Have

**1. Viewport Zoom & Pan**
- Scroll wheel zoom at cursor point (zoom-at-point math from `use-canvas-viewport.ts`)
- Space + drag to pan the canvas viewport
- Zoom range: 10% – 500%
- Keyboard: Cmd+/Cmd- zoom, Cmd+0 fit-to-view
- Reuse/adapt existing `ZoomIndicator` component (fit + 100% + editable percentage)

**2. Magnetic Snap**
- Image drag snaps to: artboard 4 edges + horizontal center + vertical center (6 snap targets)
- Snap threshold: 8px screen pixels (divided by viewScale for world-space comparison)
- Blue guide lines appear on snap (extend across artboard)
- Adapt existing `calculateImageSnap` logic from SplitEditor

**3. Drag Visual Feedback**
- Hover image: cursor `grab`
- Dragging image: cursor `grabbing`, 4px blue shadow on image
- Transformer corners: cursor `nwse-resize` / `nesw-resize`
- Crop mode: cursor `crosshair`
- Space pan: cursor `grab` → `grabbing`

**4. Status Bar**
- Bottom bar: image original dimensions | canvas size | current zoom %
- Crop mode: additionally show crop region dimensions

### Tier 2: Should Have

**5. Checkerboard Background**
- Artboard areas not covered by image show gray/white checkerboard pattern (Konva Rect fill pattern)

**6. Undo/Redo**
- Track transform changes using existing `use-undo-redo<T>` hook
- Cmd+Z / Cmd+Shift+Z
- Only track meaningful changes (drag end, transform end, crop apply, canvas size change)

**7. Selection State Enhancement**
- Transformer anchor points: 8x8 rounded-corner blue squares
- Selection border: 1px blue dashed line
- Crop handles: slightly larger (12x12) with drop shadow

## Architecture

### New hook: `use-resize-viewport.ts`
Manages viewport zoom/pan state for the resize editor. Wraps the zoom-at-point math.
- State: `{ zoom: number, panX: number, panY: number }`
- Methods: `zoomAtPoint()`, `pan()`, `fitToView()`, `resetTo100()`
- Replaces the current fixed `viewScale` calculation in ResizeCanvas

### Modified: `use-resize-editor.ts`
- Wrap `transform` state with `useUndoRedo<ResizeImageTransform>`
- Expose `undo`, `redo`, `canUndo`, `canRedo`

### New utility: `resize-snap.ts`
- `calculateSnapGuides(imageRect, artboardRect, threshold)` → `{ snappedX, snappedY, guides[] }`
- Pure function, testable

### Modified: `ResizeCanvas.tsx`
- Add wheel handler → `viewport.zoomAtPoint()`
- Add Space+drag pan
- Add snap calculation on image drag move
- Add snap guide line rendering
- Add cursor management via container ref
- Add checkerboard background pattern
- Replace fixed viewScale with viewport hook

### New: `ResizeStatusBar.tsx`
- Displays image info, canvas size, zoom level, crop dimensions

### Modified: `ResizeEditor.tsx`
- Add undo/redo keyboard shortcuts
- Add zoom keyboard shortcuts
- Wire up status bar

### Modified: `ZoomIndicator` or new `ResizeZoomControls.tsx`
- Adapt existing ZoomIndicator for resize editor's viewport hook interface

## Unchanged

- `CropOverlay.tsx` — only minor handle size tweak
- `CanvasSizeControl.tsx` — no changes
- `resize-utils.ts`, `resize-export.ts` — no changes
- i18n — add a few new keys for status bar labels

## File Map

```
Modified:
  src/components/resize/ResizeCanvas.tsx    — viewport, snap, cursors, checkerboard
  src/components/resize/ResizeEditor.tsx    — keyboard shortcuts, status bar, undo
  src/components/resize/CropOverlay.tsx     — handle size tweak
  src/hooks/use-resize-editor.ts            — undo/redo wrapping

New:
  src/hooks/use-resize-viewport.ts          — zoom/pan state
  src/lib/resize-snap.ts                    — snap calculation (pure, testable)
  src/lib/__tests__/resize-snap.test.ts     — snap tests
  src/components/resize/ResizeStatusBar.tsx  — bottom status bar
```
