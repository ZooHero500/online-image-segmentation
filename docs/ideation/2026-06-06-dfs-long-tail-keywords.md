# DFS Long-Tail Keyword Analysis

Date: 2026-06-06

Scope: English / United States first pass, using DataForSEO Google keyword suggestions and keyword metrics. This pass focuses on keywords that can be served by existing ImgSplit browser-side tools or near-term pSEO pages.

## Executive Summary

The strongest long-tail opportunities are not the newest background-removal keywords. Background removal has large search volume, but the SERP difficulty is already high. ImgSplit has a better immediate path through image splitting, Instagram grid, and pixelation/privacy masking.

Recommended next SEO order:

1. Push harder on `image splitter` and Instagram grid pages.
2. Expand `pixelate image` / privacy masking pages because volume is high and KD is unusually low.
3. Keep resize/compress pages focused on narrow use cases: PNG, iPhone, Windows, print, batch, file-size targets.
4. Do not chase watermark-removal keywords. They have demand, but the intent conflicts with the current add-watermark product and can create quality/risk issues.

## Data Notes

- Source: DataForSEO Google keyword suggestions, `location_name=United States`, `language_code=en`.
- Metrics observed: search volume, KD, CPC, competition level, intent.
- Some DFS calls failed with `fetch failed`, especially domain ranking and some suggestion calls. This report uses successful seed-expansion data only.
- Search volume and KD are directional. Before shipping large content batches, rerun `keyword_overview` on the final candidate list.

## P0 Opportunities

These should be prioritized because they combine strong relevance, clear tool intent, and reasonable KD.

| Keyword | Volume | KD | Intent | Recommended Target |
| --- | ---: | ---: | --- | --- |
| image splitter | 12,100 | 16 | Informational / transactional | `/` or focused `/image-splitter` page |
| instagram grid maker | 5,400 | 8 | Informational / transactional | `/grid` and `/instagram-grid-maker` |
| grid maker for instagram | 5,400 | 10 | Informational | same cluster as above |
| image splitter for instagram | 2,400 | 14 | Transactional | `/split-for-instagram` |
| pixelate image | 14,800 | 7 | Informational | `/pixelate-image` |
| image pixelate | 14,800 | 7 | Informational | same cluster as above |
| how to pixelate an image | 1,600 | 1 | Informational | guide section on `/pixelate-image` |
| pixelate image online | 390 | 7 | Informational | `/pixelate-image-online` |
| pixelate an image online | 390 | 5 | Informational | same cluster as above |
| pixelate part of an image | 210 | 10 | Informational | privacy masking use-case page |
| how to pixelate part of an image | 170 | 3 | Informational | FAQ/guide block |

## P1 Opportunities

These are relevant but either more competitive, lower volume, or better as supporting pages.

| Keyword | Volume | KD | Intent | Recommended Target |
| --- | ---: | ---: | --- | --- |
| image splitter online | 1,300 | 16 | Tool intent | `/image-splitter-online` or homepage copy |
| online image splitter | 1,300 | 16 | Tool intent | same cluster |
| image splitter in 3 | 480 | 8 | Specific tool intent | pSEO page |
| instagram image splitter | 720 | 33 | Tool intent | support page under Instagram cluster |
| instagram grid maker online free | 50 | 5 | Tool intent | include in grid page title/FAQ |
| grid post maker for instagram | 50 | 17 | Informational / commercial | support page if making Instagram cluster |
| png image resizer | 720 | 30 | Tool intent | resize pSEO page |
| image resizer for windows | 720 | 12 | Informational | guide page, not core tool page |
| image resizer for iphone | 590 | 21 | Informational | guide page |
| image resizer for printing | 590 | 30 | Tool intent | print resize page |
| batch image resizer | 720 | 49 | Transactional | batch resize feature/page when available |
| image compressor to 2mb | 110 | n/a | Tool intent | size-target compressor pSEO |
| mass image compressor | 110 | 12 | Tool intent | batch compressor page |
| social media image resizer | 70 | 42 | Informational | existing `/social-media-image-resizer`; not highest priority |

## Competitive / Defer

| Keyword | Volume | KD | Reason |
| --- | ---: | ---: | --- |
| image resizer | 110,000 | 60 | Too broad and competitive for first push |
| free image resizer | 18,100 | 76-79 | Very competitive |
| online image resizer | 14,800 | 79-87 | Very competitive |
| image compressor | 60,500 | 74 | Broad and competitive |
| online image compressor | 5,400 | 77 | Broad and competitive |
| free background remover | 110,000 | 68 | Strong demand but high KD |
| background remover online for free | 110,000 | 75 | High KD, crowded SERP |
| transparent background remover | 4,400 | 82 | Very difficult despite lower volume |

## Do Not Prioritize

Watermark seed expansion mostly returned `remove watermark from photo` variants:

- `remove watermark from photo`: 22,200 volume, KD 27
- `photo watermark remover`: 22,200 volume, KD 30
- `how to remove watermark from photo`: 12,100 volume, KD around 30

This is not aligned with ImgSplit's current watermark tool, which adds watermarks. The intent is also legally and ethically sensitive because many searches are about removing ownership marks. Recommended action: do not create removal-tool pages. Keep add-watermark pages focused on ownership, branding, proofing, and private browser processing.

## Page Mapping

### Background Removal Addendum

