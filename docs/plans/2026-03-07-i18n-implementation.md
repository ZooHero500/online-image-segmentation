# i18n Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add internationalization support using next-intl with sub-path routing (`/en/`, `/zh-CN/`), English as default language.

**Architecture:** next-intl with App Router `[locale]` dynamic segment. Middleware handles language detection via Accept-Language header + cookie persistence. Translation files are JSON with namespaced keys. All hardcoded Chinese text in components gets replaced with `useTranslations()` calls.

**Tech Stack:** next-intl, Next.js 16 App Router, TypeScript, React 19

---

### Task 1: Install next-intl and configure Next.js plugin

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`

**Step 1: Install next-intl**

Run: `bun add next-intl`

**Step 2: Update next.config.ts to use createNextIntlPlugin**

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
```

**Step 3: Verify it builds (will fail until i18n files exist — that's expected)**

Run: `bun run build 2>&1 | head -20`
Expected: Error about missing `./src/i18n/request.ts` — confirms plugin is wired up.

**Step 4: Commit**

```bash
git add package.json bun.lock next.config.ts
git commit -m "chore: install next-intl and configure Next.js plugin"
```

---

### Task 2: Create i18n configuration files

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/i18n/navigation.ts`

**Step 1: Create routing config**

Create `src/i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "zh-CN"],
  defaultLocale: "en",
  localePrefix: "as-needed",
})
```

> `localePrefix: "as-needed"` means `/` serves the default locale (en), and `/zh-CN/` serves Chinese. No `/en/` prefix needed for default.

**Step 2: Create request config**

Create `src/i18n/request.ts`:

```ts
import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

**Step 3: Create navigation helpers**

Create `src/i18n/navigation.ts`:

