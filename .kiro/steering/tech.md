# 技术栈

## 架构

Next.js Web 应用，支持 SSR/SSG（SEO 页面）与客户端渲染（画布编辑器）混合模式。图片处理与数据存储均在浏览器端完成。

## 核心技术

- **语言**: TypeScript（严格模式）
- **框架**: Next.js（SSR/SSG + 客户端渲染混合）
- **运行时/包管理器**: Bun
- **UI 组件库**: shadcn/ui
- **CSS**: Tailwind CSS

## 关键库

- **Canvas 交互**: Konva.js + react-konva（分割线拖拽、磁吸、图层管理）
- **图片处理**: Canvas API（矩形裁切、导出）
- **本地存储**: IndexedDB（图片等大数据）+ localStorage（元数据/配置）

## 开发标准

### 类型安全
- 严禁使用 `any` 类型
- 所有参数和返回值必须显式声明类型
- 使用 discriminated unions 处理错误状态
- 泛型约束必须明确指定

### 代码质量
- 单一职责原则：每个组件/函数只负责一个明确功能
- 清晰边界：UI 组件不含业务逻辑
- 依赖方向：遵循架构层次

## 开发环境

### 常用命令
```bash
# 安装依赖: bun install
# 开发: bun dev
# 构建: bun run build
# 测试: bun test
```

## 关键技术决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 渲染方式 | SSR/SSG + 客户端渲染混合 | SEO 页面用 SSR/SSG，编辑器用客户端渲染 |
| 数据存储 | 浏览器本地 | 隐私优先，零服务端依赖 |
| 包管理器 | Bun | 更快的安装与运行速度 |
| Canvas 方案 | Konva.js + react-konva | 原生拖拽/磁吸支持，React 集成好 |
| UI 方案 | shadcn/ui + Tailwind | 源码级引入，灵活可定制 |

---
_记录标准与模式，而非列举所有依赖_
