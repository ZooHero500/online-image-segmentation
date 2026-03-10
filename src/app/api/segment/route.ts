import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

const LAYER_COLORS = [
  "#3B82F6", // blue
  "#22C55E", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
  "#14B8A6", // teal
  "#6366F1", // indigo
]

export async function POST(request: NextRequest) {
  try {
    const { image, labels } = await request.json()

    if (!image || !labels?.length) {
      return NextResponse.json(
        { error: "Image and labels are required" },
        { status: 400 }
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

      // Lang-SAM returns an image URL of the segmented result
      const maskUrl = typeof output === "string" ? output : String(output)

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
