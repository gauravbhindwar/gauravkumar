'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building, 
  Calendar, 
  MapPin, 
  Briefcase,
  ExternalLink,
  Save,
  X,
  Search,
  Filter,
  Eye,
  Clock
} from 'lucide-react'
import { useSession } from 'next-auth/react'

const ExperiencesAdmin = () => {
  const { data: session } = useSession()
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrentPosition: false,
    description: '',
    responsibilities: [],
    technologies: [],
    companyLogo: '',
    companyWebsite: '',
    employmentType: 'Full-time',
    order: 0
  })

  // Filter experiences based on search and filter type
  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.location?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'current' && exp.isCurrentPosition) ||
                         (filterType === 'past' && !exp.isCurrentPosition) ||
                         (filterType === exp.employmentType?.toLowerCase())
    
    return matchesSearch && matchesFilter
  })

  // Fetch experiences
  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experiences')
      if (response.ok) {
        const data = await response.json()
        // API returns experiences directly as an array, not wrapped in an object
        setExperiences(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
  }, [])

  // Reset form
  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentPosition: false,
      description: '',
      responsibilities: [],
      technologies: [],
      companyLogo: '',
      companyWebsite: '',
      employmentType: 'Full-time',
      order: 0
    })
    setEditingExperience(null)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingExperience 
        ? `/api/experiences/${editingExperience._id}`
        : '/api/experiences'
      
      const method = editingExperience ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        await fetchExperiences()
        setIsModalOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        const response = await fetch(`/api/experiences/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          await fetchExperiences()
        }
      } catch (error) {
        console.error('Error deleting experience:', error)
      }
    }
  }

  // Handle array field changes
  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({ ...formData, [field]: newArray })
  }

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] })
  }

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData({ ...formData, [field]: newArray })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Manage Experiences
            </h1>
            <p className="text-gray-600 mt-1">Add and manage your work experience</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              resetForm()
              setIsModalOpen(true)
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>Add Experience</span>
          </motion.button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="all">All Experiences</option>
              <option value="current">Current Position</option>
              <option value="past">Past Positions</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Experiences</p>
              <p className="text-2xl font-bold text-blue-900">{experiences.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Current Position</p>
              <p className="text-2xl font-bold text-emerald-900">
                {experiences.filter(exp => exp.isCurrentPosition).length}
              </p>
            </div>
            <div className="bg-emerald-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Companies</p>
              <p className="text-2xl font-bold text-purple-900">
                {new Set(experiences.map(exp => exp.company)).size}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Filtered Results</p>
              <p className="text-2xl font-bold text-orange-900">{filteredExperiences.length}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Experiences List */}
      <div className="space-y-6">
        {filteredExperiences.length > 0 ? (
          filteredExperiences.map((experience, index) => (
            <motion.div
              key={experience._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {experience.position}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      experience.employmentType === 'Full-time' ? 'bg-blue-100 text-blue-700' :
                      experience.employmentType === 'Part-time' ? 'bg-green-100 text-green-700' :
                      experience.employmentType === 'Contract' ? 'bg-orange-100 text-orange-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {experience.employmentType}
                    </span>
                    {experience.isCurrentPosition && (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-600 mb-3">
                    <Building className="w-5 h-5" />
                    <span className="font-semibold text-lg">{experience.company}</span>
                    {experience.companyWebsite && (
                      <ExternalLink className="w-4 h-4 ml-2 cursor-pointer hover:text-blue-800" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-6 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(experience.startDate).toLocaleDateString('en-US', { 
                          month: 'short', year: 'numeric' 
                        })} - {experience.isCurrentPosition ? 'Present' : 
                          new Date(experience.endDate).toLocaleDateString('en-US', { 
                            month: 'short', year: 'numeric' 
                          })
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{experience.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {experience.description}
                  </p>
                  
                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {experience.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setEditingExperience(experience)
                      setFormData({
                        company: experience.company || '',
                        position: experience.position || '',
                        location: experience.location || '',
                        startDate: experience.startDate ? experience.startDate.split('T')[0] : '',
                        endDate: experience.endDate ? experience.endDate.split('T')[0] : '',
                        isCurrentPosition: experience.isCurrentPosition || false,
                        description: experience.description || '',
                        responsibilities: experience.responsibilities || [],
                        technologies: experience.technologies || [],
                        companyLogo: experience.companyLogo || '',
                        companyWebsite: experience.companyWebsite || '',
                        employmentType: experience.employmentType || 'Full-time',
                        order: experience.order || 0
                      })
                      setIsModalOpen(true)
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(experience._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No experiences found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'No experiences match your current search or filter criteria.' 
                : 'Start by adding your first work experience.'}
            </p>
            {(!searchTerm && filterType === 'all') && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  resetForm()
                  setIsModalOpen(true)
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 font-medium mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Experience</span>
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-gray-100"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false)
                      resetForm()
                    }}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex flex-col h-[calc(90vh-120px)]">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  <div className="flex-1 p-6 overflow-y-auto min-h-0">
                    <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Company *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                      placeholder="Enter company name"
                    />
                  </div>

                  {/* Position */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Position *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      required
                      placeholder="Enter job position"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Location *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      placeholder="Enter work location"
                    />
                  </div>

                  {/* Employment Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Employment Type
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all duration-200 text-gray-900 bg-white"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={formData.isCurrentPosition}
                    />
                  </div>
                </div>

                {/* Current Position Checkbox */}
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <input
                    type="checkbox"
                    id="currentPosition"
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.isCurrentPosition}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      isCurrentPosition: e.target.checked,
                      endDate: e.target.checked ? '' : formData.endDate
                    })}
                  />
                  <label htmlFor="currentPosition" className="text-sm font-medium text-blue-800">
                    This is my current position
                  </label>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="Describe your role and responsibilities..."
                  />
                </div>

                {/* Responsibilities */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Key Responsibilities
                  </label>
                  <div className="space-y-2">
                    {formData.responsibilities.map((responsibility, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          value={responsibility}
                          onChange={(e) => handleArrayFieldChange('responsibilities', index, e.target.value)}
                          placeholder="Enter responsibility"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayField('responsibilities', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayField('responsibilities')}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Responsibility</span>
                    </button>
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Technologies Used
                  </label>
                  <div className="space-y-2">
                    {formData.technologies.map((technology, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          value={technology}
                          onChange={(e) => handleArrayFieldChange('technologies', index, e.target.value)}
                          placeholder="Enter technology"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayField('technologies', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayField('technologies')}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Technology</span>
                    </button>
                  </div>
                </div>
                    </div>
                  </div>

                  {/* Form Actions - Fixed at bottom */}
                  <div className="flex-shrink-0 border-t border-gray-200 p-6 bg-white rounded-b-3xl">
                    <div className="flex items-center justify-end gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false)
                          resetForm()
                        }}
                        className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {editingExperience ? 'Update' : 'Create'} Experience
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExperiencesAdmin