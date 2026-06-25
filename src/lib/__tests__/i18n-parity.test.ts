import { describe, it, expect } from "vitest"
import en from "@/messages/en.json"
import zhCN from "@/messages/zh-CN.json"
import ja from "@/messages/ja.json"
import ko from "@/messages/ko.json"
import es from "@/messages/es.json"
import ptBR from "@/messages/pt-BR.json"

function keyPaths(obj: unknown, prefix = ""): string[] {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
      keyPaths(v, prefix ? `${prefix}.${k}` : k),
    )
  }
  return [prefix]
}

const enKeys = new Set(keyPaths(en))

const locales: Record<string, unknown> = {
  "zh-CN": zhCN,
  ja,
  ko,
  es,
  "pt-BR": ptBR,
}

describe("i18n parity", () => {
  for (const [name, json] of Object.entries(locales)) {
    it(`${name} has the same key set as en`, () => {
      const localeKeys = new Set(keyPaths(json))
      const missing = [...enKeys].filter((k) => !localeKeys.has(k))
      const extra = [...localeKeys].filter((k) => !enKeys.has(k))
      expect(missing, `Missing keys in ${name}`).toEqual([])
      expect(extra, `Extra keys in ${name}`).toEqual([])
    })
  }
})
