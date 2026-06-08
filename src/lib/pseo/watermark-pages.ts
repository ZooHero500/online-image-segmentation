import type { ToolPageData } from "./types"

type LocaleWatermarkPages = Record<string, Record<string, ToolPageData>>

const relatedTools = {
  en: [
    { slug: "/watermark", title: "Watermark Tool", description: "Add text and logo watermarks directly in your browser." },
    { slug: "/compress-image", title: "Compress Image", description: "Reduce the size of the finished watermarked image." },
    { slug: "/resize", title: "Resize Image", description: "Resize or crop before adding a watermark." },
  ],
  "zh-CN": [
    { slug: "/watermark", title: "水印工具", description: "在浏览器中添加文字水印和 Logo 水印。" },
    { slug: "/compress-image", title: "压缩图片", description: "压缩加水印后的成品图片。" },
    { slug: "/resize", title: "调整图片尺寸", description: "加水印前先调整尺寸或裁剪。" },
  ],
  ja: [
    { slug: "/watermark", title: "透かしツール", description: "ブラウザでテキスト透かしやロゴ透かしを追加。" },
    { slug: "/compress-image", title: "画像圧縮", description: "透かし入り画像を軽量化。" },
    { slug: "/resize", title: "画像リサイズ", description: "透かしを入れる前にサイズや切り抜きを調整。" },
  ],
  ko: [
    { slug: "/watermark", title: "워터마크 도구", description: "브라우저에서 텍스트와 로고 워터마크를 추가하세요." },
    { slug: "/compress-image", title: "이미지 압축", description: "워터마크가 적용된 이미지를 더 작게 만드세요." },
    { slug: "/resize", title: "이미지 크기 조정", description: "워터마크 전에 크기 조정이나 자르기를 하세요." },
  ],
  es: [
    { slug: "/watermark", title: "Herramienta de Marca de Agua", description: "Añade marcas de agua de texto y logo en el navegador." },
    { slug: "/compress-image", title: "Comprimir Imagen", description: "Reduce el tamaño de la imagen final con marca de agua." },
    { slug: "/resize", title: "Redimensionar Imagen", description: "Redimensiona o recorta antes de añadir la marca de agua." },
  ],
}

