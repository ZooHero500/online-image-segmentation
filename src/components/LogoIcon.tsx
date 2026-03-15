interface LogoIconProps {
  className?: string
}

export function LogoIcon({ className = "h-4 w-4" }: LogoIconProps) {
  return (
    <svg
      viewBox="-40 -40 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="-34" y="-34" width="30" height="30" fill="currentColor" />
      <rect x="4" y="-34" width="30" height="30" fill="currentColor" />
      <rect x="-34" y="4" width="30" height="30" fill="currentColor" />
      <rect x="4" y="4" width="30" height="30" fill="currentColor" />
      <line x1="0" y1="-40" x2="0" y2="40" stroke="#D4AF37" strokeWidth="1.5" />
      <line x1="-40" y1="0" x2="40" y2="0" stroke="#D4AF37" strokeWidth="1.5" />
    </svg>
  )
}
