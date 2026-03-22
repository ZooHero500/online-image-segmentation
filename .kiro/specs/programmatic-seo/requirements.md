# Requirements Document

## Introduction

围绕 imgsplit.com 的主工具（自由分割线模式）创建一组程序化 SEO 落地页。每个页面针对一个具体的切割搜索意图（如"对半切割"、"长截图分段"、"Instagram 切图"等），嵌入真实的上传工具入口，配合独特的场景说明、操作步骤和 FAQ 内容。通过数据驱动 + 动态路由 + SSG 静态生成，让 Google 在不同搜索查询下都能索引到 imgsplit.com 的相关页面。

## Requirements

### Requirement 1: pSEO 数据配置系统
**Objective:** As a 开发者, I want 通过一个集中的数据配置文件定义所有 pSEO 页面的内容, so that 高效维护和扩展页面矩阵。

#### Acceptance Criteria
1. The pSEO 数据模块 shall 提供一个类型安全的配置数据结构，包含每个页面的 slug、标题、描述、场景卡片、操作步骤、FAQ 列表和相关页面链接。
2. The pSEO 数据模块 shall 为每种语言（en、zh-CN）提供完整且独立的内容，不得通过简单替换变量生成。
3. The pSEO 数据模块 shall 支持两种页面类别：切割方向页（direction）和场景用例页（use-case）。
4. The pSEO 数据模块 shall 为每个页面定义至少 2 个独特的使用场景卡片和至少 3 个独特的 FAQ 条目。
5. The 所有 pSEO 页面之间的 FAQ 条目和场景说明 shall 不存在内容完全相同的条目（跨类别内容唯一性）。

### Requirement 2: 动态路由与 SSG 静态生成
**Objective:** As a 搜索引擎爬虫, I want 所有 pSEO 页面在构建时就被静态生成为 HTML, so that 获得最快的加载速度和最佳的可索引性。

#### Acceptance Criteria
1. The Next.js 路由系统 shall 通过 `[locale]/[toolSlug]` 动态路由匹配所有 pSEO 页面（静态路由段 `grid`、`workspace`、`tools` 在 Next.js 路由解析中优先于动态 `[toolSlug]` 段）。
2. The Next.js 路由系统 shall 通过 `generateStaticParams` 在构建时为所有语言（en、zh-CN）× 所有 pSEO slug 组合生成静态页面。
3. When 用户访问一个不存在的 toolSlug 时, the Next.js 路由系统 shall 返回 404 页面，而非渲染空白模板。
4. The 构建产物 shall 不影响 `[locale]` 路由段下现有的首页（`/`）、网格页（`/grid`）和工作区页面（`/workspace`、`/grid/workspace`）的路由。

### Requirement 3: pSEO 落地页模板组件
**Objective:** As a 用户, I want 每个 pSEO 落地页都提供一致的高品质体验，包含工具入口、场景说明和操作指引, so that 快速找到我需要的切割功能。

#### Acceptance Criteria
1. The 落地页模板 shall 包含以下区块：导航栏、Hero 区（H1 + 副标题 + CTA）、上传区、场景说明区、操作步骤区、FAQ 区、相关工具区和页脚。
2. The 落地页模板 shall 复用与首页一致的导航栏样式、上传区（UploadZone）、语言切换器（LocaleSwitcher）和页脚样式。
3. The 落地页模板 shall 遵循项目的 Luxury / Editorial 设计风格（Playfair Display 标题、Inter 正文、暖白/炭黑/金色调色板、零圆角）。
4. When 用户在 pSEO 页面上传图片后, the 系统 shall 将用户导航到主工具工作区（`/workspace`），与首页行为一致。

### Requirement 4: 切割方向页面内容
**Objective:** As a 搜索"split image in half"或"图片等分切割"等查询的用户, I want 找到一个专门针对我的切割需求的页面, so that 直接开始切割而无需在通用工具中自行摸索。

#### Acceptance Criteria
1. The 系统 shall 提供以下切割方向页面：对半切（split-in-half）、水平切（split-horizontally）、垂直切（split-vertically）、等分切（split-into-equal-parts）。
2. The 每个切割方向页 shall 包含该方向专属的 H1 标题、场景描述和 FAQ，内容与其他方向页及用例页无重复。
3. The 每个切割方向页 shall 在场景说明区解释该切割方式的具体适用场景（如"对半切适合将对比图分成两张"）。

### Requirement 5: 场景用例页面内容
**Objective:** As a 搜索"split image for instagram"或"长截图分段"等查询的用户, I want 找到一个专门解决我的使用场景的页面, so that 获得针对我场景的操作指引。

