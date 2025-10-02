'use client'

import { motion } from 'framer-motion'
import * as SimpleIcons from 'simple-icons'
import { useTheme } from '@/components/theme-provider'
import useFetch from '@/hooks/useFetch'
import { SkillsSkeleton } from '@/components/ui/SkeletonCard'

export default function Skills() {
  const { data: skillsData, loading, error } = useFetch('/api/skills', {
    revalidate: 600000 // 10 minutes cache
  })

  if (loading) {
    return (
      <section id="skills" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100/50"></div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <motion.h2 
              className="text-4xl font-bold text-center mb-16"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Technical Skills
              </span>
            </motion.h2>

            <SkillsSkeleton />
          </motion.div>
        </div>
      </section>
    )
  }

  if (error || !skillsData) {
    return (
      <section id="skills" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-error">Failed to load skills data</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100/50"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Technical Skills
            </span>
          </motion.h2>

          <TechnicalSkills skillsData={skillsData} />
        </motion.div>
      </div>
    </section>
  )
}

function TechnicalSkills({ skillsData }) {
  // Enhanced Web Development categorization
  const getWebDevSkills = (category) => {
    if (category.name !== "Web Development") return null;
    
    const frontendSkills = [
      "HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js", 
      "React Router", "Redux Toolkit", "React Hook Form", "Tailwind CSS", 
      "Material UI", "Shadcn UI", "Bootstrap", "Sass", "Framer Motion", 
      "CSS Modules", "Styled Components"
    ];
    
    const backendSkills = [
      "Node.js", "Express.js", "REST API", "JWT Auth", "MongoDB", 
      "Mongoose", "PostgreSQL", "Prisma", "Nodemailer", "NextAuth.js", "Redis"
    ];

    const aiTechSkills = [
      "GENAI"
    ];
    
    const frontend = category.skills.filter(skill => 
      frontendSkills.includes(skill.name)
    );
    
    const backend = category.skills.filter(skill => 
      backendSkills.includes(skill.name)
    );

    const aiTech = category.skills.filter(skill => 
      aiTechSkills.includes(skill.name)
    );
    
    return { frontend, backend, aiTech };
  };

  return (
    <div className="space-y-12">
      {/* Featured Web Development Section */}
      {skillsData.categories.map((category, idx) => {
        if (category.name === "Web Development") {
          const webDevSkills = getWebDevSkills(category);
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-8 
                            border border-base-content/10 hover:border-primary/20 transition-all duration-300
                            shadow-lg hover:shadow-xl">
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {category.name}
                    </span>
                  </h3>
                  <p className="text-base-content/70">Full-stack development capabilities</p>
                </div>
                  
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Frontend Section */}
                  <div className="bg-base-100/50 rounded-xl p-6 border border-base-content/5">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold">Frontend</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {webDevSkills.frontend.map((skill, index) => (
                        <SkillBadge key={skill.name} skill={skill} index={index} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Backend Section */}
                  <div className="bg-base-100/50 rounded-xl p-6 border border-base-content/5">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                        </svg>
                      </div>
                      <h4 className="font-semibold">Backend</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {webDevSkills.backend.map((skill, index) => (
                        <SkillBadge key={skill.name} skill={skill} index={index} />
                      ))}
                    </div>
                  </div>

                  {/* AI Technology Section */}
                  <div className="bg-base-100/50 rounded-xl p-6 border border-base-content/5">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold">AI & Innovation</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {webDevSkills.aiTech.map((skill, index) => (
                        <SkillBadge key={skill.name} skill={skill} index={index} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }
        return null;
      })}
      
      {/* Other Skill Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skillsData.categories.map((category, idx) => {
          if (category.name === "Web Development") return null;
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="h-full"
            >
              <div className="h-full bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 
                            border border-base-content/10 hover:border-primary/20 transition-all duration-300
                            shadow-lg hover:shadow-xl">
                
                <h3 className="text-xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {category.name}
                  </span>
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, index) => (
                    <SkillBadge key={skill.name} skill={skill} index={index} />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Academic Journey Section */}
      {skillsData.courses && (
        <AcademicJourney courses={skillsData.courses} />
      )}
    </div>
  )
}

function SkillBadge({ skill, index }) {
  const iconName = skill.icon || skill.name.replace(/\s+/g, '').toLowerCase()
  let Icon
  
  try {
    Icon = SimpleIcons[`si${iconName.charAt(0).toUpperCase() + iconName.slice(1)}`]
  } catch (e) {
    Icon = null
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      className="group"
    >
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-base-100 border border-base-content/10 
                    hover:border-primary/30 hover:bg-base-200/80 transition-all duration-300 
                    hover:shadow-md">
        {Icon && (
          <svg
            className="w-4 h-4 transition-colors duration-300"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: skill.color || 'currentColor' }}
          >
            <path d={Icon.path} />
          </svg>
        )}
        <span className="text-sm font-medium">{skill.name}</span>
      </div>
    </motion.div>
  )
}

function AcademicJourney({ courses }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-8 
                    border border-base-content/10 hover:border-primary/20 transition-all duration-300
                    shadow-lg hover:shadow-xl">
        
        <h3 className="text-2xl font-bold mb-6">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Academic Journey
          </span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Studies */}
          {courses.current && (
            <div className="bg-base-100/50 rounded-xl p-6 border border-base-content/5">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold">Current Studies</h4>
              </div>
              <div className="space-y-2">
                {courses.current.map((course, index) => (
                  <div key={index} className="flex items-center p-2 rounded-lg bg-base-200/50">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                    <span className="text-sm">{course}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Studies */}
          {courses.completed && (
            <div className="bg-base-100/50 rounded-xl p-6 border border-base-content/5">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold">Completed Studies</h4>
              </div>
              <div className="space-y-2">
                {courses.completed.map((course, index) => (
                  <div key={index} className="flex items-center p-2 rounded-lg bg-base-200/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-sm">{course}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
