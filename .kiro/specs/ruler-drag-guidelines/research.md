# 研究与设计决策日志

---
**目的**: 记录发现阶段的研究结果和架构调查，为技术设计提供依据。
---

## 概要
- **特性**: `ruler-drag-guidelines`
- **发现范围**: Extension（现有画布编辑器扩展）
- **关键发现**:
  - 标尺应使用 HTML Canvas 2D 渲染（非 Konva 层），以获得精确的文字和刻度渲染
  - 拖拽交互需要在 HTML 层和 Konva Stage 之间协调鼠标事件
  - 现有 `useSplitLines` hook 需要扩展 `addLineAtPosition` 方法以支持指定位置创建

## 研究日志

### 标尺渲染方案选型
- **背景**: 需要在画布边缘显示带刻度和数字的标尺
- **来源**: Figma 标尺交互参考、Konva.js 文档
- **发现**:
  - 方案 A: Konva Layer 渲染标尺 — 刻度/文字在 WebGL 管线中渲染，受 Stage 变换影响，需额外抵消偏移
  - 方案 B: 独立 HTML Canvas 元素 — 使用 Canvas 2D API 绘制刻度和数字，独立于 Konva Stage，性能好、控制精确
  - 方案 C: 纯 DOM/SVG 元素 — 大量 DOM 节点，刻度多时性能差
- **结论**: 选择方案 B — HTML Canvas 元素，与 Konva Stage 并列布局

### 拖拽交互实现方式
- **背景**: 从标尺拖拽创建辅助线需要跨越 HTML 标尺和 Konva Stage 两个区域
- **发现**:
  - Konva 的 `draggable` 仅适用于已在 Stage 内的节点，不适合跨区域拖拽
  - 需要使用全局 `mousedown/mousemove/mouseup` 事件在 HTML 层管理拖拽状态
  - 拖拽预览线可以用一个绝对定位的 HTML 元素（CSS line）覆盖在整个编辑区域上
- **结论**: 拖拽状态管理在 React hook 中完成，预览线使用绝对定位 div

### 现有代码集成点
- **背景**: 需要最小化对现有代码的修改
- **发现**:
  - `useSplitLines.addLine()` 总是在中心位置创建线，需要扩展为支持指定位置
  - `SplitEditor.tsx` 布局需要从单一 Stage 改为 Grid 布局（标尺 + Stage）
  - `calculateSnap` 已抽象良好，可直接复用
  - undo/redo 通过 `setLinesWithHistory` 自动支持
- **结论**: 扩展 `addLine` 签名，修改 `SplitEditor` 布局结构

## 架构方案评估

| 方案 | 描述 | 优势 | 风险/限制 | 备注 |
|------|------|------|-----------|------|
| HTML Canvas 标尺 | 独立 Canvas 2D 元素绘制标尺 | 渲染精确、性能好、独立于 Konva | 需要手动管理坐标同步 | 选定方案 |
| Konva Layer 标尺 | 在 Konva Stage 内添加标尺层 | 统一坐标系 | 受 Stage 变换影响、文字渲染质量差 | 排除 |

## 设计决策

### 决策: 标尺使用 HTML Canvas 2D 渲染
- **背景**: 标尺需要固定在视口边缘、不随画布缩放变形
- **备选方案**:
  1. Konva Layer — 统一管理但受 Stage 变换影响
  2. HTML Canvas 2D — 独立渲染、精确控制
- **选定方案**: HTML Canvas 2D
- **原因**: 标尺是固定 UI 元素，不应参与 Stage 的变换管线
- **权衡**: 需要手动同步坐标，但复杂度可控

### 决策: 拖拽预览使用绝对定位 HTML 元素
- **背景**: 拖拽过程中需要显示跨越标尺和画布的预览线
- **备选方案**:
  1. 在 Konva Stage 中实时创建/删除预览节点
  2. 使用绝对定位 div 覆盖整个编辑区域
- **选定方案**: 绝对定位 div
- **原因**: 预览线是临时 UI 反馈，不需要进入 Konva 渲染管线；HTML 元素更容易控制样式和定位
- **权衡**: 需要将鼠标位置转换为图片坐标，但这个转换已有先例（现有 dragBoundFunc）

## 风险与缓解
- 坐标同步误差 — 标尺刻度与画布实际位置可能出现 1px 偏差，通过统一使用 `Math.round` 和相同的 scale 计算公式缓解
- 高 DPI 屏幕模糊 — Canvas 2D 需要处理 `devicePixelRatio`，在标尺渲染时应用 DPR 缩放
- 拖拽取消边界判定 — 需要明确定义"画布区域外"的判定逻辑，使用标尺/Stage 容器的 `getBoundingClientRect` 判断

## 参考资料
- Konva.js 官方文档 — Stage/Layer 事件模型
- Figma 标尺交互行为 — 视觉参考