```ts
import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

**Step 4: Commit**

```bash
git add src/i18n/
git commit -m "feat(i18n): add routing, request config, and navigation helpers"
```

---

### Task 3: Create translation files (en.json + zh-CN.json)

**Files:**
- Create: `src/messages/en.json`
- Create: `src/messages/zh-CN.json`

**Step 1: Create English translation file**

Create `src/messages/en.json` with all namespaces. English text should be natural and idiomatic, NOT literal translations from Chinese:

```json
{
  "metadata": {
    "title": "ImageSplit - Precision Image Splitting Tool",
    "description": "Free online image splitting tool with drag-and-drop split lines, snap alignment, and instant download. All processing happens in your browser — your images never leave your device."
  },
  "nav": {
    "features": "Features",
    "howItWorks": "How It Works",
    "faq": "FAQ",
    "getStarted": "Get Started"
  },
  "hero": {
    "overline": "Online Image Splitting Tool",
    "headlinePart1": "Precision",
    "headlineAccent": "Splitting",
    "headlinePart2": "for Images",
    "description": "Free online image splitting tool with drag-and-drop split lines, snap alignment, and pixel-perfect precision. Everything runs in your browser — your images never leave your device.",
    "ctaPrimary": "Start Free Now",
    "ctaSecondary": "See How It Works"
  },
  "trust": {
    "privacyLabel": "Zero Privacy Risk",
    "privacyDesc": "Data stays in your browser",
    "speedLabel": "Instant Processing",
    "speedDesc": "Local high-speed computation",
    "qualityLabel": "Lossless Quality",
    "qualityDesc": "Original resolution output",
    "freeLabel": "Completely Free",
    "freeDesc": "Unlimited usage"
  },
  "uploadSection": {
    "overline": "Get Started"
  },
  "benefits": {
    "overline": "Why Choose Us",
    "headlinePart1": "Say Goodbye to",
    "headlineAccent": "Complexity",
    "subtitle": "Skip the bloated image editors — split images the simple way.",
    "noPsTitle": "No More Photoshop",
    "noPsDesc": "No need to install Photoshop or learn complicated slicing tools. Just drag split lines and cut — anyone can do it.",
    "privacyTitle": "Safe for Sensitive Images",
    "privacyDesc": "Contracts, IDs, design files — no need to upload to third-party servers. All processing happens locally in your browser.",
    "batchTitle": "Batch Splitting, Double the Speed",
    "batchDesc": "Add multiple horizontal and vertical split lines at once, auto-generate grids, and download all sub-images in bulk.",
    "crossPlatformTitle": "Works on Any Device",
    "crossPlatformDesc": "No installation needed. Open your browser and go — phone, tablet, or desktop."
  },
  "features": {
    "overline": "Capabilities",
    "headlinePart1": "Professional",
    "headlineAccent": "Tools",
    "preciseTitle": "Pixel-Perfect Splitting",
    "preciseDesc": "Drag split lines freely with snap alignment for precise, pixel-level image cropping.",
    "privacyTitle": "Privacy First",
    "privacyDesc": "All processing happens in your browser. Images are never uploaded to any server.",
    "downloadTitle": "One-Click Download",
    "downloadDesc": "Download all split images as a ZIP, or save individual pieces one by one.",
    "gridTitle": "Grid Splitting",
    "gridDesc": "Add horizontal and vertical lines simultaneously to quickly create regular grids for efficient batch cropping.",
    "formatTitle": "Multi-Format Support",
    "formatDesc": "Supports PNG, JPG/JPEG, and WebP formats, with files up to 20MB.",
    "previewTitle": "Live Preview",
    "previewDesc": "See split results in real-time as you adjust line positions."
  },
  "steps": {
    "overline": "How It Works",
    "headlinePart1": "Four Simple",
    "headlineAccent": "Steps",
    "step1Title": "Upload Image",
    "step1Desc": "Drag and drop or click to upload your image. Supports PNG, JPG, and WebP.",
    "step2Title": "Add Split Lines",
    "step2Desc": "Add horizontal or vertical split lines and drag them into position with snap alignment.",
    "step3Title": "Preview Results",
    "step3Desc": "See each split region in real-time and confirm the results meet your needs.",
    "step4Title": "Download",
    "step4Desc": "Download all sub-images as a ZIP, or save specific regions individually."
  },
  "useCases": {
    "overline": "Use Cases",
    "headlinePart1": "Endless",
    "headlineAccent": "Possibilities",
    "ecommerceTitle": "E-Commerce",
    "ecommerceDesc": "Split long product detail pages into modules for different display areas, improving page load speed.",
    "ecommerceResult": "40%+ faster page loads",
    "designerTitle": "UI Designers",
    "designerDesc": "Quickly export design slices without opening Photoshop — complete asset delivery right in the browser.",
    "designerResult": "3x faster asset export",
    "socialTitle": "Social Media",
    "socialDesc": "Split panoramas or long images into multiple tiles for grid-style posts that look professional.",
    "socialResult": "More polished posts"
  },
  "cta": {
    "headlinePart1": "Start",
    "headlineAccent": "Now",
    "description": "No sign-up. No installation. Just open your browser and go. Your image data is always protected.",
    "button": "Get Started Free"
  },
  "faq": {
    "overline": "FAQ",
    "headlinePart1": "Questions",
    "headlineAccent": "Answered",
    "subtitle": "Common questions about the image splitting tool",
    "q1": "What image formats are supported?",
    "a1": "PNG, JPG/JPEG, and WebP images are supported, with a maximum file size of 20MB.",
    "q2": "Will image quality be reduced after splitting?",
    "a2": "No. The tool crops at the original resolution — no compression, no scaling, no quality loss.",
    "q3": "Is my image data safe?",
    "a3": "Absolutely. All processing happens locally in your browser. No image data is ever uploaded to a server. Everything is cleared when you close the page.",
    "q4": "How many split lines can I add?",
    "a4": "Up to 20 horizontal and 20 vertical lines, allowing for very fine grid splits.",
    "q5": "Do I need to create an account?",
    "a5": "No. No registration, no login required. Open the page and start using it — completely free.",
    "q6": "Does it work on mobile?",
    "a6": "Yes. The tool uses responsive design and works on phones and tablets."
  },
  "footer": {
    "tagline": "Online Image Splitting Tool — Free · Secure · Fast",
    "navFeatures": "Features",
    "navHowItWorks": "Guide",
    "navFaq": "FAQ"
  },
  "upload": {
    "title": "Upload Image",
    "dragHint": "Drag and drop one or more images here",
    "or": "or",
    "clickHint": "Click to select files (multiple allowed)",
    "formatHint": "PNG / JPG / WebP · Max 20MB per file",
    "unsupportedFormat": "Unsupported format. Please upload PNG, JPG, or WebP images.",
    "loadFailed": "Failed to load image. Please try again.",
    "fileTooLarge": "File \"{name}\" exceeds 20MB. Consider compressing it first.",
    "totalSizeWarning": "Total file size {size}MB exceeds 50MB and may cause browser slowdown."
  },
  "workspace": {
    "addHorizontal": "+ Horizontal Line",
    "addVertical": "+ Vertical Line",
    "undo": "Undo",
    "redo": "Redo",
    "generate": "Generate",
    "generating": "Generating...",
    "batchGenerate": "Batch Generate ({count} images)",
    "viewResults": "View Results",
    "imageCount": "{count} images · drag to reposition",
    "reupload": "Re-upload",
    "addLinesFirst": "Add split lines first",
    "linesNotCrossing": "Split lines don't intersect the image",
    "splitFailed": "Split failed. Please try again.",
    "horizontalLimitReached": "Horizontal split line limit reached (max 20)",
    "verticalLimitReached": "Vertical split line limit reached (max 20)",
    "loadingEditor": "Loading editor...",
    "shortcutHints": "Shortcuts: Ctrl+Z Undo | Ctrl+Shift+Z Redo | Delete Remove selected line | Drag from ruler to create | Drag back to ruler to delete | Scroll to zoom | Space+drag to pan | Cmd+0 Fit | Cmd+1 100%"
  },
  "results": {
    "title": "Split Results",
    "imageCount": "{count} images",
    "sourceCount": "({count} source images)",
    "selectedCount": "· {selected}/{total} selected",
    "downloadAll": "Download All (ZIP)",
    "selectAll": "Select All",
    "downloadSelected": "Download Selected",
    "downloadSelectedCount": "Download Selected ({count})"
  },
  "history": {
    "title": "History",
    "new": "New",
    "empty": "No history yet",
    "loading": "Loading...",
    "today": "Today {time}",
    "lineCount": "{count} split lines",
    "delete": "Delete"
  }
}
```

**Step 2: Create Chinese translation file**

Create `src/messages/zh-CN.json` — extract all current hardcoded Chinese text into matching keys:

```json
{
  "metadata": {
    "title": "ImageSplit - 精准图片分割工具",
    "description": "免费在线图片分割工具，支持拖拽分割线、磁吸对齐、一键生成并下载所有子图片。纯浏览器端处理，保护您的隐私。"
  },
  "nav": {
    "features": "功能",
    "howItWorks": "使用说明",
    "faq": "常见问题",
    "getStarted": "开始使用"
  },
  "hero": {
    "overline": "在线图片分割工具",
    "headlinePart1": "精准",
    "headlineAccent": "分割",
    "headlinePart2": "图片",
    "description": "免费在线图片裁切工具，支持拖拽分割线、磁吸对齐、像素级精确裁切。纯浏览器端处理，您的图片永远不会离开您的设备。",
    "ctaPrimary": "立即免费使用",
    "ctaSecondary": "了解使用方法"
  },
  "trust": {
    "privacyLabel": "隐私零风险",
    "privacyDesc": "数据不离开浏览器",
    "speedLabel": "秒级处理",
    "speedDesc": "本地高速运算",
    "qualityLabel": "无损质量",
    "qualityDesc": "原始分辨率输出",
    "freeLabel": "完全免费",
    "freeDesc": "无限次使用"
  },
  "uploadSection": {
    "overline": "开始创作"
  },
  "benefits": {
    "overline": "为什么选择我们",
    "headlinePart1": "告别",
    "headlineAccent": "繁琐",
    "subtitle": "告别繁琐的图片编辑软件，用最简单的方式完成图片分割",
    "noPsTitle": "告别复杂的 PS 操作",
    "noPsDesc": "无需安装 Photoshop 或学习复杂的切片工具，拖拽分割线即可精准裁切，新手也能轻松上手。",
    "privacyTitle": "敏感图片也能放心处理",
    "privacyDesc": "合同、证件、设计稿等敏感文件无需上传到第三方服务器，所有处理都在本地浏览器完成。",
    "batchTitle": "批量分割效率翻倍",
    "batchDesc": "一次添加多条横向和纵向分割线，自动生成网格，批量下载所有子图片，大幅节省时间。",
    "crossPlatformTitle": "所有设备随时可用",
    "crossPlatformDesc": "无需安装任何软件，打开浏览器即可使用，手机、平板、电脑全平台支持。"
  },
  "features": {
    "overline": "功能特点",
    "headlinePart1": "专业级",
    "headlineAccent": "能力",
    "preciseTitle": "精确分割",
    "preciseDesc": "拖拽分割线自由定位，支持磁吸对齐，精确到像素级别的图片裁切。",
    "privacyTitle": "隐私安全",
    "privacyDesc": "所有处理在浏览器本地完成，图片不会上传到任何服务器，保护您的隐私。",
    "downloadTitle": "一键下载",
    "downloadDesc": "支持一键打包下载所有分割后的子图片，也可单独下载每张图片。",
    "gridTitle": "网格分割",
    "gridDesc": "同时添加横向和纵向分割线，快速创建规则网格，批量裁切更高效。",
    "formatTitle": "多格式支持",
    "formatDesc": "支持 PNG、JPG/JPEG 和 WebP 格式，文件大小最高支持 20MB。",
    "previewTitle": "即时预览",
    "previewDesc": "实时预览分割效果，调整分割线位置后立即查看裁切区域变化。"
  },
  "steps": {
    "overline": "使用说明",
    "headlinePart1": "四步",
    "headlineAccent": "完成",
    "step1Title": "上传图片",
    "step1Desc": "拖拽或点击上传您要分割的图片，支持 PNG、JPG、WebP 格式",
    "step2Title": "添加分割线",
    "step2Desc": "添加横向或纵向分割线，拖拽调整位置，支持磁吸对齐",
    "step3Title": "预览效果",
    "step3Desc": "实时预览每个分割区域，确认裁切效果满足需求",
    "step4Title": "下载结果",
    "step4Desc": "一键打包下载所有子图片，或单独下载指定区域"
  },
  "useCases": {
    "overline": "应用场景",
    "headlinePart1": "无限",
    "headlineAccent": "可能",
    "ecommerceTitle": "电商运营",
    "ecommerceDesc": "将长图商品详情页按模块分割，上传到不同的商品展示区域，提升页面加载速度。",
    "ecommerceResult": "页面加载速度提升 40%+",
    "designerTitle": "UI 设计师",
    "designerDesc": "快速将设计稿切片导出，无需打开 Photoshop，直接在浏览器中完成切图交付。",
    "designerResult": "切图效率提升 3 倍",
    "socialTitle": "社交媒体",
    "socialDesc": "将全景图或长图分割成多张小图，制作九宫格拼图效果，提升社交平台发布质量。",
    "socialResult": "发布体验更专业"
  },
  "cta": {
    "headlinePart1": "立即",
    "headlineAccent": "开始",
    "description": "无需注册，无需安装，打开浏览器即可免费使用。您的图片数据安全始终受到保护。",
    "button": "免费开始使用"
  },
  "faq": {
    "overline": "常见问题",
    "headlinePart1": "疑问",
    "headlineAccent": "解答",
    "subtitle": "关于图片分割工具的常见疑问",
    "q1": "支持哪些图片格式？",
    "a1": "支持 PNG、JPG/JPEG 和 WebP 格式的图片，文件大小限制为 20MB。",
    "q2": "分割后的图片质量会降低吗？",
    "a2": "不会。工具以原始图片分辨率进行裁切，不压缩不缩放，保持原始画质。",
    "q3": "我的图片数据安全吗？",
    "a3": "完全安全。所有图片处理都在您的浏览器本地完成，不会将任何图片数据上传到服务器。关闭页面后，所有数据自动清除。",
    "q4": "可以同时添加多少条分割线？",
    "a4": "横向和纵向各最多支持 20 条分割线，可以创建非常精细的网格分割。",
    "q5": "需要注册账号吗？",
    "a5": "不需要。无需注册、无需登录，打开网页即可直接使用，完全免费。",
    "q6": "支持手机端使用吗？",
    "a6": "支持。工具采用响应式设计，在手机和平板上也可以正常使用。"
  },
  "footer": {
    "tagline": "在线图片分割工具 — 免费 · 安全 · 高效",
    "navFeatures": "功能",
    "navHowItWorks": "说明",
    "navFaq": "问题"
  },
  "upload": {
    "title": "上传图片",
    "dragHint": "拖拽一张或多张图片到此处",
    "or": "或",
    "clickHint": "点击选择文件（支持多选）",
    "formatHint": "PNG / JPG / WebP · 单张最大 20MB",
    "unsupportedFormat": "不支持的文件格式，请上传 PNG、JPG 或 WebP 格式的图片",
    "loadFailed": "图片加载失败，请重试",
    "fileTooLarge": "文件 \"{name}\" 过大（超过 20MB），建议压缩后重试",
    "totalSizeWarning": "总文件大小 {size}MB 超过 50MB，可能导致浏览器卡顿"
  },
  "workspace": {
    "addHorizontal": "+ 横向分割线",
    "addVertical": "+ 纵向分割线",
    "undo": "撤销",
    "redo": "重做",
    "generate": "生成",
    "generating": "生成中...",
    "batchGenerate": "批量生成 ({count} 张)",
    "viewResults": "查看结果",
    "imageCount": "{count} 张图片 · 可拖拽移动",
    "reupload": "重新上传",
    "addLinesFirst": "请先添加分割线",
    "linesNotCrossing": "分割线未穿过图片",
    "splitFailed": "分割失败，请重试",
    "horizontalLimitReached": "横向分割线已达上限（20条）",
    "verticalLimitReached": "纵向分割线已达上限（20条）",
    "loadingEditor": "加载编辑器...",
    "shortcutHints": "快捷键: Ctrl+Z 撤销 | Ctrl+Shift+Z 重做 | Delete 删除选中分割线 | 从标尺拖拽创建分割线 | 拖回标尺删除 | 滚轮缩放 | 空格+拖拽平移 | Cmd+0 适应 | Cmd+1 100%"
  },
  "results": {
    "title": "分割结果",
    "imageCount": "{count} 张图片",
    "sourceCount": "({count} 张原图)",
    "selectedCount": "· 已选 {selected}/{total} 张",
    "downloadAll": "下载全部 (ZIP)",
    "selectAll": "全选",
    "downloadSelected": "下载选中",
    "downloadSelectedCount": "下载选中 ({count})"
  },
  "history": {
    "title": "历史记录",
    "new": "新建",
    "empty": "暂无历史记录",
    "loading": "加载中...",
    "today": "今天 {time}",
    "lineCount": "{count} 条分割线",
    "delete": "删除"
  }
}
```

**Step 3: Commit**

```bash
git add src/messages/
git commit -m "feat(i18n): add English and Chinese translation files"
```

---

### Task 4: Create middleware for locale detection

**Files:**
- Create: `src/middleware.ts`

**Step 1: Create middleware**

Create `src/middleware.ts`:

```ts
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
```

**Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(i18n): add locale detection middleware"
```

