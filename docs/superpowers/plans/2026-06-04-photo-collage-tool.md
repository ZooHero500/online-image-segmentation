# Photo Collage Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-only `/collage` tool for creating template-based photo collages from multiple uploaded images.

**Architecture:** Add a focused collage model and canvas renderer in `src/lib/collage.ts`, template definitions in `src/lib/collage-presets.ts`, and a full-screen editor under `src/components/collage/`. The editor reuses the existing upload, nav, locale, toast, and export patterns from Compress/Watermark/Mosaic while keeping rendering logic shared between preview and download.

**Tech Stack:** Next.js App Router, TypeScript strict mode, React client components, Canvas 2D API, Tailwind CSS v4, next-intl, Bun/Vitest.

---

## File Structure

- Create `src/lib/collage-presets.ts`: normalized template slots, output size presets, and template lookup helpers.
- Create `src/lib/collage.ts`: collage state types, transform helpers, fit/fill math, canvas preview/export renderer, filename/format helpers.
- Create `src/lib/__tests__/collage.test.ts`: unit tests for presets, transforms, filename helpers, and renderer draw operations.
- Create `src/components/collage/DynamicCollageEditor.tsx`: dynamic no-SSR wrapper.
- Create `src/components/collage/CollageEditor.tsx`: full-screen editor UI, uploads, template controls, canvas overlay interaction, settings, and export.
- Create `src/app/[locale]/collage/page.tsx`: localized metadata, JSON-LD, and editor shell.
- Modify `src/lib/tools/catalog.ts`: add `collage` to the single core-tool source and pSEO editor hrefs.
- Modify `src/lib/pseo/index.ts`: register collage pSEO slugs and merge locale page data.
- Create `src/lib/pseo/collage-pages.ts`: 5-language pSEO data for `photo-collage-maker`, `photo-grid-maker`, and `instagram-story-collage`.
- Modify `src/messages/{en,zh-CN,ja,ko,es}.json`: add footer/toolsHub labels and `collage` namespace.
- Modify `src/app/[locale]/tools/page.tsx`: include Collage in JSON-LD item list.
- Modify editor cross-links in `CompressEditor`, `WatermarkEditor`, `MosaicEditor`, and `ResizeEditor` to include Collage where space allows.
- Modify `docs/ideation/PROGRESS.md` and `docs/ideation/2026-05-26-tool-expansion.md`: mark Collage implementation progress after verification.

---

### Task 1: Core Collage Model and Renderer

**Files:**
- Create: `src/lib/collage-presets.ts`
- Create: `src/lib/collage.ts`
- Create: `src/lib/__tests__/collage.test.ts`

- [ ] **Step 1: Write tests for templates, helpers, and canvas rendering**

Create `src/lib/__tests__/collage.test.ts` with tests that assert:
- `COLLAGE_TEMPLATES` includes `two-vertical`, `two-horizontal`, `three-hero`, `three-columns`, `four-grid`, `five-mosaic`, `six-grid`, `story-stack`.
- `createCollageState("four-grid")` creates one frame per template slot and selects the first frame.
- `assignImagesToFrames()` fills empty frames in order.
- `calculateImageTransform()` returns a fill transform that covers the frame.
- `exportCollageImage()` creates a canvas at the selected artboard size, fills the background, clips per frame, draws each assigned image, and passes JPEG/WebP quality to `toBlob`.
- filename helpers map `image/png`, `image/jpeg`, and `image/webp` to `png`, `jpg`, and `webp`.

Run:

```bash
bunx vitest run src/lib/__tests__/collage.test.ts
```

Expected: fail because `src/lib/collage.ts` and `src/lib/collage-presets.ts` do not exist yet.

- [ ] **Step 2: Implement collage presets**

Create `src/lib/collage-presets.ts` with:
- `CollageTemplateId` union.
- `CollageSlot` normalized `{ id, x, y, width, height }`.
- `CollageTemplate` `{ id, labelKey, descriptionKey, imageCount, aspectRatio, slots }`.
- `COLLAGE_TEMPLATES` with the 8 MVP templates.
- `COLLAGE_ARTBOARDS`: square 1080, portrait story 1080x1920, landscape 1600x900, print 2000x2000.
- `getCollageTemplate(templateId)` and `getDefaultArtboardForTemplate(templateId)`.

