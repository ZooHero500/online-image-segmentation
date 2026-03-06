# 项目结构

## 组织哲学

采用 **功能优先（feature-first）** 的目录组织方式，结合 Next.js App Router 约定。UI 组件与业务逻辑分离，通用工具集中管理。

## 目录模式

### 页面路由
**位置**: `app/`
**用途**: Next.js App Router 页面与布局
**示例**: `app/page.tsx`（主画布入口）、`app/layout.tsx`

### UI 组件
**位置**: `components/ui/`
**用途**: shadcn/ui 基础组件，无业务逻辑
**示例**: `components/ui/button.tsx`、`components/ui/dialog.tsx`

### 业务组件
**位置**: `components/`（扁平结构）
**用途**: 包含业务逻辑的功能组件
**示例**: `components/SplitEditor.tsx`（画布编辑器）、`components/ResultSheet.tsx`（结果面板）、`components/HistorySidebar.tsx`（历史记录）

### 核心逻辑
**位置**: `lib/`（扁平结构）
**用途**: 与 UI 无关的纯逻辑模块
**示例**: `lib/image-splitter.ts`（图片分割算法）、`lib/storage-service.ts`（本地存储封装）

### 自定义 Hooks
**位置**: `hooks/`
**用途**: 可复用的 React Hooks
**示例**: `hooks/use-split-lines.ts`、`hooks/use-history.ts`

### 类型定义
**位置**: `types/`
**用途**: 全局共享的 TypeScript 类型
**示例**: `types/index.ts`（集中定义所有接口）

## 命名规范

- **React 组件文件**: PascalCase（`SplitLine.tsx`、`ImageCanvas.tsx`）
- **工具/hooks 文件**: kebab-case（`use-split-lines.ts`、`image-splitter.ts`）
- **页面路由文件**: Next.js 约定（`page.tsx`、`layout.tsx`）
- **组件名**: PascalCase
- **函数/变量名**: camelCase
- **类型/接口名**: PascalCase

## Import 规范

```typescript
// 1. 外部依赖
import { useState } from 'react'

// 2. 绝对路径（路径别名）
import { Button } from '@/components/ui/button'
import { splitImage } from '@/lib/image/splitter'

// 3. 相对路径（同目录/子目录）
import { SplitLine } from './SplitLine'
```

**路径别名**: `@/` → 项目根目录（tsconfig.json paths 配置）

## 代码组织原则

- **UI 与逻辑分离**: 组件只负责展示，核心算法放在 `lib/` 中
- **单向依赖**: `components/` → `lib/`、`hooks/` → `lib/`，反向禁止
- **最小接口**: 组件 props 只暴露必要属性

---
_记录组织模式，而非目录树。遵循模式的新文件无需更新此文档_