---

### Task 5: Migrate layout.tsx to [locale] route

**Files:**
- Move: `src/app/layout.tsx` → `src/app/[locale]/layout.tsx`
- Note: A root `src/app/layout.tsx` is NOT needed — next-intl middleware handles the redirect.

**Step 1: Move the layout file**

```bash
mkdir -p src/app/\[locale\]
git mv src/app/layout.tsx src/app/\[locale\]/layout.tsx
```

**Step 2: Rewrite layout.tsx for i18n**

Edit `src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "../globals.css"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
          <div className="noise-overlay" aria-hidden="true" />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

**Step 3: Move globals.css if needed**

The import `../globals.css` assumes globals.css stays at `src/app/globals.css`. Verify path is correct.

Run: `ls src/app/globals.css`

**Step 4: Commit**

```bash
git add src/app/
git commit -m "feat(i18n): migrate layout to [locale] route with NextIntlClientProvider"
```

---

### Task 6: Migrate page.tsx (landing page) to [locale] route

**Files:**
- Move: `src/app/page.tsx` → `src/app/[locale]/page.tsx`
- Move: `src/app/LandingContent.tsx` → `src/app/[locale]/LandingContent.tsx`

**Step 1: Move files**

```bash
git mv src/app/page.tsx src/app/\[locale\]/page.tsx
git mv src/app/LandingContent.tsx src/app/\[locale\]/LandingContent.tsx
```

**Step 2: Replace all hardcoded text in page.tsx with useTranslations**

Edit `src/app/[locale]/page.tsx`. This is the biggest change — replace ALL hardcoded Chinese strings with `useTranslations()` calls. The component uses `"use client"` so we use `useTranslations`.

Key changes:
- Add `import { useTranslations } from "next-intl"` at top
- In `Home()`, add: `const t = useTranslations()`
- Replace every hardcoded string with appropriate `t('namespace.key')` call
- For sub-components (`TrustItem`, `BenefitCard`, etc.), they receive already-translated strings as props — no changes needed to their interfaces

Example replacements in `Home()`:

| Original | Replacement |
|----------|-------------|
| `功能` | `{t("nav.features")}` |
| `使用说明` | `{t("nav.howItWorks")}` |
| `常见问题` | `{t("nav.faq")}` |
| `开始使用` | `{t("nav.getStarted")}` |
| `在线图片分割工具` | `{t("hero.overline")}` |
| `精准` | `{t("hero.headlinePart1")}` |
| `分割` | `{t("hero.headlineAccent")}` |
| `图片` | `{t("hero.headlinePart2")}` |
| `label="隐私零风险"` | `label={t("trust.privacyLabel")}` |
| ... and so on for ALL text |

Replace **every** Chinese string. Check the grep output from exploration — there are ~80 strings in this file.

**Step 3: Update LandingContent.tsx import path**

The import in `page.tsx` for `LandingContent` uses `"./LandingContent"` — since both files moved together, this still works.

**Step 4: Build check**

Run: `bun run build 2>&1 | tail -20`
Expected: Successful build (or known-good warnings only).

**Step 5: Commit**

```bash
git add src/app/
git commit -m "feat(i18n): internationalize landing page with useTranslations"
```

---

### Task 7: Migrate workspace page to [locale] route

**Files:**
- Move: `src/app/workspace/page.tsx` → `src/app/[locale]/workspace/page.tsx`

**Step 1: Move the file**

```bash
mkdir -p src/app/\[locale\]/workspace
git mv src/app/workspace/page.tsx src/app/\[locale\]/workspace/page.tsx
rmdir src/app/workspace 2>/dev/null || true
```

**Step 2: No text changes needed**

The workspace page.tsx has no hardcoded UI text — it delegates to `DynamicSplitEditor` and `HistorySidebar`. The text changes happen in those components (later tasks).

**Step 3: Commit**

```bash
git add src/app/
git commit -m "feat(i18n): migrate workspace page to [locale] route"
```

---

### Task 8: Internationalize UploadZone component

**Files:**
- Modify: `src/components/UploadZone.tsx`

**Step 1: Replace hardcoded text**

Add `import { useTranslations } from "next-intl"` and use `const t = useTranslations("upload")` in the component.

Replace:
- `"不支持的文件格式，请上传 PNG、JPG 或 WebP 格式的图片"` → `t("unsupportedFormat")`
- `` `文件 "${file.name}" 过大（超过 20MB），建议压缩后重试` `` → `t("fileTooLarge", { name: file.name })`
- `` `总文件大小 ${...}MB 超过 50MB，可能导致浏览器卡顿` `` → `t("totalSizeWarning", { size: (totalSize / 1024 / 1024).toFixed(1) })`
- `"图片加载失败，请重试"` → `t("loadFailed")`
- `"上传图片"` → `t("title")`
- `"拖拽一张或多张图片到此处"` → `t("dragHint")`
- `"或"` → `t("or")`
- `"点击选择文件（支持多选）"` → `t("clickHint")`
- `"PNG / JPG / WebP · 单张最大 20MB"` → `t("formatHint")`

**Step 2: Commit**

```bash
git add src/components/UploadZone.tsx
git commit -m "feat(i18n): internationalize UploadZone component"
```

---

### Task 9: Internationalize SplitEditor component

**Files:**
- Modify: `src/components/SplitEditor.tsx`
- Modify: `src/components/DynamicSplitEditor.tsx`

**Step 1: Add useTranslations to SplitEditor**

Add `import { useTranslations } from "next-intl"` and use `const t = useTranslations("workspace")` in `SplitEditor`.

Replace:
- `"请先添加分割线"` → `t("addLinesFirst")`
- `"分割线未穿过图片"` → `t("linesNotCrossing")`
- `"分割失败，请重试"` → `t("splitFailed")`
- `"+ 横向分割线"` → `t("addHorizontal")`
- `"+ 纵向分割线"` → `t("addVertical")`
- `"撤销"` → `t("undo")`
- `"重做"` → `t("redo")`
- `"生成中..."` → `t("generating")`
- `` `批量生成 (${images.length} 张)` `` → `t("batchGenerate", { count: images.length })`
- `"生成"` → `t("generate")`
- `"查看结果"` → `t("viewResults")`
- `` `${images.length} 张图片 · 可拖拽移动` `` → `t("imageCount", { count: images.length })`
- `"重新上传"` → `t("reupload")`
- The shortcut hints string → `t("shortcutHints")`

**Step 2: Internationalize DynamicSplitEditor loading text**

In `src/components/DynamicSplitEditor.tsx`, replace `"加载编辑器..."`:

```tsx
"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

