# Carousel Splitter 设计文档

> 日期:2026-06-25 · 状态:已批准设计,待实施计划
> 关联研究:`marketing/keyword-research-carousel.md`

## 1. 背景与目标

关键词研究(DataForSEO 实时数据)发现一块低竞争、高意图的蓝海:葡语(巴西)`cortar carrossel` 词簇约 **1.6 万/月、竞争 LOW**,搜索意图为「立刻要切图工具」。当前 SERP 第一仅为单页微工具,且教程视频普遍把用户导向**未本地化**的 PineTools(英文,仅排第 7)——本地化的轮播切割工具卡位空缺。

本站(ImgSplit,imgsplit.com)已具备核心切割引擎与成熟的程序化 SEO(pSEO)系统,补齐「轮播图无缝切割 + 葡语本地化」即可吃下该流量。

**v1 目标**:
- 新增独立 `/carousel` 工具:把一张宽图无缝切成 2–10 张轮播幻灯片
- 新增 `pt-BR` 语言;carousel 落地页覆盖 6 语言
- 通过 pSEO 本地化 slug 命中 `cortar carrossel` 等高价值词

**非目标(v1 不做)**:印尼语 locale、视频轮播、AI 生成轮播、间隙/白边选项。

## 2. 范围决策(已确认)

| 维度 | 决策 |
|------|------|
| 范围 | 产品 + 内容一起做(引擎升级 + 落地页 + pt-BR) |
| 产品形态 | 独立 `/carousel` 工具,底层复用切割引擎 |
| 新增语言 | 仅 `pt-BR`(carousel 落地页在 6 语言出) |
| 引擎行为 | 2–10 份任选 + 4:5/1:1/原始 三比例预设,无缝竖切,无间隙 |
| 引擎实现 | 方案 B:抽出共享 canvas helper + 新建专注的 carousel 引擎 |

## 3. 架构与文件结构

**新增路由**(镜像 grid 两层结构):
```
src/app/[locale]/carousel/
  page.tsx · layout.tsx · CarouselLandingContent.tsx
  workspace/ page.tsx · layout.tsx · CarouselWorkspaceClient.tsx
```

**引擎层(方案 B)**:
```
src/lib/image-canvas.ts        # 新:抽出 computeScale / cropCell / mime 解析
src/lib/grid-splitter.ts       # 改:改 import image-canvas(行为不变)
src/lib/carousel-splitter.ts   # 新:轮播切割引擎(1×N + 比例预设)
```

**接入系统**:
```
src/lib/tools/catalog.ts                # 改:加 carousel CoreTool
src/i18n/routing.ts                     # 改:locales 加 "pt-BR"
src/messages/pt-BR.json                 # 新:整套葡语 UI 文案
src/lib/pseo/carousel-pages.ts          # 新:carousel slug 的多语言 pSEO 内容
src/lib/pseo/index.ts                   # 改:合入 carousel-pages + pt-BR 维度
src/app/[locale]/[toolSlug]/page.tsx    # 改:OG locale 映射加 pt-BR
src/messages/{en,zh-CN,ja,ko,es}.json   # 改:加 carousel 工具 UI 键
```

**原则**:carousel 引擎与工作区为独立可测试单元;对已测试的 grid 仅做「helper 抽取」这一种零行为变化的安全改动,不做无关重构。

## 4. 切割引擎 API 与算法

`src/lib/carousel-splitter.ts`:
```ts
export type AspectPreset = "4:5" | "1:1" | "original"

export interface CarouselEditorState {
  slideCount: number   // 2–10,越界 clamp
  aspect: AspectPreset
  offsetX: number
  offsetY: number
  scale: number
}

export interface CarouselSlide {
  index: number; blob: Blob; width: number; height: number
}

export function getSlideSize(aspect: AspectPreset, image: HTMLImageElement): { w: number; h: number }
//  4:5 → 1080×1350    1:1 → 1080×1080    original → 由原图高度推导(不强制比例)

export async function splitCarousel(
  image: HTMLImageElement,
  state: CarouselEditorState
): Promise<CarouselSlide[]>
```

**无缝切割算法**:
1. 合成画布 = N 张幻灯片横向拼接:`totalW = slideCount × slideW`,`totalH = slideH`(例:3 张 4:5 → 3240×1350)
2. 上传宽图按 **cover** 填入合成画布,叠加用户 `offsetX/offsetY/scale`
3. 沿 X 轴等分 N 列,每列裁出 `slideW × slideH`
4. N 列来自同一连续合成图 → 滑动严丝合缝 = 无缝轮播

**复用底层**:`computeScale`(超大画布降采样,防超 `MAX_CANVAS_AREA`/`MAX_CANVAS_DIMENSION`)、`cropCell`、mime 解析,全部来自新抽出的 `image-canvas.ts`。

