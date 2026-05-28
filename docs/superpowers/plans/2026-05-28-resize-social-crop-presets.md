# Resize Social Crop Presets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the existing Resize tool with social crop presets and thin pSEO entry points instead of building a separate crop editor.

**Architecture:** Keep the editor inside `src/components/resize`. Add a small preset data module for social sizes and URL preset mapping. pSEO crop pages deep-link into `/resize?crop=...`.

**Tech Stack:** Next.js App Router, React, next-intl, Vitest, Bun.

---

### Task 1: Add Crop Preset Model

**Files:**
- Create: `src/lib/resize-crop-presets.ts`
- Create: `src/lib/__tests__/resize-crop-presets.test.ts`

- [x] Define social crop presets for Instagram post/story, YouTube thumbnail, Facebook cover, X post, and LinkedIn post.
- [x] Add lookup helpers for URL preset slugs and pSEO tool slugs.
- [x] Add Vitest coverage for preset lookup and aspect-ratio calculation.

### Task 2: Wire Presets Into Resize

**Files:**
- Modify: `src/components/resize/ResizeEditor.tsx`
- Modify: `src/components/resize/DynamicResizeEditor.tsx`
- Modify: `src/messages/*.json`

- [x] Read `?crop=` query params and initialize Resize with the matching output dimensions.
- [x] Add a visible Crop toolbar button so crop mode is discoverable without double-clicking.
- [x] Show social crop presets inside crop mode and keep manual ratio buttons.
- [x] Wrap the dynamic Resize editor in `Suspense` because `useSearchParams` is used inside the client editor.
- [x] Add resize crop preset labels in all supported locales.

### Task 3: Add Thin pSEO Crop Entrypoints

**Files:**
- Modify: `src/components/pseo/ToolLanding.tsx`
- Modify: `src/lib/pseo/index.ts`
- Modify: `src/lib/pseo/*.ts`
- Modify: `docs/ideation/PROGRESS.md`

- [x] Map crop pSEO slugs to `/resize?crop=...` editor URLs.
- [x] Add crop landing page data for `crop-image`, `crop-for-instagram`, `instagram-story-crop`, and `youtube-thumbnail-crop`.
- [x] Register crop slugs in the pSEO index.
- [x] Update ideation progress to reflect that item ② is implemented as a Resize enhancement.

### Task 4: Verify And Commit In Batches

**Files:**
- Stage only relevant resize/crop/pSEO/docs files.

- [x] Run targeted Vitest tests with Bun.
- [x] Run targeted ESLint on changed TS/TSX files.
- [x] Commit preset/editor changes.
- [ ] Commit pSEO/docs changes.
