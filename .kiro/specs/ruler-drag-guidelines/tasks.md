# 实现计划

- [x] 1. 扩展 useSplitLines hook 支持指定位置创建辅助线
  - 在现有 hook 中新增 `addLineAtPosition` 方法，接受方向和位置参数
  - 复用现有的 `clampPosition` 进行边界约束，复用 `maxLinesPerDirection` 进行上限检查
  - 通过 `setLinesWithHistory` 添加以自动支持 undo/redo
  - 在返回值接口中暴露新方法，保持现有 `addLine` 方法不变
  - _Requirements: 2.3, 5.1_

- [x] 2. 创建标尺渲染组件
- [x] 2.1 (P) 实现 Ruler 组件的刻度渲染
  - 创建通用 Ruler 组件，支持水平和垂直两种方向
  - 使用 HTML Canvas 2D API 绘制刻度线和数值标注
  - 根据 scale 动态计算合理的刻度间距（10/50/100/500 等步长）
  - 显示原始图片的像素坐标数值
  - 处理高 DPI 屏幕（devicePixelRatio 缩放）
  - 使用 `useEffect` + `requestAnimationFrame` 在 scale 或尺寸变化时重绘
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2.2 (P) 实现标尺上的辅助线位置标记
  - 在标尺对应位置绘制三角形标记指示器（水平标尺 ▼，垂直标尺 ▶）
  - 标记随辅助线列表变化响应式更新
  - 按钮创建的辅助线和拖拽创建的辅助线使用相同的标记显示
  - _Requirements: 4.2, 5.2_

- [x] 2.3 (P) 实现 CornerBlock 角块组件
  - 创建标尺交汇处左上角的静态角块区域
  - 尺寸与标尺厚度一致，背景色与标尺统一
  - 纯展示组件，无交互逻辑
  - _Requirements: 1.5_

- [x] 3. 实现从标尺拖拽创建辅助线的交互
- [x] 3.1 创建 useRulerDrag hook 核心拖拽逻辑
  - 监听标尺区域的 mousedown 事件启动拖拽
  - 使用全局 mousemove/mouseup 事件管理拖拽生命周期
  - 将屏幕坐标转换为图片像素坐标
  - 在拖拽过程中调用 calculateSnap 实现磁吸效果
  - 在 mouseup 时判定释放位置是否在画布区域内（使用 getBoundingClientRect）
  - 画布内释放时调用 addLineAtPosition 创建辅助线，画布外释放时静默取消
  - 拖拽前检查 canAddHorizontal/canAddVertical，达到上限时使用 toast 提示并阻止拖拽
  - 在组件卸载时清理全局事件监听
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 4.1_

- [x] 3.2 创建 DragPreviewLine 拖拽预览线组件
  - 创建绝对定位的 div 元素，覆盖整个编辑区域
  - 由 useRulerDrag 的拖拽状态驱动显示/隐藏和位置更新
  - 水平预览线为全宽 1-2px 高，垂直预览线为全高 1-2px 宽
  - 使用半透明蓝色样式，mousemove 使用 requestAnimationFrame 节流保证 60fps
  - _Requirements: 2.5_

- [x] 4. 集成标尺和拖拽功能到 SplitEditor
- [x] 4.1 重构 SplitEditor 布局为 L 型标尺包围结构
  - 将现有的单一 Stage 区域改为 CSS Grid 布局：左上角块 + 水平标尺 + 垂直标尺 + Stage
  - 添加编辑区域容器 ref 和 Stage 容器 ref，供 useRulerDrag 使用
  - 将 Ruler、CornerBlock、DragPreviewLine 组件集成到布局中
  - 初始化 useRulerDrag hook 并将其状态传递给各组件
  - 确保标尺仅在图片加载后渲染
  - _Requirements: 1.1, 1.5, 2.1, 2.2, 2.5, 3.1, 5.1_

- [x] 4.2 实现拖拽辅助线回标尺区域删除
  - 在 Konva Line 的 onDragEnd 中增加标尺区域判定逻辑
  - 水平辅助线拖拽到 y 坐标小于标尺厚度时视为删除，垂直辅助线类似
  - 拖拽接近标尺区域时显示视觉反馈（如辅助线变色或透明度变化）提示即将删除
  - 释放在标尺区域内时调用 removeLine 删除，否则正常更新位置
  - _Requirements: 3.1, 3.2, 3.3_

- [ ]* 5. 验证完整用户流程
  - 验证上传图片后标尺正确显示且刻度随图片尺寸适配
  - 验证从水平/垂直标尺拖拽创建辅助线，含磁吸和画布外取消
  - 验证拖拽辅助线回标尺删除，含视觉反馈
  - 验证按钮创建辅助线后标尺标记同步更新
  - 验证 undo/redo 与标尺拖拽创建的兼容性
  - 验证达到 20 条上限时的阻止和提示
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 4.1, 4.2, 5.1, 5.2_
