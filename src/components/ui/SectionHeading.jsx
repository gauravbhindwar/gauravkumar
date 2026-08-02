'use client'

import { motion } from 'framer-motion'

/**
 * Terminal-style section heading matching the Hacker/Architect theme.
 */
export default function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  description,
  className = '',
}) {
  // Format eyebrow to look like a system tag
  const formattedEyebrow = eyebrow ? `SYS.${eyebrow.replace(/\s+/g, '_').toUpperCase()}` : '';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`text-left mb-16 border-l-4 border-primary pl-6 ${className}`}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 mb-4">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          <span className="text-primary font-mono text-[10px] uppercase tracking-[0.2em]">{formattedEyebrow}</span>
        </div>
      )}
      <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mb-4 text-base-content">
        {title}
      </h2>
      {description && (
        <p className="text-sm font-mono text-base-content/60 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  )
}
