'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaTrophy, FaMedal, FaCalendarAlt, FaExternalLinkAlt, FaCertificate, FaAward, FaMapMarkerAlt } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'

const Awards = () => {
  const { data: awards, loading, error } = useFetch('/api/awards')
  const [selectedLevel, setSelectedLevel] = useState('All')

  const levels = ['All', 'International', 'National', 'Regional', 'State', 'Local', 'Institutional']

  const filteredAwards = awards?.filter(award => 
    selectedLevel === 'All' || award.level === selectedLevel
  ) || []

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const getLevelIcon = (level) => {
    const icons = {
      International: '🌍',
      National: '🏆',
      Regional: '🏅',
      State: '🎖️',
      Local: '🥉',
      Institutional: '🏛️'
    }
    return icons[level] || '🏆'
  }

  const getLevelColor = (level) => {
    const colors = {
      International: 'badge-success',
      National: 'badge-warning',
      Regional: 'badge-info',
      State: 'badge-primary',
      Local: 'badge-secondary',
      Institutional: 'badge-ghost'
    }
    return colors[level] || 'badge-ghost'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      Academic: '🎓',
      Professional: '💼',
      Technical: '⚡',
      Leadership: '👑',
      Innovation: '💡',
      'Community Service': '🤝',
      Competition: '🏁',
      Recognition: '⭐',
      Other: '🌟'
    }
    return icons[category] || '🌟'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">Awards</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-base-200 rounded-lg p-6 h-80"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-base-content mb-4">Awards</h2>
          <p className="text-error">Failed to load awards</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-base-100" id="awards">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            Awards & Recognition
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Recognitions and honors that acknowledge excellence and outstanding contributions in various fields.
          </p>
        </motion.div>

        {/* Level Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`btn btn-sm ${
                selectedLevel === level
                  ? 'btn-primary'
                  : 'btn-outline btn-primary'
              }`}
            >
              {level}
            </button>
          ))}
        </motion.div>

        {/* Awards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAwards.map((award) => (
            <motion.div
              key={award._id}
              variants={itemVariants}
              className="bg-base-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-base-300"
            >
              {/* Award Header */}
              <div className="relative bg-gradient-to-r from-primary to-secondary p-6 text-primary-content">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FaTrophy className="text-2xl" />
                    <span className={`badge ${getLevelColor(award.level)} badge-outline text-white border-white`}>
                      {getLevelIcon(award.level)} {award.level}
                    </span>
                  </div>
                  {award.isFeatured && (
                    <span className="badge badge-accent gap-1">
                      <FaAward className="text-xs" />
                      Featured
                    </span>
                  )}
                </div>
                
                {/* Award Image */}
                {award.image && (
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <img
                      src={award.image}
                      alt={award.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Title and Position */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-base-content mb-2">
                    {award.title}
                  </h3>
                  {award.position && (
                    <div className="flex items-center gap-2 mb-2">
                      <FaMedal className="text-primary text-sm" />
                      <span className="text-primary font-semibold">{award.position}</span>
                    </div>
                  )}
                </div>

                {/* Category and Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="badge badge-primary badge-outline gap-1">
                    <span>{getCategoryIcon(award.category)}</span>
                    {award.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-base-content/60">
                    <FaCalendarAlt className="text-xs" />
                    {formatDate(award.date)}
                  </div>
                </div>

                {/* Awarded By */}
                <div className="flex items-center gap-2 mb-3 text-sm text-primary">
                  <FaMapMarkerAlt className="text-xs" />
                  <span className="font-medium">{award.awardedBy}</span>
                </div>

                {/* Description */}
                <p className="text-base-content/80 text-sm mb-4 line-clamp-3">
                  {award.description}
                </p>

                {/* Prize Value */}
                {award.prizeValue && (
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-success">
                      Prize: {award.prizeValue}
                    </span>
                  </div>
                )}

                {/* Criteria */}
                {award.criteria && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-base-content mb-1">Criteria:</h4>
                    <p className="text-xs text-base-content/70">{award.criteria}</p>
                  </div>
                )}

                {/* Tags */}
                {award.tags && award.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {award.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="badge badge-ghost badge-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {award.tags.length > 3 && (
                        <span className="badge badge-ghost badge-xs">
                          +{award.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {award.certificateUrl && (
                    <a
                      href={award.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary btn-outline gap-2 flex-1"
                    >
                      <FaCertificate className="text-xs" />
                      Certificate
                    </a>
                  )}
                  {award.link && (
                    <a
                      href={award.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-secondary btn-outline gap-2 flex-1"
                    >
                      <FaExternalLinkAlt className="text-xs" />
                      Details
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredAwards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-base-content/60">
              {selectedLevel === 'All' 
                ? 'No awards data available yet.' 
                : `No awards found at ${selectedLevel} level.`
              }
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Awards