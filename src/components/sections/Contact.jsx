'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaRocket, FaShareAlt, FaQuoteLeft, FaStar, FaLightbulb, FaLock } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'
import emailjs from '@emailjs/browser'
import ParticleFieldCanvas from '@/components/canvas/ParticleFieldCanvas'
import { useTheme } from '@/components/theme-provider'
import SectionHeading from '@/components/ui/SectionHeading'

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
}

// Set up EmailJS with environment variables
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

export default function Contact() {
  const { reducedMotion } = useTheme()
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [formStatus, setFormStatus] = useState(null) // 'success', 'error', 'submitting', or null
  const [fieldErrors, setFieldErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  
  const formRef = useRef(null)
  const sectionRef = useRef(null)
  const isFormInView = useInView(formRef, { once: true, margin: "-100px" })
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-50px" })
  
  // Spring animations for interactive elements
  const springX = useSpring(0, { stiffness: 100, damping: 30 })
  const springY = useSpring(0, { stiffness: 100, damping: 30 })
  
  // Transform values for animation (call useTransform at component level)
  const transformX = useTransform(springX, (value) => value)
  const transformY = useTransform(springY, (value) => value)
  
  const { data: contactData, loading, error } = useFetch('/api/contact', {
    revalidate: 3600000 // 1 hour cache
  })

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        setMousePosition({ x: x * 20, y: y * 20 })
        springX.set(x * 10)
        springY.set(y * 10)
      }
    }

    const section = sectionRef.current
    if (section) {
      section.addEventListener('mousemove', handleMouseMove)
      section.addEventListener('mouseenter', () => setIsHovering(true))
      section.addEventListener('mouseleave', () => {
        setIsHovering(false)
        springX.set(0)
        springY.set(0)
      })
    }

    return () => {
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove)
        section.removeEventListener('mouseenter', () => setIsHovering(true))
        section.removeEventListener('mouseleave', () => setIsHovering(false))
      }
    }
  }, [springX, springY])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Clear error when user types in a field
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      })
    }
    
    setFormState({
      ...formState,
      [name]: value
    })
  }

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName)
  }

  const handleBlur = () => {
    setFocusedField(null)
  }

  const validateForm = () => {
    const errors = {}
    
    // Name validation
    if (!formState.name.trim()) {
      errors.name = 'Name is required'
    }
    
    // Email validation
    if (!formState.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
      errors.email = 'Please enter a valid email'
    }
    
    // Message validation
    if (!formState.message.trim()) {
      errors.message = 'Message is required'
    } else if (formState.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters'
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Form validation
    if (!validateForm()) {
      setFormStatus('error')
      return
    }
    
    try {
      setFormStatus('submitting')
      
      // Enhanced EmailJS template parameters for better email formatting
      const templateParams = {
        // Basic contact info
        from_name: formState.name,
        from_email: formState.email,
        message: formState.message,
        
        // IMPORTANT: Reply-To configuration for EmailJS
        reply_to: formState.email,
        to_email: formState.email, // Alternative parameter name
        user_email: formState.email, // Another alternative
        
        // Enhanced parameters for better email templates
        to_name: "Gaurav Kumar",
        subject: `New Portfolio Contact: ${formState.name}`,
        
        // Additional context for rich email templates
        timestamp: new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        
        // Formatted message with better structure
        formatted_message: `
Hi Gaurav!

You've received a new message through your portfolio contact form.

From: ${formState.name}
Email: ${formState.email}
Date: ${new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

Message:
${formState.message}

---
Reply directly to: ${formState.email}
        `.trim(),
        
        // Short preview for subject line
        message_preview: formState.message.length > 50 
          ? formState.message.substring(0, 50) + '...' 
          : formState.message,
      }
      
      await emailjs.send(
        EMAILJS_SERVICE_ID, 
        EMAILJS_TEMPLATE_ID, 
        templateParams,
        EMAILJS_PUBLIC_KEY
      )
      
      setFormStatus('success')
      setFormState({ name: '', email: '', message: '' })
      
      // Reset success message after 8 seconds
      setTimeout(() => setFormStatus(null), 8000)
      
    } catch (error) {
      console.error('Error submitting form:', error)
      setFormStatus('error')
      // Reset error message after 5 seconds
      setTimeout(() => setFormStatus(null), 5000)
    }
  }

  if (loading) {
    return (
      <section id="contact" className="py-24 relative">
        <div className="absolute inset-0 bg-linear-to-b from-base-200/50 to-base-100/50 backdrop-blur-sm"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] p-8 
                          border border-base-content/5 hover:border-primary/20 transition-all duration-300
                          hover:shadow-[0_0_30px_color-mix(in_oklch,var(--color-primary)_10%,transparent)]">
              <div className="animate-pulse">
                <div className="h-12 bg-base-300 rounded-none w-1/3 mx-auto mb-12"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="h-8 bg-base-300 rounded-none w-3/4"></div>
                    <div className="h-8 bg-base-300 rounded-none w-1/2"></div>
                    <div className="h-8 bg-base-300 rounded-none w-2/3"></div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="h-12 bg-base-300 rounded-none w-full"></div>
                    <div className="h-12 bg-base-300 rounded-none w-full"></div>
                    <div className="h-32 bg-base-300 rounded-none w-full"></div>
                    <div className="h-12 bg-base-300 rounded-none w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !contactData) {
    return (
      <section id="contact" className="py-24 relative">
        <div className="absolute inset-0 bg-linear-to-b from-base-200/50 to-base-100/50 backdrop-blur-sm"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] p-8 
                          border border-base-content/5 hover:border-primary/20 transition-all duration-300
                          hover:shadow-[0_0_30px_color-mix(in_oklch,var(--color-primary)_10%,transparent)]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-error mb-4">Unable to load contact information</h2>
                <p className="text-base-content/70">Please try again later or contact me directly via email.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  // Configure EmailJS
  if (typeof window !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY)
  }

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-base-100" ref={sectionRef}>
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-base-content) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <SectionHeading 
          title="INITIALIZE_CONNECTION"
          eyebrow="SYS.CONTACT_FORM"
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Panel: Info */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h3 className="text-2xl font-display font-bold uppercase tracking-widest text-base-content mb-4 flex items-center gap-3">
                <span className="text-primary">{'>'}</span> Get In Touch
              </h3>
              <p className="text-base-content/70 font-mono text-sm leading-relaxed border-l-2 border-primary/50 pl-4">
                I'm happy to discuss new projects, technical challenges, or opportunities to collaborate. Feel free to reach out.
              </p>
            </div>

            <div className="space-y-4">
              <div className="group relative p-6 bg-base-100 border-2 border-base-content/20 hover:border-primary transition-all duration-300 flex items-center gap-6 hover:shadow-[4px_4px_0px_0px_currentColor] hover:-translate-y-1 hover:-translate-x-1">
                <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center text-primary transition-transform">
                  <FaEnvelope className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="font-mono text-xs text-base-content/50 uppercase tracking-widest mb-1">Email_Address</h4>
                  <a href={`mailto:${contactData?.email || 'contact@example.com'}`} className="font-mono font-bold text-base-content group-hover:text-primary transition-colors">
                    {contactData?.email || 'contact@example.com'}
                  </a>
                </div>
              </div>
              
              {contactData?.phone && (
                <div className="group relative p-6 bg-base-100 border-2 border-base-content/20 hover:border-secondary transition-all duration-300 flex items-center gap-6 hover:shadow-[4px_4px_0px_0px_currentColor] hover:-translate-y-1 hover:-translate-x-1">
                  <div className="w-12 h-12 bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary transition-transform">
                    <FaPhone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-mono text-xs text-base-content/50 uppercase tracking-widest mb-1">Phone_Number</h4>
                    <span className="font-mono font-bold text-base-content group-hover:text-secondary transition-colors">
                      {contactData.phone}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-mono text-xs text-base-content/50 uppercase tracking-widest mb-4">Find_Me_Online</h4>
              <div className="flex gap-4">
                {contactData?.social && Object.entries(contactData.social).map(([platform, url]) => {
                  const Icon = socialIcons[platform]
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group w-14 h-14 bg-base-100 border-2 border-base-content/20 hover:border-primary flex items-center justify-center text-base-content hover:text-primary transition-all duration-200 shadow-[4px_4px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                    >
                      {Icon && <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />}
                    </a>
                  )
                })}
              </div>
            </div>

            <div className="p-6 bg-base-200/30 border-l-4 border-primary">
              <blockquote className="font-mono text-sm text-base-content/70 italic leading-relaxed">
                "I care about writing clean, maintainable code and building products that solve real problems."
              </blockquote>
              <div className="mt-4 font-mono text-xs text-primary font-bold tracking-widest uppercase">
                – {contactData?.name || 'Gaurav Kumar'}
              </div>
            </div>
          </div>

          {/* Right Panel: Form */}
          <div className="lg:col-span-7">
            <div className="bg-base-100 border-2 border-base-content/20 p-8 md:p-10 relative">
              {/* Decorative brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary -translate-x-[2px] -translate-y-[2px]" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary translate-x-[2px] -translate-y-[2px]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary -translate-x-[2px] translate-y-[2px]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary translate-x-[2px] translate-y-[2px]" />

              <div className="mb-8 border-b-2 border-base-content/10 pb-4">
                <h3 className="text-xl font-display font-bold uppercase tracking-widest text-base-content">
                  Send a Message
                </h3>
                <p className="font-mono text-xs text-base-content/50 mt-2">
                  Tell me a bit about your project or opportunity.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between font-mono text-xs font-bold text-base-content uppercase tracking-wider">
                    <span>NAME</span>
                    {fieldErrors.name && <span className="text-error">[{fieldErrors.name}]</span>}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={handleBlur}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-4 bg-base-200/50 border-2 outline-none font-mono text-sm transition-all duration-200
                      ${fieldErrors.name ? 'border-error focus:border-error' : 'border-base-content/20 focus:border-primary'}
                      ${focusedField === 'name' ? 'shadow-[4px_4px_0px_0px_currentColor]' : ''}`}
                    disabled={formStatus === 'submitting'}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between font-mono text-xs font-bold text-base-content uppercase tracking-wider">
                    <span>EMAIL_ADDRESS</span>
                    {fieldErrors.email && <span className="text-error">[{fieldErrors.email}]</span>}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-4 bg-base-200/50 border-2 outline-none font-mono text-sm transition-all duration-200
                      ${fieldErrors.email ? 'border-error focus:border-error' : 'border-base-content/20 focus:border-primary'}
                      ${focusedField === 'email' ? 'shadow-[4px_4px_0px_0px_currentColor]' : ''}`}
                    disabled={formStatus === 'submitting'}
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between font-mono text-xs font-bold text-base-content uppercase tracking-wider">
                    <span>MESSAGE</span>
                    {fieldErrors.message && <span className="text-error">[{fieldErrors.message}]</span>}
                  </label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={handleBlur}
                    placeholder="Describe your project or opportunity..."
                    rows={6}
                    className={`w-full px-4 py-4 bg-base-200/50 border-2 outline-none font-mono text-sm transition-all duration-200 resize-none
                      ${fieldErrors.message ? 'border-error focus:border-error' : 'border-base-content/20 focus:border-primary'}
                      ${focusedField === 'message' ? 'shadow-[4px_4px_0px_0px_currentColor]' : ''}`}
                    disabled={formStatus === 'submitting'}
                  />
                </div>

                {/* Status Messages */}
                {formStatus === 'error' && !Object.keys(fieldErrors).length && (
                  <div className="p-4 bg-error/10 border-l-4 border-error text-error font-mono text-xs uppercase tracking-widest flex items-center gap-3">
                    <FaExclamationCircle className="w-4 h-4" />
                    <span>[ SYS.ERROR ]: Transmission failed. Please retry.</span>
                  </div>
                )}
                
                {formStatus === 'success' && (
                  <div className="p-4 bg-success/10 border-l-4 border-success text-success font-mono text-xs uppercase tracking-widest flex items-center gap-3">
                    <FaCheckCircle className="w-4 h-4" />
                    <span>[ SYS.SUCCESS ]: Message transmitted securely.</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="group relative w-full flex items-center justify-center gap-4 px-8 py-5 mt-4 bg-base-100 border-2 border-primary text-primary font-mono text-sm font-bold uppercase tracking-[0.2em] transition-all duration-200 shadow-[6px_6px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[6px_6px_0px_0px_currentColor] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span>TRANSMITTING...</span>
                    </>
                  ) : (
                    <>
                      <span>TRANSMIT_MESSAGE</span>
                      <FaPaperPlane className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t-2 border-base-content/10 text-center">
                <p className="font-mono text-[0.65rem] text-base-content/40 uppercase tracking-widest flex items-center justify-center gap-2">
                  <FaLock className="w-3 h-3" />
                  End-to-End Encrypted Transmission
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
