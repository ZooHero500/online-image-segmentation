import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 ease-luxury outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "relative overflow-hidden bg-primary text-primary-foreground shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-primary bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground duration-500",
        secondary:
          "bg-secondary text-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-secondary/50 hover:text-foreground",
        link: "text-foreground underline-offset-4 hover:underline hover:text-accent tracking-[0.15em]",
      },
      size: {
        default: "h-12 px-8 py-2",
        xs: "h-8 gap-1 px-4 text-[10px]",
        sm: "h-10 gap-1.5 px-6",
        lg: "h-14 px-10",
        icon: "size-12",
        "icon-xs": "size-8",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  if (variant === "default") {
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        <span className="absolute inset-0 bg-accent -translate-x-full transition-transform duration-500 ease-luxury group-hover:translate-x-0 hover-parent:translate-x-0" />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </Comp>
    )
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
