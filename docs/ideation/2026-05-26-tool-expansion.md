# ImgSplit 工具扩展 Ideation

> 日期: 2026-05-26
> 状态: 已批准，全部实施
> 范围: 围绕现有 3 个核心工具（自由分割、网格分割、Resize），扩展 7 个新工具

## 现状基线

| # | 核心工具 | 核心技术 |
|---|---------|---------|
| 1 | 自由分割 (拖拽线切图) | Konva.js canvas + image-splitter.ts |
| 2 | 网格分割 (预设社交网格) | grid-splitter.ts + 平台预设 |
| 3 | 图片缩放 (Resize) | CropOverlay + resize-export.ts |

12 个 pSEO 变体本质上都是这 3 个能力的不同包装。

---

## Top 7 新工具（按实施顺序）

### 1. 图片压缩 & 格式转换
- **功能**: 拖拽上传 → 选格式/调质量 → 实时预览文件大小 → 下载
- **复用**: `resize-export.ts` 的 quality 参数 + `upload-utils.ts` + `zip-exporter.ts`
- **SEO**: png-to-webp, jpg-to-png, compress-jpeg 等 10+ 落地页
- **工作量**: ~200 行新代码，~1 天
- **大胆度**: 低

### 2. 独立裁剪工具 (社媒预设)
- **功能**: 上传 → 选平台预设 (IG 1:1, Story 9:16, YouTube 16:9...) → 拖拽裁剪 → 下载
- **复用**: `CropOverlay.tsx`, `CropRect`, `constrainCropRect()` — 80% 已有
- **SEO**: crop-for-instagram, youtube-thumbnail-crop 等
- **工作量**: ~150 行新代码，~1 天
- **大胆度**: 低

### 3. 图片水印工具
- **功能**: 上传 → 添加文字/图片水印 → 调整位置/透明度/旋转/平铺 → 导出；批量应用作为后续增强
- **复用**: Konva.js Text + Image 图层, `resize-export.ts`
- **SEO**: watermark-maker, add-watermark-to-photo, add-watermark-to-image, online-watermark-tool
- **工作量**: ~500 行新代码，~2 天
- **大胆度**: 中
- **落地状态**: 2026-06-04 已完成单图水印 MVP 与 4 个 pSEO 页面；DataForSEO 显示 watermark maker / add watermark to photo / add watermark to image 为优先词组

### 4. 照片拼图/拼贴 (Collage)
- **功能**: 上传多张图 → 选模板布局 → 拖拽调整 → 导出一张图
- **复用**: `GridEditorState` cell 定位 + Konva 多图层 + `Transformer`
- **SEO**: photo-collage-maker, free-photo-collage-maker, photo-grid-maker, picture-grid-maker, instagram-story-collage, instagram-collage-maker
- **工作量**: ~800 行新代码，~3 天
- **大胆度**: 中
- **落地状态**: 2026-06-04 已完成模板化照片拼图 MVP 与 6 个 pSEO 页面；支持 `/collage` 多图上传、10 个模板、空 frame 点击/拖拽上传、frame 内定位/缩放/旋转、间距/边距/圆角/背景控制和 PNG/JPEG/WebP 导出

### 5. 隐私打码/马赛克工具
- **功能**: 上传 → 框选区域 → 马赛克/高斯模糊/纯色遮挡 → 导出（像素级不可逆）
- **复用**: Konva.js filter (blur/pixelate) + canvas getImageData/putImageData
- **SEO**: blur-face-in-photo, pixelate-image-online, mosaic-tool
- **工作量**: ~400 行新代码，~2 天
- **大胆度**: 中
- **附带**: 可内嵌 EXIF 元数据清除功能

### 6. 社媒多平台一键导出
- **功能**: 一张图 → 同时生成 IG/FB/Twitter/YouTube/小红书所有尺寸 → ZIP 下载
- **复用**: `calculateFillTransform/calculateFitTransform` + `exportArtboard` + `zip-exporter`
- **SEO**: instagram-image-size, youtube-thumbnail-size
- **工作量**: ~600 行新代码，~2 天
- **大胆度**: 中
- **落地状态**: 2026-06-04 已完成单图多平台尺寸批量导出 MVP；支持 `/social-export` 上传一张图片后生成 Instagram、YouTube、Facebook、X、LinkedIn、TikTok、小红书、微信等 12 个尺寸输出，逐个微调裁剪并按平台命名 ZIP 导出。SEO 已用 DataForSEO 重排，英文主推 Instagram/YouTube/Facebook/LinkedIn/Twitter 尺寸词，中文小红书/微信页面按 locale-specific pSEO 拆分。

### 7. 背景移除 (浏览器端 AI)
- **功能**: 上传 → 一键移除背景 → 透明 PNG。可选替换纯色/渐变/自定义背景
- **复用**: 已有 `AiSegmentation` 组件基础，ONNX Runtime Web 客户端推理
- **SEO**: remove-background-free, transparent-background-maker
- **工作量**: ~1200 行新代码，~5 天
- **大胆度**: 高
- **风险**: 模型加载时间、移动端性能
- **体验要求**: 首次运行前清楚提示需要下载本地 AI 模型，解释模型用于在浏览器内完成去背景、图片不会上传；展示模型大小、下载进度和缓存状态；缓存命中后避免重复下载，并提供重试、重新下载与清理缓存入口。
- **实施状态**: 2026-06-05 已完成 `/remove-background` 本地 AI MVP，采用 Transformers.js + 站内托管 `imgsplit/rmbg-1.4` RMBG 模型，通过 Web Worker 本地推理，优先 WebGPU、失败回退 WASM，并提供透明 PNG/WebP 与白底 JPG 导出。后续已补齐批量队列、失败重试、ZIP 下载、`remove-background-free` / `transparent-background-maker` / `bulk-background-remover` 长尾页、工具入口与内部编辑器导航。首次运行前清楚提示模型下载原因、大小、进度、缓存状态与隐私说明。

---

## 实施路线图

```
Phase 1 (快速收割 SEO 流量)   → ① 压缩转换 + ② 裁剪工具     ~3天
Phase 2 (工具矩阵扩展)       → ③ 水印 + ⑤ 隐私打码          ~4天
Phase 3 (品牌延伸)           → ④ 拼图 + ⑥ 社媒导出           ~5天
Phase 4 (差异化壁垒)         → ⑦ AI 背景移除                 ~7天
```

总计: ~19 天，7 个新工具，50+ 新 pSEO 落地页

---

## 淘汰列表

| 淘汰 | 理由 |
|------|------|
| 图片旋转 & 翻转 | 太薄，作为 Resize 内置功能 |
| AI 点击抠图 (SAM) | SAM 模型 100MB+，移动端不可用 |
| 图片-PDF 互转 | 偏离品牌定位，用户画像不同 |
| EXIF 查看/清除 | 用完即走，内嵌到隐私打码工具中 |
| Before/After 对比 | 受众太窄，ROI 不高 |
| 证件照制作 | 各国规格不同，法律合规风险 |
| 颜色取色/调色板 | 用户画像偏设计师，与核心用户不重叠 |
| 图片标注/批注 | 工程量大但差异化不足 |
| 社媒轮播图生成器 | 本质是 Grid Splitter 的增强 |
| 批量处理流水线 | 架构概念，应内嵌到每个工具中 |
