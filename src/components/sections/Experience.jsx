'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FiBriefcase, FiCalendar, FiMapPin, FiCheckCircle } from 'react-icons/fi'

const Experience = () => {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const containerRef = useRef(null)

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-medium tracking-wider uppercase text-sm">Career Path</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Professional <span className="text-primary">Experience</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Timeline Line (Desktop) */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-base-content/10" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp._id || index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-0 md:pl-24"
              >
                {/* Timeline Dot (Desktop) */}
                <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-base-100 ring-offset-2 ring-offset-primary/20" />
                </div>

                {/* Card */}
                <motion.div 
                  className="group relative bg-base-100/50 backdrop-blur-md rounded-3xl p-6 md:p-8 
                           border border-base-content/5 shadow-lg hover:shadow-xl transition-all duration-300
                           hover:bg-base-100/80 hover:-translate-y-1"
                >
                  {/* Decorative Gradient Border on Hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/0 via-primary/10 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-base-content group-hover:text-primary transition-colors">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-2 text-lg font-medium text-secondary mt-1">
                        <FiBriefcase className="w-4 h-4" />
                        {exp.company}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end gap-1 text-sm text-base-content/60">
                      <div className="flex items-center gap-2 bg-base-200/50 px-3 py-1 rounded-full">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - 
                          {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ' Present'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1">
                        <FiMapPin className="w-4 h-4" />
                        {exp.location}
                      </div>
                    </div>
                  </div>

                  <p className="text-base-content/80 leading-relaxed mb-6">
                    {exp.description}
                  </p>

                  {/* Responsibilities */}
                  {exp.responsibilities?.length > 0 && (
                    <div className="mb-6 space-y-3">
                      {exp.responsibilities.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-base-content/70">
                          <FiCheckCircle className="w-5 h-5 text-success/80 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech Stack */}
                  {exp.technologies?.length > 0 && (
                    <div className="border-t border-base-content/5 pt-4 mt-4">
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-primary/5 text-primary border border-primary/10
                                     group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          {experiences.length === 0 && (
            <div className="text-center py-20 text-base-content/50">
              No experience records found.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Experience
