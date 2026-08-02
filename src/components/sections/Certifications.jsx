'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaExternalLinkAlt, FaAward, FaCalendarAlt, FaCertificate, FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'
import { CertificationsSkeleton } from '@/components/ui/SkeletonCard'
import GlassCard from '@/components/ui/GlassCard'
import TiltCard from '@/components/ui/TiltCard'
import SectionHeading from '@/components/ui/SectionHeading'
import TechBadge from '@/components/ui/TechBadge'

const ROW_COUNT = 3

export default function Certifications() {
  const { data: certificationsData, loading, error } = useFetch('/api/certifications', {
    revalidate: 600000 // 10 minutes cache
  })
  const [showAll, setShowAll] = useState(false)

  if (loading) {
    return (
      <section id="certifications" className="py-24 relative">
        <div className="absolute inset-0 bg-linear-to-b from-base-200/30 to-base-100"></div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            <SectionHeading
              icon={FaCertificate}
              eyebrow="Professional Credentials"
              title="Certifications"
              description="Professional certifications that validate my expertise"
            />

            <CertificationsSkeleton />
          </motion.div>
        </div>
      </section>
    )
  }

  if (error || !certificationsData) {
    return (
      <section id="certifications" className="py-24 relative">
        <div className="absolute inset-0 bg-linear-to-b from-base-200/30 to-base-100"></div>
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
      <div className="absolute inset-0 bg-linear-to-b from-base-200/30 to-base-100"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <SectionHeading
            icon={FaCertificate}
            eyebrow="Professional Credentials"
            title="Certifications"
            description="Professional certifications that validate my expertise"
          />

          {/* Certifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {(showAll ? certificationsData.certifications : certificationsData.certifications.slice(0, ROW_COUNT)).map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group h-full"
              >
                <TiltCard maxTilt={6}>
                <GlassCard className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6 border-b-4 border-base-content pb-4">
                    <div className="w-14 h-14 border-2 border-base-content bg-primary flex items-center justify-center shadow-[4px_4px_0_0_currentColor] group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-300 shrink-0">
                      <FaAward className="w-6 h-6 text-base-100" />
                    </div>
                    {cert.credentialLink && (
                      <a
                        href={cert.credentialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-base-content text-[10px] font-mono font-bold uppercase tracking-widest bg-base-200 text-base-content shadow-[2px_2px_0_0_currentColor] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                      >
                        <FaCheck className="w-3 h-3 text-primary" />
                        VERIFY
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-mono font-bold uppercase tracking-widest leading-tight text-base-content">
                      {cert.title}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-base-content/80 font-mono text-sm uppercase">
                        <div className="w-8 h-8 border-2 border-base-content bg-base-100 flex items-center justify-center shadow-[2px_2px_0_0_currentColor]">
                          <FaCertificate className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="font-bold">{cert.issuer}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-base-content/60 font-mono text-xs uppercase">
                        <div className="w-8 h-8 border-2 border-base-content bg-base-100 flex items-center justify-center shadow-[2px_2px_0_0_currentColor]">
                          <FaCalendarAlt className="w-3.5 h-3.5 text-secondary" />
                        </div>
                        <span>{cert.date}</span>
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
                            <TechBadge key={skillIndex}>{skill}</TechBadge>
                          ))}
                          {cert.skills.length > 4 && (
                            <TechBadge variant="solid">+{cert.skills.length - 4}</TechBadge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {certificationsData.certifications.length > ROW_COUNT && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-base-100 border-2 border-primary text-primary font-mono text-sm font-bold uppercase tracking-[0.2em] transition-all duration-200 shadow-[6px_6px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]"
              >
                {showAll ? (
                  <>SHOW_LESS <FaChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-1" /></>
                ) : (
                  <>SHOW_{certificationsData.certifications.length - ROW_COUNT}_MORE <FaChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" /></>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
