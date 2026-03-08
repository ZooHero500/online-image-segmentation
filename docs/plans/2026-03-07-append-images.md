# 图片二次补充功能 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 支持用户在已上传图片后追加更多图片到工作区，保留已有分割线。

**Architecture:** 在 SplitEditor 中新增 `handleAppendImages` 回调（追加模式），与现有 `handleImagesLoaded`（替换模式）并行。入口有两个：工具栏按钮 + 画布拖拽。文件验证逻辑从 UploadZone 提取为共享工具函数。

**Tech Stack:** React + TypeScript, Vitest + React Testing Library, Konva.js, Sonner (toast)

---

### Task 1: 提取文件验证逻辑为共享工具函数

目前 `UploadZone.tsx` 中的验证常量和 `loadImage` 函数是模块私有的。为了让 SplitEditor 的工具栏按钮和拖拽功能复用同样的验证逻辑，需要将它们提取到共享模块。

**Files:**
- Create: `src/lib/upload-utils.ts`
- Create: `src/lib/__tests__/upload-utils.test.ts`
- Modify: `src/components/UploadZone.tsx` — 改为从 `upload-utils` 导入

**Step 1: Write the failing test**

```typescript
// src/lib/__tests__/upload-utils.test.ts
import { describe, it, expect } from "vitest"
import { validateFiles, ACCEPTED_TYPES, MAX_SIZE, MAX_TOTAL_SIZE } from "../upload-utils"

describe("validateFiles", () => {
  function makeFile(name: string, size: number, type: string): File {
    const buffer = new ArrayBuffer(size)
    return new File([buffer], name, { type })
  }

  it("should accept valid PNG file", () => {
    const file = makeFile("test.png", 1024, "image/png")
    const result = validateFiles([file])
    expect(result.valid).toBe(true)
    expect(result.files).toHaveLength(1)
  })

  it("should accept valid JPG file", () => {
    const file = makeFile("test.jpg", 1024, "image/jpeg")
    const result = validateFiles([file])
    expect(result.valid).toBe(true)
  })

  it("should accept valid WebP file", () => {
    const file = makeFile("test.webp", 1024, "image/webp")
    const result = validateFiles([file])
    expect(result.valid).toBe(true)
  })

  it("should reject unsupported file type", () => {
    const file = makeFile("test.gif", 1024, "image/gif")
    const result = validateFiles([file])
    expect(result.valid).toBe(false)
    expect(result.error).toContain("不支持")
  })

  it("should reject file exceeding 20MB", () => {
    const file = makeFile("big.png", MAX_SIZE + 1, "image/png")
    const result = validateFiles([file])
    expect(result.valid).toBe(false)
    expect(result.error).toContain("过大")
  })

  it("should accept multiple valid files", () => {
    const files = [
      makeFile("a.png", 1024, "image/png"),
      makeFile("b.jpg", 2048, "image/jpeg"),
    ]
    const result = validateFiles(files)
    expect(result.valid).toBe(true)
    expect(result.files).toHaveLength(2)
  })

  it("should warn but still accept when total exceeds 50MB", () => {
    const files = [
      makeFile("a.png", 30 * 1024 * 1024, "image/png"),
      makeFile("b.png", 25 * 1024 * 1024, "image/png"),
    ]
    const result = validateFiles(files)
    expect(result.valid).toBe(true)
    expect(result.totalSizeWarning).toBe(true)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `bunx vitest run src/lib/__tests__/upload-utils.test.ts`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

```typescript
// src/lib/upload-utils.ts
export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"]
export const MAX_SIZE = 20 * 1024 * 1024 // 20MB per file
export const MAX_TOTAL_SIZE = 50 * 1024 * 1024 // 50MB total

interface ValidationResult {
  valid: boolean
  files: File[]
  error?: string
  totalSizeWarning?: boolean
}

