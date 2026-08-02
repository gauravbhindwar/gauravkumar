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
  Medal,
  Award,
  Save,
  X,
  Target,
  Crown,
  Gift,
  Link,
  Image,
  Tag,
  FileText
} from 'lucide-react'
import { useSession } from 'next-auth/react'

const AwardsAdmin = () => {
  const { data: session } = useSession()
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAward, setEditingAward] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    awardedBy: '',
    date: '',
    category: 'Academic',
    level: 'Institutional',
    image: '',
    certificateUrl: '',
    link: '',
    position: '',
    prizeValue: '',
    criteria: '',
    tags: [],
    order: 0,
    isFeatured: false
  })

  const categories = ['Academic', 'Professional', 'Technical', 'Leadership', 'Innovation', 'Community Service', 'Competition', 'Recognition', 'Other']
  const levels = ['International', 'National', 'Regional', 'State', 'Local', 'Institutional']

  // Filter awards
  const filteredAwards = awards.filter(award => {
    const matchesSearch = award.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         award.awardedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         award.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || award.category === categoryFilter
    const matchesLevel = levelFilter === 'all' || award.level === levelFilter
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  // Fetch awards
  const fetchAwards = async () => {
    try {
      const response = await fetch('/api/awards')
      if (response.ok) {
        const data = await response.json()
        setAwards(data)
      }
    } catch (error) {
      console.error('Error fetching awards:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAwards()
  }, [])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingAward ? `/api/awards/${editingAward._id}` : '/api/awards'
      const method = editingAward ? 'PUT' : 'POST'
      
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
        await fetchAwards()
        setIsModalOpen(false)
        resetForm()
      } else {
        console.error('Error saving award')
      }
    } catch (error) {
      console.error('Error saving award:', error)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      awardedBy: '',
      date: '',
      category: 'Academic',
      level: 'Institutional',
      image: '',
      certificateUrl: '',
      link: '',
      position: '',
      prizeValue: '',
      criteria: '',
      tags: [],
      order: 0,
      isFeatured: false
    })
    setEditingAward(null)
  }

  // Handle edit
  const handleEdit = (award) => {
    setEditingAward(award)
    setFormData({
      ...award,
      date: award.date ? new Date(award.date).toISOString().split('T')[0] : '',
      tags: award.tags || []
    })
    setIsModalOpen(true)
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this award?')) {
      try {
        const response = await fetch(`/api/awards/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          await fetchAwards()
        }
      } catch (error) {
        console.error('Error deleting award:', error)
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

  // Get level color
  const getLevelColor = (level) => {
    const colors = {
      'International': 'bg-red-100 text-red-700 border-base-content',
      'National': 'bg-blue-100 text-blue-700 border-base-content',
      'Regional': 'bg-green-100 text-green-700 border-base-content',
      'State': 'bg-purple-100 text-purple-700 border-base-content',
      'Local': 'bg-orange-100 text-orange-700 border-base-content',
      'Institutional': 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[level] || colors['Institutional']
  }

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Academic': 'bg-blue-100 text-blue-700 border-base-content',
      'Professional': 'bg-green-100 text-green-700 border-base-content',
      'Technical': 'bg-purple-100 text-purple-700 border-base-content',
      'Leadership': 'bg-orange-100 text-orange-700 border-base-content',
      'Innovation': 'bg-pink-100 text-pink-700 border-base-content',
      'Community Service': 'bg-teal-100 text-teal-700 border-base-content',
      'Competition': 'bg-red-100 text-red-700 border-base-content',
      'Recognition': 'bg-yellow-100 text-yellow-700 border-base-content',
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
              <Award className="w-10 h-10" />
              Awards Management
            </h1>
            <p className="text-primary-content/80 text-lg">Manage and showcase your recognitions and honors</p>
          </div>
          <button
            
            
            onClick={() => {
              resetForm()
              setIsModalOpen(true)
            }}
            className="bg-base-100 text-base-content border-2 border-base-content px-6 py-3 font-mono font-bold uppercase tracking-widest flex items-center gap-2 shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Award
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
              placeholder="Search awards..."
              className="w-full pl-10 pr-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white text-gray-900"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white text-gray-900"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="all">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
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
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Awards</p>
              <p className="text-2xl font-bold text-base-content">{awards.length}</p>
            </div>
            <div className="bg-blue-500 p-3 ">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 border-4 border-base-content p-6 shadow-[4px_4px_0_0_currentColor]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Featured</p>
              <p className="text-2xl font-bold text-base-content">
                {awards.filter(a => a.isFeatured).length}
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
              <p className="text-primary text-sm font-medium">International</p>
              <p className="text-2xl font-bold text-base-content">
                {awards.filter(a => a.level === 'International').length}
              </p>
            </div>
            <div className="bg-primary p-3 ">
              <Crown className="w-6 h-6 text-primary-content" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 rounded-none p-6 border border-base-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-medium">Filtered Results</p>
              <p className="text-2xl font-bold text-base-content">{filteredAwards.length}</p>
            </div>
            <div className="bg-secondary p-3 ">
              <Eye className="w-6 h-6 text-secondary-content" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Awards Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {filteredAwards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAwards.map((award, index) => (
              <motion.div
                key={award._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] overflow-hidden hover:shadow-[4px_4px_0_0_currentColor] transition-all duration-300"
              >
                {/* Award Header */}
                <div className="bg-primary border-b-4 border-base-content p-4 text-primary-content">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="w-6 h-6" />
                    {award.isFeatured && (
                      <div className="border-2 border-base-content bg-base-200 text-base-content font-mono font-bold uppercase tracking-widest px-2 py-1 rounded-none text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-none border-2 border-base-content bg-base-200 text-base-content font-mono font-bold uppercase tracking-widest`}>
                    {award.level}
                  </span>
                </div>

                <div className="p-6">
                  {/* Award Image */}
                  {award.image && (
                    <div className="w-full h-32 mb-4 border-2 border-base-content overflow-hidden">
                      <img
                        src={award.image}
                        alt={award.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <h3 className="text-lg font-bold text-base-content mb-2 line-clamp-2">
                    {award.title}
                  </h3>

                  {award.position && (
                    <div className="flex items-center gap-2 mb-3">
                      <Medal className="w-4 h-4 text-warning" />
                      <span className="text-warning font-semibold text-sm">{award.position}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 text-sm rounded-none border ${getCategoryColor(award.category)}`}>
                      {award.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-base-content/60">
                      <Calendar className="w-3 h-3" />
                      {new Date(award.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-base-content/70 mb-3">
                    <Building className="w-4 h-4" />
                    <span className="text-sm font-medium">{award.awardedBy}</span>
                  </div>
                  
                  <p className="text-base-content/70 text-sm mb-3 line-clamp-3">
                    {award.description}
                  </p>

                  {award.prizeValue && (
                    <div className="bg-base-100 text-success px-3 py-1  text-sm font-medium mb-3 flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      {award.prizeValue}
                    </div>
                  )}
                  
                  {award.tags && award.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {award.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="bg-base-200 text-base-content/60 px-2 py-1  text-xs">
                          {tag}
                        </span>
                      ))}
                      {award.tags.length > 3 && (
                        <span className="bg-base-200 text-base-content/60 px-2 py-1  text-xs">
                          +{award.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 pt-3 border-t border-base-content">
                    <button
                      
                      
                      onClick={() => handleEdit(award)}
                      className="flex-1 bg-base-100 text-base-content border-2 border-base-content px-4 py-2 font-mono font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-[2px_2px_0_0_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      
                      
                      onClick={() => handleDelete(award._id)}
                      className="bg-error text-base-100 border-2 border-base-content p-2 shadow-[2px_2px_0_0_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] p-12 text-center">
            <Award className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content mb-2">No awards found</h3>
            <p className="text-base-content/60 mb-6">
              {searchTerm || categoryFilter !== 'all' || levelFilter !== 'all'
                ? 'No awards match your current filters. Try adjusting your search.'
                : "Start adding your awards and recognitions to showcase your achievements!"
              }
            </p>
            {(searchTerm || categoryFilter !== 'all' || levelFilter !== 'all') && (
              <button
                
                
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('all')
                  setLevelFilter('all')
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
                    <Award className="w-8 h-8" />
                    {editingAward ? 'Edit Award' : 'Add New Award'}
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
                            placeholder="Enter award title"
                          />
                        </div>

                        {/* Awarded By */}
                        <div>
                          <label className="block text-sm font-semibold text-base-content/80 mb-2">
                            Awarded By *
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
                            value={formData.awardedBy}
                            onChange={(e) => setFormData({ ...formData, awardedBy: e.target.value })}
                            required
                            placeholder="Enter awarding organization"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-sm font-semibold text-base-content/80 mb-2">
                            Category *
                          </label>
                          <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white text-gray-900"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                          >
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>

                        {/* Level */}
                        <div>
                          <label className="block text-sm font-semibold text-base-content/80 mb-2">
                            Level
                          </label>
                          <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white text-gray-900"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                          >
                            {levels.map(level => (
                              <option key={level} value={level}>{level}</option>
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

                        {/* Position */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80 mb-2">
                            <Medal className="w-4 h-4" />
                            Position/Rank
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            placeholder="e.g., 1st Place, Winner, Finalist"
                          />
                        </div>

                        {/* Prize Value */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80 mb-2">
                            <Gift className="w-4 h-4" />
                            Prize Value
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
                            value={formData.prizeValue}
                            onChange={(e) => setFormData({ ...formData, prizeValue: e.target.value })}
                            placeholder="e.g., $1000, Gold Medal, Scholarship"
                          />
                        </div>

                        {/* Image URL */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80 mb-2">
                            <Image className="w-4 h-4" />
                            Image URL
                          </label>
                          <input
                            type="url"
                            className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://example.com/award-image.jpg"
                          />
                        </div>

                        {/* Certificate URL */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-base-content/80 mb-2">
                            <FileText className="w-4 h-4" />
                            Certificate URL
                          </label>
                          <input
                            type="url"
                            className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 text-base-content bg-base-100"
                            value={formData.certificateUrl}
                            onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                            placeholder="https://example.com/certificate.pdf"
                          />
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
                            placeholder="https://example.com/award-details"
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
                          placeholder="Describe your award..."
                        />
                      </div>

                      {/* Criteria */}
                      <div>
                        <label className="block text-sm font-semibold text-base-content/80 mb-2">
                          Criteria
                        </label>
                        <textarea
                          className="w-full px-4 py-3 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono transition-all duration-300 h-20 resize-none text-base-content bg-base-100"
                          value={formData.criteria}
                          onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                          placeholder="What were the criteria or requirements for this award?"
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
                              Featured Award
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions - Fixed at bottom */}
                  <div className="shrink-0 border-t border-base-300 p-6 bg-base-100 rounded-b-3xl">
                    <div className="flex items-center justify-end gap-4">
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
                        className="bg-primary text-base-100 border-2 border-base-content px-8 py-3 font-mono font-bold uppercase tracking-widest shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {editingAward ? 'Update' : 'Create'} Award
                      </button>
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

export default AwardsAdmin