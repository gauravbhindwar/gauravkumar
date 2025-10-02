'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AdminProtection from '@/components/AdminProtection';
import { 
  FolderOpen, 
  Code, 
  Award, 
  Mail, 
  BookOpen, 
  TrendingUp, 
  Eye, 
  Activity,
  Github,
  Users,
  ChevronRight,
  Calendar,
  Clock,
  BarChart3,
  Sparkles,
  Zap,
  Star,
  Download,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <AdminProtection>
      <AdminDashboard />
    </AdminProtection>
  );
}

function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    certifications: 0,
    courses: 0,
    experiences: 0,
    awards: 0,
    achievements: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!session) return;
      
      try {
        // Initialize with empty data structures
        let projectsData = { projects: [] };
        let skillsData = { categories: [] };
        let certificationsData = { certifications: [] };
        let educationData = { education: [] };
        let experiencesData = { experiences: [] };
        let awardsData = { awards: [] };
        let achievementsData = { achievements: [] };
        
        // Fetch all data with proper error handling
        const fetchPromises = [
          fetch('/api/projects').then(res => res.ok ? res.json() : { projects: [] }).catch(() => ({ projects: [] })),
          fetch('/api/skills').then(res => res.ok ? res.json() : { categories: [] }).catch(() => ({ categories: [] })),
          fetch('/api/certifications').then(res => res.ok ? res.json() : { certifications: [] }).catch(() => ({ certifications: [] })),
          fetch('/api/education').then(res => res.ok ? res.json() : { education: [] }).catch(() => ({ education: [] })),
          fetch('/api/experiences').then(res => res.ok ? res.json() : []).catch(() => []),
          fetch('/api/awards').then(res => res.ok ? res.json() : { awards: [] }).catch(() => ({ awards: [] })),
          fetch('/api/achievements').then(res => res.ok ? res.json() : { achievements: [] }).catch(() => ({ achievements: [] }))
        ];

        const [projects, skills, certifications, education, experiences, awards, achievements] = await Promise.all(fetchPromises);
        
        // Count courses from education entries that have type 'course' or similar
        const coursesCount = Array.isArray(education?.education) 
          ? education.education.filter(item => 
              item.type === 'course' || 
              item.degree?.toLowerCase().includes('course') ||
              item.degree?.toLowerCase().includes('training')
            ).length 
          : 0;
        
        setStats({
          projects: Array.isArray(projects?.projects) ? projects.projects.length : 0,
          skills: Array.isArray(skills?.categories) ? 
            skills.categories.reduce((total, category) => 
              total + (Array.isArray(category?.skills) ? category.skills.length : 0), 0) : 0,
          certifications: Array.isArray(certifications?.certifications) ? 
            certifications.certifications.length : 0,
          courses: coursesCount,
          experiences: Array.isArray(experiences) ? experiences.length : 0,
          awards: Array.isArray(awards?.awards) ? awards.awards.length : 0,
          achievements: Array.isArray(achievements?.achievements) ? achievements.achievements.length : 0
        });

        // Generate recent activity from actual data
        const activities = [];
        
        // Add recent projects
        if (Array.isArray(projects?.projects)) {
          projects.projects.slice(0, 2).forEach(project => {
            activities.push({
              title: `Updated ${project.title}`,
              description: project.description?.substring(0, 60) + '...' || 'Project details updated',
              time: 'Recently',
              type: 'project'
            });
          });
        }

        // Add recent certifications
        if (Array.isArray(certifications?.certifications)) {
          certifications.certifications.slice(0, 2).forEach(cert => {
            activities.push({
              title: `Added ${cert.name}`,
              description: `New certification from ${cert.issuer || 'Organization'}`,
              time: 'Recently',
              type: 'certification'
            });
          });
        }

        // Add recent skills
        if (Array.isArray(skills?.categories) && skills.categories.length > 0) {
          const recentSkills = skills.categories[0]?.skills?.slice(0, 1) || [];
          recentSkills.forEach(skill => {
            activities.push({
              title: `Added ${skill.name}`,
              description: `New skill in ${skills.categories[0]?.category || 'development'}`,
              time: 'Recently',
              type: 'skill'
            });
          });
        }

        // Fallback activity if no data
        if (activities.length === 0) {
          activities.push({
            title: 'Welcome to Admin Dashboard',
            description: 'Start by adding your first project or experience',
            time: 'Now',
            type: 'info'
          });
        }

        setRecentActivity(activities.slice(0, 4)); // Show max 4 activities
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          projects: 0,
          skills: 0,
          certifications: 0,
          courses: 0,
          experiences: 0,
          awards: 0,
          achievements: 0
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </motion.div>
      </div>
    )
  }

  const statsData = [
    {
      title: 'Total Projects',
      value: stats.projects,
      change: '+12% from last month',
      trend: 'up',
      icon: FolderOpen,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      href: '/admin/projects'
    },
    { 
      title: 'Skills',
      value: stats.skills,
      change: '+8% from last month',
      trend: 'up',
      icon: Code,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      href: '/admin/skills'
    },
    {
      title: 'Certifications',
      value: stats.certifications,
      change: '+5% from last month',
      trend: 'up',
      icon: Award,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      href: '/admin/certifications'
    },
    {
      title: 'Courses',
      value: stats.courses,
      change: '+3% from last month',
      trend: 'up',
      icon: BookOpen,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      href: '/admin/courses'
    }
  ];
  
  const quickActions = [
    {
      title: 'Create New Project',
      description: 'Add a new project to your portfolio showcase',
      icon: FolderOpen,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/projects',
      action: 'Add Project'
    },
    {
      title: 'Add Skills',
      description: 'Update your technical skills and expertise',
      icon: Code,
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      href: '/admin/skills',
      action: 'Manage Skills'
    },
    {
      title: 'New Certification',
      description: 'Add your latest certification or achievement',
      icon: Award,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      href: '/admin/certifications',
      action: 'Add Certification'
    },
    {
      title: 'Update Contact',
      description: 'Manage your contact information and social links',
      icon: Mail,
      gradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      href: '/admin/contact',
      action: 'Update Contact'
    },
    {
      title: 'Manage Admins',
      description: 'Create, update, and manage admin accounts',
      icon: Users,
      gradient: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      href: '/admin/admins',
      action: 'Manage Admins'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center space-x-3 mb-4"
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    👋
                  </motion.div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Welcome back, {session?.user?.username}!
                  </h1>
                </div>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-blue-100 text-lg font-medium"
              >
                Here's what's happening with your portfolio today
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="hidden md:flex items-center space-x-4"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/20"
              >
                <BarChart3 className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/20"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </div>
          
          
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href={stat.href}>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-r ${stat.gradient} p-3 rounded-xl shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-800">{stat.value}</p>
                    
                    {stat.change && (
                      <div className="flex items-center space-x-1">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                          stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-xs font-medium">{stat.change}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
            <p className="text-gray-600">Manage your portfolio content efficiently</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer relative overflow-hidden">
                <div className={`absolute inset-0 ${action.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className={`bg-gradient-to-r ${action.gradient} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <action.icon className="text-white w-7 h-7" />
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-gray-800">{action.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700">{action.description}</p>
                  
                  <Link href={action.href}>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-700">{action.action}</span>
                      <ChevronRight className="w-4 h-4 text-blue-600 group-hover:text-blue-700 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Grid - Recent Activity & Portfolio Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Recent Activity List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Activity</h2>
              <p className="text-gray-600">Latest updates to your portfolio</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-600 text-sm font-semibold hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              View All
            </motion.button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 4 }}
                className="flex items-start p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300 group cursor-pointer"
              >
                <div className={`p-3 rounded-xl mr-4 shadow-sm ${
                  activity.type === 'project' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 
                  activity.type === 'skill' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' : 
                  'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                }`}>
                  {activity.type === 'project' && <FolderOpen className="w-5 h-5" />}
                  {activity.type === 'skill' && <Code className="w-5 h-5" />}
                  {activity.type === 'certification' && <Award className="w-5 h-5" />}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 mb-1">{activity.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 group-hover:text-gray-700">{activity.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Today</span>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Portfolio Analytics */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Portfolio Analytics</h2>
              <p className="text-gray-600 text-sm">Public engagement metrics</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="space-y-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-800 font-medium">Page Views</span>
                </div>
                <span className="text-2xl font-bold text-blue-900">1,248</span>
              </div>
              <div className="text-xs text-blue-600 font-medium">↗ +12% from last week</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <Github className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-purple-800 font-medium">GitHub Views</span>
                </div>
                <span className="text-2xl font-bold text-purple-900">743</span>
              </div>
              <div className="text-xs text-purple-600 font-medium">↗ +8% from last week</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-5 rounded-xl border border-emerald-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-500 p-2 rounded-lg">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-emerald-800 font-medium">Profile Rank</span>
                </div>
                <span className="text-2xl font-bold text-emerald-900">#42</span>
              </div>
              <div className="text-xs text-emerald-600 font-medium">↗ +3 positions</div>
            </motion.div>
            
            <div className="pt-4 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center font-semibold shadow-lg shadow-blue-500/25"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Portfolio
                <ExternalLink className="w-4 h-4 ml-2" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
