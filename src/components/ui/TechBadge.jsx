'use client'

const VARIANTS = {
  // Default tag: terminal output style
  neutral: 'bg-base-300/20 border border-base-content/20 hover:border-primary/50 text-base-content/80',
  // Solid tag: highlighted glowing terminal state
  solid: 'bg-primary/10 text-primary border border-primary/50 shadow-[0_0_15px_rgba(255,175,211,0.2)]',
}

/**
 * Sharp, terminal-style TechBadge matching the new technical aesthetic.
 */
export default function TechBadge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`px-2 py-1 text-[10px] font-mono uppercase tracking-widest transition-all duration-300
                 ${VARIANTS[variant] || VARIANTS.neutral} ${className}`}
    >
      {children}
    </span>
  )
}
