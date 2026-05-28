---
status: pending
priority: p2
issue_id: "001"
tags: [compress, png, wasm, performance]
dependencies: []
---

# Add Professional PNG Compression

## Problem Statement

The current `/compress` PNG path uses browser canvas re-encoding only. This preserves privacy and avoids server upload, but it is not a real PNG optimizer and often cannot reduce PNG file size.

Current behavior:
- JPEG/WebP output uses `canvas.toBlob(format, quality)`, so quality settings usually reduce file size.
- PNG output uses `canvas.toBlob("image/png")`; browser canvas does not expose PNG filter, zlib level, palette quantization, or metadata stripping controls.
- If a PNG re-encode is larger than the original PNG, the tool returns the original file to avoid making "compressed" output bigger.

This creates a product gap: users expect "compress PNG" to reduce file size, but optimized PNGs or complex screenshots may remain unchanged.

## Findings

- Core implementation lives in `src/lib/compress.ts`.
- PNG compression is currently a safe browser-native re-encode plus "do not make larger" fallback.
- Real PNG optimization generally requires:
  - Lossless optimization: filter selection, zlib/deflate tuning, chunk cleanup, metadata stripping.
  - Lossy quantization: reduce colors to a palette, optionally with dithering, while preserving transparency.
- Browser canvas cannot perform professional PNG optimization by itself.
- Server-side compression is possible in Next.js Node runtime, but it conflicts with the product's current "100% browser-based / no upload" privacy positioning.
- Browser-side WASM keeps the privacy promise, but adds bundle size, CPU cost, memory pressure, and mobile performance risk.

## Proposed Solutions

### Option 1: Browser WASM Lossless PNG Optimizer

**Approach:** Dynamically load a WASM optimizer such as OxiPNG only when users select PNG optimization. Run it in a Web Worker.

**Pros:**
- Keeps files local and preserves the privacy promise.
- No server cost.
- Output is visually identical.
- Good first step for "safe PNG optimization."

**Cons:**
- Compression gains are often modest.
- WASM download may be several hundred KB compressed.
- Large images can consume significant memory and CPU.
- Needs careful worker lifecycle and progress/error handling.

**Effort:** 1-2 days

**Risk:** Medium

---

### Option 2: Browser WASM Lossy PNG Quantization

**Approach:** Add a WASM quantizer such as pngquant/libimagequant. Use a quality or color-count control, then optionally pass output through a lossless optimizer.

**Pros:**
- Can produce meaningful PNG size reductions.
- Still browser-local and privacy preserving.
- Better matches user expectations for "compress PNG."

**Cons:**
- Output is lossy; gradients, photos, shadows, and fine color detail can degrade.
- Needs preview/compare UX and clear labeling.
- WASM plus image buffers can be heavy on mobile.
- More complicated settings: quality range, color count, dithering, alpha handling.

**Effort:** 3-5 days

**Risk:** Medium-High

---

### Option 3: Next.js Node API Compression

**Approach:** Upload images to a Node runtime API route and process with `sharp`, `pngquant`, `oxipng`, or equivalent server-side tooling.

**Pros:**
- Mature tooling and better compression reliability.
- Easier to tune performance on server hardware.
- Avoids shipping large WASM codecs to every client.

**Cons:**
- Breaks the current "files never leave your device" promise unless positioned as an explicit opt-in.
- Requires upload limits, temp-file handling, abuse protection, privacy policy updates, and server cost planning.
- Next.js route must use Node runtime, not Edge runtime.

**Effort:** 2-4 days for an opt-in MVP; more for production hardening

**Risk:** Medium-High

---

### Option 4: Product Copy Only

**Approach:** Keep current PNG behavior and label it as "PNG safe optimization" or "PNG re-encode, avoids larger output." Continue recommending WebP for meaningful size reduction.

**Pros:**
- Lowest engineering cost.
- Avoids performance and privacy risks.
- Sets accurate user expectations.

**Cons:**
- Does not solve the underlying PNG compression limitation.
- Users looking for strong PNG compression may be disappointed.

**Effort:** 1-2 hours

**Risk:** Low

## Recommended Action

Pending triage.

