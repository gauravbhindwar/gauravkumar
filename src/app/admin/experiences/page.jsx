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
  Award,
  Upload,
  AlertCircle,
  Globe
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
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [formError, setFormError] = useState('');

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
    setFormError('');
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      setUploadingLogo(true);
      setFormError('');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, companyLogo: data.url }));
      } else {
        setFormError('Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      setFormError('Error uploading logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormError('');
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
      } else {
        const errorBody = await response.json().catch(() => ({}));
        setFormError(errorBody.error || 'Failed to save experience');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError('Error saving experience');
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
       <div className="flex items-center justify-center h-screen bg-base-200">
         <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-none animate-spin"></div>
       </div>
     )
   }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-screen bg-base-200 p-6 md:p-8 font-sans text-base-content"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold tracking-tight text-base-content"
            >
              Experiences
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base-content/60 mt-1"
            >
              Manage your professional journey and work history.
            </motion.p>
          </div>
          
          <button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            
            
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-primary text-base-100 border-2 border-base-content px-6 py-3 font-mono font-bold uppercase tracking-widest flex items-center gap-2 shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add Experience</span>
          </button>
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
              borderColor: 'border-base-content'
            },
            { 
              label: 'Current Position', 
              value: experiences.filter(e => e.isCurrentPosition).length, 
              icon: Clock,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              borderColor: 'border-base-content'
            },
            { 
              label: 'Companies', 
              value: new Set(experiences.map(e => e.company)).size, 
              icon: Building,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
              borderColor: 'border-base-content'
            },
            { 
              label: 'Total Years',
              value: '3+', // This could be calculated dynamically
              icon: Award,
              color: 'text-primary',
              bg: 'bg-base-100',
              borderColor: 'border-base-content'
            }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              variants={item}
              whileHover={{ y: -5 }}
              className={`bg-base-100 border-4 border-base-content p-6 shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-none ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight text-base-content mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-base-content/60">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <motion.div 
          variants={item}
          className="bg-base-100 p-4 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input 
              type="text" 
              placeholder="Search roles, companies, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-base-100 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono text-base-content transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-5 h-5 text-base-content/40" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full md:w-auto px-4 py-2 bg-base-100 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono text-base-content transition-all"
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
                  className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] hover:shadow-[4px_4px_0_0_currentColor] transition-all p-6 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-base-100 rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex flex-col md:flex-row gap-6 relative z-10">
                    {/* Logo/Icon Placeholder */}
                    <div className="hidden md:flex flex-col items-center">
                        <div className="w-14 h-14 rounded-none bg-base-200 border-2 border-base-content flex items-center justify-center text-primary shadow-[4px_4px_0_0_currentColor]">
                          <Building className="w-7 h-7" />
                        </div>
                        <div className="h-full w-px bg-base-300 my-4 border-l border-dashed border-base-300"></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl font-bold text-base-content">{experience.position}</h3>
                            {experience.isCurrentPosition && (
                              <span className="px-3 py-1 border-2 border-base-content bg-success text-success-content font-mono font-bold uppercase tracking-widest text-xs font-semibold rounded-none flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none animate-pulse"></span>
                                Current
                              </span>
                            )}
                            <span className="px-3 py-1 bg-base-200 text-base-content/70 text-xs font-medium rounded-none border-2 border-base-content">
                              {experience.employmentType}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-base-content/60 mt-1 font-medium">
                            <span className="text-primary">{experience.company}</span>
                            <span>•</span>
                            <span className="text-sm">{experience.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 self-start md:self-auto">
                           <button
                              
                              
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
                              className="p-2 bg-base-100 border-2 border-base-content text-base-content shadow-[2px_2px_0_0_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              
                              
                              onClick={() => handleDeleteClick(experience._id)}
                              className="p-2 bg-error border-2 border-base-content text-base-100 shadow-[2px_2px_0_0_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-base-content/60 mb-6 bg-base-200 p-3 rounded-none border border-base-content w-fit">
                         <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-base-content/40" />
                            <span>
                              {new Date(experience.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} 
                              {' - '}
                              {experience.isCurrentPosition ? 'Present' : new Date(experience.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                         </div>
                         <div className="w-px h-4 bg-base-300"></div>
                         <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-base-content/40" />
                            <span>
                               {/* Simple duration calc - could be improved */}
                               {experience.isCurrentPosition ? 'Ongoing' : 'Completed'}
                            </span>
                         </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-base-content/70 leading-relaxed text-sm md:text-base">
                          {experience.description}
                        </p>
                      </div>

                      {experience.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech, i) => (
                            <span 
                              key={i} 
                              className="px-2 py-1 bg-base-200 border-2 border-base-content text-base-content font-mono text-xs font-bold uppercase tracking-widest  shadow-[4px_4px_0_0_currentColor] hover:border-base-content hover:text-primary transition-colors cursor-default"
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
            <div className="bg-base-100 rounded-none shadow-[4px_4px_0_0_currentColor] border border-dashed border-base-300 p-12 text-center">
              <div className="w-16 h-16 bg-base-200 rounded-none flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-base-content/40" />
              </div>
              <h3 className="text-lg font-bold text-base-content mb-2">No experiences found</h3>
              <p className="text-base-content/60 mb-6 max-w-md mx-auto">
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
                  className="bg-primary text-base-100 border-2 border-base-content px-6 py-3 font-mono font-bold uppercase tracking-widest inline-flex items-center gap-2 shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
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
            className="fixed inset-0 bg-base-100 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-base-100 border-4 border-base-content w-full max-w-4xl overflow-hidden shadow-[12px_12px_0_0_currentColor] flex flex-col max-h-[90vh]"
            >
              <div className="bg-primary p-6 flex items-center justify-between text-base-100 border-b-4 border-base-content shrink-0">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-primary-content/20 rounded-none transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <form id="experienceForm" onSubmit={handleSubmit} className="space-y-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-base-content/80">Position Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="e.g. Senior Frontend Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-base-content/80">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="e.g. Acme Corp"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-base-content/80">Location *</label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-semibold text-base-content/80">Employment Type</label>
                      <select
                        value={formData.employmentType}
                        onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                        className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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
                      <label className="text-sm font-semibold text-base-content/80">Start Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-base-content/80">End Date</label>
                      <input
                         type="date"
                         disabled={formData.isCurrentPosition}
                         value={formData.endDate}
                         onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                         className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                             className="w-4 h-4 text-primary rounded focus:ring-primary border-base-300"
                          />
                          <label htmlFor="currentPos" className="text-sm font-medium text-base-content/70 cursor-pointer">I currently work here</label>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-base-content/80">Company Logo</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formData.companyLogo}
                          onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                          className="flex-1 px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          placeholder="https://example.com/logo.png or upload below"
                        />
                        <label className="cursor-pointer px-4 py-3 bg-base-200 border-2 border-base-content hover:bg-base-300 text-base-content/80 font-medium transition-colors flex items-center gap-2 shrink-0">
                          <Upload className="w-5 h-5" />
                          <span className="hidden sm:inline">{uploadingLogo ? 'Uploading...' : 'Upload'}</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            disabled={uploadingLogo}
                            onChange={handleLogoUpload}
                          />
                        </label>
                        {formData.companyLogo && (
                          <div className="w-12 h-12 shrink-0 border-2 border-base-content bg-base-100 overflow-hidden">
                            <img src={formData.companyLogo} alt="Logo preview" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-base-content/80">Company Website</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                        <input
                          type="url"
                          value={formData.companyWebsite}
                          onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          placeholder="https://company.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-base-content/80">Description *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                      placeholder="Describe your role, achievements, and impact..."
                    />
                  </div>

                  <div className="space-y-3">
                     <label className="text-sm font-semibold text-base-content/80 block">Key Responsibilities</label>
                     <div className="space-y-2">
                        {formData.responsibilities.map((resp, index) => (
                           <div key={index} className="flex gap-2">
                              <input
                                 type="text"
                                 value={resp}
                                 onChange={(e) => handleArrayFieldChange('responsibilities', index, e.target.value)}
                                 className="flex-1 px-4 py-2.5 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                 placeholder="e.g. Led migration of legacy services to a microservice architecture"
                              />
                              <button
                                 type="button"
                                 onClick={() => removeArrayField('responsibilities', index)}
                                 className="px-3 border-2 border-base-content text-base-content/60 hover:text-error hover:bg-base-200 transition-colors shrink-0"
                              >
                                 <X className="w-4 h-4" />
                              </button>
                           </div>
                        ))}
                     </div>
                     <button
                        type="button"
                        onClick={() => addArrayField('responsibilities')}
                        className="px-4 py-2 bg-base-200 border-2 border-base-content text-base-content/70 font-medium text-sm hover:bg-base-300 transition-colors"
                     >
                        + Add Responsibility
                     </button>
                  </div>

                  <div className="space-y-4">
                     <label className="text-sm font-semibold text-base-content/80 block">Technologies & Skills</label>
                     <div className="flex flex-wrap gap-2">
                        {formData.technologies.map((tech, index) => (
                           <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-base-100 text-primary  text-sm font-medium border border-base-content">
                              {tech}
                              <button type="button" onClick={() => removeArrayField('technologies', index)} className="hover:text-error">
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
                           className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-none focus:ring-2 focus:ring-orange-500/20 focus:border-base-content outline-none text-sm"
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
                          className="bg-base-200 px-4 py-2 rounded-none text-base-content/70 font-medium text-sm hover:bg-base-300 transition-colors"
                        >
                          Add
                        </button>
                     </div>
                     <p className="text-xs text-base-content/40">Press Enter to add multiple skills</p>
                  </div>

                </form>
              </div>

              <div className="p-6 border-t border-base-content bg-base-200 shrink-0 flex items-center justify-between gap-3">
                 {formError ? (
                    <p className="text-error text-sm font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{formError}</p>
                 ) : <span />}
                 <div className="flex gap-3 shrink-0">
                    <button
                       type="button"
                       onClick={() => setIsModalOpen(false)}
                       className="px-6 py-2.5 rounded-none font-medium text-base-content/70 hover:bg-base-300 transition-colors"
                    >
                       Cancel
                    </button>
                    <button
                       type="submit"
                       form="experienceForm"
                       disabled={isSubmitting}
                       className="bg-primary text-base-100 border-2 border-base-content px-8 py-3 font-mono font-bold uppercase tracking-widest flex items-center gap-2 shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       {isSubmitting ? 'Saving...' : 'Save Experience'}
                    </button>
                 </div>
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
               className="fixed inset-0 bg-base-100 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-base-100 rounded-none p-6 max-w-sm w-full shadow-[4px_4px_0_0_currentColor] text-center"
               >
                  <div className="w-16 h-16 bg-base-100 rounded-none flex items-center justify-center mx-auto mb-4 text-error">
                     <Trash2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-base-content mb-2">Delete Experience?</h3>
                  <p className="text-base-content/60 mb-6">Are you sure you want to remove this position? This action cannot be undone.</p>
                  
                  <div className="flex gap-3">
                     <button 
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="flex-1 py-2.5 bg-base-200 text-base-content/80 font-medium rounded-none hover:bg-base-300 transition-colors"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={handleConfirmDelete}
                        disabled={deletingId === itemToDelete}
                        className="flex-1 py-2.5 bg-error text-error-content font-medium rounded-none hover:bg-base-100 transition-colors shadow-[4px_4px_0_0_currentColor]  flex items-center justify-center gap-2"
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