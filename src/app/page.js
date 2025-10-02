'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import ConditionalNavbar from '@/components/ConditionalNavbar'

const Hero = dynamic(() => import('@/components/sections/Hero'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />
})

// Import these statically for debugging
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'

const Skills = dynamic(() => import('@/components/sections/Skills'), { ssr: false })
const Education = dynamic(() => import('@/components/sections/Education'), { ssr: false })
const Achievements = dynamic(() => import('@/components/sections/Achievements'), { ssr: false })
const Contact = dynamic(() => import('@/components/sections/Contact'), { ssr: false })
const AdminAccess = dynamic(() => import('@/components/AdminAccess'), { ssr: false })
import Certifications from '@/components/sections/Certifications'

export default function Home() {
  const [resumeType, setResumeType] = useState('both')

  const shouldShowSection = (sectionType) => {
    const show = (() => {
      if (resumeType === 'both') return true
      if (resumeType === 'fullstack' && ['experience', 'projects', 'skills', 'education'].includes(sectionType)) return true
      if (resumeType === 'ai' && ['projects', 'skills', 'education'].includes(sectionType)) return true
      return false
    })()
    console.log(`🔍 Page: Should show ${sectionType}? ${show} (resumeType: ${resumeType})`)
    return show
  }

  return (
    <main className="min-h-screen">
      <ConditionalNavbar 
        onResumeTypeChange={setResumeType}
        currentResumeType={resumeType}
      />
      
      <Hero />

      {shouldShowSection('experience') && <Experience />}
      {shouldShowSection('projects') && <Projects />}
      {shouldShowSection('skills') && <Skills />}
      {shouldShowSection('education') && <Education />}
      <Certifications />
      <Achievements />
      <Contact />
      <AdminAccess />
    </main>
  )
}
