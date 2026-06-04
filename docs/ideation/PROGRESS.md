# ImgSplit 工具扩展 — 实施进度

> 基于 [2026-05-26 Ideation](./2026-05-26-tool-expansion.md) | 共 7 个新工具 | 4 个阶段

## 总览

| 阶段 | 工具 | 状态 | 开始 | 完成 | 备注 |
|------|------|------|------|------|------|
| P1 | ① 图片压缩 & 格式转换 | 🟢 已完成 | 2026-05-26 | 2026-05-26 | 10 pSEO 页, 5 语言 |
| P1 | ② Resize 裁剪增强 (社媒预设) | 🟢 已完成 | 2026-05-28 | 2026-05-29 | 4 pSEO 页, 5 语言, 预设 UI 已优化 |
| P2 | ③ 图片水印工具 | 🟢 已完成 | 2026-06-04 | 2026-06-04 | 工具 MVP + 4 pSEO 页, 5 语言；批量水印暂缓 |
| P2 | ⑤ 隐私打码/马赛克 | 🟢 已完成 | 2026-06-04 | 2026-06-04 | 工具 MVP + 画笔/图片遮罩增强 + 8 pSEO 页, 5 语言, 跳转已验证 |
| P3 | ④ 照片拼图/拼贴 | ⬜ 未开始 | - | - | |
| P3 | ⑥ 社媒多平台一键导出 | ⬜ 未开始 | - | - | |
| P4 | ⑦ AI 背景移除 | ⬜ 未开始 | - | - | |

**状态图例**: ⬜ 未开始 | 🔵 Spec 中 | 🟡 开发中 | 🟢 已完成 | 🔴 阻塞

---

## Phase 1 — 快速收割 SEO 流量 (~3天)

### ① 图片压缩 & 格式转换
- **状态**: 🟢 已完成
- **实际**: ~600 行新代码, 1 天
- **Spec**: `docs/superpowers/specs/2026-05-26-image-compress-convert-design.md`
- **Plan**: `docs/superpowers/plans/2026-05-26-image-compress-convert.md`
- **子任务**:
  - [x] Spec: 需求 → 设计 → 任务
  - [x] 核心: 压缩引擎 (canvas.toBlob quality 控制)
  - [x] 核心: 格式转换 (PNG/JPEG/WebP 互转)
  - [x] UI: 质量滑块 + 实时文件大小预览
  - [x] UI: 批量模式 + ZIP 下载
  - [x] pSEO: 10 个落地页 (compress-jpeg, png-to-webp, jpg-to-png 等)
  - [x] i18n: 5 语言翻译
  - [x] 集成: Tools Hub + Sitemap + Footer + Nav

### ② Resize 裁剪增强 (社媒预设)
- **状态**: 🟢 已完成
- **实际**: ~1 天
- **说明**: 直接在 Resize 上增强；未拆独立编辑器。社媒入口通过 `/resize?preset=...` 打开对应尺寸。预设 UI 已拆为通用比例与场景/社媒尺寸两组，标签保持单行并提供 hover tooltip。
- **子任务**:
  - [x] 核心: 集中社媒尺寸预设 (IG Square, Story, YouTube, FB Cover)
  - [x] 核心: 抽出初始裁剪框计算，复用双击裁剪与按钮裁剪
  - [x] UI: Resize 中新增显式 Crop 按钮
  - [x] UI: 恢复通用比例预设 (1:1, 4:3, 3:4, 16:9, 9:16)
  - [x] UI: 场景/社媒尺寸预设独立分组，避免与通用比例混在一起
  - [x] UI: 预设标签单行显示，过长截断并通过 tooltip 展示完整名称
  - [x] URL: `/resize?preset=...` 预设入口
  - [x] pSEO: 4 个落地页 (crop-image, crop-for-instagram, instagram-story-crop, youtube-thumbnail-crop)
  - [x] i18n: 5 语言翻译
  - [x] 集成: pSEO CTA + Sitemap

---

## Phase 2 — 工具矩阵扩展 (~4天)

