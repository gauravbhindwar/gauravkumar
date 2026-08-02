import ConditionalNavbar from '@/components/ConditionalNavbar'
import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'
import Certifications from '@/components/sections/Certifications'
import { DeferredSkillsEducation, DeferredAchievementsContactAdmin } from '@/components/DeferredSections'
import getSupabase from '@/lib/supabase'
import { rowToClient } from '@/lib/dbMapper'

async function getContact() {
  try {
    const { data } = await getSupabase().from('contact').select('*').limit(1).maybeSingle()
    if (data) return rowToClient(data)
  } catch (error) {
    console.error('Error fetching contact information:', error)
  }
  const fallback = await import('@/data/contact.json')
  return fallback.default
}

export default async function Home() {
  const contact = await getContact()

  return (
    <main className="min-h-screen bg-base-100 text-base-content selection:bg-primary selection:text-primary-content">
      <ConditionalNavbar />

      <Hero contact={contact} />
      <Experience />
      <Projects />
      <DeferredSkillsEducation />
      <Certifications />
      <DeferredAchievementsContactAdmin />
    </main>
  )
}
