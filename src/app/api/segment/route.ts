import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"
import { LAYER_COLORS } from "@/lib/ai-segmentation"

const MAX_IMAGE_SIZE = 15_000_000 // ~10MB as base64

export async function POST(request: NextRequest) {
  try {
    const { image, labels } = await request.json()

    if (!image || !labels?.length) {
      return NextResponse.json(
        { error: "Image and labels are required" },
        { status: 400 }
      )
    }

    if (typeof image === "string" && image.length > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image too large (max 10MB)" },
        { status: 413 }
      )
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN not configured" },
        { status: 500 }
      )
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })

    // Process each label sequentially to avoid rate limits
    const segments: Array<{
      label_en: string
      label_zh: string
      maskUrl: string
      color: string
    }> = []

    for (let i = 0; i < labels.length; i++) {
      const label = labels[i]

      const output = await replicate.run(
        "tmappdev/lang-segment-anything:9f69a43b4a1a2bbb24e78e1e42ea3c28e30b9f52b86102a3ef7e0b3dda16929c",
        {
          input: {
            image,
            text_prompt: label.label_en,
          },
        }
      )

      // Lang-SAM may return string, array of strings, or other formats
      let maskUrl: string | null = null
      if (typeof output === "string") {
        maskUrl = output
      } else if (Array.isArray(output) && typeof output[0] === "string") {
        maskUrl = output[0]
      }

      if (!maskUrl) {
        console.error(`Unexpected Replicate output format for ${label.label_en}:`, output)
        continue
      }

      segments.push({
        label_en: label.label_en,
        label_zh: label.label_zh,
        maskUrl,
        color: LAYER_COLORS[i % LAYER_COLORS.length],
      })
    }

    return NextResponse.json({ segments })
  } catch (error) {
    console.error("Segment API error:", error)
    return NextResponse.json(
      { error: "Failed to segment image" },
      { status: 500 }
    )
  }
}
