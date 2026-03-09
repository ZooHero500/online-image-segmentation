# AI 智能图像分割 — 设计方案

## 概述

为在线图片分割工具新增 AI 智能分割功能。用户上传图片后，AI 自动识别图中元素（人物、背景、物体等），用户选择要分割的元素，系统精准分割并以 PS 式图层面板呈现结果。

与现有手动画线分割功能**完全独立**，作为工作区的另一个工具入口。

## 技术架构

### 整体流程

```
前端 (Next.js)
    │
    ├─ /api/analyze ──▶ Grok Vision (xAI API)
    │                    识别图片元素，返回标签列表
    │
    └─ /api/segment ──▶ Replicate Lang-SAM
                         根据标签分割图片，返回透明 PNG mask
```

### 技术选型

| 组件 | 技术 | 用途 |
|------|------|------|
| 图片元素识别 | Grok Vision (xAI API) | 分析图片内容，输出可分割元素标签列表 |
| 图片分割 | Lang-SAM (Replicate) | 根据文字提示精准分割图片，输出 mask |
| API 层 | Next.js API Routes | 代理前端请求，管理 API 密钥 |
| 图层渲染 | Konva.js | 画布上叠加遮罩、切换显隐 |

### 为什么选这些技术

**Grok Vision**：视觉识别能力顶级，输出格式可控（JSON），价格合理（~$0.02/次），xAI API 使用 OpenAI 兼容格式，接入简单。

**Lang-SAM（而非 SAM 2）**：支持文字提示分割（"人物"、"背景"），输出语义明确的分割结果，而非无意义的几何碎片。$0.0014/次，极具性价比。

**Next.js API Routes（而非独立 Python 服务）**：Replicate 提供 JS SDK，无需自建推理服务，保持项目技术栈统一。

### 数据流

```
1. 用户上传/选择图片
       ↓
2. 前端将图片发送到 /api/analyze
       ↓
3. /api/analyze 调用 Grok Vision API
   Prompt: "分析图片，列出所有可独立分割的视觉元素，返回 JSON"
       ↓
4. 返回标签列表: [{label_en: "person", label_zh: "人物主体"}, ...]
       ↓
5. 用户在面板中勾选要分割的标签
       ↓
6. 前端将图片 + 选中标签发送到 /api/segment
       ↓
7. /api/segment 对每个标签调用 Replicate Lang-SAM API
       ↓
8. 返回每个标签对应的 mask 图片（透明 PNG）
       ↓
9. 前端在 Konva 画布上渲染图层叠加效果
```

## 用户交互设计

### 入口

侧边栏新增 **"AI 分割"** 按钮（Lucide `Sparkles` 图标），与现有手动分割工具并列。点击后进入 AI 分割工作流，右侧面板切换为 AI 分割面板。

### 三步式引导流程

面板顶部显示步骤指示器，用户始终知道当前进度：

```
● 识别  ───  ○ 选择  ───  ○ 分割
```

---

### Step 1：上传与识别

**画布区域**：
- 若工作区已有图片，直接复用，无需重新上传
- 若无图片，显示上传区域（复用现有 UploadZone 组件）
- 识别期间，画布图片叠加微弱的呼吸动画（animate-pulse, opacity 0.5）

**右侧面板**：
- 显示 skeleton 骨架屏占位（3-4 行），表示正在分析
- 所有按钮禁用，防止重复提交
- 预计耗时 1-3 秒

---

### Step 2：选择元素

**右侧面板**：
- 标签以 Checkbox 列表展示（shadcn Checkbox 组件）
- 每行：Checkbox + 颜色色块 + 中文标签名
- 默认选中前 2 个最主要元素，其余不勾选
- 底部提供自定义输入框，支持中英文，回车添加新标签
- "重新识别"按钮：识别结果不满意时可重新分析
- "开始分割"按钮：至少选 1 个标签才可点击

**画布区域**：
- 鼠标悬停面板中某标签 → 画布对应区域短暂高亮提示（如果模型返回了粗略位置信息）

---

### Step 3：分割结果 — PS 式图层体验

**分割进行中**：
- 进度条 + 文案：`正在分割... (2/3)`
- 每完成一个标签，对应图层实时出现在面板和画布上

**画布区域 — 遮罩叠加模式**：
- 每个分割元素用不同颜色的半透明遮罩叠加在原图上（opacity ~0.3）
- 隐藏某图层时，该区域变为棋盘格透明底，直观呈现"挖掉"效果
- 悬停图层面板某行 → 该区域遮罩加深（opacity 0.6），突出显示

