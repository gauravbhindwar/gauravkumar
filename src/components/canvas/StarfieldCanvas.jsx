'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random'
import { useTheme } from '@/components/theme-provider'
import useInViewCanvas from './useInViewCanvas'
import CanvasErrorBoundary from './CanvasErrorBoundary'
import { CANVAS_DPR, getParticleCount, hasWebGL } from './canvasConfig'

function StarField({ reducedMotion, color }) {
  const ref = useRef(null)
  const count = getParticleCount(3500, 1200)
  const positions = useMemo(
    () => random.inSphere(new Float32Array(count * 3), { radius: 1.4 }),
    [count]
  )

  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return
    ref.current.rotation.x -= delta / 20
    ref.current.rotation.y -= delta / 28
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color={color}
          size={0.0035}
          sizeAttenuation
          depthWrite={false}
          opacity={0.7}
        />
      </Points>
    </group>
  )
}

/** Ambient starfield, mounted behind Hero's content as a `.canvas-layer`. */
export default function StarfieldCanvas({ className = 'canvas-layer' }) {
  const { theme, reducedMotion } = useTheme()
  const [ref, inView] = useInViewCanvas({ once: true })
  const [webglOk, setWebglOk] = useState(true)

  useEffect(() => {
    setWebglOk(hasWebGL())
  }, [])

  if (!webglOk) return null

  const color = theme === 'dark' ? '#ffffff' : '#4b3f57'

  return (
    <div ref={ref} className={className}>
      {inView && (
        <CanvasErrorBoundary>
          <Canvas camera={{ position: [0, 0, 1] }} dpr={CANVAS_DPR}>
            <StarField reducedMotion={reducedMotion} color={color} />
          </Canvas>
        </CanvasErrorBoundary>
      )}
    </div>
  )
}
