import { useTranslations } from "next-intl"
import { LogoIcon } from "@/components/LogoIcon"
import { Link } from "@/i18n/navigation"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  const t = useTranslations("notFound")

  return (
    <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <LogoIcon className="h-6 w-6 text-[#1A1A1A]" />
        </div>

        <span className="font-serif text-8xl md:text-9xl text-[#1A1A1A]/10 leading-none block mb-6">
          404
        </span>

        <h1 className="font-serif text-3xl md:text-4xl leading-[0.9] mb-4">
          {t("title")}
        </h1>

        <p className="text-sm text-[#6C6863] leading-relaxed mb-10">
          {t("description")}
        </p>

        <Link
          href="/"
          className="group relative inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F9F8F6] px-8 py-3.5 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500"
        >
          <span className="absolute inset-0 bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
          <ArrowLeft className="relative z-10 h-3 w-3" />
          <span className="relative z-10">{t("backHome")}</span>
        </Link>
      </div>
    </main>
  )
}
