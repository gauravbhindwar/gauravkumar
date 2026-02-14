'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminProtection from '@/components/AdminProtection';
import { 
  FolderOpen, 
  Code, 
  Award, 
  Mail, 
  BookOpen, 
  TrendingUp, 
  Activity,
  Users,
  ChevronRight,
  Calendar,
  Clock,
  Zap,
  Briefcase,
  Star,
  ArrowUpRight,
  Plus
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
        // Fetch all data
        const fetchPromises = [
          fetch('/api/projects').then(res => res.ok ? res.json() : { projects: [] }).catch(() => ({ projects: [] })),
          fetch('/api/skills').then(res => res.ok ? res.json() : { categories: [] }).catch(() => ({ categories: [] })),
          fetch('/api/certifications').then(res => res.ok ? res.json() : { certifications: [] }).catch(() => ({ certifications: [] })),
          fetch('/api/education').then(res => res.ok ? res.json() : { education: [] }).catch(() => ({ education: [] })),
          fetch('/api/experiences').then(res => res.ok ? res.json() : []).catch(() => []),
          fetch('/api/awards').then(res => res.ok ? res.json() : { awards: [] }).catch(() => ({ awards: [] })),
          fetch('/api/achievements').then(res => res.ok ? res.json() : { achievements: [] }).catch(() => ({ achievements: [] }))
        ];

        const [projectsData, skillsData, certificationsData, educationData, experiencesData, awardsData, achievementsData] = await Promise.all(fetchPromises);
        
        const projects = Array.isArray(projectsData?.projects) ? projectsData.projects : [];
        const skills = Array.isArray(skillsData?.categories) ? skillsData.categories : [];
        const certifications = Array.isArray(certificationsData?.certifications) ? certificationsData.certifications : [];
        const education = Array.isArray(educationData?.education) ? educationData.education : [];
        const experiences = Array.isArray(experiencesData) ? experiencesData : [];
        const awards = Array.isArray(awardsData?.awards) ? awardsData.awards : [];
        const achievements = Array.isArray(achievementsData?.achievements) ? achievementsData.achievements : [];

        // Count courses
        const coursesCount = education.filter(item => 
          item.type === 'course' || 
          item.degree?.toLowerCase().includes('course') ||
          item.degree?.toLowerCase().includes('training')
        ).length;
        
        // Calculate total skills
        const totalSkills = skills.reduce((total, category) => 
          total + (Array.isArray(category?.skills) ? category.skills.length : 0), 0);

        setStats({
          projects: projects.length,
          skills: totalSkills,
          certifications: certifications.length,
          courses: coursesCount,
          experiences: experiences.length,
          awards: awards.length,
          achievements: achievements.length
        });

        // Generate recent activity from actual data
        let allActivities = [];

        projects.forEach(project => {
          allActivities.push({
            id: project._id || project.id,
            title: project.title,
            subtitle: 'Project Updated',
            date: new Date(project.updatedAt || project.createdAt),
            type: 'project',
            icon: FolderOpen,
          });
        });

        certifications.forEach(cert => {
          allActivities.push({
            id: cert._id || cert.id,
            title: cert.title,
            subtitle: 'Certification Added',
            date: new Date(cert.createdAt || new Date()),
            type: 'certification',
            icon: Award,
          });
        });

        achievements.forEach(achievement => {
          allActivities.push({
            id: achievement._id || achievement.id,
            title: achievement.title,
            subtitle: 'Achievement Unlocked',
            date: new Date(achievement.createdAt || new Date()),
            type: 'achievement',
            icon: Star,
          });
        });

        experiences.forEach(exp => {
          allActivities.push({
            id: exp._id,
            title: exp.position,
            subtitle: `at ${exp.company}`,
            date: new Date(exp.createdAt || new Date()),
            type: 'experience',
            icon: Briefcase,
          });
        });

        // Sort by date descending and take top 10
        allActivities.sort((a, b) => b.date - a.date);
        
        setRecentActivity(allActivities.slice(0, 8));

      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [session]);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return "now";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const statItems = [
    { 
      label: 'Projects', 
      value: stats.projects, 
      href: '/admin/projects', 
      icon: FolderOpen,
      color: 'bg-blue-500', 
      lightColor: 'bg-blue-50', 
      textColor: 'text-blue-600',
      borderColor: 'border-blue-100'
    },
    { 
      label: 'Skills', 
      value: stats.skills, 
      href: '/admin/skills', 
      icon: Code,
      color: 'bg-emerald-500', 
      lightColor: 'bg-emerald-50', 
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-100'
    },
    { 
      label: 'Certifications', 
      value: stats.certifications, 
      href: '/admin/certifications', 
      icon: Award,
      color: 'bg-purple-500', 
      lightColor: 'bg-purple-50', 
      textColor: 'text-purple-600',
      borderColor: 'border-purple-100'
    },
    { 
      label: 'Experiences', 
      value: stats.experiences, 
      href: '/admin/experiences', 
      icon: Briefcase,
      color: 'bg-orange-500', 
      lightColor: 'bg-orange-50', 
      textColor: 'text-orange-600',
      borderColor: 'border-orange-100'
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans text-gray-900"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between py-2">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold tracking-tight text-gray-900"
            >
              Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 mt-1"
            >
              Welcome back, here's your portfolio overview.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white border border-green-200 text-green-700 shadow-sm">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                System Operational
             </span>
          </motion.div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Main Stats - Row 1 */}
          {statItems.map((stat, i) => (
            <Link href={stat.href} key={stat.label} className="group">
              <motion.div 
                variants={item}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-white p-6 rounded-2xl border ${stat.borderColor} shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.lightColor} rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110`}></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`p-3 rounded-xl ${stat.lightColor} ${stat.textColor} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`p-1.5 rounded-full bg-white shadow-sm border ${stat.borderColor}`}>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="text-4xl font-extrabold tracking-tight text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                </div>
              </motion.div>
            </Link>
          ))}

          {/* Quick Actions - Row 2 */}
          <motion.div 
            variants={item}
            className="md:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full"
          >
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Quick Actions
            </h3>
            <div className="space-y-3">
              {[
                { label: 'New Project', href: '/admin/projects', icon: Plus, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Add Skill', href: '/admin/skills', icon: Plus, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Add Cert', href: '/admin/certifications', icon: Plus, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((action, idx) => (
                <Link key={action.label} href={action.href}>
                  <motion.div 
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group mb-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${action.bg} ${action.color}`}>
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-gray-900">{action.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600" />
                  </motion.div>
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 mt-4">
                <Link href="/admin/contact">
                  <motion.div 
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 text-gray-600 hover:text-indigo-700 transition-colors"
                  >
                    <span className="font-medium">Update Contact</span>
                    <Mail className="w-4 h-4" />
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Activity Feed - Row 2 */}
          <motion.div 
            variants={item}
            className="md:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" /> Recent Activity
              </h3>
              <div className="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Timeline
              </div>
            </div>
            
            {recentActivity.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {recentActivity.map((activity, index) => (
                   <motion.div 
                      key={`${activity.type}-${activity.id}-${index}`} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (index * 0.05) }}
                      className="flex items-start group relative pl-4"
                   >
                      {/* Timeline Line */}
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-100 group-last:bottom-auto group-last:h-4"></div>
                      
                      <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 ring-4 ring-white group-hover:bg-blue-500 group-hover:scale-125 transition-all -ml-[2.5px]"></div>
                      
                      <div className="flex-1 ml-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                           <h4 className="text-sm font-bold text-gray-900 truncate pr-2">{activity.title}</h4>
                           <span className="text-xs font-medium text-gray-400 whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded-full">{getTimeAgo(activity.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                             activity.type === 'project' ? 'bg-blue-400' :
                             activity.type === 'certification' ? 'bg-purple-400' :
                             activity.type === 'achievement' ? 'bg-yellow-400' :
                             'bg-emerald-400'
                          }`}></span>
                          <p className="text-xs text-gray-500 font-medium">{activity.subtitle}</p>
                        </div>
                      </div>
                   </motion.div>
                ))}
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-48 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Activity className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm font-medium">No recent activity recorded.</p>
               </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
