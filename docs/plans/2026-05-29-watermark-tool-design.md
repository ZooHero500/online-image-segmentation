# Watermark Tool Design

> Date: 2026-05-29
> Status: Approved for implementation planning
> Scope: Standalone image watermark tool. Privacy mosaic/blur remains a separate future tool.

## Goal

Build a dedicated `/watermark` tool for adding professional watermarks to images in the browser. The tool should help users quickly protect or brand images with text, logo, and repeated watermark templates while keeping files local.

## Product Scope

The watermark tool solves ownership and branding tasks:

- Add copyright, account name, brand name, or usage notice to an image.
- Add a logo or image watermark.
- Choose from templates instead of building every layout from scratch.
- Adjust angle, opacity, scale, spacing, color, and text content.
- Stack multiple watermark layers when needed.
- Export the final image without uploading it to a server.

Privacy masking, mosaic brushes, blur brushes, face redaction, and EXIF cleaning are intentionally out of scope. They belong to the later privacy/mosaic tool because the user intent is different: hiding information rather than showing ownership.

## Recommended Architecture

Use a standalone Konva-based editor, not the existing Resize tool. Resize remains focused on artboard/crop workflows; watermarking gets its own route, component tree, and state model.

The first version should be template-driven:

1. User uploads an image.
2. User selects a watermark template.
3. The selected template creates one or more watermark layers.
4. User edits layer settings in a side panel.
5. User drags single watermark layers directly on the canvas when the layer is not repeated.
6. Export redraws the base image and all watermark layers to an offscreen canvas.

## Tech Stack

- Next.js 16 App Router
- React 19 client components
- `react-konva` / `konva` for editor preview and drag interaction
- Browser Canvas 2D for final export
- Existing `UploadZone`, `upload-utils`, and i18n patterns
- Existing `zip-exporter` later if batch export is added
- `bun` for scripts and verification

## Routes and Files

Planned new files:

- `src/app/[locale]/watermark/page.tsx`
- `src/components/watermark/DynamicWatermarkEditor.tsx`
- `src/components/watermark/WatermarkEditor.tsx`
- `src/components/watermark/WatermarkCanvas.tsx`
- `src/components/watermark/WatermarkControls.tsx`
- `src/components/watermark/WatermarkTemplatePicker.tsx`
- `src/lib/watermark.ts`
- `src/lib/watermark-presets.ts`
- `src/lib/__tests__/watermark.test.ts`

Planned modified files:

- `src/messages/en.json`
- `src/messages/zh-CN.json`
- `src/messages/ja.json`
- `src/messages/ko.json`
- `src/messages/es.json`
- `src/lib/pseo/index.ts`
- `src/lib/pseo/en.ts`
- `src/lib/pseo/zh-CN.ts`
- `src/lib/pseo/ja.ts`
- `src/lib/pseo/ko.ts`
- `src/lib/pseo/es.ts`
- `src/app/sitemap.ts`
- `src/app/[locale]/tools/page.tsx`
- Landing/footer/nav surfaces that already list tool links

## Watermark Model

Watermark state should be plain serializable data. Konva nodes are only the view layer.

```ts
export type WatermarkLayerType = "text" | "image"
export type WatermarkRepeatMode = "single" | "repeat"

export interface WatermarkLayer {
  id: string
  type: WatermarkLayerType
  repeatMode: WatermarkRepeatMode
  text?: string
  imageSrc?: string
  imageName?: string
  x: number
  y: number
  width?: number
  height?: number
  rotation: number
  opacity: number
  fontSize: number
  fontFamily: string
  color: string
  spacingX: number
  spacingY: number
  enabled: boolean
}
```

This avoids coupling export logic to Konva internals and makes future batch export possible.

## Template Set

Initial templates should cover the most common jobs:

- Corner copyright text: bottom-right text, low opacity.
- Center logo mark: single centered logo/text mark.
- Diagonal repeated copyright: repeated text across the image.
- Dense anti-theft pattern: high-density repeated text.
- Brand badge: logo-like text plus smaller caption.
- Subtle full-image protection: large low-opacity diagonal text.

Templates should be presets that create layer data. Users can still edit the generated layers.

## Interaction Design

The editor should behave like a focused production tool:

- Empty state: upload area with a clear watermark-oriented title.
- After upload: canvas in the center, controls in a side panel.
- Template picker: visible early, because templates are the fastest path to value.
- Layer controls: text/logo content, opacity, rotation, scale/font size, color, repeat toggle, spacing.
- Single layers: draggable on canvas.
- Repeated layers: not draggable per tile; position and spacing are controlled from the panel.
- Multiple layers: allow add, duplicate, delete, enable/disable, and select layer.

Do not add a full Photoshop-style layer panel in the first version unless the simple layer list becomes insufficient.

## Export Design

Export should use an offscreen canvas:

1. Create a canvas at the source image's natural dimensions.
2. Draw the base image.
3. Draw each enabled watermark layer in order.
4. For single layers, map preview coordinates back to source-image coordinates.
5. For repeated layers, draw tiled text/image marks using `spacingX`, `spacingY`, `rotation`, and `opacity`.
6. Export to PNG/JPEG/WebP using `toBlob()`.

Preview and export must share the same coordinate model and layer data to avoid mismatches.

## SEO and Integration

Add the base `/watermark` tool and pSEO landing pages such as:

- `add-watermark-to-photo`
- `text-watermark-tool`
- `photo-logo-watermark`
- `copyright-watermark`

Landing pages should route users to `/watermark` with optional template/query presets later. First implementation may link to `/watermark` without deep preset params if the editor template picker is strong enough.

## Risks

- Text rendering can differ slightly between Konva and Canvas 2D export. Keep font choices simple and test common browsers.
- Repeated watermark previews can become expensive on very large images. Cap visible tiles in preview if needed, but export all tiles.
- Logo watermarks need image loading state and object URL cleanup.
- Mobile controls can become cramped. Keep controls compact and avoid desktop-only interaction.

## Non-Goals

- Privacy mosaic, blur brush, and freehand redaction.
- Server-side Sharp processing.
- Full layer effects, masks, blend modes, or advanced typography.
- Batch processing in the first cut unless the core single-image editor is already stable.

## Success Criteria

- User can upload one image, choose a template, edit text/logo settings, drag a single watermark, and export the final image.
- Repeated text watermark supports opacity, rotation, spacing, color, and content edits.
- Multiple watermark layers can be stacked and toggled.
- The tool is browser-only and does not upload files.
- The route, tools hub, pSEO pages, sitemap, metadata, and 5-language i18n are wired consistently with existing tools.
