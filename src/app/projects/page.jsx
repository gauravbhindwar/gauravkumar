import React from 'react'
import ViewAllProjects from '../../components/sections/ViewAllProjects'

export const metadata = {
  title: 'Projects',
  description:
    "Full stack and AI/GenAI projects by Gaurav Kumar - Next.js, React, Node.js, and AI-driven applications including Turnstile, MentorLink, EventHorizon, and more.",
  alternates: {
    canonical: '/projects',
  },
}

const page = () => {
  return (
    <ViewAllProjects />
  )
}

export default page