function EditorLoading() {
  const t = useTranslations("workspace")
  return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">
      {t("loadingEditor")}
    </div>
  )
}

export const DynamicSplitEditor = dynamic(
  () => import("./SplitEditor").then((mod) => ({ default: mod.SplitEditor })),
  {
    ssr: false,
    loading: () => <EditorLoading />,
  }
)
```

> Note: The `loading` callback doesn't support hooks directly. We need to make `EditorLoading` a named component. However, since `loading` in `next/dynamic` expects a function component, and hooks can be used inside it since it IS a React component rendered client-side, this should work. If it doesn't (because `loading` is called before providers mount), fall back to a simple non-translated string and add a TODO.

**Step 3: Commit**

```bash
git add src/components/SplitEditor.tsx src/components/DynamicSplitEditor.tsx
git commit -m "feat(i18n): internationalize SplitEditor and DynamicSplitEditor"
```

---

### Task 10: Internationalize ResultSheet component

**Files:**
- Modify: `src/components/ResultSheet.tsx`

**Step 1: Add useTranslations**

Add `import { useTranslations } from "next-intl"` and use `const t = useTranslations("results")` in `ResultSheet`.

Replace:
- `"分割结果"` → `t("title")`
- `` `${totalCount} 张图片` `` → `t("imageCount", { count: totalCount })`
- `` `(${batchResults.length} 张原图)` `` → `t("sourceCount", { count: batchResults.length })`
- `` `· 已选 ${selectedCount}/${totalCount} 张` `` → `t("selectedCount", { selected: selectedCount, total: totalCount })`
- `"下载全部 (ZIP)"` → `t("downloadAll")`
- `"全选"` → `t("selectAll")`
- `` `下载选中${selectedCount > 0 ? ` (${selectedCount})` : ""}` `` → `selectedCount > 0 ? t("downloadSelectedCount", { count: selectedCount }) : t("downloadSelected")`

Also update the batch results section:
- `` `(${batch.results.length} 张)` `` → `t("imageCount", { count: batch.results.length })`

**Step 2: Commit**

```bash
git add src/components/ResultSheet.tsx
git commit -m "feat(i18n): internationalize ResultSheet component"
```

---

### Task 11: Internationalize HistorySidebar component

**Files:**
- Modify: `src/components/HistorySidebar.tsx`

**Step 1: Add useTranslations and update formatTime**

Add `import { useTranslations } from "next-intl"` and `import { useLocale } from "next-intl"`.

Use `const t = useTranslations("history")` and `const locale = useLocale()` in `HistorySidebar`.

Update `formatTime` to accept locale parameter, or move the formatting inline:

```ts
function formatTime(timestamp: number, locale: string, todayLabel: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  const time = date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  })

  if (isToday) return `${todayLabel} ${time}`
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  }) + ` ${time}`
}
```

Replace:
- `"历史记录"` → `t("title")`
- `"新建"` → `t("new")`
- `"加载中..."` → `t("loading")`
- `"暂无历史记录"` → `t("empty")`
- `` `${record.lines.length} 条分割线` `` → `t("lineCount", { count: record.lines.length })`
- `"删除"` → `t("delete")`
- In formatTime calls: pass `locale` and `t("today", { time: "" }).replace(" ", "")` or better: pass `"Today"` / `"今天"` as `todayLabel`.

Actually simpler: use `t("today", { time })` where time is the formatted time string:
```ts
if (isToday) return t("today", { time })
```

This requires making formatTime use the translation function, so convert it to use inside the component.

**Step 2: Commit**

```bash
git add src/components/HistorySidebar.tsx
git commit -m "feat(i18n): internationalize HistorySidebar component"
```

---

### Task 12: Internationalize useRulerDrag hook

**Files:**
- Modify: `src/hooks/use-ruler-drag.ts`

**Step 1: Change toast messages to accept translated strings**

The hook currently has hardcoded toast messages. Since hooks can't use `useTranslations` easily when the hook is deeply nested, the cleanest approach is to add a `messages` option:

Add to `UseRulerDragOptions`:
```ts
messages: {
  horizontalLimitReached: string
  verticalLimitReached: string
}
```

Replace in `startDrag`:
```ts
toast.error(
  orientation === "horizontal"
    ? messages.horizontalLimitReached
    : messages.verticalLimitReached
)
```

**Step 2: Update SplitEditor to pass translated messages**

In `SplitEditor`, where `useRulerDrag` is called, add:
```ts
const t = useTranslations("workspace") // already added in Task 9

