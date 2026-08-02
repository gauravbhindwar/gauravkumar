'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTrophy, FaCalendarAlt, FaExternalLinkAlt, FaBuilding, FaStar, FaGraduationCap, FaBriefcase, FaBolt, FaCrown, FaUsers, FaThLarge } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'
import SectionHeading from '@/components/ui/SectionHeading'

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

  const categoryIcons = {
    All: FaThLarge,
    Academic: FaGraduationCap,
    Professional: FaBriefcase,
    Technical: FaBolt,
    Leadership: FaCrown,
    Community: FaUsers,
    Sports: FaTrophy,
    Other: FaStar,
  }
  const getCategoryIcon = (category) => categoryIcons[category] || FaStar

  const getCategoryColor = (category) => {
    const colors = {
      Academic: { gradient: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/20' },
      Professional: { gradient: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/20' },
      Technical: { gradient: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/20' },
      Leadership: { gradient: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/20' },
      Community: { gradient: 'from-teal-500/20 to-cyan-500/20', border: 'border-teal-500/20' },
      Sports: { gradient: 'from-red-500/20 to-rose-500/20', border: 'border-red-500/20' },
      Other: { gradient: 'from-gray-500/20 to-slate-500/20', border: 'border-gray-500/20' }
    }
    return colors[category] || colors.Other
  }

  if (loading) {
    return (
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-base-200/50"></div>
        <div className="container mx-auto px-4 relative">
          <SectionHeading
            icon={FaTrophy}
            eyebrow="Recognition & Awards"
            title="Achievements"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-base-200/50 rounded-none p-8 h-80"></div>
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
        <div className="absolute inset-0 bg-base-200/50"></div>
        <div className="container mx-auto px-4 relative text-center">
          <h2 className="text-4xl font-bold text-base-content mb-4">Achievements</h2>
          <p className="text-error">Failed to load achievements</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 relative" id="achievements">
      <div className="absolute inset-0 bg-base-200/50"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <SectionHeading
            icon={FaTrophy}
            eyebrow="Recognition & Awards"
            title="Achievements"
            description="Notable accomplishments and milestones that mark my journey of growth and excellence"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => {
              const Icon = getCategoryIcon(category)
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 border-2 ${
                    selectedCategory === category
                      ? 'border-base-content bg-primary text-base-100 shadow-[4px_4px_0px_0px_currentColor] translate-x-[-2px] translate-y-[-2px]'
                      : 'border-base-content bg-base-100 text-base-content hover:shadow-[2px_2px_0px_0px_currentColor] hover:translate-x-[-1px] hover:translate-y-[-1px]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  [ {category} ]
                </button>
              )
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredAchievements.map((achievement, index) => {
              const CategoryIcon = getCategoryIcon(achievement.category)
              return (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group h-full"
              >
                <div className="bg-base-100 p-8 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] hover:shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 transition-all h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6 border-b-4 border-base-content pb-4">
                    <div className="w-14 h-14 border-2 border-base-content bg-primary flex items-center justify-center shadow-[4px_4px_0_0_currentColor] group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-300">
                      <CategoryIcon className="w-6 h-6 text-base-100" />
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-base-content text-[10px] font-mono font-bold uppercase tracking-widest bg-base-200 text-base-content shadow-[2px_2px_0_0_currentColor]">
                        {achievement.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1 flex flex-col">
                    <h3 className="text-xl font-mono font-bold uppercase tracking-widest leading-tight text-base-content mb-2">
                      {achievement.title}
                    </h3>
                    
                    {achievement.organization && (
                      <div className="flex items-center gap-3 text-base-content/80 font-mono text-sm uppercase">
                        <FaBuilding className="w-4 h-4 text-primary" />
                        <span className="font-bold">{achievement.organization}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 text-base-content/60 font-mono text-xs uppercase">
                      <FaCalendarAlt className="w-4 h-4 text-secondary" />
                      <span>{formatDate(achievement.date)}</span>
                    </div>
                    
                    {achievement.description && (
                      <p className="text-sm font-mono text-base-content/70 leading-relaxed mt-4 flex-1 border-l-2 border-base-content pl-3">
                        {achievement.description}
                      </p>
                    )}
                    
                    {achievement.skills && achievement.skills.length > 0 && (
                      <div className="pt-4 border-t-2 border-base-content border-dashed mt-4">
                        <div className="flex flex-wrap gap-2">
                          {achievement.skills.slice(0, 3).map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest border-2 border-base-content bg-base-200 text-base-content">
                               {skill}
                            </span>
                          ))}
                          {achievement.skills.length > 3 && (
                            <span className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest border-2 border-base-content bg-primary text-base-100">
                               +{achievement.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="pt-6 mt-4">
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center justify-center gap-2 px-6 py-3 w-full bg-base-100 border-2 border-primary text-primary font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-[4px_4px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                    >
                      <FaStar className="w-3 h-3 transition-transform group-hover/btn:rotate-45" />
                      VIEW_DETAILS
                      <FaExternalLinkAlt className="w-3 h-3 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </a>
                  </div>
                </div>
              </motion.div>
              )
            })}
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
