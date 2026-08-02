'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaSearch, FaFilter, FaTimes, FaCode, FaRocket, FaStar } from 'react-icons/fa'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import useFetch from '@/hooks/useFetch'

// Enhanced Project Modal for the projects page
const ProjectModal = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null

  // close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="min-h-screen px-4 flex items-center justify-center py-8">
              <div className="relative bg-base-100 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-base-200/80 hover:bg-base-300 
                           flex items-center justify-center transition-all duration-200"
                >
                  <FaTimes className="w-5 h-5" />
                </button>

                <div className="relative h-64 bg-linear-to-br from-primary/20 to-secondary/20">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl font-bold text-primary/30">
                        {project.title.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-base-100 via-transparent to-transparent" />
                </div>

                <div className="p-8 space-y-6 overflow-y-auto max-h-[50vh]">
                  <div>
                    <h2 className="text-3xl font-bold text-base-content mb-4">{project.title}</h2>
                    <p className="text-base-content/80 text-lg leading-relaxed">{project.description}</p>
                  </div>

                  {project.features && project.features.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
                        <FaStar className="text-primary" />
                        Key Features
                      </h3>
                      <div className="grid gap-3">
                        {project.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-base-200/50 rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                            <span className="text-base-content/80">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
                      <FaCode className="text-primary" />
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech?.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-base-300">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                         className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-base-200 hover:bg-base-300 rounded-xl font-medium transition-all">
                        <FaGithub className="w-5 h-5" />
                        View Code
                      </a>
                    )}
                    {project.live && project.live !== "#" && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer"
                         className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary to-secondary text-primary-content rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
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

export default function ViewAllProjects() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTech, setSelectedTech] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Navigate back on ESC when no modal is open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (!selectedProject) {
          if (typeof window !== 'undefined' && window.history.length > 1) window.history.back()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedProject])
  
  const { data, loading, error } = useFetch('/api/projects', {
    revalidate: 600000,
    staleWhileRevalidate: true
  })

  const projects = Array.isArray(data?.projects) ? data.projects : []

  // Get unique technologies for filter
  const allTechnologies = useMemo(() => {
    const techs = new Set()
    projects.forEach(project => {
      project.tech?.forEach(tech => techs.add(tech))
    })
    return ['all', ...Array.from(techs).sort()]
  }, [projects])

  // Filter projects based on search and tech filter
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTech = selectedTech === 'all' || 
                         project.tech?.some(tech => tech.toLowerCase() === selectedTech.toLowerCase())
      
      return matchesSearch && matchesTech
    })
  }, [projects, searchTerm, selectedTech])

  if (loading) {
    return (
      <main className="min-h-screen py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="min-h-screen py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-error">Failed to load projects data</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-base-200 hover:bg-base-300 
                                   rounded-xl font-medium transition-all mb-8 hover:scale-105">
              <FaArrowLeft /> Back to Home
            </Link>
            
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-linear-to-r from-primary to-secondary text-transparent bg-clip-text">
                  All Projects
                </span>
              </h1>
              <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                Explore my complete portfolio of web applications, tools, and innovative solutions
              </p>
            </div>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 space-y-6"
          >
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-base-200 border border-base-content/10 rounded-xl 
                         focus:outline-none focus:border-primary/50 focus:bg-base-100 transition-all
                         text-base-content placeholder-base-content/40"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-base-200 hover:bg-base-300 rounded-xl 
                         font-medium transition-all hover:scale-105"
              >
                <FaFilter />
                Filters {showFilters ? '▼' : '▶'}
              </button>
            </div>

            {/* Technology Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-base-200/50 rounded-xl p-6 max-w-4xl mx-auto"
                >
                  <h3 className="font-semibold mb-4 text-center">Filter by Technology</h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {allTechnologies.slice(0, 20).map((tech) => (
                      <button
                        key={tech}
                        onClick={() => setSelectedTech(tech)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedTech === tech
                            ? 'bg-linear-to-r from-primary to-secondary text-primary-content shadow-lg scale-105'
                            : 'bg-base-200 hover:bg-base-300 text-base-content hover:scale-105'
                        }`}
                      >
                        {tech === 'all' ? 'All Projects' : tech}
                      </button>
                    ))}
                  </div>
                  {allTechnologies.length > 20 && (
                    <p className="text-center text-sm text-base-content/60 mt-4">
                      Showing top 20 technologies
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Summary */}
            <div className="text-center">
              <p className="text-base-content/70">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedTech !== 'all' && ` using ${selectedTech}`}
              </p>
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onClick={() => setSelectedProject(project)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-base-content/60">
                  Try adjusting your search criteria or clearing the filters
                </p>
                {(searchTerm || selectedTech !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedTech('all')
                    }}
                    className="mt-4 px-6 py-3 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-all"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <ProjectModal 
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject || {}}
      />
    </main>
  )
}

// Enhanced ProjectCard component for the projects page
const ProjectCard = ({ project, index, onClick }) => {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="group bg-linear-to-br from-base-100 to-base-200/50 rounded-2xl overflow-hidden 
               border border-base-content/10 hover:border-primary/30 shadow-lg hover:shadow-2xl 
               transition-all duration-500 cursor-pointer"
      onClick={() => onClick(project)}
    >
      {/* Project Image */}
      <div className="relative h-64 overflow-hidden">
        {project.image && !imageError ? (
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-secondary/10">
            <div className="text-5xl font-bold text-primary/30">
              {project.title.substring(0, 2).toUpperCase()}
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick view overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300">
          <div className="px-6 py-3 bg-white/90 text-base-content rounded-xl font-medium shadow-lg backdrop-blur-sm">
            View Details
          </div>
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
          <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h2>
          <p className="text-base-content/70 text-sm leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.tech?.slice(0, 4).map((tech, idx) => (
            <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-lg font-medium">
              {tech}
            </span>
          ))}
          {project.tech?.length > 4 && (
            <span className="px-3 py-1 bg-base-200 text-base-content/60 text-xs rounded-lg font-medium">
              +{project.tech.length - 4} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          {project.github && (
            <a 
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-base-200 hover:bg-base-300 
                       rounded-lg font-medium transition-all text-sm"
            >
              <FaGithub className="w-4 h-4" />
              Code
            </a>
          )}
          {project.live && project.live !== "#" && (
            <a 
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-primary to-secondary 
                       text-primary-content rounded-lg font-medium transition-all text-sm"
            >
              <FaExternalLinkAlt className="w-4 h-4" />
              Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
