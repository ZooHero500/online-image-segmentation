import { LandingContent } from "./LandingContent"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* SEO Hero */}
      <section className="py-16 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          在线图片分割工具
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          免费在线图片裁切工具，支持拖拽分割线、磁吸对齐、一键生成并下载所有子图片。
          纯浏览器端处理，无需上传到服务器，保护您的隐私。
        </p>
      </section>

      {/* Editor */}
      <section className="px-4 pb-16 max-w-6xl mx-auto">
        <LandingContent />
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">功能特点</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="精确分割"
              description="拖拽分割线自由定位，支持磁吸对齐，精确到像素级别的图片裁切。"
            />
            <FeatureCard
              title="隐私安全"
              description="所有处理在浏览器本地完成，图片不会上传到任何服务器，保护您的隐私。"
            />
            <FeatureCard
              title="一键下载"
              description="支持一键打包下载所有分割后的子图片，也可单独下载每张图片。"
            />
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">使用说明</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StepCard step={1} title="上传图片" description="拖拽或点击上传您要分割的图片" />
            <StepCard step={2} title="添加分割线" description="添加横向或纵向分割线，拖拽调整位置" />
            <StepCard step={3} title="生成预览" description="点击生成按钮，预览分割后的每个区域" />
            <StepCard step={4} title="下载结果" description="一键打包下载所有子图片或单独下载" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">常见问题</h2>
          <div className="space-y-6">
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
              answer="完全安全。所有图片处理都在您的浏览器本地完成，不会将任何图片数据上传到服务器。"
            />
            <FaqItem
              question="可以同时添加多少条分割线？"
              answer="横向和纵向各最多支持 20 条分割线，可以创建非常精细的网格分割。"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-muted-foreground border-t">
        <p>在线图片分割工具 - 免费、安全、高效</p>
      </footer>
    </main>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="text-center p-6 rounded-lg bg-card border">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

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
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-3">
        {step}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function FaqItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  return (
    <div>
      <h3 className="font-semibold mb-1">{question}</h3>
      <p className="text-sm text-muted-foreground">{answer}</p>
    </div>
  )
}
