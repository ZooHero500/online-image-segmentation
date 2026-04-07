import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <WifiOff className="h-16 w-16 text-muted-foreground" />
      <h1 className="font-heading text-3xl font-bold">You are offline</h1>
      <p className="text-muted-foreground max-w-md">
        It looks like you lost your internet connection. Please check your network and try again.
      </p>
    </div>
  )
}
