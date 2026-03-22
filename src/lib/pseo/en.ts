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
          description: "Split images for Instagram carousel posts and profile grid layouts. Optimized for 1080 × 1080 px. Free, browser-based, no watermarks.",
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

}

export default data
