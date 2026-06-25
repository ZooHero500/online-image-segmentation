import { setRequestLocale } from "next-intl/server"
import { CarouselWorkspaceClient } from "./CarouselWorkspaceClient"

export default async function CarouselWorkspacePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <CarouselWorkspaceClient />
}
