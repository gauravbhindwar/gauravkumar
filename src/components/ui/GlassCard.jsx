'use client'

import { motion } from 'framer-motion'

/**
 * Technical / Brutalist Card replacing the old GlassCard.
 * Features sharp corners, corner brackets, and a subtle background.
 */
export default function GlassCard({
  children,
  className = '',
  hover = true,
  gradientClassName, // Ignored in the new brutalist design
  borderClassName,   // Ignored in the new brutalist design
  as: Component = motion.div,
  ...motionProps
}) {
  return (
    <Component
      className={`relative bg-base-100 border-4 border-base-content transition-all duration-300 group overflow-hidden ${hover ? "hover:shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1" : ""} ${className}`}
      {...motionProps}
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-base-content/30 transition-colors duration-300 group-hover:border-primary" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-base-content/30 transition-colors duration-300 group-hover:border-primary" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-base-content/30 transition-colors duration-300 group-hover:border-primary" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-base-content/30 transition-colors duration-300 group-hover:border-primary" />

      {/* Content wrapper to stay above background effects */}
      <div className="relative z-20">
        {children}
      </div>
    </Component>
  )
}