**画布区域 — 独立预览模式**：
- 点击图层行 → 画布只显示该单个图层 + 棋盘格透明底
- 方便查看单个元素的分割质量和导出效果

**右侧图层面板**：
- 每行：Eye 图标（显隐切换）+ 颜色色块 + 标签名 + Download 图标（单独导出）
- 点击 Eye 图标切换该图层显隐，transition-opacity duration-200
- 面板底部：显示模式切换（遮罩叠加 / 独立预览）

**导出**：
- 单个导出：点击图层行的 Download 图标 → 透明背景 PNG
- 批量导出：面板底部"全部导出 ZIP"按钮 → 所有可见图层打包为 ZIP
- 复用现有 zip-exporter 模块

## UX 规范

| 规范 | 实现 |
|------|------|
| 图标 | Lucide SVG 图标（Sparkles, Eye, EyeOff, Download, RefreshCw），不用 emoji |
| 动画时长 | 150-300ms，ease-out 进入，ease-in 退出 |
| 无障碍 | 所有按钮有 aria-label，Tab 键可导航整个流程 |
| 减弱动效 | 检测 prefers-reduced-motion，跳过呼吸动画 |
| 触控目标 | 最小 44x44px |
| 错误反馈 | Toast 通知（sonner），如 API 调用失败、识别超时等 |
| 成功反馈 | 分割完成时 Toast + 图层面板平滑展开动画 |
| 色彩对比度 | 遮罩颜色满足 4.5:1 对比度，文字标签清晰可读 |
| 按钮状态 | 异步操作期间禁用按钮 + 显示 loading spinner |

## API 设计

### POST /api/analyze

识别图片中的可分割元素。

**请求**：
```json
{
  "image": "data:image/png;base64,..."
}
```

**响应**：
```json
{
  "elements": [
    { "label_en": "person", "label_zh": "人物主体", "confidence": 0.95 },
    { "label_en": "background", "label_zh": "背景", "confidence": 0.90 },
    { "label_en": "sky", "label_zh": "天空", "confidence": 0.85 }
  ]
}
```

### POST /api/segment

根据指定标签分割图片。

**请求**：
```json
{
  "image": "data:image/png;base64,...",
  "labels": ["person", "background"]
}
```

**响应**：
```json
{
  "segments": [
    {
      "label_en": "person",
      "label_zh": "人物主体",
      "mask_url": "https://replicate.delivery/...",
      "color": "#3B82F6"
    },
    {
      "label_en": "background",
      "label_zh": "背景",
      "mask_url": "https://replicate.delivery/...",
      "color": "#22C55E"
    }
  ]
}
```

## 新增文件结构

```
src/
├── app/[locale]/workspace/
│   └── page.tsx                    # 新增 AI 分割入口按钮
├── components/
│   ├── AiSegmentation.tsx          # AI 分割主面板（三步流程编排）
│   ├── AiSegmentationLayers.tsx    # 图层面板（显隐、导出）
│   └── AiSegmentationCanvas.tsx    # 画布遮罩叠加渲染
├── hooks/
│   ├── use-ai-analyze.ts           # Grok Vision 识别 hook
│   └── use-ai-segment.ts           # Lang-SAM 分割 hook
├── app/api/
│   ├── analyze/route.ts            # Grok Vision 代理接口
│   └── segment/route.ts            # Replicate Lang-SAM 代理接口
└── lib/
    └── ai-segmentation.ts          # 分割业务逻辑（颜色分配、mask 处理等）
```

## 成本估算

| 操作 | 单次成本 | 说明 |
|------|---------|------|
| Grok Vision 识别 | ~$0.02 | 一次图片分析 |
| Lang-SAM 分割 | ~$0.0014 × N | N = 用户选择的标签数量 |
| 典型场景（识别 + 分割 3 个元素） | ~$0.024 | |
| 日均 100 次使用 | ~$2.4/天，~$72/月 | |

## 安全考虑

- API 密钥（xAI、Replicate）存储在环境变量中，仅服务端可访问
- Next.js API Routes 作为代理层，前端不直接暴露第三方 API 密钥
- 图片通过 API 传输，建议限制最大文件大小（如 10MB）
- 考虑添加速率限制，防止滥用

## 国际化

- 所有面板文案纳入 next-intl 翻译（en.json / zh-CN.json）
- Grok 返回的标签包含 label_en 和 label_zh，前端根据当前语言显示
- 自定义输入支持中英文，后端统一使用 label_en 调用 Lang-SAM
