import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { LogoIcon } from "@/components/LogoIcon"
import { CORE_TOOLS, POPULAR_TOOL_SLUGS } from "@/lib/tools/catalog"
import { getToolPageData, type ToolPageData } from "@/lib/pseo"
import type { ReactNode } from "react"

interface SiteFooterProps {
  locale: string
}

export async function SiteFooter({ locale }: SiteFooterProps) {
  const tFooter = await getTranslations({ locale, namespace: "footer" })
  const tTools = await getTranslations({ locale, namespace: "toolsHub" })
  const popularTools = POPULAR_TOOL_SLUGS.map((slug) => getToolPageData(slug, locale)).filter(
    (tool): tool is ToolPageData => tool != null
  )

  return (
    <footer className="border-t border-border py-12 md:py-16 px-4 sm:px-8 md:px-16">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <Link href="/" className="flex items-center gap-3">
            <LogoIcon className="h-3.5 w-3.5 text-foreground" />
            <span className="text-xs uppercase tracking-[0.3em] font-medium">
              ImgSplit
            </span>
          </Link>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.25em] text-muted-foreground ml-4">
            {tFooter("tagline")}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <FooterColumn title={tFooter("toolsTitle")}>
            {CORE_TOOLS.map((tool) => (
              <Link key={tool.id} href={tool.href} className="hover:text-accent transition-colors duration-500">
                {tFooter(tool.labelKey)}
              </Link>
            ))}
            <Link href="/tools" className="hover:text-accent transition-colors duration-500">
              {tFooter("toolAll")}
            </Link>
          </FooterColumn>

          <FooterColumn title={tTools("categoryUseCase")}>
            {popularTools.map((tool) => (
              <Link key={tool.slug} href={`/${tool.slug}`} className="hover:text-accent transition-colors duration-500">
                {tool.seo.ogTitle}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title={tFooter("navTitle")}>
            <Link href="/" className="hover:text-accent transition-colors duration-500">
              ImgSplit
            </Link>
            <Link href="/tools" className="hover:text-accent transition-colors duration-500">
              {tFooter("toolAll")}
            </Link>
            <Link href="/about" className="hover:text-accent transition-colors duration-500">
              {tFooter("about")}
            </Link>
          </FooterColumn>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
              {tFooter("legalTitle")}
            </p>
            <div className="flex flex-col gap-2.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <Link href="/privacy" className="hover:text-accent transition-colors duration-500">
                {tFooter("privacy")}
              </Link>
              <Link href="/terms" className="hover:text-accent transition-colors duration-500">
                {tFooter("terms")}
              </Link>
              <a href="mailto:zoohero.dev@gmail.com" className="hover:text-accent transition-colors duration-500">
                {tFooter("contact")}
              </a>
            </div>
            <a
              href="https://www.producthunt.com/products/imgsplit?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-imgsplit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="ImgSplit on Product Hunt"
                width="200"
                height="43"
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1114907&theme=light&t=1775379733917"
              />
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            © {new Date().getFullYear()} ImgSplit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
        {title}
      </p>
      <div className="flex flex-col gap-2.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {children}
      </div>
    </div>
  )
}