// In useRulerDrag call:
messages: {
  horizontalLimitReached: t("horizontalLimitReached"),
  verticalLimitReached: t("verticalLimitReached"),
}
```

**Step 3: Commit**

```bash
git add src/hooks/use-ruler-drag.ts src/components/SplitEditor.tsx
git commit -m "feat(i18n): internationalize ruler drag toast messages"
```

---

### Task 13: Create LocaleSwitcher component

**Files:**
- Create: `src/components/LocaleSwitcher.tsx`

**Step 1: Create the component**

Create `src/components/LocaleSwitcher.tsx`:

```tsx
"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { useTransition } from "react"

const localeLabels: Record<string, string> = {
  en: "EN",
  "zh-CN": "中文",
}

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleSwitch = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleSwitch(loc)}
          disabled={isPending}
          className={`px-2 py-1 uppercase tracking-[0.15em] transition-colors duration-500 ${
            locale === loc
              ? "text-[#D4AF37] font-medium"
              : "text-[#6C6863] hover:text-[#1A1A1A]"
          } ${isPending ? "opacity-50" : ""}`}
        >
          {localeLabels[loc] ?? loc}
        </button>
      ))}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/LocaleSwitcher.tsx
git commit -m "feat(i18n): create LocaleSwitcher component"
```

---

### Task 14: Add LocaleSwitcher to landing page nav and footer

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Import and add to nav**

Add `import { LocaleSwitcher } from "@/components/LocaleSwitcher"` to page.tsx.

In the nav bar, add `<LocaleSwitcher />` before the "Get Started" button:

```tsx
<div className="flex items-center gap-8 text-xs">
  {/* ... existing nav links ... */}
  <LocaleSwitcher />
  <a href="#upload" ...>
    {t("nav.getStarted")}
  </a>
