# SEO Analysis Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the actionable findings from `/Users/wuzhiqiang/Downloads/imgsplit.com_SEOAnalysisSummary_2026_06_08.csv`: short meta descriptions, missing IndexNow support, and weak backlink execution.

**Architecture:** Treat SEO metadata as testable content data, not scattered manual copy. Add a focused metadata quality test, expand only the English pSEO descriptions currently below the likely scanner threshold, add a tiny IndexNow integration, and capture backlink work as an operations checklist outside runtime code.

**Tech Stack:** Next.js App Router, TypeScript, Bun, Vitest, next-intl, static public files/routes.

---

## File Structure

- Modify `src/lib/pseo/en.ts`: expand English pSEO `seo.description` strings for the image split, crop, conversion, and social size pages that are below the scanner threshold.
- Modify `src/lib/pseo/collage-pages.ts`: expand English seed descriptions for collage pSEO pages that are below the scanner threshold.
- Modify `src/lib/pseo/mosaic-pages.ts`: expand English seed descriptions for privacy masking pSEO pages that are below the scanner threshold.
- Modify `src/lib/pseo/watermark-pages.ts`: expand English seed descriptions for watermark pSEO pages that are below the scanner threshold.
- Modify `src/lib/pseo/social-export-pages.ts`: expand English seed descriptions for social export pSEO pages that are below the scanner threshold.
- Modify `src/lib/pseo/background-removal-pages.ts`: expand English seed descriptions for background removal pSEO pages if any English entries remain below the threshold.
- Create `src/lib/__tests__/pseo-metadata.test.ts`: verify English pSEO meta descriptions stay in the target range and include privacy/browser/export language.
- Create `public/imgsplit-indexnow-2026.txt`: expose the IndexNow key file at `https://imgsplit.com/imgsplit-indexnow-2026.txt`.
- Create `scripts/ping-indexnow.mjs`: submit changed public URLs to the IndexNow endpoint after deploy or major content updates.
- Modify `package.json`: add a `seo:indexnow` script using Bun.
- Create `docs/seo/backlink-outreach.md`: list concrete backlink targets, page angles, and tracking fields.

---

### Task 1: Add Metadata Quality Test

**Files:**
- Create: `src/lib/__tests__/pseo-metadata.test.ts`

- [ ] **Step 1: Write the failing metadata quality test**

Create `src/lib/__tests__/pseo-metadata.test.ts` with this content:

```ts
import { describe, expect, it } from "vitest"
import { getAllToolPages } from "@/lib/pseo"

const MIN_META_DESCRIPTION_LENGTH = 135
const MAX_META_DESCRIPTION_LENGTH = 165

const privacySignals = [
  "browser",
  "private",
  "privacy",
  "no upload",
  "without uploading",
  "local",
]

describe("pSEO metadata", () => {
  it("keeps English meta descriptions within a useful SERP range", () => {
    const shortDescriptions = getAllToolPages()
      .map((page) => ({
        slug: page.slug,
        description: page.locales.en?.seo.description ?? "",
      }))
      .filter(({ description }) => description.length > 0)
      .filter(
        ({ description }) =>
          description.length < MIN_META_DESCRIPTION_LENGTH ||
          description.length > MAX_META_DESCRIPTION_LENGTH
      )

    expect(shortDescriptions).toEqual([])
  })

  it("keeps English meta descriptions aligned with the privacy-first product promise", () => {
    const missingPrivacySignal = getAllToolPages()
      .map((page) => ({
        slug: page.slug,
        description: page.locales.en?.seo.description ?? "",
      }))
      .filter(({ description }) => description.length > 0)
      .filter(({ description }) => {
        const normalized = description.toLowerCase()
        return !privacySignals.some((signal) => normalized.includes(signal))
      })

    expect(missingPrivacySignal).toEqual([])
  })
})
```

- [ ] **Step 2: Run the new test and confirm the current failure**

Run:

```bash
bun test src/lib/__tests__/pseo-metadata.test.ts
```

Expected: FAIL. The output should list multiple English pSEO pages whose descriptions are shorter than `135` characters.

- [ ] **Step 3: Commit the failing test if working in a feature branch**

Only run this after creating or switching to an isolated branch/worktree:

```bash
git add src/lib/__tests__/pseo-metadata.test.ts
git commit -m "test: add pseo metadata quality guard"
```

Expected: commit succeeds.

---

### Task 2: Expand Short English pSEO Meta Descriptions

