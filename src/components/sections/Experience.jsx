'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const Experience = () => {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    // console.log('🎯 Experience useEffect triggered')
    // console.log('👁️ isInView status:', isInView)
    const fetchExperiences = async () => {
      try {
        // console.log('🚀 Starting fetch experiences...', new Date().toISOString())
        setLoading(true)
        setError(null)
        
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/experiences?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        // console.log('📡 Response status:', response.status, response.statusText)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to fetch: ${response.status}`)
        }
        
        const data = await response.json()
        // console.log('📄 Raw data received:', data)
        // console.log('📊 Data type:', typeof data, 'Is Array:', Array.isArray(data))
        // console.log('📏 Data length:', data ? data.length : 'null')
        
        // Ensure data is an array
        if (!Array.isArray(data)) {
          console.error('⚠️ Data is not an array:', data)
          setExperiences([])
        } else {
          // console.log('💾 Setting experiences state...')
          setExperiences(data)
          // console.log('✅ State updated with', data.length, 'experiences')
        }
        setLoading(false)
      } catch (err) {
        console.error('❌ Error fetching experiences:', err)
        setError(err.message)
        setExperiences([]) // Set to empty array on error
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  // console.log('🔍 Experience Component Render - Data:', experiences, 'Length:', experiences?.length, 'Loading:', loading, 'Error:', error)

  if (loading) {
    // console.log('⏳ Rendering loading state...')
    return (
      <section className="py-20 bg-gradient-to-br from-base-100 via-base-200/30 to-base-100">
        <div className="container mx-auto px-4 text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/60 mt-4">Loading experiences... (Please wait)</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-base-100 via-base-200/30 to-base-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-base-content mb-4">Professional Experience</h2>
          <div className="p-8 bg-error/10 border border-error/20 rounded-2xl max-w-md mx-auto">
            <p className="text-error font-medium">Failed to load experiences</p>
            <p className="text-base-content/60 text-sm mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-base-100 via-base-200/30 to-base-100 min-h-screen" id="experience" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6" style={{ minHeight: '400px' }}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-base-content via-primary to-secondary bg-clip-text text-transparent mb-6">
            Professional Experience
          </h2>
          <p className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            My journey through innovative projects and cutting-edge technologies
          </p>
          {/* Debug info */}
          <div className="text-xs text-base-content/40 mt-2">
            Found {experiences.length} experience(s) | Last updated: {new Date().toLocaleTimeString()}
          </div>
        </motion.div>

        {/* Experience Content */}
        <div className="max-w-6xl mx-auto">
          {(() => {
            {/* console.log('🎨 Rendering experience list. Array?', Array.isArray(experiences), 'Length:', experiences?.length, 'Data:', experiences) */}
            return Array.isArray(experiences) && experiences.length > 0 ? (
              <div className="space-y-8">
                {experiences.map((exp, index) => {
                  {/* console.log(`🔖 Rendering experience ${index + 1}:`, exp.position, 'at', exp.company) */}
                  return (
                    <motion.div
                      key={exp._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className="bg-base-100 rounded-2xl p-8 border-2 border-primary/30 shadow-xl relative"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    >
                  {/* Basic Info */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-base-content mb-2" style={{ color: '#fff' }}>
                      {exp.position}
                    </h3>
                    <p className="text-lg text-primary font-medium mb-2">
                      {exp.company}
                    </p>
                    <p className="text-base-content/70" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {exp.location} • {exp.employmentType}
                    </p>
                    <p className="text-base-content/60 text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-base-content/80 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {exp.description}
                    </p>
                  </div>

                  {/* Responsibilities */}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-base-content mb-3" style={{ color: '#fff' }}>
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {exp.responsibilities.map((responsibility, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-base-content/80" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-base-content mb-3" style={{ color: '#fff' }}>
                        Technologies Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/40"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-base-100/80 backdrop-blur-sm rounded-2xl p-8 border border-base-300/50 shadow-lg">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-base-content/60 text-lg">No professional experiences found.</p>
                <p className="text-base-content/40 text-sm mt-2">Experience data may need to be added to the database.</p>
              </div>
            )
          })()}
        </div>
      </div>
    </section>
  )
}

export default Experience