#### Acceptance Criteria
1. The 系统 shall 提供以下场景用例页面：长截图分段（split-long-screenshot）、Instagram 切图（split-for-instagram）、微信朋友圈切图（split-for-wechat）、大图打印切割（split-for-print）、替代 PS 切片（no-photoshop-slicer）。
2. The 每个场景用例页 shall 包含该场景专属的 H1 标题、痛点描述、解决方案说明和 FAQ，内容与其他用例页及方向页无重复。
3. The Instagram 切图页 shall 包含 Instagram 帖子尺寸参考信息（如 1080×1080px）。
4. The 微信朋友圈切图页 shall 在英文版本中包含工具基本功能介绍（标题、描述和上传入口），FAQ 和微信特定内容仅在中文版本中呈现。

### Requirement 6: Hub 索引页
**Objective:** As a 用户或搜索引擎爬虫, I want 有一个集中页面列出所有可用的切割工具和用例, so that 便于发现和导航。

#### Acceptance Criteria
1. The 系统 shall 在 `/tools` 路径下提供一个 Hub 索引页（作为静态路由，优先于 `[toolSlug]` 动态路由）。
2. The Hub 索引页 shall 以卡片网格形式展示所有 pSEO 页面（切割方向页 + 场景用例页）+ 已有工具页（首页分割工具、网格工具）。
3. The Hub 索引页 shall 按类别分组展示：切割方向、使用场景、已有工具。
4. The 每张卡片 shall 包含工具名称、简短描述和跳转链接。

### Requirement 7: SEO 元数据与结构化数据
**Objective:** As a 搜索引擎爬虫, I want 每个 pSEO 页面都有完整的元数据和结构化数据, so that 正确索引和展示富摘要。

#### Acceptance Criteria
1. The 每个 pSEO 页面 shall 生成独立的 title tag、meta description、canonical URL 和 hreflang 替代链接（含 x-default）。
2. The 每个 pSEO 页面 shall 包含 FAQPage JSON-LD 结构化数据，内容来自该页面的 FAQ 配置。
3. The 每个 pSEO 页面 shall 包含 HowTo JSON-LD 结构化数据，内容来自该页面的操作步骤配置。
4. The 每个 pSEO 页面 shall 包含 SoftwareApplication JSON-LD 结构化数据，将该工具标注为免费设计类应用（类别为设计应用，报价为免费，价格 0 USD）。
5. The 每个 pSEO 页面的 Open Graph 和 Twitter Card 元数据 shall 使用该页面的独立标题和描述。

### Requirement 8: 内链矩阵与站点地图
**Objective:** As a 搜索引擎爬虫, I want 所有 pSEO 页面相互链接且包含在站点地图中, so that 完整发现和索引。

#### Acceptance Criteria
1. The 每个 pSEO 页面底部 shall 包含"相关工具"区块，链接到至少 3 个其他 pSEO 页面和首页/网格工具。
2. The Hub 索引页 shall 链接到所有 pSEO 页面，形成 Hub-Spoke 结构。
3. The 站点地图 shall 自动包含所有 pSEO 页面的 URL，其中英文版使用无前缀路径（如 `/split-in-half`），中文版使用 `/zh-CN` 前缀（如 `/zh-CN/split-in-half`），并为每个 URL 提供语言替代链接和 x-default。
4. The 首页页脚 shall 包含指向 Hub 索引页的链接。

### Requirement 9: 国际化（i18n）支持
**Objective:** As a 不同语言的用户, I want 在我的语言环境下访问对应语言的 pSEO 页面, so that 获得母语体验。

#### Acceptance Criteria
1. The 每个 pSEO 页面 shall 支持 en 和 zh-CN 两种语言，遵循现有的 `localePrefix: "as-needed"` 策略（英文无前缀，中文 `/zh-CN` 前缀）。
2. The 每个 pSEO 页面的通用 UI 文本（按钮标签、区块标题、导航等） shall 通过 next-intl 的翻译系统（messages JSON）提供，不得在组件中硬编码。pSEO 内容数据（场景说明、FAQ、操作步骤）由 Requirement 1 中的数据配置模块按语言提供。
3. When 用户切换语言时, the 系统 shall 导航到同一 pSEO 页面的对应语言版本。

### Requirement 10: 不影响现有功能
**Objective:** As a 开发者, I want 新增的 pSEO 页面不会破坏现有的路由、功能和用户体验, so that 安全地扩展站点。

#### Acceptance Criteria
1. The 新增的 `[toolSlug]` 动态路由 shall 不匹配现有的 `grid`、`workspace`、`tools` 等已有静态路由。
2. The 项目构建 shall 在新增 pSEO 页面后仍能成功完成，无类型错误和构建警告（Sentry 已知 deprecation 除外）。
3. The 现有首页、网格页和工作区页面的功能和内容 shall 保持不变。
