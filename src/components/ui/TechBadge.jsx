'use client'

const VARIANTS = {
  // Default tag: terminal output style
  neutral: 'bg-base-100 border-2 border-base-content text-base-content hover:shadow-[2px_2px_0_0_currentColor] hover:-translate-y-0.5',
  // Solid tag: highlighted glowing terminal state
  solid: 'bg-primary text-base-100 border-2 border-base-content shadow-[2px_2px_0_0_currentColor]',
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