### ③ 图片水印工具
- **状态**: 🟢 已完成
- **实际**: ~1 天；先完成单图水印 MVP，批量水印暂缓
- **Spec**: -
- **说明**: 水印工具已上线 `/watermark`，支持上传图片后的 canvas 实时预览、文字水印、Logo 图层、透明度/位置/大小/旋转/平铺控制、PNG/JPEG/WebP 导出。已修复模板切换导致 Logo 图层丢失的问题，并补齐入口、导航、sitemap 与多语言文案。
- **DataForSEO**: 2026-06-04 使用 US / English live 数据验证水印长尾词；优先落地 4 个页面。
- **子任务**:
  - [x] 核心: 文字水印 (内容/大小/颜色/透明度/旋转)
  - [x] 核心: 图片水印 (Logo 叠加)
  - [x] 核心: 平铺模式 (对角线重复)
  - [x] UI: 水印配置面板 + canvas 实时预览
  - [x] 交互: 模板切换保留 Logo/其他图层，模板只更新目标文字层
  - [x] 导出: PNG/JPEG/WebP + 质量控制
  - [x] 集成: Home / Tools / Footer / Compress / Resize / Sitemap 入口
  - [x] pSEO: 4 个落地页 (watermark-maker, add-watermark-to-photo, add-watermark-to-image, online-watermark-tool)
  - [x] i18n: 5 语言翻译
  - [ ] 批量: 多图批量加水印（当前 DataForSEO 量级不作为第一批落地，后续评估）

### ⑤ 隐私打码/马赛克
- **状态**: 🟢 已完成
- **实际**: ~1 天；完成单图矩形区域打码 MVP，并增强自由画笔、橡皮擦与自定义图片遮罩
- **Spec**: -
- **说明**: 隐私打码工具已上线 `/mosaic`，支持上传单图后用矩形区域、自由画笔、橡皮擦和自定义图片遮罩隐藏敏感内容，效果包含马赛克、模糊、纯色遮挡；图片遮罩支持拖动、缩放、透明度与旋转调节；支持图层列表、删除/清空、PNG/JPEG/WebP 导出，canvas 重新编码会剥离常见图片元数据。已接入 Tools Hub、Footer、返回用户快捷栏、Sitemap、编辑器互链、5 语言文案与 8 个 pSEO 长尾页。
- **DataForSEO**: 2026-06-04 使用 US / English live 数据补充校准；优先保留 `blur face in photo`、`pixelate image online`、`mosaic tool`，并新增更高量的 `blur face`、`pixelate image`、`censor image online`、`redact image`；`redact image online` 保留为旧长尾入口。
- **跳转验证**: 2026-06-04 已验证 8 个隐私打码 pSEO slug 在 `en`、`zh-CN`、`ja`、`ko`、`es` 均有页面数据；CTA 与上传入口通过 `TOOL_EDITOR_HREFS` 指向 `/mosaic`，非默认语言渲染为对应 locale 下的 `/mosaic`；本地 HTML 抽查通过。
- **子任务**:
  - [x] Spec/Plan: 需求 → 设计 → 任务
  - [x] 核心: 区域选择 (矩形框选)
  - [x] 核心: 自由画笔遮罩
  - [x] 核心: 画笔橡皮擦
  - [x] 核心: 自定义图片遮罩 (拖动/缩放/透明度/旋转)
  - [x] 核心: 马赛克效果 (pixelate)
  - [x] 核心: 高斯模糊效果
  - [x] 核心: 纯色遮挡
  - [x] 核心: EXIF 元数据清除 (canvas 重新编码附带)
  - [x] UI: 效果选择器 + 强度滑块
  - [x] pSEO: 8 个落地页 (blur-face, blur-face-in-photo, pixelate-image, pixelate-image-online, censor-image-online, mosaic-tool, redact-image, redact-image-online)
  - [x] 验证: 8 个 pSEO 长尾页 CTA/上传入口跳转到 `/mosaic`，非默认语言保留 locale 前缀
  - [x] i18n: 5 语言翻译
  - [x] 集成: Tools Hub + Sitemap + Footer + Nav

