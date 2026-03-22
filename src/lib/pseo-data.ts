// ─── Types ───

export type ToolCategory = "direction" | "use-case"

export interface ScenarioCard {
  icon: string
  title: string
  description: string
}

export interface HowToStep {
  stepNumber: number
  title: string
  description: string
}

export interface FaqEntry {
  question: string
  answer: string
}

export interface RelatedTool {
  slug: string
  title: string
  description: string
}

export interface ToolPageSeo {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
}

export interface ToolPageData {
  slug: string
  category: ToolCategory
  seo: ToolPageSeo
  hero: {
    overline: string
    headlinePart1: string
    headlineAccent: string
    headlinePart2: string
    description: string
  }
  scenarios: ScenarioCard[]
  howToSteps: HowToStep[]
  faqEntries: FaqEntry[]
  relatedTools: RelatedTool[]
  platformInfo?: string
}

export interface ToolPageConfig {
  slug: string
  category: ToolCategory
  locales: Record<string, ToolPageData>
}

// ─── Data ───

const toolPages: ToolPageConfig[] = [
  // ═══════════════════════════════════════
  // DIRECTION PAGES
  // ═══════════════════════════════════════

  {
    slug: "split-in-half",
    category: "direction",
    locales: {
      en: {
        slug: "split-in-half",
        category: "direction",
        seo: {
          title: "Split Image in Half Online — Free 50/50 Image Divider | ImgSplit",
          description: "Split any image in half instantly — horizontally or vertically. Free online tool with pixel-perfect precision, no upload to servers, 100% browser-based.",
          ogTitle: "Split Image in Half — Free Online Tool",
          ogDescription: "Divide any photo into two equal halves with one click. No upload needed, works in your browser.",
        },
        hero: {
          overline: "Image Splitting Tool",
          headlinePart1: "Split Image",
          headlineAccent: "in Half",
          headlinePart2: "— Instantly",
          description: "Divide any image into two equal parts — horizontally or vertically. Pixel-perfect precision with zero quality loss, entirely in your browser.",
        },
        scenarios: [
          {
            icon: "Columns2",
            title: "Before & After Comparisons",
            description: "Split comparison images into separate files for side-by-side presentations, product demos, or A/B test documentation.",
          },
          {
            icon: "Smartphone",
            title: "Social Media Cover Splits",
            description: "Divide a wide banner image into two halves for dual-post social media layouts that create a seamless panoramic effect.",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "Upload Your Image", description: "Drag and drop or click to upload the image you want to split in half." },
          { stepNumber: 2, title: "Place the Split Line", description: "Add a single horizontal or vertical split line at the center to divide the image into two equal parts." },
          { stepNumber: 3, title: "Download Both Halves", description: "Preview the two halves and download them individually or as a ZIP archive." },
        ],
        faqEntries: [
          { question: "Can I split an image into two unequal parts?", answer: "Yes. While the tool defaults to center placement, you can drag the split line to any position to create uneven halves — for example, a 30/70 split." },
          { question: "Does splitting in half reduce image quality?", answer: "No. Each half retains the original resolution and pixel data. There is no compression or resampling involved." },
          { question: "Can I split both horizontally and vertically at the same time?", answer: "Absolutely. Add one horizontal and one vertical line to divide the image into four quadrants instead of two halves." },
        ],
        relatedTools: [
          { slug: "/split-horizontally", title: "Split Horizontally", description: "Divide images with horizontal lines into top and bottom sections." },
          { slug: "/split-vertically", title: "Split Vertically", description: "Divide images with vertical lines into left and right sections." },
          { slug: "/split-into-equal-parts", title: "Equal Parts Splitter", description: "Divide images into multiple equal segments in any direction." },
          { slug: "/", title: "Image Splitter", description: "Full-featured image splitter with drag-and-drop split lines." },
        ],
      },
      "zh-CN": {
        slug: "split-in-half",
        category: "direction",
        seo: {
          title: "在线图片对半切割 — 免费一键等分图片 | ImgSplit",
          description: "免费在线图片对半切割工具，横向或纵向一键等分，像素级精准裁切，纯浏览器处理，无需上传。",
          ogTitle: "图片对半切割 — 免费在线工具",
          ogDescription: "一键将图片对半切割，横向或纵向均可，像素级精准，纯浏览器处理。",
        },
        hero: {
          overline: "图片切割工具",
          headlinePart1: "图片",
          headlineAccent: "对半切割",
          headlinePart2: "一键完成",
          description: "将任意图片对半切割——支持横向或纵向等分，像素级精准，零质量损失，全程浏览器本地处理。",
        },
        scenarios: [
          {
            icon: "Columns2",
            title: "对比图拆分",
            description: "将对比图（如修图前后、装修效果对比）拆分为独立文件，方便分开使用或分别编辑。",
          },
          {
            icon: "Smartphone",
            title: "社交媒体双屏封面",
            description: "将宽幅横图对半切割，制作双发布式全景拼接效果，提升社交平台视觉冲击力。",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "上传图片", description: "拖拽或点击上传您要对半切割的图片。" },
          { stepNumber: 2, title: "放置分割线", description: "添加一条横向或纵向分割线到图片中央，将图片均匀分为两半。" },
          { stepNumber: 3, title: "下载两部分", description: "预览两半图片效果，单独下载或打包下载为 ZIP。" },
        ],
        faqEntries: [
          { question: "可以不等分地切割图片吗？", answer: "可以。分割线默认放在中央，但您可以拖拽到任意位置，实现如 30/70 的非等分切割。" },
          { question: "对半切割后画质会下降吗？", answer: "不会。每一半都保持原始分辨率和像素数据，不做任何压缩或缩放处理。" },
          { question: "可以同时横切和纵切吗？", answer: "当然可以。同时添加横向和纵向分割线，就能将图片切成四个象限而非两半。" },
        ],
        relatedTools: [
          { slug: "/split-horizontally", title: "横向切割", description: "用横向分割线将图片分为上下两部分。" },
          { slug: "/split-vertically", title: "纵向切割", description: "用纵向分割线将图片分为左右两部分。" },
          { slug: "/split-into-equal-parts", title: "等分切割", description: "将图片均匀切割成多个等份。" },
          { slug: "/", title: "图片分割工具", description: "支持自由拖拽分割线的全功能图片分割工具。" },
        ],
      },
    },
  },

  {
    slug: "split-horizontally",
    category: "direction",
    locales: {
      en: {
        slug: "split-horizontally",
        category: "direction",
        seo: {
          title: "Split Image Horizontally Online — Free Horizontal Image Cutter | ImgSplit",
          description: "Split images horizontally into top and bottom sections. Add multiple horizontal lines for precise row-based cutting. Free, browser-based, no upload.",
          ogTitle: "Split Image Horizontally — Free Online Cutter",
          ogDescription: "Add horizontal split lines to divide images into rows. Free and browser-based.",
        },
        hero: {
          overline: "Horizontal Splitting",
          headlinePart1: "Split Images",
          headlineAccent: "Horizontally",
          headlinePart2: "— Row by Row",
          description: "Add horizontal split lines to divide any image into top and bottom sections, strips, or rows. Perfect for slicing tall images or creating horizontal segments.",
        },
        scenarios: [
          {
            icon: "LayoutList",
            title: "Slice Tall Product Images",
            description: "Break down tall e-commerce product images into manageable horizontal sections for optimized page loading and organized display.",
          },
          {
            icon: "FileText",
            title: "Segment Document Scans",
            description: "Split scanned multi-section documents — receipts, invoices, or forms — into individual horizontal strips for separate filing.",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "Upload Your Image", description: "Drop or select any image — PNG, JPG, or WebP up to 20 MB." },
          { stepNumber: 2, title: "Add Horizontal Lines", description: "Click 'Add Horizontal Line' to place one or more horizontal split lines. Drag each line to the exact row position." },
          { stepNumber: 3, title: "Download the Rows", description: "Preview every horizontal strip, then download all at once as a ZIP or pick specific rows." },
        ],
        faqEntries: [
          { question: "How many horizontal lines can I add?", answer: "You can add up to 20 horizontal split lines, creating up to 21 horizontal strips from a single image." },
          { question: "Can I combine horizontal and vertical lines?", answer: "Yes. Adding both creates a grid — for purely horizontal strips, only add horizontal lines." },
          { question: "Is there a snap-to-grid feature for precise placement?", answer: "Yes. Split lines snap to nearby edges and the center line, helping you place them with pixel-level accuracy." },
        ],
        relatedTools: [
          { slug: "/split-in-half", title: "Split in Half", description: "Divide an image into two equal parts with a single line." },
          { slug: "/split-vertically", title: "Split Vertically", description: "Cut images with vertical lines into left and right columns." },
          { slug: "/split-long-screenshot", title: "Long Screenshot Splitter", description: "Split long screenshots into readable page-sized segments." },
          { slug: "/grid", title: "Grid Splitter", description: "Split images into 3×3, 1×3, or 2×2 grid tiles." },
        ],
      },
      "zh-CN": {
        slug: "split-horizontally",
        category: "direction",
        seo: {
          title: "在线横向切割图片 — 免费水平分割工具 | ImgSplit",
          description: "免费在线横向切割图片，添加多条水平分割线，精确按行裁切。纯浏览器处理，无需上传到服务器。",
          ogTitle: "横向切割图片 — 免费在线工具",
          ogDescription: "添加水平分割线将图片按行切割，免费且在浏览器中完成。",
        },
        hero: {
          overline: "水平分割",
          headlinePart1: "图片",
          headlineAccent: "横向切割",
          headlinePart2: "逐行精准",
          description: "添加水平分割线将任意图片分为上下区段或条状段落。适合裁切长图、分段处理高度较大的图片。",
        },
        scenarios: [
          {
            icon: "LayoutList",
            title: "电商长图分段",
            description: "将电商平台的长条产品详情图按模块横向裁切，优化加载速度，便于分区展示。",
          },
          {
            icon: "FileText",
            title: "文档扫描件分段",
            description: "将扫描的多段文档（收据、发票、表单）横向裁切为独立条段，方便单独归档。",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "上传图片", description: "拖拽或选择要裁切的图片，支持 PNG、JPG、WebP，最大 20MB。" },
          { stepNumber: 2, title: "添加水平分割线", description: "点击「添加横向分割线」，放置一条或多条水平线，拖拽到精确位置。" },
          { stepNumber: 3, title: "下载各行", description: "预览每一横向条段的效果，然后一键打包下载或选择性下载。" },
        ],
        faqEntries: [
          { question: "最多可以添加多少条水平分割线？", answer: "最多支持 20 条水平分割线，可将一张图片最多切成 21 个横向条段。" },
          { question: "可以同时使用水平和垂直分割线吗？", answer: "可以。同时添加会形成网格切割——如果只需横向条段，仅添加水平线即可。" },
          { question: "有磁吸对齐功能帮助精确定位吗？", answer: "有。分割线会自动吸附到边缘和中线位置，帮助您实现像素级精准定位。" },
        ],
        relatedTools: [
          { slug: "/split-in-half", title: "对半切割", description: "一条线将图片均匀分成两部分。" },
          { slug: "/split-vertically", title: "纵向切割", description: "用纵向线将图片分为左右列。" },
          { slug: "/split-long-screenshot", title: "长截图分段", description: "将长截图分割成适合阅读的页面大小。" },
          { slug: "/grid", title: "九宫格切图", description: "将图片切割为 3×3、1×3 或 2×2 网格。" },
        ],
      },
    },
  },

  {
    slug: "split-vertically",
    category: "direction",
    locales: {
      en: {
        slug: "split-vertically",
        category: "direction",
        seo: {
          title: "Split Image Vertically Online — Free Vertical Image Cutter | ImgSplit",
          description: "Split images vertically into left and right columns. Add multiple vertical lines for column-based cutting. Free, private, runs in your browser.",
          ogTitle: "Split Image Vertically — Free Column Cutter",
          ogDescription: "Add vertical split lines to divide images into columns. Browser-based and private.",
        },
        hero: {
          overline: "Vertical Splitting",
          headlinePart1: "Split Images",
          headlineAccent: "Vertically",
          headlinePart2: "— Column by Column",
          description: "Place vertical split lines to divide any image into left and right sections, columns, or vertical strips. Ideal for wide images and multi-column layouts.",
        },
        scenarios: [
          {
            icon: "Columns3",
            title: "Multi-Panel Comic Strips",
            description: "Separate comic strip panels or storyboard frames that are arranged side by side into individual vertical panels.",
          },
          {
            icon: "LayoutDashboard",
            title: "Dashboard Screenshot Columns",
            description: "Extract specific columns from wide dashboard or spreadsheet screenshots for focused reporting and presentations.",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "Upload Your Image", description: "Upload the wide image or panorama you want to split into vertical columns." },
          { stepNumber: 2, title: "Add Vertical Lines", description: "Place one or more vertical split lines and drag them to define your column boundaries." },
          { stepNumber: 3, title: "Download the Columns", description: "Review each column segment, then download individually or export all as a ZIP file." },
        ],
        faqEntries: [
          { question: "What is the maximum number of vertical splits?", answer: "Up to 20 vertical lines, producing a maximum of 21 columns from a single image." },
          { question: "Will splitting a panorama lose any edge pixels?", answer: "No. The tool uses pixel-exact boundaries — no pixels are lost or blurred at the split edges." },
          { question: "Can I split a portrait-oriented image vertically?", answer: "Yes, though vertical splits work best on landscape or wide images. Portrait images will produce narrow vertical strips." },
        ],
        relatedTools: [
          { slug: "/split-in-half", title: "Split in Half", description: "One line, two equal parts — the simplest way to divide an image." },
          { slug: "/split-horizontally", title: "Split Horizontally", description: "Cut images into horizontal rows and strips." },
          { slug: "/split-for-instagram", title: "Instagram Splitter", description: "Split wide images into tiles for Instagram carousel posts." },
          { slug: "/grid", title: "Grid Splitter", description: "Create 3×3 or custom grid tiles from any image." },
        ],
      },
      "zh-CN": {
        slug: "split-vertically",
        category: "direction",
        seo: {
          title: "在线纵向切割图片 — 免费垂直分割工具 | ImgSplit",
          description: "免费在线纵向切割图片，添加多条垂直分割线按列裁切。纯浏览器处理，隐私安全。",
          ogTitle: "纵向切割图片 — 免费在线工具",
          ogDescription: "添加垂直分割线将图片按列切割，免费、安全、浏览器端完成。",
        },
        hero: {
          overline: "垂直分割",
          headlinePart1: "图片",
          headlineAccent: "纵向切割",
          headlinePart2: "逐列精准",
          description: "放置垂直分割线将任意图片分为左右区段或列状条段，适合宽幅图片和多列布局的拆分。",
        },
        scenarios: [
          {
            icon: "Columns3",
            title: "漫画条格拆分",
            description: "将横排排列的漫画分格或故事板帧拆分为独立的纵向画面。",
          },
          {
            icon: "LayoutDashboard",
            title: "仪表盘截图取列",
            description: "从宽幅仪表盘或表格截图中提取特定列区域，用于聚焦汇报和演示。",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "上传图片", description: "上传您要按列切割的宽幅图片或全景图。" },
          { stepNumber: 2, title: "添加垂直分割线", description: "放置一条或多条垂直分割线，拖拽以定义列边界。" },
          { stepNumber: 3, title: "下载各列", description: "查看每列分段效果，单独下载或一键打包导出为 ZIP。" },
        ],
        faqEntries: [
          { question: "最多可以添加多少条垂直分割线？", answer: "最多 20 条垂直线，单张图片最多可切出 21 列。" },
          { question: "切割全景图会丢失边缘像素吗？", answer: "不会。工具使用像素级精确边界，分割边缘不会丢失或模糊任何像素。" },
          { question: "竖版图片也能纵向切割吗？", answer: "可以，但纵向切割更适合横版或宽幅图片。竖版图片纵切后会产生较窄的竖条。" },
        ],
        relatedTools: [
          { slug: "/split-in-half", title: "对半切割", description: "一条线、两等份——最简单的图片分割方式。" },
          { slug: "/split-horizontally", title: "横向切割", description: "将图片按行切割成水平条段。" },
          { slug: "/split-for-instagram", title: "Instagram 切图", description: "将宽图切割成 Instagram 轮播帖瓦片。" },
          { slug: "/grid", title: "九宫格切图", description: "将图片切割为 3×3 或自定义网格。" },
        ],
      },
    },
  },

  {
    slug: "split-into-equal-parts",
    category: "direction",
    locales: {
      en: {
        slug: "split-into-equal-parts",
        category: "direction",
        seo: {
          title: "Split Image into Equal Parts Online — Free Grid Divider | ImgSplit",
          description: "Divide any image into equal parts — 2, 3, 4 or more equal segments. Free online tool with snap alignment for evenly spaced splits. No upload needed.",
          ogTitle: "Split Image into Equal Parts — Free Tool",
          ogDescription: "Divide images into perfectly equal segments with snap-aligned split lines.",
        },
        hero: {
          overline: "Equal Parts Divider",
          headlinePart1: "Split into",
          headlineAccent: "Equal Parts",
          headlinePart2: "— Evenly & Precisely",
          description: "Divide any image into 2, 3, 4 or more perfectly equal segments. Snap alignment ensures evenly spaced splits with pixel-level precision.",
        },
        scenarios: [
          {
            icon: "Grid2X2",
            title: "Puzzle & Collage Preparation",
            description: "Split an image into equal tiles to create jigsaw-style puzzles, educational materials, or collage-ready pieces.",
          },
          {
            icon: "Printer",
            title: "Uniform Print Tiles",
            description: "Divide a large image into equal-sized print tiles so each piece fits standard paper sizes for seamless reassembly.",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "Upload Your Image", description: "Select the image you want to divide into equal sections." },
          { stepNumber: 2, title: "Add Evenly Spaced Lines", description: "Add horizontal or vertical lines. Use snap alignment to distribute them evenly across the image." },
          { stepNumber: 3, title: "Download Equal Segments", description: "Verify that all parts are equal, then download each segment or the complete set as a ZIP." },
        ],
        faqEntries: [
          { question: "How do I ensure parts are perfectly equal?", answer: "Use the snap alignment feature — lines automatically snap to equal-interval positions. For a 3-part split, place 2 lines and they will snap to the 1/3 and 2/3 marks." },
          { question: "Can I create a grid of equal rectangles?", answer: "Yes. Add equal horizontal and vertical lines to create a grid of identically sized rectangles — perfect for tile-based workflows." },
          { question: "What happens if the image dimensions are not evenly divisible?", answer: "The last segment may differ by one pixel. The tool distributes pixels as evenly as possible to minimize any size difference." },
        ],
        relatedTools: [
          { slug: "/split-in-half", title: "Split in Half", description: "The simplest equal split — divide an image into exactly two halves." },
          { slug: "/split-for-print", title: "Print Splitter", description: "Split large images into tiles sized for standard paper printing." },
          { slug: "/no-photoshop-slicer", title: "No-Photoshop Slicer", description: "A free alternative to Photoshop's slice tool for quick image dividing." },
          { slug: "/grid", title: "Grid Splitter", description: "Preset grid layouts: 3×3, 1×3, and 2×2." },
        ],
      },
      "zh-CN": {
        slug: "split-into-equal-parts",
        category: "direction",
        seo: {
          title: "在线等分切割图片 — 免费均匀分割工具 | ImgSplit",
          description: "免费在线将图片等分为 2、3、4 份或更多等份，磁吸对齐确保均匀间距，像素级精准。无需上传。",
          ogTitle: "等分切割图片 — 免费在线工具",
          ogDescription: "将图片均匀切割为多个等份，磁吸对齐，像素级精准。",
        },
        hero: {
          overline: "等份分割器",
          headlinePart1: "图片",
          headlineAccent: "等分切割",
          headlinePart2: "均匀精准",
          description: "将任意图片均匀切割为 2、3、4 份或更多完全相等的段落。磁吸对齐确保间距均匀，像素级精准。",
        },
        scenarios: [
          {
            icon: "Grid2X2",
            title: "拼图与拼贴素材",
            description: "将图片等分为规则瓦片，制作拼图游戏、教学材料或拼贴画素材。",
          },
          {
            icon: "Printer",
            title: "统一尺寸的打印瓦片",
            description: "将大图等分为统一尺寸的打印瓦片，确保每块适合标准纸张，拼接后还原完整画面。",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "上传图片", description: "选择您要等分切割的图片。" },
          { stepNumber: 2, title: "添加等距分割线", description: "添加水平或垂直分割线，利用磁吸对齐功能使其均匀分布。" },
          { stepNumber: 3, title: "下载等份段落", description: "确认所有部分尺寸相等，然后逐个下载或打包下载为 ZIP。" },
        ],
        faqEntries: [
          { question: "如何确保每份完全相等？", answer: "使用磁吸对齐功能——分割线会自动吸附到等距位置。例如三等分时，放置 2 条线，它们会自动对齐到 1/3 和 2/3 处。" },
          { question: "能创建由相同矩形组成的网格吗？", answer: "可以。同时添加等距的水平和垂直分割线，就能创建尺寸完全一致的矩形网格。" },
          { question: "如果图片尺寸不能整除怎么办？", answer: "最后一段可能会差一个像素。工具会尽可能均匀分配像素，最大程度减少尺寸差异。" },
        ],
        relatedTools: [
          { slug: "/split-in-half", title: "对半切割", description: "最简单的等分——将图片分成两个完全相等的半。" },
          { slug: "/split-for-print", title: "打印切割", description: "将大图切割成适合标准纸张打印的瓦片。" },
          { slug: "/no-photoshop-slicer", title: "替代 PS 切片", description: "无需 Photoshop 的免费在线切片工具。" },
          { slug: "/grid", title: "九宫格切图", description: "预设网格布局：3×3、1×3 和 2×2。" },
        ],
      },
    },
  },

  // ═══════════════════════════════════════
  // USE-CASE PAGES
  // ═══════════════════════════════════════

  {
    slug: "split-long-screenshot",
    category: "use-case",
    locales: {
      en: {
        slug: "split-long-screenshot",
        category: "use-case",
        seo: {
          title: "Split Long Screenshots into Pages — Free Online Tool | ImgSplit",
          description: "Split long screenshots into page-sized segments for easy sharing and reading. Free browser-based tool — no upload, works with any tall image.",
          ogTitle: "Split Long Screenshots — Free Page Splitter",
          ogDescription: "Break long screenshots into readable page-sized pieces. No upload needed.",
        },
        hero: {
          overline: "Long Image Splitter",
          headlinePart1: "Split Long",
          headlineAccent: "Screenshots",
          headlinePart2: "into Pages",
          description: "Break down long scrolling screenshots into page-sized segments for easy sharing, reading, and archiving. Works with any tall image.",
        },
        scenarios: [
          {
            icon: "MessageSquare",
            title: "Chat History Archival",
            description: "Split full-page chat screenshots from messaging apps into individual screen-sized images for organized storage and selective sharing.",
          },
          {
            icon: "FileSearch",
            title: "Web Page Documentation",
            description: "Divide long webpage captures into digestible sections for bug reports, design reviews, or compliance documentation.",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "Upload the Long Screenshot", description: "Upload your long scrolling screenshot — the tool handles images of any height." },
          { stepNumber: 2, title: "Place Horizontal Breaks", description: "Add horizontal split lines where you want page breaks. Use snap alignment for even spacing." },
          { stepNumber: 3, title: "Download Page Segments", description: "Preview each segment, then download all pages as a ZIP for convenient sharing." },
        ],
        faqEntries: [
          { question: "Is there a maximum image height for long screenshots?", answer: "The tool can handle images up to 20 MB in file size. Very tall images (10,000+ px) may process more slowly but are fully supported." },
          { question: "Can I split a screenshot into equal page-length segments?", answer: "Yes. Add multiple horizontal lines and use snap alignment to space them evenly, creating uniform page-height segments." },
          { question: "Will the text in my screenshot remain sharp after splitting?", answer: "Absolutely. The tool crops at the original resolution without any resampling, so text stays crisp and legible." },
        ],
        relatedTools: [
          { slug: "/split-horizontally", title: "Horizontal Splitter", description: "Add horizontal lines to divide any image into rows." },
          { slug: "/split-for-instagram", title: "Instagram Splitter", description: "Split images into multi-slide carousel posts." },
          { slug: "/split-for-wechat", title: "WeChat Moments Splitter", description: "Prepare images for WeChat Moments grid posts." },
          { slug: "/", title: "Image Splitter", description: "Full-featured splitter with drag-and-drop lines." },
        ],
      },
      "zh-CN": {
        slug: "split-long-screenshot",
        category: "use-case",
        seo: {
          title: "长截图分段切割 — 免费在线长图裁切工具 | ImgSplit",
          description: "免费在线长截图分段工具，将超长截图切割为页面大小的段落，方便分享和阅读。纯浏览器处理。",
          ogTitle: "长截图分段 — 免费在线工具",
          ogDescription: "将长截图切割为适合阅读的页面大小段落，免费浏览器端处理。",
        },
        hero: {
          overline: "长图分段",
          headlinePart1: "长截图",
          headlineAccent: "分段切割",
          headlinePart2: "轻松分享",
          description: "将超长滚动截图切割为页面大小的段落，方便分享、阅读和归档。支持任意高度的长图。",
        },
        scenarios: [
          {
            icon: "MessageSquare",
            title: "聊天记录整理",
            description: "将完整的聊天截图按屏幕大小分割，方便分类存储和选择性分享。",
          },
          {
            icon: "FileSearch",
            title: "网页内容存档",
            description: "将长网页截图按章节分段，用于 Bug 报告、设计评审或合规文档归档。",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "上传长截图", description: "上传您的长截图——工具可处理任意高度的图片。" },
          { stepNumber: 2, title: "添加分页线", description: "在需要分页的位置添加水平分割线，利用磁吸对齐实现均匀间距。" },
          { stepNumber: 3, title: "下载分页段落", description: "预览各段效果，打包下载所有页面为 ZIP，方便分享。" },
        ],
        faqEntries: [
          { question: "长截图的高度有上限吗？", answer: "工具可处理最大 20MB 的图片。超高图片（10000 像素以上）处理速度可能稍慢，但完全支持。" },
          { question: "能将长截图等分为相同长度的页面吗？", answer: "可以。添加多条水平线并利用磁吸对齐均匀分布，即可创建统一页面高度的段落。" },
          { question: "截图中的文字分割后还清晰吗？", answer: "当然清晰。工具以原始分辨率裁切，不做任何重采样，文字保持锐利可读。" },
        ],
        relatedTools: [
          { slug: "/split-horizontally", title: "横向切割", description: "添加水平线将图片分为行段。" },
          { slug: "/split-for-instagram", title: "Instagram 切图", description: "将图片切割为多张轮播帖素材。" },
          { slug: "/split-for-wechat", title: "朋友圈切图", description: "为微信朋友圈九宫格准备图片。" },
          { slug: "/", title: "图片分割工具", description: "支持拖拽分割线的全功能分割工具。" },
        ],
      },
    },
  },

  {
    slug: "split-for-instagram",
    category: "use-case",
    locales: {
      en: {
        slug: "split-for-instagram",
        category: "use-case",
        seo: {
          title: "Split Images for Instagram Carousel & Grid — Free Online Tool | ImgSplit",
          description: "Split images for Instagram carousel posts and profile grid layouts. Optimized for 1080×1080px. Free, browser-based, no watermarks.",
          ogTitle: "Instagram Image Splitter — Free Carousel & Grid Tool",
          ogDescription: "Split images into Instagram-ready tiles. Optimized for 1080×1080px posts.",
        },
        hero: {
          overline: "Instagram Splitter",
          headlinePart1: "Split for",
          headlineAccent: "Instagram",
          headlinePart2: "— Carousel & Grid",
          description: "Create stunning Instagram carousel slides and profile grid layouts by splitting your images into perfectly sized tiles. Optimized for Instagram's native dimensions.",
        },
        platformInfo: "Instagram recommended post size: 1080 × 1080 px (1:1 square). Carousel supports up to 10 slides.",
        scenarios: [
          {
            icon: "LayoutGrid",
            title: "Seamless Profile Grid",
            description: "Split a single wide image into 3, 6, or 9 tiles that create a seamless panoramic effect across your Instagram profile grid.",
          },
          {
            icon: "GalleryHorizontal",
            title: "Carousel Post Slides",
            description: "Divide a panoramic photo or infographic into swipeable carousel slides that tell a visual story across multiple frames.",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "Upload Your Image", description: "Upload the image or panorama you want to split for Instagram." },
          { stepNumber: 2, title: "Set Up Your Grid", description: "Add vertical lines for carousel slides, or create a grid for profile layout. Use snap alignment for equal spacing." },
          { stepNumber: 3, title: "Download Instagram-Ready Tiles", description: "Download all tiles as a ZIP. Upload them to Instagram in order for a seamless result." },
        ],
        faqEntries: [
          { question: "What size should each Instagram tile be?", answer: "Instagram displays posts at 1080×1080px (square). For carousel posts, each slide should be 1080px wide. The tool lets you split at any boundary." },
          { question: "How many slides can an Instagram carousel have?", answer: "Instagram allows up to 10 slides per carousel post. Split your image into 2–10 vertical segments for a swipeable panorama." },
          { question: "Will the tiles be in the right posting order?", answer: "Yes. Tiles are numbered left-to-right (for vertical splits) or top-to-bottom (for horizontal splits), matching Instagram's upload order." },
        ],
        relatedTools: [
          { slug: "/split-into-equal-parts", title: "Equal Parts Splitter", description: "Divide images into perfectly equal segments for any platform." },
          { slug: "/split-long-screenshot", title: "Long Screenshot Splitter", description: "Break tall images into shareable page-sized segments." },
          { slug: "/split-for-wechat", title: "WeChat Splitter", description: "Split images for WeChat Moments grid posts." },
          { slug: "/grid", title: "Grid Splitter", description: "Quick 3×3 grid splits optimized for social media." },
        ],
      },
      "zh-CN": {
        slug: "split-for-instagram",
        category: "use-case",
        seo: {
          title: "Instagram 切图工具 — 免费轮播图和九宫格分割 | ImgSplit",
          description: "免费在线 Instagram 切图工具，将图片分割为轮播帖和主页九宫格瓦片，适配 1080×1080px。纯浏览器处理。",
          ogTitle: "Instagram 切图 — 免费在线工具",
          ogDescription: "将图片切割为 Instagram 轮播帖和九宫格瓦片，适配 1080×1080px。",
        },
        hero: {
          overline: "Instagram 切图",
          headlinePart1: "切图发",
          headlineAccent: "Instagram",
          headlinePart2: "轮播与九宫格",
          description: "将图片切割为完美尺寸的 Instagram 轮播帖和主页九宫格瓦片，适配 Instagram 原生尺寸。",
        },
        platformInfo: "Instagram 推荐帖子尺寸：1080 × 1080 px（1:1 正方形）。轮播帖最多支持 10 张幻灯片。",
        scenarios: [
          {
            icon: "LayoutGrid",
            title: "主页无缝九宫格",
            description: "将一张宽幅图片切割为 3、6 或 9 张瓦片，在 Instagram 主页形成无缝全景拼接效果。",
          },
          {
            icon: "GalleryHorizontal",
            title: "轮播帖幻灯片",
            description: "将全景照片或信息图分割为可滑动的轮播帖幻灯片，跨多帧讲述视觉故事。",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "上传图片", description: "上传您要为 Instagram 切割的图片或全景照片。" },
          { stepNumber: 2, title: "设置网格", description: "为轮播帖添加垂直分割线，或创建主页九宫格布局。利用磁吸对齐确保等距。" },
          { stepNumber: 3, title: "下载切图瓦片", description: "打包下载所有瓦片为 ZIP，按顺序上传到 Instagram 即可呈现无缝效果。" },
        ],
        faqEntries: [
          { question: "Instagram 每张瓦片应该是什么尺寸？", answer: "Instagram 以 1080×1080px（正方形）显示帖子。轮播帖每张幻灯片宽度为 1080px。工具可在任意边界切割。" },
          { question: "Instagram 轮播帖最多支持几张幻灯片？", answer: "Instagram 每条轮播帖最多支持 10 张。将图片纵向切割为 2-10 段即可制作可滑动的全景效果。" },
          { question: "切割后瓦片的顺序正确吗？", answer: "正确。瓦片按从左到右（纵切）或从上到下（横切）编号，与 Instagram 的上传顺序一致。" },
        ],
        relatedTools: [
          { slug: "/split-into-equal-parts", title: "等分切割", description: "将图片均匀分割为等份，适用于任何平台。" },
          { slug: "/split-long-screenshot", title: "长截图分段", description: "将长图分割为适合分享的页面大小。" },
          { slug: "/split-for-wechat", title: "朋友圈切图", description: "为微信朋友圈九宫格准备切图。" },
          { slug: "/grid", title: "九宫格切图", description: "快速 3×3 网格切割，针对社交媒体优化。" },
        ],
      },
    },
  },

  {
    slug: "split-for-wechat",
    category: "use-case",
    locales: {
      en: {
        slug: "split-for-wechat",
        category: "use-case",
        seo: {
          title: "Free Online Image Splitter — Split & Grid Photos Instantly | ImgSplit",
          description: "Free online image splitter with drag-and-drop split lines. Cut photos into any grid or custom segments. Browser-based, private, no upload needed.",
          ogTitle: "Free Image Splitter — Split Photos Online",
          ogDescription: "Split images into grids or custom segments. Free and browser-based.",
        },
        hero: {
          overline: "Image Grid Splitter",
          headlinePart1: "Split Images",
          headlineAccent: "into Grids",
          headlinePart2: "— For Social Posts",
          description: "Split images into grid tiles for social media posts. Drag split lines to create custom grids or use equal spacing for uniform tiles.",
        },
        scenarios: [
          {
            icon: "Share2",
            title: "Social Media Grid Posts",
            description: "Create eye-catching grid posts by splitting one image into multiple tiles that form a cohesive visual when viewed on your profile.",
          },
          {
            icon: "Maximize2",
            title: "Large Image Segmentation",
            description: "Break oversized images into manageable grid tiles for platforms with upload size or dimension limits.",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "Upload Your Image", description: "Upload the photo you want to split into grid tiles." },
          { stepNumber: 2, title: "Create Your Grid", description: "Add horizontal and vertical lines to define your grid layout. Snap alignment helps create even spacing." },
          { stepNumber: 3, title: "Download Grid Tiles", description: "Download all grid pieces as a ZIP file, ready to post in order on your social platform." },
        ],
        faqEntries: [],
        relatedTools: [
          { slug: "/split-for-instagram", title: "Instagram Splitter", description: "Split images specifically for Instagram carousel and grid posts." },
          { slug: "/split-long-screenshot", title: "Long Screenshot Splitter", description: "Split tall screenshots into page-sized segments." },
          { slug: "/", title: "Image Splitter", description: "Full-featured image splitter with custom split lines." },
          { slug: "/grid", title: "Grid Splitter", description: "Quick preset grid splits: 3×3, 1×3, 2×2." },
        ],
      },
      "zh-CN": {
        slug: "split-for-wechat",
        category: "use-case",
        seo: {
          title: "微信朋友圈九宫格切图 — 免费在线切图工具 | ImgSplit",
          description: "免费在线微信朋友圈九宫格切图工具，一键将图片切割为 3×3 九宫格、1×3 三联图等，适配朋友圈发布。纯浏览器处理，隐私安全。",
          ogTitle: "朋友圈九宫格切图 — 免费在线工具",
          ogDescription: "一键将图片切割为微信朋友圈九宫格，免费、隐私安全、浏览器端完成。",
        },
        hero: {
          overline: "朋友圈切图",
          headlinePart1: "朋友圈",
          headlineAccent: "九宫格切图",
          headlinePart2: "一键搞定",
          description: "将任意图片一键切割为微信朋友圈九宫格、三联图等格式，让你的朋友圈更有视觉冲击力。",
        },
        scenarios: [
          {
            icon: "Share2",
            title: "朋友圈九宫格拼图",
            description: "将一张完整图片切割成 9 张瓦片，发布到朋友圈后自动拼合为完整画面，打造高级感视觉效果。",
          },
          {
            icon: "Camera",
            title: "旅行照片创意展示",
            description: "将旅行全景照或风景大图切割成九宫格，在朋友圈中展现壮阔场景，获得更多点赞。",
          },
          {
            icon: "Sparkles",
            title: "个人品牌形象打造",
            description: "将个人作品集或品牌海报切割为九宫格排列，让朋友圈主页呈现统一的视觉风格。",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "上传图片", description: "拖拽或点击上传您要切割为九宫格的图片。" },
          { stepNumber: 2, title: "设置九宫格", description: "添加横向和纵向分割线创建 3×3 网格，利用磁吸对齐确保均匀等分。" },
          { stepNumber: 3, title: "下载并发布", description: "打包下载所有九宫格瓦片，按顺序发布到微信朋友圈。" },
        ],
        faqEntries: [
          { question: "微信朋友圈九宫格最佳尺寸是多少？", answer: "微信朋友圈会自动裁切为正方形缩略图，建议原图使用 1:1 正方形比例，每张推荐 1080×1080px 以获得最佳清晰度。" },
          { question: "切好的九宫格图片发朋友圈顺序对吗？", answer: "对的。图片按从左到右、从上到下的顺序编号（1-9），按照编号顺序选择图片即可正确拼合。" },
          { question: "除了九宫格还支持什么布局？", answer: "支持任意布局。除了经典 3×3 九宫格外，您也可以制作 1×3 三联图、2×2 四宫格或其他自定义布局。" },
          { question: "切割后的图片质量会下降吗？", answer: "不会。工具以原始分辨率裁切，不做任何压缩处理，保持与原图完全一致的画质。" },
        ],
        relatedTools: [
          { slug: "/split-for-instagram", title: "Instagram 切图", description: "为 Instagram 轮播帖和主页九宫格切割图片。" },
          { slug: "/split-long-screenshot", title: "长截图分段", description: "将长截图分割为适合阅读的段落。" },
          { slug: "/", title: "图片分割工具", description: "支持自定义分割线的全功能图片切割工具。" },
          { slug: "/grid", title: "九宫格切图", description: "快速 3×3、1×3、2×2 网格切图。" },
        ],
      },
    },
  },

  {
    slug: "split-for-print",
    category: "use-case",
    locales: {
      en: {
        slug: "split-for-print",
        category: "use-case",
        seo: {
          title: "Split Large Image for Printing — Free Tile Print Tool | ImgSplit",
          description: "Split large images into printable tiles that fit standard paper sizes. Print and assemble posters, banners, and large-format art. Free browser tool.",
          ogTitle: "Split Image for Printing — Free Tile Tool",
          ogDescription: "Divide large images into page-sized tiles for printing and reassembly.",
        },
        hero: {
          overline: "Print Splitter",
          headlinePart1: "Split for",
          headlineAccent: "Printing",
          headlinePart2: "— Tile & Assemble",
          description: "Divide large images into page-sized tiles that you can print on standard paper and reassemble into posters, banners, or wall art.",
        },
        scenarios: [
          {
            icon: "Image",
            title: "DIY Poster Printing",
            description: "Turn any high-resolution image into a multi-page poster — split it into A4 or Letter tiles, print at home, and tape together for a large-format result.",
          },
          {
            icon: "Ruler",
            title: "Architectural Plans & Blueprints",
            description: "Split oversized technical drawings or floor plans into printable sections so each page shows a manageable portion of the design.",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "Upload the Large Image", description: "Upload the high-resolution image, poster, or plan you want to tile-print." },
          { stepNumber: 2, title: "Set Tile Boundaries", description: "Add evenly spaced split lines to create tiles that match your paper size. Use snap alignment for uniform spacing." },
          { stepNumber: 3, title: "Print & Assemble", description: "Download all tiles, print each on a separate page, and arrange them to reconstruct the full image." },
        ],
        faqEntries: [
          { question: "What paper size should I target for tiles?", answer: "For home printers, A4 (210×297mm) or US Letter (8.5×11in) are standard. Calculate the number of tiles based on your image aspect ratio and desired final size." },
          { question: "Does the tool add overlap margins for assembly?", answer: "The tool splits at exact pixel boundaries. For overlap margins, slightly increase the number of tiles so adjacent pieces share a thin strip for alignment." },
          { question: "Can I split a very high-resolution image (e.g., 8000×6000)?", answer: "Yes. The tool handles large images up to 20 MB. For extremely high-res files, consider using WebP format for a smaller file size." },
        ],
        relatedTools: [
          { slug: "/split-into-equal-parts", title: "Equal Parts Splitter", description: "Divide images into perfectly equal segments for uniform tiles." },
          { slug: "/split-horizontally", title: "Horizontal Splitter", description: "Split images into rows for strip-based printing." },
          { slug: "/no-photoshop-slicer", title: "No-Photoshop Slicer", description: "A free online alternative to Photoshop's slice and export workflow." },
          { slug: "/", title: "Image Splitter", description: "Full-featured image splitting with custom lines." },
        ],
      },
      "zh-CN": {
        slug: "split-for-print",
        category: "use-case",
        seo: {
          title: "大图打印切割 — 免费在线海报分割打印工具 | ImgSplit",
          description: "免费在线将大图切割为适合标准纸张打印的瓦片，打印后拼合为海报、横幅或墙面装饰画。纯浏览器处理。",
          ogTitle: "大图打印切割 — 免费在线工具",
          ogDescription: "将大图切割为可打印瓦片，拼合为海报或大幅面作品。",
        },
        hero: {
          overline: "打印切割",
          headlinePart1: "大图",
          headlineAccent: "打印切割",
          headlinePart2: "拼合输出",
          description: "将大尺寸图片切割为标准纸张大小的瓦片，打印后拼合成海报、横幅或墙面装饰画。",
        },
        scenarios: [
          {
            icon: "Image",
            title: "DIY 海报打印",
            description: "将高分辨率图片切割为 A4 瓦片，在家用打印机上分页打印，拼贴组合成大幅面海报。",
          },
          {
            icon: "Ruler",
            title: "建筑图纸分割打印",
            description: "将超大技术图纸或户型图分割为可打印的区段，每页展示可管理的设计区域。",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "上传大图", description: "上传您要分割打印的高分辨率图片、海报或图纸。" },
          { stepNumber: 2, title: "设置瓦片边界", description: "添加等距分割线创建与纸张尺寸匹配的瓦片，利用磁吸对齐确保均匀。" },
          { stepNumber: 3, title: "打印与拼合", description: "下载所有瓦片，逐页打印，按顺序排列拼合还原完整图像。" },
        ],
        faqEntries: [
          { question: "瓦片应该按什么纸张尺寸切割？", answer: "家用打印机推荐 A4（210×297mm）。根据图片比例和目标最终尺寸计算所需瓦片数量。" },
          { question: "工具会为拼接添加重叠边距吗？", answer: "工具按精确像素边界切割。如需重叠边距，可适当增加瓦片数量，使相邻块共享一小条对齐区域。" },
          { question: "能处理超高分辨率图片（如 8000×6000）吗？", answer: "可以。工具支持最大 20MB 的图片。超高分辨率文件建议使用 WebP 格式以减小文件大小。" },
        ],
        relatedTools: [
          { slug: "/split-into-equal-parts", title: "等分切割", description: "将图片均匀切割为等份瓦片。" },
          { slug: "/split-horizontally", title: "横向切割", description: "将图片按行切割，用于条状打印。" },
          { slug: "/no-photoshop-slicer", title: "替代 PS 切片", description: "免费在线替代 Photoshop 的切片导出功能。" },
          { slug: "/", title: "图片分割工具", description: "支持自定义分割线的全功能分割工具。" },
        ],
      },
    },
  },

  {
    slug: "no-photoshop-slicer",
    category: "use-case",
    locales: {
      en: {
        slug: "no-photoshop-slicer",
        category: "use-case",
        seo: {
          title: "Free Online Image Slicer — No Photoshop Needed | ImgSplit",
          description: "A free Photoshop slice tool alternative. Split images into regions without installing any software. Browser-based, private, and instant.",
          ogTitle: "No-Photoshop Image Slicer — Free Online Tool",
          ogDescription: "Skip Photoshop. Slice images into regions instantly in your browser.",
        },
        hero: {
          overline: "Photoshop-Free Slicer",
          headlinePart1: "Image Slicer",
          headlineAccent: "No Photoshop",
          headlinePart2: "Needed",
          description: "Skip expensive software subscriptions. Split and slice images into any layout using drag-and-drop lines — entirely free, entirely in your browser.",
        },
        scenarios: [
          {
            icon: "DollarSign",
            title: "Skip the Subscription",
            description: "Get Photoshop-quality image slicing without the $22/month Creative Cloud subscription — free and accessible to everyone.",
          },
          {
            icon: "GraduationCap",
            title: "Beginner-Friendly Workflow",
            description: "No layers, no toolbars, no learning curve. Just drag lines where you want to cut and download the pieces — anyone can do it in seconds.",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "Upload Your Image", description: "Drag and drop or click to upload. No account needed, no software to install." },
          { stepNumber: 2, title: "Drag Split Lines", description: "Add horizontal and vertical lines to define your slice regions. Snap alignment ensures precision." },
          { stepNumber: 3, title: "Export Your Slices", description: "Download all sliced regions as a ZIP — ready for web, social media, or any other use." },
        ],
        faqEntries: [
          { question: "Is this really as precise as Photoshop's slice tool?", answer: "Yes. The tool splits at exact pixel boundaries with snap alignment — you get the same pixel-perfect precision without the complexity." },
          { question: "Can I slice images for HTML email templates?", answer: "Absolutely. Slice your email design into sections, export each region, and reference them in your HTML template for pixel-perfect email layouts." },
          { question: "Do I need to create an account?", answer: "No. The tool is completely free and requires no registration. Open the page, upload, slice, and download — that's it." },
        ],
        relatedTools: [
          { slug: "/split-in-half", title: "Split in Half", description: "The simplest split — divide any image into two equal parts." },
          { slug: "/split-for-print", title: "Print Splitter", description: "Split large images into printable page-sized tiles." },
          { slug: "/split-for-instagram", title: "Instagram Splitter", description: "Split images for Instagram carousel and grid posts." },
          { slug: "/", title: "Image Splitter", description: "Full-featured drag-and-drop image splitting tool." },
        ],
      },
      "zh-CN": {
        slug: "no-photoshop-slicer",
        category: "use-case",
        seo: {
          title: "免费在线切片工具 — 替代 Photoshop 切片功能 | ImgSplit",
          description: "免费在线图片切片工具，无需安装 Photoshop，拖拽分割线即可将图片切割为任意区域。浏览器端完成，即开即用。",
          ogTitle: "替代 PS 切片 — 免费在线切片工具",
          ogDescription: "无需 Photoshop，在浏览器中拖拽分割线即可切割图片。",
        },
        hero: {
          overline: "免费切片工具",
          headlinePart1: "图片切片",
          headlineAccent: "无需 PS",
          headlinePart2: "即开即用",
          description: "告别昂贵的软件订阅费。用拖拽分割线的方式将图片切割为任意布局——完全免费，完全在浏览器中完成。",
        },
        scenarios: [
          {
            icon: "DollarSign",
            title: "省下订阅费",
            description: "无需每月支付 Creative Cloud 订阅费即可获得 Photoshop 级别的切片效果——免费且人人可用。",
          },
          {
            icon: "GraduationCap",
            title: "新手友好的操作流程",
            description: "没有图层、没有工具栏、没有学习门槛。只需拖拽分割线到目标位置，即可下载切割结果。",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "上传图片", description: "拖拽或点击上传，无需注册账号，无需安装软件。" },
          { stepNumber: 2, title: "拖拽分割线", description: "添加横向和纵向分割线定义切片区域，磁吸对齐确保精准。" },
          { stepNumber: 3, title: "导出切片", description: "将所有切片区域打包下载为 ZIP——可直接用于网页、社交媒体或其他用途。" },
        ],
        faqEntries: [
          { question: "精度真的和 Photoshop 的切片工具一样吗？", answer: "是的。工具在精确的像素边界处切割，配合磁吸对齐功能，提供与 Photoshop 相同的像素级精度，但没有复杂的操作。" },
          { question: "可以用来切割 HTML 邮件模板的图片吗？", answer: "当然可以。将邮件设计稿切割为各个区域，导出每个区域，然后在 HTML 模板中引用，实现像素级精准的邮件布局。" },
          { question: "需要注册账号吗？", answer: "不需要。工具完全免费，无需任何注册。打开页面、上传、切割、下载——就这么简单。" },
        ],
        relatedTools: [
          { slug: "/split-in-half", title: "对半切割", description: "最简单的切割——将图片一分为二。" },
          { slug: "/split-for-print", title: "打印切割", description: "将大图切割为可打印的页面瓦片。" },
          { slug: "/split-for-instagram", title: "Instagram 切图", description: "为 Instagram 轮播帖和九宫格切割图片。" },
          { slug: "/", title: "图片分割工具", description: "支持拖拽分割线的全功能图片分割工具。" },
        ],
      },
    },
  },
]

// ─── Public API ───

export function getAllToolSlugs(): string[] {
  return toolPages.map((page) => page.slug)
}

export function getToolPageData(slug: string, locale: string): ToolPageData | null {
  const config = toolPages.find((page) => page.slug === slug)
  if (!config) return null
  return config.locales[locale] ?? null
}

export function getAllToolPages(): ToolPageConfig[] {
  return toolPages
}

export function getToolPagesByCategory(category: ToolCategory): ToolPageConfig[] {
  return toolPages.filter((page) => page.category === category)
}
