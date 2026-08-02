'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/**
 * Animated, snake (S-curve) roadmap timeline.
 */
function SnakeCurve({ isEven }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  })

  // The Bezier paths for weaving left-to-right or right-to-left
  const path = isEven 
    ? "M 0 0 C 0 50, 100 50, 100 100" 
    : "M 100 0 C 100 50, 0 50, 0 100"

  return (
    <svg ref={ref} className="w-full h-full text-primary overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
      <path 
        d={path}
        stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" 
      />
      <motion.path 
        d={path}
        stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"
        style={{ pathLength: scrollYProgress }}
        className="drop-shadow-[0_0_8px_rgba(255,175,211,0.8)]"
      />
    </svg>
  )
}

export default function VerticalTimeline({
  items,
  renderItem,
  keyExtractor = (item, index) => item?._id ?? index,
  emptyState = null,
  className = 'max-w-6xl mx-auto',
}) {
  return (
    <div className={`relative ${className} py-10`}>
      {/* Mobile-only straight background line */}
      <div className="md:hidden absolute left-[2.4rem] top-10 bottom-0 w-px bg-primary/20" />

      <div className="relative z-10 w-full flex flex-col">
        {items.map((item, index) => {
          // Force items to the right on mobile, alternate on desktop
          const isEven = index % 2 === 0
          const side = isEven ? 'left' : 'right'

          return (
            <div key={keyExtractor(item, index)} className="relative w-full pb-24 group">
              
              {/* Timeline Node Stop (Desktop: Attached to inner edge, Mobile: Left aligned) */}
              <div className={`absolute top-[2.5rem] w-4 h-4 bg-base-100 border-2 border-primary rotate-45 z-20 transition-all duration-500 group-hover:scale-150 group-hover:bg-primary shadow-[0_0_10px_rgba(255,175,211,0.5)] 
                -translate-x-1/2 left-[2.4rem]
                ${isEven ? 'md:left-[45%]' : 'md:left-[55%]'}`} 
              />

              {/* Dynamic S-Curve Connection to NEXT node (Desktop Only) */}
              {index < items.length - 1 && (
                <div className="hidden md:block absolute top-[3rem] left-[45%] w-[10%] h-full z-0">
                  <SnakeCurve isEven={isEven} />
                </div>
              )}

              {/* Card Container */}
              <motion.div
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`w-full pl-16 md:pl-0 md:w-[45%] text-left ${
                  isEven 
                    ? 'md:pr-8' 
                    : 'md:pl-8 md:ml-auto'
                }`}
              >
                {renderItem(item, index, side)}
              </motion.div>
            </div>
          )
        })}
      </div>

      {items.length === 0 && emptyState}
    </div>
  )
}
