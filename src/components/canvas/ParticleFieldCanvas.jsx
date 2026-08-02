'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { useTheme } from '@/components/theme-provider'
import useInViewCanvas from './useInViewCanvas'
import CanvasErrorBoundary from './CanvasErrorBoundary'
import { CANVAS_DPR, getParticleCount, getThemeColors, hasWebGL } from './canvasConfig'

function ParticleField({ reducedMotion, color }) {
  const ref = useRef(null)
  const count = getParticleCount(400, 150)

  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return
    ref.current.rotation.y += delta * 0.015
  })

  return (
    <group ref={ref}>
      <Sparkles
        count={count}
        scale={[9, 5, 5]}
        size={1}
        speed={reducedMotion ? 0 : 0.15}
        opacity={0.35}
        color={color}
      />
    </group>
  )
}

/** Replaces Contact.jsx's hand-rolled floating-particle divs with a WebGL field. */
export default function ParticleFieldCanvas({ className = 'canvas-layer' }) {
  const { theme, reducedMotion } = useTheme()
  const [ref, inView] = useInViewCanvas({ once: true })
  const [webglOk, setWebglOk] = useState(true)

  useEffect(() => {
    setWebglOk(hasWebGL())
  }, [])

  if (!webglOk) return null

  const colors = getThemeColors(theme)

  return (
    <div ref={ref} className={className}>
      {inView && (
        <CanvasErrorBoundary>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={CANVAS_DPR}>
            <ParticleField reducedMotion={reducedMotion} color={colors.primary} />
          </Canvas>
        </CanvasErrorBoundary>
      )}
    </div>
  )
}