</div>
```

**Step 2: Commit**

```bash
git add src/app/\[locale\]/page.tsx
git commit -m "feat(i18n): add LocaleSwitcher to landing page navigation"
```

---

### Task 15: Add LocaleSwitcher to workspace page

**Files:**
- Modify: `src/app/[locale]/workspace/page.tsx`

**Step 1: Add switcher to workspace header**

Import and add `<LocaleSwitcher />` to the workspace page. Place it in a small header bar above the editor:

```tsx
"use client"

import { useCallback, useState } from "react"
import { DynamicSplitEditor } from "@/components/DynamicSplitEditor"
import { HistorySidebar } from "@/components/HistorySidebar"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { useHistory } from "@/hooks/use-history"
import type { SplitLine } from "@/types"

// ... (existing code)

return (
  <div className="flex h-screen">
    <HistorySidebar
      onLoadRecord={handleLoadRecord}
      onNewCanvas={handleNewCanvas}
    />
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-end px-4 py-2 border-b shrink-0">
        <LocaleSwitcher />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden p-4">
        <DynamicSplitEditor
          key={editorKey}
          initialState={initialState}
          onSaveHistory={handleSaveHistory}
          showShortcutHints
        />
      </div>
    </main>
  </div>
)
```

**Step 2: Commit**

```bash
git add src/app/\[locale\]/workspace/page.tsx
git commit -m "feat(i18n): add LocaleSwitcher to workspace page"
```

---

### Task 16: Update internal navigation links to use next-intl Link

**Files:**
- Modify: `src/app/[locale]/LandingContent.tsx`

**Step 1: Replace router.push with next-intl router**

In `LandingContent.tsx`, replace the Next.js `useRouter` with next-intl's:

```tsx
"use client"

