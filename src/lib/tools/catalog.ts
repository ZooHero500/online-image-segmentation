export type CoreToolId = "split" | "grid" | "resize" | "compress" | "watermark" | "mosaic"
export type CoreToolIcon = "scissors" | "grid" | "resize" | "compress" | "watermark" | "mosaic"

export interface CoreTool {
  id: CoreToolId
  labelKey: "toolSplit" | "toolGrid" | "toolResize" | "toolCompress" | "toolWatermark" | "toolMosaic"
  descriptionKey:
    | "existingToolSplitDesc"
    | "existingToolGridDesc"
    | "existingToolResizeDesc"
    | "existingToolCompressDesc"
    | "existingToolWatermarkDesc"
    | "existingToolMosaicDesc"
  href: string
  quickAccessHref: string
  sitemapPriority: number
  icon: CoreToolIcon
}

export const CORE_TOOLS: CoreTool[] = [
  {
    id: "split",
    labelKey: "toolSplit",
    descriptionKey: "existingToolSplitDesc",
    href: "/",
    quickAccessHref: "/workspace",
    sitemapPriority: 1,
    icon: "scissors",
  },
  {
    id: "grid",
    labelKey: "toolGrid",
    descriptionKey: "existingToolGridDesc",
    href: "/grid",
    quickAccessHref: "/grid/workspace",
    sitemapPriority: 0.9,
    icon: "grid",
  },
  {
    id: "resize",
    labelKey: "toolResize",
    descriptionKey: "existingToolResizeDesc",
    href: "/resize",
    quickAccessHref: "/resize",
    sitemapPriority: 0.9,
    icon: "resize",
  },
  {
    id: "compress",
    labelKey: "toolCompress",
    descriptionKey: "existingToolCompressDesc",
    href: "/compress",
    quickAccessHref: "/compress",
    sitemapPriority: 0.9,
    icon: "compress",
  },
  {
    id: "watermark",
    labelKey: "toolWatermark",
    descriptionKey: "existingToolWatermarkDesc",
    href: "/watermark",
    quickAccessHref: "/watermark",
    sitemapPriority: 0.9,
    icon: "watermark",
  },
  {
    id: "mosaic",
    labelKey: "toolMosaic",
    descriptionKey: "existingToolMosaicDesc",
    href: "/mosaic",
    quickAccessHref: "/mosaic",
    sitemapPriority: 0.9,
    icon: "mosaic",
  },
]

export const POPULAR_TOOL_SLUGS = [
  "split-in-half",
  "split-for-instagram",
  "compress-image",
  "png-to-jpg",
  "crop-image",
] as const

export const TOOL_EDITOR_HREFS: Record<string, string> = {
  "compress-image": "/compress",
  "compress-jpeg": "/compress?format=jpeg&quality=75",
  "compress-png": "/compress?format=png",
  "png-to-webp": "/compress?format=webp&quality=80",
  "png-to-jpg": "/compress?format=jpeg&quality=85",
  "jpg-to-png": "/compress?format=png",
  "jpg-to-webp": "/compress?format=webp&quality=80",
  "webp-to-png": "/compress?format=png",
  "webp-to-jpg": "/compress?format=jpeg&quality=85",
  "reduce-image-size": "/compress?format=webp&quality=70",
  "crop-image": "/resize",
  "crop-for-instagram": "/resize?preset=instagram-square",
  "instagram-story-crop": "/resize?preset=instagram-story",
  "youtube-thumbnail-crop": "/resize?preset=youtube-thumbnail",
  "watermark-maker": "/watermark",
  "add-watermark-to-photo": "/watermark",
  "add-watermark-to-image": "/watermark",
  "online-watermark-tool": "/watermark",
  "blur-face-in-photo": "/mosaic",
  "pixelate-image-online": "/mosaic",
  "mosaic-tool": "/mosaic",
  "redact-image-online": "/mosaic",
}