export function validateFiles(files: File[]): ValidationResult {
  const validFiles: File[] = []

  for (const file of files) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return {
        valid: false,
        files: [],
        error: `不支持的文件格式，请上传 PNG、JPG 或 WebP 格式的图片`,
      }
    }
    if (file.size > MAX_SIZE) {
      return {
        valid: false,
        files: [],
        error: `文件 "${file.name}" 过大（超过 20MB），建议压缩后重试`,
      }
    }
    validFiles.push(file)
  }

  const totalSize = validFiles.reduce((sum, f) => sum + f.size, 0)

  return {
    valid: true,
    files: validFiles,
    totalSizeWarning: totalSize > MAX_TOTAL_SIZE,
  }
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }
    img.src = url
  })
}
```

**Step 4: Run test to verify it passes**

Run: `bunx vitest run src/lib/__tests__/upload-utils.test.ts`
Expected: PASS — all 7 tests green

**Step 5: Refactor UploadZone to use shared utils**

Modify `src/components/UploadZone.tsx`:
- Remove the local `ACCEPTED_TYPES`, `MAX_SIZE`, `MAX_TOTAL_SIZE` constants
- Remove the local `loadImage` function
- Import from `@/lib/upload-utils`:
  ```typescript
  import { validateFiles, loadImage, ACCEPTED_TYPES, MAX_TOTAL_SIZE } from "@/lib/upload-utils"
  ```
- Replace the manual validation in `processFiles` with `validateFiles()`:
  ```typescript
  const processFiles = useCallback(
    async (files: FileList) => {
      setError(null)
      const result = validateFiles(Array.from(files))
      if (!result.valid) {
        setError(result.error!)
        return
      }
      if (result.totalSizeWarning) {
        const totalSize = result.files.reduce((sum, f) => sum + f.size, 0)
        toast.warning(
          `总文件大小 ${(totalSize / 1024 / 1024).toFixed(1)}MB 超过 50MB，可能导致浏览器卡顿`
        )
      }
      try {
        const results: UploadResult[] = []
        for (const file of result.files) {
          const image = await loadImage(file)
          results.push({ file, image, mimeType: file.type })
        }
        if (onImagesLoaded) {
          onImagesLoaded(results)
        } else if (onImageLoaded && results.length > 0) {
          onImageLoaded(results[0])
        }
      } catch {
        setError("图片加载失败，请重试")
      }
    },
    [onImageLoaded, onImagesLoaded]
  )
  ```

**Step 6: Run all tests to verify no regressions**

Run: `bunx vitest run`
Expected: All existing tests still pass

**Step 7: Commit**

```bash
git add src/lib/upload-utils.ts src/lib/__tests__/upload-utils.test.ts src/components/UploadZone.tsx
git commit -m "refactor: extract file validation logic to shared upload-utils module"
```

---

### Task 2: 新增 handleAppendImages + 工具栏按钮

在 SplitEditor 中添加追加图片的核心逻辑和工具栏按钮入口。

**Files:**
- Modify: `src/components/SplitEditor.tsx`

**Step 1: Add appendImages handler and toolbar input ref**

在 `SplitEditor` 组件内（`uploadCountRef` 声明之后）添加：

```typescript
const appendInputRef = useRef<HTMLInputElement>(null)

const handleAppendImages = useCallback(
  async (fileList: FileList) => {
    const result = validateFiles(Array.from(fileList))
    if (!result.valid) {
      toast.error(result.error!)
      return
    }
    if (result.totalSizeWarning) {
      const totalSize = result.files.reduce((sum, f) => sum + f.size, 0)
      toast.warning(
        `总文件大小 ${(totalSize / 1024 / 1024).toFixed(1)}MB 超过 50MB，可能导致浏览器卡顿`
      )
    }
    try {
      const newItems: ImageItem[] = []
      for (const file of result.files) {
        const image = await loadImage(file)
        newItems.push({ image, fileName: file.name, mimeType: file.type })
      }
      setImages((prev) => {
        const merged = [...prev, ...newItems]
        const newLayout = calculateLayout(merged)
        setImagePositions(newLayout.offsets)
        return merged
      })
      clearResults()
      toast.success(`已添加 ${newItems.length} 张图片`)
    } catch {
      toast.error("图片加载失败，请重试")
    }
  },
  [clearResults]
)
```

Add imports at the top of the file:
```typescript
import { validateFiles, loadImage } from "@/lib/upload-utils"
import { ImagePlus } from "lucide-react"
```

**Step 2: Add toolbar button**

在工具栏中"重新上传"按钮之前添加：

```tsx
<>
  <input
    ref={appendInputRef}
    type="file"
    accept="image/png,image/jpeg,image/webp"
    multiple
    className="hidden"
    onChange={(e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleAppendImages(e.target.files)
      }
      if (appendInputRef.current) appendInputRef.current.value = ""
    }}
  />
  <Button
    size="sm"
    variant="ghost"
    onClick={() => appendInputRef.current?.click()}
  >
    <ImagePlus className="h-4 w-4 mr-1" />
    添加图片
  </Button>
</>
```

**Step 3: Run the app and manually verify**

Run: `bun dev`
- Upload an image
- Draw a split line
- Click "添加图片" button
- Verify: new image appears appended, split line is preserved
- Verify: toast shows "已添加 N 张图片"

**Step 4: Commit**

```bash
git add src/components/SplitEditor.tsx
git commit -m "feat: add append images button to toolbar"
```

---

### Task 3: 画布区域拖拽追加

在编辑器画布区域支持拖拽文件追加图片。

**Files:**
- Modify: `src/components/SplitEditor.tsx`

**Step 1: Add drag state and handlers**

在 `SplitEditor` 组件内添加拖拽状态：

```typescript
const [isFileDragOver, setIsFileDragOver] = useState(false)
```

在编辑器容器 `containerRef` 的 `<div>` 上添加拖拽事件处理：

```tsx
<div
  ref={containerRef}
  className={`relative w-full bg-muted/30 rounded-lg overflow-hidden flex-1 ${
    isFileDragOver ? "ring-2 ring-[#D4AF37] bg-[#D4AF37]/5" : ""
  }`}
  style={{ minHeight: 400 }}
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onDragOver={(e) => {
    // Only react to file drags, not Konva internal drags
    if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault()
      setIsFileDragOver(true)
    }
  }}
  onDragLeave={(e) => {
    // Only reset if leaving the container (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsFileDragOver(false)
    }
  }}
  onDrop={(e) => {
    setIsFileDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      e.preventDefault()
      handleAppendImages(e.dataTransfer.files)
    }
  }}
