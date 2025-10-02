'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaRocket, FaHeart, FaStar, FaLightbulb } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'
import emailjs from '@emailjs/browser'

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
}

// Set up EmailJS with environment variables
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

export default function Contact() {
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
        subject: `🚀 New Portfolio Contact: ${formState.name}`,
        
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
        <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100/50 backdrop-blur-sm"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-base-200/80 to-base-300/80 backdrop-blur-lg rounded-3xl p-8 
                          border border-base-content/5 hover:border-primary/20 transition-all duration-300
                          hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
              <div className="animate-pulse">
                <div className="h-12 bg-base-300 rounded-lg w-1/3 mx-auto mb-12"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="h-8 bg-base-300 rounded-lg w-3/4"></div>
                    <div className="h-8 bg-base-300 rounded-lg w-1/2"></div>
                    <div className="h-8 bg-base-300 rounded-lg w-2/3"></div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="h-12 bg-base-300 rounded-lg w-full"></div>
                    <div className="h-12 bg-base-300 rounded-lg w-full"></div>
                    <div className="h-32 bg-base-300 rounded-lg w-full"></div>
                    <div className="h-12 bg-base-300 rounded-lg w-1/3"></div>
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
        <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100/50 backdrop-blur-sm"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="bg-gradient-to-br from-base-200/80 to-base-300/80 backdrop-blur-lg rounded-3xl p-8 
                          border border-base-content/5 hover:border-primary/20 transition-all duration-300
                          hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
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
    <section id="contact" className="py-32 relative overflow-hidden" ref={sectionRef}>
      {/* Enhanced Background with particles */}
      <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30"></div>
      
      {/* Floating particles background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Animated background pattern */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          x: transformX,
          y: transformY,
          backgroundImage: 'radial-gradient(circle, hsl(var(--p)) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '100px 100px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto"
        >
          {/* Hero Section Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary/10 rounded-full mb-8 border border-primary/20"
              whileHover={{ scale: 1.05, borderColor: "hsl(var(--p))" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <FaRocket className="w-6 h-6 text-primary" />
              <span className="text-primary font-semibold text-lg">Let's Build Something Amazing</span>
            </motion.div>
            
            <motion.h2 
              className="text-6xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Let's Connect
              </span>
            </motion.h2>
            
            <motion.p
              className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Ready to turn your ideas into reality? I'm here to help you create something extraordinary. 
              Let's collaborate and build the future together!
            </motion.p>
          </motion.div>

          {/* Main Content Card */}
          <motion.div
            className="bg-gradient-to-br from-base-100/90 to-base-200/90 backdrop-blur-xl rounded-3xl 
                     border border-base-content/10 shadow-2xl hover:shadow-3xl transition-all duration-500
                     relative overflow-hidden"
            style={{
              transform: isHovering ? `rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)` : 'none',
            }}
            whileHover={{ 
              y: -5,
              transition: { type: "spring", stiffness: 300 }
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50"></div>
            
            <div className="relative p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Information Side */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="space-y-10"
                >
                  <div className="relative">
                    <motion.div
                      className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                    />
                    <h3 className="text-3xl font-bold mb-6 relative">
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Get In Touch
                      </span>
                    </h3>
                    <p className="text-lg text-base-content/80 leading-relaxed mb-8">
                      I'm always excited to discuss new projects, creative ideas, or opportunities to collaborate. 
                      Whether you have a specific project in mind or just want to connect, I'd love to hear from you!
                    </p>
                    
                    <motion.div 
                      className="h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      viewport={{ once: true }}
                    />
                  </div>

                  {/* Contact Methods */}
                  <div className="space-y-6">
                    <motion.div 
                      className="group relative"
                      whileHover={{ x: 8 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center gap-6 p-6 rounded-2xl bg-base-100/70 border border-base-content/5 
                                   hover:border-primary/30 hover:bg-base-100/90 transition-all duration-300 hover:shadow-xl">
                        <motion.div 
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <FaEnvelope className="w-7 h-7 text-primary" />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-lg mb-1">Email Me</h4>
                          <a href={`mailto:${contactData?.email || 'contact@example.com'}`} 
                             className="text-lg text-primary hover:text-secondary transition-colors font-medium">
                            {contactData?.email || 'contact@example.com'}
                          </a>
                        </div>
                      </div>
                    </motion.div>
                    
                    {contactData?.phone && (
                      <motion.div 
                        className="group relative"
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-6 p-6 rounded-2xl bg-base-100/70 border border-base-content/5 
                                     hover:border-secondary/30 hover:bg-base-100/90 transition-all duration-300 hover:shadow-xl">
                          <motion.div 
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <FaPhone className="w-7 h-7 text-secondary" />
                          </motion.div>
                          <div>
                            <h4 className="font-semibold text-lg mb-1">Call Me</h4>
                            <span className="text-lg font-medium">{contactData.phone}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="pt-8">
                    <motion.h4 
                      className="text-2xl font-bold mb-6 flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                      viewport={{ once: true }}
                    >
                      <FaHeart className="w-6 h-6 text-red-500" />
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Connect & Follow
                      </span>
                    </motion.h4>
                    
                    <div className="flex gap-4">
                      {contactData?.social && Object.entries(contactData.social).map(([platform, url], index) => {
                        const Icon = socialIcons[platform]
                        return (
                          <motion.a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative w-16 h-16 rounded-2xl bg-base-100/70 border border-base-content/10 
                                     flex items-center justify-center hover:border-primary/30 transition-all duration-300
                                     hover:shadow-xl overflow-hidden"
                            initial={{ opacity: 0, scale: 0.5, y: 30 }}
                            whileInView={{ 
                              opacity: 1, 
                              scale: 1, 
                              y: 0,
                              transition: { 
                                delay: 1 + (index * 0.1),
                                type: "spring",
                                stiffness: 400,
                                damping: 20
                              } 
                            }}
                            whileHover={{ 
                              scale: 1.1,
                              rotate: 360,
                              transition: { duration: 0.6 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            viewport={{ once: true }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300"></div>
                            {Icon && <Icon className="w-7 h-7 text-primary relative z-10" />}
                          </motion.a>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Inspirational Quote */}
                  <motion.div 
                    className="relative mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 
                             border border-primary/10 overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      className="absolute top-4 left-6 text-8xl text-primary/20 font-serif leading-none select-none"
                      animate={{ 
                        rotate: [0, 5, 0],
                        scale: [1, 1.1, 1] 
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity 
                      }}
                    >
                      "
                    </motion.div>
                    <div className="relative z-10 pt-6">
                      <blockquote className="text-lg text-base-content/80 italic leading-relaxed mb-4">
                        "Great things happen when passionate minds collaborate. Every project is an opportunity 
                        to create something meaningful that makes a difference."
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <FaStar className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-primary">– {contactData?.name || 'Gaurav'}</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Contact Form Side */}
                <div ref={formRef}>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative"
                  >
                    {/* Form Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-base-100/80 to-base-200/80 rounded-3xl blur-sm"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl"></div>
                    
                    <div className="relative bg-base-100/90 backdrop-blur-xl rounded-3xl p-10 border border-base-content/10 
                                  shadow-2xl hover:shadow-3xl transition-all duration-500">
                      
                      {/* Form Header */}
                      <motion.div 
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        viewport={{ once: true }}
                      >
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 
                                      rounded-full mb-6 border border-primary/20">
                          <FaLightbulb className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-primary">Share Your Ideas</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-4">
                          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Send Me A Message
                          </span>
                        </h3>
                        <p className="text-base-content/70">
                          Tell me about your project, and let's create something amazing together!
                        </p>
                      </motion.div>
                      
                      <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Name Field */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.9 }}
                          viewport={{ once: true }}
                          className="space-y-3"
                        >
                          <label className="flex items-center justify-between text-sm font-semibold text-base-content">
                            <span className="flex items-center gap-2">
                              ✨ Your Name
                            </span>
                            {fieldErrors.name && (
                              <motion.span 
                                className="text-error text-xs flex items-center gap-1"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                              >
                                <FaExclamationCircle />
                                {fieldErrors.name}
                              </motion.span>
                            )}
                          </label>
                          <motion.div
                            className="relative"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="text"
                              name="name"
                              value={formState.name}
                              onChange={handleChange}
                              onFocus={() => handleFocus('name')}
                              onBlur={handleBlur}
                              placeholder="John Doe"
                              className={`w-full px-6 py-4 rounded-2xl bg-base-200/50 border-2 transition-all duration-300
                                       focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary 
                                       hover:bg-base-200/70 text-base-content placeholder-base-content/50 text-lg
                                       ${fieldErrors.name ? 'border-error focus:ring-error/20 focus:border-error' : 'border-base-content/20'}
                                       ${focusedField === 'name' ? 'shadow-lg transform scale-[1.02]' : ''}`}
                              disabled={formStatus === 'submitting'}
                            />
                            {focusedField === 'name' && (
                              <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 -z-10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                              />
                            )}
                          </motion.div>
                        </motion.div>
                        
                        {/* Email Field */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 1.0 }}
                          viewport={{ once: true }}
                          className="space-y-3"
                        >
                          <label className="flex items-center justify-between text-sm font-semibold text-base-content">
                            <span className="flex items-center gap-2">
                              📧 Email Address
                            </span>
                            {fieldErrors.email && (
                              <motion.span 
                                className="text-error text-xs flex items-center gap-1"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                              >
                                <FaExclamationCircle />
                                {fieldErrors.email}
                              </motion.span>
                            )}
                          </label>
                          <motion.div
                            className="relative"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="email"
                              name="email"
                              value={formState.email}
                              onChange={handleChange}
                              onFocus={() => handleFocus('email')}
                              onBlur={handleBlur}
                              placeholder="john@example.com"
                              className={`w-full px-6 py-4 rounded-2xl bg-base-200/50 border-2 transition-all duration-300
                                       focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary 
                                       hover:bg-base-200/70 text-base-content placeholder-base-content/50 text-lg
                                       ${fieldErrors.email ? 'border-error focus:ring-error/20 focus:border-error' : 'border-base-content/20'}
                                       ${focusedField === 'email' ? 'shadow-lg transform scale-[1.02]' : ''}`}
                              disabled={formStatus === 'submitting'}
                            />
                            {focusedField === 'email' && (
                              <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 -z-10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                              />
                            )}
                          </motion.div>
                        </motion.div>
                        
                        {/* Message Field */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 1.1 }}
                          viewport={{ once: true }}
                          className="space-y-3"
                        >
                          <label className="flex items-center justify-between text-sm font-semibold text-base-content">
                            <span className="flex items-center gap-2">
                              💬 Your Message
                            </span>
                            {fieldErrors.message && (
                              <motion.span 
                                className="text-error text-xs flex items-center gap-1"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                              >
                                <FaExclamationCircle />
                                {fieldErrors.message}
                              </motion.span>
                            )}
                          </label>
                          <motion.div
                            className="relative"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <textarea
                              name="message"
                              value={formState.message}
                              onChange={handleChange}
                              onFocus={() => handleFocus('message')}
                              onBlur={handleBlur}
                              placeholder="I have an exciting project idea that I'd love to discuss with you..."
                              className={`w-full px-6 py-4 rounded-2xl bg-base-200/50 border-2 transition-all duration-300
                                       focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary 
                                       hover:bg-base-200/70 resize-none text-base-content placeholder-base-content/50 text-lg
                                       ${fieldErrors.message ? 'border-error focus:ring-error/20 focus:border-error' : 'border-base-content/20'}
                                       ${focusedField === 'message' ? 'shadow-lg transform scale-[1.02]' : ''}`}
                              disabled={formStatus === 'submitting'}
                              rows={6}
                            ></textarea>
                            {focusedField === 'message' && (
                              <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 -z-10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                              />
                            )}
                          </motion.div>
                        </motion.div>
                        
                        {/* Status Messages */}
                        {formStatus === 'error' && !Object.keys(fieldErrors).length && (
                          <motion.div 
                            className="flex items-center gap-3 p-6 rounded-2xl bg-error/10 border-2 border-error/30 text-error"
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <FaExclamationCircle className="w-6 h-6" />
                            <span className="font-medium">Oops! There was a problem sending your message. Please try again.</span>
                          </motion.div>
                        )}
                        
                        {formStatus === 'success' && (
                          <motion.div 
                            className="flex items-center gap-3 p-6 rounded-2xl bg-success/10 border-2 border-success/30 text-success relative overflow-hidden"
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            {/* Celebration animation */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-success/5 to-success/10"
                              animate={{
                                backgroundPosition: ['0% 50%', '100% 50%'],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                            />
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <FaCheckCircle className="w-6 h-6" />
                            </motion.div>
                            <span className="font-medium relative z-10">🎉 Awesome! Your message has been sent successfully!</span>
                          </motion.div>
                        )}
                        
                        {/* Submit Button */}
                        <motion.button
                          type="submit"
                          className="group relative w-full px-8 py-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent 
                                   text-primary-content font-bold text-xl hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.6)] 
                                   transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed
                                   flex items-center justify-center gap-4 border-2 border-primary/20 overflow-hidden"
                          disabled={formStatus === 'submitting'}
                          whileHover={formStatus !== 'submitting' ? { 
                            scale: 1.05,
                            boxShadow: "0 0 50px rgba(var(--primary-rgb), 0.8)"
                          } : {}}
                          whileTap={formStatus !== 'submitting' ? { scale: 0.95 } : {}}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 1.2 }}
                          viewport={{ once: true }}
                        >
                          {/* Button background animation */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                            animate={{
                              x: formStatus === 'submitting' ? ['-100%', '100%'] : '0%',
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: formStatus === 'submitting' ? Infinity : 0,
                            }}
                          />
                          
                          <div className="relative z-10 flex items-center gap-4">
                            {formStatus === 'submitting' ? (
                              <>
                                <motion.div 
                                  className="w-6 h-6 border-3 border-primary-content/30 border-t-primary-content rounded-full"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <span>Sending Your Message...</span>
                              </>
                            ) : (
                              <>
                                <motion.div
                                  className="flex items-center gap-3"
                                  whileHover={{ x: 5 }}
                                  transition={{ type: "spring", stiffness: 400 }}
                                >
                                  <FaRocket className="w-6 h-6" />
                                  <span>Launch My Message</span>
                                </motion.div>
                                <motion.div
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <FaPaperPlane className="w-5 h-5" />
                                </motion.div>
                              </>
                            )}
                          </div>
                        </motion.button>
                      </form>
                      
                      {/* Security Note */}
                      <motion.div 
                        className="mt-8 pt-6 border-t border-base-content/10 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.3 }}
                        viewport={{ once: true }}
                      >
                        <p className="text-sm text-base-content/60 flex items-center justify-center gap-2">
                          <span className="text-lg">�</span>
                          Your privacy matters. All data is transmitted securely and never shared.
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