---

## Phase 3 — 品牌延伸 (~5天)

### ④ 照片拼图/拼贴 (Collage)
- **状态**: ⬜ 未开始
- **预估**: ~800 行新代码, ~3 天
- **Spec**: -
- **子任务**:
  - [ ] Spec: 需求 → 设计 → 任务
  - [ ] 核心: 模板布局系统 (2-up, 3-panel, 4-grid, mosaic)
  - [ ] 核心: 多图上传 + 拖入 slot
  - [ ] 核心: 每张图独立裁剪/缩放/位移
  - [ ] UI: 模板选择器 + 间距/背景控制
  - [ ] 导出: 合成单图输出
  - [ ] pSEO + i18n + 集成

### ⑥ 社媒多平台一键导出
- **状态**: ⬜ 未开始
- **预估**: ~600 行新代码, ~2 天
- **Spec**: -
- **子任务**:
  - [ ] Spec: 需求 → 设计 → 任务
  - [ ] 核心: 平台尺寸预设库 (IG/FB/Twitter/YouTube/小红书/微信)
  - [ ] 核心: 批量裁剪引擎 (一图 → N 尺寸)
  - [ ] UI: 多尺寸预览网格 + 逐个调整裁剪位置
  - [ ] 导出: 按平台命名的 ZIP 包
  - [ ] pSEO + i18n + 集成

---

## Phase 4 — 差异化壁垒 (~7天)

### ⑦ AI 背景移除
- **状态**: ⬜ 未开始
- **预估**: ~1200 行新代码, ~5 天
- **Spec**: -
- **风险**: 模型加载时间、移动端性能
- **子任务**:
  - [ ] Spec: 需求 → 设计 → 任务
  - [ ] 研究: ONNX 模型选型 (RMBG-1.4 vs MODNet vs IS-Net)
  - [ ] 核心: ONNX Runtime Web 集成
  - [ ] 核心: 前景/背景分割推理
  - [ ] 核心: 背景替换 (纯色/渐变/自定义图片)
  - [ ] UI: 一键移除 + 边缘精修笔刷
  - [ ] 优化: Web Worker + 模型缓存
  - [ ] pSEO + i18n + 集成

---

## 变更日志

| 日期 | 变更 |
|------|------|
| 2026-05-26 | Ideation 完成，7 个工具全部批准，创建进度追踪 |
| 2026-05-26 | ① 图片压缩 & 格式转换 — 完成全部实施 (11 tasks, 10 pSEO, 5 languages) |
| 2026-05-28 | ② Resize 裁剪增强 — 完成实施 (4 pSEO, 5 languages) |
| 2026-05-29 | ② Resize 裁剪增强 — 预设 UI 分组优化，恢复通用比例预设，社媒预设单独分组，补充单行显示和 tooltip |
| 2026-06-04 | ③ 图片水印工具 — 完成单图水印 MVP，修复上传预览与 Logo/模板交互问题，补齐入口与 5 语言文案 |
| 2026-06-04 | ③ 图片水印 pSEO — 接入 DataForSEO MCP，完成关键词分析并新增 4 个长尾落地页 (4 pSEO, 5 languages) |
| 2026-06-04 | ⑤ 隐私打码/马赛克 — 完成 `/mosaic` 单图矩形打码 MVP，支持马赛克/模糊/纯色遮挡、导出、4 pSEO 与 5 语言文案 |
| 2026-06-04 | ⑤ 隐私打码/马赛克 — 增强自由画笔、橡皮擦、自定义图片遮罩图层，支持图片遮罩拖动/缩放/透明度/旋转 |
| 2026-06-04 | ⑤ 隐私打码 pSEO — 补跑 DataForSEO MCP 校准，新增 blur-face、pixelate-image、censor-image-online、redact-image，扩展到 8 个长尾页 |
| 2026-06-04 | ⑤ 隐私打码 pSEO — 验证 8 个长尾页 CTA/上传入口均指向 `/mosaic`，非默认语言正确保留 locale 前缀 |
