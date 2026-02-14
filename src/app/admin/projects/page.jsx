'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Code,
  Zap,
  Save,
  X,
  Grid,
  List,
  Layout,
  Layers,
  CheckCircle
} from 'lucide-react';
import { useSession } from 'next-auth/react';

const ProjectsAdmin = () => {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  
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
  });
  
  const [techInput, setTechInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.tech && project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesFilter = statusFilter === 'all' || 
                         project.status === statusFilter ||
                         (statusFilter === 'featured' && project.featured);
    
    return matchesSearch && matchesFilter;
  });

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
    });
    setTechInput('');
    setFeaturesInput('');
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // Process tech and features from text inputs
      const techArray = techInput.split(',').map(t => t.trim()).filter(t => t !== '');
      const featuresArray = featuresInput.split('\n').map(f => f.trim()).filter(f => f !== '');
      
      const submitData = {
        ...formData,
        tech: techArray,
        features: featuresArray
      };

      const url = editingProject 
        ? `/api/projects`
        : '/api/projects';
      
      const method = editingProject ? 'PUT' : 'POST';
      
      if (editingProject) {
        submitData._id = editingProject._id;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      
      if (response.ok) {
        await fetchProjects();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeletingId(itemToDelete);
    try {
      const response = await fetch(`/api/projects?id=${itemToDelete}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchProjects();
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setDeletingId(null);
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans text-gray-900"
    >
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold tracking-tight text-gray-900"
            >
              Projects
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 mt-1"
            >
              Showcase your work and portfolio.
            </motion.p>
          </div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Add Project</span>
          </motion.button>
        </header>

        {/* Stats Cards - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { 
              label: 'Total Projects', 
              value: projects.length, 
              icon: Layout,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              borderColor: 'border-blue-100'
            },
            { 
              label: 'Completed', 
              value: projects.filter(p => p.status === 'completed').length, 
              icon: CheckCircle,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              borderColor: 'border-emerald-100'
            },
            { 
              label: 'Featured', 
              value: projects.filter(p => p.featured).length, 
              icon: Star,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
              borderColor: 'border-purple-100'
            },
            { 
              label: 'In Progress',
              value: projects.filter(p => p.status === 'in-progress').length,
              icon: Zap,
              color: 'text-orange-600',
              bg: 'bg-orange-50',
              borderColor: 'border-orange-100'
            }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              variants={item}
              whileHover={{ y: -5 }}
              className={`bg-white p-6 rounded-2xl border ${stat.borderColor} shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <motion.div 
          variants={item}
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search projects by title, tech, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
               <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
               >
                  <Grid className="w-4 h-4" />
               </button>
               <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
               >
                  <List className="w-4 h-4" />
               </button>
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="planned">Planned</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </motion.div>

        {/* Projects List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project._id || project.id}
                variants={item}
                whileHover={{ y: -5 }}
                onClick={() => setViewingProject(project)}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group cursor-pointer ${
                   viewMode === 'list' ? 'flex items-center p-4 gap-6' : 'flex flex-col'
                }`}
              >
                {/* Image Section */}
                <div className={`${viewMode === 'grid' ? 'h-48 w-full' : 'h-24 w-40 flex-shrink-0'} bg-gray-100 relative overflow-hidden`}>
                   {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                         <Layout className="w-12 h-12" />
                      </div>
                   )}
                   {project.featured && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm text-yellow-500">
                         <Star className="w-4 h-4 fill-current" />
                      </div>
                   )}
                </div>

                {/* Content Section */}
                <div className={`flex-1 ${viewMode === 'grid' ? 'p-6' : ''}`}>
                   <div className="flex justify-between items-start mb-2">
                      <div className="space-y-1">
                         <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{project.title}</h3>
                         <div className="flex items-center gap-2">
                           <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                              project.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                              project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                              project.status === 'planned' ? 'bg-gray-100 text-gray-600' :
                              'bg-gray-100 text-gray-600'
                           }`}>
                              {(project.status || 'In Progress').replace('-', ' ')}
                           </span>
                           {project.githubUrl && <a href={project.githubUrl} onClick={(e) => e.stopPropagation()} target="_blank" className="text-gray-400 hover:text-gray-800"><Github className="w-4 h-4" /></a>}
                           {project.liveUrl && <a href={project.liveUrl} onClick={(e) => e.stopPropagation()} target="_blank" className="text-gray-400 hover:text-blue-600"><ExternalLink className="w-4 h-4" /></a>}
                         </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProject(project);
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
                              });
                              setTechInput((project.tech || []).join(', '));
                              setFeaturesInput((project.features || []).join('\n'));
                              setIsModalOpen(true);
                            }}
                            className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                         >
                            <Edit className="w-4 h-4" />
                         </button>
                         <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(project._id || project.id);
                            }}
                            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                   
                   <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                   </p>

                   {project.tech?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-auto">
                         {project.tech.slice(0, 4).map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs font-medium text-gray-600">
                               {tech}
                            </span>
                         ))}
                         {project.tech.length > 4 && (
                            <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs font-medium text-gray-500">
                               +{project.tech.length - 4}
                            </span>
                         )}
                      </div>
                   )}
                </div>

              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-12 text-center">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-2">No projects found</h3>
               <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchTerm || statusFilter !== 'all' 
                     ? 'Try adjusting your search criteria.' 
                     : 'Start building your portfolio by adding your first project.'}
               </p>
               {(!searchTerm && statusFilter === 'all') && (
                  <button
                     onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                     }}
                     className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/20 inline-flex items-center gap-2"
                  >
                     <Plus className="w-5 h-5" />
                     <span>Add First Project</span>
                  </button>
               )}
            </div>
          )}
        </div>

      </div>

      {/* Modal - Add/Edit Project */}
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
              className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="bg-blue-600 p-6 flex items-center justify-between text-white shrink-0">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Code className="w-6 h-6" />
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <form id="projectForm" onSubmit={handleSubmit} className="space-y-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Project Title *</label>
                        <input
                           type="text"
                           required
                           value={formData.title}
                           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           placeholder="e.g. Portfolio v2"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Project Status</label>
                        <select
                           value={formData.status}
                           onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        >
                           <option value="completed">Completed</option>
                           <option value="in-progress">In Progress</option>
                           <option value="planned">Planned</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-700">Description *</label>
                     <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder="What did you build and why?"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-semibold text-gray-700">Image URL</label>
                     <div className="flex gap-2">
                        <input
                           type="url"
                           value={formData.image}
                           onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                           className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           placeholder="https://example.com/cover.png"
                        />
                     </div>
                     {formData.image && (
                        <div className="mt-2 h-32 w-full bg-gray-100 rounded-xl overflow-hidden">
                           <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-80" />
                        </div>
                     )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">GitHub URL</label>
                        <div className="relative">
                           <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                           <input
                              type="url"
                              value={formData.githubUrl}
                              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                              placeholder="https://github.com/..."
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Live Demo URL</label>
                        <div className="relative">
                           <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                           <input
                              type="url"
                              value={formData.liveUrl}
                              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                              placeholder="https://..."
                           />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 block">Technologies</label>
                        <textarea
                           rows={3}
                           value={techInput}
                           onChange={(e) => setTechInput(e.target.value)}
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           placeholder="React, Tailwind, Node.js (comma separated)"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 block">Key Features</label>
                        <textarea
                           rows={3}
                           value={featuresInput}
                           onChange={(e) => setFeaturesInput(e.target.value)}
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                           placeholder="Authentication&#10;Dark Mode&#10;(one per line)"
                        />
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 border border-blue-100 bg-blue-50 rounded-xl">
                     <input 
                        type="checkbox" 
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                     />
                     <label htmlFor="featured" className="text-sm font-medium text-blue-800 cursor-pointer flex items-center gap-2">
                        <Star className="w-4 h-4 fill-current" />
                        Feature this project on profile homepage
                     </label>
                  </div>

                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end gap-3">
                 <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                 >
                    Cancel
                 </button>
                 <button 
                    type="submit" 
                    form="projectForm"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                    {isSubmitting ? 'Saving...' : 'Save Project'}
                 </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* View Project Modal */}
      <AnimatePresence>
        {viewingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setViewingProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="relative h-48 md:h-64 bg-gray-100">
                {viewingProject.image ? (
                  <img src={viewingProject.image} alt={viewingProject.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                    <Layout className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                   <div className="flex gap-2">
                     <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-white/90 backdrop-blur-sm ${
                        viewingProject.status === 'completed' ? 'text-emerald-700' :
                        viewingProject.status === 'in-progress' ? 'text-blue-700' :
                        'text-gray-600'
                     }`}>
                        {(viewingProject.status || 'In Progress').replace('-', ' ')}
                     </span>
                     {viewingProject.featured && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-yellow-100/90 backdrop-blur-sm text-yellow-700 flex items-center gap-1">
                           <Star className="w-3 h-3 fill-current" /> Featured
                        </span>
                     )}
                   </div>
                   <button 
                     onClick={() => setViewingProject(null)}
                     className="p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors backdrop-blur-sm"
                   >
                     <X className="w-5 h-5" />
                   </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                 <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                       <div>
                          <h2 className="text-3xl font-bold text-gray-900 mb-2">{viewingProject.title}</h2>
                          <div className="flex items-center gap-4">
                             {viewingProject.githubUrl && (
                                <a href={viewingProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                   <Github className="w-5 h-5" /> GitHub
                                </a>
                             )}
                             {viewingProject.liveUrl && (
                                <a href={viewingProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                   <ExternalLink className="w-5 h-5" /> Live Demo
                                </a>
                             )}
                          </div>
                       </div>
                       
                       <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                          <p className="whitespace-pre-line">{viewingProject.description}</p>
                       </div>

                       {viewingProject.features && viewingProject.features.length > 0 && (
                          <div>
                             <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500" /> Key Features
                             </h3>
                             <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {viewingProject.features.map((feature, idx) => (
                                   <li key={idx} className="flex items-start gap-2 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                                      <span className="text-sm">{feature}</span>
                                   </li>
                                ))}
                             </ul>
                          </div>
                       )}
                    </div>

                    <div className="w-full md:w-80 shrink-0 space-y-6">
                       <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <Code className="w-4 h-4 text-blue-500" /> Technologies
                          </h3>
                          <div className="flex flex-wrap gap-2">
                             {viewingProject.tech && viewingProject.tech.map((t, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
                                   {t}
                                </span>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                 <button 
                    onClick={() => {
                       setEditingProject(viewingProject);
                       setFormData({
                          title: viewingProject.title || '',
                          description: viewingProject.description || '',
                          image: viewingProject.image || '',
                          tech: viewingProject.tech || [],
                          features: viewingProject.features || [],
                          githubUrl: viewingProject.githubUrl || viewingProject.github || '',
                          liveUrl: viewingProject.liveUrl || viewingProject.live || '',
                          status: viewingProject.status || 'completed',
                          featured: viewingProject.featured || viewingProject.preview || false,
                          order: viewingProject.order || 0
                       });
                       setTechInput((viewingProject.tech || []).join(', '));
                       setFeaturesInput((viewingProject.features || []).join('\n'));
                       setViewingProject(null);
                       setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 border border-gray-200 transition-all shadow-sm hover:shadow"
                 >
                    <Edit className="w-4 h-4" /> Edit Project
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
         {isDeleteModalOpen && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
               >
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                     <Trash2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Project?</h3>
                  <p className="text-gray-500 mb-6">Are you sure you want to delete <span className="font-semibold text-gray-900">{projects.find(p => p._id === itemToDelete || p.id === itemToDelete)?.title}</span>? This action cannot be undone.</p>
                  
                  <div className="flex gap-3">
                     <button 
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={handleConfirmDelete}
                        disabled={deletingId === itemToDelete}
                        className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                     >
                        {deletingId === itemToDelete ? 'Deleting...' : 'Delete'}
                     </button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ProjectsAdmin;