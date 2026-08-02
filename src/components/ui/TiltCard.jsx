'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useTheme } from '@/components/theme-provider'

/**
 * Mouse-driven 3D tilt wrapper, generalized from Contact.jsx's per-section tilt logic
 * so it can wrap any card (Projects/Certifications/Achievements).
 */
export default function TiltCard({
  children,
  className = '',
  maxTilt = 10,
  scale = 1.02,
  perspective = 1000,
  ...rest
}) {
  const ref = useRef(null)
  const { reducedMotion } = useTheme()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { stiffness: 300, damping: 30 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig)

  const handleMouseMove = (e) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`h-full ${className}`}
      style={{ perspective }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      <motion.div
        className="h-full"
        style={reducedMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={reducedMotion ? undefined : { scale }}
        transition={springConfig}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
