'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useTheme } from '../theme-provider'
import Image from 'next/image'
import { ReactTyped } from 'react-typed'
import useFetch from '@/hooks/useFetch'
import { useState, useEffect } from 'react'
import { FiGithub, FiLinkedin, FiMail, FiDownload, FiArrowRight, FiCode, FiBriefcase, FiStar } from 'react-icons/fi'

export default function Hero() {
  const { reducedMotion } = useTheme()
  const { data: contactData, loading: contactLoading } = useFetch('/api/contact')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  
  const transition = {
    type: reducedMotion ? "tween" : "spring",
    duration: reducedMotion ? 0.15 : 0.5,
    stiffness: 260,
    damping: 20
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-20 md:pt-24">
      {/* Dynamic Background with Particles */}
      <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30">
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/15 rounded-full blur-3xl"
          animate={{
            x: [-50, 50, -50],
            y: [-30, 30, -30],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Interactive cursor follower */}
        <motion.div
          className="absolute w-6 h-6 bg-primary/20 rounded-full blur-sm pointer-events-none"
          animate={{
            x: mousePosition.x - 12,
            y: mousePosition.y - 12,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />
      </div>

      {/* Main Content */}
      <motion.div 
        className="container mx-auto px-4 sm:px-6 relative z-10 min-h-screen flex items-center"
        style={{ y, opacity }}
      >
        <div className="w-full">
          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column - Text Content */}
            <motion.div
              className="space-y-8 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Status Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full text-success font-medium"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                Available for Opportunities
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-4">
                <motion.h1 
                  className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <span className="block text-base-content">Hello, I'm</span>
                  <motion.span 
                    className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                    animate={{ 
                      backgroundPosition: ['0%', '100%', '0%'] 
                    }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                    style={{
                      backgroundSize: '200% 100%'
                    }}
                  >
                    Gaurav Kumar
                  </motion.span>
                </motion.h1>

                {/* Animated Role */}
                <motion.div 
                  className="text-xl md:text-2xl lg:text-3xl font-light text-base-content/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <ReactTyped
                    strings={[
                      'Full-Stack Developer 🚀',
                      'AI/ML Engineer 🤖',
                      'Data Science Enthusiast 📊',
                      'Software Architect 🏗️',
                      'Problem Solver 💡'
                    ]}
                    typeSpeed={80}
                    backSpeed={50}
                    loop
                    className="text-secondary font-medium"
                  />
                </motion.div>
              </div>

              {/* Bio Text */}
              <motion.p 
                className="text-lg md:text-xl text-base-content/70 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Passionate software engineer crafting innovative solutions with{' '}
                <span className="text-primary font-semibold hover:text-primary/80 transition-colors">
                  cutting-edge technologies
                </span>
                . Specialized in full-stack development, AI/ML, and scalable system architecture.
              </motion.p>

              {/* Tech Stack Pills */}
              <motion.div 
                className="flex flex-wrap gap-3 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                {[
                  { name: 'React/Next.js', color: 'primary' },
                  { name: 'Node.js', color: 'success' },
                  { name: 'Python', color: 'info' },
                  { name: 'AI/ML', color: 'secondary' },
                  { name: 'MongoDB', color: 'accent' },
                ].map((tech, index) => (
                  <motion.span
                    key={tech.name}
                    className={`px-4 py-2 bg-${tech.color}/10 border border-${tech.color}/20 text-${tech.color} 
                               rounded-full text-sm font-medium hover:bg-${tech.color}/20 transition-all duration-300
                               cursor-pointer`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 + (index * 0.1) }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tech.name}
                  </motion.span>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <motion.a
                  href="#contact"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-content 
                            rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 
                            shadow-lg hover:shadow-xl hover:shadow-primary/25"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiMail className="mr-2 h-5 w-5" />
                  Let's Work Together
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <FiArrowRight className="h-5 w-5" />
                  </motion.div>
                </motion.a>
                
                <motion.a
                  href="#projects"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-base-content/20 
                            text-base-content rounded-xl font-semibold hover:border-primary hover:text-primary 
                            transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiCode className="mr-2 h-5 w-5" />
                  View My Work
                </motion.a>
              </motion.div>

              {/* Social Links */}
              <motion.div 
                className="flex gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                {[
                  { icon: FiGithub, href: contactData?.github || '#', label: 'GitHub' },
                  { icon: FiLinkedin, href: contactData?.linkedin || '#', label: 'LinkedIn' },
                  { icon: FiDownload, href: contactData?.resumeLink || '#', label: 'Resume' },
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-base-200/50 hover:bg-primary hover:text-primary-content 
                              rounded-xl transition-all duration-300 backdrop-blur-sm border border-base-300/30
                              hover:border-primary hover:shadow-lg"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    title={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Image & Stats */}
            <motion.div
              className="relative flex flex-col items-center space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Profile Image with Floating Elements */}
              <div className="relative">
                {/* Main Image Container */}
                <motion.div 
                  className="relative w-80 h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden 
                            shadow-2xl shadow-primary/20"
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {contactLoading ? (
                    <div className="w-full h-full" />
                  ) : contactData?.homeImage ? (
                    <Image
                      src={contactData.homeImage}
                      alt="Gaurav Kumar - Software Engineer"
                      fill
                      priority
                      sizes="(max-width: 768px) 320px, 384px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-base-200/50 flex items-center justify-center">
                      <span className="text-base-content/30 text-sm">No Image</span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
                  
                  {/* Border Animation */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2"
                    animate={{
                      borderColor: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--primary))']
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </motion.div>

                {/* Floating Stats Cards */}
                <motion.div 
                  className="absolute -top-6 -right-6 bg-base-100/90 backdrop-blur-sm rounded-2xl p-4 
                            shadow-lg border border-base-300/50"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">30+</div>
                    <div className="text-xs text-base-content/60">Projects</div>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-base-100/90 backdrop-blur-sm rounded-2xl p-4 
                            shadow-lg border border-base-300/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">5+</div>
                    <div className="text-xs text-base-content/60">Years Exp</div>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute top-1/2 -left-8 bg-base-100/90 backdrop-blur-sm rounded-2xl p-3 
                            shadow-lg border border-base-300/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <FiStar className="h-6 w-6 text-accent" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Achievement Section */}
          <motion.div
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            {[
              { number: '30+', label: 'Projects Completed', icon: FiCode },
              { number: '5+', label: 'Years Experience', icon: FiBriefcase },
              { number: '15+', label: 'Technologies', icon: FiStar },
              { number: '24/7', label: 'Availability', icon: FiMail },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="group p-6 bg-base-100/50 backdrop-blur-sm rounded-2xl border border-base-300/30
                          hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + (index * 0.1) }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary group-hover:text-secondary transition-colors" />
                <div className="text-3xl font-bold text-base-content mb-2">{stat.number}</div>
                <div className="text-sm text-base-content/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