**Files:**
- Modify: `src/lib/pseo/en.ts`
- Modify: `src/lib/pseo/collage-pages.ts`
- Modify: `src/lib/pseo/mosaic-pages.ts`
- Modify: `src/lib/pseo/watermark-pages.ts`
- Modify: `src/lib/pseo/social-export-pages.ts`
- Modify: `src/lib/pseo/background-removal-pages.ts`

- [ ] **Step 1: Generate the exact list of English descriptions below the threshold**

Run:

```bash
bun --print 'import { getAllToolPages } from "./src/lib/pseo/index.ts"; const rows=[]; for (const page of getAllToolPages()) { const data=page.locales.en; if (data && data.seo.description.length < 135) rows.push({slug:page.slug,len:data.seo.description.length,desc:data.seo.description}); } rows.sort((a,b)=>a.len-b.len); console.log(rows.map(r=>`${r.len} /${r.slug} ${r.desc}`).join("\n"))'
```

Expected: the list includes at least these URLs from the June 8, 2026 scan: `/youtube-thumbnail-crop`, `/crop-for-instagram`, `/youtube-thumbnail-size`, `/instagram-story-crop`, `/resize-image-for-social-media`, `/twitter-header-size`, `/free-photo-collage-maker`, `/crop-image`, `/social-media-image-resizer`, `/instagram-story-size`, `/linkedin-post-size`, `/instagram-image-size`, `/photo-grid-maker`, `/instagram-story-collage`, `/picture-grid-maker`, `/instagram-collage-maker`, `/facebook-cover-photo-size`, `/watermark-maker`, `/online-watermark-tool`, `/pixelate-image-online`, `/mosaic-tool`, `/photo-collage-maker`, `/wechat-cover-size`, `/redact-image`, `/social-media-image-sizes`, `/add-watermark-to-image`, `/webp-to-jpg`, `/redact-image-online`, `/censor-image-online`.

- [ ] **Step 2: Update each short description to 135-165 characters**

Use these replacement descriptions where the slugs match. Keep punctuation ASCII and keep each string on one line.

```ts
const replacements: Record<string, string> = {
  "youtube-thumbnail-crop": "Crop images to YouTube thumbnail size online with a 1280 x 720 16:9 preset, private browser editing, no upload, and instant export.",
  "crop-for-instagram": "Crop images to Instagram post size online with a 1080 x 1080 square preset, private browser editing, no upload, and fast export.",
  "youtube-thumbnail-size": "Resize images to the 1280x720 YouTube thumbnail size, adjust crop placement, and export private browser-based social companion images.",
  "instagram-story-crop": "Crop images to Instagram Story size online with a 1080 x 1920 vertical preset, private browser editing, no upload, and clean export.",
  "resize-image-for-social-media": "Resize one image for Instagram, YouTube, Facebook, X/Twitter, LinkedIn, and TikTok in one private browser workflow with ZIP export.",
  "twitter-header-size": "Create a 1500x500 Twitter/X header image from one source image with crop control, private browser processing, and instant export.",
  "free-photo-collage-maker": "Make a free photo collage online with templates, grid layouts, spacing, backgrounds, private browser export, and no account required.",
  "crop-image": "Crop images online to exact social media sizes for Instagram, YouTube, Facebook, and more with private browser editing and no upload.",
  "social-media-image-resizer": "Resize one image for multiple social media platforms and download every output as a ZIP with private browser-based processing.",
  "instagram-story-size": "Resize an image to the 1080x1920 Instagram Story size, adjust the crop, and export optional feed companion images in your browser.",
  "linkedin-post-size": "Resize one image to the 1200x628 LinkedIn post size, adjust crop placement, and export companion social sizes in your browser.",
  "instagram-image-size": "Create Instagram feed square, feed portrait, Story, and Reel image sizes from one source image with private browser export.",
  "photo-grid-maker": "Make a photo grid online with 2, 3, 4, 5, or 6-image layouts, adjustable spacing, margins, backgrounds, and private export.",
  "instagram-story-collage": "Create a 1080x1920 Instagram Story collage online with story templates, spacing, backgrounds, private browser export, and no upload.",
  "picture-grid-maker": "Create a picture grid online for product sets, moodboards, portfolios, and social posts with adjustable spacing and private export.",
  "instagram-collage-maker": "Create Instagram collages for posts, stories, recaps, and product sets using square or vertical templates with private browser export.",
  "facebook-cover-photo-size": "Create Facebook Page cover photo exports and optional group cover companions from one source image in a free private browser tool.",
  "watermark-maker": "Create text and logo watermarks online with opacity, repeat, position, and export controls in a free private browser-based maker.",
  "online-watermark-tool": "Use a free online watermark tool to add text, logo, copyright, or repeated watermarks to images with private browser editing.",
  "pixelate-image-online": "Pixelate parts of an image online with adjustable mosaic blocks to hide private details in photos and screenshots without upload.",
  "mosaic-tool": "Use a free online mosaic tool to cover sensitive image details with mosaic, blur, and solid cover modes in your browser.",
  "photo-collage-maker": "Create photo collages online with templates, spacing, backgrounds, browser-based export, no upload, and no account required.",
  "wechat-cover-size": "Create a wide WeChat article cover from one image and export companion social platform sizes in a private browser workflow.",
  "redact-image": "Redact image details with solid cover, mosaic, blur, brush masks, or custom image overlays before sharing private content.",
  "social-media-image-sizes": "Create current social media image sizes for Instagram, YouTube, Facebook, X, LinkedIn, and TikTok from one private browser editor.",
  "add-watermark-to-image": "Add text or logo watermarks to PNG, JPG, and WebP images online with opacity, repeat controls, and private browser processing.",
  "webp-to-jpg": "Convert WebP images to JPG online for maximum compatibility with private browser processing, no upload, and instant download.",
  "redact-image-online": "Redact image areas online with solid cover, mosaic, or blur to hide names, addresses, faces, plates, and private screenshots.",
  "censor-image-online": "Censor image areas online with mosaic, blur, solid cover, brush masks, or custom overlays using free private browser editing.",
}
```