>
```

**Step 2: Run the app and manually verify**

Run: `bun dev`
- Upload an image
- Draw a split line
- Drag a new image file onto the canvas area
- Verify: gold ring appears on hover
- Verify: new image appended, split line preserved
- Verify: ring disappears after drop

**Step 3: Run all tests to verify no regressions**

Run: `bunx vitest run`
Expected: All tests pass

**Step 4: Commit**

```bash
git add src/components/SplitEditor.tsx
git commit -m "feat: support drag-and-drop to append images on canvas"
```

---

### Task 4: 总大小累计检查

当前的总大小警告只检查新添加的文件。追加模式下需要考虑已有图片的大小。

**Files:**
- Modify: `src/lib/upload-utils.ts`
- Modify: `src/lib/__tests__/upload-utils.test.ts`
- Modify: `src/components/SplitEditor.tsx`

**Step 1: Write the failing test**

在 `upload-utils.test.ts` 中添加：

```typescript
it("should warn when new files + existing size exceeds 50MB", () => {
  const file = makeFile("new.png", 10 * 1024 * 1024, "image/png")
  const existingSize = 45 * 1024 * 1024 // 45MB already loaded
  const result = validateFiles([file], existingSize)
  expect(result.valid).toBe(true)
  expect(result.totalSizeWarning).toBe(true)
})

it("should not warn when new files + existing size is under 50MB", () => {
  const file = makeFile("new.png", 1024, "image/png")
  const existingSize = 10 * 1024 * 1024
  const result = validateFiles([file], existingSize)
  expect(result.valid).toBe(true)
  expect(result.totalSizeWarning).toBe(false)
})
```

**Step 2: Run test to verify it fails**

Run: `bunx vitest run src/lib/__tests__/upload-utils.test.ts`
Expected: FAIL — `validateFiles` doesn't accept second parameter yet

**Step 3: Update implementation**

Modify `validateFiles` in `src/lib/upload-utils.ts` to accept optional `existingSize`:

```typescript
export function validateFiles(files: File[], existingSize: number = 0): ValidationResult {
  // ... validation logic unchanged ...

  const totalSize = validFiles.reduce((sum, f) => sum + f.size, 0)

  return {
    valid: true,
    files: validFiles,
    totalSizeWarning: totalSize + existingSize > MAX_TOTAL_SIZE,
  }
}
```

**Step 4: Run test to verify it passes**

Run: `bunx vitest run src/lib/__tests__/upload-utils.test.ts`
Expected: PASS — all tests green

**Step 5: Update SplitEditor to pass existing size**

In `handleAppendImages`, compute existing image sizes and pass to `validateFiles`:

```typescript
// Estimate existing images total size (use naturalWidth * naturalHeight * 4 as rough byte estimate)
const existingSize = images.reduce((sum, img) => {
  return sum + img.image.naturalWidth * img.image.naturalHeight * 4
}, 0)
const result = validateFiles(Array.from(fileList), existingSize)
```

**Step 6: Run all tests**

Run: `bunx vitest run`
Expected: All tests pass

**Step 7: Commit**

```bash
git add src/lib/upload-utils.ts src/lib/__tests__/upload-utils.test.ts src/components/SplitEditor.tsx
git commit -m "feat: include existing image size in total size warning for append"
```

---

### Task 5: 最终验证和清理

**Step 1: Run full test suite**

Run: `bunx vitest run`
Expected: All tests pass

**Step 2: Run linter/type check**

Run: `bunx tsc --noEmit`
Expected: No type errors

**Step 3: Manual end-to-end test checklist**

Run: `bun dev` and verify:

1. [ ] 首次上传多张图片正常工作
2. [ ] 上传后点击"添加图片"可以选择更多文件
3. [ ] 添加后分割线保留不变
4. [ ] 添加后之前的分割结果被清除
5. [ ] 拖拽文件到画布区域可以追加
6. [ ] 拖拽时画布有金色高亮边框
7. [ ] 不支持的文件格式显示错误 toast
8. [ ] 超大文件显示警告 toast
9. [ ] "重新上传"按钮仍然正常（替换所有图片）
10. [ ] 缩略图条正确显示所有图片

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete append images feature with toolbar button and canvas drag-drop"
```
