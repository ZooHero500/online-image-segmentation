import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "ImageSplit - 精准图片分割工具",
  description:
    "免费在线图片分割工具，支持拖拽分割线、磁吸对齐、一键生成并下载所有子图片。纯浏览器端处理，保护您的隐私。",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased`}
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
        <div className="noise-overlay" aria-hidden="true" />
      </body>
    </html>
  )
}
