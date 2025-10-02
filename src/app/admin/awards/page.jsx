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
      'International': 'bg-red-100 text-red-700 border-red-200',
      'National': 'bg-blue-100 text-blue-700 border-blue-200',
      'Regional': 'bg-green-100 text-green-700 border-green-200',
      'State': 'bg-purple-100 text-purple-700 border-purple-200',
      'Local': 'bg-orange-100 text-orange-700 border-orange-200',
      'Institutional': 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[level] || colors['Institutional']
  }

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Academic': 'bg-blue-100 text-blue-700 border-blue-200',
      'Professional': 'bg-green-100 text-green-700 border-green-200',
      'Technical': 'bg-purple-100 text-purple-700 border-purple-200',
      'Leadership': 'bg-orange-100 text-orange-700 border-orange-200',
      'Innovation': 'bg-pink-100 text-pink-700 border-pink-200',
      'Community Service': 'bg-teal-100 text-teal-700 border-teal-200',
      'Competition': 'bg-red-100 text-red-700 border-red-200',
      'Recognition': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Other': 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[category] || colors['Other']
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 mb-8 text-white shadow-2xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Award className="w-10 h-10" />
              Awards Management
            </h1>
            <p className="text-pink-100 text-lg">Manage and showcase your recognitions and honors</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm()
              setIsModalOpen(true)
            }}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Add Award
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filter Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input
              type="text"
              placeholder="Search awards..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white text-gray-900"
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
              <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white text-gray-900"
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
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Awards</p>
              <p className="text-2xl font-bold text-blue-900">{awards.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Featured</p>
              <p className="text-2xl font-bold text-green-900">
                {awards.filter(a => a.isFeatured).length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">International</p>
              <p className="text-2xl font-bold text-purple-900">
                {awards.filter(a => a.level === 'International').length}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Filtered Results</p>
              <p className="text-2xl font-bold text-orange-900">{filteredAwards.length}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
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
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Award Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="w-6 h-6" />
                    {award.isFeatured && (
                      <div className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full bg-white bg-opacity-20`}>
                    {award.level}
                  </span>
                </div>

                <div className="p-6">
                  {/* Award Image */}
                  {award.image && (
                    <div className="w-full h-32 mb-4 rounded-xl overflow-hidden">
                      <img
                        src={award.image}
                        alt={award.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {award.title}
                  </h3>

                  {award.position && (
                    <div className="flex items-center gap-2 mb-3">
                      <Medal className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-600 font-semibold text-sm">{award.position}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 text-sm rounded-full border ${getCategoryColor(award.category)}`}>
                      {award.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(award.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Building className="w-4 h-4" />
                    <span className="text-sm font-medium">{award.awardedBy}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {award.description}
                  </p>

                  {award.prizeValue && (
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-medium mb-3 flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      {award.prizeValue}
                    </div>
                  )}
                  
                  {award.tags && award.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {award.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
                          {tag}
                        </span>
                      ))}
                      {award.tags.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
                          +{award.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(award)}
                      className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(award._id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No awards found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || categoryFilter !== 'all' || levelFilter !== 'all'
                ? 'No awards match your current filters. Try adjusting your search.'
                : "Start adding your awards and recognitions to showcase your achievements!"
              }
            </p>
            {(searchTerm || categoryFilter !== 'all' || levelFilter !== 'all') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('all')
                  setLevelFilter('all')
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Clear Filters
              </motion.button>
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Award className="w-8 h-8" />
                    {editingAward ? 'Edit Award' : 'Add New Award'}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(false)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
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
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Title *
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-white"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Enter award title"
                          />
                        </div>

                        {/* Awarded By */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Awarded By *
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-white"
                            value={formData.awardedBy}
                            onChange={(e) => setFormData({ ...formData, awardedBy: e.target.value })}
                            required
                            placeholder="Enter awarding organization"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white text-gray-900"
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
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Level
                          </label>
                          <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white text-gray-900"
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
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date *
                          </label>
                          <input
                            type="date"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-white"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                          />
                        </div>

                        {/* Position */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Medal className="w-4 h-4" />
                            Position/Rank
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-white"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            placeholder="e.g., 1st Place, Winner, Finalist"
                          />
                        </div>

                        {/* Prize Value */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Gift className="w-4 h-4" />
                            Prize Value
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-white"
                            value={formData.prizeValue}
                            onChange={(e) => setFormData({ ...formData, prizeValue: e.target.value })}
                            placeholder="e.g., $1000, Gold Medal, Scholarship"
                          />
                        </div>

                        {/* Image URL */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Image className="w-4 h-4" />
                            Image URL
                          </label>
                          <input
                            type="url"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-white"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://example.com/award-image.jpg"
                          />
                        </div>

                        {/* Certificate URL */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <FileText className="w-4 h-4" />
                            Certificate URL
                          </label>
                          <input
                            type="url"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-white"
                            value={formData.certificateUrl}
                            onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                            placeholder="https://example.com/certificate.pdf"
                          />
                        </div>

                        {/* Link */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Link className="w-4 h-4" />
                            Link
                          </label>
                          <input
                            type="url"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-white"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            placeholder="https://example.com/award-details"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 h-24 resize-none text-gray-900 bg-white"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                          placeholder="Describe your award..."
                        />
                      </div>

                      {/* Criteria */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Criteria
                        </label>
                        <textarea
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 h-20 resize-none text-gray-900 bg-white"
                          value={formData.criteria}
                          onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                          placeholder="What were the criteria or requirements for this award?"
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <Tag className="w-4 h-4" />
                          Tags
                        </label>
                        <div className="space-y-2">
                          {formData.tags.map((tag, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-white"
                                value={tag}
                                onChange={(e) => handleArrayFieldChange('tags', index, e.target.value)}
                                placeholder="Enter tag"
                              />
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => removeArrayField('tags', index)}
                                className="bg-red-50 text-red-600 hover:bg-red-100 p-3 rounded-xl transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          ))}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => addArrayField('tags')}
                            className="bg-purple-50 text-purple-600 hover:bg-purple-100 px-4 py-3 rounded-xl transition-colors font-medium flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Tag
                          </motion.button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Order */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Display Order
                          </label>
                          <input
                            type="number"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-white"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                          />
                        </div>

                        {/* Featured */}
                        <div className="flex items-center">
                          <label className="flex items-center gap-3 cursor-pointer bg-gray-50 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              checked={formData.isFeatured}
                              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                            />
                            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              Featured Award
                            </span>
                          </label>
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
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {editingAward ? 'Update' : 'Create'} Award
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

export default AwardsAdmin