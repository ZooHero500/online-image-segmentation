# 调研与设计决策

---
**用途**: 记录发现阶段的调研成果、架构评估和技术决策依据。
---

## 摘要
- **功能**: `image-splitter`
- **发现范围**: 新功能（Greenfield）
- **关键发现**:
  - react-konva v19.2.0 原生支持拖拽 + 磁吸，通过 `onDragMove` 轴锁定 + 近距离阈值实现分割线交互
  - JSZip v3.10.1 可在浏览器端生成 ZIP，使用 `generateAsync({ type: 'blob' })` + `URL.createObjectURL()` 触发下载，无需 FileSaver.js
  - Dexie.js 4.x 是 IndexedDB 最佳封装选择，提供 `useLiveQuery` React Hook 实现数据响应式更新

## 调研日志

### react-konva 分割线交互方案
- **背景**: 需要实现可拖拽的横向/纵向分割线，带磁吸效果
- **来源**: [Konva 官方文档 - Objects Snapping](https://konvajs.org/docs/sandbox/Objects_Snapping.html)、[Drag a Line](https://konvajs.org/docs/drag_and_drop/Drag_a_Line.html)
- **发现**:
  - 使用 `<Line draggable>` 组件，`onDragMove` 中通过 `node.x(0)` 或 `node.y(fixed)` 锁定非移动轴
  - 磁吸通过计算与目标位置的像素距离，阈值内自动对齐（`Math.abs(pos - target) < threshold`）
  - 磁吸目标包括：图片边缘、其他分割线位置、画布中心线
  - `dragBoundFunc` 可用于硬约束分割线在图片范围内
- **影响**: 无需额外拖拽库（@dnd-kit 等），react-konva 内置能力完全满足需求

### JSZip 客户端打包方案
- **背景**: 需要将多张子图片打包为 ZIP 下载
- **来源**: [JSZip 官方文档](https://stuk.github.io/jszip/)
- **发现**:
  - v3.10.1 稳定，~25 kB gzipped
  - `zip.file(name, blob)` 直接添加 Blob，`generateAsync({ type: 'blob' })` 生成 ZIP Blob
  - 支持进度回调 `metadata.percent`
  - 建议通过 `dynamic import()` 按需加载，避免首屏包体积增加
- **影响**: 作为唯一的打包依赖，按需加载策略可保持首屏性能

### IndexedDB 封装库选型
- **背景**: 需要存储图片 Blob 和操作元数据
- **来源**: [idb GitHub](https://github.com/jakearchibald/idb)、[Dexie.js](https://dexie.org/)
- **发现**:
  - idb 8.0.3（~1.19 kB）：轻量 Promise 封装，适合简单存取
  - Dexie.js 4.x（~22 kB）：声明式 schema、链式查询、`useLiveQuery` React Hook
  - 关键规则：**永远不要在 IndexedDB schema 中索引 Blob 列**，只索引元数据字段
  - Dexie 的 `useLiveQuery` 可实现历史记录列表自动更新，减少手动状态同步
- **影响**: 选择 Dexie.js，`useLiveQuery` 的 React 集成优势值得 ~20 kB 额外开销

### Next.js 15 Canvas 组件集成模式
- **背景**: SSR/SSG 页面需要集成客户端 Canvas 组件
- **来源**: [Next.js Lazy Loading Guide](https://nextjs.org/docs/app/guides/lazy-loading)
- **发现**:
  - `ssr: false` 必须在 `'use client'` 组件内调用，不能在 Server Component 中使用
  - 需要双层模式：Wrapper Client Component（调用 `dynamic()`）→ 实际 Canvas Component
  - 页面保持 Server Component 以支持 SSR/SSG 的 metadata、SEO 内容
  - 重型库（react-konva、JSZip）应全部动态导入
- **影响**: 落地页 SEO 内容由 Server Component 渲染，裁剪组件通过 dynamic import 客户端加载

### Canvas API 图片裁切与格式保持
- **背景**: 需要按分割线位置裁切原始图片并保持画质
- **来源**: [MDN drawImage()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)、[MDN toBlob()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
- **发现**:
  - 9 参数 `drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)` 实现精确区域裁切
  - `toBlob()` 不会自动检测原始格式，需手动跟踪并传入 MIME type
  - WebP 输入时可统一导出为 PNG（需求要求）
  - 批量裁切可用 `OffscreenCanvas` + Web Worker 避免主线程阻塞
- **影响**: 格式跟踪逻辑需在上传时记录 MIME type，裁切时传入

## 架构模式评估

| 方案 | 描述 | 优势 | 风险/限制 | 备注 |
|------|------|------|-----------|------|
| 分层架构 | UI → Hooks → Lib 三层分离 | 简单清晰、与 steering 一致 | 中大型项目可能需要更细粒度 | 当前规模最适合 |
| 特性模块化 | 按功能模块独立封装 | 隔离性好 | 过度工程、共享组件抽取困难 | 当前不需要 |

## 设计决策

### 决策：IndexedDB 封装库
- **背景**: 需要可靠的浏览器端图片存储方案
- **备选方案**:
  1. idb 8.x — 超轻量，Promise 封装
  2. Dexie.js 4.x — 功能丰富，React 集成
- **选择**: Dexie.js 4.x
- **理由**: `useLiveQuery` 自动同步历史记录列表，减少手动状态管理。22 kB 的额外开销对于功能收益而言完全可接受
- **权衡**: 包体积稍大，但开发效率和用户体验提升显著
- **后续**: 确保 Blob 数据不被索引

### 决策：分割线交互方案
- **背景**: 需要拖拽分割线 + 磁吸效果
- **备选方案**:
  1. react-konva 内置拖拽 — 原生支持
  2. @dnd-kit + Canvas — 额外依赖
  3. 原生 PointerEvent — 需手写大量逻辑
- **选择**: react-konva 内置拖拽
- **理由**: 零额外依赖，`onDragMove` + `dragBoundFunc` 完全覆盖轴锁定、磁吸、边界约束需求
- **权衡**: 无
- **后续**: 无

### 决策：撤销/重做实现方案
- **背景**: 需求 2.9/2.10 要求分割线操作的撤销/重做
- **备选方案**:
  1. 操作栈模式（Command Pattern）— 记录每次操作的 action + inverse
  2. 状态快照模式 — 每次操作保存完整 state snapshot
- **选择**: 状态快照模式
- **理由**: 分割线数据量极小（每条仅 3 个字段：id、orientation、position），快照模式实现更简单，避免为每种操作维护 inverse action 的复杂度。50 层快照的内存开销可忽略不计
- **权衡**: 内存占用略高于 Command Pattern，但对于分割线这种小数据量场景完全可接受
- **后续**: 仅对分割线操作支持撤销/重做，不扩展到图片上传等操作

## 风险与缓解

- 大图片（>10MB）裁切可能阻塞主线程 — 可使用 OffscreenCanvas + Worker，初版可延后
- IndexedDB 存储配额因浏览器而异 — 添加存储空间检测和用户提示
- react-konva 在移动端触摸事件兼容性 — 桌面端优先，移动端降级处理

## 参考资料
- [react-konva npm v19.2.0](https://www.npmjs.com/package/react-konva)
- [Konva.js Objects Snapping](https://konvajs.org/docs/sandbox/Objects_Snapping.html)
- [JSZip v3.10.1](https://stuk.github.io/jszip/)
- [Dexie.js 4.x](https://dexie.org/)
- [idb 8.0.3](https://github.com/jakearchibald/idb)
- [Next.js Lazy Loading](https://nextjs.org/docs/app/guides/lazy-loading)
- [MDN drawImage()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)
- [MDN toBlob()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
