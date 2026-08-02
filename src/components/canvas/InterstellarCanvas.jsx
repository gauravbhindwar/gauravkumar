'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/theme-provider'

const NetworkIllustration = () => {
  const layers = [4, 7, 7, 4];
  const layerSpacing = 160;
  const nodeSpacing = 60;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0">
      <svg width="800" height="500" viewBox="0 0 800 500" className="stroke-base-content fill-none">
        {/* Mathematical Formulas overlay */}
        <text x="100" y="80" className="fill-base-content stroke-none font-mono text-xl opacity-50">f(x) = σ(Wᵀx + b)</text>
        <text x="500" y="450" className="fill-base-content stroke-none font-mono text-xl opacity-50">L = -∑ yᵢ log(pᵢ)</text>
        <text x="600" y="100" className="fill-base-content stroke-none font-mono text-xl opacity-50">∇θ J(θ)</text>

        {/* Draw connections */}
        {layers.map((nodeCount, i) => {
          if (i === layers.length - 1) return null;
          const nextCount = layers[i + 1];
          const currentX = 160 + i * layerSpacing;
          const nextX = 160 + (i + 1) * layerSpacing;
          
          return Array.from({ length: nodeCount }).map((_, currentYIdx) => {
            const currentY = 250 + (currentYIdx - (nodeCount - 1) / 2) * nodeSpacing;
            return Array.from({ length: nextCount }).map((_, nextYIdx) => {
              const nextY = 250 + (nextYIdx - (nextCount - 1) / 2) * nodeSpacing;
              return (
                <path 
                  key={`line-${i}-${currentYIdx}-${nextYIdx}`}
                  d={`M ${currentX} ${currentY} C ${currentX + 50} ${currentY}, ${nextX - 50} ${nextY}, ${nextX} ${nextY}`}
                  className="stroke-base-content/30"
                  strokeWidth="1.5"
                />
              )
            })
          })
        })}

        {/* Draw nodes */}
        {layers.map((nodeCount, i) => {
          const x = 160 + i * layerSpacing;
          return Array.from({ length: nodeCount }).map((_, yIdx) => {
            const y = 250 + (yIdx - (nodeCount - 1) / 2) * nodeSpacing;
            return (
              <g key={`node-${i}-${yIdx}`}>
                <circle 
                  cx={x} 
                  cy={y} 
                  r="12" 
                  className="fill-base-100 stroke-base-content/80"
                  strokeWidth="3"
                />
                <circle 
                  cx={x} 
                  cy={y} 
                  r="4" 
                  className="fill-primary stroke-none"
                />
              </g>
            )
          })
        })}
      </svg>
    </div>
  )
}

const codeSnippets = [
  {
    language: 'javascript',
    title: 'useNeuralEngine.js',
    pos: { top: '10%', left: '-5%' },
    delay: 0,
    code: `const initializeNetwork = async (config) => {\n  const model = tf.sequential();\n  model.add(tf.layers.dense({\n    units: 128,\n    activation: 'relu',\n    inputShape: [config.inputSize]\n  }));\n  return model;\n};`
  },
  {
    language: 'python',
    title: 'architect.py',
    pos: { top: '55%', left: '5%' },
    delay: 2,
    code: `def build_scalable_system(load):\n    if load > THRESHOLD:\n        scale_out(instances=5)\n    else:\n        optimize_resources()\n    return SystemState.STABLE`
  },
  {
    language: 'docker',
    title: 'Dockerfile',
    pos: { top: '15%', right: '-5%' },
    delay: 1,
    code: `FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nCMD ["npm", "run", "start"]`
  },
  {
    language: 'typescript',
    title: 'types.d.ts',
    pos: { top: '65%', right: '2%' },
    delay: 3,
    code: `interface ArchitectConfig {\n  scalable: boolean;\n  cloudProvider: 'AWS' | 'GCP';\n  aiModels: ModelType[];\n  maxLatencyMs: number;\n}`
  }
]

export default function InterstellarCanvas({ className = 'canvas-layer' }) {
  const { reducedMotion } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      
      {/* Center ML Illustration */}
      <NetworkIllustration />

      {codeSnippets.map((snippet, i) => (
        <motion.div
          key={i}
          className="absolute bg-base-300/30 dark:bg-base-300/20 backdrop-blur-sm border border-base-content/10 rounded-xl overflow-hidden shadow-2xl p-4 w-[280px] md:w-[360px] opacity-0"
          style={{ ...snippet.pos }}
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: reducedMotion ? 0.3 : [0.15, 0.4, 0.15],
            y: reducedMotion ? 0 : [0, -30, 0],
            rotate: reducedMotion ? 0 : [0, i % 2 === 0 ? 2 : -2, 0]
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: snippet.delay
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 border-b border-base-content/10 pb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-error/60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-warning/60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-success/60"></div>
            <span className="text-xs text-base-content/40 ml-2 font-mono">{snippet.title}</span>
          </div>
          
          {/* Code */}
          <pre className="text-[10px] md:text-xs font-mono text-base-content/60 whitespace-pre-wrap leading-relaxed">
            {snippet.code}
          </pre>
        </motion.div>
      ))}
    </div>
  )
}
