'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, Text, Icosahedron, Float } from '@react-three/drei'
import { useTheme } from '@/components/theme-provider'
import useInViewCanvas from './useInViewCanvas'
import CanvasErrorBoundary from './CanvasErrorBoundary'
import { CANVAS_DPR, getThemeColors, hasWebGL } from './canvasConfig'

// The actual tech stack shown in Hero's pills, kept in one place so the 3D
// centerpiece stays truthful to the profile instead of being generic decoration.
const TECH_STACK = [
  { name: 'React / Next.js', colorKey: 'primary' },
  { name: 'Node.js', colorKey: 'success' },
  { name: 'Python', colorKey: 'info' },
  { name: 'AI / ML', colorKey: 'secondary' },
  { name: 'MongoDB', colorKey: 'accent' },
]

function Core({ reducedMotion, color }) {
  const ref = useRef(null)
  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return
    ref.current.rotation.x += delta * 0.08
    ref.current.rotation.y += delta * 0.12
  })
  return (
    <Icosahedron ref={ref} args={[0.55, 1]}>
      <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
    </Icosahedron>
  )
}

function OrbitLabel({ name, color, angle, radius, reducedMotion }) {
  const position = useMemo(
    () => [Math.cos(angle) * radius, Math.sin(angle * 1.3) * 0.3, Math.sin(angle) * radius],
    [angle, radius]
  )
  return (
    <Float speed={reducedMotion ? 0 : 1.2} floatIntensity={reducedMotion ? 0 : 0.4} rotationIntensity={0}>
      <Billboard position={position}>
        <Text fontSize={0.16} color={color} anchorX="center" anchorY="middle" outlineWidth={0.004} outlineColor="black" outlineOpacity={0.35}>
          {name}
        </Text>
      </Billboard>
    </Float>
  )
}

function OrbitRing({ reducedMotion, colors }) {
  const groupRef = useRef(null)
  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current) return
    groupRef.current.rotation.y += delta * 0.12
  })

  return (
    <group ref={groupRef}>
      <Core reducedMotion={reducedMotion} color={colors.primary} />
      {TECH_STACK.map((tech, i) => (
        <OrbitLabel
          key={tech.name}
          name={tech.name}
          color={colors[tech.colorKey] || colors.primary}
          angle={(i / TECH_STACK.length) * Math.PI * 2}
          radius={1.35}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  )
}

/**
 * Hero centerpiece: an orbiting ring of the profile's actual tech stack
 * around a wireframe core, replacing the earlier generic floating shapes.
 */
export default function TechOrbitCanvas({ className = '' }) {
  const { theme, reducedMotion } = useTheme()
  const [ref, inView] = useInViewCanvas({ once: true })
  const [webglOk, setWebglOk] = useState(true)

  useEffect(() => {
    setWebglOk(hasWebGL())
  }, [])

  if (!webglOk) return null

  const colors = getThemeColors(theme)

  return (
    <div ref={ref} className={`w-full h-full ${className}`} style={{ background: 'transparent' }}>
      {inView && (
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 3.4], fov: 45 }}
            dpr={CANVAS_DPR}
            gl={{ alpha: true, antialias: true }}
            style={{ background: 'transparent' }}
          >
            <OrbitRing reducedMotion={reducedMotion} colors={colors} />
          </Canvas>
        </CanvasErrorBoundary>
      )}
    </div>
  )
}
