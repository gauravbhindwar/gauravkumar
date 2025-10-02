'use client'

import { useTheme } from './theme-provider'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import { FaSun, FaMoon, FaMusic, FaFileDownload, FaHome, FaPaintBrush, FaCircle, FaArrowRight, FaStar, FaLaptopCode, FaRobot, FaRocket } from 'react-icons/fa'
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import Link from 'next/link'
import useFetch from '@/hooks/useFetch'

// Resume View Toggle Component
const ResumeViewToggle = ({ onResumeTypeChange, currentType = 'both' }) => {
  const [resumeType, setResumeType] = useState(currentType)
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = (type) => {
    setResumeType(type)
    setIsOpen(false)
    if (onResumeTypeChange) {
      onResumeTypeChange(type)
    }
  }

  const resumeOptions = [
    {
      key: 'fullstack',
      label: 'Full Stack',
      icon: FaLaptopCode,
      description: 'MERN, Next.js, System Design',
      color: 'text-blue-500'
    },
    {
      key: 'ai',
      label: 'AI Engineer',
      icon: FaRobot,
      description: 'GenAI, LLM, ML',
      color: 'text-purple-500'
    },
    {
      key: 'both',
      label: 'Complete',
      icon: FaRocket,
      description: 'Full Portfolio',
      color: 'text-green-500'
    }
  ]

  const currentOption = resumeOptions.find(option => option.key === resumeType) || resumeOptions[2]

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-base-200/80 hover:bg-base-300/80 
                   rounded-lg transition-all duration-200 backdrop-blur-sm border border-base-300/50
                   text-sm font-medium text-base-content"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <currentOption.icon className={`h-4 w-4 ${currentOption.color}`} />
        <span className="hidden sm:inline">{currentOption.label}</span>
        <FiChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-72 bg-base-100/95 backdrop-blur-lg 
                       rounded-xl shadow-lg border border-base-300/50 p-4 z-50"
          >
            <div className="text-sm text-base-content/80 mb-3 font-medium">
              Customize Portfolio View
            </div>
            <div className="space-y-2">
              {resumeOptions.map((option) => (
                <motion.button
                  key={option.key}
                  onClick={() => handleToggle(option.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                             ${resumeType === option.key 
                               ? 'bg-primary/10 border border-primary/20 text-primary' 
                               : 'hover:bg-base-200/80 border border-transparent'
                             }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <option.icon className={`h-5 w-5 ${option.color}`} />
                  <div className="text-left">
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-base-content/60">{option.description}</div>
                  </div>
                  {resumeType === option.key && (
                    <motion.div
                      layoutId="selected"
                      className="ml-auto w-2 h-2 bg-primary rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Throttle function for performance optimization
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }
}

// Custom hook for section detection
const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('')
  const sectionsRef = useRef([]);
  
  useEffect(() => {
    // Cache all sections to avoid DOM queries on every scroll
    sectionsRef.current = Array.from(document.querySelectorAll('section[id]'));
    
    const updateActiveSection = throttle(() => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      // Use cached sections and find active one
      let currentSection = '';
      
      for (const section of sectionsRef.current) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          // Special handling for last section (contact)
          if (section.id === 'contact' && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
            currentSection = 'contact';
          } else {
            currentSection = section.id;
          }
          break; // Stop the loop when we find the active section
        }
      }
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    }, 100); // 100ms throttle
    
    // Call on mount and scroll
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    
    // Only update on significant window resize
    const resizeHandler = throttle(() => {
      // Recalculate section positions on resize
      sectionsRef.current = Array.from(document.querySelectorAll('section[id]'));
      updateActiveSection();
    }, 250); // 250ms throttle for resize
    
    window.addEventListener('resize', resizeHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [activeSection]); // Dependency on activeSection

  return activeSection;
}

const AnimatedNotes = () => (
  <div className="flex justify-center gap-1">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: [0, 1, 0],
          y: [-10, -20],
          x: [0, i === 0 ? -5 : i === 2 ? 5 : 0]
        }}
        transition={{
          duration: 2,
          delay: i * 0.2,
          repeat: Infinity,
          repeatDelay: 0.5
        }}
      >
        <FaMusic className="text-primary w-3 h-3" />
      </motion.div>
    ))}
  </div>
)

