# 图片二次补充功能设计

## 概述

支持用户在已上传图片并开始编辑后，追加更多图片到工作区，同时保留已有的分割线。

## 需求

- 上传图片后，支持继续添加更多图片
- 已有分割线保留不变
- 新图片追加到现有图片序列末尾
- 入口：工具栏"添加图片"按钮 + 画布区域拖拽文件
- 沿用现有文件限制（单张 20MB，总计 50MB 警告）

## 方案

**方案 A（采用）**：最小改动，复用 UploadZone 验证逻辑 + 新增追加模式。

### 改动文件

1. `src/components/SplitEditor.tsx` — 主要改动
2. `src/components/UploadZone.tsx` — 无需改动

### 数据流

```
用户补充图片（工具栏按钮 / 画布拖拽）
  ↓
文件验证（类型、大小）
  ↓
loadImage() → HTMLImageElement[]
  ↓
SplitEditor.handleAppendImages()
  ↓
setImages(prev => [...prev, ...newImages])
  ↓
calculateLayout() 自动重算（useMemo）
  ↓
imagePositions 重新计算
  ↓
分割线保持不变 ✓
clearResults() 清除已有分割结果
```

### 具体改动

#### 1. 新增 `handleAppendImages` 回调

在 `SplitEditor` 中新增追加逻辑，区别于现有的 `handleImagesLoaded`（替换模式）：

```typescript
const handleAppendImages = useCallback((results: UploadResult[]) => {
  const newItems = results.map(r => ({
    image: r.image,
    fileName: r.file.name,
    mimeType: r.mimeType,
  }))
  setImages(prev => {
    const merged = [...prev, ...newItems]
    const newLayout = calculateLayout(merged)
    setImagePositions(newLayout.offsets)
    return merged
  })
  clearResults()
}, [clearResults])
```

#### 2. 工具栏"添加图片"按钮

在"重新上传"按钮左侧添加一个"添加图片"按钮，内含隐藏的 `<input type="file" multiple>`。复用 UploadZone 的文件验证逻辑（类型白名单、大小检查）。

#### 3. 画布区域拖拽追加

在编辑器容器上增加 `onDrop` / `onDragOver` 事件处理：
- 检测拖入的是文件（非分割线拖拽）
- 已有图片时走追加逻辑
- 显示拖拽悬停状态

### 注意事项

- 追加后调用 `clearResults()` 清除已有分割结果
- 分割线保留，但 layout 重算后 totalWidth/totalHeight 变化，部分线可能不再穿过图片
- 总大小警告需要考虑已有图片 + 新增图片的累计大小
