import type { ToolPageData } from "./types"

const data: Record<string, ToolPageData> = {
  "split-in-half": {
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

  "split-horizontally": {
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

  "split-vertically": {
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

  "split-into-equal-parts": {
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

  "split-long-screenshot": {
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

  "split-for-instagram": {
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

  "split-for-wechat": {
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

  "split-for-print": {
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

  "no-photoshop-slicer": {
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

  "photo-splitter": {
    slug: "photo-splitter",
    category: "use-case",
    seo: {
      title: "在线照片分割器 — 免费图片切割工具 | ImgSplit",
      description: "免费在线照片分割工具——将任意照片拖拽切割为多个部分，像素级精准，无需上传至服务器，100% 浏览器本地处理。",
      ogTitle: "照片分割器 — 免费在线工具",
      ogDescription: "一键将照片分割成多个部分，免费、隐私安全、浏览器端处理。",
    },
    hero: {
      overline: "照片分割工具",
      headlinePart1: "照片",
      headlineAccent: "分割器",
      headlinePart2: "免费即用",
      description: "将任何照片分割为多个部分，拖拽分割线、智能对齐、即时下载——全部在浏览器中完成，无需安装任何软件。",
    },
    scenarios: [
      {
        icon: "Camera",
        title: "摄影后期处理",
        description: "将合影、全景照片或合成图片拆分为独立区域，方便单独编辑、分享或打印。",
      },
      {
        icon: "Smartphone",
        title: "手机照片管理",
        description: "将手机拍摄的照片分割为多个区域——提取人脸、裁剪细节或分离前景与背景。",
      },
      {
        icon: "ShoppingBag",
        title: "商品图片制作",
        description: "将商品照片分割为细节图，用于电商商品详情页——从一张原图展示不同角度和特写。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "上传照片", description: "拖放或点击上传照片——支持 PNG、JPG、WebP，最大 20 MB。" },
      { stepNumber: 2, title: "放置分割线", description: "添加水平或垂直分割线，拖动到你想要切割的位置。" },
      { stepNumber: 3, title: "预览与调整", description: "实时查看每个分割区域，通过智能对齐微调分割线位置。" },
      { stepNumber: 4, title: "下载分割结果", description: "将所有部分打包下载为 ZIP，或逐个保存。" },
    ],
    faqEntries: [
      { question: "支持哪些照片格式？", answer: "支持 PNG、JPG/JPEG 和 WebP 格式，每张照片最大 20 MB。" },
      { question: "分割会降低照片质量吗？", answer: "不会。每个分割区域保留原始分辨率和像素数据，无压缩、无缩放、零质量损失。" },
      { question: "可以不等分地分割照片吗？", answer: "可以。分割线可拖至任意位置，自由定义每个区域的大小。" },
      { question: "最多能分割成多少块？", answer: "最多可添加 20 条水平线和 20 条垂直线，从一张照片生成数百个区域。" },
      { question: "手机上能用吗？", answer: "可以。本工具在手机浏览器中也能流畅运行，支持直接在手机上分割照片。" },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "对半切割", description: "最简单的分割——将图片一分为二。" },
      { slug: "/split-into-equal-parts", title: "等分分割", description: "将图片分割为完全等大的区域。" },
      { slug: "/split-for-instagram", title: "Instagram 分割", description: "为 Instagram 轮播和九宫格分割照片。" },
      { slug: "/", title: "图片分割器", description: "全功能图片分割工具，支持拖拽分割线。" },
    ],
  },

  "image-cutter": {
    slug: "image-cutter",
    category: "use-case",
    seo: {
      title: "在线图片裁切器 — 免费精准切图工具 | ImgSplit",
      description: "免费在线图片裁切工具——精准切割任意图片，拖拽裁切线、智能对齐、即时下载，无需上传，100% 浏览器端处理。",
      ogTitle: "在线图片裁切器 — 免费工具",
      ogDescription: "精准切割任意图片，拖拽式操作，免费且保护隐私。",
    },
    hero: {
      overline: "图片裁切工具",
      headlinePart1: "图片",
      headlineAccent: "裁切器",
      headlinePart2: "精准切割",
      description: "将任意图片精准切割为多个区域——拖拽裁切线、像素级对齐、即时下载，无需安装任何软件。",
    },
    scenarios: [
      {
        icon: "Scissors",
        title: "网页设计切图",
        description: "将设计稿切割为独立素材——页头、按钮、图标、内容区域——直接用于 HTML/CSS 开发。",
      },
      {
        icon: "Mail",
        title: "邮件模板切图",
        description: "将邮件设计稿切割为优化的图片区域，确保 HTML 邮件在所有客户端中完美显示。",
      },
      {
        icon: "FileImage",
        title: "文档区域提取",
        description: "从扫描文档、证书或截图中精准提取特定区域——只取你需要的部分。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "上传图片", description: "上传任意图片——PNG、JPG 或 WebP，拖放或点击选择。" },
      { stepNumber: 2, title: "放置裁切线", description: "添加水平和垂直裁切线，拖动到精确位置定义切割区域。" },
      { stepNumber: 3, title: "下载切割结果", description: "预览每个区域，然后一键打包下载 ZIP 或逐个保存。" },
    ],
    faqEntries: [
      { question: "裁切和裁剪有什么区别？", answer: "裁剪（crop）是去掉图片边缘只保留一个区域；裁切（cut）是将整张图片分割为多个区域——每个像素都被保留在某个输出区域中，没有任何丢弃。" },
      { question: "可以裁切出不规则形状吗？", answer: "本工具使用直线水平和垂直裁切线，生成矩形区域。如需非矩形形状，建议使用专门的蒙版工具。" },
      { question: "裁切线精度如何？", answer: "裁切线对齐到像素边界，支持精细拖拽，可以达到单像素级别的定位精度。" },
      { question: "有图片大小限制吗？", answer: "支持最大 20 MB 的文件。无像素尺寸限制，但超大图片可能需要稍长的处理时间。" },
    ],
    relatedTools: [
      { slug: "/no-photoshop-slicer", title: "免 PS 切图", description: "Photoshop 切片工具的免费替代方案。" },
      { slug: "/split-horizontally", title: "水平分割", description: "将图片切割为水平行和条带。" },
      { slug: "/split-vertically", title: "垂直分割", description: "将图片切割为垂直列。" },
      { slug: "/", title: "图片分割器", description: "全功能拖拽式图片分割工具。" },
    ],
  },

  "grid-maker": {
    slug: "grid-maker",
    category: "use-case",
    seo: {
      title: "图片网格生成器 — 免费在线网格分割 | ImgSplit",
      description: "免费在线图片网格生成器——创建 2x2、3x3、4x4 或自定义网格，适用于社交媒体、灵感板和拼图布局，浏览器端处理。",
      ogTitle: "图片网格生成器 — 免费在线工具",
      ogDescription: "创建任意网格布局，适用于社交媒体、灵感板等场景，免费且保护隐私。",
    },
    hero: {
      overline: "网格生成工具",
      headlinePart1: "图片",
      headlineAccent: "网格生成器",
      headlinePart2: "任意布局",
      description: "创建完美的图片网格——2x2、3x3、4x4 或任何自定义布局，适用于社交媒体主页、灵感板和视觉叙事。",
    },
    scenarios: [
      {
        icon: "LayoutGrid",
        title: "社交媒体网格主页",
        description: "创建令人惊艳的网格布局，将社交媒体主页变成一幅完整的视觉画廊——每个方块都是大图的一部分。",
      },
      {
        icon: "Palette",
        title: "灵感板与色板",
        description: "将参考图片分割成有序的网格方块，用于设计灵感板、色彩探索或视觉头脑风暴。",
      },
      {
        icon: "Presentation",
        title: "演示文稿视觉素材",
        description: "为演示文稿创建网格式视觉素材——将信息图、对比图表或数据可视化切割为整齐的网格布局。",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "上传图片", description: "上传要分割成网格的图片，支持 PNG、JPG、WebP。" },
      { stepNumber: 2, title: "定义网格", description: "添加等距的水平和垂直分割线，创建 2x2、3x3 或任何自定义网格布局。" },
      { stepNumber: 3, title: "下载网格方块", description: "预览所有网格方块，然后下载 ZIP 打包文件。方块按序编号，方便排列。" },
    ],
    faqEntries: [
      { question: "可以创建多大的网格？", answer: "任意大小——从 2x2 到 10x10 甚至更大。每个方向最多可添加 20 条分割线。" },
      { question: "网格方块大小完全一致吗？", answer: "使用智能对齐功能可将分割线自动吸附到等距位置，确保每个方块大小完全一致。" },
      { question: "可以创建非正方形网格吗？", answer: "可以。添加不同数量的水平和垂直分割线即可创建任意矩形网格布局，如 2x3、3x4。" },
      { question: "Instagram 用什么网格最好？", answer: "1x3 网格（3 个垂直方块）适合轮播帖；3x3 网格（9 个方块）可在个人主页创建震撼的拼图效果。" },
    ],
    relatedTools: [
      { slug: "/grid", title: "网格分割器", description: "快速预设网格：3×3、1×3、2×2——针对社交媒体优化。" },
      { slug: "/split-for-instagram", title: "Instagram 分割", description: "专为 Instagram 轮播和九宫格分割图片。" },
      { slug: "/split-into-equal-parts", title: "等分分割", description: "将图片分割为完全等大的区域。" },
      { slug: "/split-for-wechat", title: "社交媒体九宫格", description: "将图片分割为社交平台的网格方块。" },
    ],
  },

}

export default data