Suggested path when ready:
1. Keep WebP as the default recommendation for meaningful compression.
2. Add an opt-in "Advanced PNG optimization" mode behind dynamic loading.
3. Start with browser-side lossless OxiPNG WASM in a Web Worker.
4. Add lossy quantization only after validating performance and output quality on representative PNGs.
5. Preserve clear UX copy: "Lossless PNG optimization may save little on already optimized files."

## Technical Details

Affected files and areas:
- `src/lib/compress.ts` - current browser canvas compression logic.
- `src/components/compress/CompressEditor.tsx` - orchestration, processing state, and batch behavior.
- `src/components/compress/CompressControls.tsx` - future PNG optimization mode controls.
- `src/components/compress/CompressPreview.tsx` - before/after comparison and warnings.
- `src/lib/__tests__/compress.test.ts` - current tests for canvas behavior.
- `src/lib/pseo/*.ts` - landing copy must match actual PNG behavior.

Potential browser WASM architecture:
- Add `src/lib/png-optimizer.ts` as a small facade.
- Add a Web Worker for CPU-heavy optimization.
- Dynamically import the optimizer only when PNG optimization is requested.
- Keep the main `/compress` bundle free of PNG WASM codecs.
- Enforce max dimensions/file size for advanced PNG optimization.
- Add cancellation when users change format/quality or remove images.

Approximate resource concerns:
- WASM download: likely hundreds of KB to a few MB depending on codec combination.
- Decoded RGBA memory: `width * height * 4`; a 4000x3000 image is about 48MB before intermediate buffers.
- Actual peak memory can be 2x-6x decoded image size due to input, output, and codec working buffers.

Server-side considerations if chosen:
- Use `export const runtime = "nodejs"` in the API route.
- Avoid Edge runtime for native image tooling.
- Add upload size limits, rate limits, temp cleanup, and explicit privacy messaging.
- Consider `sharp().png({ compressionLevel: 9, adaptiveFiltering: true, palette: true, quality, effort })`.

## Resources

- Current PNG implementation: `src/lib/compress.ts`
- Current focused tests: `src/lib/__tests__/compress.test.ts`
- Candidate tools to evaluate:
  - OxiPNG / OxiPNG WASM for lossless PNG optimization.
  - pngquant / libimagequant WASM for lossy PNG quantization.
  - sharp for server-side Node runtime optimization.
  - Squoosh-style codec loading as a reference pattern, not necessarily a direct dependency.

## Acceptance Criteria

- [ ] Product decision made: browser WASM, server-side opt-in, or copy-only.
- [ ] PNG mode copy accurately describes the implemented behavior.
- [ ] Advanced PNG optimizer is dynamically loaded and not included in the initial page bundle.
- [ ] Heavy PNG processing runs off the main thread.
- [ ] Large image limits and graceful error messages are implemented.
- [ ] Batch processing supports cancellation/stale-result protection.
- [ ] Before/after preview shows when PNG output is unchanged or larger.
- [ ] Tests cover PNG unchanged, PNG reduced, failed optimization, cancellation/stale result, and batch behavior.
- [ ] Browser performance checked on desktop and a constrained mobile viewport/device.
- [ ] If server-side processing is selected, privacy copy and upload handling are updated before release.

## Work Log

### 2026-05-28 - Initial Discovery

**By:** Codex

**Actions:**
- Reviewed why PNG output often remains unchanged with the current canvas-based compressor.
- Documented the difference between browser canvas re-encoding and professional PNG optimization.
- Captured browser WASM and Next.js Node server alternatives for future implementation.

**Learnings:**
- Current PNG path is intentionally conservative: it returns the original PNG when re-encoding would increase file size.
- Professional PNG compression requires either WASM codecs in the browser or server-side tooling.
- WASM is compatible with the privacy-first product direction, but must be lazy-loaded and worker-backed.

## Notes

- Do not bundle PNG optimizer WASM into the default `/compress` route load.
- Prefer explicit labels: "PNG lossless optimize" and "PNG lossy compress" instead of one ambiguous "PNG quality" slider.
- Keep WebP as the easiest path for large visible file-size reductions.
