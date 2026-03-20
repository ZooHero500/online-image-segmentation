export function GridLines() {
  return (
    <div className="hidden lg:block fixed inset-0 z-30 pointer-events-none">
      <div className="max-w-[1600px] mx-auto h-full relative px-16">
        <div className="absolute left-16 top-0 w-px h-full bg-foreground/6" />
        <div className="absolute left-[33.33%] top-0 w-px h-full bg-foreground/6" />
        <div className="absolute left-[66.66%] top-0 w-px h-full bg-foreground/6" />
        <div className="absolute right-16 top-0 w-px h-full bg-foreground/6" />
      </div>
    </div>
  )
}
