import { Link } from "@/i18n/navigation"
import { ArrowUpRight } from "lucide-react"

interface ToolCardProps {
  title: string
  description: string
  href: string
}

export function ToolCard({ title, description, href }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between bg-muted/50 p-6 min-h-[140px] hover:bg-muted transition-colors duration-500"
    >
      <div>
        <h3 className="text-[13px] uppercase tracking-[0.12em] text-foreground font-medium leading-snug mb-2">
          {title}
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
      <div className="flex justify-end mt-4">
        <ArrowUpRight className="h-4 w-4 text-muted-foreground/25 group-hover:text-accent transition-colors duration-500" strokeWidth={1.5} />
      </div>
    </Link>
  )
}
