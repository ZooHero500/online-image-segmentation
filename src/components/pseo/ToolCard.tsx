import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"

interface ToolCardProps {
  title: string
  description: string
  href: string
}

export function ToolCard({ title, description, href }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group border-t border-border p-8 md:p-12 hover:bg-background/50 transition-colors duration-700"
    >
      <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        {description}
      </p>
      <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-accent transition-colors duration-500" />
    </Link>
  )
}
