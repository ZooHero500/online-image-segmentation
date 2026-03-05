# 工作区视口画布改造设计

> 日期: 2026-03-05
> 状态: 已批准

## 问题

当前画布/工作区尺寸由上传图片决定（`Stage 尺寸 = imageWidth * scale`），导致小图片工作区很小、大图片可能溢出。不符合专业编辑工具的交互预期。

## 方案

**方案 A：Konva Stage 级缩放**（已选定）

利用 Konva Stage 的 `scaleX/scaleY` 和 `x/y` 属性实现视口级别的缩放和平移。Stage 尺寸固定为浏览器可视区域大小，图片作为 Stage 内的内容被缩放和平移。

### 其他考虑方案

- **方案 B: CSS Transform** — 简单但 Konva 事件坐标不一致，交互出问题
- **方案 C: 双 Layer 分层** — 灵活但坐标转换复杂度高

## 详细设计

### 1. 工作区布局

- Stage 尺寸始终等于容器可视区域（`containerSize.width` x `containerSize.height`），通过 ResizeObserver 响应式更新
- 标尺固定 20px，占据顶部和左侧
- 网格布局保持：`grid-template: 20px 1fr / 20px 1fr`，外层容器改为 `width: 100%, height: 100%` 填满父级
- 图片初始加载时计算 fit-to-view 缩放比例，居中显示，周围有画布底色

### 2. 缩放与平移

**缩放：**
- 滚轮缩放，以鼠标指针位置为中心点（Figma 标准行为）
- 缩放范围：10% ~ 1000%（`0.1 ~ 10`）
- 初始缩放：fit-to-view，图片完整显示居中，周围留约 5% padding
- `Cmd/Ctrl + 0`：重置为 fit-to-view
- `Cmd/Ctrl + 1`：重置为 100%

**平移：**
- 空格 + 鼠标拖拽：按住空格切换为手形工具
- 鼠标中键拖拽：直接平移
- 触控板双指平移：自然支持

**状态：**
- 新增 `stageScale`（number）和 `stagePosition`（{x, y}）
- Stage: `scaleX={stageScale} scaleY={stageScale} x={stagePosition.x} y={stagePosition.y}`

**坐标转换：**
- 鼠标 → 世界坐标：`(mousePos - stagePosition) / stageScale`
- 分割线位置仍以图片原始坐标存储，渲染由 Stage scale 自动处理

### 3. 参考线与标尺

**参考线：**
- 贯穿整个可视 Stage（Figma 风格），不仅限于图片区域
- 水平线：Stage 左边缘到右边缘
- 垂直线：Stage 上边缘到下边缘
- 使用 `stage.width() / stageScale` 计算世界坐标下的可视范围
- 拖拽、吸附、删除逻辑保持不变
- 分割计算仍只作用于图片区域

**标尺：**
- 刻度根据 `stageScale` 和 `stagePosition` 动态计算
- 显示世界坐标（图片原始像素）
- 可视范围：`(-stagePosition / stageScale)` 到 `((-stagePosition + viewportSize) / stageScale)`
- 三角标记位置：`splitLinePosition * stageScale + stagePosition`

### 4. 视觉反馈

**缩放指示器（底部右下角）：**
- 显示当前缩放百分比
- 可点击输入自定义值
- "Fit" 和 "100%" 快捷按钮

**画布背景：**
- 图片外区域：深灰 `#1e1e1e`（暗色）/ `#f0f0f0`（亮色）

**光标：**
- 默认：箭头
- 空格按住：`grab` / 拖拽中 `grabbing`
- 悬停参考线：对应方向 resize 光标

## 影响范围

### 需修改的文件
- `src/components/SplitEditor.tsx` — Stage 尺寸、缩放平移、参考线渲染
- `src/components/Ruler.tsx` — 刻度计算适配缩放
- `src/hooks/use-ruler-drag.ts` — 坐标转换适配
- `src/hooks/use-split-lines.ts` — 可能需要微调坐标转换

### 新增
- 缩放平移 hook（如 `use-canvas-viewport.ts`）
- 缩放指示器组件（如 `ZoomIndicator.tsx`）

### 不变
- `src/lib/image-splitter.ts` — 分割算法不变
- `src/lib/storage-service.ts` — 存储不变
- `src/types/index.ts` — 类型定义可能需要扩展
