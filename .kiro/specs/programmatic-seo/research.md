# Research & Design Decisions

## Summary
- **Feature**: programmatic-seo
- **Discovery Scope**: Extension（扩展现有 Next.js 站点，新增 pSEO 落地页矩阵）
- **Key Findings**:
  - 首页和 grid 页共享相同的页面结构模式（Nav → Hero → Sections → FAQ → Footer），可提取为模板
  - 现有 i18n 体系使用 `messages/{locale}.json` + `getTranslations()`，pSEO 内容数据量大，适合独立数据模块
  - Next.js App Router 静态路由优先于动态路由，`[toolSlug]` 不会与 `grid`/`workspace`/`tools` 冲突

## Research Log

### 现有页面结构分析
- **Context**: 需要了解首页和 grid 页的组件复用模式
- **Findings**:
  - 首页 12 个区块，grid 页 9 个区块，均为 Server Component + inline 子组件
  - 导航栏和页脚是 inline JSX（非独立组件），需提取公共样式/结构
  - `UploadZone`、`FaqItem`、`SmartCTA`、`MobileNav`、`LocaleSwitcher`、`JsonLd`、`LogoIcon`、`GridLines` 均为可复用独立组件
  - FAQ 使用 `FaqItem` 组件（accordion 模式），接受 `question` + `answer` props
- **Implications**: pSEO 模板可复用大部分组件，但 Nav/Footer 需要提取或内联复制

### 路由架构
- **Context**: `[toolSlug]` 动态路由与现有静态路由的兼容性
- **Findings**:
  - 现有路由：`/`（首页）、`/grid`、`/workspace`、`/grid/workspace`
  - Next.js App Router 中，命名目录（`grid/`、`workspace/`）优先于 `[toolSlug]/`
  - 新增 `tools/` 目录也会被视为静态路由，自动优先
- **Implications**: 无需额外路由守卫，Next.js 自动处理优先级

### 国际化数据策略
- **Context**: pSEO 内容数据量大（9 页 × 2 语言 × 多个区块），是否放入 messages JSON
- **Findings**:
  - 首页 messages 约 120 个 key，grid 页约 80 个 key
  - 9 个 pSEO 页面预计新增 ~500+ key，会使 messages 文件膨胀
  - next-intl `getTranslations` 按命名空间加载，不会影响非 pSEO 页面性能
- **Implications**: 两种方案均可行，但独立数据模块更利于类型安全和内容管理

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Messages JSON | 所有 pSEO 内容放入 messages/{locale}.json | 与现有 i18n 完全一致 | 文件膨胀，缺乏类型安全 | 适合少量页面 |
| 独立数据模块 | TypeScript 配置文件，按 locale 导出内容 | 类型安全，独立维护 | 新增数据获取模式 | 推荐方案 |
| MDX 文件 | 每页一个 MDX 文件 | 内容编辑友好 | 过度工程，引入新依赖 | 排除 |

## Design Decisions

### Decision: pSEO 内容数据源
- **Context**: 9 个 pSEO 页面各有独特的标题、描述、场景、FAQ 等内容
- **Alternatives Considered**:
  1. 全部放入 messages JSON — 与现有模式一致但缺乏类型安全
  2. 独立 TypeScript 数据模块 — 类型安全，按 slug+locale 索引
- **Selected Approach**: 独立 TypeScript 数据模块（`lib/pseo-data.ts`）
- **Rationale**: 500+ 个新 key 会使 messages 膨胀；TypeScript 提供编译时类型检查；内容结构固定，适合强类型
- **Trade-offs**: UI chrome 文本（区块标题、按钮标签）仍走 messages JSON，保持一致性
- **Follow-up**: 实现时确保数据模块的 locale 参数与 next-intl 的 locale 一致

### Decision: 页面模板架构
- **Context**: 9 个 pSEO 页面共享相同布局，内容不同
- **Selected Approach**: 单一 `ToolLanding` Server Component，接收数据配置作为 props 渲染所有区块
- **Rationale**: 避免 9 个近乎相同的 page.tsx，单一模板易维护
- **Trade-offs**: 模板灵活性有限，但 pSEO 页面结构本就统一

## Risks & Mitigations
- **Route 冲突** — Next.js 静态路由自动优先于动态路由，已验证
- **Messages 膨胀** — pSEO 内容数据独立于 messages，仅 UI chrome 入 messages
- **SEO 内容唯一性** — 数据模块需在 review 时人工确认无重复内容
- **构建时间** — 新增 18 个静态页面（9 slug × 2 locale），对构建时间影响可忽略

## References
- [Next.js App Router — Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [next-intl — Server Components](https://next-intl-docs.vercel.app/docs/getting-started/app-router-server-components)
