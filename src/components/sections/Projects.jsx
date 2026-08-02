'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaTimes, FaCode, FaRocket, FaStar, FaEye, FaArrowRight } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import useFetch from '@/hooks/useFetch'
import { ProjectsSkeleton } from '@/components/ui/SkeletonCard'
import TiltCard from '@/components/ui/TiltCard'
import TechBadge from '@/components/ui/TechBadge'
import GlassCard from '@/components/ui/GlassCard'
import SectionHeading from '@/components/ui/SectionHeading'

const ProjectModal = ({ isOpen, onClose, project }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on ESC and lock body scroll
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {(isOpen && project) && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed inset-0 z-[100] overflow-y-auto"
            onClick={onClose}
          >
            <div className="min-h-screen px-4 flex items-center justify-center py-8">
              <div
                className="relative bg-base-300/95 backdrop-blur-md border border-base-content/20 shadow-[0_0_50px_rgba(255,175,211,0.1)] max-w-5xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="group absolute top-4 right-4 z-10 inline-flex items-center justify-center px-4 py-2 bg-base-100 border-2 border-base-content/50 text-base-content font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-[3px_3px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                >
                  CLOSE
                </button>

                {/* Project Image */}
                <div className="relative h-72 border-b border-base-content/20">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-base-300/30">
                      <div className="text-8xl font-display font-black text-primary/10 tracking-tighter">
                        {project.title.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-base-300/90 via-transparent to-transparent pointer-events-none" />

                  {/* Project category badge */}
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 bg-base-100/90 text-primary 
                                   text-[10px] font-mono uppercase tracking-widest border border-primary/30">
                      {project.category || 'SYSTEM'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                  {/* Title & Description */}
                  <div>
                    <h2 className="text-3xl font-bold text-base-content mb-4">
                      {project.title}
                    </h2>
                    <p className="text-base-content/80 text-lg leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Features */}
                  {project.features && project.features.length > 0 && (
                    <div>
                      <h3 className="text-sm font-mono text-primary uppercase tracking-widest mb-6 border-b border-primary/20 pb-2">
                        [ SYS.FEATURES ]
                      </h3>
                      <div className="grid gap-3">
                        {project.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-4 p-4 border border-base-content/10 bg-base-200/30 hover:border-primary/30 hover:bg-base-200/50 transition-colors"
                          >
                            <div className="text-primary font-mono text-xs mt-0.5 shrink-0">&gt;</div>
                            <span className="text-base-content/80 font-mono text-sm leading-relaxed">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  <div>
                    <h3 className="text-sm font-mono text-primary uppercase tracking-widest mb-6 border-b border-primary/20 pb-2">
                      [ SYS.STACK ]
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech?.map((tech, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <TechBadge variant="neutral">{tech}</TechBadge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 mt-4 border-t border-base-content/20">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-base-200/50 hover:bg-primary/20 border border-base-content/20 hover:border-primary/50 text-base-content font-mono text-xs uppercase tracking-widest transition-all"
                      >
                        [ VIEW_SOURCE ]
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-primary/10 text-primary border border-primary/50 hover:bg-primary/30 font-mono text-xs uppercase tracking-widest transition-all"
                      >
                        [ EXECUTE_DEMO ]
                      </a>
                    )}
                  </div>
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

// Enhanced Project Card Component
const ProjectCard = ({ project, index }) => {
  const [imageError, setImageError] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // stable handlers to avoid inline closures in JSX
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  const handleImageError = () => setImageError(true)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        whileHover={{ y: -8 }}
      >
        <TiltCard maxTilt={8}>
          <GlassCard hover={true} className="h-full flex flex-col group">
            {/* Project Image */}
            <div className="relative h-56 bg-base-300/30 border-b border-base-content/10 overflow-hidden">
              {project.image && !imageError ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                  onError={handleImageError}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-5xl font-display font-black text-primary/20 tracking-tighter">
                    {project.title.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              )}

              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-base-300/90 via-transparent to-transparent pointer-events-none" />

              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="px-2 py-1 bg-base-300/90 text-primary 
                           text-[10px] font-mono uppercase tracking-widest border border-primary/30">
                  {project.category || 'SYSTEM'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 flex-1 flex flex-col">
              <div className="flex-1">
                <h3 className="text-2xl font-display font-black uppercase tracking-tight text-base-content mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-base-content/70 font-mono text-xs leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* Tech Stack - Show only top 4 */}
              <div className="flex flex-wrap gap-2">
                {project.tech?.slice(0, 4).map((tech, idx) => (
                  <TechBadge key={idx} variant="neutral">{tech}</TechBadge>
                ))}
                {project.tech?.length > 4 && (
                  <TechBadge>+{project.tech.length - 4}</TechBadge>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-base-content/10">
                <button
                  onClick={openModal}
                  className="group flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-base-100 border-2 border-primary text-primary font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-200 shadow-[4px_4px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                >
                  INSPECT
                </button>
                {project.live && project.live !== "#" && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-base-100 border-2 border-secondary text-secondary font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-200 shadow-[4px_4px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                  >
                    RUN
                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-primary/10 to-secondary/10
                      rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                      transform translate-x-8 -translate-y-8" />
          </GlassCard>
        </TiltCard>
      </motion.div>

      <ProjectModal
        isOpen={showModal}
        onClose={closeModal}
        project={project}
      />
    </>
  )
}

export default function Projects() {
  const { data, loading, error } = useFetch('/api/projects')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const projects = Array.isArray(data?.projects) ? data.projects : []
  const categories = ['all', 'web', 'mobile', 'ai/ml', 'backend']

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p =>
      p.category?.toLowerCase() === selectedCategory ||
      p.tech?.some(tech => tech.toLowerCase().includes(selectedCategory))
    )

  if (loading) return <ProjectsSkeleton />

  if (error) {
    return (
      <section className="py-24 bg-base-100">
        <div className="container mx-auto px-4 text-center">
          <div className="p-8 bg-error/10 border border-error/20 rounded-2xl max-w-md mx-auto">
            <p className="text-error font-medium">Failed to load projects</p>
            <p className="text-base-content/60 text-sm mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-base-100 relative overflow-hidden" id="projects">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-linear-to-b from-base-200/50 to-base-100/50"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <SectionHeading
          icon={FaCode}
          eyebrow="PORTFOLIO_PROJECTS"
          title="Featured Projects"
          description="Showcase of my best work in web development, mobile apps, and innovative solutions."
        />



        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.slice(0, 6).map((project, index) => (
              <ProjectCard key={project._id || index} project={project} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-base-content/60 text-lg">No projects found in this category</p>
            </div>
          )}
        </motion.div>

        {/* View All Link */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ y: 0 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-base-100 border-2 border-primary text-primary font-mono text-sm font-bold uppercase tracking-[0.2em] transition-all duration-200 shadow-[6px_6px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]"
              >
                VIEW_ALL_PROJECTS
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
