'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTrophy, FaCalendarAlt, FaExternalLinkAlt, FaBuilding, FaStar } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'

const Achievements = () => {
  const { data: achievements, loading, error } = useFetch('/api/achievements')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Academic', 'Professional', 'Technical', 'Leadership', 'Community', 'Sports', 'Other']

  const filteredAchievements = achievements?.filter(achievement => 
    selectedCategory === 'All' || achievement.category === selectedCategory
  ) || []

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const getCategoryIcon = (category) => {
    const icons = {
      Academic: '🎓',
      Professional: '💼',
      Technical: '⚡',
      Leadership: '👑',
      Community: '🤝',
      Sports: '🏆',
      Other: '🌟'
    }
    return icons[category] || '🌟'
  }

  const getCategoryColor = (category) => {
    const colors = {
      Academic: 'from-blue-500/20 to-indigo-500/20 border-blue-500/20',
      Professional: 'from-purple-500/20 to-pink-500/20 border-purple-500/20',
      Technical: 'from-green-500/20 to-emerald-500/20 border-green-500/20',
      Leadership: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/20',
      Community: 'from-teal-500/20 to-cyan-500/20 border-teal-500/20',
      Sports: 'from-red-500/20 to-rose-500/20 border-red-500/20',
      Other: 'from-gray-500/20 to-slate-500/20 border-gray-500/20'
    }
    return colors[category] || colors.Other
  }

  if (loading) {
    return (
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-base-100 to-base-200/30"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full mb-6">
              <FaTrophy className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Recognition & Awards</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Achievements
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-base-200/50 rounded-3xl p-8 h-80"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-base-100 to-base-200/30"></div>
        <div className="container mx-auto px-4 relative text-center">
          <h2 className="text-4xl font-bold text-base-content mb-4">Achievements</h2>
          <p className="text-error">Failed to load achievements</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 relative" id="achievements">
      <div className="absolute inset-0 bg-gradient-to-b from-base-100 to-base-200/30"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full mb-6">
              <FaTrophy className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Recognition & Awards</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Achievements
              </span>
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Notable accomplishments and milestones that mark my journey of growth and excellence
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-content shadow-lg scale-105'
                    : 'bg-base-200/50 text-base-content/70 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <span className="mr-2">{getCategoryIcon(category)}</span>
                {category}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group h-full"
              >
                <div className={`h-full bg-gradient-to-br ${getCategoryColor(achievement.category)} backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] hover:-translate-y-2`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaTrophy className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        <span>{getCategoryIcon(achievement.category)}</span>
                        {achievement.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold leading-tight">
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {achievement.title}
                      </span>
                    </h3>
                    
                    {achievement.organization && (
                      <div className="flex items-center gap-3 text-base-content/70">
                        <FaBuilding className="w-4 h-4 text-primary" />
                        <span className="font-medium">{achievement.organization}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 text-base-content/60">
                      <FaCalendarAlt className="w-4 h-4 text-secondary" />
                      <span className="text-sm">{formatDate(achievement.date)}</span>
                    </div>
                    
                    {achievement.description && (
                      <p className="text-sm text-base-content/70 leading-relaxed line-clamp-3">
                        {achievement.description}
                      </p>
                    )}
                    
                    {achievement.skills && achievement.skills.length > 0 && (
                      <div className="pt-4 border-t border-base-content/10">
                        <div className="flex flex-wrap gap-2">
                          {achievement.skills.slice(0, 3).map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-1.5 rounded-full bg-base-200/50 border border-base-content/10 text-xs font-medium hover:border-primary/20 transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                          {achievement.skills.length > 3 && (
                            <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              +{achievement.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {achievement.link && (
                      <div className="pt-4">
                        <a
                          href={achievement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 text-sm font-medium hover:scale-105 active:scale-95"
                        >
                          <FaStar className="w-3 h-3" />
                          View Details
                          <FaExternalLinkAlt className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredAchievements.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-base-200/50 flex items-center justify-center">
                <FaTrophy className="w-12 h-12 text-base-content/30" />
              </div>
              <h3 className="text-xl font-semibold text-base-content/70 mb-2">
                No achievements found
              </h3>
              <p className="text-base-content/50">
                No achievements match the selected category.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default Achievements