// Enhanced Theme Toggle Component with Animation Options
const ThemeToggleWithAnimations = ({ toggleTheme, theme }) => {
  const [showOptions, setShowOptions] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const pressTimer = useRef(null)

  const animationOptions = [
    { 
      type: 'brush', 
      name: 'Brush Paint', 
      icon: FaPaintBrush, 
      color: 'text-orange-500',
      description: 'Paint brush stroke effect'
    },
    { 
      type: 'ripple', 
      name: 'Ripple Wave', 
      icon: FaCircle, 
      color: 'text-blue-500',
      description: 'Expanding ripple circles'
    },
    { 
      type: 'slide', 
      name: 'Slide Panel', 
      icon: FaArrowRight, 
      color: 'text-green-500',
      description: 'Sliding geometric shapes'
    },
    { 
      type: 'morph', 
      name: 'Shape Morph', 
      icon: FaStar, 
      color: 'text-purple-500',
      description: 'Morphing central shape'
    }
  ]

  const handleMouseDown = () => {
    setIsPressed(true)
    pressTimer.current = setTimeout(() => {
      if (isPressed) {
        setShowOptions(true)
      }
    }, 500) // Long press duration
  }

  const handleMouseUp = () => {
    setIsPressed(false)
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      if (!showOptions) {
        // Quick click - use default brush animation
        toggleTheme('brush')
      }
    }
  }

  const handleAnimationSelect = (animationType) => {
    setShowOptions(false)
    toggleTheme(animationType)
  }

  useEffect(() => {
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      <motion.button 
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsPressed(false)
          if (pressTimer.current) clearTimeout(pressTimer.current)
        }}
        className="p-2.5 rounded-xl bg-base-200/50 backdrop-blur-sm relative overflow-hidden group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Long press indicator */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isPressed ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: 'left' }}
        />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0, rotateZ: -45, scale: 0.8 }}
            animate={{ opacity: 1, rotateZ: 0, scale: 1 }}
            exit={{ opacity: 0, rotateZ: 45, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="relative z-10"
          >
            {theme === 'dark' ? (
              <FaSun className="w-5 h-5 text-yellow-400 drop-shadow-sm" />
            ) : (
              <FaMoon className="w-5 h-5 text-slate-600 drop-shadow-sm" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Hover hint */}
        <motion.div
          className="absolute -top-2 -right-2 w-2 h-2 bg-primary rounded-full"
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.7, 1, 0.7] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>

      {/* Animation Options Dropdown */}
      <AnimatePresence>
        {showOptions && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOptions(false)}
            />
            
            {/* Options Menu */}
            <motion.div
              className="absolute top-14 right-0 w-72 bg-base-100 rounded-2xl shadow-2xl border border-base-content/10 overflow-hidden z-50"
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="p-4">
                <h3 className="text-sm font-semibold text-base-content/80 mb-3 flex items-center gap-2">
                  <FaPaintBrush className="w-4 h-4 text-primary" />
                  Choose Animation Style
                </h3>
                
                <div className="space-y-2">
                  {animationOptions.map((option, index) => (
                    <motion.button
                      key={option.type}
                      onClick={() => handleAnimationSelect(option.type)}
                      className="w-full p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors text-left group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-base-100 ${option.color} group-hover:scale-110 transition-transform`}>
                          <option.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{option.name}</div>
                          <div className="text-xs text-base-content/60">{option.description}</div>
                        </div>
                        <motion.div
                          className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100"
                          whileHover={{ scale: 1.5 }}
                          transition={{ type: "spring" }}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                <div className="mt-4 pt-3 border-t border-base-content/10">
                  <p className="text-xs text-base-content/50 text-center">
                    💡 Quick tap for brush effect, long press for options
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar({ onResumeTypeChange, currentResumeType = 'both' }) {
  const { theme, toggleTheme } = useTheme()
  const activeSection = useActiveSection()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState('none') // Track scroll direction
  const [currentSection, setCurrentSection] = useState('')
  const [lastScrollY, setLastScrollY] = useState(0) // Store last scroll position
  const { data: contactData, loading, error } = useFetch('/api/contact')
  
  const navItems = [
    { href: '#home', label: 'Home', id: 'home', icon: FaHome },
    { href: '#experience', label: 'Experience', id: 'experience' },
     { href: '#projects', label: 'Projects', id: 'projects' },
      { href: '#skills', label: 'Skills', id: 'skills' },
    { href: '#education', label: 'Education', id: 'education' },
    { href: '#certifications', label: 'Certifications', id: 'certifications' },
    { href: '#achievements-awards', label: 'Achievements', id: 'achievements-awards' },
    { href: '#contact', label: 'Contact', id: 'contact' }
  ]
  const downloadResume = () => {
    // Use the resume link from contact data with error handling
    if (contactData && contactData.resumeLink) {
      window.open(contactData.resumeLink, '_blank', 'noopener,noreferrer')
    } else if (!loading && !error) {
      // If not loading and no error but still no data
      console.warn('Resume link not available')
    }
  }
  
  useEffect(() => {
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (currentScrollY / totalScroll) * 100;
      
      // Determine scroll direction with a small threshold to avoid flickering
      if (currentScrollY > lastScrollY + 5) {
        if (scrollDirection !== 'down') setScrollDirection('down');
      } else if (currentScrollY < lastScrollY - 5) {
        if (scrollDirection !== 'up') setScrollDirection('up');
      }
      
      // Update last scroll position
      setLastScrollY(currentScrollY);
      
      // Only update state if there's a significant change
      setScrollProgress(prev => {
        const diff = Math.abs(prev - currentProgress);
        return diff > 1 ? currentProgress : prev;
      });
      
      // Use a threshold to avoid constant re-renders
      setIsScrolled(currentScrollY > 10);
    }, 50); // 50ms throttle for smooth progress updates

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, scrollDirection]);
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    setIsOpen(false);
    
    // No need for setTimeout, let's do it directly
    const element = document.querySelector(href);
    if (element) {
      const yOffset = -100; // Increased offset for new navbar height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      const sectionId = href.replace('#', '');
      setCurrentSection(sectionId);
      
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  useEffect(() => {
    if (activeSection) {
      setCurrentSection(activeSection)
    }
  }, [activeSection])

  return (
    <>
      {/* Scroll Progress Bar */}
      <AnimatePresence>
        {scrollDirection === 'down' && (
          <motion.div 
            className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-gradient-to-r from-transparent via-base-content/10 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
              style={{ 
                width: `${scrollProgress}%`
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${scrollProgress}%` }}
              transition={{ 
                duration: 0.1,
                ease: "linear"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Navbar */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'py-2 backdrop-blur-xl bg-base-100/90 shadow-xl border-b border-base-content/10' 
            : 'py-4 bg-base-100/80 backdrop-blur-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 300,
          damping: 30
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <motion.a 
              href="#home"
              className="text-xl md:text-2xl font-bold relative group shrink-0 flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              onClick={(e) => handleNavClick(e, '#home')}
            >
              <div className="relative">
                <FaHome className="text-primary w-6 h-6" />
                {currentSection === 'home' && (
                  <motion.div
                    className="absolute -inset-1 bg-primary/20 rounded-full blur-sm"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Gaurav Kumar
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Resume View Toggle */}
              <ResumeViewToggle 
                onResumeTypeChange={onResumeTypeChange}
                currentType={currentResumeType}
              />

              {/* Navigation Links */}
              <div className="bg-base-200/40 backdrop-blur-sm rounded-2xl p-1.5 border border-base-300/30">
                <ul className="flex items-center gap-1 relative">
                  {navItems.slice(1).map((item) => ( // Skip home since it's in logo
                    <motion.li key={item.id}>
                      <a 
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="relative px-3 py-2 rounded-xl block transition-all group"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {currentSection === item.id && (
                            <motion.span
                              layoutId="navActive"
                              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl border border-primary/30"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </AnimatePresence>
                        <div className="relative z-10 flex items-center gap-2">
                          <span className={`transition-colors duration-200 text-sm font-medium ${
                            currentSection === item.id 
                              ? 'text-primary' 
                              : 'hover:text-primary/80 text-base-content/80'
                          }`}>
                            {item.label}
                          </span>
                        </div>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Download Resume Button */}
                <motion.button 
                  onClick={downloadResume}
                  className="relative px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary 
                            hover:from-primary/90 hover:to-secondary/90 text-white
                            flex items-center gap-2 text-sm font-medium transition-all duration-200 
                            shadow-lg hover:shadow-xl hover:shadow-primary/25"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading || !contactData}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <FaFileDownload className="w-4 h-4" />
                  )}
                  <span>Resume</span>
                </motion.button>

                {/* Theme Toggle */}
                <ThemeToggleWithAnimations toggleTheme={toggleTheme} theme={theme} />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <ResumeViewToggle 
                onResumeTypeChange={onResumeTypeChange}
                currentType={currentResumeType}
              />
              
              <motion.button 
                className="p-2.5 rounded-xl hover:bg-base-200/50 transition-colors menu-button"
                onClick={() => setIsOpen(prev => !prev)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isOpen ? 'close' : 'open'}
                    initial={{ opacity: 0, rotate: isOpen ? 45 : -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: isOpen ? -45 : 45 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden absolute inset-x-0 top-full bg-base-100/95 backdrop-blur-xl 
                        border-b border-base-content/10 shadow-2xl mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1, 
                height: 'auto', 
                transition: { 
                  opacity: { duration: 0.2 },
                  height: { duration: 0.3, ease: "easeOut" }
                } 
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                transition: { 
                  opacity: { duration: 0.15 },
                  height: { duration: 0.2, ease: "easeIn" }
                }
              }}
              style={{ 
                maxHeight: 'calc(100vh - 80px)',
                overflowY: 'auto'
              }}
            >
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          currentSection === item.id
                            ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20'
                            : 'hover:bg-base-200/70'
                        }`}
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}
                        <span className="text-base font-medium">{item.label}</span>
                        {currentSection === item.id && (
                          <motion.div 
                            className="ml-auto"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          </motion.div>
                        )}
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <div className="space-y-4">
                  {/* Mobile Download Button */}
                  <motion.button
                    onClick={downloadResume}
                    disabled={loading || !contactData}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl 
                              bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 
                              text-white transition-all duration-200 shadow-lg font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <FaFileDownload className="w-5 h-5" />
                    )}
                    <span>Download Resume</span>
                  </motion.button>

                  {/* Mobile Theme Toggle */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (navItems.length + 1) * 0.05 }}
                    className="flex justify-center"
                  >
                    <ThemeToggleWithAnimations toggleTheme={toggleTheme} theme={theme} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
