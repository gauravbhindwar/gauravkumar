'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { FiArrowRight, FiGithub, FiLinkedin, FiDownload } from 'react-icons/fi'
import InterstellarCanvas from '@/components/canvas/InterstellarCanvas'
import ResumePreview from '@/components/ResumePreview'

export default function Hero({ contact }) {
  const contactData = contact

  // 3D Tilt Logic for Portrait
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const xPct = (e.clientX - rect.left) / rect.width - 0.5 // -0.5 to 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5 // -0.5 to 0.5
    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig)

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center bg-base-100 overflow-x-hidden pt-16"
    >
      {/* Cinematic Interstellar Deep Space Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <InterstellarCanvas />
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10 w-full h-full py-12 lg:py-0 flex flex-col justify-center pointer-events-none">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10 pointer-events-auto mt-4 lg:mt-0 mb-8 lg:mb-0">
          
          {/* Left Side: Creative Typography */}
          <motion.div 
            className="flex-1 flex flex-col justify-center space-y-3 lg:space-y-4 text-center lg:text-left mt-2 lg:mt-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-base-300/40 border border-base-content/10 backdrop-blur-md w-fit mx-auto lg:mx-0 shadow-lg">
              <span className="relative flex h-2.5 w-2.5 lg:h-3 lg:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 lg:h-3 lg:w-3 bg-accent"></span>
              </span>
              <span className="text-[10px] lg:text-xs font-sans font-medium text-base-content/80 tracking-widest uppercase">
                Available for New Opportunities
              </span>
            </div>

            <div className="space-y-1 relative">
              <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5rem] font-display font-extrabold leading-[0.9] tracking-tighter text-base-content drop-shadow-2xl">
                Gaurav<br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary relative">
                  Kumar.
                  {/* Decorative underline */}
                  <svg className="absolute w-full h-3 lg:h-4 -bottom-1 lg:-bottom-2 left-0 text-secondary/30" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0 10 Q 50 20 100 10" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>
              </h1>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-4 pt-1 lg:pt-2">
              <div className="hidden lg:block h-[1px] w-12 bg-base-content/30"></div>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-sans font-light text-base-content/80 tracking-widest uppercase">
                Software Architect <span className="text-accent font-bold mx-1">×</span> AI Engineer
              </p>
            </div>

            <p className="text-xs sm:text-sm md:text-base font-sans text-base-content/70 max-w-lg mx-auto lg:mx-0 leading-relaxed drop-shadow-sm border-l-2 border-primary/30 pl-3 lg:pl-4 ml-1 lg:ml-2">
              Crafting sophisticated digital experiences with precise engineering. 
              Specializing in scalable architecture, intelligent systems, and modern web development.
            </p>

            {/* Quick Statistics */}
            <motion.div 
              className="flex items-center justify-center lg:justify-start gap-4 lg:gap-8 pt-2 pb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-display font-bold text-primary drop-shadow-[0_0_15px_rgba(255,175,211,0.5)]">2+</span>
                <span className="text-[9px] sm:text-[0.6rem] font-sans uppercase tracking-widest text-base-content/60 mt-0.5 sm:mt-1">Years Exp</span>
              </div>
              <div className="w-[1px] h-5 lg:h-6 bg-base-content/10"></div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-display font-bold text-secondary drop-shadow-[0_0_15px_rgba(221,183,255,0.5)]">6+</span>
                <span className="text-[9px] sm:text-[0.6rem] font-sans uppercase tracking-widest text-base-content/60 mt-0.5 sm:mt-1">Projects</span>
              </div>
              <div className="w-[1px] h-5 lg:h-6 bg-base-content/10"></div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-display font-bold text-accent drop-shadow-[0_0_15px_rgba(60,221,199,0.5)]">5+</span>
                <span className="text-[9px] sm:text-[0.6rem] font-sans uppercase tracking-widest text-base-content/60 mt-0.5 sm:mt-1">Technologies</span>
              </div>
            </motion.div>

            {/* Floating Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 lg:gap-3 justify-center lg:justify-start pt-1 lg:pt-2">
              {['React / Next.js', 'Node.js', 'Python', 'AI / ML', 'AWS', 'Docker'].map((tech, i) => (
                <motion.span 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="px-4 py-2 bg-base-100 border-2 border-primary/50 text-base-content/90 text-xs font-mono font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all duration-200 shadow-[3px_3px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            <div className="pt-3 lg:pt-4 flex flex-col sm:flex-row items-center gap-3 lg:gap-4 justify-center lg:justify-start">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 px-4 py-2 lg:px-6 lg:py-3 bg-base-100 border-2 border-primary text-primary font-mono text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-200 shadow-[4px_4px_0px_0px_currentColor] lg:shadow-[6px_6px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[4px] lg:hover:translate-x-[6px] hover:translate-y-[4px] lg:hover:translate-y-[6px]"
              >
                  INITIATE_CONTACT
                  <FiArrowRight className="h-3 w-3 lg:h-4 lg:w-4 transition-transform group-hover:translate-x-2" />
              </a>

              {/* Minimal Social Links */}
              <div className="flex items-center gap-3 lg:gap-4">
                {[
                  { icon: FiGithub, href: contactData?.github, color: 'hover:text-primary hover:border-primary' },
                  { icon: FiLinkedin, href: contactData?.linkedin, color: 'hover:text-secondary hover:border-secondary' },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className={`group p-2 lg:p-3 bg-base-100 border-2 border-base-content/50 text-base-content font-mono transition-all duration-200 shadow-[3px_3px_0px_0px_currentColor] lg:shadow-[4px_4px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[3px] lg:hover:translate-x-[4px] hover:translate-y-[3px] lg:hover:translate-y-[4px] ${item.color}`}
                  >
                    <item.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform group-hover:scale-110" />
                  </a>
                ))}
                <ResumePreview
                  resumeUrl={contactData?.resumeLink}
                  onTriggerClick={() => window.open(contactData?.resumeLink || '#', '_blank', 'noopener,noreferrer')}
                  triggerClassName="group p-2 lg:p-3 bg-base-100 border-2 border-base-content/50 text-base-content font-mono transition-all duration-200 shadow-[3px_3px_0px_0px_currentColor] lg:shadow-[4px_4px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[3px] lg:hover:translate-x-[4px] hover:translate-y-[3px] lg:hover:translate-y-[4px] hover:text-accent hover:border-accent"
                >
                  <FiDownload className="w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform group-hover:scale-110" />
                </ResumePreview>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Brutalist Tech Portrait */}
          <motion.div 
            className="flex-1 flex justify-center lg:justify-end items-center perspective-1000 cursor-none"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div 
              className="relative w-[180px] h-[220px] sm:w-[220px] sm:h-[280px] md:w-[260px] md:h-[340px] lg:w-[320px] lg:h-[420px] group"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Technical Brackets */}
              <div className="absolute -top-3 -left-3 lg:-top-4 lg:-left-4 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-l-2 lg:border-t-4 lg:border-l-4 border-base-content/40 transition-all duration-300 group-hover:border-primary group-hover:scale-110" style={{ transform: 'translateZ(20px)' }} />
              <div className="absolute -top-3 -right-3 lg:-top-4 lg:-right-4 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-r-2 lg:border-t-4 lg:border-r-4 border-base-content/40 transition-all duration-300 group-hover:border-primary group-hover:scale-110" style={{ transform: 'translateZ(20px)' }} />
              <div className="absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-l-2 lg:border-b-4 lg:border-l-4 border-base-content/40 transition-all duration-300 group-hover:border-primary group-hover:scale-110" style={{ transform: 'translateZ(20px)' }} />
              <div className="absolute -bottom-3 -right-3 lg:-bottom-4 lg:-right-4 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-r-2 lg:border-b-4 lg:border-r-4 border-base-content/40 transition-all duration-300 group-hover:border-primary group-hover:scale-110" style={{ transform: 'translateZ(20px)' }} />

              <div className="w-full h-full relative overflow-hidden bg-base-content/5 border border-base-content/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                {contactData?.homeImage ? (
                  <>
                    <Image
                      src={contactData.homeImage}
                      alt="Gaurav Kumar"
                      fill
                      priority
                      sizes="(max-width: 768px) 220px, (max-width: 1024px) 280px, 400px"
                      className="object-cover transition-all duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                    
                    {/* Scanning Glitch Overlay on Hover */}
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay z-10" />
                    
                    <motion.div 
                      className="absolute top-0 left-0 w-full h-[2px] bg-primary/80 shadow-[0_0_15px_rgba(255,175,211,1)] z-20"
                      initial={{ y: "0%", opacity: 0 }}
                      whileHover={{ y: ["0%", "480px", "0%"], opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-base-content/5 gap-3">
                    <svg className="w-12 h-12 lg:w-16 lg:h-16 text-base-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-[8px] lg:text-[10px] font-mono text-base-content/40 uppercase tracking-widest">Avatar Offline</span>
                  </div>
                )}
              </div>
              
              {/* Floating Tech Badge */}
              <motion.div 
                className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 lg:bottom-10 lg:-left-10 p-2 lg:p-3 bg-base-100 border-2 border-base-content flex items-center gap-2 lg:gap-3 shadow-[4px_4px_0_0_currentColor] z-30"
                style={{ transform: 'translateZ(60px)' }}
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center bg-primary text-base-100 font-display font-bold text-sm lg:text-lg border-2 border-base-content shadow-[2px_2px_0_0_currentColor]">
                  AI
                </div>
                <div className="flex flex-col pr-2 lg:pr-4">
                  <span className="text-[0.5rem] lg:text-[0.6rem] font-mono text-primary uppercase tracking-[0.2em] font-bold">Status: Online</span>
                  <span className="text-xs lg:text-sm font-mono font-bold text-base-content uppercase tracking-wider leading-none mt-1">AI Engineer</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
