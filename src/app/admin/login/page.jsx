'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  Shield, 
  User, 
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react'

function AdminLoginForm() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [securityStatus, setSecurityStatus] = useState({
    isLocked: false,
    remainingAttempts: 5,
    lockoutTime: 0
  })
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [fieldValidation, setFieldValidation] = useState({
    email: { isValid: null, message: '' },
    password: { isValid: null, message: '' }
  })
  // Security management - no hardcoded values
  const checkSecurityStatus = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      return { isLocked: false, remainingAttempts: 5, lockoutTime: 0 }
    }

    try {
      const response = await fetch('/api/auth/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          type: 'check',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
          ip: 'client'
        })
      })
      
      if (!response.ok) {
        throw new Error('Security check failed')
      }
      
      const data = await response.json()
      setSecurityStatus(data)
      return data
    } catch (error) {
      console.error('Security check error:', error)
      const defaultStatus = { isLocked: false, remainingAttempts: 5, lockoutTime: 0 }
      setSecurityStatus(defaultStatus)
      return defaultStatus
    }
  }

  const recordLoginAttempt = async (success = false) => {
    if (!formData.email) return

    try {
      await fetch('/api/auth/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          type: success ? 'success' : 'failed',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
          ip: 'client'
        })
      })
    } catch (error) {
      console.error('Failed to record login attempt:', error)
    }
  }

  // Auto-update lockout timer
  useEffect(() => {
    let timer
    if (securityStatus.isLocked && securityStatus.lockoutTime > 0) {
      timer = setInterval(() => {
        setSecurityStatus(prev => {
          const newLockoutTime = Math.max(0, prev.lockoutTime - 1)
          return {
            ...prev,
            lockoutTime: newLockoutTime,
            isLocked: newLockoutTime > 0
          }
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [securityStatus.isLocked, securityStatus.lockoutTime])

  // Check security status when email changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.email && formData.email.includes('@')) {
        checkSecurityStatus()
      }
    }, 500) // Debounce for 500ms

    return () => clearTimeout(timeoutId)
  }, [formData.email])

  // Mouse tracking
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePosition({ x, y })
    springX.set(x - rect.width / 2)
    springY.set(y - rect.height / 2)
  }

  // Check security status when email changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.email && formData.email.includes('@')) {
        checkSecurityStatus()
      }
    }, 500) // Debounce for 500ms

    return () => clearTimeout(timeoutId)
  }, [formData.email])

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      router.push('/admin/dashboard')
    }
  }, [session, status, router])

  // Check for error in URL params
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setError('Invalid credentials. Please try again.')
    }
  }, [searchParams])

  // Load remember me preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rememberMePref = localStorage.getItem('adminRememberMe')
      if (rememberMePref === 'true') {
        setRememberMe(true)
      }
    }
  }, [])

  // Form validation with dynamic messages
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value) {
          return { isValid: false, message: 'Email is required' }
        } else if (!emailRegex.test(value)) {
          return { isValid: false, message: 'Please enter a valid email address' }
        }
        return { isValid: true, message: 'Valid email format' }
      
      case 'password':
        if (!value) {
          return { isValid: false, message: 'Password is required' }
        } else if (value.length < 6) {
          return { isValid: false, message: 'Password must be at least 6 characters' }
        }
        return { isValid: true, message: 'Password format accepted' }
      
      default:
        return { isValid: null, message: '' }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Real-time validation
    const validation = validateField(name, value)
    setFieldValidation(prev => ({
      ...prev,
      [name]: validation
    }))
    
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName)
  }

  const handleBlur = () => {
    setFocusedField(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (securityStatus.isLocked) {
      setError(`Account is temporarily locked. Please wait ${securityStatus.lockoutTime} seconds.`)
      return
    }
    
    setIsLoading(true)
    setError('')

    try {
      // Final security check before login attempt
      const latestSecurityStatus = await checkSecurityStatus()
      if (latestSecurityStatus.isLocked) {
        setError(`Account is locked. Please wait ${latestSecurityStatus.lockoutTime} seconds.`)
        setIsLoading(false)
        return
      }

      // Validate all fields
      const emailValidation = validateField('email', formData.email)
      const passwordValidation = validateField('password', formData.password)
      
      if (!emailValidation.isValid || !passwordValidation.isValid) {
        setError('Please correct the validation errors')
        setIsLoading(false)
        return
      }

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        // Record failed attempt
        await recordLoginAttempt(false)
        
        // Update security status
        const updatedStatus = await checkSecurityStatus()
        if (updatedStatus.isLocked) {
          setError(`Too many failed attempts. Account locked for ${updatedStatus.lockoutTime} seconds.`)
        } else {
          setError(`Invalid credentials. ${updatedStatus.remainingAttempts} attempts remaining.`)
        }
      } else if (result?.ok) {
        // Record successful login
        await recordLoginAttempt(true)
        
        // Store remember me preference
        if (rememberMe && typeof window !== 'undefined') {
          localStorage.setItem('adminRememberMe', 'true')
        } else if (typeof window !== 'undefined') {
          localStorage.removeItem('adminRememberMe')
        }
        
        router.push('/admin/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading if checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-base-content/70 text-sm">Checking authentication...</p>
        </motion.div>
      </div>
    )
  }

  // Don't show login form if already authenticated
  if (status === 'authenticated') {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-base-200">
      {/* Brutalist background grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-base-content) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      {/* Main Container */}
      <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full"
        >
          {/* Brutalist Card */}
          <div className="bg-base-100 border-4 border-base-content p-8 shadow-[8px_8px_0px_0px_currentColor]">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mx-auto h-16 w-16 flex items-center justify-center border-4 border-base-content bg-primary text-primary-content shadow-[4px_4px_0px_0px_currentColor] mb-6"
              >
                <Shield className="h-8 w-8" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-2xl font-mono font-bold uppercase tracking-widest text-base-content"
              >
                [ ADMIN_ACCESS ]
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-4 text-base-content/70 font-mono text-xs uppercase tracking-wider"
              >
                Secure access to portfolio dashboard
              </motion.p>
            </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className=" bg-error/10 border border-error/20 p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-error mr-3 mt-0.5 shrink-0" />
                      <div className="text-sm text-error">{error}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lockout Warning */}
              <AnimatePresence>
                {securityStatus.isLocked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className=" bg-warning/10 border border-warning/20 p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-warning mr-3 mt-0.5 shrink-0" />
                      <div className="text-sm text-warning">
                        Account temporarily locked. Try again in {securityStatus.lockoutTime}s
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <motion.div
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                        focusedField === 'email' ? 'text-primary' : 'text-base-content/40'
                      }`}
                      animate={{
                        scale: focusedField === 'email' ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <User className="h-5 w-5" />
                    </motion.div>
                    
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      className={`w-full pl-11 pr-12 py-3 bg-base-100 border-2 rounded-none text-base-content font-mono text-sm placeholder-base-content/40 focus:outline-none transition-all duration-200 ${
                        fieldValidation.email.isValid === true
                          ? 'border-success shadow-[4px_4px_0px_0px_var(--color-success)] -translate-y-1 -translate-x-1'
                          : fieldValidation.email.isValid === false
                          ? 'border-error shadow-[4px_4px_0px_0px_var(--color-error)] -translate-y-1 -translate-x-1'
                          : 'border-base-content focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 focus:-translate-x-1'
                      } ${focusedField === 'email' ? 'border-primary' : ''}`}
                      placeholder="Enter your email"
                      disabled={isLoading || securityStatus.isLocked}
                    />
                    
                    {/* Validation Icon */}
                    <AnimatePresence>
                      {fieldValidation.email.isValid !== null && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {fieldValidation.email.isValid ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : (
                            <XCircle className="h-5 w-5 text-error" />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Validation Message */}
                  <AnimatePresence>
                    {fieldValidation.email.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className={`mt-2 text-xs ${
                          fieldValidation.email.isValid ? 'text-success' : 'text-error'
                        }`}
                      >
                        {fieldValidation.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-base-content/70 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <motion.div
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                        focusedField === 'password' ? 'text-primary' : 'text-base-content/40'
                      }`}
                      animate={{
                        scale: focusedField === 'password' ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Lock className="h-5 w-5" />
                    </motion.div>
                    
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('password')}
                      onBlur={handleBlur}
                      className={`w-full pl-11 pr-20 py-3 bg-base-100 border-2 rounded-none text-base-content font-mono text-sm placeholder-base-content/40 focus:outline-none transition-all duration-200 ${
                        fieldValidation.password.isValid === true
                          ? 'border-success shadow-[4px_4px_0px_0px_var(--color-success)] -translate-y-1 -translate-x-1'
                          : fieldValidation.password.isValid === false
                          ? 'border-error shadow-[4px_4px_0px_0px_var(--color-error)] -translate-y-1 -translate-x-1'
                          : 'border-base-content focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 focus:-translate-x-1'
                      } ${focusedField === 'password' ? 'border-primary' : ''}`}
                      placeholder="Enter your password"
                      disabled={isLoading || securityStatus.isLocked}
                    />
                    
                    {/* Show/Hide Password Button */}
                    <button
                      type="button"
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content/80 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading || securityStatus.isLocked}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    
                    {/* Validation Icon */}
                    <AnimatePresence>
                      {fieldValidation.password.isValid !== null && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {fieldValidation.password.isValid ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : (
                            <XCircle className="h-5 w-5 text-error" />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Validation Message */}
                  <AnimatePresence>
                    {fieldValidation.password.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className={`mt-2 text-xs ${
                          fieldValidation.password.isValid ? 'text-success' : 'text-error'
                        }`}
                      >
                        {fieldValidation.password.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-0 border-2 border-base-content rounded-none bg-base-100 transition-colors duration-200"
                    disabled={isLoading || securityStatus.isLocked}
                  />
                  <label htmlFor="remember-me" className="ml-2 font-mono text-xs uppercase tracking-widest text-base-content">
                    Remember me for 30 days
                  </label>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || securityStatus.isLocked}
                className={`group relative w-full flex justify-center items-center py-4 px-4 border-2 border-base-content rounded-none font-mono text-sm font-bold uppercase tracking-widest transition-all duration-200 ${
                  isLoading || securityStatus.isLocked
                    ? 'bg-base-300 cursor-not-allowed text-base-content/50'
                    : 'bg-primary text-base-100 shadow-[6px_6px_0px_0px_currentColor] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Signing in...
                  </>
                ) : securityStatus.isLocked ? (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Account Locked ({securityStatus.lockoutTime}s)
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In to Dashboard
                  </>
                )}
              </button>

              {/* Security Status */}
              {!securityStatus.isLocked && securityStatus.remainingAttempts < 5 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <p className="text-xs text-warning">
                    {securityStatus.remainingAttempts} attempt{securityStatus.remainingAttempts !== 1 ? 's' : ''} remaining
                  </p>
                </motion.div>
              )}

              {/* Footer */}
              <div className="text-center space-y-4 pt-4 border-t-2 border-base-content/10">
                <div className="flex items-center justify-center space-x-2 font-mono text-[10px] uppercase tracking-widest text-base-content/50">
                  <Shield className="h-3 w-3" />
                  <span>SECURED_WITH_ENTERPRISE_ENCRYPTION</span>
                </div>
                
                <Link 
                  href="/" 
                  className="inline-flex items-center font-mono text-xs font-bold uppercase tracking-widest text-base-content hover:text-primary transition-colors duration-200"
                >
                  {'< BACK_TO_PORTFOLIO'}
                </Link>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}
