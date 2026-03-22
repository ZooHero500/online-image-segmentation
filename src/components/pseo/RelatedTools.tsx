import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"

interface RelatedTool {
  slug: string
  title: string
  description: string
}

interface RelatedToolsProps {
  tools: RelatedTool[]
  locale: string
  title: string
}

export function RelatedTools({ tools, locale, title }: RelatedToolsProps) {
  if (tools.length === 0) return null

  return (
    <section className="mt-24">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-12">
        {title}
      </p>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-0">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.slug}
            locale={locale}
            className="group border-t border-border p-8 hover:bg-background/50 transition-colors duration-700"
          >
            <h3 className="text-sm uppercase tracking-[0.15em] text-foreground font-medium mb-3">
              {tool.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {tool.description}
            </p>
            <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-accent transition-colors duration-500" />
          </Link>
        ))}
      </div>
    </section>
  )
}