Implementation guidance:
- In `src/lib/pseo/en.ts`, replace the `seo.description` value for directly declared English pages.
- In generated seed files, replace the English seed `description` value. Do not edit translated descriptions in this task.
- After editing, run the command from Step 1 again and continue until no English descriptions below `135` remain.

- [ ] **Step 3: Run the metadata test**

Run:

```bash
bun test src/lib/__tests__/pseo-metadata.test.ts
```

Expected: PASS with no short description failures.

- [ ] **Step 4: Commit the metadata copy changes**

Only run this after creating or switching to an isolated branch/worktree:

```bash
git add src/lib/pseo/en.ts src/lib/pseo/collage-pages.ts src/lib/pseo/mosaic-pages.ts src/lib/pseo/watermark-pages.ts src/lib/pseo/social-export-pages.ts src/lib/pseo/background-removal-pages.ts src/lib/__tests__/pseo-metadata.test.ts
git commit -m "fix: expand pseo meta descriptions"
```

Expected: commit succeeds.

---

### Task 3: Add IndexNow Support

**Files:**
- Create: `public/imgsplit-indexnow-2026.txt`
- Create: `scripts/ping-indexnow.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create the IndexNow key file**

Create `public/imgsplit-indexnow-2026.txt` with this content:

```txt
imgsplit-indexnow-2026
```

The key value is intentionally simple and site-specific. If the production owner prefers a random key, replace every occurrence of `imgsplit-indexnow-2026` in this task with the same random key before execution.

- [ ] **Step 2: Create the ping script**

Create `scripts/ping-indexnow.mjs` with this content:

```js
const host = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"
const key = process.env.INDEXNOW_KEY || "imgsplit-indexnow-2026"
const keyLocation = `${host.replace(/\/$/, "")}/${key}.txt`
const endpoint = "https://api.indexnow.org/indexnow"

const urls = process.argv.slice(2)

if (urls.length === 0) {
  console.error("Usage: bun run seo:indexnow -- https://imgsplit.com/page-1 https://imgsplit.com/page-2")
  process.exit(1)
}

const normalizedUrls = urls.map((url) => {
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `${host.replace(/\/$/, "")}/${url.replace(/^\//, "")}`
})

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({
    host: new URL(host).host,
    key,
    keyLocation,
    urlList: normalizedUrls,
  }),
})

if (!response.ok) {
  const body = await response.text()
  console.error(`IndexNow ping failed: ${response.status} ${response.statusText}`)
  console.error(body)
  process.exit(1)
}

console.log(`Submitted ${normalizedUrls.length} URL(s) to IndexNow`)
```

- [ ] **Step 3: Add the package script**

Modify `package.json` scripts to include:

```json
"seo:indexnow": "node scripts/ping-indexnow.mjs"
```

The resulting `scripts` object should keep the existing commands and include:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "models:background-removal": "node scripts/download-background-removal-model.mjs",
  "seo:indexnow": "node scripts/ping-indexnow.mjs"
}
```

- [ ] **Step 4: Verify the script validation path**

Run:

```bash
bun run seo:indexnow
```

