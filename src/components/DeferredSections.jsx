'use client'

import dynamic from 'next/dynamic'

const Skills = dynamic(() => import('@/components/sections/Skills'), { ssr: false })
const Education = dynamic(() => import('@/components/sections/Education'), { ssr: false })
const Achievements = dynamic(() => import('@/components/sections/Achievements'), { ssr: false })
const Contact = dynamic(() => import('@/components/sections/Contact'), { ssr: false })
const AdminAccess = dynamic(() => import('@/components/AdminAccess'), { ssr: false })

export function DeferredSkillsEducation() {
  return (
    <>
      <Skills />
      <Education />
    </>
  )
}

export function DeferredAchievementsContactAdmin() {
  return (
    <>
      <Achievements />
      <Contact />
      <AdminAccess />
    </>
  )
}
