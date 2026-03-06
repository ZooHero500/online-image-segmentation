"use client"

import { useState } from "react"
import { LandingContent } from "./LandingContent"
import {
  Scissors,
  Shield,
  Download,
  Zap,
  Image,
  Grid3X3,
  MousePointerClick,
  Layers,
  ArrowRight,
  CheckCircle2,
  Plus,
} from "lucide-react"
import type React from "react"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F9F8F6] relative">
      {/* Visible Grid Lines */}
      <GridLines />

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-[#F9F8F6]/90 backdrop-blur-sm border-b border-[#1A1A1A]/10">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scissors className="h-4 w-4 text-[#1A1A1A]" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#1A1A1A]">
              ImageSplit
            </span>
          </div>
          <div className="flex items-center gap-8 text-xs">
            <a
              href="#features"
              className="hidden md:inline uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
            >
              功能
            </a>
            <a
              href="#how-it-works"
              className="hidden md:inline uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
            >
              使用说明
            </a>
            <a
              href="#faq"
              className="hidden md:inline uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
            >
              常见问题
            </a>
            <a
              href="#upload"
              className="group relative inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F9F8F6] px-6 py-2.5 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500"
            >
              <span className="absolute inset-0 bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
              <span className="relative z-10">开始使用</span>
              <ArrowRight className="relative z-10 h-3 w-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-24 md:py-32 px-8 md:px-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8 md:col-start-1">
            {/* Overline */}
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-8 md:w-12 bg-[#1A1A1A]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">
                在线图片分割工具
              </span>
            </div>

            {/* Hero headline with mixed italic */}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl leading-[0.9] tracking-tight mb-8">
              精准
              <em className="text-[#D4AF37] not-italic font-serif italic">分割</em>
              <br />
              图片
            </h1>

            <p className="text-base md:text-lg text-[#6C6863] leading-relaxed max-w-md mb-10">
              免费在线图片裁切工具，支持拖拽分割线、磁吸对齐、像素级精确裁切。纯浏览器端处理，您的图片永远不会离开您的设备。
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#upload"
                className="group relative inline-flex items-center justify-center gap-2 bg-[#1A1A1A] text-[#F9F8F6] px-10 py-4 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500"
              >
                <span className="absolute inset-0 bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
                <span className="relative z-10">立即免费使用</span>
                <ArrowRight className="relative z-10 h-3.5 w-3.5" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 border border-[#1A1A1A] text-[#1A1A1A] px-10 py-4 text-xs uppercase tracking-[0.2em] hover:bg-[#1A1A1A] hover:text-[#F9F8F6] transition-all duration-500"
              >
                了解使用方法
              </a>
            </div>
          </div>

          {/* Vertical decorative text */}
          <div className="hidden lg:flex col-span-2 col-start-11 items-end justify-end pb-4">
            <span className="writing-vertical text-[10px] uppercase tracking-[0.3em] text-[#6C6863]/50">
              Editorial / Vol. 01
            </span>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <section className="border-t border-[#1A1A1A]/10 py-16 md:py-20 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <TrustItem
            icon={<Shield className="h-4 w-4" strokeWidth={1.5} />}
            label="隐私零风险"
            desc="数据不离开浏览器"
          />
          <TrustItem
            icon={<Zap className="h-4 w-4" strokeWidth={1.5} />}
            label="秒级处理"
            desc="本地高速运算"
          />
          <TrustItem
            icon={<Image className="h-4 w-4" strokeWidth={1.5} />}
            label="无损质量"
            desc="原始分辨率输出"
          />
          <TrustItem
            icon={<Download className="h-4 w-4" strokeWidth={1.5} />}
            label="完全免费"
            desc="无限次使用"
          />
        </div>
      </section>

      {/* UPLOAD */}
      <section id="upload" className="px-8 md:px-16 pb-24 md:pb-32 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">
            开始创作
          </span>
        </div>
        <LandingContent />
      </section>

      {/* BENEFITS - Dark Section */}
      <section className="bg-[#1A1A1A] py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4 mb-16">
            <div className="col-span-12 md:col-span-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#F9F8F6]/40 mb-4 block">
                为什么选择我们
              </span>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.9] text-[#F9F8F6]">
                告别
                <em className="text-[#D4AF37] italic">繁琐</em>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-8 flex items-end">
              <p className="text-sm text-[#F9F8F6]/60 leading-relaxed">
                告别繁琐的图片编辑软件，用最简单的方式完成图片分割
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            <BenefitCard
              icon={<MousePointerClick className="h-4 w-4" strokeWidth={1.5} />}
              title="告别复杂的 PS 操作"
              description="无需安装 Photoshop 或学习复杂的切片工具，拖拽分割线即可精准裁切，新手也能轻松上手。"
            />
            <BenefitCard
              icon={<Shield className="h-4 w-4" strokeWidth={1.5} />}
              title="敏感图片也能放心处理"
              description="合同、证件、设计稿等敏感文件无需上传到第三方服务器，所有处理都在本地浏览器完成。"
            />
            <BenefitCard
              icon={<Grid3X3 className="h-4 w-4" strokeWidth={1.5} />}
              title="批量分割效率翻倍"
              description="一次添加多条横向和纵向分割线，自动生成网格，批量下载所有子图片，大幅节省时间。"
            />
            <BenefitCard
              icon={<Layers className="h-4 w-4" strokeWidth={1.5} />}
              title="所有设备随时可用"
              description="无需安装任何软件，打开浏览器即可使用，手机、平板、电脑全平台支持。"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4 mb-16">
            <div className="col-span-12 md:col-span-8 md:col-start-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-4 block">
                功能特点
              </span>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
                专业级
                <em className="text-[#D4AF37] italic">能力</em>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0">
            <FeatureCard
              icon={<Scissors className="h-4 w-4" strokeWidth={1.5} />}
              title="精确分割"
              description="拖拽分割线自由定位，支持磁吸对齐，精确到像素级别的图片裁切。"
            />
            <FeatureCard
              icon={<Shield className="h-4 w-4" strokeWidth={1.5} />}
              title="隐私安全"
              description="所有处理在浏览器本地完成，图片不会上传到任何服务器，保护您的隐私。"
            />
            <FeatureCard
              icon={<Download className="h-4 w-4" strokeWidth={1.5} />}
              title="一键下载"
              description="支持一键打包下载所有分割后的子图片，也可单独下载每张图片。"
            />
            <FeatureCard
              icon={<Grid3X3 className="h-4 w-4" strokeWidth={1.5} />}
              title="网格分割"
              description="同时添加横向和纵向分割线，快速创建规则网格，批量裁切更高效。"
            />
            <FeatureCard
              icon={<Image className="h-4 w-4" strokeWidth={1.5} />}
              title="多格式支持"
              description="支持 PNG、JPG/JPEG 和 WebP 格式，文件大小最高支持 20MB。"
            />
            <FeatureCard
              icon={<Zap className="h-4 w-4" strokeWidth={1.5} />}
              title="即时预览"
              description="实时预览分割效果，调整分割线位置后立即查看裁切区域变化。"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-[#1A1A1A]/10 py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-4 block">
              使用说明
            </span>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
              四步
              <em className="text-[#D4AF37] italic">完成</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-0">
            <StepCard
              step={1}
              title="上传图片"
              description="拖拽或点击上传您要分割的图片，支持 PNG、JPG、WebP 格式"
            />
            <StepCard
              step={2}
              title="添加分割线"
              description="添加横向或纵向分割线，拖拽调整位置，支持磁吸对齐"
            />
            <StepCard
              step={3}
              title="预览效果"
              description="实时预览每个分割区域，确认裁切效果满足需求"
            />
            <StepCard
              step={4}
              title="下载结果"
              description="一键打包下载所有子图片，或单独下载指定区域"
            />
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="bg-[#1A1A1A] py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4 mb-16">
            <div className="col-span-12 md:col-span-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#F9F8F6]/40 mb-4 block">
                应用场景
              </span>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.9] text-[#F9F8F6]">
                无限
                <em className="text-[#D4AF37] italic">可能</em>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0">
            <UseCaseCard
              title="电商运营"
              description="将长图商品详情页按模块分割，上传到不同的商品展示区域，提升页面加载速度。"
              result="页面加载速度提升 40%+"
            />
            <UseCaseCard
              title="UI 设计师"
              description="快速将设计稿切片导出，无需打开 Photoshop，直接在浏览器中完成切图交付。"
              result="切图效率提升 3 倍"
            />
            <UseCaseCard
              title="社交媒体"
              description="将全景图或长图分割成多张小图，制作九宫格拼图效果，提升社交平台发布质量。"
              result="发布体验更专业"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-8 md:px-16 border-t border-[#1A1A1A]/10">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7 md:col-start-2">
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.9] mb-6">
              立即
              <em className="text-[#D4AF37] italic">开始</em>
            </h2>
            <p className="text-sm text-[#6C6863] leading-relaxed max-w-md mb-10">
              无需注册，无需安装，打开浏览器即可免费使用。您的图片数据安全始终受到保护。
            </p>
            <a
              href="#upload"
              className="group relative inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F9F8F6] px-10 py-4 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500"
            >
              <span className="absolute inset-0 bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
              <span className="relative z-10">免费开始使用</span>
              <ArrowRight className="relative z-10 h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-[#1A1A1A]/10 py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-4 block">
                常见问题
              </span>
              <h2 className="font-serif text-4xl md:text-5xl leading-[0.9] mb-4">
                疑问
                <em className="text-[#D4AF37] italic">解答</em>
              </h2>
              <p className="text-sm text-[#6C6863] leading-relaxed">
                关于图片分割工具的常见疑问
              </p>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <div className="space-y-0">
                <FaqItem
                  question="支持哪些图片格式？"
                  answer="支持 PNG、JPG/JPEG 和 WebP 格式的图片，文件大小限制为 20MB。"
                />
                <FaqItem
                  question="分割后的图片质量会降低吗？"
                  answer="不会。工具以原始图片分辨率进行裁切，不压缩不缩放，保持原始画质。"
                />
                <FaqItem
                  question="我的图片数据安全吗？"
                  answer="完全安全。所有图片处理都在您的浏览器本地完成，不会将任何图片数据上传到服务器。关闭页面后，所有数据自动清除。"
                />
                <FaqItem
                  question="可以同时添加多少条分割线？"
                  answer="横向和纵向各最多支持 20 条分割线，可以创建非常精细的网格分割。"
                />
                <FaqItem
                  question="需要注册账号吗？"
                  answer="不需要。无需注册、无需登录，打开网页即可直接使用，完全免费。"
                />
                <FaqItem
                  question="支持手机端使用吗？"
                  answer="支持。工具采用响应式设计，在手机和平板上也可以正常使用。"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1A1A1A]/10 py-12 md:py-16 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Scissors className="h-3.5 w-3.5 text-[#1A1A1A]" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-[0.3em] font-medium">
              ImageSplit
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#6C6863]">
            在线图片分割工具 &mdash; 免费 &middot; 安全 &middot; 高效
          </p>
          <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-[#6C6863]">
            <a
              href="#features"
              className="hover:text-[#D4AF37] transition-colors duration-500"
            >
              功能
            </a>
            <a
              href="#how-it-works"
              className="hover:text-[#D4AF37] transition-colors duration-500"
            >
              说明
            </a>
            <a
              href="#faq"
              className="hover:text-[#D4AF37] transition-colors duration-500"
            >
              问题
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* ─── Grid Lines ─── */
function GridLines() {
  return (
    <div className="hidden lg:block fixed inset-0 z-30 pointer-events-none">
      <div className="max-w-[1600px] mx-auto h-full relative px-16">
        <div className="absolute left-16 top-0 w-px h-full bg-[#1A1A1A]/[0.06]" />
        <div className="absolute left-[33.33%] top-0 w-px h-full bg-[#1A1A1A]/[0.06]" />
        <div className="absolute left-[66.66%] top-0 w-px h-full bg-[#1A1A1A]/[0.06]" />
        <div className="absolute right-16 top-0 w-px h-full bg-[#1A1A1A]/[0.06]" />
      </div>
    </div>
  )
}

/* ─── Trust Item ─── */
function TrustItem({
  icon,
  label,
  desc,
}: {
  icon: React.ReactNode
  label: string
  desc: string
}) {
  return (
    <div className="flex flex-col items-start gap-3 p-6 border-t border-[#1A1A1A]/10">
      <div className="text-[#6C6863]">{icon}</div>
      <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#1A1A1A]">
        {label}
      </span>
      <span className="text-[10px] uppercase tracking-[0.25em] text-[#6C6863]">
        {desc}
      </span>
    </div>
  )
}

/* ─── Benefit Card (Dark bg) ─── */
function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group border-t border-[#F9F8F6]/10 p-8 md:p-12 transition-colors duration-700 hover:bg-[#F9F8F6]/[0.03]">
      <div className="text-[#F9F8F6]/40 mb-6 group-hover:text-[#D4AF37] transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-sm uppercase tracking-[0.15em] text-[#F9F8F6] mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-[#F9F8F6]/50 leading-relaxed">{description}</p>
    </div>
  )
}

/* ─── Feature Card ─── */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group border-t border-[#1A1A1A]/10 p-8 md:p-12 transition-colors duration-700 hover:bg-[#F9F8F6]/50">
      <div className="text-[#6C6863] mb-6 group-hover:text-[#D4AF37] transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-sm uppercase tracking-[0.15em] text-[#1A1A1A] mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-[#6C6863] leading-relaxed">{description}</p>
    </div>
  )
}

/* ─── Step Card ─── */
function StepCard({
  step,
  title,
  description,
}: {
  step: number
  title: string
  description: string
}) {
  return (
    <div className="border-t border-[#1A1A1A]/10 p-8 md:p-12">
      <span className="font-serif text-5xl md:text-6xl text-[#1A1A1A]/10 leading-none mb-6 block">
        {String(step).padStart(2, "0")}
      </span>
      <h3 className="text-sm uppercase tracking-[0.15em] text-[#1A1A1A] mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-[#6C6863] leading-relaxed">{description}</p>
    </div>
  )
}

/* ─── Use Case Card (Dark bg) ─── */
function UseCaseCard({
  title,
  description,
  result,
}: {
  title: string
  description: string
  result: string
}) {
  return (
    <div className="group border-t border-[#F9F8F6]/10 p-8 md:p-12 transition-colors duration-700 hover:bg-[#F9F8F6]/[0.03]">
      <h3 className="text-sm uppercase tracking-[0.15em] text-[#F9F8F6] mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-[#F9F8F6]/50 leading-relaxed mb-6">{description}</p>
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
        <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} />
        {result}
      </div>
    </div>
  )
}

/* ─── FAQ Item ─── */
function FaqItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-t border-[#1A1A1A]/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between gap-4 py-6 text-left group"
      >
        <h3
          className={`text-sm font-medium transition-colors duration-500 ${
            isOpen ? "text-[#D4AF37]" : "text-[#1A1A1A] group-hover:text-[#D4AF37]"
          }`}
        >
          {question}
        </h3>
        <div
          className={`shrink-0 w-6 h-6 border flex items-center justify-center transition-all duration-500 ${
            isOpen
              ? "border-[#D4AF37] rotate-45"
              : "border-[#1A1A1A]/20 rotate-0 group-hover:border-[#D4AF37]"
          }`}
        >
          <Plus className="h-3 w-3 text-[#1A1A1A]" strokeWidth={1.5} />
        </div>
      </button>
      {isOpen && (
        <div className="pb-6 animate-fade-in-down">
          <p className="text-sm text-[#6C6863] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}
