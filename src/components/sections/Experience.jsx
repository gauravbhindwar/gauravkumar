'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { FiBriefcase, FiCalendar, FiMapPin, FiCheckCircle } from 'react-icons/fi'
import GlassCard from '@/components/ui/GlassCard'
import SectionHeading from '@/components/ui/SectionHeading'
import TechBadge from '@/components/ui/TechBadge'
import VerticalTimeline from '@/components/ui/VerticalTimeline'

const ExperienceModal = ({ isOpen, onClose, exp }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      window.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {(isOpen && exp) && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed inset-0 z-[100] overflow-y-auto"
            onClick={onClose}
          >
            <div className="min-h-screen px-4 flex items-center justify-center py-8 pointer-events-none">
              <div 
                className="relative bg-base-300/95 backdrop-blur-md border border-base-content/20 shadow-[0_0_50px_rgba(255,175,211,0.1)] max-w-4xl w-full p-8 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={onClose}
                  className="group absolute top-4 right-4 z-10 inline-flex items-center justify-center px-4 py-2 bg-base-100 border-2 border-base-content/50 text-base-content font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-[3px_3px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                >
                  CLOSE
                </button>

                <div className="mb-6 mt-4 md:mt-0">
                  <h2 className="text-3xl font-display font-black uppercase text-base-content mb-2">{exp.position}</h2>
                  <div className="text-primary font-mono text-sm tracking-widest">{exp.company}</div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-mono text-base-content/60 mb-8 pb-4 border-b border-base-content/10">
                  <div className="flex items-center gap-1.5 bg-base-200/50 px-2 py-1">
                    <FiCalendar className="w-3 h-3" />
                    <span>
                      {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - 
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ' Present'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1">
                    <FiMapPin className="w-3 h-3" />
                    {exp.location}
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-base-content/80 leading-relaxed font-mono text-sm">{exp.description}</p>
                  
                  {exp.responsibilities?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-4">[ SYS.RESPONSIBILITIES ]</h3>
                      <div className="space-y-3">
                        {exp.responsibilities.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm font-mono text-base-content/70">
                            <div className="mt-1 shrink-0 text-primary/50">›</div>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {exp.technologies?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-4">[ SYS.TECHNOLOGIES ]</h3>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <TechBadge key={i} variant="neutral">{tech}</TechBadge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

const ExperienceCard = ({ exp, side, isLatest, onInspect }) => {
  return (
    <GlassCard
      className="group relative p-6 md:p-8 shadow-lg border border-base-content/10 hover:border-primary/50 transition-all duration-500"
    >
      <div className="flex flex-col gap-4 mb-6 items-start">
        {/* Company - Brutalist Stop */}
        <div className="flex items-center gap-3">
          <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/50 text-primary font-mono text-[10px] uppercase tracking-widest shadow-[0_0_10px_rgba(255,175,211,0.1)] group-hover:bg-primary/20 transition-all">
            [ STOP_{new Date(exp.startDate).getFullYear()}: {exp.company.toUpperCase().replace(/\s+/g, '_')} ]
          </div>
          {isLatest && (
            <span className="px-2 py-1 bg-secondary/20 text-secondary font-mono text-[10px] uppercase tracking-widest border border-secondary/50 animate-pulse">
              [ LATEST ]
            </span>
          )}
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-display font-black tracking-tight text-base-content group-hover:text-primary transition-colors text-left">
            {exp.position}
          </h3>
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-base-content/60 mt-3 justify-start">
            <div className="flex items-center gap-1.5 bg-base-200/50 px-2 py-1 border border-base-content/10">
              <FiCalendar className="w-3 h-3" />
              <span>
                {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - 
                {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ' Present'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1">
              <FiMapPin className="w-3 h-3" />
              {exp.location}
            </div>
          </div>
        </div>
      </div>

      <p className="text-base-content/70 text-xs md:text-sm leading-relaxed mb-6 font-mono line-clamp-3 text-left">
        {exp.description}
      </p>

      {/* Tech Stack Preview */}
      {exp.technologies?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 justify-start">
          {exp.technologies.slice(0, 3).map((tech, i) => (
            <TechBadge key={i} variant="neutral">{tech}</TechBadge>
          ))}
          {exp.technologies.length > 3 && (
            <span className="text-[10px] font-mono text-base-content/50 px-2 py-1 border border-base-content/10 flex items-center justify-center">
              +{exp.technologies.length - 3} MORE
            </span>
          )}
        </div>
      )}

      {/* Inspect Button */}
      <div className="flex justify-start pt-4 border-t border-base-content/10">
          <button
            onClick={() => onInspect(exp)}
            className="group mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-base-100 border-2 border-primary text-primary font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all duration-200 shadow-[4px_4px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
          >
            INSPECT_DETAILS
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
      </div>
    </GlassCard>
  )
}

const Experience = () => {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedExp, setSelectedExp] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef(null)

  const openModal = (exp) => {
    setSelectedExp(exp)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    // small delay to allow exit animation before clearing data
    setTimeout(() => setSelectedExp(null), 300)
  }

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/experiences?t=${timestamp}`, {
          cache: 'no-store',
        })
        
        if (!response.ok) throw new Error('Failed to fetch experiences')
        
        const data = await response.json()
        setExperiences(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching experiences:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  if (loading) {
    return (
      <section className="py-20 min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </section>
    )
  }

  if (error) {
    return null 
  }

  return (
    <section className="py-20 relative overflow-hidden" id="experience" ref={containerRef}>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          icon={FiBriefcase}
          eyebrow="Career Path"
          title="Professional Experience"
        />

        <VerticalTimeline
          items={experiences}
          keyExtractor={(exp, index) => exp._id || index}
          renderItem={(exp, index, side) => (
            <ExperienceCard 
              exp={exp} 
              side={side} 
              isLatest={index === 0} 
              onInspect={openModal}
            />
          )}
          emptyState={
            <div className="text-center py-20 text-base-content/50">
              No experience records found.
            </div>
          }
        />
      </div>

      <ExperienceModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        exp={selectedExp}
      />
    </section>
  )
}

export default Experience
