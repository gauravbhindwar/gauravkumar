'use client'

import dynamic from 'next/dynamic'

// Without a `loading` fallback, next/dynamic renders nothing at all until
// the chunk downloads - the section's height collapses to 0, then snaps
// open once it mounts. That snap is what shows up as a "glitch" in
// whatever is scrolled near it (e.g. the Projects/Skills boundary).
// Reserving roughly the right height up front makes the mount smooth.
const SectionSkeleton = () => (
  <div className="py-24">
    <div className="container mx-auto px-4">
      <div className="animate-pulse h-96 bg-base-200/50 rounded-none" />
    </div>
  </div>
)

const Skills = dynamic(() => import('@/components/sections/Skills'), { ssr: false, loading: SectionSkeleton })
const Education = dynamic(() => import('@/components/sections/Education'), { ssr: false, loading: SectionSkeleton })
const Achievements = dynamic(() => import('@/components/sections/Achievements'), { ssr: false, loading: SectionSkeleton })
const GithubActivity = dynamic(() => import('@/components/sections/GithubActivity'), { ssr: false })
const Contact = dynamic(() => import('@/components/sections/Contact'), { ssr: false, loading: SectionSkeleton })
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
      <GithubActivity />
      <Contact />
      <AdminAccess />
    </>
  )
}