**边界**:`slideCount` clamp 到 2–10;`original` 比例直接按原图等分、不强制目标比例;导出复用 `zip-exporter.ts`(加 `exportCarouselAsZip` + 文件名函数)。

## 5. 工作区 UI 与数据流

**3 步流程**:上传 → 调整 → 下载(复用 grid 交互骨架)。

**Step 2 控件**:
- `CarouselCountSelector`:2–10 份选择
- `AspectSelector`:4:5 / 1:1 / 原始
- `CarouselEditor`(Konva):合成画布 + N-1 条切割分隔线预览,可拖拽/缩放定位原图
- `CarouselPreview`:横排 N 张切片缩略图,展示滑动衔接

**新增组件** `src/components/carousel/`:CarouselSteps · CarouselUploadZone · CarouselCountSelector · AspectSelector · CarouselEditor · CarouselPreview
**新增 hook**:`src/hooks/use-carousel-editor.ts`(持有 `CarouselEditorState`)

**数据流**:
```
File → loadImage() → HTMLImageElement
     → use-carousel-editor(份数/比例/定位)
     → splitCarousel() → CarouselSlide[]
     → 预览 + 单张保存 / exportCarouselAsZip() 打包下载
```

**复用**:`loadImage`、`pending-carousel-upload`(镜像 `pending-grid-upload`)、`zip-exporter`、纯客户端处理(零上传)。

## 6. pSEO 内容与布线

**本地化 slug 策略**(URL 直接命中关键词;`getAllToolPageParams` 只为有内容的 (slug,locale) 生成页):

| slug | 出的语言 | 目标词 / 月量 |
|------|---------|--------------|
| `cortar-carrossel` | pt-BR | cortar carrossel · 6,600 |
| `cortar-imagens-carrossel` | pt-BR | cortar imagens carrossel · 2,400 |
| `cortar-carrossel-infinito` | pt-BR | cortar carrossel infinito · 1,900 |
| `carousel-splitter` | en/es/ja/ko/zh-CN | carousel splitter |
| `canva-image-splitter` | en | canva image splitter · 1,900(KD≈0) |

> v1 上前 4–5 个高价值 slug;其余后续加数据扩充。

**`src/lib/pseo/carousel-pages.ts`**:导出 `carouselPagesByLocale`,每 slug 填 `ToolPageData`,FAQ 命中 People Also Ask 4 条(Como recortar um carrossel? / Qual app cortar carrossel? / Como cortar um carrossel em partes? / vídeo),relatedTools 指向 grid、collage、social-export。

**布线**:见 §3 文件清单。sitemap 走现有 `getAllToolPageParams` + catalog 机制自动收录;`[toolSlug]` 已有 `JsonLd`,carousel 页注入 `SoftwareApplication` + `FAQPage` schema。

## 7. 测试策略

**单元测试(vitest,镜像现有 `grid-splitter.test.ts`)**:
- `image-canvas.test.ts`:抽出的 helper 行为不变(可复用 grid 现有断言迁移)
- `carousel-splitter.test.ts`:
  - 各 slideCount(2/5/10)输出正确数量切片
  - 4:5 / 1:1 输出像素尺寸正确(1080×1350 / 1080×1080)
  - `original` 比例等分正确
  - slideCount 越界 clamp 到 [2,10]
  - 超大图触发 `computeScale` 降采样不超限
  - 相邻切片像素衔接连续(无缝验证:取合成图边界列对比)
- `zip-exporter` carousel 分支:文件名、ZIP 条目数

**回归保障**:`grid-splitter` 现有测试在 helper 抽取后必须全绿(证明零行为变化)。

**i18n 完整性**:校验 `pt-BR.json` 键集合与 `en.json` 对齐(无缺键);`pseo` carousel 数据每个声明的 (slug,locale) 都有完整 `ToolPageData`。

**构建校验**:`bun run build` 通过,`/carousel`、`/pt-BR/cortar-carrossel` 等路由进入 `generateStaticParams`。

## 8. 验收标准

- [ ] `/carousel/workspace` 能上传宽图、选 2–10 份与 3 种比例、拖拽定位、预览无缝、单张/打包下载
- [ ] `grid-splitter` 全部既有测试通过(零回归)
- [ ] `pt-BR` locale 可用,`/pt-BR/cortar-carrossel` 等落地页渲染葡语内容 + 正确 canonical/hreflang
- [ ] carousel 落地页 6 语言出,FAQ/SoftwareApplication schema 有效
- [ ] sitemap 收录新工具与新 slug
- [ ] `bun run build` 与全部 vitest 通过
