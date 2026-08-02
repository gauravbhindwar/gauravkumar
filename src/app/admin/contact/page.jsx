'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, Mail, Phone, MapPin, FileText, Globe, Save, CheckCircle, AlertCircle, Eye, Image as ImageIcon, Upload } from 'lucide-react'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'

export default function AdminContact() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: '',
    social: {
      linkedin: '',
      github: ''
    },
    resumeLink: '',
    twitter: '',
    description: ''
  })
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
      return
    }

    fetchContact()
  }, [session, status, router])

  // ESC key handler for closing modals
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (showPreview) {
          setShowPreview(false)
        }
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [showPreview])

  const fetchContact = async () => {
    try {
      const response = await fetch('/api/contact')
      const data = await response.json()
      
      console.log('Loaded contact data:', data) // Debug log
      
      setFormData({
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        social: {
          linkedin: data.social?.linkedin || '',
          github: data.social?.github || ''
        },
        resumeLink: data.resumeLink || '',
        homeImage: data.homeImage || '',
        twitter: data.twitter || '',
        description: data.description || ''
      })
    } catch (error) {
      console.error('Error fetching contact:', error)
      setMessage('Error loading contact information')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      setMessage('Uploading image...');
      setSaving(true);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          homeImage: data.url
        }));
        setMessage('Image uploaded successfully!');
      } else {
        setMessage('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      setMessage('Error uploading image');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Handle nested social fields
    if (name === 'linkedin' || name === 'github') {
      setFormData(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [name]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      // Prepare data for submission
      const submitData = {
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        social: {
          linkedin: formData.social.linkedin,
          github: formData.social.github
        },
        resumeLink: formData.resumeLink,
        homeImage: formData.homeImage,
        twitter: formData.twitter,
        description: formData.description
      }

      console.log('Submitting contact data:', submitData) // Debug log

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        setMessage('Contact information updated successfully!')
        
        // Invalidate cache by making a fresh request to the API
        // This ensures portfolio will get updated data immediately
        try {
          await fetch('/api/contact', { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          })
        } catch (cacheError) {
          console.log('Cache invalidation attempted')
        }
        
        // Reload the current data to reflect changes
        await fetchContact()
        
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await response.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving contact:', error)
      setMessage('Error saving contact information')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="animate-spin rounded-none h-16 w-16 border-4 border-base-content bg-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-base-100 backdrop-blur-sm rounded-none shadow-[4px_4px_0_0_currentColor] border border-base-content p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary border-b-4 border-base-content rounded-none">
                  <User className="w-6 h-6 text-primary-content" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-base-content">
                    Contact Information
                  </h1>
                  <p className="text-base-content/60">Manage your professional contact details and social links</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-4 py-3 border-2 border-base-content text-base-content/80 rounded-none font-medium hover:bg-base-200 transition-all duration-200"
              >
                <Eye className="w-5 h-5" />
                Preview
              </button>
              {message && (
                <div className={`flex items-center gap-2 px-4 py-2  text-sm font-medium ${
                  message.includes('Error') || message.includes('error')
                    ? 'bg-base-100 text-error border border-base-content'
                    : 'bg-base-100 text-success border border-base-content'
                }`}>
                  {message.includes('Error') || message.includes('error') ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Contact Form */}
        <div className="bg-base-100 backdrop-blur-sm rounded-none shadow-[4px_4px_0_0_currentColor] border border-base-content p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-base-300">
                <div className="p-2 bg-base-100 ">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-base-content">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-base-content rounded-none text-base-content bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-base-content rounded-none text-base-content bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-base-content rounded-none text-base-content bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="City, State/Country"
                />
              </div>
            </div>

            {/* Home Page Image Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-base-300">
                <div className="p-2 bg-base-100 ">
                  <ImageIcon className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-xl font-bold text-base-content">Home Page Image</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1 space-y-4 w-full">
                     <label className="block text-sm font-semibold text-base-content/80">
                        Profile/Hero Image
                     </label>
                     
                     <div className="flex gap-2">
                        <input
                           type="text"
                           name="homeImage"
                           value={formData.homeImage || ''}
                           onChange={handleInputChange}
                           className="flex-1 px-4 py-3 border-2 border-base-content rounded-none text-base-content bg-base-100 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                           placeholder="/uploads/my-image.jpg or https://..."
                        />
                        <label className="cursor-pointer px-4 py-3 bg-base-200 hover:bg-base-300 text-base-content/80 rounded-none font-medium transition-colors flex items-center gap-2">
                           <Upload className="w-5 h-5" />
                           <span className="hidden sm:inline">Upload</span>
                           <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageUpload}
                           />
                        </label>
                     </div>
                     <p className="text-sm text-base-content/60">
                        Upload an image to store it locally, or paste an external URL. Best size: 600x600px or larger.
                     </p>
                  </div>
                  
                  {formData.homeImage && (
                     <div className="shrink-0">
                        <div className="w-32 h-32 rounded-none overflow-hidden border-2 border-base-content shadow-[4px_4px_0_0_currentColor] relative group bg-base-200">
                           <img 
                              src={formData.homeImage} 
                              alt="Home Preview" 
                              className="w-full h-full object-cover"
                              onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=No+Image'}
                           />
                        </div>
                     </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-base-300">
                <div className="p-2 bg-base-100 ">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-base-content">Social Links & Portfolio</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80">
                    <FaLinkedin className="w-4 h-4 text-blue-600" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.social.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-base-content rounded-none text-base-content bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80">
                    <FaGithub className="w-4 h-4 text-gray-900" />
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={formData.social.github}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-base-content rounded-none text-base-content bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80">
                    <FaTwitter className="w-4 h-4 text-blue-400" />
                    Twitter/X Profile
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-base-content rounded-none text-base-content bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80">
                    <FileText className="w-4 h-4 text-green-600" />
                    Resume/CV URL
                  </label>
                  <input
                    type="url"
                    name="resumeLink"
                    value={formData.resumeLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-base-content rounded-none text-base-content bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="https://yourwebsite.com/resume.pdf"
                  />
                </div>
              </div>
            </div>

            {/* Bio/Description Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-base-300">
                <div className="p-2 bg-base-100 ">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-base-content">Professional Bio</h2>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-base-content/80">
                  Bio/Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-base-content rounded-none text-base-content bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Brief description about yourself, your interests, or what you do..."
                />
                <p className="text-sm text-base-content/60">This will be displayed on your portfolio's contact section</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-base-300">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-4 bg-primary border-b-4 border-base-content hover:opacity-90 text-primary-content rounded-none font-medium shadow-[4px_4px_0_0_currentColor] hover:shadow-[4px_4px_0_0_currentColor] transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving Changes...' : 'Save Contact Information'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-base-100 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-base-100 rounded-none shadow-[4px_4px_0_0_currentColor] border-2 border-base-content w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up">
              {/* Modal Header */}
              <div className="sticky top-0 bg-base-100 border-b border-base-300 px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary border-b-4 border-base-content ">
                    <Eye className="w-5 h-5 text-primary-content" />
                  </div>
                  <h2 className="text-2xl font-semibold text-base-content">
                    Contact Information Preview
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-base-content/40 hover:text-base-content/70 hover:bg-base-200  transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-base-content mb-2">How it will appear on your portfolio</h3>
                    <p className="text-base-content/60">This is how visitors will see your contact information</p>
                  </div>

                  <div className="bg-base-100 rounded-none p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary" />
                        <span className="text-base-content font-medium">{formData.email || 'your.email@example.com'}</span>
                      </div>
                      
                      {formData.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-success" />
                          <span className="text-base-content font-medium">{formData.phone}</span>
                        </div>
                      )}
                      
                      {formData.location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-error" />
                          <span className="text-base-content font-medium">{formData.location}</span>
                        </div>
                      )}
                    </div>

                    {formData.description && (
                      <div className="mt-6 p-4 bg-base-100 rounded-none">
                        <p className="text-base-content/80 leading-relaxed">{formData.description}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 mt-6">
                      {formData.social.linkedin && (
                        <a 
                          href={formData.social.linkedin}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-content  hover:bg-base-100 transition-colors duration-200"
                        >
                          <FaLinkedin className="w-4 h-4" />
                          LinkedIn
                        </a>
                      )}
                      
                      {formData.social.github && (
                        <a 
                          href={formData.social.github}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-neutral text-neutral-content  hover:bg-base-100 transition-colors duration-200"
                        >
                          <FaGithub className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      
                      {formData.twitter && (
                        <a 
                          href={formData.twitter}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-content  hover:bg-base-100 transition-colors duration-200"
                        >
                          <FaTwitter className="w-4 h-4" />
                          Twitter
                        </a>
                      )}
                      
                      {formData.resumeLink && (
                        <a 
                          href={formData.resumeLink}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-success text-success-content  hover:bg-base-100 transition-colors duration-200"
                        >
                          <FileText className="w-4 h-4" />
                          Resume
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-6 py-3 bg-primary border-b-4 border-base-content hover:opacity-90 text-primary-content rounded-none font-medium transition-all duration-200"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remove the old Quick Preview Card - it's now in the modal */}
      </div>
    </div>
  )
}
