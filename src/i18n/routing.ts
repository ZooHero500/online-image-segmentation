import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "zh-CN", "ja", "ko", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
})
