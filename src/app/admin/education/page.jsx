'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Target,
  CheckCircle,
  X,
  Save
} from 'lucide-react';

const EducationAdminPage = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    isCurrentlyStudying: false,
    grade: '',
    gradeType: 'GPA',
    location: '',
    description: '',
    coursework: [],
    achievements: [],
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/education');
      const data = await response.json();
      if (data.success) {
        setEducation(data.data);
      }
    } catch (error) {
      console.error('Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingEducation 
        ? `/api/education/${editingEducation._id}`
        : '/api/education';
      
      const method = editingEducation ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchEducation();
        resetForm();
        setShowModal(false);
      } else {
        alert('Error saving education: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Error saving education');
    }
  };

  const handleEdit = (edu) => {
    setEditingEducation(edu);
    setFormData({
      ...edu,
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
      coursework: edu.coursework || [],
      achievements: edu.achievements || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    
    try {
      const response = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchEducation();
      } else {
        alert('Error deleting education: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting education:', error);
      alert('Error deleting education');
    }
  };

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      isCurrentlyStudying: false,
      grade: '',
      gradeType: 'GPA',
      location: '',
      description: '',
      coursework: [],
      achievements: [],
      order: 0,
      isActive: true
    });
    setEditingEducation(null);
  };

  const handleArrayFieldChange = (fieldName, index, value) => {
    const newArray = [...formData[fieldName]];
    newArray[index] = value;
    setFormData({ ...formData, [fieldName]: newArray });
  };

  const addArrayField = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: [...formData[fieldName], '']
    });
  };

  const removeArrayField = (fieldName, index) => {
    const newArray = formData[fieldName].filter((_, i) => i !== index);
    setFormData({ ...formData, [fieldName]: newArray });
  };

  // Filter education based on search and status
  const filteredEducation = education.filter(edu => {
    const matchesSearch = edu.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         edu.degree?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         edu.field?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         edu.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'current' && edu.isCurrentlyStudying) ||
                         (statusFilter === 'completed' && !edu.isCurrentlyStudying);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Education Management</h1>
                    <p className="text-green-100 mt-1">Manage educational background and achievements</p>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 backdrop-blur-sm border border-white/20"
              >
                <Plus className="w-5 h-5" />
                Add Education
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Education</p>
                <p className="text-2xl font-bold text-gray-900">{education.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Studies</p>
                <p className="text-2xl font-bold text-gray-900">
                  {education.filter(edu => edu.isCurrentlyStudying).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {education.filter(edu => !edu.isCurrentlyStudying).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search education records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-900 bg-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-900 bg-white"
              >
                <option value="all">All Status</option>
                <option value="current">Currently Studying</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-green-200 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-green-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Education Cards */}
            <div className="space-y-6">
              {filteredEducation.length > 0 ? (
                filteredEducation.map((edu) => (
                  <motion.div
                    key={edu._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 truncate">
                                {edu.degree} {edu.field && `in ${edu.field}`}
                              </h3>
                              {edu.isCurrentlyStudying && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-lg font-semibold text-green-600 mb-1">
                              {edu.institution}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              {edu.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{edu.location}</span>
                                </div>
                              )}
                              {edu.startDate && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {new Date(edu.startDate).getFullYear()} - {edu.isCurrentlyStudying ? 'Present' : new Date(edu.endDate).getFullYear()}
                                  </span>
                                </div>
                              )}
                              {edu.grade && (
                                <div className="flex items-center space-x-1">
                                  <Award className="w-4 h-4" />
                                  <span>{edu.gradeType}: {edu.grade}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {edu.description && (
                          <p className="mt-4 text-gray-700 leading-relaxed">{edu.description}</p>
                        )}
                        
                        {(edu.coursework?.length > 0 || edu.achievements?.length > 0) && (
                          <div className="mt-4 space-y-3">
                            {edu.coursework?.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                                  <BookOpen className="w-4 h-4" />
                                  <span>Coursework</span>
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {edu.coursework.map((course, idx) => (
                                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                      {course}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {edu.achievements?.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                                  <Target className="w-4 h-4" />
                                  <span>Achievements</span>
                                </h4>
                                <div className="space-y-1">
                                  {edu.achievements.map((achievement, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                      <span className="text-sm text-gray-700">{achievement}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3 mt-4 lg:mt-0 lg:ml-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(edu)}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-3 rounded-xl transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(edu._id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 p-3 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No education records match your search criteria' 
                      : 'No education records yet'
                    }
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your search terms or filters'
                      : 'Add your first education record to get started'
                    }
                  </p>
                  {(!searchTerm && statusFilter === 'all') && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        resetForm();
                        setShowModal(true);
                      }}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
                    >
                      <Plus className="w-5 h-5" />
                      Add First Education
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
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
                className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-gray-100"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">
                          {editingEducation ? 'Edit Education' : 'Add New Education'}
                        </h3>
                        <p className="text-green-100 mt-1">
                          {editingEducation ? 'Update education details' : 'Add educational background information'}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowModal(false)}
                      className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="flex flex-col h-[calc(90vh-120px)]">
                  <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex-1 p-6 overflow-y-auto min-h-0">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Institution */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Institution *
                            </label>
                            <input
                              type="text"
                              value={formData.institution}
                              onChange={(e) => setFormData({...formData, institution: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 bg-white"
                              required
                              placeholder="Enter institution name"
                            />
                          </div>
                          
                          {/* Degree */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Degree *
                            </label>
                            <input
                              type="text"
                              value={formData.degree}
                              onChange={(e) => setFormData({...formData, degree: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 bg-white"
                              required
                              placeholder="Enter degree title"
                            />
                          </div>
                          
                          {/* Field of Study */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Field of Study
                            </label>
                            <input
                              type="text"
                              value={formData.field}
                              onChange={(e) => setFormData({...formData, field: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 bg-white"
                              placeholder="Enter field of study"
                            />
                          </div>
                          
                          {/* Location */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Location
                            </label>
                            <input
                              type="text"
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 bg-white"
                              placeholder="Enter location"
                            />
                          </div>
                          
                          {/* Start Date */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={formData.startDate}
                              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 bg-white"
                            />
                          </div>
                          
                          {/* End Date */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={formData.endDate}
                              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 transition-all duration-200 text-gray-900 bg-white"
                              disabled={formData.isCurrentlyStudying}
                            />
                          </div>
                          
                          {/* Grade */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Grade
                            </label>
                            <input
                              type="text"
                              value={formData.grade}
                              onChange={(e) => setFormData({...formData, grade: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 bg-white"
                              placeholder="e.g., 7.91, 89.90%"
                            />
                          </div>
                          
                          {/* Grade Type */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Grade Type
                            </label>
                            <select
                              value={formData.gradeType}
                              onChange={(e) => setFormData({...formData, gradeType: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 bg-white"
                            >
                              <option value="GPA">GPA</option>
                              <option value="Percentage">Percentage</option>
                              <option value="Grade">Grade</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                        
                        {/* Currently Studying Checkbox */}
                        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-200">
                          <input
                            type="checkbox"
                            id="currentlyStudying"
                            checked={formData.isCurrentlyStudying}
                            onChange={(e) => setFormData({...formData, isCurrentlyStudying: e.target.checked})}
                            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <label htmlFor="currentlyStudying" className="text-sm font-medium text-green-800">
                            Currently Studying
                          </label>
                        </div>
                        
                        {/* Description */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 bg-white"
                            rows={3}
                            placeholder="Describe your education experience..."
                          />
                        </div>
                        
                        {/* Coursework */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Coursework</span>
                          </label>
                          <div className="space-y-2">
                            {formData.coursework.map((course, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="text"
                                  value={course}
                                  onChange={(e) => handleArrayFieldChange('coursework', index, e.target.value)}
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 bg-white"
                                  placeholder="Course name"
                                />
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => removeArrayField('coursework', index)}
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
                              onClick={() => addArrayField('coursework')}
                              className="bg-green-50 text-green-600 hover:bg-green-100 px-4 py-3 rounded-xl transition-colors font-medium flex items-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add Course
                            </motion.button>
                          </div>
                        </div>
                        
                        {/* Achievements */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                            <Target className="w-4 h-4" />
                            <span>Achievements</span>
                          </label>
                          <div className="space-y-2">
                            {formData.achievements.map((achievement, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="text"
                                  value={achievement}
                                  onChange={(e) => handleArrayFieldChange('achievements', index, e.target.value)}
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 bg-white"
                                  placeholder="Achievement description"
                                />
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => removeArrayField('achievements', index)}
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
                              onClick={() => addArrayField('achievements')}
                              className="bg-green-50 text-green-600 hover:bg-green-100 px-4 py-3 rounded-xl transition-colors font-medium flex items-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add Achievement
                            </motion.button>
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
                          onClick={() => setShowModal(false)}
                          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors rounded-xl hover:bg-gray-50"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit" 
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          {editingEducation ? 'Update' : 'Create'} Education
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
    </div>
  );
};

export default EducationAdminPage;