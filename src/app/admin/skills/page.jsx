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
  Code,
  BookOpen,
  Brain,
  Star,
  Zap,
  Save,
  X,
  Award,
  Target,
  TrendingUp
} from 'lucide-react'
import { useSession } from 'next-auth/react'

const SkillsAdmin = () => {
  const { data: session } = useSession()
  const [skills, setSkills] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formType, setFormType] = useState('skill') // 'skill' or 'course'
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('skills')
  const [formData, setFormData] = useState({
    name: '',
    category: 'Languages',
    level: 'Intermediate',
    type: 'current',
    description: '',
    url: ''
  })

  const skillCategories = ['Languages', 'Web Development', 'Data Science & ML', 'Tools & Platforms']
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  const courseTypes = ['current', 'completed', 'paused', 'planned']

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.category?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || course.type === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await fetch('/api/skills')
      if (response.ok) {
        const data = await response.json()
        
        // Extract skills from categories
        const allSkills = []
        if (data.categories) {
          data.categories.forEach(category => {
            category.skills.forEach(skill => {
              allSkills.push({ ...skill, category: category.name })
            })
          })
        }
        setSkills(allSkills)

        // Extract courses
        const allCourses = []
        if (data.courses) {
          Object.entries(data.courses).forEach(([type, courseList]) => {
            courseList.forEach((course) => {
              if (typeof course === 'object' && course._id) {
                allCourses.push({
                  ...course,
                  type: course.type || type
                })
              }
            })
          })
        }
        setCourses(allCourses)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Languages',
      level: 'Intermediate',
      type: 'current',
      description: '',
      url: ''
    })
    setEditingItem(null)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const method = editingItem ? 'PUT' : 'POST'
      
      let payload
      if (formType === 'course') {
        payload = {
          type: 'course',
          name: formData.name,
          courseType: formData.type,
          description: formData.description,
          url: formData.url
        }
      } else {
        payload = {
          type: 'skill',
          name: formData.name,
          category: formData.category,
          level: formData.level
        }
      }
      
      if (editingItem && editingItem._id) {
        payload.id = editingItem._id
      }
      
      const response = await fetch('/api/skills', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        await fetchData()
        setIsModalOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  // Handle delete
  const handleDelete = async (item, type) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (!item._id) {
          alert(`Cannot delete ${type}: Missing ID`)
          return
        }
        
        const deleteUrl = `/api/skills?type=${encodeURIComponent(type)}&id=${encodeURIComponent(item._id)}`
        
        const response = await fetch(deleteUrl, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          await fetchData()
        }
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'bg-red-100 text-red-700 border-red-200'
      case 'Advanced': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Intermediate': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'current': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'paused': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
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
              Skills & Learning
            </h1>
            <p className="text-gray-600 mt-1">Manage your technical skills and learning progress</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setFormType('skill')
                resetForm()
                setIsModalOpen(true)
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg shadow-blue-500/25"
            >
              <Code className="w-4 h-4" />
              <span>Add Skill</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setFormType('course')
                resetForm()
                setIsModalOpen(true)
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg shadow-purple-500/25"
            >
              <BookOpen className="w-4 h-4" />
              <span>Add Course</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'skills'
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Code className="w-4 h-4" />
              <span>Skills ({skills.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'courses'
                ? 'bg-white shadow-sm text-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Courses ({courses.length})</span>
            </div>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="all">All {activeTab === 'skills' ? 'Categories' : 'Types'}</option>
              {activeTab === 'skills' ? (
                skillCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              ) : (
                courseTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Skills</p>
                <p className="text-2xl font-bold text-blue-900">{skills.length}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Expert Level</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {skills.filter(s => s.level === 'Expert').length}
                </p>
              </div>
              <div className="bg-emerald-500 p-3 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Categories</p>
                <p className="text-2xl font-bold text-purple-900">
                  {new Set(skills.map(s => s.category)).size}
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Filtered Results</p>
                <p className="text-2xl font-bold text-orange-900">{filteredSkills.length}</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total Courses</p>
                <p className="text-2xl font-bold text-purple-900">{courses.length}</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {courses.filter(c => c.type === 'completed').length}
                </p>
              </div>
              <div className="bg-emerald-500 p-3 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-blue-900">
                  {courses.filter(c => c.type === 'current').length}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Filtered Results</p>
                <p className="text-2xl font-bold text-orange-900">{filteredCourses.length}</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'skills' ? (
          filteredSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill._id || `${skill.category}-${skill.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{skill.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {skill.category}
                        </span>
                        <span className={`px-3 py-1 text-sm rounded-full border ${getLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingItem(skill)
                          setFormType('skill')
                          setFormData({
                            name: skill.name || '',
                            category: skill.category || 'Languages',
                            level: skill.level || 'Intermediate',
                            type: 'current',
                            description: '',
                            url: ''
                          })
                          setIsModalOpen(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(skill, 'skill')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
              <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No skills found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'No skills match your current search or filter criteria.' 
                  : 'Start by adding your first skill.'}
              </p>
            </div>
          )
        ) : (
          filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course._id || `${course.type}-${course.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{course.name}</h3>
                      <span className={`px-3 py-1 text-sm rounded-full border ${getTypeColor(course.type)}`}>
                        {course.type?.charAt(0).toUpperCase() + course.type?.slice(1)}
                      </span>
                      {course.description && (
                        <p className="text-gray-600 mt-3 text-sm">{course.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingItem(course)
                          setFormType('course')
                          setFormData({
                            name: course.name || '',
                            category: 'Languages',
                            level: 'Intermediate',
                            type: course.type || 'current',
                            description: course.description || '',
                            url: course.url || ''
                          })
                          setIsModalOpen(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(course, 'course')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'No courses match your current search or filter criteria.' 
                  : 'Start by adding your first course.'}
              </p>
            </div>
          )
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
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100"
            >
              {/* Modal Header */}
              <div className={`p-6 text-white ${formType === 'skill' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      {formType === 'skill' ? <Code className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                    </div>
                    <h3 className="text-2xl font-bold">
                      {editingItem ? `Edit ${formType}` : `Add New ${formType}`}
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
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {formType === 'skill' ? 'Skill Name' : 'Course Name'} *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder={`Enter ${formType} name`}
                  />
                </div>

                {formType === 'skill' ? (
                  <>
                    {/* Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Category
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {skillCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Level */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Proficiency Level
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      >
                        {skillLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Course Type */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Course Status
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        {courseTypes.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the course..."
                      />
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Course URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://example.com/course"
                      />
                    </div>
                  </>
                )}
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
                        className={`px-8 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 ${
                          formType === 'skill' 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600'
                        }`}
                      >
                        <Save className="w-4 h-4" />
                        {editingItem ? 'Update' : 'Create'} {formType}
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

export default SkillsAdmin