export const watermarkPagesByLocale: LocaleWatermarkPages = {
  en: {
    "watermark-maker": {
      slug: "watermark-maker",
      category: "use-case",
      seo: {
        title: "Watermark Maker Online - Free & Private | ImgSplit",
        description: "Create text and logo watermarks online with opacity, repeat, position, and export controls. Free browser-based watermark maker with no upload.",
        ogTitle: "Watermark Maker Online",
        ogDescription: "Add text or logo watermarks to images privately in your browser.",
      },
      hero: {
        overline: "Watermark Maker",
        headlinePart1: "Make ",
        headlineAccent: "Watermarks",
        headlinePart2: "Online",
        description: "Create clean text or logo watermarks for photos, product images, and portfolio assets. Adjust opacity, placement, size, rotation, and repeat patterns without uploading your file.",
      },
      scenarios: [
        { icon: "Shield", title: "Protect Shared Images", description: "Add subtle copyright marks before posting photos, proofs, or client previews online." },
        { icon: "Stamp", title: "Brand Product Photos", description: "Place a logo or brand mark on ecommerce images, social graphics, and marketing assets." },
      ],
      howToSteps: [
        { stepNumber: 1, title: "Upload an Image", description: "Choose a PNG, JPEG, or WebP image. Processing happens locally in your browser." },
        { stepNumber: 2, title: "Add Text or Logo", description: "Start from a template, type your watermark text, or upload a logo layer." },
        { stepNumber: 3, title: "Export", description: "Tune opacity, repeat, position, and output format, then download the finished image." },
      ],
      faqEntries: [
        { question: "Is this watermark maker private?", answer: "Yes. The editor renders your image in the browser, so your original photo and logo do not need to be uploaded to a server." },
        { question: "Can I add both text and logo watermarks?", answer: "Yes. You can combine multiple text layers and logo layers, then control each layer independently." },
        { question: "Can I make a repeating watermark pattern?", answer: "Yes. Switch a layer to repeat mode to create diagonal or tiled watermark patterns across the whole image." },
      ],
      relatedTools: relatedTools.en,
    },
    "add-watermark-to-photo": {
      slug: "add-watermark-to-photo",
      category: "use-case",
      seo: {
        title: "Add Watermark to Photo Online - Free Tool | ImgSplit",
        description: "Add a watermark to photos online with text or logo layers. Free private browser-based photo watermark tool with no upload to servers and easy export.",
        ogTitle: "Add Watermark to Photo Online",
        ogDescription: "Protect and brand photos with private browser-based watermarking.",
      },
      hero: {
        overline: "Photo Watermark Tool",
        headlinePart1: "Add Watermark ",
        headlineAccent: "to Photos",
        headlinePart2: "Online",
        description: "Mark photos with copyright text, a brand name, or a logo before sharing. Use precise placement controls or repeat the watermark across the photo.",
      },
      scenarios: [
        { icon: "Camera", title: "Photography Proofs", description: "Send client previews with a clear watermark while keeping the final unmarked photo private." },
        { icon: "Share2", title: "Social Sharing", description: "Add a creator name or brand mark before posting photos to social platforms." },
      ],
      howToSteps: [
        { stepNumber: 1, title: "Upload Your Photo", description: "Select a photo from your device. JPEG, PNG, and WebP are supported." },
        { stepNumber: 2, title: "Design the Watermark", description: "Choose a template, edit the text, or add a logo layer for brand marks." },
        { stepNumber: 3, title: "Download the Photo", description: "Export the watermarked photo as PNG, JPEG, or WebP." },
      ],
      faqEntries: [
        { question: "What is the best opacity for a photo watermark?", answer: "For most photos, 25-45% opacity keeps the watermark visible without distracting from the image." },
        { question: "Can I put the watermark in a corner?", answer: "Yes. Use the position controls to place a single watermark in any corner or near the center." },
        { question: "Will the tool change my original photo?", answer: "No. ImgSplit downloads a new watermarked file and leaves the original untouched." },
      ],
      relatedTools: relatedTools.en,
    },
    "add-watermark-to-image": {
      slug: "add-watermark-to-image",
      category: "use-case",
      seo: {
        title: "Add Watermark to Image Online - Text or Logo | ImgSplit",
        description: "Add text or logo watermarks to PNG, JPG, and WebP images online. Browser-based watermarking with opacity, repeat controls, and no upload.",
        ogTitle: "Add Watermark to Image Online",
        ogDescription: "Watermark PNG, JPG, and WebP images without uploading them.",
      },
      hero: {
        overline: "Image Watermark Tool",
        headlinePart1: "Add Watermark ",
        headlineAccent: "to Images",
        headlinePart2: "Fast",
        description: "Watermark screenshots, graphics, product shots, and photos with text or logo layers. Everything runs locally, so source images stay on your device.",
      },
      scenarios: [
        { icon: "Image", title: "Product Images", description: "Add a small brand mark to catalog images, marketplace photos, or promotional graphics." },
        { icon: "Layers", title: "Layered Marks", description: "Combine a text watermark with a logo layer and adjust each layer separately." },
      ],
      howToSteps: [
        { stepNumber: 1, title: "Choose an Image", description: "Upload a PNG, JPG, JPEG, or WebP image from your device." },
        { stepNumber: 2, title: "Add Watermark Layers", description: "Create text layers, upload a logo, and set repeat or single placement for each layer." },
        { stepNumber: 3, title: "Save the Result", description: "Preview the canvas and download the finished watermarked image." },
      ],
      faqEntries: [
        { question: "Can I watermark PNG images?", answer: "Yes. PNG, JPEG, JPG, and WebP images are supported." },
        { question: "Can I use a transparent logo?", answer: "Yes. Upload a transparent PNG logo and adjust its size, opacity, and placement." },
        { question: "Does the image get uploaded?", answer: "No. The watermark preview and export are rendered locally in your browser." },
      ],
      relatedTools: relatedTools.en,
    },
    "online-watermark-tool": {
      slug: "online-watermark-tool",
      category: "use-case",
      seo: {
        title: "Online Watermark Tool - Free Text & Logo Marks | ImgSplit",
        description: "Use a free online watermark tool to add text, logo, copyright, or repeated watermarks to images. Private browser-based editing, no upload.",
        ogTitle: "Online Watermark Tool",
        ogDescription: "A private browser-based tool for text and logo watermarks.",
      },
      hero: {
        overline: "Online Watermark Tool",
        headlinePart1: "Watermark ",
        headlineAccent: "Images",
        headlinePart2: "Privately",
        description: "Use a focused online tool for copyright marks, brand logos, repeated patterns, and simple corner labels. No account, no upload, no hidden branding.",
      },
      scenarios: [
        { icon: "Type", title: "Text Watermarks", description: "Add copyright text, creator names, dates, or short labels with font and opacity controls." },
        { icon: "Stamp", title: "Logo Watermarks", description: "Upload a logo layer and place it as a single mark or repeating pattern." },
      ],
      howToSteps: [
        { stepNumber: 1, title: "Open the Tool", description: "Start the watermark editor and load an image from your device." },
        { stepNumber: 2, title: "Pick a Watermark Style", description: "Use corner copyright, diagonal repeat, center label, or brand badge presets." },
        { stepNumber: 3, title: "Download", description: "Export the final image in the format and quality you need." },
      ],
      faqEntries: [
        { question: "Is this online watermark tool free?", answer: "Yes. You can add and export watermarks without an account." },
        { question: "Can I remove the watermark after export?", answer: "The exported file includes the watermark. Keep your original image if you need an unwatermarked copy." },
        { question: "Does ImgSplit add its own branding?", answer: "No. The tool only adds the watermark layers you create." },
      ],
      relatedTools: relatedTools.en,
    },
  },

  "zh-CN": {
    "watermark-maker": {
      slug: "watermark-maker",
      category: "use-case",
      seo: { title: "在线水印制作工具 - 免费私密 | ImgSplit", description: "在线制作文字和 Logo 水印。免费浏览器端水印工具，支持透明度、平铺、位置、尺寸和导出设置。", ogTitle: "在线水印制作工具", ogDescription: "在浏览器中为图片添加文字或 Logo 水印。" },
      hero: { overline: "水印制作工具", headlinePart1: "在线制作", headlineAccent: "水印", headlinePart2: "图片", description: "为照片、商品图和作品集素材制作干净的文字或 Logo 水印。可调整透明度、位置、尺寸、旋转和平铺，文件无需上传。" },
      scenarios: [
        { icon: "Shield", title: "保护分享图片", description: "发布照片、样片或客户预览前添加低调版权标记。" },
        { icon: "Stamp", title: "品牌商品图", description: "为电商图片、社交图和营销素材添加 Logo 或品牌标识。" },
      ],
      howToSteps: [
        { stepNumber: 1, title: "上传图片", description: "选择 PNG、JPEG 或 WebP 图片，处理在浏览器本地完成。" },
        { stepNumber: 2, title: "添加文字或 Logo", description: "从模板开始，输入水印文字，或上传 Logo 图层。" },
        { stepNumber: 3, title: "导出", description: "调整透明度、平铺、位置和格式，然后下载成品图片。" },
      ],
      faqEntries: [
        { question: "这个水印工具是私密的吗？", answer: "是。编辑器在浏览器中渲染图片，原图和 Logo 不需要上传到服务器。" },
        { question: "可以同时添加文字和 Logo 水印吗？", answer: "可以。你可以组合多个文字图层和 Logo 图层，并分别调整。" },
        { question: "可以做平铺水印吗？", answer: "可以。把图层切换为平铺模式，就能生成斜向或重复水印。" },
      ],
      relatedTools: relatedTools["zh-CN"],
    },
    "add-watermark-to-photo": {
      slug: "add-watermark-to-photo",
      category: "use-case",
      seo: { title: "在线给照片加水印 - 免费工具 | ImgSplit", description: "在线给照片添加文字或 Logo 水印。免费、私密、浏览器端处理，无需上传。", ogTitle: "在线给照片加水印", ogDescription: "用浏览器端水印工具保护和标记照片。" },
      hero: { overline: "照片水印工具", headlinePart1: "给照片", headlineAccent: "加水印", headlinePart2: "在线完成", description: "分享前给照片加版权文字、品牌名或 Logo。可精准放置，也可以把水印平铺到整张照片。" },
      scenarios: [
        { icon: "Camera", title: "摄影样片", description: "发送客户预览图时添加清晰水印，同时保留无水印原片。" },
        { icon: "Share2", title: "社交分享", description: "发布到社交平台前添加创作者名称或品牌标记。" },
      ],
      howToSteps: [
        { stepNumber: 1, title: "上传照片", description: "从设备选择照片，支持 JPEG、PNG 和 WebP。" },
        { stepNumber: 2, title: "设计水印", description: "选择模板、编辑文字，或添加 Logo 图层。" },
        { stepNumber: 3, title: "下载照片", description: "将加水印照片导出为 PNG、JPEG 或 WebP。" },
      ],
      faqEntries: [
        { question: "照片水印透明度多少合适？", answer: "多数照片使用 25-45% 透明度比较合适，既可见又不太抢画面。" },
        { question: "可以把水印放在角落吗？", answer: "可以。使用位置控制即可放到任意角落或靠近中心的位置。" },
        { question: "会修改我的原照片吗？", answer: "不会。ImgSplit 会下载新的加水印文件，原图保持不变。" },
      ],
      relatedTools: relatedTools["zh-CN"],
    },
    "add-watermark-to-image": {
      slug: "add-watermark-to-image",
      category: "use-case",
      seo: { title: "在线给图片加水印 - 文字或 Logo | ImgSplit", description: "在线为 PNG、JPG、WebP 图片添加文字或 Logo 水印。浏览器端处理，支持透明度和平铺。", ogTitle: "在线给图片加水印", ogDescription: "无需上传即可为图片添加水印。" },
      hero: { overline: "图片水印工具", headlinePart1: "给图片", headlineAccent: "加水印", headlinePart2: "快速完成", description: "为截图、设计图、商品图和照片添加文字或 Logo 图层。所有处理都在本地完成，源文件留在你的设备上。" },
      scenarios: [
        { icon: "Image", title: "商品图片", description: "为目录图、市场平台图片或推广图添加小型品牌标记。" },
        { icon: "Layers", title: "多图层水印", description: "组合文字水印和 Logo 图层，并分别调整每一层。" },
      ],
      howToSteps: [
        { stepNumber: 1, title: "选择图片", description: "从设备上传 PNG、JPG、JPEG 或 WebP 图片。" },
        { stepNumber: 2, title: "添加水印图层", description: "创建文字图层、上传 Logo，并设置单个位置或平铺模式。" },
        { stepNumber: 3, title: "保存结果", description: "预览画布并下载加水印后的图片。" },
      ],
      faqEntries: [
        { question: "可以给 PNG 图片加水印吗？", answer: "可以。支持 PNG、JPEG、JPG 和 WebP 图片。" },
        { question: "可以使用透明 Logo 吗？", answer: "可以。上传透明 PNG Logo 后可调整尺寸、透明度和位置。" },
        { question: "图片会被上传吗？", answer: "不会。水印预览和导出都在浏览器本地渲染。" },
      ],
      relatedTools: relatedTools["zh-CN"],
    },
    "online-watermark-tool": {
      slug: "online-watermark-tool",
      category: "use-case",
      seo: { title: "在线水印工具 - 免费文字与 Logo 水印 | ImgSplit", description: "免费在线水印工具，为图片添加文字、Logo、版权或平铺水印。浏览器端私密编辑。", ogTitle: "在线水印工具", ogDescription: "私密的浏览器端文字和 Logo 水印工具。" },
      hero: { overline: "在线水印工具", headlinePart1: "私密地", headlineAccent: "添加水印", headlinePart2: "到图片", description: "用于版权标记、品牌 Logo、重复水印和角落标签的在线工具。无需账号、无需上传、不会添加隐藏品牌。" },
      scenarios: [
        { icon: "Type", title: "文字水印", description: "添加版权文字、创作者名称、日期或短标签，并调整字体和透明度。" },
        { icon: "Stamp", title: "Logo 水印", description: "上传 Logo 图层，作为单个标记或重复图案放置。" },
      ],
      howToSteps: [
        { stepNumber: 1, title: "打开工具", description: "进入水印编辑器，从设备加载图片。" },
        { stepNumber: 2, title: "选择水印样式", description: "使用角落版权、斜向平铺、中心标签或品牌徽章模板。" },
        { stepNumber: 3, title: "下载", description: "按需要的格式和质量导出最终图片。" },
      ],
      faqEntries: [
        { question: "这个在线水印工具免费吗？", answer: "是。无需账号即可添加并导出水印。" },
        { question: "导出后还能移除水印吗？", answer: "导出的文件会包含水印。如果需要无水印版本，请保留原图。" },
        { question: "ImgSplit 会添加自己的品牌吗？", answer: "不会。工具只会添加你自己创建的水印图层。" },
      ],
      relatedTools: relatedTools["zh-CN"],
    },
  },

  ja: {
    "watermark-maker": {
      slug: "watermark-maker",
      category: "use-case",
      seo: { title: "オンライン透かしメーカー - 無料・プライベート | ImgSplit", description: "テキストやロゴの透かしをオンラインで作成。透明度、繰り返し、位置、書き出しを調整できるブラウザツール。", ogTitle: "オンライン透かしメーカー", ogDescription: "ブラウザで画像にテキストやロゴ透かしを追加。" },
      hero: { overline: "透かしメーカー", headlinePart1: "オンラインで", headlineAccent: "透かし", headlinePart2: "作成", description: "写真、商品画像、ポートフォリオ素材にテキストやロゴ透かしを追加。ファイルをアップロードせずに透明度、位置、サイズ、回転、繰り返しを調整できます。" },
      scenarios: [
        { icon: "Shield", title: "共有画像を保護", description: "写真、校正画像、クライアントプレビューに控えめな著作権マークを追加。" },
        { icon: "Stamp", title: "商品画像をブランド化", description: "EC画像、SNS画像、マーケティング素材にロゴやブランド名を配置。" },
      ],
      howToSteps: [
        { stepNumber: 1, title: "画像をアップロード", description: "PNG、JPEG、WebPを選択。処理はブラウザ内で完了します。" },
        { stepNumber: 2, title: "テキストまたはロゴを追加", description: "テンプレートから始めるか、文字を入力し、ロゴレイヤーをアップロードします。" },
        { stepNumber: 3, title: "書き出し", description: "透明度、繰り返し、位置、形式を調整してダウンロードします。" },
      ],
      faqEntries: [
        { question: "この透かしメーカーはプライベートですか？", answer: "はい。画像はブラウザで描画されるため、元画像やロゴをサーバーへアップロードする必要はありません。" },
        { question: "テキストとロゴを同時に追加できますか？", answer: "はい。複数のテキストレイヤーとロゴレイヤーを組み合わせ、それぞれ個別に調整できます。" },
        { question: "繰り返し透かしは作れますか？", answer: "はい。レイヤーを繰り返しモードにすると、斜めやタイル状の透かしを作成できます。" },
      ],
      relatedTools: relatedTools.ja,
    },
    "add-watermark-to-photo": {
      slug: "add-watermark-to-photo",
      category: "use-case",
      seo: { title: "写真に透かしを追加 - 無料オンラインツール | ImgSplit", description: "写真にテキストやロゴ透かしをオンラインで追加。無料、プライベート、アップロード不要のブラウザツール。", ogTitle: "写真に透かしを追加", ogDescription: "ブラウザで写真を保護・ブランド化。" },
      hero: { overline: "写真透かしツール", headlinePart1: "写真に", headlineAccent: "透かし", headlinePart2: "追加", description: "共有前に写真へ著作権テキスト、ブランド名、ロゴを追加。正確な配置や全面への繰り返し表示に対応します。" },
      scenarios: [
        { icon: "Camera", title: "写真校正", description: "クライアントプレビューに透かしを入れ、無透かしの完成データは非公開に保てます。" },
        { icon: "Share2", title: "SNS共有", description: "SNS投稿前にクリエイター名やブランドマークを追加できます。" },
      ],
      howToSteps: [
        { stepNumber: 1, title: "写真をアップロード", description: "JPEG、PNG、WebPの写真を選択します。" },
        { stepNumber: 2, title: "透かしを設計", description: "テンプレートを選び、文字を編集するか、ロゴレイヤーを追加します。" },
        { stepNumber: 3, title: "写真をダウンロード", description: "透かし入り写真をPNG、JPEG、WebPで書き出します。" },
      ],
      faqEntries: [
        { question: "写真透かしの透明度はどれくらいが良いですか？", answer: "多くの写真では25-45%程度が、見やすさと控えめさのバランスを取りやすいです。" },
        { question: "角に透かしを置けますか？", answer: "はい。位置コントロールで任意の角や中央付近に配置できます。" },
        { question: "元の写真は変更されますか？", answer: "いいえ。新しい透かし入りファイルをダウンロードし、元画像はそのままです。" },
      ],
      relatedTools: relatedTools.ja,
    },
    "add-watermark-to-image": {
      slug: "add-watermark-to-image",
      category: "use-case",
      seo: { title: "画像に透かしを追加 - テキスト・ロゴ対応 | ImgSplit", description: "PNG、JPG、WebP画像にテキストやロゴ透かしをオンラインで追加。透明度と繰り返しを調整できます。", ogTitle: "画像に透かしを追加", ogDescription: "アップロード不要で画像に透かしを追加。" },
      hero: { overline: "画像透かしツール", headlinePart1: "画像に", headlineAccent: "透かし", headlinePart2: "高速追加", description: "スクリーンショット、グラフィック、商品画像、写真にテキストやロゴレイヤーを追加。処理はローカルで行われます。" },
      scenarios: [
        { icon: "Image", title: "商品画像", description: "カタログ、マーケットプレイス、プロモーション画像に小さなブランドマークを追加。" },
        { icon: "Layers", title: "レイヤー透かし", description: "テキスト透かしとロゴレイヤーを組み合わせ、個別に調整できます。" },
      ],
      howToSteps: [
        { stepNumber: 1, title: "画像を選択", description: "PNG、JPG、JPEG、WebP画像をデバイスからアップロードします。" },
        { stepNumber: 2, title: "透かしレイヤーを追加", description: "テキストレイヤーやロゴを追加し、単一配置または繰り返しを設定します。" },
        { stepNumber: 3, title: "結果を保存", description: "プレビューを確認して透かし入り画像をダウンロードします。" },
      ],
      faqEntries: [
        { question: "PNG画像にも透かしを入れられますか？", answer: "はい。PNG、JPEG、JPG、WebPに対応しています。" },
        { question: "透明ロゴは使えますか？", answer: "はい。透明PNGロゴをアップロードし、サイズ、透明度、位置を調整できます。" },
        { question: "画像はアップロードされますか？", answer: "いいえ。プレビューと書き出しはブラウザ内でレンダリングされます。" },
      ],
      relatedTools: relatedTools.ja,
    },
    "online-watermark-tool": {
      slug: "online-watermark-tool",
      category: "use-case",
      seo: { title: "オンライン透かしツール - 無料テキスト・ロゴ | ImgSplit", description: "画像にテキスト、ロゴ、著作権、繰り返し透かしを追加。プライベートなブラウザ編集。", ogTitle: "オンライン透かしツール", ogDescription: "テキストとロゴ透かしのためのブラウザツール。" },
      hero: { overline: "オンライン透かしツール", headlinePart1: "画像に", headlineAccent: "透かし", headlinePart2: "安全に追加", description: "著作権マーク、ブランドロゴ、繰り返しパターン、角ラベルに対応。アカウント不要、アップロード不要、隠れたブランド表示もありません。" },
      scenarios: [
        { icon: "Type", title: "テキスト透かし", description: "著作権、クリエイター名、日付、短いラベルをフォントと透明度つきで追加。" },
        { icon: "Stamp", title: "ロゴ透かし", description: "ロゴレイヤーをアップロードし、単一マークまたは繰り返しパターンとして配置。" },
      ],
      howToSteps: [
        { stepNumber: 1, title: "ツールを開く", description: "透かしエディターを開き、デバイスから画像を読み込みます。" },
        { stepNumber: 2, title: "透かしスタイルを選択", description: "角の著作権、斜め繰り返し、中央ラベル、ブランドバッジを選べます。" },
        { stepNumber: 3, title: "ダウンロード", description: "必要な形式と品質で最終画像を書き出します。" },
      ],
      faqEntries: [
        { question: "このオンライン透かしツールは無料ですか？", answer: "はい。アカウントなしで透かしを追加し、書き出せます。" },
        { question: "書き出し後に透かしを消せますか？", answer: "書き出したファイルには透かしが含まれます。無透かしが必要な場合は元画像を保管してください。" },
        { question: "ImgSplitのロゴは追加されますか？", answer: "いいえ。追加されるのはあなたが作成した透かしレイヤーだけです。" },
      ],
      relatedTools: relatedTools.ja,
    },
  },

  ko: {
    "watermark-maker": {
      slug: "watermark-maker",
      category: "use-case",
      seo: { title: "온라인 워터마크 메이커 - 무료 비공개 | ImgSplit", description: "텍스트와 로고 워터마크를 온라인에서 만드세요. 투명도, 반복, 위치, 내보내기를 조정하는 브라우저 도구입니다.", ogTitle: "온라인 워터마크 메이커", ogDescription: "브라우저에서 이미지에 텍스트나 로고 워터마크를 추가하세요." },
      hero: { overline: "워터마크 메이커", headlinePart1: "온라인", headlineAccent: "워터마크", headlinePart2: "제작", description: "사진, 제품 이미지, 포트폴리오 자료에 텍스트나 로고 워터마크를 추가하세요. 업로드 없이 투명도, 위치, 크기, 회전, 반복을 조정할 수 있습니다." },
      scenarios: [
        { icon: "Shield", title: "공유 이미지 보호", description: "사진, 시안, 클라이언트 미리보기에 은은한 저작권 표시를 추가하세요." },
        { icon: "Stamp", title: "제품 사진 브랜딩", description: "쇼핑몰 이미지, 소셜 그래픽, 마케팅 자료에 로고나 브랜드 표시를 배치하세요." },
      ],
      howToSteps: [
        { stepNumber: 1, title: "이미지 업로드", description: "PNG, JPEG, WebP 이미지를 선택하세요. 처리는 브라우저에서 이뤄집니다." },
        { stepNumber: 2, title: "텍스트 또는 로고 추가", description: "템플릿에서 시작하거나 워터마크 텍스트를 입력하고 로고 레이어를 업로드하세요." },
        { stepNumber: 3, title: "내보내기", description: "투명도, 반복, 위치, 형식을 조정한 뒤 완성 이미지를 다운로드하세요." },
      ],
      faqEntries: [
        { question: "이 워터마크 메이커는 비공개인가요?", answer: "예. 이미지는 브라우저에서 렌더링되므로 원본 사진과 로고를 서버에 업로드할 필요가 없습니다." },
        { question: "텍스트와 로고 워터마크를 같이 추가할 수 있나요?", answer: "예. 여러 텍스트 레이어와 로고 레이어를 조합하고 각각 독립적으로 조정할 수 있습니다." },
        { question: "반복 워터마크 패턴을 만들 수 있나요?", answer: "예. 레이어를 반복 모드로 전환하면 대각선 또는 타일 형태의 워터마크를 만들 수 있습니다." },
      ],
      relatedTools: relatedTools.ko,
    },
    "add-watermark-to-photo": {
      slug: "add-watermark-to-photo",
      category: "use-case",
      seo: { title: "사진에 워터마크 추가 - 무료 온라인 도구 | ImgSplit", description: "사진에 텍스트나 로고 워터마크를 온라인으로 추가하세요. 무료, 비공개, 업로드 없는 브라우저 도구입니다.", ogTitle: "사진에 워터마크 추가", ogDescription: "브라우저에서 사진을 보호하고 브랜딩하세요." },
      hero: { overline: "사진 워터마크 도구", headlinePart1: "사진에", headlineAccent: "워터마크", headlinePart2: "추가", description: "공유 전에 사진에 저작권 텍스트, 브랜드명, 로고를 추가하세요. 정확히 배치하거나 사진 전체에 반복할 수 있습니다." },
      scenarios: [
        { icon: "Camera", title: "사진 시안", description: "클라이언트 미리보기에 워터마크를 넣고 최종 원본은 비공개로 유지하세요." },
        { icon: "Share2", title: "소셜 공유", description: "소셜 플랫폼에 게시하기 전에 제작자명이나 브랜드 표시를 추가하세요." },
      ],
      howToSteps: [
        { stepNumber: 1, title: "사진 업로드", description: "기기에서 사진을 선택하세요. JPEG, PNG, WebP를 지원합니다." },
        { stepNumber: 2, title: "워터마크 디자인", description: "템플릿을 선택하고 텍스트를 편집하거나 로고 레이어를 추가하세요." },
        { stepNumber: 3, title: "사진 다운로드", description: "워터마크가 적용된 사진을 PNG, JPEG, WebP로 내보내세요." },
      ],
      faqEntries: [
        { question: "사진 워터마크 투명도는 어느 정도가 좋나요?", answer: "대부분의 사진에서는 25-45% 투명도가 보기 좋고 방해가 적습니다." },
        { question: "워터마크를 모서리에 둘 수 있나요?", answer: "예. 위치 컨트롤로 원하는 모서리나 중앙 근처에 배치할 수 있습니다." },
        { question: "원본 사진이 바뀌나요?", answer: "아니요. ImgSplit은 새 워터마크 파일을 다운로드하며 원본은 그대로 유지됩니다." },
      ],
      relatedTools: relatedTools.ko,
    },
    "add-watermark-to-image": {
      slug: "add-watermark-to-image",
      category: "use-case",
      seo: { title: "이미지에 워터마크 추가 - 텍스트 또는 로고 | ImgSplit", description: "PNG, JPG, WebP 이미지에 텍스트나 로고 워터마크를 온라인으로 추가하세요. 투명도와 반복을 조정할 수 있습니다.", ogTitle: "이미지에 워터마크 추가", ogDescription: "업로드 없이 이미지에 워터마크를 추가하세요." },
      hero: { overline: "이미지 워터마크 도구", headlinePart1: "이미지에", headlineAccent: "워터마크", headlinePart2: "빠르게", description: "스크린샷, 그래픽, 제품 사진, 일반 사진에 텍스트나 로고 레이어를 추가하세요. 모든 처리는 로컬에서 이뤄집니다." },
      scenarios: [
        { icon: "Image", title: "제품 이미지", description: "카탈로그, 마켓플레이스, 프로모션 이미지에 작은 브랜드 표시를 추가하세요." },
        { icon: "Layers", title: "레이어 워터마크", description: "텍스트 워터마크와 로고 레이어를 조합하고 각각 조정하세요." },
      ],
      howToSteps: [
        { stepNumber: 1, title: "이미지 선택", description: "기기에서 PNG, JPG, JPEG, WebP 이미지를 업로드하세요." },
        { stepNumber: 2, title: "워터마크 레이어 추가", description: "텍스트 레이어를 만들고 로고를 업로드한 뒤 단일 배치나 반복을 설정하세요." },
        { stepNumber: 3, title: "결과 저장", description: "캔버스를 미리보고 완성 이미지를 다운로드하세요." },
      ],
      faqEntries: [
        { question: "PNG 이미지에도 워터마크를 넣을 수 있나요?", answer: "예. PNG, JPEG, JPG, WebP 이미지를 지원합니다." },
        { question: "투명 로고를 사용할 수 있나요?", answer: "예. 투명 PNG 로고를 업로드하고 크기, 투명도, 위치를 조정할 수 있습니다." },
        { question: "이미지가 업로드되나요?", answer: "아니요. 워터마크 미리보기와 내보내기는 브라우저에서 로컬로 렌더링됩니다." },
      ],
      relatedTools: relatedTools.ko,
    },
    "online-watermark-tool": {
      slug: "online-watermark-tool",
      category: "use-case",
      seo: { title: "온라인 워터마크 도구 - 무료 텍스트 및 로고 | ImgSplit", description: "이미지에 텍스트, 로고, 저작권, 반복 워터마크를 추가하세요. 비공개 브라우저 편집 도구입니다.", ogTitle: "온라인 워터마크 도구", ogDescription: "텍스트와 로고 워터마크를 위한 브라우저 도구입니다." },
      hero: { overline: "온라인 워터마크 도구", headlinePart1: "비공개로", headlineAccent: "워터마크", headlinePart2: "추가", description: "저작권 표시, 브랜드 로고, 반복 패턴, 간단한 모서리 라벨을 위한 도구입니다. 계정도 업로드도 숨은 브랜딩도 없습니다." },
      scenarios: [
        { icon: "Type", title: "텍스트 워터마크", description: "저작권 문구, 제작자명, 날짜, 짧은 라벨을 폰트와 투명도 조절로 추가하세요." },
        { icon: "Stamp", title: "로고 워터마크", description: "로고 레이어를 업로드하고 단일 표시나 반복 패턴으로 배치하세요." },
      ],
      howToSteps: [
        { stepNumber: 1, title: "도구 열기", description: "워터마크 에디터를 열고 기기에서 이미지를 불러오세요." },
        { stepNumber: 2, title: "워터마크 스타일 선택", description: "모서리 저작권, 대각선 반복, 중앙 라벨, 브랜드 배지 프리셋을 사용하세요." },
        { stepNumber: 3, title: "다운로드", description: "필요한 형식과 품질로 최종 이미지를 내보내세요." },
      ],
      faqEntries: [
        { question: "이 온라인 워터마크 도구는 무료인가요?", answer: "예. 계정 없이 워터마크를 추가하고 내보낼 수 있습니다." },
        { question: "내보낸 뒤 워터마크를 제거할 수 있나요?", answer: "내보낸 파일에는 워터마크가 포함됩니다. 워터마크 없는 사본이 필요하면 원본을 보관하세요." },
        { question: "ImgSplit 자체 브랜딩이 추가되나요?", answer: "아니요. 직접 만든 워터마크 레이어만 추가됩니다." },
      ],
      relatedTools: relatedTools.ko,
    },
  },

  es: {
    "watermark-maker": {
      slug: "watermark-maker",
      category: "use-case",
      seo: { title: "Watermark Maker Online - Gratis y Privado | ImgSplit", description: "Crea marcas de agua de texto y logo online. Herramienta gratuita en el navegador con opacidad, repetición, posición y exportación.", ogTitle: "Watermark Maker Online", ogDescription: "Añade marcas de agua de texto o logo en el navegador." },
      hero: { overline: "Watermark Maker", headlinePart1: "Crea ", headlineAccent: "Marcas", headlinePart2: "Online", description: "Crea marcas de agua de texto o logo para fotos, productos y portafolios. Ajusta opacidad, posición, tamaño, rotación y repetición sin subir archivos." },
      scenarios: [
        { icon: "Shield", title: "Protege Imágenes", description: "Añade marcas de copyright sutiles antes de publicar fotos, pruebas o vistas previas." },
        { icon: "Stamp", title: "Marca Fotos de Producto", description: "Coloca un logo o marca en imágenes ecommerce, gráficos sociales y recursos de marketing." },
      ],
      howToSteps: [
        { stepNumber: 1, title: "Sube una Imagen", description: "Elige una imagen PNG, JPEG o WebP. El procesamiento ocurre en tu navegador." },
        { stepNumber: 2, title: "Añade Texto o Logo", description: "Empieza con una plantilla, escribe el texto o sube una capa de logo." },
        { stepNumber: 3, title: "Exporta", description: "Ajusta opacidad, repetición, posición y formato, luego descarga la imagen final." },
      ],
      faqEntries: [
        { question: "¿Es privado este watermark maker?", answer: "Sí. El editor renderiza la imagen en el navegador, así que la foto original y el logo no tienen que subirse a un servidor." },
        { question: "¿Puedo añadir texto y logo a la vez?", answer: "Sí. Puedes combinar varias capas de texto y logo y ajustar cada una por separado." },
        { question: "¿Puedo crear una marca repetida?", answer: "Sí. Cambia una capa al modo repetido para crear patrones diagonales o en mosaico." },
      ],
      relatedTools: relatedTools.es,
    },
    "add-watermark-to-photo": {
      slug: "add-watermark-to-photo",
      category: "use-case",
      seo: { title: "Añadir Marca de Agua a Foto Online | ImgSplit", description: "Añade una marca de agua a fotos online con texto o logo. Gratis, privado, en el navegador y sin subir archivos.", ogTitle: "Añadir Marca de Agua a Foto", ogDescription: "Protege y marca fotos con una herramienta privada en el navegador." },
      hero: { overline: "Marca de Agua para Fotos", headlinePart1: "Añade Marca ", headlineAccent: "a Fotos", headlinePart2: "Online", description: "Marca fotos con copyright, nombre de marca o logo antes de compartir. Usa controles precisos o repite la marca por toda la foto." },
      scenarios: [
        { icon: "Camera", title: "Pruebas Fotográficas", description: "Envía vistas previas a clientes con una marca clara y conserva la foto final sin marca." },
        { icon: "Share2", title: "Compartir en Redes", description: "Añade nombre de creador o marca antes de publicar en plataformas sociales." },
      ],
      howToSteps: [
        { stepNumber: 1, title: "Sube tu Foto", description: "Selecciona una foto de tu dispositivo. Soporta JPEG, PNG y WebP." },
        { stepNumber: 2, title: "Diseña la Marca", description: "Elige una plantilla, edita el texto o añade una capa de logo." },
        { stepNumber: 3, title: "Descarga la Foto", description: "Exporta la foto con marca como PNG, JPEG o WebP." },
      ],
      faqEntries: [
        { question: "¿Qué opacidad conviene para una foto?", answer: "Para la mayoría de fotos, 25-45% mantiene la marca visible sin distraer." },
        { question: "¿Puedo poner la marca en una esquina?", answer: "Sí. Usa los controles de posición para colocarla en cualquier esquina o cerca del centro." },
        { question: "¿Cambia mi foto original?", answer: "No. ImgSplit descarga un nuevo archivo con marca y deja el original intacto." },
      ],
      relatedTools: relatedTools.es,
    },
    "add-watermark-to-image": {
      slug: "add-watermark-to-image",
      category: "use-case",
      seo: { title: "Añadir Marca de Agua a Imagen - Texto o Logo | ImgSplit", description: "Añade marcas de agua de texto o logo a imágenes PNG, JPG y WebP online. Edición en navegador con opacidad y repetición.", ogTitle: "Añadir Marca de Agua a Imagen", ogDescription: "Marca imágenes PNG, JPG y WebP sin subirlas." },
      hero: { overline: "Marca de Agua para Imágenes", headlinePart1: "Añade Marca ", headlineAccent: "a Imágenes", headlinePart2: "Rápido", description: "Marca capturas, gráficos, fotos de producto y fotografías con capas de texto o logo. Todo se ejecuta localmente." },
      scenarios: [
        { icon: "Image", title: "Imágenes de Producto", description: "Añade una pequeña marca a catálogos, marketplaces o gráficos promocionales." },
        { icon: "Layers", title: "Marcas por Capas", description: "Combina una marca de texto con una capa de logo y ajusta cada una por separado." },
      ],
      howToSteps: [
        { stepNumber: 1, title: "Elige una Imagen", description: "Sube una imagen PNG, JPG, JPEG o WebP desde tu dispositivo." },
        { stepNumber: 2, title: "Añade Capas", description: "Crea texto, sube un logo y define colocación única o repetida para cada capa." },
        { stepNumber: 3, title: "Guarda el Resultado", description: "Previsualiza el lienzo y descarga la imagen final con marca." },
      ],
      faqEntries: [
        { question: "¿Puedo marcar imágenes PNG?", answer: "Sí. Soporta PNG, JPEG, JPG y WebP." },
        { question: "¿Puedo usar un logo transparente?", answer: "Sí. Sube un PNG transparente y ajusta tamaño, opacidad y posición." },
        { question: "¿Se sube la imagen?", answer: "No. La previsualización y exportación se renderizan localmente en el navegador." },
      ],
      relatedTools: relatedTools.es,
    },
    "online-watermark-tool": {
      slug: "online-watermark-tool",
      category: "use-case",
      seo: { title: "Herramienta Online de Marca de Agua | ImgSplit", description: "Usa una herramienta online gratis para añadir texto, logo, copyright o marcas repetidas a imágenes. Edición privada en navegador.", ogTitle: "Herramienta Online de Marca de Agua", ogDescription: "Herramienta privada para marcas de texto y logo." },
      hero: { overline: "Herramienta Online", headlinePart1: "Marca ", headlineAccent: "Imágenes", headlinePart2: "Privado", description: "Una herramienta enfocada para copyright, logos, patrones repetidos y etiquetas en esquina. Sin cuenta, sin subida y sin marca oculta." },
      scenarios: [
        { icon: "Type", title: "Marcas de Texto", description: "Añade copyright, nombres de creador, fechas o etiquetas cortas con control de fuente y opacidad." },
        { icon: "Stamp", title: "Marcas de Logo", description: "Sube un logo y colócalo como marca única o patrón repetido." },
      ],
      howToSteps: [
        { stepNumber: 1, title: "Abre la Herramienta", description: "Inicia el editor de marcas de agua y carga una imagen desde tu dispositivo." },
        { stepNumber: 2, title: "Elige un Estilo", description: "Usa copyright en esquina, repetición diagonal, etiqueta central o badge de marca." },
        { stepNumber: 3, title: "Descarga", description: "Exporta la imagen final con el formato y calidad que necesitas." },
      ],
      faqEntries: [
        { question: "¿Es gratis esta herramienta?", answer: "Sí. Puedes añadir y exportar marcas de agua sin una cuenta." },
        { question: "¿Puedo quitar la marca después de exportar?", answer: "El archivo exportado incluye la marca. Conserva la imagen original si necesitas una copia sin marca." },
        { question: "¿ImgSplit añade su propia marca?", answer: "No. La herramienta solo añade las capas que tú creas." },
      ],
      relatedTools: relatedTools.es,
    },
  },
}
