'use client'

import dynamic from 'next/dynamic'
import ConditionalNavbar from '@/components/ConditionalNavbar'

const Hero = dynamic(() => import('@/components/sections/Hero'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-base-100" />
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
  return (
    <main className="min-h-screen bg-base-100 text-base-content selection:bg-primary selection:text-primary-content">
      <ConditionalNavbar />
      
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Certifications />
      <Achievements />
      <Contact />
      <AdminAccess />
    </main>
  )
}
