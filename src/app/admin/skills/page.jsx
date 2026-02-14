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
  Code,
  BookOpen,
  Brain,
  Star,
  Zap,
  Save,
  X,
  Award,
  Target,
  TrendingUp,
  CheckCircle,
  LayoutGrid,
  List
} from 'lucide-react';
import { useSession } from 'next-auth/react';

const SkillsAdmin = () => {
  const { data: session } = useSession();
  const [skills, setSkills] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState('skill'); // 'skill' or 'course'
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('skills');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Languages',
    level: 'Intermediate',
    type: 'current',
    description: '',
    url: ''
  });

  const skillCategories = ['Languages', 'Web Development', 'Data Science & ML', 'Tools & Platforms'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const courseTypes = ['current', 'completed', 'paused', 'planned'];

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || course.type === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        
        // Extract skills
        const allSkills = [];
        if (data.categories) {
          data.categories.forEach(category => {
            category.skills.forEach(skill => {
              allSkills.push({ ...skill, category: category.name });
            });
          });
        }
        setSkills(allSkills);

        // Extract courses
        const allCourses = [];
        if (data.courses) {
          Object.entries(data.courses).forEach(([type, courseList]) => {
            courseList.forEach((course) => {
              if (typeof course === 'object' && course._id) {
                allCourses.push({
                  ...course,
                  type: course.type || type
                });
              }
            });
          });
        }
        setCourses(allCourses);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Languages',
      level: 'Intermediate',
      type: 'current',
      description: '',
      url: ''
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const method = editingItem ? 'PUT' : 'POST';
      
      let payload;
      if (formType === 'course') {
        payload = {
          type: 'course',
          name: formData.name,
          courseType: formData.type,
          description: formData.description,
          url: formData.url
        };
      } else {
        payload = {
          type: 'skill',
          name: formData.name,
          category: formData.category,
          level: formData.level
        };
      }
      
      if (editingItem && editingItem._id) {
        payload.id = editingItem._id;
      }
      
      const response = await fetch('/api/skills', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        await fetchData();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || !deleteType) return;
    
    setDeletingId(itemToDelete._id);
    try {
      const deleteUrl = `/api/skills?type=${encodeURIComponent(deleteType)}&id=${encodeURIComponent(itemToDelete._id)}`;
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchData();
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        setDeleteType(null);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Advanced': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'current': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'paused': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${activeTab === 'skills' ? 'border-emerald-600' : 'border-purple-600'}`}></div>
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
              Skills & Learning
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 mt-1"
            >
              Track your technical expertise and educational progress.
            </motion.p>
          </div>
          
          <div className="flex gap-3">
             <motion.button
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 }}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => {
                 setFormType('skill');
                 resetForm();
                 setIsModalOpen(true);
               }}
               className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2 font-semibold"
             >
               <Code className="w-5 h-5" />
               <span>Add Skill</span>
             </motion.button>
             <motion.button
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3 }}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => {
                 setFormType('course');
                 resetForm();
                 setIsModalOpen(true);
               }}
               className="bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20 flex items-center gap-2 font-semibold"
             >
               <BookOpen className="w-5 h-5" />
               <span>Add Course</span>
             </motion.button>
          </div>
        </header>

        {/* Tab Switcher */}
        <motion.div variants={item} className="flex p-1 bg-white rounded-xl border border-gray-100 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'skills'
                ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Code className="w-4 h-4" />
            Skills ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'courses'
                ? 'bg-purple-50 text-purple-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Courses ({courses.length})
          </button>
        </motion.div>

        {/* Stats Cards */}
        <AnimatePresence mode="wait">
          {activeTab === 'skills' ? (
            <motion.div 
               key="skills-stats"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
               {[
                 { label: 'Total Skills', value: skills.length, icon: Code, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                 { label: 'Expert Level', value: skills.filter(s => s.level === 'Expert').length, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                 { label: 'Categories', value: new Set(skills.map(s => s.category)).size, icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                 { label: 'Filtered', value: filteredSkills.length, icon: Filter, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
               ].map((stat) => (
                  <div key={stat.label} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm hover:shadow-md transition-all`}>
                     <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                           <stat.icon className="w-6 h-6" />
                        </div>
                     </div>
                     <div>
                        <div className="text-3xl font-bold tracking-tight text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                     </div>
                  </div>
               ))}
            </motion.div>
          ) : (
             <motion.div 
               key="courses-stats"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
               {[
                 { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                 { label: 'Completed', value: courses.filter(c => c.type === 'completed').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                 { label: 'In Progress', value: courses.filter(c => c.type === 'current').length, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                 { label: 'Filtered', value: filteredCourses.length, icon: Filter, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
               ].map((stat) => (
                  <div key={stat.label} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm hover:shadow-md transition-all`}>
                     <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                           <stat.icon className="w-6 h-6" />
                        </div>
                     </div>
                     <div>
                        <div className="text-3xl font-bold tracking-tight text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                     </div>
                  </div>
               ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Filter */}
        <motion.div variants={item} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 ${activeTab === 'skills' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' : 'focus:ring-purple-500/20 focus:border-purple-500'}`}
               />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
               <Filter className="w-5 h-5 text-gray-400" />
               <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 cursor-pointer ${activeTab === 'skills' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' : 'focus:ring-purple-500/20 focus:border-purple-500'}`}
               >
                  <option value="all">All {activeTab === 'skills' ? 'Categories' : 'Types'}</option>
                  {activeTab === 'skills' ? (
                     skillCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                  ) : (
                     courseTypes.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)
                  )}
               </select>
            </div>
        </motion.div>

        {/* Content Grid */}
        <div className="min-h-[300px]">
           <AnimatePresence mode="wait">
              {activeTab === 'skills' ? (
                 <motion.div 
                    key="skills-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                 >
                    {filteredSkills.length > 0 ? (
                       filteredSkills.map((skill, index) => (
                          <motion.div
                             key={skill._id || index}
                             variants={item}
                             whileHover={{ y: -5, scale: 1.02 }}
                             className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-6 relative group"
                          >
                             <div className="flex justify-between items-start mb-3">
                                <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                                   <Code className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button onClick={() => { setEditingItem(skill); setFormType('skill'); setFormData({ name: skill.name || '', category: skill.category || 'Languages', level: skill.level || 'Intermediate', type: 'current', description: '', url: '' }); setIsModalOpen(true); }} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600">
                                      <Edit className="w-4 h-4" />
                                   </button>
                                   <button onClick={() => handleDeleteClick(skill, 'skill')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600">
                                      <Trash2 className="w-4 h-4" />
                                   </button>
                                </div>
                             </div>
                             
                             <h3 className="text-lg font-bold text-gray-900 mb-2">{skill.name}</h3>
                             
                             <div className="flex flex-wrap gap-2 mt-auto">
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg border border-gray-200">
                                   {skill.category}
                                </span>
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${getLevelColor(skill.level)}`}>
                                   {skill.level}
                                </span>
                             </div>
                          </motion.div>
                       ))
                    ) : (
                       <div className="col-span-full py-12 text-center text-gray-400">
                          <Code className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>No skills found matching your search.</p>
                       </div>
                    )}
                 </motion.div>
              ) : (
                 <motion.div 
                    key="courses-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                 >
                    {filteredCourses.length > 0 ? (
                       filteredCourses.map((course, index) => (
                          <motion.div
                             key={course._id || index}
                             variants={item}
                             whileHover={{ y: -5 }}
                             className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-6 relative group flex gap-5"
                          >
                             <div className="shrink-0 flex flex-col items-center">
                                <div className={`p-3 rounded-2xl ${getTypeColor(course.type)} mb-3`}>
                                   <BookOpen className="w-6 h-6" />
                                </div>
                                <div className="h-full w-px bg-gray-100 border-l border-dashed border-gray-300"></div>
                             </div>
                             
                             <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                   <div className="pr-12">
                                      <h3 className="text-xl font-bold text-gray-900 truncate">{course.name}</h3>
                                      <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getTypeColor(course.type)}`}>
                                         {course.type.charAt(0).toUpperCase() + course.type.slice(1)}
                                      </span>
                                   </div>
                                    <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 right-6">
                                       <button onClick={() => { setEditingItem(course); setFormType('course'); setFormData({ name: course.name || '', category: 'Languages', level: 'Intermediate', type: course.type || 'current', description: course.description || '', url: course.url || '' }); setIsModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600">
                                          <Edit className="w-4 h-4" />
                                       </button>
                                       <button onClick={() => handleDeleteClick(course, 'course')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600">
                                          <Trash2 className="w-4 h-4" />
                                       </button>
                                    </div>
                                </div>
                                
                                {course.description && (
                                   <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                      {course.description}
                                   </p>
                                )}
                                
                                {course.url && (
                                   <a 
                                     href={course.url} 
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                                   >
                                      View Course <Zap className="w-3 h-3 ml-1" />
                                   </a>
                                )}
                             </div>
                          </motion.div>
                       ))
                    ) : (
                       <div className="col-span-full py-12 text-center text-gray-400">
                          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>No courses found matching your search.</p>
                       </div>
                    )}
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

      </div>

      {/* Modal - Add/Edit */}
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
               className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
               <div className={`p-6 flex items-center justify-between text-white shrink-0 ${formType === 'skill' ? 'bg-emerald-600' : 'bg-purple-600'}`}>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                     {formType === 'skill' ? <Code className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                     {editingItem ? `Edit ${formType === 'skill' ? 'Skill' : 'Course'}` : `Add New ${formType === 'skill' ? 'Skill' : 'Course'}`}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                     <X className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  <form id="metricsForm" onSubmit={handleSubmit} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Name *</label>
                        <input
                           type="text"
                           required
                           value={formData.name}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                           className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all ${formType === 'skill' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' : 'focus:ring-purple-500/20 focus:border-purple-500'}`}
                           placeholder={`e.g. ${formType === 'skill' ? 'React.js' : 'Advanced React Patterns'}`}
                        />
                     </div>

                     {formType === 'skill' ? (
                        <>
                           <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700">Category</label>
                              <select
                                 value={formData.category}
                                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                              >
                                 {skillCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700">Proficiency Level</label>
                              <select
                                 value={formData.level}
                                 onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                              >
                                 {skillLevels.map(level => <option key={level} value={level}>{level}</option>)}
                              </select>
                           </div>
                        </>
                     ) : (
                        <>
                           <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700">Status</label>
                              <select
                                 value={formData.type}
                                 onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer"
                              >
                                 {courseTypes.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700">Description</label>
                              <textarea
                                 rows={3}
                                 value={formData.description}
                                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                                 placeholder="What did you learn?"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700">Course URL</label>
                              <input
                                 type="url"
                                 value={formData.url}
                                 onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                 placeholder="https://..."
                              />
                           </div>
                        </>
                     )}
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
                     form="metricsForm"
                     disabled={isSubmitting}
                     className={`text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                        formType === 'skill' 
                           ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' 
                           : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                     }`}
                  >
                     {isSubmitting ? 'Saving...' : 'Save Item'}
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Delete {deleteType === 'skill' ? 'Skill' : 'Course'}?</h3>
                  <p className="text-gray-500 mb-6">Are you sure you want to delete <span className="font-semibold text-gray-900">{itemToDelete?.name}</span>? This action cannot be undone.</p>
                  
                  <div className="flex gap-3">
                     <button 
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={handleConfirmDelete}
                        disabled={deletingId === itemToDelete?._id}
                        className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                     >
                        {deletingId === itemToDelete?._id ? 'Deleting...' : 'Delete'}
                     </button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

    </motion.div>
  );
};

export default SkillsAdmin;