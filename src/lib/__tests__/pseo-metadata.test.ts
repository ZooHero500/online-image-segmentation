import { describe, expect, it } from "vitest"
import { getAllToolPages } from "@/lib/pseo"

const MIN_META_DESCRIPTION_LENGTH = 135
const MAX_META_DESCRIPTION_LENGTH = 165

const privacySignals = [
  "browser",
  "browser-based",
  "in your browser",
  "private",
  "privacy",
  "no upload",
  "without uploading",
  "client-side",
  "on-device",
  "on device",
  "local ai",
]

function getEnglishSeoDescriptions() {
  return getAllToolPages()
    .filter((page) => page.locales.en)
    .map((page) => ({
      slug: page.slug,
      description: page.locales.en.seo.description,
    }))
}

describe("pSEO metadata", () => {
  it("keeps English meta descriptions within a useful SERP range", () => {
    const invalidDescriptions = getEnglishSeoDescriptions().flatMap(
      ({ slug, description }) => {
        const length = description?.length ?? 0
        if (
          description &&
          length >= MIN_META_DESCRIPTION_LENGTH &&
          length <= MAX_META_DESCRIPTION_LENGTH
        ) {
          return []
        }

        return [
          {
            slug,
            length,
            expected: `${MIN_META_DESCRIPTION_LENGTH}-${MAX_META_DESCRIPTION_LENGTH}`,
            description: description ?? "",
          },
        ]
      }
    )

    expect(invalidDescriptions).toEqual([])
  })

  it("keeps English meta descriptions aligned with the privacy-first product promise", () => {
    const missingPrivacySignal = getEnglishSeoDescriptions().flatMap(
      ({ slug, description }) => {
        if (!description) {
          return [
            {
              slug,
              expected: privacySignals,
              description: "",
            },
          ]
        }

        const normalized = description.toLowerCase()
        if (privacySignals.some((signal) => normalized.includes(signal))) {
          return []
        }

        return [
          {
            slug,
            expected: privacySignals,
            description,
          },
        ]
      }
    )

    expect(missingPrivacySignal).toEqual([])
  })
})
