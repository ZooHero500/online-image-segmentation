import type { ToolPageData } from "./types"

const data: Record<string, ToolPageData> = {
  "split-in-half": {
        slug: "split-in-half",
        category: "direction",
        seo: {
          title: "Split Image in Half Online — Free 50/50 Divider | ImgSplit",
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

  "split-horizontally": {
        slug: "split-horizontally",
        category: "direction",
        seo: {
          title: "Split Image Horizontally Online — Free Cutter | ImgSplit",
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

  "split-vertically": {
        slug: "split-vertically",
        category: "direction",
        seo: {
          title: "Split Image Vertically Online — Free Cutter | ImgSplit",
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

  "split-into-equal-parts": {
        slug: "split-into-equal-parts",
        category: "direction",
        seo: {
          title: "Split Image into Equal Parts — Free Online Divider | ImgSplit",
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

  "split-long-screenshot": {
        slug: "split-long-screenshot",
        category: "use-case",
        seo: {
          title: "Split Long Screenshots into Pages — Free Tool | ImgSplit",
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
          { slug: "/split-for-wechat", title: "Social Media Grid Splitter", description: "Split images into grid tiles for social media profiles." },
          { slug: "/", title: "Image Splitter", description: "Full-featured splitter with drag-and-drop lines." },
        ],
      },

  "split-for-instagram": {
        slug: "split-for-instagram",
        category: "use-case",
        seo: {
          title: "Instagram Image Splitter — Carousel & Grid | ImgSplit",
          description: "Split images for Instagram carousel posts and profile grid layouts at 1080 x 1080 px. Free browser-based splitting with no upload and no watermarks.",
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
          { slug: "/split-for-wechat", title: "Social Media Grid Splitter", description: "Split images into grid tiles for social media profiles." },
          { slug: "/grid", title: "Grid Splitter", description: "Quick 3×3 grid splits optimized for social media." },
        ],
      },

  "split-for-wechat": {
        slug: "split-for-wechat",
        category: "use-case",
        seo: {
          title: "Split Images for Social Media Grids — Free Online Tool | ImgSplit",
          description: "Split images into grid tiles for social media profiles. Create 3x3, 2x2, or custom grids for Instagram, Facebook, and more. Free, browser-based.",
          ogTitle: "Social Media Grid Splitter — Free Online Tool",
          ogDescription: "Split images into grid tiles for social media. Free and browser-based.",
        },
        hero: {
          overline: "Social Media Grid Splitter",
          headlinePart1: "Split Images",
          headlineAccent: "for Social Grids",
          headlinePart2: "— Stand Out Online",
          description: "Create stunning grid layouts for your social media profile. Split any image into perfectly sized tiles for Instagram, Facebook, and other platforms.",
        },
        scenarios: [
          {
            icon: "Share2",
            title: "Profile Grid Layouts",
            description: "Split a single image into 3x3 or 2x2 tiles that form a seamless mosaic on your social media profile, creating a striking visual impression.",
          },
          {
            icon: "Maximize2",
            title: "Multi-Post Storytelling",
            description: "Divide a panorama or infographic into sequential grid tiles that tell a visual story across multiple posts on any social platform.",
          },
        ],
        howToSteps: [
          { stepNumber: 1, title: "Upload Your Image", description: "Upload the photo you want to split into social media grid tiles." },
          { stepNumber: 2, title: "Create Your Grid", description: "Add horizontal and vertical lines to define your grid layout. Use snap alignment for perfectly even 3x3, 2x2, or custom grids." },
          { stepNumber: 3, title: "Download & Post", description: "Download all grid tiles as a ZIP file, then upload them in order to your social platform for a seamless result." },
        ],
        faqEntries: [
          { question: "What grid size works best for social media profiles?", answer: "A 3x3 grid (9 tiles) is the most popular choice for Instagram and Facebook profile aesthetics. For simpler layouts, a 2x2 grid works well too." },
          { question: "Do I need to post the tiles in a specific order?", answer: "Yes. Tiles are numbered left-to-right, top-to-bottom. Post them in reverse order (last tile first) so they appear correctly on your profile grid." },
          { question: "Will the tiles line up perfectly on my profile?", answer: "Yes — the tool splits at exact pixel boundaries with zero quality loss, so tiles align seamlessly when viewed on your social media profile." },
        ],
        relatedTools: [
          { slug: "/split-for-instagram", title: "Instagram Splitter", description: "Split images specifically for Instagram carousel and grid posts." },
          { slug: "/split-long-screenshot", title: "Long Screenshot Splitter", description: "Split tall screenshots into page-sized segments." },
          { slug: "/", title: "Image Splitter", description: "Full-featured image splitter with custom split lines." },
          { slug: "/grid", title: "Grid Splitter", description: "Quick preset grid splits: 3×3, 1×3, 2×2." },
        ],
      },

  "split-for-print": {
        slug: "split-for-print",
        category: "use-case",
        seo: {
          title: "Split Image for Printing — Free Tile Tool | ImgSplit",
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

  "no-photoshop-slicer": {
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

  "photo-splitter": {
    slug: "photo-splitter",
    category: "use-case",
    seo: {
      title: "Photo Splitter Online — Free Image Divider | ImgSplit",
      description: "Free online photo splitter — divide any photo into multiple pieces with drag-and-drop precision. No upload to servers, 100% browser-based, works on any device.",
      ogTitle: "Photo Splitter — Free Online Tool",
      ogDescription: "Split any photo into multiple pieces instantly. Free, private, browser-based.",
    },
    hero: {
      overline: "Photo Splitting Tool",
      headlinePart1: "Photo",
      headlineAccent: "Splitter",
      headlinePart2: "— Free & Instant",
      description: "Divide any photo into multiple pieces with pixel-perfect precision. Drag-and-drop split lines, snap alignment, and instant download — all in your browser.",
    },
    scenarios: [
      {
        icon: "Camera",
        title: "Photography Post-Processing",
        description: "Split group photos, panoramic shots, or composite images into individual sections for separate editing, sharing, or printing.",
      },
      {
        icon: "Smartphone",
        title: "Mobile Photo Management",
        description: "Divide photos taken on your phone into sections — extract faces, crop details, or separate foreground from background areas.",
      },
      {
        icon: "ShoppingBag",
        title: "Product Photo Preparation",
        description: "Split product photos into detail shots for e-commerce listings — show different angles, features, or close-ups from a single original photo.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your Photo", description: "Drag and drop or click to upload any photo — PNG, JPG, or WebP up to 20 MB." },
      { stepNumber: 2, title: "Place Split Lines", description: "Add horizontal or vertical split lines and drag them to divide the photo exactly where you want." },
      { stepNumber: 3, title: "Preview & Adjust", description: "See each split piece in real-time. Fine-tune line positions with snap alignment for precision." },
      { stepNumber: 4, title: "Download Pieces", description: "Download all pieces as a ZIP archive, or save individual sections one by one." },
    ],
    faqEntries: [
      { question: "What photo formats are supported?", answer: "PNG, JPG/JPEG, and WebP photos are supported, with a maximum file size of 20 MB per photo." },
      { question: "Will splitting reduce my photo quality?", answer: "No. Each piece retains the original resolution and pixel data. There is no compression or resampling — zero quality loss guaranteed." },
      { question: "Can I split a photo into unequal pieces?", answer: "Yes. Drag split lines to any position for custom-sized pieces. You're not limited to equal divisions." },
      { question: "Is there a limit to how many pieces I can create?", answer: "You can add up to 20 horizontal and 20 vertical lines, creating hundreds of pieces from a single photo." },
      { question: "Does this work with phone photos?", answer: "Yes — works with any photo from any device. The tool runs in your mobile browser too, so you can split photos directly on your phone." },
    ],
    relatedTools: [
      { slug: "/split-in-half", title: "Split in Half", description: "The simplest split — divide any image into two equal halves." },
      { slug: "/split-into-equal-parts", title: "Equal Parts Splitter", description: "Divide images into perfectly equal segments." },
      { slug: "/split-for-instagram", title: "Instagram Splitter", description: "Split photos for Instagram carousel and grid posts." },
      { slug: "/", title: "Image Splitter", description: "Full-featured image splitting with custom drag-and-drop lines." },
    ],
  },

  "image-cutter": {
    slug: "image-cutter",
    category: "use-case",
    seo: {
      title: "Image Cutter Online — Free Cutting Tool | ImgSplit",
      description: "Free online image cutter — cut any image into pieces with precise control. Drag cut lines, snap to grid, and download instantly. No upload, 100% browser-based.",
      ogTitle: "Image Cutter Online — Free Tool",
      ogDescription: "Cut any image into pieces with drag-and-drop precision. Free and browser-based.",
    },
    hero: {
      overline: "Image Cutting Tool",
      headlinePart1: "Image",
      headlineAccent: "Cutter",
      headlinePart2: "— Cut with Precision",
      description: "Cut any image into multiple pieces with drag-and-drop cut lines. Pixel-perfect precision, snap alignment, and instant download — no software installation needed.",
    },
    scenarios: [
      {
        icon: "Scissors",
        title: "Web Design Asset Cutting",
        description: "Cut design mockups into individual assets — headers, buttons, icons, and content sections — ready for HTML/CSS implementation.",
      },
      {
        icon: "Mail",
        title: "Email Template Slicing",
        description: "Cut email designs into optimized image sections for HTML email templates that render perfectly across all email clients.",
      },
      {
        icon: "FileImage",
        title: "Document Region Extraction",
        description: "Cut specific regions from scanned documents, certificates, or screenshots — extract exactly the section you need without cropping the rest.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your Image", description: "Upload any image — PNG, JPG, or WebP. Drag and drop or click to select." },
      { stepNumber: 2, title: "Place Cut Lines", description: "Add horizontal and vertical cut lines. Drag them to define exactly where the image should be divided." },
      { stepNumber: 3, title: "Download Cut Pieces", description: "Preview every piece, then download all at once as a ZIP or pick individual sections." },
    ],
    faqEntries: [
      { question: "What is the difference between cutting and cropping?", answer: "Cropping removes the outer edges of an image to keep one region. Cutting divides the entire image into multiple pieces — nothing is discarded, every pixel is preserved in one of the output pieces." },
      { question: "Can I cut an image into irregular shapes?", answer: "The tool uses straight horizontal and vertical cut lines, producing rectangular pieces. For non-rectangular shapes, consider using a dedicated masking tool." },
      { question: "How precise are the cut lines?", answer: "Cut lines snap to pixel boundaries and support fine-grained dragging. You can position them with single-pixel accuracy." },
      { question: "Is there a maximum image size?", answer: "Files up to 20 MB are supported. There is no pixel dimension limit, though very large images may take a moment to process." },
    ],
    relatedTools: [
      { slug: "/no-photoshop-slicer", title: "No-Photoshop Slicer", description: "A free alternative to Photoshop's slice tool for quick image dividing." },
      { slug: "/split-horizontally", title: "Horizontal Splitter", description: "Cut images into horizontal rows and strips." },
      { slug: "/split-vertically", title: "Vertical Splitter", description: "Cut images into vertical columns." },
      { slug: "/", title: "Image Splitter", description: "Full-featured image splitting with drag-and-drop lines." },
    ],
  },

  "grid-maker": {
    slug: "grid-maker",
    category: "use-case",
    seo: {
      title: "Image Grid Maker — Free Online Grid Generator | ImgSplit",
      description: "Free online image grid maker — create 2x2, 3x3, 4x4, or custom grids from any image. Perfect for social media, moodboards, and collage layouts. Browser-based.",
      ogTitle: "Image Grid Maker — Free Online Tool",
      ogDescription: "Create image grids for social media, moodboards, and more. Free and browser-based.",
    },
    hero: {
      overline: "Grid Creation Tool",
      headlinePart1: "Image",
      headlineAccent: "Grid Maker",
      headlinePart2: "— Any Layout",
      description: "Create perfect image grids — 2x2, 3x3, 4x4, or any custom layout. Ideal for social media profiles, moodboards, and visual storytelling.",
    },
    scenarios: [
      {
        icon: "LayoutGrid",
        title: "Social Media Grid Profiles",
        description: "Create stunning grid layouts that transform your social media profile into a cohesive visual gallery — each tile is part of a bigger picture.",
      },
      {
        icon: "Palette",
        title: "Moodboards & Inspiration Boards",
        description: "Split reference images into organized grid tiles for design moodboards, color palette exploration, or visual brainstorming sessions.",
      },
      {
        icon: "Presentation",
        title: "Presentation Visuals",
        description: "Create grid-based visuals for presentations — split infographics, comparison charts, or data visualizations into clean, organized tiles.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your Image", description: "Upload the image you want to split into a grid. Supports PNG, JPG, and WebP." },
      { stepNumber: 2, title: "Define Your Grid", description: "Add evenly spaced horizontal and vertical lines to create your desired grid layout — 2x2, 3x3, or any custom configuration." },
      { stepNumber: 3, title: "Download Grid Tiles", description: "Preview all grid tiles, then download them as a ZIP. Tiles are numbered for easy ordering." },
    ],
    faqEntries: [
      { question: "What grid sizes can I create?", answer: "Any grid size you want — from 2x2 to 10x10 and beyond. Add as many horizontal and vertical lines as needed (up to 20 each)." },
      { question: "Are the grid tiles perfectly equal?", answer: "Use the snap alignment feature to distribute lines evenly. Lines automatically snap to equal-interval positions for perfectly uniform tiles." },
      { question: "Can I create non-square grids like 2x3 or 3x4?", answer: "Yes. Add different numbers of horizontal and vertical lines to create any rectangular grid layout." },
      { question: "What is the best grid for Instagram?", answer: "A 1x3 grid (3 vertical tiles) works great for carousel posts. A 3x3 grid (9 tiles) creates a stunning mosaic effect on your profile page." },
    ],
    relatedTools: [
      { slug: "/grid", title: "Grid Splitter", description: "Quick preset grid splits: 3×3, 1×3, 2×2 — optimized for social media." },
      { slug: "/split-for-instagram", title: "Instagram Splitter", description: "Split images specifically for Instagram carousel and grid posts." },
      { slug: "/split-into-equal-parts", title: "Equal Parts Splitter", description: "Divide images into perfectly equal segments." },
      { slug: "/split-for-wechat", title: "Social Media Grid", description: "Split images into grid tiles for social media profiles." },
    ],
  },

  "compress-image": {
    slug: "compress-image",
    category: "use-case",
    seo: {
      title: "Compress Images Online — Free & Private | ImgSplit",
      description: "Compress images online for free — reduce file size while maintaining visual quality. Browser-based, no upload to servers, supports JPEG, PNG, and WebP.",
      ogTitle: "Compress Images Online — Free & Private",
      ogDescription: "Reduce image file size instantly in your browser. Free, private, no upload needed.",
    },
    hero: {
      overline: "Image Compression Tool",
      headlinePart1: "Compress",
      headlineAccent: "Images",
      headlinePart2: "— Instantly",
      description: "Reduce image file size without visible quality loss. Supports JPEG, PNG, and WebP — everything runs in your browser, nothing leaves your device.",
    },
    scenarios: [
      {
        icon: "Globe",
        title: "Web Optimization",
        description: "Compress images before uploading to your website — faster page loads, better Core Web Vitals, and improved SEO rankings without sacrificing visual quality.",
      },
      {
        icon: "Mail",
        title: "Email Attachments",
        description: "Shrink image attachments to fit email size limits. Keep your photos looking great while staying under the 10 MB or 25 MB attachment cap.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your Image", description: "Drag and drop or click to upload any JPEG, PNG, or WebP image you want to compress." },
      { stepNumber: 2, title: "Adjust Quality", description: "Use the quality slider to balance file size and visual quality. Preview the result in real-time before downloading." },
      { stepNumber: 3, title: "Download Compressed File", description: "Download your optimized image — smaller file size, same great appearance. Compare before and after sizes instantly." },
    ],
    faqEntries: [
      { question: "Does compressing an image reduce its quality?", answer: "Compression reduces file size by removing redundant data. At quality settings above 70%, the visual difference is typically imperceptible to the human eye." },
      { question: "What image formats can I compress?", answer: "You can compress JPEG, PNG, and WebP images. For maximum compression, consider converting to WebP format which offers the best size-to-quality ratio." },
      { question: "Is there a file size limit for uploads?", answer: "You can upload images up to 20 MB. The tool processes everything in your browser, so larger files may take a moment longer." },
    ],
    relatedTools: [
      { slug: "/compress-jpeg", title: "Compress JPEG", description: "Specialized JPEG compression with quality control." },
      { slug: "/png-to-webp", title: "PNG to WebP", description: "Convert PNG to WebP for maximum compression." },
      { slug: "/resize", title: "Resize Image", description: "Resize images to exact dimensions or percentages." },
      { slug: "/", title: "Image Splitter", description: "Split images into multiple pieces with drag-and-drop lines." },
    ],
  },

  "compress-jpeg": {
    slug: "compress-jpeg",
    category: "use-case",
    seo: {
      title: "Compress JPEG Online — Reduce JPG File Size | ImgSplit",
      description: "Compress JPEG and JPG images online for free. Reduce file size with adjustable quality settings. Browser-based, private, no upload to servers.",
      ogTitle: "Compress JPEG Online — Reduce JPG File Size",
      ogDescription: "Reduce JPEG file size with adjustable quality. Free, private, browser-based.",
    },
    hero: {
      overline: "JPEG Compression",
      headlinePart1: "Compress",
      headlineAccent: "JPEG",
      headlinePart2: "— Reduce Size",
      description: "Reduce JPEG and JPG file sizes with fine-grained quality control. Perfect for photographers, bloggers, and web developers who need smaller files without visible quality loss.",
    },
    scenarios: [
      {
        icon: "Camera",
        title: "Photography Workflow",
        description: "Compress high-resolution JPEG photos from your camera for web galleries, client proofs, or social media — reduce 10 MB files to under 1 MB while keeping detail.",
      },
      {
        icon: "Globe",
        title: "Blog Images",
        description: "Optimize JPEG images for blog posts and articles. Faster loading means better reader engagement and improved search engine rankings.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your JPEG", description: "Drag and drop or select the JPEG/JPG file you want to compress." },
      { stepNumber: 2, title: "Set Quality Level", description: "Adjust the quality slider — lower values mean smaller files. Preview the output to find the sweet spot between size and quality." },
      { stepNumber: 3, title: "Download Compressed JPEG", description: "Save your compressed JPEG. The tool shows you exactly how much file size was saved." },
    ],
    faqEntries: [
      { question: "What is a good quality setting for JPEG compression?", answer: "For web use, 75-85% quality offers an excellent balance — typically 60-80% file size reduction with minimal visible difference. For print, keep quality at 90% or above." },
      { question: "Can I compress a JPEG multiple times?", answer: "You can, but each re-compression introduces slight artifacts. For best results, always compress from the original file rather than re-compressing a previously compressed JPEG." },
      { question: "What is the difference between JPEG and JPG?", answer: "There is no difference — JPG and JPEG refer to the same format. The shorter '.jpg' extension became common on Windows, which originally limited extensions to 3 characters." },
    ],
    relatedTools: [
      { slug: "/compress-image", title: "Compress Image", description: "General-purpose image compression for any format." },
      { slug: "/jpg-to-webp", title: "JPG to WebP", description: "Convert JPEG to WebP for even smaller file sizes." },
      { slug: "/reduce-image-size", title: "Reduce Image Size", description: "Optimize any image for minimal file size." },
    ],
  },

  "compress-png": {
    slug: "compress-png",
    category: "use-case",
    seo: {
      title: "Compress PNG Online — Reduce PNG File Size | ImgSplit",
      description: "Compress PNG images online while preserving transparency. Reduce file size with lossless or lossy compression. Free, browser-based, no upload to servers.",
      ogTitle: "Compress PNG Online — Reduce PNG File Size",
      ogDescription: "Reduce PNG file size while keeping transparency. Free, private, browser-based.",
    },
    hero: {
      overline: "PNG Compression",
      headlinePart1: "Compress",
      headlineAccent: "PNG",
      headlinePart2: "— Keep Transparency",
      description: "Reduce PNG file sizes while preserving full transparency support. Ideal for UI screenshots, design assets, and graphics that need alpha channels.",
    },
    scenarios: [
      {
        icon: "Smartphone",
        title: "UI Screenshots",
        description: "Compress PNG screenshots from design tools and screen captures. Reduce file size for faster loading in documentation, bug reports, and design reviews.",
      },
      {
        icon: "Layers",
        title: "Design Assets",
        description: "Optimize PNG design assets — icons, logos, and UI elements — for web and app development while preserving crisp edges and transparency.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your PNG", description: "Drag and drop or select the PNG file you want to compress. Transparency is fully preserved." },
      { stepNumber: 2, title: "Optimize PNG", description: "Keep PNG output selected. ImgSplit re-encodes the image losslessly and keeps the original file whenever re-encoding would make it larger." },
      { stepNumber: 3, title: "Download Optimized PNG", description: "Save your compressed PNG. Transparency, color depth, and visual quality are maintained." },
    ],
    faqEntries: [
      { question: "Will compression remove my PNG's transparency?", answer: "No. The compression process preserves the alpha channel completely. Your transparent backgrounds remain intact." },
      { question: "Why are PNG files so large compared to JPEG?", answer: "PNG uses lossless compression which preserves every pixel exactly, plus it stores transparency data. For photos without transparency, converting to JPEG or WebP yields much smaller files." },
      { question: "Should I convert my PNG to WebP instead of compressing?", answer: "If you need maximum size reduction and your platform supports WebP, converting to WebP can reduce file size by 50-80% compared to optimized PNG while still supporting transparency." },
    ],
    relatedTools: [
      { slug: "/png-to-webp", title: "PNG to WebP", description: "Convert PNG to WebP for dramatically smaller files with transparency." },
      { slug: "/png-to-jpg", title: "PNG to JPG", description: "Convert PNG to JPEG for smaller files when transparency is not needed." },
      { slug: "/compress-image", title: "Compress Image", description: "General-purpose image compression for any format." },
    ],
  },

  "png-to-webp": {
    slug: "png-to-webp",
    category: "use-case",
    seo: {
      title: "Convert PNG to WebP Online — Free & Fast | ImgSplit",
      description: "Convert PNG images to WebP format for dramatically smaller files. Preserves transparency. Free browser-based converter, no upload to servers.",
      ogTitle: "Convert PNG to WebP — Free Online Converter",
      ogDescription: "Convert PNG to WebP for smaller files with transparency. Free and browser-based.",
    },
    hero: {
      overline: "PNG to WebP Converter",
      headlinePart1: "Convert PNG to",
      headlineAccent: "WebP",
      headlinePart2: "— Smaller Files",
      description: "Transform PNG images into WebP format for up to 80% smaller files while preserving transparency. The modern image format for faster websites and apps.",
    },
    scenarios: [
      {
        icon: "Zap",
        title: "Website Performance",
        description: "Switch your site's PNG assets to WebP — pages load faster, bandwidth drops, and Core Web Vitals improve. Most browsers support WebP natively.",
      },
      {
        icon: "Smartphone",
        title: "App Assets",
        description: "Convert app icons, UI elements, and graphics from PNG to WebP. Smaller assets mean faster app installs, quicker loading, and less storage usage.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your PNG", description: "Drag and drop or select the PNG image you want to convert to WebP format." },
      { stepNumber: 2, title: "Configure Output", description: "Adjust quality settings for the WebP output. Higher quality means larger files — preview to find the right balance." },
      { stepNumber: 3, title: "Download WebP File", description: "Save your converted WebP image. Compare file sizes to see the dramatic reduction." },
    ],
    faqEntries: [
      { question: "Does WebP support transparency like PNG?", answer: "Yes. WebP fully supports alpha transparency, making it an excellent replacement for PNG in most use cases — with significantly smaller file sizes." },
      { question: "Which browsers support WebP?", answer: "All modern browsers support WebP: Chrome, Firefox, Safari, Edge, and Opera. Only Internet Explorer and very old browser versions lack support." },
      { question: "How much smaller is WebP compared to PNG?", answer: "WebP files are typically 50-80% smaller than equivalent PNG files. The exact savings depend on image content, but the reduction is consistently dramatic." },
    ],
    relatedTools: [
      { slug: "/png-to-jpg", title: "PNG to JPG", description: "Convert PNG to JPEG when transparency is not needed." },
      { slug: "/jpg-to-webp", title: "JPG to WebP", description: "Convert JPEG images to the modern WebP format." },
      { slug: "/compress-png", title: "Compress PNG", description: "Reduce PNG file size while keeping the PNG format." },
    ],
  },

  "png-to-jpg": {
    slug: "png-to-jpg",
    category: "use-case",
    seo: {
      title: "Convert PNG to JPG Online — Free Converter | ImgSplit",
      description: "Convert PNG images to JPG format online for free. Remove transparency and reduce file size. Browser-based, private, no upload to servers.",
      ogTitle: "Convert PNG to JPG — Free Online Converter",
      ogDescription: "Convert PNG to JPG to remove transparency and reduce file size. Free and browser-based.",
    },
    hero: {
      overline: "PNG to JPG Converter",
      headlinePart1: "Convert PNG to",
      headlineAccent: "JPG",
      headlinePart2: "— Remove Transparency",
      description: "Convert PNG images to JPG format for smaller file sizes and universal compatibility. Transparent areas are filled with a solid background color of your choice.",
    },
    scenarios: [
      {
        icon: "Globe",
        title: "Social Media Posting",
        description: "Convert PNG screenshots and graphics to JPG for social media platforms that compress PNG uploads heavily. Upload a clean JPG for predictable quality.",
      },
      {
        icon: "Mail",
        title: "Document Sharing",
        description: "Convert PNG graphics to JPG for email attachments, presentations, and documents. JPG files are smaller and universally viewable on any device.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your PNG", description: "Drag and drop or select the PNG file you want to convert to JPG format." },
      { stepNumber: 2, title: "Set Background & Quality", description: "Choose a background color for transparent areas (default: white) and set the JPEG quality level." },
      { stepNumber: 3, title: "Download JPG File", description: "Save your converted JPG image. Transparent areas are replaced with the chosen background color." },
    ],
    faqEntries: [
      { question: "What happens to the transparent areas in my PNG?", answer: "Transparent areas are filled with a solid background color — white by default. You can choose any color before converting." },
      { question: "Will the image quality change when converting PNG to JPG?", answer: "JPEG uses lossy compression, so there may be slight quality differences at lower settings. At 90%+ quality, the difference is virtually invisible." },
      { question: "When should I keep PNG instead of converting to JPG?", answer: "Keep PNG when you need transparency, pixel-perfect precision for text or line art, or lossless quality. Convert to JPG for photographs or when you need smaller file sizes." },
    ],
    relatedTools: [
      { slug: "/png-to-webp", title: "PNG to WebP", description: "Convert PNG to WebP for modern browsers with even smaller files." },
      { slug: "/compress-jpeg", title: "Compress JPEG", description: "Further reduce your JPEG file size after conversion." },
      { slug: "/jpg-to-png", title: "JPG to PNG", description: "Convert JPG back to PNG when you need lossless quality." },
    ],
  },

  "jpg-to-png": {
    slug: "jpg-to-png",
    category: "use-case",
    seo: {
      title: "Convert JPG to PNG Online — Free Converter | ImgSplit",
      description: "Convert JPG and JPEG images to PNG format for lossless quality and design edits. Free browser-based converter with no upload to servers.",
      ogTitle: "Convert JPG to PNG — Free Online Converter",
      ogDescription: "Convert JPEG to PNG for lossless quality. Free, private, browser-based.",
    },
    hero: {
      overline: "JPG to PNG Converter",
      headlinePart1: "Convert JPG to",
      headlineAccent: "PNG",
      headlinePart2: "— Lossless Quality",
      description: "Convert JPEG images to PNG format for lossless quality and transparency support. Ideal for design work, editing, and any workflow that requires pixel-perfect output.",
    },
    scenarios: [
      {
        icon: "Layers",
        title: "Design Work",
        description: "Convert photos to PNG for use in design projects — layer compositions, overlays, and mockups work best with PNG's lossless quality and transparency support.",
      },
      {
        icon: "Shield",
        title: "Transparency Needs",
        description: "Need to add transparency to a photo? Convert to PNG first, then edit the alpha channel in your design tool for clean cutouts and overlays.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your JPG", description: "Drag and drop or select the JPG/JPEG file you want to convert to PNG format." },
      { stepNumber: 2, title: "Preview the Result", description: "Review the PNG preview. The conversion preserves all visual content from the original JPEG at full quality." },
      { stepNumber: 3, title: "Download PNG File", description: "Save your lossless PNG image. The file will be larger than the original JPEG but with zero additional compression artifacts." },
    ],
    faqEntries: [
      { question: "Does converting JPG to PNG improve image quality?", answer: "Converting to PNG prevents further quality loss but cannot restore detail lost during the original JPEG compression. The converted PNG preserves the JPEG's current state perfectly." },
      { question: "Why is the PNG file larger than the original JPG?", answer: "PNG uses lossless compression which preserves every pixel exactly, resulting in larger files. JPEG uses lossy compression that discards some data to achieve smaller sizes." },
      { question: "Can I add transparency after converting to PNG?", answer: "Yes. Once in PNG format, you can edit the alpha channel in any design tool (Photoshop, GIMP, Figma) to add transparency — something not possible with JPEG." },
    ],
    relatedTools: [
      { slug: "/jpg-to-webp", title: "JPG to WebP", description: "Convert JPEG to WebP for smaller files with modern compression." },
      { slug: "/compress-png", title: "Compress PNG", description: "Reduce the PNG file size after conversion." },
      { slug: "/png-to-jpg", title: "PNG to JPG", description: "Convert back to JPG when you need smaller files." },
    ],
  },

  "jpg-to-webp": {
    slug: "jpg-to-webp",
    category: "use-case",
    seo: {
      title: "Convert JPG to WebP Online — Modern Format | ImgSplit",
      description: "Convert JPG and JPEG images to WebP format for maximum compression. Up to 80% smaller files. Free browser-based converter, no upload to servers.",
      ogTitle: "Convert JPG to WebP — Modern Format Converter",
      ogDescription: "Convert JPEG to WebP for up to 80% smaller files. Free, private, browser-based.",
    },
    hero: {
      overline: "JPG to WebP Converter",
      headlinePart1: "Convert JPG to",
      headlineAccent: "WebP",
      headlinePart2: "— Maximum Compression",
      description: "Transform JPEG images into the modern WebP format for dramatically smaller files. Up to 80% size reduction with comparable visual quality — the smart choice for web performance.",
    },
    scenarios: [
      {
        icon: "RefreshCw",
        title: "Website Migration",
        description: "Batch-convert your site's JPEG images to WebP during a performance overhaul. Faster page loads, lower hosting costs, and better Google PageSpeed scores.",
      },
      {
        icon: "Zap",
        title: "Performance Optimization",
        description: "Replace heavy JPEG hero images and product photos with WebP versions. Your visitors get the same visual experience with fraction of the download time.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your JPG", description: "Drag and drop or select the JPEG file you want to convert to WebP." },
      { stepNumber: 2, title: "Adjust WebP Quality", description: "Fine-tune the quality setting. Even at 80% quality, WebP files are dramatically smaller than the equivalent JPEG." },
      { stepNumber: 3, title: "Download WebP File", description: "Save your WebP image and compare the file size savings. Most users see 50-80% reduction." },
    ],
    faqEntries: [
      { question: "How much smaller is WebP compared to JPEG?", answer: "WebP is typically 25-34% smaller than JPEG at equivalent visual quality (according to Google's studies). For many images, the savings reach 50% or more." },
      { question: "Is WebP supported everywhere?", answer: "Yes, all modern browsers (Chrome, Firefox, Safari 14+, Edge) support WebP. For the rare legacy browser, serve JPEG as a fallback using the HTML <picture> element." },
      { question: "Does converting from JPEG to WebP lose quality?", answer: "Both JPEG and WebP are lossy formats, so re-encoding introduces minimal additional artifacts. For best results, convert from the highest quality JPEG source you have." },
    ],
    relatedTools: [
      { slug: "/png-to-webp", title: "PNG to WebP", description: "Convert PNG images to WebP with transparency support." },
      { slug: "/compress-jpeg", title: "Compress JPEG", description: "Reduce JPEG file size while keeping the JPEG format." },
      { slug: "/jpg-to-png", title: "JPG to PNG", description: "Convert JPEG to lossless PNG format." },
    ],
  },

  "webp-to-png": {
    slug: "webp-to-png",
    category: "use-case",
    seo: {
      title: "Convert WebP to PNG Online — Free Converter | ImgSplit",
      description: "Convert WebP images to PNG format for universal compatibility. Preserves transparency. Free browser-based converter, no upload to servers.",
      ogTitle: "Convert WebP to PNG — Free Online Converter",
      ogDescription: "Convert WebP to PNG for universal compatibility. Free, private, browser-based.",
    },
    hero: {
      overline: "WebP to PNG Converter",
      headlinePart1: "Convert WebP to",
      headlineAccent: "PNG",
      headlinePart2: "— Universal Format",
      description: "Convert WebP images to PNG for maximum compatibility with older software, print workflows, and design tools that don't yet support WebP.",
    },
    scenarios: [
      {
        icon: "ArrowRightLeft",
        title: "Compatibility Needs",
        description: "Downloaded a WebP image but your software doesn't support it? Convert to PNG for instant compatibility with Photoshop, PowerPoint, Word, and every other tool.",
      },
      {
        icon: "Image",
        title: "Editing in Legacy Tools",
        description: "Older image editors and design tools may not open WebP files. Convert to PNG first, make your edits, then convert back if needed.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your WebP", description: "Drag and drop or select the WebP image you want to convert to PNG format." },
      { stepNumber: 2, title: "Preview the Conversion", description: "Review the PNG preview. All visual content and transparency from the WebP file is preserved perfectly." },
      { stepNumber: 3, title: "Download PNG File", description: "Save your PNG image — now compatible with virtually every image viewer, editor, and platform." },
    ],
    faqEntries: [
      { question: "Will I lose quality converting WebP to PNG?", answer: "No quality is lost in the conversion. PNG is a lossless format, so every pixel from the WebP source is preserved exactly. The file size will be larger because PNG doesn't compress as aggressively." },
      { question: "Is transparency preserved when converting WebP to PNG?", answer: "Yes. Both WebP and PNG support alpha transparency. Any transparent areas in your WebP image are perfectly preserved in the PNG output." },
      { question: "Why would I convert WebP to PNG instead of JPG?", answer: "Choose PNG when you need transparency support or lossless quality. Choose JPG if you want the smallest file size and don't need transparency." },
    ],
    relatedTools: [
      { slug: "/webp-to-jpg", title: "WebP to JPG", description: "Convert WebP to JPG for smaller files without transparency." },
      { slug: "/compress-png", title: "Compress PNG", description: "Reduce PNG file size after conversion." },
      { slug: "/png-to-webp", title: "PNG to WebP", description: "Convert back to WebP when you need smaller files." },
    ],
  },

  "webp-to-jpg": {
    slug: "webp-to-jpg",
    category: "use-case",
    seo: {
      title: "Convert WebP to JPG Online — Free Converter | ImgSplit",
      description: "Convert WebP images to JPG format for maximum compatibility with apps, websites, and sharing. Free browser-based converter with no upload.",
      ogTitle: "Convert WebP to JPG — Free Online Converter",
      ogDescription: "Convert WebP to JPG for maximum compatibility. Free, private, browser-based.",
    },
    hero: {
      overline: "WebP to JPG Converter",
      headlinePart1: "Convert WebP to",
      headlineAccent: "JPG",
      headlinePart2: "— Maximum Compatibility",
      description: "Convert WebP images to the universally supported JPG format. Perfect for sharing, printing, and use with any software or platform — no compatibility worries.",
    },
    scenarios: [
      {
        icon: "Mail",
        title: "Sharing with Others",
        description: "Not everyone's device handles WebP. Convert to JPG before sharing via email, messaging apps, or file transfers to ensure everyone can open your images.",
      },
      {
        icon: "FileDown",
        title: "Print Preparation",
        description: "Most print shops and print-on-demand services expect JPG files. Convert WebP images to JPG for hassle-free printing with predictable color output.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your WebP", description: "Drag and drop or select the WebP image you want to convert to JPG format." },
      { stepNumber: 2, title: "Set JPG Quality", description: "Adjust the quality slider. Transparent areas are filled with a background color of your choice (default: white)." },
      { stepNumber: 3, title: "Download JPG File", description: "Save your JPG image — ready for sharing, printing, or use in any application." },
    ],
    faqEntries: [
      { question: "What happens to transparency when converting WebP to JPG?", answer: "JPG does not support transparency. Any transparent areas in your WebP image are filled with a solid background color — white by default. You can choose a different color before converting." },
      { question: "Is JPG the most compatible image format?", answer: "Yes. JPG/JPEG is supported by virtually every device, browser, email client, and software application in existence. It's the safest choice when compatibility is your priority." },
      { question: "Will the file size increase when converting WebP to JPG?", answer: "Typically yes, since WebP offers better compression than JPG. However, you can adjust the JPG quality setting to find the right balance between file size and visual quality." },
    ],
    relatedTools: [
      { slug: "/webp-to-png", title: "WebP to PNG", description: "Convert WebP to PNG when you need transparency and lossless quality." },
      { slug: "/compress-jpeg", title: "Compress JPEG", description: "Further reduce your JPEG file size after conversion." },
      { slug: "/jpg-to-webp", title: "JPG to WebP", description: "Convert back to WebP when you need smaller files." },
    ],
  },

  "reduce-image-size": {
    slug: "reduce-image-size",
    category: "use-case",
    seo: {
      title: "Reduce Image Size Online — Free File Optimizer | ImgSplit",
      description: "Reduce image file size online for free. Optimize JPEG, PNG, and WebP images for web, email, and storage. Browser-based, private, no upload to servers.",
      ogTitle: "Reduce Image Size — Free Online Optimizer",
      ogDescription: "Optimize and reduce image file size instantly. Free, private, browser-based.",
    },
    hero: {
      overline: "Image Size Reducer",
      headlinePart1: "Reduce Image",
      headlineAccent: "Size",
      headlinePart2: "— Instant Optimization",
      description: "Optimize any image for the smallest possible file size. Intelligent compression for JPEG, PNG, and WebP — perfect for faster websites, smaller storage, and quicker uploads.",
    },
    scenarios: [
      {
        icon: "Zap",
        title: "Website Speed",
        description: "Large images are the #1 cause of slow websites. Reduce image sizes to dramatically improve page load times, bounce rates, and search engine rankings.",
      },
      {
        icon: "FileDown",
        title: "Storage Optimization",
        description: "Running low on cloud storage or device space? Reduce image sizes across your photo library to free up gigabytes without deleting any images.",
      },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your Image", description: "Drag and drop or select any JPEG, PNG, or WebP image you want to make smaller." },
      { stepNumber: 2, title: "Optimize Settings", description: "Adjust compression quality and optionally change the output format. WebP typically offers the best size reduction." },
      { stepNumber: 3, title: "Download Optimized Image", description: "Save your smaller image file. The tool shows the exact bytes saved and percentage reduction." },
    ],
    faqEntries: [
      { question: "What is the best way to reduce image file size?", answer: "Three strategies work best: compress with quality adjustment (fastest), convert to WebP format (most effective), or resize to smaller dimensions (most aggressive). Combining all three yields the smallest files." },
      { question: "How much can I reduce an image's file size?", answer: "Typical reductions range from 40-80% depending on the source image and settings. Converting a 5 MB JPEG to a quality-80 WebP can easily produce a 500 KB file." },
      { question: "Will reducing file size affect print quality?", answer: "For web and screen use, a well-compressed image looks identical to the original. For professional printing, keep quality above 90% and avoid excessive compression." },
    ],
    relatedTools: [
      { slug: "/compress-image", title: "Compress Image", description: "General-purpose image compression with format options." },
      { slug: "/compress-jpeg", title: "Compress JPEG", description: "Specialized compression for JPEG photos." },
      { slug: "/png-to-webp", title: "PNG to WebP", description: "Convert to WebP for the best compression ratio." },
    ],
  },

  "crop-image": {
    slug: "crop-image",
    category: "use-case",
    seo: { title: "Crop Image Online — Free Social Crop Tool | ImgSplit", description: "Crop images online to exact social media sizes for Instagram, YouTube, Facebook, and more. Free private browser-based cropping with no upload.", ogTitle: "Crop Image Online — Free Social Crop Tool", ogDescription: "Crop photos to social media sizes in your browser." },
    hero: { overline: "Image Crop Tool", headlinePart1: "Crop Images", headlineAccent: "Online", headlinePart2: "— Exact Sizes", description: "Resize and crop any image to precise social media dimensions. Pick a preset, position the photo, apply the crop, and export without uploading your file." },
    scenarios: [
      { icon: "Crop", title: "Exact Aspect Ratios", description: "Lock the crop to square, vertical, or widescreen ratios before you export." },
      { icon: "Smartphone", title: "Social Media Ready", description: "Use presets for Instagram posts, stories, YouTube thumbnails, and Facebook covers." },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your Image", description: "Open Resize and add your PNG, JPEG, or WebP image." },
      { stepNumber: 2, title: "Choose a Preset", description: "Select a social size preset, then use Crop to fine-tune the visible area." },
      { stepNumber: 3, title: "Download", description: "Apply the crop and download the final image as PNG, JPEG, or WebP." },
    ],
    faqEntries: [
      { question: "Is this a separate crop editor?", answer: "No. It is the Resize editor with focused social presets and crop controls." },
      { question: "Will my image be uploaded?", answer: "No. Cropping runs in your browser. Your image stays on your device." },
      { question: "Can I use custom sizes?", answer: "Yes. You can change the canvas dimensions and crop ratio manually." },
    ],
    relatedTools: [
      { slug: "/resize", title: "Image Resizer", description: "Set exact dimensions, position images, and export." },
      { slug: "/crop-for-instagram", title: "Crop for Instagram", description: "Crop square Instagram posts quickly." },
      { slug: "/youtube-thumbnail-crop", title: "YouTube Thumbnail Crop", description: "Crop images to 16:9 thumbnail size." },
    ],
  },

  "crop-for-instagram": {
    slug: "crop-for-instagram",
    category: "use-case",
    seo: { title: "Crop Image for Instagram — Free 1:1 Post Cropper | ImgSplit", description: "Crop images to Instagram post size online with a 1080 x 1080 square preset for posts, private browser-based editing, and no upload to servers.", ogTitle: "Crop Image for Instagram — Free Online Tool", ogDescription: "Make square Instagram posts without uploading your photo." },
    hero: { overline: "Instagram Crop Tool", headlinePart1: "Crop for", headlineAccent: "Instagram", headlinePart2: "— 1:1 Posts", description: "Create clean 1080 x 1080 Instagram post crops from any image. Keep the important subject centered and export a platform-ready square." },
    scenarios: [
      { icon: "Crop", title: "Square Feed Posts", description: "Turn portrait or landscape photos into clean 1:1 Instagram posts." },
      { icon: "Smartphone", title: "Mobile Sharing", description: "Prepare images for Instagram from any browser before sending them to your phone or scheduler." },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your Photo", description: "Start from the Instagram square preset and add your image." },
      { stepNumber: 2, title: "Position the Crop", description: "Drag the image or crop box until the subject fits the square frame." },
      { stepNumber: 3, title: "Download", description: "Apply the crop and save the finished Instagram-size image." },
    ],
    faqEntries: [
      { question: "What size does this preset use?", answer: "The Instagram square preset uses 1080 x 1080 pixels with a 1:1 crop ratio." },
      { question: "Can I crop vertical Instagram content?", answer: "Use the Story preset for 9:16 vertical content or set custom dimensions in Resize." },
      { question: "Does the crop reduce quality?", answer: "The tool exports from the canvas size you choose. For Instagram posts, 1080 x 1080 is the intended output size." },
    ],
    relatedTools: [
      { slug: "/instagram-story-crop", title: "Instagram Story Crop", description: "Crop vertical 9:16 story images." },
      { slug: "/resize", title: "Image Resizer", description: "Resize and crop to any dimensions." },
      { slug: "/compress-image", title: "Compress Image", description: "Reduce the final image size before sharing." },
    ],
  },

  "instagram-story-crop": {
    slug: "instagram-story-crop",
    category: "use-case",
    seo: { title: "Instagram Story Crop — Free 9:16 Image Cropper | ImgSplit", description: "Crop images to Instagram Story size online with a 1080 x 1920 vertical preset. Private browser-based editing keeps photos local for export.", ogTitle: "Instagram Story Crop — Free 9:16 Cropper", ogDescription: "Crop vertical stories in your browser with a 1080 x 1920 preset." },
    hero: { overline: "Instagram Story Crop", headlinePart1: "Crop Instagram", headlineAccent: "Stories", headlinePart2: "— 9:16 Vertical", description: "Prepare full-screen Instagram stories with a 1080 x 1920 crop preset. Reposition the image, apply the crop, and export privately." },
    scenarios: [
      { icon: "Smartphone", title: "Full-Screen Stories", description: "Convert wide or square images into vertical story assets without stretching." },
      { icon: "Crop", title: "Subject Control", description: "Move the crop area so faces, products, or text stay inside the visible story frame." },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Open the Story Preset", description: "Use the 1080 x 1920 Instagram Story preset in Resize." },
      { stepNumber: 2, title: "Adjust the Crop", description: "Drag corners or reposition the image to keep the key content visible." },
      { stepNumber: 3, title: "Export the Story", description: "Download the vertical image for Instagram, Reels covers, or other 9:16 placements." },
    ],
    faqEntries: [
      { question: "What is the Instagram Story crop size?", answer: "The preset uses 1080 x 1920 pixels, a 9:16 vertical ratio." },
      { question: "Can I use this for TikTok or Reels?", answer: "Yes. The 9:16 output also works well for many short-video and vertical social placements." },
      { question: "Can I keep the full image instead of cropping?", answer: "Use Fit mode if you want the full image visible with empty space instead of filling the frame." },
    ],
    relatedTools: [
      { slug: "/crop-for-instagram", title: "Crop for Instagram", description: "Make square Instagram post crops." },
      { slug: "/resize", title: "Image Resizer", description: "Resize and crop with custom dimensions." },
      { slug: "/jpg-to-webp", title: "JPG to WebP", description: "Convert finished assets to WebP." },
    ],
  },

  "youtube-thumbnail-crop": {
    slug: "youtube-thumbnail-crop",
    category: "use-case",
    seo: { title: "YouTube Thumbnail Crop — Free 1280x720 Cropper | ImgSplit", description: "Crop images to YouTube thumbnail size online with a 1280 x 720 16:9 preset, browser-based preview, and no upload required for fast export.", ogTitle: "YouTube Thumbnail Crop — Free 16:9 Cropper", ogDescription: "Crop thumbnail images to 1280 x 720 in your browser." },
    hero: { overline: "YouTube Thumbnail Crop", headlinePart1: "Crop YouTube", headlineAccent: "Thumbnails", headlinePart2: "— 16:9", description: "Create 1280 x 720 YouTube thumbnail crops from any image. Use the 16:9 preset, place your subject, and export a ready-to-upload thumbnail." },
    scenarios: [
      { icon: "Youtube", title: "Thumbnail Prep", description: "Crop photos, screenshots, or artwork to the YouTube-recommended 1280 x 720 size." },
      { icon: "Crop", title: "Composition Control", description: "Keep faces, products, and title areas inside the safe thumbnail frame." },
    ],
    howToSteps: [
      { stepNumber: 1, title: "Upload Your Image", description: "Open the YouTube thumbnail preset and add your source image." },
      { stepNumber: 2, title: "Frame the Thumbnail", description: "Use the 16:9 crop box to choose the most clickable composition." },
      { stepNumber: 3, title: "Download", description: "Export the final 1280 x 720 thumbnail as PNG, JPEG, or WebP." },
    ],
    faqEntries: [
      { question: "What size is the YouTube thumbnail preset?", answer: "The preset uses 1280 x 720 pixels with a 16:9 aspect ratio." },
      { question: "Can I export JPG for YouTube?", answer: "Yes. Use the download menu to export JPEG, PNG, or WebP." },
      { question: "Does this add text to thumbnails?", answer: "No. This focuses on cropping and resizing. Add text in your design tool, then use ImgSplit to crop/export the final image." },
    ],
    relatedTools: [
      { slug: "/resize", title: "Image Resizer", description: "Resize images to any canvas size." },
      { slug: "/compress-jpeg", title: "Compress JPEG", description: "Shrink finished thumbnails." },
      { slug: "/crop-image", title: "Crop Image", description: "General online crop tool." },
    ],
  },

}

export default data
