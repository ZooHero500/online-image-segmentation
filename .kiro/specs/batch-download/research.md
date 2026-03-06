# 研究与设计决策日志

## 摘要
- **功能**: batch-download（多选图片打包下载）
- **发现范围**: Extension（扩展现有系统）
- **关键发现**:
  - 现有 `exportAsZip` 已支持接收任意 `SplitResult[]` 子集，无需修改核心导出逻辑
  - `ResultSheet` 组件为纯展示组件，选中状态管理应提升到 Hook 层
  - 现有 `ZipExportOptions` 类型可直接复用于批量下载场景

## 研究日志

### 现有导出架构分析
- **背景**: 确认现有 ZIP 导出逻辑是否可复用于选中子集下载
- **来源**: `src/lib/zip-exporter.ts`、`src/hooks/use-image-export.ts`
- **发现**:
  - `exportAsZip` 接收 `ZipExportOptions`，其中 `results: SplitResult[]` 可传入任意子集
  - `getZipFileName` 当前固定使用 `_split.zip` 后缀，批量下载需使用 `_selected.zip`
  - `downloadSingle` 和 `downloadAll` 逻辑独立，新增 `downloadSelected` 不影响现有功能
- **影响**: 无需修改 `exportAsZip` 核心逻辑，仅需在 Hook 层新增选中状态管理和批量下载方法

### 选中状态管理策略
- **背景**: 确定选中状态应放在哪个层级
- **发现**:
  - 选中状态与 UI 交互紧密相关，属于 ResultSheet 的内部关注点
  - 但批量下载需要调用 `exportAsZip`，该逻辑已封装在 `useImageExport` Hook 中
  - 选中状态放在 `useImageExport` 中可保持导出逻辑的集中管理
- **影响**: 在 `useImageExport` 中新增选中状态（`Set<string>`）和相关方法

## 架构模式评估

| 方案 | 描述 | 优势 | 风险/限制 | 备注 |
|------|------|------|-----------|------|
| Hook 层管理选中状态 | 在 `useImageExport` 中管理 `selectedKeys` | 导出逻辑集中，与现有 `downloadAll` 并列 | Hook 略微增大 | 推荐方案 |
| 组件内管理选中状态 | 在 `ResultSheet` 中用 `useState` | 状态就近管理 | 需要回传选中列表给父组件调用导出 | 增加 props 传递复杂度 |

## 设计决策

### 决策：选中标识使用 `row-col` 字符串键
- **背景**: 需要一个唯一标识来追踪每张子图片的选中状态
- **备选方案**:
  1. 使用 `row-col` 字符串组合作为键
  2. 为 `SplitResult` 新增 `id` 字段
- **选定方案**: 使用 `row-col` 字符串键
- **理由**: `SplitResult` 的 `row` 和 `col` 组合天然唯一，无需修改现有类型定义
- **权衡**: 需要一个辅助函数生成键，但避免了修改核心类型

### 决策：ZIP 文件名区分批量下载
- **背景**: 批量下载的 ZIP 需要与"下载全部"区分
- **选定方案**: 批量下载使用 `{原始文件名}_selected.zip`，保持现有 `_split.zip` 不变
- **理由**: 用户可通过文件名区分两种下载来源

## 风险与缓解
- 大量图片全选时 ZIP 生成可能较慢 — 现有 `exportAsZip` 已为异步操作，UI 可复用 loading 状态
- 选中状态在面板关闭/重新生成时需清除 — 通过 Hook 的 `clearResults` 和面板 `onClose` 事件处理

## 参考
- 现有实现：`src/lib/zip-exporter.ts`、`src/hooks/use-image-export.ts`、`src/components/ResultSheet.tsx`
- JSZip 库：已在项目中使用，无需新增依赖