import { useCallback } from "react"
import { useRouter } from "@/i18n/navigation"
import { UploadZone } from "@/components/UploadZone"
import { setPendingUpload } from "@/lib/pending-upload"
import type { UploadResult } from "@/types"

export function LandingContent() {
  const router = useRouter()

  const handleImagesLoaded = useCallback(
    (results: UploadResult[]) => {
      setPendingUpload(results)
      router.push("/workspace")
    },
    [router]
  )

  return <UploadZone onImagesLoaded={handleImagesLoaded} />
}
```

> The next-intl `useRouter` automatically prepends the locale prefix, so `/workspace` becomes `/zh-CN/workspace` when on the Chinese locale.

**Step 2: Commit**

```bash
git add src/app/\[locale\]/LandingContent.tsx
git commit -m "feat(i18n): use next-intl navigation for locale-aware routing"
```

---

### Task 17: Build verification and smoke test

**Files:**
- No new files

**Step 1: Run build**

Run: `bun run build`
Expected: Successful build with no errors.

**Step 2: Fix any build errors**

Address any TypeScript or build errors that come up. Common issues:
- Import path mismatches after file moves
- Missing `setRequestLocale` calls for static generation
- Type errors with `params: Promise<{ locale: string }>`

**Step 3: Run dev server and verify**

Run: `bun dev`
- Visit `http://localhost:3000` → should show English version
- Visit `http://localhost:3000/zh-CN` → should show Chinese version
- Click LocaleSwitcher → should switch between languages
- Navigate to workspace → should maintain locale
- Upload an image → workspace should use correct locale for all UI text

**Step 4: Run existing tests**

Run: `bun test`
Expected: All existing tests pass (they test business logic, not UI text).

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix(i18n): resolve build issues and verify smoke test"
```

---

### Task 18: Clean up old app directory

**Files:**
- Check: `src/app/` for any leftover files outside `[locale]/`

**Step 1: Verify directory structure**

Run: `find src/app -maxdepth 1 -type f`

Expected: Only `globals.css` should remain at `src/app/` level. All page files should be under `src/app/[locale]/`.

If old `workspace/` directory still exists empty, remove it:
```bash
rmdir src/app/workspace 2>/dev/null || true
```

**Step 2: Final commit**

```bash
git add -A
git commit -m "chore(i18n): clean up directory structure after migration"
```
