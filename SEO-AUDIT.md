# SEO 审计报告 — ImgSplit (在线图片分割工具)

## 整体评估

**SEO 就绪度: ~40/100** — 基础元数据和 i18n 已到位，但缺少多项关键 SEO 基础设施。

### Top 5 优先问题

| # | 问题 | 影响 | 修复难度 |
|---|------|------|----------|
| 1 | 首页使用 `"use client"` — SSR 内容丢失 | **Critical** | Medium |
| 2 | 缺少 robots.txt 和 sitemap.xml | **High** | Easy |
| 3 | 缺少 Open Graph / Twitter Card 元数据 | **High** | Easy |
| 4 | 缺少 JSON-LD 结构化数据 | **Medium** | Easy |
| 5 | /workspace 未设置 noindex | **Medium** | Easy |

---

## 1. 致命问题: 首页使用 `"use client"`

**Issue:** `src/app/[locale]/page.tsx` 第1行标记了 `"use client"`，这意味着整个首页组件（包括 H1 标题、所有 section 内容、FAQ）**不会在服务端渲染成 HTML**，搜索引擎爬虫看到的可能是空白页面或骨架。

**Impact:** **Critical** — 搜索引擎可能无法索引首页的任何内容。虽然 Googlebot 能执行 JavaScript，但：
- 执行 JS 有延迟（Second Wave Indexing）
- Bing、百度等不一定能完整渲染
- 所有文本内容、标题、FAQ 对爬虫不可见

**Fix:** 将首页改为服务端组件（Server Component），仅将交互部分（FaqItem 的展开/收起、LandingContent 的上传区域）提取为独立的 `"use client"` 子组件。

```
page.tsx (Server Component) → 所有静态 HTML 在服务端渲染
  ├── FaqItem.tsx ("use client") → 仅处理展开/收起交互
  ├── LandingContent.tsx ("use client") → 仅处理上传交互
  └── 其余内容均为服务端渲染的静态 HTML
```

---

## 2. Crawlability & Indexation