Expected: FAIL with usage text and exit code `1`. This proves the script refuses empty submissions.

- [ ] **Step 5: Verify the key file is present**

Run:

```bash
test "$(cat public/imgsplit-indexnow-2026.txt)" = "imgsplit-indexnow-2026"
```

Expected: exit code `0`.

- [ ] **Step 6: Commit IndexNow support**

Only run this after creating or switching to an isolated branch/worktree:

```bash
git add public/imgsplit-indexnow-2026.txt scripts/ping-indexnow.mjs package.json
git commit -m "feat: add indexnow submission support"
```

Expected: commit succeeds.

---

### Task 4: Document Backlink Outreach Actions

**Files:**
- Create: `docs/seo/backlink-outreach.md`

- [ ] **Step 1: Create the backlink outreach checklist**

Create `docs/seo/backlink-outreach.md` with this content:

```md
# ImgSplit Backlink Outreach

## Goal

Increase high-quality inbound links for ImgSplit without spammy directory submissions.

## Priority Pages

- `https://imgsplit.com/` - free online image splitter
- `https://imgsplit.com/tools` - image tool directory
- `https://imgsplit.com/compress-image` - image compression and conversion
- `https://imgsplit.com/watermark-maker` - browser-based watermark maker
- `https://imgsplit.com/social-media-image-sizes` - social media image size generator
- `https://imgsplit.com/remove-background-free` - local AI background remover

## Outreach Targets

| Target | Angle | Owner | Status | Notes |
| --- | --- | --- | --- | --- |
| Product Hunt | Free privacy-first browser image tools |  | Not started | Launch as a tool suite, not a single cropper. |
| Indie Hackers | Build-in-public post about browser-only image processing |  | Not started | Include privacy architecture and pSEO learnings. |
| GitHub README | Add ImgSplit to relevant open-source image tool lists |  | Not started | Prioritize maintained repos with real traffic. |
| Design resource blogs | Free tools for social media image prep |  | Not started | Pitch social size, collage, watermark, and compression workflows. |
| Chinese creator platforms | 小红书/知乎/少数派工具推荐 |  | Not started | Emphasize browser local processing and WeChat/Xiaohongshu sizes. |
| SEO/tool directories | Privacy-first online image editor category |  | Not started | Avoid low-quality mass directories. |

## Tracking Rules

- Record every submitted URL and target contact.
- Prefer pages with editorial context over profile-only links.
- Avoid paid link farms and reciprocal-link schemes.
- Recheck referring domains monthly in Google Search Console or Bing Webmaster Tools.
```

- [ ] **Step 2: Commit the outreach document**

Only run this after creating or switching to an isolated branch/worktree:

```bash
git add docs/seo/backlink-outreach.md
git commit -m "docs: add seo backlink outreach checklist"
```

Expected: commit succeeds.

---

### Task 5: Final Verification

**Files:**
- Verify: `src/lib/__tests__/pseo-metadata.test.ts`
- Verify: `package.json`
- Verify: `public/imgsplit-indexnow-2026.txt`
- Verify: `docs/seo/backlink-outreach.md`

- [ ] **Step 1: Run focused metadata tests**

Run:

```bash
bun test src/lib/__tests__/pseo-metadata.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run lint**

Run:

```bash
bun run lint
```

Expected: PASS. If existing unrelated lint failures appear, record the file paths and confirm none are from files changed by this plan.

- [ ] **Step 3: Run build**

Run:

```bash
bun run build
```

Expected: PASS.

- [ ] **Step 4: Re-run short description audit**

Run:

```bash
bun --print 'import { getAllToolPages } from "./src/lib/pseo/index.ts"; const rows=[]; for (const page of getAllToolPages()) { const data=page.locales.en; if (data && data.seo.description.length < 135) rows.push({slug:page.slug,len:data.seo.description.length,desc:data.seo.description}); } rows.sort((a,b)=>a.len-b.len); console.log(JSON.stringify(rows, null, 2))'
```

Expected:

```json
[]
```

- [ ] **Step 5: Verify changed files**

Run:

```bash
git status --short
```

Expected: only files from this plan appear as modified or added.

---

## Self-Review

**Spec coverage:** The CSV findings are covered by Task 2 for short meta descriptions, Task 3 for IndexNow, and Task 4 for inbound link work.

**Placeholder scan:** Every code task includes concrete file paths, code content, commands, and expected results.

**Type consistency:** The test imports `getAllToolPages` from `@/lib/pseo`, which is already exported by `src/lib/pseo/index.ts`. The IndexNow script uses Node/Bun global `fetch`, available in the current runtime.
