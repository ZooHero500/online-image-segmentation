import { getTranslations, setRequestLocale } from "next-intl/server"
import { JsonLd } from "@/components/JsonLd"
import { GridPageClient } from "./GridPageClient"

export default async function GridPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("grid")

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ImgSplit Grid",
          url: "https://imgsplit.com/grid",
          description: t("metadata.description"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <GridPageClient />
    </>
  )
}
