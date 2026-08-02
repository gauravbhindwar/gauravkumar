'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  ExternalLink, 
  Plus, 
  Search, 
  Grid, 
  List, 
  Calendar, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Globe, 
  X,
  FileText,
  Save,
  Loader2,
  Users,
  Zap,
  AlertTriangle
} from 'lucide-react';

export default function AdminCertifications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    credentialId: '',
    credentialLink: '',
    pdfFile: '',
    description: '',
    skills: [],
    order: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certificationToDelete, setCertificationToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper functions
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date : null;
  };

  const formatDateForInput = (dateString) => {
    const date = parseDate(dateString);
    return date ? date.toISOString().split('T')[0] : '';
  };

  const formatDateForDisplay = (dateString) => {
    const date = parseDate(dateString);
    return date ? date.toLocaleDateString() : dateString;
  };

  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = cert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.issuer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cert.skills && cert.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesSearch;
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchCertifications();
  }, [session, status, router]);

  const fetchCertifications = async () => {
    try {
      const response = await fetch('/api/certifications');
      const data = await response.json();
      setCertifications(data.certifications || []);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = '/api/certifications';
      const method = editingCertification ? 'PUT' : 'POST';
      const payload = editingCertification 
        ? { id: editingCertification._id, ...formData }
        : formData;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchCertifications();
        resetForm();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving certification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!certificationToDelete) return;

    try {
      const response = await fetch('/api/certifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: certificationToDelete._id })
      });

      if (response.ok) {
        await fetchCertifications();
        setShowDeleteModal(false);
        setCertificationToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      date: '',
      credentialId: '',
      credentialLink: '',
      pdfFile: '',
      description: '',
      skills: [],
      order: 0
    });
    setEditingCertification(null);
  };

  const handleEdit = (cert) => {
    setEditingCertification(cert);
    setFormData({
      ...cert,
      date: formatDateForInput(cert.date),
      skills: cert.skills || []
    });
    setShowForm(true);
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
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
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
              Certifications
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base-content/60 mt-1"
            >
              Manage your professional certifications and achievements.
            </motion.p>
          </div>
          
          <button
            
            
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-primary text-base-100 border-2 border-base-content px-6 py-3 font-mono font-bold uppercase tracking-widest flex items-center gap-2 shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add Certification</span>
          </button>
        </header>

        {/* Stats Cards - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { 
              label: 'Total Certifications', 
              value: certifications.length, 
              icon: Award,
              color: 'text-primary',
              bg: 'bg-base-100',
              borderColor: 'border-base-content'
            },
            { 
              label: 'Active', 
              value: certifications.length, // Placeholder logic
              icon: CheckCircle,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              borderColor: 'border-base-content'
            },
            { 
              label: 'Unique Issuers', 
              value: new Set(certifications.map(c => c.issuer)).size, 
              icon: Users,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              borderColor: 'border-base-content'
            },
            { 
              label: 'With Credentials', 
              value: certifications.filter(c => c.credentialLink || c.pdfFile).length,
              icon: FileText,
              color: 'text-orange-600',
              bg: 'bg-orange-50',
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
        <motion.div variants={item} className="bg-base-100 p-4 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input 
                type="text" 
                placeholder="Search certifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-base-100 border-2 border-base-content focus:outline-none focus:ring-0 focus:border-primary font-mono text-base-content transition-all"
              />
            </div>
            <div className="flex items-center gap-2 bg-base-200 p-1 rounded-none border border-base-content">
               <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 border-2 border-base-content transition-all ${viewMode === 'grid' ? 'bg-base-100 shadow-[2px_2px_0_0_currentColor] text-primary' : 'bg-base-100 shadow-[2px_2px_0_0_currentColor] text-base-content/40 hover:text-base-content'}`}
               >
                  <Grid className="w-4 h-4" />
               </button>
               <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 border-2 border-base-content transition-all ${viewMode === 'list' ? 'bg-base-100 shadow-[2px_2px_0_0_currentColor] text-primary' : 'bg-base-100 shadow-[2px_2px_0_0_currentColor] text-base-content/40 hover:text-base-content'}`}
               >
                  <List className="w-4 h-4" />
               </button>
            </div>
        </motion.div>

        {/* Certifications List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredCertifications.map((cert, index) => (
              <motion.div
                key={cert._id || cert.id || index}
                variants={item}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className={`bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] hover:shadow-[4px_4px_0_0_currentColor] transition-all p-6 group ${viewMode === 'list' ? 'flex items-center gap-6' : 'flex flex-col'}`}
              >
                <div className="flex justify-between items-start mb-4 w-full">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-base-100 rounded-none flex items-center justify-center shrink-0">
                         <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors line-clamp-1">{cert.title}</h3>
                         <p className="text-sm text-base-content/60 font-medium">{cert.issuer}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                         onClick={() => handleEdit(cert)}
                         className="p-2 hover:bg-base-100 text-base-content/40 hover:text-primary  transition-colors"
                      >
                         <Edit className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => {
                            setCertificationToDelete(cert);
                            setShowDeleteModal(true);
                         }}
                         className="p-2 hover:bg-base-100 text-base-content/40 hover:text-error  transition-colors"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                <div className={`space-y-3 ${viewMode === 'list' ? 'flex-1 grid grid-cols-2 gap-4 items-center space-y-0!' : ''}`}>
                   {cert.date && (
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                         <Calendar className="w-4 h-4 text-base-content/40" />
                         <span>{formatDateForDisplay(cert.date)}</span>
                      </div>
                   )}
                   
                   <div className="flex items-center gap-3">
                      {(cert.credentialLink || cert.credentialUrl) && (
                         <a href={cert.credentialLink || cert.credentialUrl} target="_blank" className="text-xs font-semibold text-primary bg-base-100 px-2.5 py-1  hover:bg-base-100 transition-colors flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Credential
                         </a>
                      )}
                      {cert.pdfFile && (
                         <a href={cert.pdfFile} target="_blank" className="text-xs font-semibold text-secondary bg-base-100 px-2.5 py-1  hover:bg-base-100 transition-colors flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Certificate
                         </a>
                      )}
                   </div>
                   
                   {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                         {cert.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-base-200 border border-base-content rounded text-xs font-medium text-base-content/70">
                               {skill}
                            </span>
                         ))}
                         {cert.skills.length > 3 && (
                            <span className="px-2 py-0.5 bg-base-200 border border-base-content rounded text-xs font-medium text-base-content/60">
                               +{cert.skills.length - 3}
                            </span>
                         )}
                      </div>
                   )}
                </div>

              </motion.div>
            ))}
        </div>

      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
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
               className="bg-base-100 rounded-none w-full max-w-2xl overflow-hidden shadow-[4px_4px_0_0_currentColor] flex flex-col max-h-[90vh]"
            >
               <div className="bg-primary p-6 flex items-center justify-between text-base-100 border-b-4 border-base-content shrink-0">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                     <Award className="w-6 h-6" />
                     {editingCertification ? 'Edit Certification' : 'Add Certification'}
                  </h3>
                  <button onClick={() => setShowForm(false)} className="p-2 hover:bg-primary-content/20 rounded-none transition-colors">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  <form id="certForm" onSubmit={handleSubmit} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-base-content/80">Title</label>
                        <input 
                           required
                           type="text" 
                           value={formData.title}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}
                           className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                           placeholder="AWS Certified Solutions Architect"
                        />
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-sm font-semibold text-base-content/80">Issuer</label>
                           <input 
                              required
                              type="text" 
                              value={formData.issuer}
                              onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                              className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                              placeholder="Amazon Web Services"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-semibold text-base-content/80">Date</label>
                           <input 
                              type="date" 
                              value={formData.date}
                              onChange={(e) => setFormData({...formData, date: e.target.value})}
                              className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-base-content/80">Credential URL</label>
                        <input 
                           type="url" 
                           value={formData.credentialLink}
                           onChange={(e) => setFormData({...formData, credentialLink: e.target.value})}
                           className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                           placeholder="https://..."
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-base-content/80">Skills (comma separated)</label>
                        <textarea 
                           rows={2}
                           value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills}
                           onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})}
                           className="w-full px-4 py-3 bg-base-200 border-2 border-base-content rounded-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                           placeholder="Cloud Computing, React, Design..."
                        />
                     </div>
                  </form>
               </div>

               <div className="p-6 border-t border-base-content bg-base-200 shrink-0 flex justify-end gap-3">
                  <button 
                     type="button" 
                     onClick={() => setShowForm(false)}
                     className="px-6 py-2.5 rounded-none font-medium text-base-content/70 hover:bg-base-300 transition-colors"
                  >
                     Cancel
                  </button>
                  <button 
                     type="submit" 
                     form="certForm"
                     disabled={isSubmitting}
                     className="bg-primary text-base-100 border-2 border-base-content px-8 py-3 font-mono font-bold uppercase tracking-widest flex items-center gap-2 shadow-[4px_4px_0_0_currentColor] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isSubmitting ? 'Saving...' : 'Save Certification'}
                  </button>
               </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
         {showDeleteModal && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-base-100 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
               <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-base-100 rounded-none shadow-[4px_4px_0_0_currentColor] max-w-sm w-full p-6 text-center"
               >
                  <div className="w-16 h-16 bg-base-100 rounded-none flex items-center justify-center mx-auto mb-4">
                     <AlertTriangle className="w-8 h-8 text-error" />
                  </div>
                  <h3 className="text-xl font-bold text-base-content mb-2">Delete Certification?</h3>
                  <p className="text-base-content/60 mb-6">
                     Are you sure you want to delete <span className="font-semibold text-base-content">"{certificationToDelete?.title}"</span>? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-center">
                     <button 
                        onClick={() => setShowDeleteModal(false)}
                        className="px-5 py-2.5 rounded-none font-medium text-base-content/70 hover:bg-base-200 transition-colors"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={handleDelete}
                        className="bg-error text-error-content px-5 py-2.5 rounded-none font-semibold hover:bg-base-100 transition-colors shadow-[4px_4px_0_0_currentColor] "
                     >
                        Delete
                     </button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

    </motion.div>
  );
}
