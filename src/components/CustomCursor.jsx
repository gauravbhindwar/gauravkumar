'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const pathname = usePathname()
  
  // Mouse position values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Smooth spring physics for the cursor ring
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Only render on desktop / fine pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return
    }
    
    setIsMounted(true)
    
    // Hide default cursor
    document.body.style.cursor = 'none'

    const updateMousePosition = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleMouseOver = (e) => {
      const target = e.target
      
      // Check if hovering over clickable elements
      const isClickable = 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer')

      setIsHovering(isClickable)
      
      if (isClickable) {
        document.body.style.cursor = 'none' // Enforce it just in case
      }
    }

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mouseover', handleMouseOver)
      document.body.style.cursor = 'auto'
    }
  }, [mouseX, mouseY, pathname]) // Re-run effect slightly on pathname change to catch new elements

  if (!isMounted) return null

  return (
    <>
      {/* Small dot (follows exactly) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      {/* Outer ring (follows with spring physics) */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] mix-blend-difference border-[1.5px] border-white flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 50 : 30,
          height: isHovering ? 50 : 30,
          backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0)',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isHovering && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-1 h-1 bg-white rounded-full" 
          />
        )}
      </motion.div>
    </>
  )
}
