# ImgSplit — Free Online Image Splitter

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ZooHero500/online-image-segmentation)

**[imgsplit.com](https://imgsplit.com)** — Split, crop, and grid-divide images with pixel-perfect precision. 100% browser-based, no upload needed.

## Features

- **Drag-and-drop split lines** — Add up to 20 horizontal + 20 vertical lines with snap alignment
- **Grid splitting** — Pre-configured 3×3, 1×3, 2×2 grids for social media
- **AI segmentation** — Automatically detect and segment image elements
- **Privacy-first** — All processing in-browser via Canvas API, images never uploaded
- **Multi-format** — PNG, JPG/JPEG, WebP up to 20MB
- **One-click download** — ZIP archive or individual pieces
- **Multilingual** — English, 中文, 日本語, 한국어, Español
- **Responsive** — Works on desktop, tablet, and mobile

## Demo

Visit **[imgsplit.com](https://imgsplit.com)** to try it instantly — no signup required.

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router, Server Components
- [React 19](https://react.dev/) — UI framework
- [Tailwind CSS 4](https://tailwindcss.com/) — Styling
- [Konva.js](https://konvajs.org/) — Canvas-based image editor
- [next-intl](https://next-intl.dev/) — Internationalization
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Vercel](https://vercel.com/) — Hosting & deployment

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- Node.js 20+

### Installation

```bash
# Clone the repository
git clone https://github.com/ZooHero500/online-image-segmentation.git
cd online-image-segmentation

# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
bun run build
bun run start
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # i18n routes
│   │   ├── page.tsx        # Homepage (image splitter)
│   │   ├── grid/           # Grid splitter tool
│   │   ├── tools/          # All tools directory
│   │   ├── about/          # About page
│   │   ├── privacy/        # Privacy policy
│   │   ├── terms/          # Terms of service
│   │   ├── workspace/      # Split editor workspace
│   │   └── [toolSlug]/     # pSEO tool pages
│   ├── api/                # API routes (AI features)
│   ├── robots.ts           # robots.txt
│   └── sitemap.ts          # XML sitemap
├── components/             # React components
├── hooks/                  # Custom React hooks
├── i18n/                   # Internationalization config
├── lib/                    # Utilities & business logic
│   └── pseo/               # Programmatic SEO data
├── messages/               # Translation files (en, zh-CN, ja, ko, es)
└── types/                  # TypeScript types
```

## Tools

| Tool | URL | Description |
|------|-----|-------------|
| Image Splitter | [/](https://imgsplit.com) | Custom split lines with drag & drop |
| Grid Splitter | [/grid](https://imgsplit.com/grid) | 3×3, 1×3, 2×2 social media grids |
| Split in Half | [/split-in-half](https://imgsplit.com/split-in-half) | Divide into two equal parts |
| Horizontal Split | [/split-horizontally](https://imgsplit.com/split-horizontally) | Cut into horizontal rows |
| Vertical Split | [/split-vertically](https://imgsplit.com/split-vertically) | Cut into vertical columns |
| Equal Parts | [/split-into-equal-parts](https://imgsplit.com/split-into-equal-parts) | Divide into N equal segments |
| Long Screenshot | [/split-long-screenshot](https://imgsplit.com/split-long-screenshot) | Break tall screenshots into pages |
| Instagram | [/split-for-instagram](https://imgsplit.com/split-for-instagram) | Instagram-optimized grid splits |
| Print | [/split-for-print](https://imgsplit.com/split-for-print) | Tile images for large-format printing |
| No-Photoshop | [/no-photoshop-slicer](https://imgsplit.com/no-photoshop-slicer) | Free Photoshop slice alternative |

## Privacy

ImgSplit processes all images locally in your browser using the HTML5 Canvas API. **No images are ever uploaded to any server.** See our [Privacy Policy](https://imgsplit.com/privacy) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License — see [LICENSE](LICENSE) for details.

## Author

**ZooHero** — [GitHub](https://github.com/ZooHero500) · [Twitter](https://x.com/zooheroes)
