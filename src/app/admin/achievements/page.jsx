'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Eye,
  Trophy,
  Calendar,
  Building,
  Star,
  Zap,
  Save,
  X,
  Award,
  Target,
  TrendingUp,
  Link,
  Image,
  Tag,
  Upload,
  AlertCircle
} from 'lucide-react'
import { useSession } from 'next-auth/react'

const AchievementsAdmin = () => {
  const { data: session } = useSession()
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    date: '',
    organization: '',
    image: '',
    link: '',
    tags: [],
    impact: '',
    metrics: '',
    order: 0,
    isFeatured: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formError, setFormError] = useState('')

  const categories = ['Academic', 'Professional', 'Technical', 'Leadership', 'Community', 'Sports', 'Other']

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || achievement.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  // Fetch achievements
  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements')
      if (response.ok) {
        const data = await response.json()
        setAchievements(data)
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAchievements()
  }, [])

  // Handle image upload to storage bucket
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const uploadData = new FormData()
    uploadData.append('file', file)

    try {
      setUploadingImage(true)
      setFormError('')
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, image: data.url }))
      } else {
        setFormError('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setFormError('Error uploading image')
    } finally {
      setUploadingImage(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setFormError('')

    try {
      const url = editingAchievement ? `/api/achievements/${editingAchievement._id}` : '/api/achievements'
      const method = editingAchievement ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.filter(t => t.trim())
        }),
      })

      if (response.ok) {
        await fetchAchievements()
        setIsModalOpen(false)
        resetForm()
      } else {
        const errorBody = await response.json().catch(() => ({}))
        setFormError(errorBody.error || 'Failed to save achievement')
      }
    } catch (error) {
      console.error('Error saving achievement:', error)
      setFormError('Error saving achievement')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Academic',
      date: '',
      organization: '',
      image: '',
      link: '',
      tags: [],
      impact: '',
      metrics: '',
      order: 0,
      isFeatured: false
    })
    setEditingAchievement(null)
    setFormError('')
  }

  // Handle edit
  const handleEdit = (achievement) => {
    setEditingAchievement(achievement)
    setFormData({
      ...achievement,
      date: achievement.date ? new Date(achievement.date).toISOString().split('T')[0] : '',
      tags: achievement.tags || []
    })
    setIsModalOpen(true)
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      try {
        const response = await fetch(`/api/achievements/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          await fetchAchievements()
        }
      } catch (error) {
        console.error('Error deleting achievement:', error)
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

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Academic': 'bg-blue-100 text-blue-700 border-base-content',
      'Professional': 'bg-green-100 text-green-700 border-base-content',
      'Technical': 'bg-purple-100 text-purple-700 border-base-content',
      'Leadership': 'bg-orange-100 text-orange-700 border-base-content',
      'Community': 'bg-pink-100 text-pink-700 border-base-content',
      'Sports': 'bg-yellow-100 text-yellow-700 border-base-content',
      'Other': 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[category] || colors['Other']
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-base-300  w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-base-300 rounded-none h-64"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-base-200 min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary border-4 border-base-content p-8 mb-8 text-base-100 shadow-[8px_8px_0_0_currentColor]"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Trophy className="w-10 h-10" />
              Achievements Management
            </h1>
            <p className="text-primary-content/80 text-lg">Manage and showcase your accomplishments and milestones</p>
          </div>
          <button
            
            
            onClick={() => {
              resetForm()
              setIsModalOpen(true)
            }}
            className="bg-base-100 text-base-content border-2 border-base-content px-6 py-3 font-mono font-bold uppercase tracking-widest flex items-center gap-2 shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Achievement
          </button>
        </div>
      </motion.div>

      {/* Search and Filter Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search achievements..."
              className="w-full pl-10 pr-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
            <select
              className="pl-10 pr-8 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 bg-base-100 text-base-content"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-base-100 border-4 border-base-content p-6 shadow-[4px_4px_0_0_currentColor]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Achievements</p>
              <p className="text-2xl font-bold text-base-content">{achievements.length}</p>
            </div>
            <div className="bg-blue-500 p-3 ">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 border-4 border-base-content p-6 shadow-[4px_4px_0_0_currentColor]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Featured</p>
              <p className="text-2xl font-bold text-base-content">
                {achievements.filter(a => a.isFeatured).length}
              </p>
            </div>
            <div className="bg-green-500 p-3 ">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 border-4 border-base-content p-6 shadow-[4px_4px_0_0_currentColor]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Categories</p>
              <p className="text-2xl font-bold text-base-content">
                {new Set(achievements.map(a => a.category)).size}
              </p>
            </div>
            <div className="bg-purple-500 p-3 ">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 border-4 border-base-content p-6 shadow-[4px_4px_0_0_currentColor]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary text-sm font-medium">Filtered Results</p>
              <p className="text-2xl font-bold text-base-content">{filteredAchievements.length}</p>
            </div>
            <div className="bg-primary p-3 ">
              <Eye className="w-6 h-6 text-primary-content" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {filteredAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] p-6 hover:shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                {/* Achievement Image */}
                {achievement.image && (
                  <div className="w-full h-32 mb-4 border-2 border-base-content overflow-hidden">
                    <img
                      src={achievement.image}
                      alt={achievement.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 text-sm rounded-none border ${getCategoryColor(achievement.category)}`}>
                    {achievement.category}
                  </span>
                  {achievement.isFeatured && (
                    <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-none text-sm font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-base-content mb-2 line-clamp-2">
                  {achievement.title}
                </h3>
                
                <div className="flex items-center gap-2 text-base-content/70 mb-2">
                  <Building className="w-4 h-4" />
                  <span className="text-sm font-medium">{achievement.organization}</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-base-content/60 mb-3">
                  <Calendar className="w-4 h-4" />
                  {new Date(achievement.date).toLocaleDateString()}
                </div>
                
                <p className="text-base-content/70 text-sm mb-3 line-clamp-3">
                  {achievement.description}
                </p>
                
                {achievement.tags && achievement.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {achievement.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="bg-base-200 text-base-content/60 px-2 py-1  text-xs">
                        {tag}
                      </span>
                    ))}
                    {achievement.tags.length > 3 && (
                      <span className="bg-base-200 text-base-content/60 px-2 py-1  text-xs">
                        +{achievement.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-2 pt-3 border-t border-base-content">
                  <button
                    
                    
                    onClick={() => handleEdit(achievement)}
                    className="flex-1 bg-base-100 text-base-content border-2 border-base-content px-4 py-2 font-mono font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-[2px_2px_0_0_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    
                    
                    onClick={() => handleDelete(achievement._id)}
                    className="bg-error text-base-100 border-2 border-base-content p-2 shadow-[2px_2px_0_0_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] p-12 text-center">
            <Trophy className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content mb-2">No achievements found</h3>
            <p className="text-base-content/60 mb-6">
              {searchTerm || categoryFilter !== 'all' 
                ? 'No achievements match your current filters. Try adjusting your search.'
                : "Start adding your accomplishments and milestones to showcase your journey!"
              }
            </p>
            {(searchTerm || categoryFilter !== 'all') && (
              <button
                
                
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('all')
                }}
                className="bg-primary text-base-100 border-2 border-base-content px-6 py-2 font-mono font-bold uppercase tracking-widest shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-base-100 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-base-100 border-4 border-base-content shadow-[12px_12px_0_0_currentColor] w-full max-w-4xl max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-primary p-6 text-base-100 border-b-4 border-base-content">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Trophy className="w-8 h-8" />
                    {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
                  </h2>
                  <button
                    
                    
                    onClick={() => setIsModalOpen(false)}
                    className="bg-base-100 text-base-content border-2 border-base-content p-2 shadow-[2px_2px_0_0_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex flex-col h-[calc(90vh-120px)]">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  <div className="flex-1 p-6 overflow-y-auto min-h-0">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content/80 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="Enter achievement title"
                      />
                    </div>

                    {/* Organization */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content/80 mb-2">
                        Organization *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        required
                        placeholder="Enter organization name"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content/80 mb-2">
                        Category *
                      </label>
                      <select
                        className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 bg-base-100 text-base-content"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content/80 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>

                    {/* Image */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80 mb-2">
                        <Image className="w-4 h-4" />
                        Image
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          className="flex-1 px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                        <label className="cursor-pointer px-4 py-3 bg-base-200 border-2 border-base-content hover:bg-base-300 text-base-content/80 font-medium transition-colors flex items-center gap-2 shrink-0">
                          <Upload className="w-5 h-5" />
                          <span className="hidden sm:inline">{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            disabled={uploadingImage}
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Link */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80 mb-2">
                        <Link className="w-4 h-4" />
                        Link
                      </label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        placeholder="https://example.com/achievement"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-base-content/80 mb-2">
                      Description *
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 h-24 resize-none text-base-content bg-base-100"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      placeholder="Describe your achievement..."
                    />
                  </div>

                  {/* Impact */}
                  <div>
                    <label className="block text-sm font-semibold text-base-content/80 mb-2">
                      Impact
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 h-20 resize-none text-base-content bg-base-100"
                      value={formData.impact}
                      onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                      placeholder="Describe the impact or significance of this achievement"
                    />
                  </div>

                  {/* Metrics */}
                  <div>
                    <label className="block text-sm font-semibold text-base-content/80 mb-2">
                      Metrics
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
                      value={formData.metrics}
                      onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                      placeholder="e.g., 95% score, Top 10%, 1000+ participants"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80 mb-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </label>
                    <div className="space-y-2">
                      {formData.tags.map((tag, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
                            value={tag}
                            onChange={(e) => handleArrayFieldChange('tags', index, e.target.value)}
                            placeholder="Enter tag"
                          />
                          <button
                            
                            
                            type="button"
                            onClick={() => removeArrayField('tags', index)}
                            className="bg-base-100 text-error hover:bg-base-100 p-3 rounded-none transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        
                        
                        type="button"
                        onClick={() => addArrayField('tags')}
                        className="bg-base-100 text-primary hover:bg-base-100 px-4 py-3 rounded-none transition-colors font-medium flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Tag
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content/80 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>

                    {/* Featured */}
                    <div className="flex items-center">
                      <label className="flex items-center gap-3 cursor-pointer bg-base-200 px-4 py-3 rounded-none hover:bg-base-300 transition-colors">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-primary border-base-300 rounded focus:ring-primary"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        />
                        <span className="text-sm font-semibold text-base-content/80 flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Featured Achievement
                        </span>
                      </label>
                    </div>
                  </div>
                    </div>
                  </div>

                  {/* Form Actions - Fixed at bottom */}
                  <div className="shrink-0 border-t border-base-300 p-6 bg-base-100 rounded-b-3xl">
                    <div className="flex items-center justify-between gap-4">
                      {formError ? (
                        <p className="text-error text-sm font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{formError}</p>
                      ) : <span />}
                      <div className="flex items-center gap-4 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false)
                            resetForm()
                          }}
                          className="bg-base-100 text-base-content border-2 border-base-content px-6 py-3 font-mono font-bold uppercase tracking-widest shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-primary text-base-100 border-2 border-base-content px-8 py-3 font-mono font-bold uppercase tracking-widest shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="w-4 h-4" />
                          {isSubmitting ? 'Saving...' : `${editingAchievement ? 'Update' : 'Create'} Achievement`}
                        </button>
                      </div>
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

export default AchievementsAdmin