### 2.1 robots.txt — 缺失
**Impact:** High
**Fix:** 创建 `src/app/robots.ts`：

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/workspace' },
    sitemap: 'https://yourdomain.com/sitemap.xml',
  }
}
```

### 2.2 Sitemap — 缺失
**Impact:** High
**Fix:** 创建 `src/app/sitemap.ts`，生成包含所有 locale 变体的 URL。

### 2.3 /workspace 未 noindex
**Impact:** Medium — 工具操作页面不应被索引（纯客户端，无 SEO 价值）
**Fix:** 在 workspace layout 或 page 中添加 `metadata.robots = { index: false }`

### 2.4 Canonical URL — 隐式但不完整
**Impact:** Medium
**Evidence:** `layout.tsx:40-44` 只设置了 `alternates.languages`，没有显式 `canonical`
**Fix:** 在 `generateMetadata` 中添加：

```typescript
alternates: {
  canonical: locale === defaultLocale ? '/' : `/${locale}`,
  languages: { ... }
}
```

---

## 3. 元数据问题

### 3.1 Open Graph 标签 — 完全缺失
**Impact:** High — 社交媒体分享时无预览图、无描述
**Fix:** 在 `generateMetadata` 中添加：

```typescript
openGraph: {
  title: t("title"),
  description: t("description"),
  type: 'website',
  images: [{ url: '/og-image.png', width: 1200, height: 630 }],
},
twitter: {
  card: 'summary_large_image',
  title: t("title"),
  description: t("description"),
  images: ['/og-image.png'],
},
```

### 3.2 标题优化
**Current:** "ImgSplit - Precision Image Splitting Tool" (46 chars) — OK
**Suggestion:** 考虑加入核心关键词 "Free Online" → "ImgSplit - Free Online Image Splitting Tool" (47 chars)

### 3.3 Meta Description
**Current:** 好的描述（154 chars），包含关键词和价值主张 — **Pass**

---

## 4. 结构化数据 — 完全缺失

**Impact:** Medium — 错过 rich results 展示机会

**缺失的 Schema 类型：**

| Schema | 用途 | 优先级 |
|--------|------|--------|
| `WebApplication` | 标识为在线工具，展示应用信息 | High |
| `FAQPage` | FAQ 已有 6 个问答，可展示 FAQ rich results | High |
| `Organization` | 品牌信息 | Low |
| `BreadcrumbList` | 导航面包屑 | Low |

**FAQPage Schema 值得优先实施** — 页面已有完善的 FAQ 内容，添加 JSON-LD 后可直接在搜索结果中展示。

---

## 5. 技术 SEO

### 5.1 Font Optimization — Pass
- `display: "swap"` 防止 FOIT
- `subsets: ["latin"]` 减少字体大小
- **Issue:** 仅包含 `latin` subset，**中文字体未优化**（zh-CN 用户使用系统默认字体，Playfair Display 无中文字符，这对标题展示可能有影响）

### 5.2 Image Optimization — 部分问题
- **未使用 `next/image`** — 失去自动 WebP/AVIF 转换、lazy loading、尺寸优化
- Alt text 覆盖率：用户上传的图片有 alt (**Pass**)
- 首页无产品截图/illustration — 可添加 hero image 增强视觉和 SEO

### 5.3 Heading Structure — Pass
- 单个 H1 (**Pass**)
- H2 → H3 层级合理 (**Pass**)
- 标题包含关键词 (**Pass**)

### 5.4 URL Structure — Pass
- Clean URLs: `/`, `/zh-CN/`, `/workspace`
- 无参数污染

### 5.5 HTTPS — 无法远程验证（需要 live URL）

### 5.6 Mobile Responsiveness — Pass
- Tailwind CSS 响应式设计
- 合理的移动端适配（`md:` breakpoints）

---

## 6. 内容 SEO

### 6.1 关键词覆盖

**已覆盖关键词：**
- "image splitting tool" / "图片分割工具" — 标题、描述、hero
- "online" / "在线" — 描述中
- "free" / "免费" — 描述和 CTA 中
- "privacy" / "隐私" — 多处强调
- "drag and drop" — 描述中

**可能缺失的关键词：**
- "image cropper" / "图片裁剪"
- "image cutter" / "图片切割"
- "split image into parts" / "图片分成多份"
- "grid split" / "九宫格切图"（中文市场热门搜索词）
- "Instagram grid" / "朋友圈切图"

### 6.2 内容深度 — Good
- 完整的 hero + benefits + features + how-it-works + use cases + FAQ 结构
- FAQ 有 6 个实用问答

### 6.3 缺失的 SEO 页面
- **无 blog/教程页面** — 失去长尾关键词流量机会
- **无独立的功能页面** — 所有内容在单页中，无法针对特定关键词优化

---

## 7. 国际化 SEO

### 7.1 hreflang — Pass
- `alternates.languages` 正确实现
- `localePrefix: "as-needed"` 策略合理

### 7.2 i18n 问题
- **Font subset 缺失中文** — Playfair Display 无 CJK 字符，中文标题会回退到系统字体（视觉不一致）
- **Content 完整度** — en.json 和 zh-CN.json 结构一致 (**Pass**)

---

## 优先行动计划

### Phase 1: Critical Fixes (立即执行)

1. **将首页改为 Server Component** — 移除 `"use client"`，仅在交互组件上使用
2. **创建 `robots.ts`** — 允许爬取，禁止 /workspace
3. **创建 `sitemap.ts`** — 列出所有 locale 页面
4. **添加 Open Graph 元数据** — 需准备一张 1200x630 的 OG 图片

### Phase 2: High Impact (本周内)

5. **添加 FAQPage JSON-LD** — 复用已有 FAQ 内容
6. **添加 WebApplication JSON-LD** — 标识为在线工具
7. **workspace 添加 noindex**
8. **添加显式 canonical URL**

### Phase 3: Quick Wins (按需)

9. **优化标题**，加入 "Free Online"
10. **创建 OG 图片**
11. **考虑使用 `next/image`** 进行图片优化

### Phase 4: Long-term (持续优化)

12. **考虑添加独立功能页面**（如 /grid-splitter, /九宫格切图）
13. **考虑添加教程/blog** 捕获长尾流量
14. **补充中文市场特定关键词**（九宫格切图、朋友圈切图等）
