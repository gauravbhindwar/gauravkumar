'use client'

import { useTheme } from './theme-provider'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import { FaSun, FaMoon, FaFileDownload } from 'react-icons/fa'
import { FiMenu, FiX } from 'react-icons/fi'
import useFetch from '@/hooks/useFetch'
import ResumePreview from './ResumePreview'

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

  useEffect(() => {
    const updateActiveSection = throttle(() => {
      // Query sections inside the handler to catch dynamically loaded components
      const sections = Array.from(document.querySelectorAll('section[id]'));
      const scrollPosition = window.scrollY + window.innerHeight / 3; // Trigger slightly earlier
      let currentSection = '';

      for (const section of sections) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          if (section.id === 'contact' && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
            currentSection = 'contact';
          } else {
            currentSection = section.id;
          }
          break;
        }
      }
      
      setActiveSection(currentSection);
    }, 100);

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });
    
    // Also run periodically for a few seconds to catch dynamic imports loading
    const intervalId = setInterval(updateActiveSection, 1000);
    setTimeout(() => clearInterval(intervalId), 10000);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array to prevent constant re-binding

  return activeSection;
}

const ThemeToggle = ({ toggleTheme, theme }) => (
  <motion.button
    onClick={() => toggleTheme()}
    className="w-10 h-10 flex items-center justify-center border-2 border-base-content/20 bg-base-100 text-base-content hover:border-primary hover:text-primary shadow-none hover:shadow-[4px_4px_0px_0px_currentColor] hover:-translate-y-1 hover:-translate-x-1 transition-all"
    whileTap={{ scale: 0.95 }}
    aria-label="Toggle theme"
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={theme}
        initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        {theme === 'dark' ? (
          <FaSun className="w-5 h-5 text-primary" />
        ) : (
          <FaMoon className="w-5 h-5 text-base-content" />
        )}
      </motion.div>
    </AnimatePresence>
  </motion.button>
)

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const activeSection = useActiveSection()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentSection, setCurrentSection] = useState('')
  const { data: contactData, loading, error } = useFetch('/api/contact')

  const navItems = [
    { href: '#home', label: 'Home', id: 'home' },
    { href: '#experience', label: 'Experience', id: 'experience' },
    { href: '#projects', label: 'Projects', id: 'projects' },
    { href: '#skills', label: 'Skills', id: 'skills' },
    { href: '#education', label: 'Education', id: 'education' },
    { href: '#certifications', label: 'Certifications', id: 'certifications' },
    { href: '#achievements', label: 'Achievements', id: 'achievements' },
    { href: '#contact', label: 'Contact', id: 'contact' }
  ]

  const downloadResume = () => {
    if (contactData && contactData.resumeLink) {
      window.open(contactData.resumeLink, '_blank', 'noopener,noreferrer')
    } else if (!loading && !error) {
      console.warn('Resume link not available')
    }
  }

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 20);
    }, 50);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    setIsOpen(false);

    const element = document.querySelector(href);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      const sectionId = href.replace('#', '');
      setCurrentSection(sectionId);

      requestAnimationFrame(() => {
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    }
  }, []);

  useEffect(() => {
    if (activeSection) setCurrentSection(activeSection)
  }, [activeSection])

  return (
    <>
      <motion.nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ease-out px-4 ${
          isScrolled ? 'top-4' : 'top-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Brutalist Box */}
          <div className={`flex items-center justify-between p-2 lg:px-4 lg:py-2 transition-all duration-300 ${
            isScrolled 
              ? 'bg-base-100 border-2 border-base-content shadow-[6px_6px_0px_0px_currentColor]' 
              : 'bg-base-100/90 backdrop-blur-sm border-2 border-base-content/20 shadow-[4px_4px_0px_0px_currentColor]'
          }`}>
            
            {/* Logo / Brand (Desktop & Mobile) */}
            <a href="#home" className="flex items-center gap-2 px-2" onClick={(e) => handleNavClick(e, '#home')}>
              <span className="text-base-content font-mono font-bold text-xl tracking-widest uppercase">
                <span className="text-primary">{'>'}</span>GK_
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <ul className="flex items-center space-x-1">
                {navItems.map((item) => {
                  const isActive = currentSection === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`relative px-4 py-2 block transition-all font-mono text-xs font-bold uppercase tracking-widest whitespace-nowrap ${
                          isActive
                            ? 'bg-base-content text-base-100 shadow-[2px_2px_0px_0px_var(--color-primary)] translate-x-[-2px] translate-y-[-2px]'
                            : 'text-base-content hover:bg-base-200 hover:text-primary hover:shadow-[2px_2px_0px_0px_currentColor] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                        }`}
                      >
                        {isActive ? `[ ${item.label} ]` : item.label}
                      </a>
                    </li>
                  )
                })}
              </ul>

              {/* Separator */}
              <div className="w-[2px] h-6 bg-base-content/20 mx-4" />
              
              <div className="flex items-center gap-4">
                <ResumePreview
                  resumeUrl={contactData?.resumeLink}
                  onTriggerClick={downloadResume}
                  disabled={loading || !contactData}
                  triggerClassName="group relative px-6 py-2 bg-base-100 border-2 border-base-content text-base-content font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-[4px_4px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-base-content/30 border-t-base-content rounded-full animate-spin"></div>
                  ) : (
                    <FaFileDownload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  )}
                  <span>RESUME</span>
                </ResumePreview>
                <div className="border-l-2 border-base-content/20 pl-4">
                  <ThemeToggle toggleTheme={toggleTheme} theme={theme} />
                </div>
              </div>
            </div>

            {/* Mobile Navigation Header */}
            <div className="flex lg:hidden items-center gap-4">
              <ResumePreview
                resumeUrl={contactData?.resumeLink}
                onTriggerClick={downloadResume}
                triggerClassName="relative w-10 h-10 flex items-center justify-center border-2 border-base-content bg-base-100 text-base-content shadow-[2px_2px_0px_0px_currentColor] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              >
                <FaFileDownload className="w-4 h-4" />
              </ResumePreview>
              <button
                className="w-10 h-10 flex items-center justify-center border-2 border-primary bg-primary text-primary-content shadow-[2px_2px_0px_0px_var(--color-base-content)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                onClick={() => setIsOpen(prev => !prev)}
              >
                {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-base-100 border-x-8 border-base-content lg:hidden flex flex-col justify-center px-6"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="absolute top-8 left-6 font-mono font-bold text-2xl uppercase tracking-widest text-primary">
              {'>'} SYSTEM_MENU
            </div>
            
            <ul className="space-y-6 text-center mt-12">
              {navItems.map((item, index) => {
                const isActive = currentSection === item.id;
                return (
                  <motion.li 
                    key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`inline-block px-6 py-3 border-2 transition-all font-mono text-xl font-bold uppercase tracking-widest ${
                        isActive
                          ? 'border-base-content bg-base-content text-base-100 shadow-[6px_6px_0px_0px_var(--color-primary)]'
                          : 'border-base-content/20 text-base-content hover:border-primary hover:text-primary hover:shadow-[4px_4px_0px_0px_currentColor]'
                      }`}
                    >
                      {isActive ? `[ ${item.label} ]` : item.label}
                    </a>
                  </motion.li>
                )
              })}
            </ul>

            <motion.div 
              className="absolute bottom-12 left-0 right-0 flex justify-center gap-6 px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
               <ThemeToggle toggleTheme={toggleTheme} theme={theme} />
               <ResumePreview
                  resumeUrl={contactData?.resumeLink}
                  onTriggerClick={downloadResume}
                  wrapperClassName="w-full max-w-xs"
                  triggerClassName="relative w-full px-6 py-4 border-2 border-base-content bg-base-100 text-base-content shadow-[6px_6px_0px_0px_currentColor] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] flex items-center justify-center gap-3 font-mono font-bold uppercase tracking-widest"
                >
                  <FaFileDownload className="w-5 h-5" />
                  <span>FETCH_RESUME</span>
                </ResumePreview>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
