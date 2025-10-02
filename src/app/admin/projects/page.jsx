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
  ExternalLink,
  Github,
  Star,
  Calendar,
  Code,
  Zap,
  Save,
  X,
  Grid,
  List,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react'
import { useSession } from 'next-auth/react'

const ProjectsAdmin = () => {
  const { data: session } = useSession()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    tech: [],
    features: [],
    githubUrl: '',
    liveUrl: '',
    status: 'completed',
    featured: false,
    order: 0
  })
  const [techInput, setTechInput] = useState('')
  const [featuresInput, setFeaturesInput] = useState('')

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.tech && project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())))
    
    const matchesFilter = statusFilter === 'all' || 
                         project.status === statusFilter ||
                         (statusFilter === 'featured' && project.featured)
    
    return matchesSearch && matchesFilter
  })

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      tech: [],
      features: [],
      githubUrl: '',
      liveUrl: '',
      status: 'completed',
      featured: false,
      order: 0
    })
    setTechInput('')
    setFeaturesInput('')
    setEditingProject(null)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Process tech and features from text inputs
      const techArray = techInput.split(',').map(t => t.trim()).filter(t => t !== '')
      const featuresArray = featuresInput.split('\n').map(f => f.trim()).filter(f => f !== '')
      
      const submitData = {
        ...formData,
        tech: techArray,
        features: featuresArray
      }

      const url = editingProject 
        ? `/api/projects`
        : '/api/projects'
      
      const method = editingProject ? 'PUT' : 'POST'
      
      if (editingProject) {
        submitData._id = editingProject._id
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })
      
      if (response.ok) {
        await fetchProjects()
        setIsModalOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects?id=${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          await fetchProjects()
        }
      } catch (error) {
        console.error('Error deleting project:', error)
      }
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
              Manage Projects
            </h1>
            <p className="text-gray-600 mt-1">Create and manage your portfolio projects</p>
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
            <span>Add Project</span>
          </motion.button>
        </div>
      </div>

      {/* Search, Filters and View Toggle */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="all">All Projects</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
                <option value="featured">Featured</option>
              </select>
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Projects</p>
              <p className="text-2xl font-bold text-blue-900">{projects.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-emerald-900">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <div className="bg-emerald-500 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Featured</p>
              <p className="text-2xl font-bold text-purple-900">
                {projects.filter(p => p.featured).length}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Filtered Results</p>
              <p className="text-2xl font-bold text-orange-900">{filteredProjects.length}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project._id || project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className={`bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${
                viewMode === 'grid' ? 'p-6' : 'p-6 flex items-center space-x-6'
              }`}
            >
              {project.image && (
                <div className={`${viewMode === 'grid' ? 'w-full h-48 mb-4' : 'w-24 h-24 flex-shrink-0'} bg-gray-100 rounded-lg overflow-hidden`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className={`${viewMode === 'grid' ? '' : 'flex-1'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                      {project.featured && (
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'completed' ? 'bg-green-100 text-green-700' :
                      project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status?.replace('-', ' ') || 'completed'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingProject(project)
                        setFormData({
                          title: project.title || '',
                          description: project.description || '',
                          image: project.image || '',
                          tech: project.tech || [],
                          features: project.features || [],
                          githubUrl: project.githubUrl || project.github || '',
                          liveUrl: project.liveUrl || project.live || '',
                          status: project.status || 'completed',
                          featured: project.featured || project.preview || false,
                          order: project.order || 0
                        })
                        setTechInput((project.tech || []).join(', '))
                        setFeaturesInput((project.features || []).join('\n'))
                        setIsModalOpen(true)
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(project._id || project.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                {project.tech && project.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'No projects match your current search or filter criteria.' 
                : 'Start by adding your first project.'}
            </p>
            {(!searchTerm && statusFilter === 'all') && (
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
                <span>Add Your First Project</span>
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
                      <Code className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {editingProject ? 'Edit Project' : 'Add New Project'}
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
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Enter project title"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Status
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="planned">Planned</option>
                    </select>
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Image URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* GitHub URL */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/username/project"
                    />
                  </div>

                  {/* Live URL */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://project-demo.com"
                    />
                  </div>

                  {/* Order */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Display Order
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <input
                    type="checkbox"
                    id="featured"
                    className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-yellow-800 flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Featured Project</span>
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
                    placeholder="Describe your project..."
                  />
                </div>

                {/* Technologies */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Technologies Used
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="React, Node.js, MongoDB (comma-separated)"
                  />
                  <p className="text-sm text-gray-500 flex items-center space-x-1">
                    <Code className="w-4 h-4" />
                    <span>Enter technologies separated by commas</span>
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Key Features
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white"
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="User authentication&#10;Real-time chat&#10;Responsive design&#10;(one feature per line)"
                  />
                  <p className="text-sm text-gray-500 flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>Enter each feature on a new line</span>
                  </p>
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
                        {editingProject ? 'Update' : 'Create'} Project
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

export default ProjectsAdmin