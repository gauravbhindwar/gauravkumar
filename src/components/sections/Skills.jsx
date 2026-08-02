'use client'

import { motion } from 'framer-motion'
import * as SimpleIcons from 'simple-icons'
import { FaCode } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'
import { SkillsSkeleton } from '@/components/ui/SkeletonCard'
import SectionHeading from '@/components/ui/SectionHeading'

export default function Skills() {
  const { data: skillsData, loading, error } = useFetch('/api/skills', {
    revalidate: 600000 // 10 minutes cache
  })

  if (loading) {
    return (
      <section id="skills" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-base-100"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              icon={FaCode}
              eyebrow="CAPABILITIES_MATRIX"
              title="Technical Skills"
            />
            <SkillsSkeleton />
          </div>
        </div>
      </section>
    )
  }

  if (error || !skillsData) {
    return (
      <section id="skills" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="font-mono text-error uppercase tracking-widest">[ SYS.ERROR: FAILED_TO_LOAD_SKILLS ]</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <SectionHeading
            icon={FaCode}
            eyebrow="CAPABILITIES_MATRIX"
            title="Technical Skills"
            description="Comprehensive overview of my technical expertise, programming languages, and specialized tools."
          />

          <TechnicalSkills skillsData={skillsData} />
        </motion.div>
      </div>
    </section>
  )
}

function TechnicalSkills({ skillsData }) {
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
    
    const frontend = category.skills.filter(skill => frontendSkills.includes(skill.name));
    const backend = category.skills.filter(skill => backendSkills.includes(skill.name));
    const aiTech = category.skills.filter(skill => aiTechSkills.includes(skill.name));
    
    return { frontend, backend, aiTech };
  };

  return (
    <div className="space-y-12">
      {/* Web Development Section */}
      {skillsData.categories.map((category) => {
        if (category.name === "Web Development") {
          const webDevSkills = getWebDevSkills(category);
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Frontend Section */}
                <div className="bg-base-200/30 p-6 border border-base-content/10 relative group hover:border-primary/50 transition-all duration-300 hover:bg-base-200/50">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <h4 className="font-mono text-xs text-primary uppercase tracking-widest mb-6">
                    [ SYS.FRONTEND ]
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {webDevSkills.frontend.map((skill, index) => (
                      <SkillBadge key={skill.name} skill={skill} index={index} />
                    ))}
                  </div>
                </div>
                
                {/* Backend Section */}
                <div className="bg-base-200/30 p-6 border border-base-content/10 relative group hover:border-secondary/50 transition-all duration-300 hover:bg-base-200/50">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <h4 className="font-mono text-xs text-secondary uppercase tracking-widest mb-6">
                    [ SYS.BACKEND ]
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {webDevSkills.backend.map((skill, index) => (
                      <SkillBadge key={skill.name} skill={skill} index={index} />
                    ))}
                  </div>
                </div>

                {/* AI Technology Section */}
                <div className="bg-base-200/30 p-6 border border-base-content/10 relative group hover:border-accent/50 transition-all duration-300 hover:bg-base-200/50">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <h4 className="font-mono text-xs text-accent uppercase tracking-widest mb-6">
                    [ SYS.AI_INNOVATION ]
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {webDevSkills.aiTech.map((skill, index) => (
                      <SkillBadge key={skill.name} skill={skill} index={index} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }
        return null;
      })}
      
      {/* Other Skill Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <div className="bg-base-200/30 p-6 border border-base-content/10 relative group hover:border-base-content/30 transition-all duration-300 hover:bg-base-200/50 h-full">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-base-content/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-base-content/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <h4 className="font-mono text-xs text-base-content/70 uppercase tracking-widest mb-6">
                  [ SYS.{category.name.toUpperCase().replace(/\s+/g, '_')} ]
                </h4>

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
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className="group/badge"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-base-100/50 border border-base-content/10 
                    hover:border-base-content/30 hover:bg-base-200 transition-all duration-300 cursor-default">
        {Icon && (
          <svg
            className="w-3.5 h-3.5 transition-transform duration-300 group-hover/badge:scale-110"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: skill.color || 'currentColor' }}
          >
            <path d={Icon.path} />
          </svg>
        )}
        <span className="text-[10px] font-mono uppercase tracking-widest text-base-content/80 group-hover/badge:text-base-content">{skill.name}</span>
      </div>
    </motion.div>
  )
}

