import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const MAX_IMAGE_SIZE = 15_000_000 // ~10MB as base64

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
})

const SYSTEM_PROMPT = `You are an image analysis assistant. Analyze the given image and identify all visually distinct, independently segmentable elements.

Return a JSON array where each element has:
- label_en: English label (concise, lowercase, for segmentation model input)
- label_zh: Chinese label (for UI display)
- confidence: float 0-1

Rules:
- Only include elements that can be visually separated (not abstract concepts)
- Order by visual prominence (most prominent first)
- Max 10 elements
- Always include "background" as the last element if applicable
- Be specific: "person" not "human", "tree" not "plant"

Example output:
[
  {"label_en": "person", "label_zh": "人物", "confidence": 0.95},
  {"label_en": "dog", "label_zh": "狗", "confidence": 0.88},
  {"label_en": "background", "label_zh": "背景", "confidence": 0.80}
]

Return ONLY the JSON array, no other text.`

function validateElements(parsed: unknown): Array<{ label_en: string; label_zh: string; confidence: number }> {
  if (!Array.isArray(parsed)) return []
  return parsed.filter(
    (e: unknown): e is { label_en: string; label_zh: string; confidence: number } =>
      typeof e === "object" &&
      e !== null &&
      "label_en" in e &&
      typeof (e as Record<string, unknown>).label_en === "string" &&
      "label_zh" in e &&
      typeof (e as Record<string, unknown>).label_zh === "string" &&
      "confidence" in e &&
      typeof (e as Record<string, unknown>).confidence === "number"
  )
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      )
    }

    if (typeof image === "string" && image.length > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image too large (max 10MB)" },
        { status: 413 }
      )
    }

    if (!process.env.XAI_API_KEY) {
      return NextResponse.json(
        { error: "XAI_API_KEY not configured" },
        { status: 500 }
      )
    }

    const response = await client.chat.completions.create({
      model: "grok-2-vision-latest",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: image },
            },
            {
              type: "text",
              text: "Analyze this image and list all segmentable visual elements.",
            },
          ],
        },
      ],
      temperature: 0.1,
    })

    const content = response.choices[0]?.message?.content ?? "[]"

    // Parse JSON from response (handle possible markdown code blocks)
    const jsonStr = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim()
    const parsed = JSON.parse(jsonStr)
    const elements = validateElements(parsed)

    return NextResponse.json({ elements })
  } catch (error) {
    console.error("Analyze API error:", error)
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    )
  }
}
