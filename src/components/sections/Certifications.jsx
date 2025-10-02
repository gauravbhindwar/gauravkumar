'use client'

import { motion } from 'framer-motion'
import { FaExternalLinkAlt, FaAward, FaCalendarAlt, FaCertificate, FaCheck } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'
import { CertificationsSkeleton } from '@/components/ui/SkeletonCard'

export default function Certifications() {
  const { data: certificationsData, loading, error } = useFetch('/api/certifications', {
    revalidate: 600000 // 10 minutes cache
  })

  if (loading) {
    return (
      <section id="certifications" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-base-200/30 to-base-100"></div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full mb-6">
                <FaCertificate className="w-5 h-5 text-primary" />
                <span className="text-primary font-medium">Professional Credentials</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Certifications & Achievements
                </span>
              </h2>
              <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                Professional certifications and achievements that validate my expertise
              </p>
            </motion.div>

            <CertificationsSkeleton />
          </motion.div>
        </div>
      </section>
    )
  }

  if (error || !certificationsData) {
    return (
      <section id="certifications" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-base-200/30 to-base-100"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-error">Failed to load certifications data</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="certifications" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-base-200/30 to-base-100"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full mb-6">
              <FaCertificate className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Professional Credentials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Certifications & Achievements
              </span>
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Professional certifications and achievements that validate my expertise
            </p>
          </motion.div>

          {/* Certifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {certificationsData.certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group h-full"
              >
                <div className="h-full bg-gradient-to-br from-base-100 to-base-200/50 backdrop-blur-sm rounded-3xl p-8 
                              border border-base-content/5 hover:border-primary/20 transition-all duration-300
                              hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] hover:-translate-y-2">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 
                                  flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaAward className="w-7 h-7 text-primary" />
                    </div>
                    {cert.credentialLink && (
                      <a
                        href={cert.credentialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary 
                                 hover:bg-primary/20 transition-all duration-200 text-sm font-medium
                                 hover:scale-105 active:scale-95"
                      >
                        <FaCheck className="w-3 h-3" />
                        Verify
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold leading-tight">
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {cert.title}
                      </span>
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-base-content/70">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FaCertificate className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{cert.issuer}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-base-content/60">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <FaCalendarAlt className="w-4 h-4 text-secondary" />
                        </div>
                        <span className="text-sm">{cert.date}</span>
                      </div>
                    </div>
                    
                    {cert.description && (
                      <p className="text-sm text-base-content/70 leading-relaxed line-clamp-3">
                        {cert.description}
                      </p>
                    )}
                    
                    {/* Skills Tags */}
                    {cert.skills && cert.skills.length > 0 && (
                      <div className="pt-4 border-t border-base-content/5">
                        <div className="flex flex-wrap gap-2">
                          {cert.skills.slice(0, 4).map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-1.5 rounded-full bg-base-200/50 border border-base-content/10 
                                       text-xs font-medium hover:border-primary/20 transition-colors
                                       hover:bg-primary/5"
                            >
                              {skill}
                            </span>
                          ))}
                          {cert.skills.length > 4 && (
                            <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              +{cert.skills.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
