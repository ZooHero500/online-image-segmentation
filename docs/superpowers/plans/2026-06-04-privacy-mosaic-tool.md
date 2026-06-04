# Privacy Mosaic Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-only `/mosaic` tool for redacting sensitive image regions with mosaic, blur, or solid cover effects.

**Architecture:** Add a standalone editor instead of extending Resize or Watermark. Store redaction regions as source-image pixel coordinates, render previews and exports through Canvas 2D, and use a lightweight SVG overlay for drawing and resizing rectangles.

**Tech Stack:** Next.js 16 App Router, React 19, next-intl, Browser Canvas 2D, existing upload utilities, Vitest, Bun.

---

## File Structure

- Create `src/lib/privacy-mask.ts`: serializable region model, effect rendering, export helpers.
- Create `src/lib/__tests__/privacy-mask.test.ts`: tests for model helpers and canvas export behavior.
- Create `src/app/[locale]/mosaic/page.tsx`: localized tool route and metadata.
- Create `src/components/mosaic/DynamicMosaicEditor.tsx`: client-only editor loader.
- Create `src/components/mosaic/MosaicEditor.tsx`: upload, preview, SVG rectangle overlay, controls, export.
- Create `src/lib/pseo/mosaic-pages.ts`: four landing pages across supported locales.
- Modify `src/lib/pseo/index.ts`: register mosaic pSEO pages.
- Modify `src/lib/tools/catalog.ts`: add mosaic to core tools and editor hrefs.
- Modify `src/components/ReturningUserToolbar.tsx`: add icon mapping.
- Modify `src/app/[locale]/tools/page.tsx`: include mosaic in tools JSON-LD.
- Modify `src/messages/*.json`: add footer/tools/editor strings.
- Modify editor navs in Compress/Resize/Watermark if needed so `/mosaic` is reachable from tool chrome.
- Modify `docs/ideation/PROGRESS.md`: update progress after implementation.

## Task 1: Core Privacy Mask Model and Export

**Files:**
- Create: `src/lib/__tests__/privacy-mask.test.ts`
- Create: `src/lib/privacy-mask.ts`

- [ ] **Step 1: Write failing model/export tests**

Tests should cover:
- default mosaic region creation
- normalizing negative drag rectangles into clamped image coordinates
- updating only one selected region
- exporting through `toBlob`
- solid cover drawing via `fillRect`

- [ ] **Step 2: Run the new test and verify RED**

Run: `bunx vitest run src/lib/__tests__/privacy-mask.test.ts`

Expected: fail because `src/lib/privacy-mask.ts` does not exist yet.

- [ ] **Step 3: Implement `src/lib/privacy-mask.ts`**

Add typed helpers:
- `createPrivacyMaskRegion`
- `createPrivacyMaskState`
- `normalizePrivacyMaskRegion`
- `updatePrivacyMaskRegion`
- `removePrivacyMaskRegion`
- `getEnabledPrivacyMaskRegions`
- `renderPrivacyMaskToCanvas`
- `exportPrivacyMaskedImage`
- `getPrivacyMaskBaseName`
- `getPrivacyMaskOutputExtension`

- [ ] **Step 4: Run the test and verify GREEN**

Run: `bunx vitest run src/lib/__tests__/privacy-mask.test.ts`

Expected: pass.

## Task 2: Standalone Mosaic Editor

**Files:**
- Create: `src/components/mosaic/DynamicMosaicEditor.tsx`
- Create: `src/components/mosaic/MosaicEditor.tsx`
- Create: `src/app/[locale]/mosaic/page.tsx`

- [ ] **Step 1: Add route and dynamic loader**

Create a localized `/mosaic` page with WebApplication JSON-LD and dynamic client editor loading.

- [ ] **Step 2: Add editor shell**

Use the existing full-screen tool chrome pattern:
- upload empty state
- central preview canvas
- right-side controls
- format/quality controls
- download action

- [ ] **Step 3: Add rectangle overlay interactions**

Use an SVG overlay above the canvas:
- drag empty area to create a region
- click a region to select it
- drag selected region to move it
- drag corner handles to resize it
- delete selected region

- [ ] **Step 4: Connect preview and export**

Preview uses `renderPrivacyMaskToCanvas`; download uses `exportPrivacyMaskedImage`.

## Task 3: Navigation, i18n, and Tool Catalog

**Files:**
- Modify: `src/messages/en.json`
- Modify: `src/messages/zh-CN.json`
- Modify: `src/messages/ja.json`
- Modify: `src/messages/ko.json`
- Modify: `src/messages/es.json`
- Modify: `src/lib/tools/catalog.ts`
- Modify: `src/components/ReturningUserToolbar.tsx`
- Modify: `src/app/[locale]/tools/page.tsx`
- Modify: `src/components/compress/CompressEditor.tsx`
- Modify: `src/components/resize/ResizeEditor.tsx`
- Modify: `src/components/watermark/WatermarkEditor.tsx`

- [ ] **Step 1: Add localized editor strings**

Add `mosaic` namespace for upload, controls, status, metadata, and toast messages.

- [ ] **Step 2: Add footer/tools hub strings**

Add `toolMosaic`, `existingToolMosaic`, and `existingToolMosaicDesc` keys.

- [ ] **Step 3: Wire tool catalog and visible nav**

Add `/mosaic` to `CORE_TOOLS`, editor quick links, toolbar icon mapping, and tool chrome nav.

## Task 4: pSEO Pages

**Files:**
- Create: `src/lib/pseo/mosaic-pages.ts`
- Modify: `src/lib/pseo/index.ts`

- [ ] **Step 1: Add mosaic pSEO data**

Create pages:
- `blur-face`
- `blur-face-in-photo`
- `pixelate-image`
- `pixelate-image-online`
- `censor-image-online`
- `mosaic-tool`
- `redact-image`
- `redact-image-online`

DataForSEO follow-up (2026-06-04, US / English) added the higher-volume `blur-face`, `pixelate-image`, `censor-image-online`, and `redact-image` targets while retaining the initial four slugs.

- [ ] **Step 2: Register pSEO pages**

Merge the new locale page data into `localeData`, append the eight slugs to `slugMeta`, and map each slug to `/mosaic` in `TOOL_EDITOR_HREFS`.

## Task 5: Verification and Progress

**Files:**
- Modify: `docs/ideation/PROGRESS.md`

- [ ] **Step 1: Run targeted tests**

Run: `bunx vitest run src/lib/__tests__/privacy-mask.test.ts`

- [ ] **Step 2: Run lint/build**

Run: `bun run lint`

Run: `bun run build`

- [ ] **Step 3: Browser verification**

Start the dev server and open `/mosaic` in the in-app browser. Verify the route loads and the editor preview is visible.

- [ ] **Step 4: Update progress**

Mark the privacy mosaic tool as completed or partially completed depending on verification results.
