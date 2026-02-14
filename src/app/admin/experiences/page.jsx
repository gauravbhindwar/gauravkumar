'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  ArrowUpRight,
  Zap,
  CheckCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { useSession } from 'next-auth/react';

const ExperiencesAdmin = () => {
  const { data: session } = useSession();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
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
  });

  // Filter experiences
  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'current' && exp.isCurrentPosition) ||
                         (filterType === 'past' && !exp.isCurrentPosition) ||
                         (filterType === exp.employmentType?.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  // Fetch experiences
  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experiences');
      if (response.ok) {
        const data = await response.json();
        setExperiences(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

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
    });
    setEditingExperience(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const url = editingExperience 
        ? `/api/experiences/${editingExperience._id}`
        : '/api/experiences';
      
      const method = editingExperience ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        await fetchExperiences();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setDeletingId(itemToDelete);
    try {
      const response = await fetch(`/api/experiences/${itemToDelete}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchExperiences();
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
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
         <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
       </div>
     )
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
              Experiences
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 mt-1"
            >
              Manage your professional journey and work history.
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
            className="bg-orange-600 text-white px-5 py-2.5 rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Add Experience</span>
          </motion.button>
        </header>

        {/* Stats Cards - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { 
              label: 'Total Roles', 
              value: experiences.length, 
              icon: Briefcase,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              borderColor: 'border-blue-100'
            },
            { 
              label: 'Current Position', 
              value: experiences.filter(e => e.isCurrentPosition).length, 
              icon: Clock,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              borderColor: 'border-emerald-100'
            },
            { 
              label: 'Companies', 
              value: new Set(experiences.map(e => e.company)).size, 
              icon: Building,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
              borderColor: 'border-purple-100'
            },
            { 
              label: 'Total Years',
              value: '3+', // This could be calculated dynamically
              icon: Award,
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
              placeholder="Search roles, companies, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-5 h-5 text-gray-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full md:w-auto px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900"
            >
              <option value="all">All Experiences</option>
              <option value="current">Current Roles</option>
              <option value="past">Past Roles</option>
              <option value="full-time">Full-time Only</option>
            </select>
          </div>
        </motion.div>

        {/* Experiences List */}
        <div className="space-y-6">
          {filteredExperiences.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredExperiences.map((experience, index) => (
                <motion.div
                  key={experience._id}
                  variants={item}
                  whileHover={{ y: -2, scale: 1.005 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-6 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex flex-col md:flex-row gap-6 relative z-10">
                    {/* Logo/Icon Placeholder */}
                    <div className="hidden md:flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600 shadow-inner">
                          <Building className="w-7 h-7" />
                        </div>
                        <div className="h-full w-px bg-gray-100 my-4 border-l border-dashed border-gray-300"></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl font-bold text-gray-900">{experience.position}</h3>
                            {experience.isCurrentPosition && (
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                Current
                              </span>
                            )}
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                              {experience.employmentType}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 mt-1 font-medium">
                            <span className="text-orange-600">{experience.company}</span>
                            <span>•</span>
                            <span className="text-sm">{experience.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 self-start md:self-auto">
                           <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setEditingExperience(experience);
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
                                });
                                setIsModalOpen(true);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteClick(experience._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 bg-gray-50/50 p-3 rounded-xl border border-gray-100 w-fit">
                         <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>
                              {new Date(experience.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} 
                              {' - '}
                              {experience.isCurrentPosition ? 'Present' : new Date(experience.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                         </div>
                         <div className="w-px h-4 bg-gray-200"></div>
                         <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>
                               {/* Simple duration calc - could be improved */}
                               {experience.isCurrentPosition ? 'Ongoing' : 'Completed'}
                            </span>
                         </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                          {experience.description}
                        </p>
                      </div>

                      {experience.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech, i) => (
                            <span 
                              key={i} 
                              className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg shadow-sm hover:border-orange-200 hover:text-orange-600 transition-colors cursor-default"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No experiences found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters to find what you are looking for.' 
                  : 'Get started by adding your first professional role to your portfolio.'}
              </p>
              {(!searchTerm && filterType === 'all') && (
                <button
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(true);
                  }}
                  className="bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition-colors font-medium shadow-lg shadow-orange-500/20 inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add First Experience</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal - Add/Edit Experience */}
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
              <div className="bg-orange-600 p-6 flex items-center justify-between text-white shrink-0">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <form id="experienceForm" onSubmit={handleSubmit} className="space-y-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Position Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                        placeholder="e.g. Senior Frontend Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                        placeholder="e.g. Acme Corp"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Location *</label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Employment Type</label>
                      <select
                        value={formData.employmentType}
                        onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                      >
                         <option value="Full-time">Full-time</option>
                         <option value="Part-time">Part-time</option>
                         <option value="Contract">Contract</option>
                         <option value="Internship">Internship</option>
                         <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Start Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">End Date</label>
                      <input
                         type="date"
                         disabled={formData.isCurrentPosition}
                         value={formData.endDate}
                         onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                       />
                       <div className="flex items-center gap-2 mt-2">
                          <input 
                             type="checkbox" 
                             id="currentPos" 
                             checked={formData.isCurrentPosition}
                             onChange={(e) => setFormData({ 
                                ...formData, 
                                isCurrentPosition: e.target.checked,
                                endDate: e.target.checked ? '' : formData.endDate
                             })}
                             className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                          />
                          <label htmlFor="currentPos" className="text-sm font-medium text-gray-600 cursor-pointer">I currently work here</label>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Description *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"
                      placeholder="Describe your role, achievements, and impact..."
                    />
                  </div>

                  <div className="space-y-4">
                     <label className="text-sm font-semibold text-gray-700 block">Technologies & Skills</label>
                     <div className="flex flex-wrap gap-2">
                        {formData.technologies.map((tech, index) => (
                           <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium border border-orange-100">
                              {tech}
                              <button type="button" onClick={() => removeArrayField('technologies', index)} className="hover:text-red-600">
                                 <X className="w-3 h-3" />
                              </button>
                           </span>
                        ))}
                     </div>
                     <div className="flex gap-2">
                        <input 
                           type="text" 
                           placeholder="Add a skill (e.g. React, Python)" 
                           onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                 e.preventDefault();
                                 if (e.target.value.trim()) {
                                    handleArrayFieldChange('technologies', formData.technologies.length, e.target.value.trim());
                                    e.target.value = '';
                                 }
                              }
                           }}
                           className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm"
                           id="techInput"
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            const input = document.getElementById('techInput');
                            if (input.value.trim()) {
                              handleArrayFieldChange('technologies', formData.technologies.length, input.value.trim());
                              input.value = '';
                            }
                          }}
                          className="bg-gray-100 px-4 py-2 rounded-xl text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors"
                        >
                          Add
                        </button>
                     </div>
                     <p className="text-xs text-gray-400">Press Enter to add multiple skills</p>
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
                    form="experienceForm"
                    disabled={isSubmitting}
                    className="bg-orange-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                    {isSubmitting ? 'Saving...' : 'Save Experience'}
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Experience?</h3>
                  <p className="text-gray-500 mb-6">Are you sure you want to remove this position? This action cannot be undone.</p>
                  
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

export default ExperiencesAdmin;