This follow-up pass was run after adding batch background removal. It focused on background-removal modifiers that can avoid the hardest broad SERPs.

| Keyword | Volume | KD | Intent | Recommended Target |
| --- | ---: | ---: | --- | --- |
| transparent background maker | 27,100 | 25 | Transactional | New pSEO page mapped to `/remove-background` |
| bulk background remover | 320 | 18 | Transactional | New pSEO page or prominent `/remove-background` section |
| batch remove background | 140 | 19 | Informational | FAQ / H2 on batch page |
| bulk remove background | 110 | 27 | Informational / transactional | Support copy on batch page |
| batch background remover | 70 | 30 | Transactional | Secondary phrase on batch page |
| background remover bulk | 70 | 28 | Transactional | Secondary phrase on batch page |
| bulk image background remover | 50 | 18 | Transactional | Long-tail FAQ / supporting copy |
| bulk background remover free | 40 | 61 | Transactional | Avoid as primary; high KD for low volume |
| offline background remover | 10 | n/a | Transactional | Differentiator copy only |
| local AI background remover | 10 | n/a | Transactional | Differentiator copy only |

Notes:
- `transparent background maker` is the standout background-removal opportunity. It has much lower KD than `transparent background remover` while still matching the implemented output: transparent PNG/WebP after local AI removal.
- `bulk` is stronger than `batch` in the US data. Use `bulk background remover` as the primary batch phrase and `batch remove background` as a supporting phrase.
- `offline` and `local AI` terms are too small for standalone pages, but they are useful conversion copy because ImgSplit's model runs in the browser after download and keeps images on-device.
- Code currently maps `transparent-background-maker` and `remove-background-free` to `/remove-background` in `TOOL_EDITOR_HREFS`, but these slugs are not registered in `slugMeta` yet. If this cluster is prioritized, create actual pSEO page data and register the slugs.

Recommended background-removal page order:
1. `/transparent-background-maker` -> primary query `transparent background maker`; CTA to `/remove-background`.
2. `/bulk-background-remover` -> primary query `bulk background remover`; emphasize multi-image upload, serial local processing, ZIP download.
3. Keep `free background remover` and `background remover online for free` as secondary terms on `/remove-background`; do not make them the first SEO bet because KD is 68-75.

### Image Splitter Cluster

Primary page:
- `/` or a dedicated `/image-splitter`

Supporting pSEO pages:
- `/image-splitter-online`
- `/split-for-instagram`
- `/split-image-into-3`
- `/image-splitter-for-printing`
- `/split-image-into-equal-parts`

Implementation notes:
- The term `image splitter` already has strong volume and low KD. Use it directly in title/H1, not only branded copy.
- Instagram-specific split terms should link to `/grid` and carousel/grid variants.

### Instagram Grid Cluster

Primary page:
- `/grid`

Supporting pSEO pages:
- `/instagram-grid-maker`
- `/grid-maker-for-instagram`
- `/instagram-grid-maker-online-free`
- `/grid-post-maker-for-instagram`
- `/instagram-carousel-grid-maker`

Implementation notes:
- `instagram grid maker` is the cleanest P0: 5,400 volume, KD 8.
- Avoid competitor/navigational phrases from DFS output such as `my social boutique instagram grid maker`.

### Privacy / Pixelate Cluster

Primary page:
- `/mosaic`

Existing pSEO pages already align well:
- `/pixelate-image`
- `/pixelate-image-online`
- `/censor-image-online`
- `/redact-image`
- `/blur-face`

New/supporting content:
- FAQ: "How to pixelate part of an image"
- Use-case page or section: "Pixelate part of an image online"
- Device guide: "How to pixelate an image on iPhone" if mobile UX supports it well.

Implementation notes:
- This is the best surprise opportunity. `pixelate image` has 14,800 volume and KD 7.
- The page should emphasize selectable regions, local processing, and stronger privacy than simple blur.

### Resize Cluster

Primary page:
- `/resize`

Recommended supporting pages:
- `/png-image-resizer`
- `/image-resizer-for-iphone`
- `/image-resizer-for-printing`
- `/image-resizer-in-inches`
- `/batch-image-resizer` only after batch resize UX exists or is credible.

Implementation notes:
- Do not lead with broad `image resizer` only. Use format/device/print modifiers.

### Compress Cluster

Primary page:
- `/compress`

Recommended supporting pages:
- `/image-compressor-to-2mb`
- `/mass-image-compressor`
- `/jpeg-image-compressor`
- `/compress-image-to-1mb` and other file-size targets after overview validation.

Implementation notes:
- `mass image compressor` is low volume but low KD and strong commercial/tool intent.
- Size-target pages convert well because users have a concrete constraint.

## Next DFS Pass

Run a second pass with these exact candidates through `keyword_overview` and `bulk_keyword_difficulty`:

- `instagram grid maker`
- `grid maker for instagram`
- `image splitter`
- `image splitter online`
- `image splitter for instagram`
- `pixelate image`
- `pixelate image online`
- `pixelate part of an image`
- `how to pixelate part of an image`
- `png image resizer`
- `image resizer for iphone`
- `image resizer for printing`
- `image compressor to 2mb`
- `mass image compressor`

Then run competitor/domain data when DFS domain endpoints are stable:

- `imgsplit.com` ranked keywords
- SERP competitors for `image splitter`, `instagram grid maker`, `pixelate image`
- Gap analysis against top ranking tool sites for those clusters
