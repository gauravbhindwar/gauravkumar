'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaTimes, FaCode, FaRocket, FaStar, FaEye, FaArrowRight } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import useFetch from '@/hooks/useFetch'
import { ProjectsSkeleton } from '@/components/ui/SkeletonCard'

// Enhanced Project Modal with better design
const ProjectModal = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null

  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="min-h-screen px-4 flex items-center justify-center py-8">
              <div className="relative bg-base-100 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-base-200/80 hover:bg-base-300 
                           flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <FaTimes className="w-5 h-5" />
                </button>

                {/* Project Image */}
                <div className="relative h-72 bg-gradient-to-br from-primary/20 to-secondary/20">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-8xl font-bold text-primary/30">
                        {project.title.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-transparent" />
                  
                  {/* Project category badge */}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-base-100/90 backdrop-blur-sm text-base-content 
                                   rounded-full text-sm font-medium border border-base-content/10">
                      {project.category || 'Web Development'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 overflow-y-auto max-h-[50vh]">
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
                      <h3 className="text-xl font-bold text-base-content mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <FaStar className="text-primary w-4 h-4" />
                        </div>
                        Key Features
                      </h3>
                      <div className="grid gap-4">
                        {project.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-4 p-4 bg-base-200/50 rounded-xl hover:bg-base-200/70 transition-colors"
                          >
                            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                            <span className="text-base-content/90">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  <div>
                    <h3 className="text-xl font-bold text-base-content mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                        <FaCode className="text-secondary w-4 h-4" />
                      </div>
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {project.tech?.map((tech, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium 
                                   border border-primary/20 hover:bg-primary/20 transition-colors"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-base-300">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-base-200 hover:bg-base-300 
                                 rounded-xl font-medium transition-all hover:scale-105"
                      >
                        <FaGithub className="w-5 h-5" />
                        View Code
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-secondary 
                                 text-primary-content rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
                      >
                        <FaRocket className="w-5 h-5" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
        className="group relative bg-gradient-to-br from-base-100 to-base-200/50 rounded-2xl overflow-hidden 
                 border border-base-content/10 hover:border-primary/30 shadow-lg hover:shadow-2xl 
                 transition-all duration-500"
      >
        {/* Project Image */}
        <div className="relative h-56 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
          {project.image && !imageError ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-5xl font-bold text-primary/30">
                {project.title.substring(0, 2).toUpperCase()}
              </div>
            </div>
          )}
          
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick view control: compact circular button with subtle hover label */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <span className="hidden md:inline-block whitespace-nowrap text-sm bg-base-100/90 px-3 py-1 rounded-md text-base-content/80 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Quick view
            </span>

            <button
              onClick={openModal}
              aria-label={`Quick view ${project.title}`}
              title="Quick view"
              type="button"
              className="w-11 h-11 rounded-full bg-base-200/90 flex items-center justify-center shadow-md hover:shadow-lg 
                         transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <FaEye className="w-4 h-4 text-primary" />
            </button>
          </div>

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-base-100/90 backdrop-blur-sm text-base-content/80 
                           rounded-full text-xs font-medium border border-base-content/10">
              {project.category || 'Web Development'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-base-content/70 text-sm leading-relaxed line-clamp-3">
              {project.description}
            </p>
          </div>

          {/* Tech Stack - Show only top 4 */}
          <div className="flex flex-wrap gap-2">
            {project.tech?.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-lg font-medium 
                         border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                {tech}
              </span>
            ))}
            {project.tech?.length > 4 && (
              <span className="px-3 py-1 bg-base-200 text-base-content/60 text-xs rounded-lg font-medium">
                +{project.tech.length - 4} more
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={openModal}
              className="flex-1 px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl 
                       font-medium transition-all text-sm hover:scale-105"
            >
              View Details
            </button>
            {project.live && project.live !== "#" && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-primary-content 
                         rounded-xl font-medium hover:shadow-lg transition-all text-sm flex items-center 
                         justify-center gap-2 hover:scale-105"
              >
                <FaExternalLinkAlt className="w-3 h-3" />
                Demo
              </a>
            )}
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 
                      rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                      transform translate-x-8 -translate-y-8" />
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
      <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100/50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Featured Projects
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Showcase of my best work in web development, mobile apps, and innovative solutions
          </motion.p>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-8 text-center"
          >
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">{projects.length}+</span>
              <span className="text-sm text-base-content/60">Projects</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-secondary">5+</span>
              <span className="text-sm text-base-content/60">Technologies</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-accent">2+</span>
              <span className="text-sm text-base-content/60">Years Experience</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-3 mb-16 flex-wrap"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg scale-105'
                  : 'bg-base-200 hover:bg-base-300 text-base-content hover:scale-105'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

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
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-content 
                         rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 
                         flex items-center gap-3 mx-auto"
              >
                View All {projects.length} Projects
                <FaArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
