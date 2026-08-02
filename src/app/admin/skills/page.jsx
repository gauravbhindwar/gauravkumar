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
      case 'Advanced': return 'bg-orange-100 text-orange-700 border-base-content';
      case 'Intermediate': return 'bg-blue-100 text-blue-700 border-base-content';
      default: return 'border-2 border-base-content bg-success text-success-content font-mono font-bold uppercase tracking-widest border-base-content';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'completed': return 'border-2 border-base-content bg-success text-success-content font-mono font-bold uppercase tracking-widest border-base-content';
      case 'current': return 'bg-blue-100 text-blue-700 border-base-content';
      case 'paused': return 'bg-orange-100 text-orange-700 border-base-content';
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
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className={`w-8 h-8 border-2 border-t-transparent rounded-none animate-spin ${activeTab === 'skills' ? 'border-primary' : 'border-secondary'}`}></div>
      </div>
    );
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
              Skills & Learning
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base-content/60 mt-1"
            >
              Track your technical expertise and educational progress.
            </motion.p>
          </div>
          
          <div className="flex gap-3">
             <button
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 }}
               
               
               onClick={() => {
                 setFormType('skill');
                 resetForm();
                 setIsModalOpen(true);
               }}
               className="bg-primary text-base-100 border-2 border-base-content px-6 py-3 font-mono font-bold uppercase tracking-widest flex items-center gap-2 shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
             >
               <Code className="w-5 h-5" />
               <span>Add Skill</span>
             </button>
             <button
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3 }}
               
               
               onClick={() => {
                 setFormType('course');
                 resetForm();
                 setIsModalOpen(true);
               }}
               className="bg-secondary text-secondary-content px-5 py-2.5 rounded-none hover:bg-base-100 transition-colors shadow-[4px_4px_0_0_currentColor]  flex items-center gap-2 font-semibold"
             >
               <BookOpen className="w-5 h-5" />
               <span>Add Course</span>
             </button>
          </div>
        </header>

        {/* Tab Switcher */}
        <motion.div variants={item} className="flex p-1 bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] w-fit">
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 px-6 py-2.5  text-sm font-semibold transition-all ${
              activeTab === 'skills'
                ? 'bg-base-100 text-primary shadow-[4px_4px_0_0_currentColor]'
                : 'text-base-content/60 hover:text-base-content'
            }`}
          >
            <Code className="w-4 h-4" />
            Skills ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-6 py-2.5  text-sm font-semibold transition-all ${
              activeTab === 'courses'
                ? 'bg-base-100 text-secondary shadow-[4px_4px_0_0_currentColor]'
                : 'text-base-content/60 hover:text-base-content'
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
                 { label: 'Total Skills', value: skills.length, icon: Code, color: 'text-primary', bg: 'bg-base-100', border: 'border-base-content' },
                 { label: 'Expert Level', value: skills.filter(s => s.level === 'Expert').length, icon: Award, color: 'text-success', bg: 'bg-base-100', border: 'border-base-content' },
                 { label: 'Categories', value: new Set(skills.map(s => s.category)).size, icon: Brain, color: 'text-secondary', bg: 'bg-base-100', border: 'border-base-content' },
                 { label: 'Filtered', value: filteredSkills.length, icon: Filter, color: 'text-warning', bg: 'bg-base-100', border: 'border-base-content' },
               ].map((stat) => (
                  <div key={stat.label} className={`bg-base-100 p-6 rounded-none border ${stat.border} shadow-[4px_4px_0_0_currentColor] hover:shadow-[4px_4px_0_0_currentColor] transition-all`}>
                     <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-none ${stat.bg} ${stat.color}`}>
                           <stat.icon className="w-6 h-6" />
                        </div>
                     </div>
                     <div>
                        <div className="text-3xl font-bold tracking-tight text-base-content mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-base-content/60">{stat.label}</div>
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
                 { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-secondary', bg: 'bg-base-100', border: 'border-base-content' },
                 { label: 'Completed', value: courses.filter(c => c.type === 'completed').length, icon: CheckCircle, color: 'text-success', bg: 'bg-base-100', border: 'border-base-content' },
                 { label: 'In Progress', value: courses.filter(c => c.type === 'current').length, icon: TrendingUp, color: 'text-primary', bg: 'bg-base-100', border: 'border-base-content' },
                 { label: 'Filtered', value: filteredCourses.length, icon: Filter, color: 'text-warning', bg: 'bg-base-100', border: 'border-base-content' },
               ].map((stat) => (
                  <div key={stat.label} className={`bg-base-100 p-6 rounded-none border ${stat.border} shadow-[4px_4px_0_0_currentColor] hover:shadow-[4px_4px_0_0_currentColor] transition-all`}>
                     <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-none ${stat.bg} ${stat.color}`}>
                           <stat.icon className="w-6 h-6" />
                        </div>
                     </div>
                     <div>
                        <div className="text-3xl font-bold tracking-tight text-base-content mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-base-content/60">{stat.label}</div>
                     </div>
                  </div>
               ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Filter */}
        <motion.div variants={item} className="bg-base-100 p-4 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
               <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 bg-base-200 border-2 border-base-content rounded-none focus:outline-none focus:ring-2 transition-all text-base-content ${activeTab === 'skills' ? 'focus:ring-primary/20 focus:border-primary' : 'focus:ring-secondary/20 focus:border-secondary'}`}
               />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
               <Filter className="w-5 h-5 text-base-content/40" />
               <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`px-4 py-2 bg-base-200 border-2 border-base-content rounded-none focus:outline-none focus:ring-2 transition-all text-base-content cursor-pointer ${activeTab === 'skills' ? 'focus:ring-primary/20 focus:border-primary' : 'focus:ring-secondary/20 focus:border-secondary'}`}
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
                             className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] hover:shadow-[4px_4px_0_0_currentColor] transition-all p-6 relative group"
                          >
                             <div className="flex justify-between items-start mb-3">
                                <div className="p-2.5 bg-base-200 rounded-none group-hover:bg-base-100 transition-colors">
                                   <Code className="w-6 h-6 text-base-content/40 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button onClick={() => { setEditingItem(skill); setFormType('skill'); setFormData({ name: skill.name || '', category: skill.category || 'Languages', level: skill.level || 'Intermediate', type: 'current', description: '', url: '' }); setIsModalOpen(true); }} className="p-1.5 hover:bg-base-200  text-base-content/60 hover:text-primary">
                                      <Edit className="w-4 h-4" />
                                   </button>
                                   <button onClick={() => handleDeleteClick(skill, 'skill')} className="p-1.5 hover:bg-base-200  text-base-content/60 hover:text-error">
                                      <Trash2 className="w-4 h-4" />
                                   </button>
                                </div>
                             </div>
                             
                             <h3 className="text-lg font-bold text-base-content mb-2">{skill.name}</h3>
                             
                             <div className="flex flex-wrap gap-2 mt-auto">
                                <span className="px-2.5 py-1 bg-base-200 text-base-content/70 text-xs font-medium  border-2 border-base-content">
                                   {skill.category}
                                </span>
                                <span className={`px-2.5 py-1 text-xs font-medium  border ${getLevelColor(skill.level)}`}>
                                   {skill.level}
                                </span>
                             </div>
                          </motion.div>
                       ))
                    ) : (
                       <div className="col-span-full py-12 text-center text-base-content/40">
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
                             className="bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] hover:shadow-[4px_4px_0_0_currentColor] transition-all p-6 relative group flex gap-5"
                          >
                             <div className="shrink-0 flex flex-col items-center">
                                <div className={`p-3 rounded-none ${getTypeColor(course.type)} mb-3`}>
                                   <BookOpen className="w-6 h-6" />
                                </div>
                                <div className="h-full w-px bg-base-300 border-l border-dashed border-base-300"></div>
                             </div>
                             
                             <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                   <div className="pr-12">
                                      <h3 className="text-xl font-bold text-base-content truncate">{course.name}</h3>
                                      <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-none border ${getTypeColor(course.type)}`}>
                                         {course.type.charAt(0).toUpperCase() + course.type.slice(1)}
                                      </span>
                                   </div>
                                    <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 right-6">
                                       <button onClick={() => { setEditingItem(course); setFormType('course'); setFormData({ name: course.name || '', category: 'Languages', level: 'Intermediate', type: course.type || 'current', description: course.description || '', url: course.url || '' }); setIsModalOpen(true); }} className="p-2 hover:bg-base-200  text-base-content/60 hover:text-primary">
                                          <Edit className="w-4 h-4" />
                                       </button>
                                       <button onClick={() => handleDeleteClick(course, 'course')} className="p-2 hover:bg-base-200  text-base-content/60 hover:text-error">
                                          <Trash2 className="w-4 h-4" />
                                       </button>
                                    </div>
                                </div>
                                
                                {course.description && (
                                   <p className="text-base-content/70 text-sm leading-relaxed mb-4 line-clamp-2">
                                      {course.description}
                                   </p>
                                )}
                                
                                {course.url && (
                                   <a 
                                     href={course.url} 
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className="inline-flex items-center text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
                                   >
                                      View Course <Zap className="w-3 h-3 ml-1" />
                                   </a>
                                )}
                             </div>
                          </motion.div>
                       ))
                    ) : (
                       <div className="col-span-full py-12 text-center text-base-content/40">
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
            className="fixed inset-0 bg-base-100 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-base-100 border-4 border-base-content w-full max-w-xl overflow-hidden shadow-[12px_12px_0_0_currentColor] flex flex-col max-h-[90vh]"
            >
               <div className={`p-6 flex items-center justify-between text-primary-content shrink-0 ${formType === 'skill' ? 'bg-primary' : 'bg-secondary'}`}>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                     {formType === 'skill' ? <Code className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                     {editingItem ? `Edit ${formType === 'skill' ? 'Skill' : 'Course'}` : `Add New ${formType === 'skill' ? 'Skill' : 'Course'}`}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-primary-content/20 rounded-none transition-colors">
                     <X className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  <form id="metricsForm" onSubmit={handleSubmit} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-base-content/80">Name *</label>
                        <input
                           type="text"
                           required
                           value={formData.name}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                           className={`w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:outline-none focus:ring-2 transition-all ${formType === 'skill' ? 'focus:ring-primary/20 focus:border-primary' : 'focus:ring-secondary/20 focus:border-secondary'}`}
                           placeholder={`e.g. ${formType === 'skill' ? 'React.js' : 'Advanced React Patterns'}`}
                        />
                     </div>

                     {formType === 'skill' ? (
                        <>
                           <div className="space-y-2">
                              <label className="text-sm font-semibold text-base-content/80">Category</label>
                              <select
                                 value={formData.category}
                                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                 className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                              >
                                 {skillCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-semibold text-base-content/80">Proficiency Level</label>
                              <select
                                 value={formData.level}
                                 onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                 className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                              >
                                 {skillLevels.map(level => <option key={level} value={level}>{level}</option>)}
                              </select>
                           </div>
                        </>
                     ) : (
                        <>
                           <div className="space-y-2">
                              <label className="text-sm font-semibold text-base-content/80">Status</label>
                              <select
                                 value={formData.type}
                                 onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                 className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all cursor-pointer"
                              >
                                 {courseTypes.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-semibold text-base-content/80">Description</label>
                              <textarea
                                 rows={3}
                                 value={formData.description}
                                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                 className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all resize-none"
                                 placeholder="What did you learn?"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-semibold text-base-content/80">Course URL</label>
                              <input
                                 type="url"
                                 value={formData.url}
                                 onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                 className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                                 placeholder="https://..."
                              />
                           </div>
                        </>
                     )}
                  </form>
               </div>

               <div className="p-6 border-t border-base-content bg-base-200 shrink-0 flex justify-end gap-3">
                  <button 
                     type="button" 
                     onClick={() => setIsModalOpen(false)}
                     className="px-6 py-2.5 rounded-none font-medium text-base-content/70 hover:bg-base-300 transition-colors"
                  >
                     Cancel
                  </button>
                  <button 
                     type="submit" 
                     form="metricsForm"
                     disabled={isSubmitting}
                     className={`text-white px-8 py-2.5 rounded-none font-semibold shadow-[4px_4px_0_0_currentColor] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                        formType === 'skill' 
                           ? 'bg-primary hover:bg-base-100 ' 
                           : 'bg-secondary hover:bg-base-100 '
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
                  <h3 className="text-xl font-bold text-base-content mb-2">Delete {deleteType === 'skill' ? 'Skill' : 'Course'}?</h3>
                  <p className="text-base-content/60 mb-6">Are you sure you want to delete <span className="font-semibold text-base-content">{itemToDelete?.name}</span>? This action cannot be undone.</p>
                  
                  <div className="flex gap-3">
                     <button 
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="flex-1 py-2.5 bg-base-200 text-base-content/80 font-medium rounded-none hover:bg-base-300 transition-colors"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={handleConfirmDelete}
                        disabled={deletingId === itemToDelete?._id}
                        className="flex-1 py-2.5 bg-error text-error-content font-medium rounded-none hover:bg-base-100 transition-colors shadow-[4px_4px_0_0_currentColor]  flex items-center justify-center gap-2"
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