- [ ] **Step 3: Implement model and renderer**

Create `src/lib/collage.ts` with:
- `CollageOutputFormat = "image/png" | "image/jpeg" | "image/webp"`.
- `CollageFrameImage` with `imageId`, `scale`, `offsetX`, `offsetY`, `rotation`, `fitMode`.
- `CollageFrame` with `id`, `slotId`, and optional image.
- `CollageImageAsset` with `id`, `fileName`, and `HTMLImageElement`.
- `CollageState` with `templateId`, `artboard`, `frames`, `spacing`, `margin`, `cornerRadius`, `backgroundColor`, `transparentBackground`, and `selectedFrameId`.
- `createCollageState(templateId)`, `reframeCollageState(state, templateId)`, `assignImagesToFrames(state, images)`, `updateFrameImage(state, frameId, patch)`.
- `calculateFrameRects(state)`, `calculateImageTransform(image, frame, mode)`, `renderCollageToCanvas(canvas, state, assets)`, `exportCollageImage(state, assets, format, quality)`.
- `getCollageOutputExtension(format)` and `getCollageBaseName(fileNames)`.

- [ ] **Step 4: Verify focused tests**

Run:

```bash
bunx vitest run src/lib/__tests__/collage.test.ts
```

Expected: pass.

---

### Task 2: Collage Editor UI

**Files:**
- Create: `src/components/collage/DynamicCollageEditor.tsx`
- Create: `src/components/collage/CollageEditor.tsx`

- [ ] **Step 1: Build dynamic wrapper**

Create `DynamicCollageEditor.tsx` following the Watermark/Mosaic pattern:
- client component.
- `dynamic(() => import("./CollageEditor").then(...), { ssr: false })`.
- loading fallback reads `useTranslations("collage")` and displays `loadingEditor`.

- [ ] **Step 2: Build upload-empty state**

Create `CollageEditor.tsx` with:
- top nav matching Compress/Mosaic: logo, Split/Grid/Resize/Compress/Watermark/Mosaic/Tools links, active Collage label, compact locale switcher.
- empty state centered in the viewport with `UploadZone onImagesLoaded`.
- upload description from `collage.uploadTitle` and `collage.uploadDescription`.

- [ ] **Step 3: Build editor layout**

After upload:
- left rail on desktop for template buttons, bottom tabs on small screens via responsive stacking.
- center canvas preview with stable max height and border.
- right settings panel for output size, spacing, margin, corner radius, background, selected image controls, format/quality, and download.
- bottom uploaded-photo tray with thumbnails, selected state, add-more input, remove image buttons, and click-to-assign behavior.

- [ ] **Step 4: Add canvas interaction**

Implement pointer handling over an SVG overlay:
- click a frame to select it.
- drag selected frame image to update `offsetX`/`offsetY`.
- use `+`/`-` icon buttons and a range slider to adjust selected image scale.
- provide rotate-left/rotate-right buttons in 90 degree increments.
- provide fit/fill segmented buttons.
- template switches preserve uploaded images by assigning them to the new frames in order.

- [ ] **Step 5: Add export flow**

Implement download:
- call `exportCollageImage(state, assets, outputFormat, quality / 100)`.
- download as `collage.png`, `collage.jpg`, or `collage.webp`.
- show success/error toast.
- disable download while exporting.

- [ ] **Step 6: Verify type/lint pressure locally**

Run:

```bash
bunx vitest run src/lib/__tests__/collage.test.ts
bun run lint
```

Expected: focused tests pass; lint has no new Collage-related errors.

---

### Task 3: Route, Catalog, i18n, and pSEO Integration

**Files:**
- Create: `src/app/[locale]/collage/page.tsx`
- Modify: `src/lib/tools/catalog.ts`
- Modify: `src/app/[locale]/tools/page.tsx`
- Modify: `src/lib/pseo/index.ts`
- Create: `src/lib/pseo/collage-pages.ts`
- Modify: `src/messages/en.json`
- Modify: `src/messages/zh-CN.json`
- Modify: `src/messages/ja.json`
- Modify: `src/messages/ko.json`
- Modify: `src/messages/es.json`

- [ ] **Step 1: Add localized `/collage` route**

