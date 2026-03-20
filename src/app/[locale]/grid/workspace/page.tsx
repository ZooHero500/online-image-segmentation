import { setRequestLocale } from "next-intl/server"
import { GridWorkspaceClient } from "./GridWorkspaceClient"

export default async function GridWorkspacePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <GridWorkspaceClient />
}