Create `src/app/[locale]/collage/page.tsx` following `mosaic/page.tsx`:
- validate locale.
- set request locale.
- metadata namespace `collage.metadata`.
- canonical and alternates for `/collage`.
- JSON-LD `WebApplication` named `ImgSplit Photo Collage Maker`.
- render `<DynamicCollageEditor />` inside a full-height `<main>`.

- [ ] **Step 2: Register core tool**

Update `src/lib/tools/catalog.ts`:
- add `collage` to `CoreToolId`.
- add `collage` to `CoreToolIcon`.
- add `toolCollage` and `existingToolCollageDesc` key unions.
- add a `CORE_TOOLS` entry with `href: "/collage"`, `quickAccessHref: "/collage"`, `sitemapPriority: 0.9`.
- add pSEO mappings:
  - `photo-collage-maker` -> `/collage`
  - `photo-grid-maker` -> `/collage`
  - `instagram-story-collage` -> `/collage?template=story-stack`

- [ ] **Step 3: Add pSEO page data**

Create `src/lib/pseo/collage-pages.ts` exporting `collagePagesByLocale`.
Include 3 slugs in 5 locales:
- `photo-collage-maker`
- `photo-grid-maker`
- `instagram-story-collage`

Each page includes SEO title/description, hero copy, two scenarios, three how-to steps, three FAQ entries, and related tools that point to `/collage`, `/grid`, `/resize`, `/watermark`, or existing pSEO slugs.

Update `src/lib/pseo/index.ts` to import and merge `collagePagesByLocale`, and add the three slugs to `slugMeta`.

- [ ] **Step 4: Add messages**

Update all `src/messages/*.json` files:
- `footer.toolCollage`.
- `toolsHub.existingToolCollage` and `toolsHub.existingToolCollageDesc`.
- `collage.metadata.title`, `collage.metadata.description`.
- editor labels: `loadingEditor`, `uploadTitle`, `uploadDescription`, `replaceImages`, `templates`, `photos`, `settings`, `selectedPhoto`, `outputSize`, `spacing`, `margin`, `cornerRadius`, `background`, `transparent`, `format`, `quality`, `download`, `exporting`, `downloadReady`, `exportFailed`, `previewCanvas`, `addPhotos`, `removePhoto`, `emptyFrame`, `fit`, `fill`, `scale`, `rotateLeft`, `rotateRight`, and template labels/descriptions.

- [ ] **Step 5: Update tools page JSON-LD and cross-links**

Update `src/app/[locale]/tools/page.tsx` JSON-LD item list to include Collage after Mosaic.
Add Collage cross-link in Compress/Mosaic/Watermark/Resize editor navs if it fits without mobile overflow; otherwise keep it in the hidden desktop nav and include Tools link.

- [ ] **Step 6: Verify routing data**

Run:

```bash
bunx vitest run src/lib/__tests__/collage.test.ts
bun run lint
```

Expected: tests pass; lint has no new i18n/catalog/type errors.

---

### Task 4: Final Verification and Progress Docs

**Files:**
- Modify: `docs/ideation/PROGRESS.md`
- Modify: `docs/ideation/2026-05-26-tool-expansion.md`

- [ ] **Step 1: Run full verification**

Run:

```bash
bunx vitest run src/lib/__tests__/collage.test.ts
bun run lint
bun run build
```

Expected: commands pass. If full lint/build fails from pre-existing unrelated issues, capture the exact failures and run the most specific passing checks for changed files.

- [ ] **Step 2: Update ideation progress**

Update `docs/ideation/PROGRESS.md`:
- mark `④ 照片拼图/拼贴` as completed or in-progress depending on verification.
- include actual implemented scope: `/collage`, 8 templates, multi-image upload, per-frame fit/fill/scale/drag/rotate, spacing/margin/radius/background, PNG/JPEG/WebP export, 3 pSEO pages, 5-language messages.
- add a changelog entry dated `2026-06-04`.

Update `docs/ideation/2026-05-26-tool-expansion.md`:
- add landing status under Collage with the same concise scope.

- [ ] **Step 3: Review git diff**

Run:

```bash
git diff --stat
git diff -- src/lib/collage.ts src/components/collage/CollageEditor.tsx src/lib/tools/catalog.ts
git status --short
```

Expected: only Collage-related files and docs changed.

- [ ] **Step 4: Final response**

Report:
- what was built.
- verification commands and exact pass/fail status.
- any known gaps, especially if full build/lint could not complete.
