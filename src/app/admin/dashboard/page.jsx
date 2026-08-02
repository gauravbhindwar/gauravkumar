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
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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
      className="min-h-screen p-6 md:p-8 font-sans text-base-content"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between py-2 gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-mono font-bold tracking-widest uppercase text-base-content"
            >
              [ DASHBOARD ]
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base-content/70 mt-2 font-mono text-sm uppercase tracking-wider"
            >
              {'>'} System overview and analytics.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
             <span className="inline-flex items-center px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest bg-base-100 border-2 border-base-content text-success shadow-[4px_4px_0_0_currentColor]">
                <span className="relative flex h-2 w-2 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-none h-2 w-2 bg-success"></span>
                </span>
                SYSTEM_OPERATIONAL
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
                className="bg-base-100 p-6 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] group-hover:shadow-[4px_4px_0_0_currentColor] group-hover:translate-x-1 group-hover:translate-y-1 transition-all h-full flex flex-col justify-between relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.lightColor} border-l-4 border-b-4 border-base-content -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className={`p-3 border-2 border-base-content bg-base-100 shadow-[4px_4px_0_0_currentColor] ${stat.textColor} group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="p-1.5 bg-base-100 border-2 border-base-content shadow-[2px_2px_0_0_currentColor]">
                    <ArrowUpRight className="w-4 h-4 text-base-content" />
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="text-4xl font-mono font-bold uppercase tracking-widest text-base-content mb-2">{stat.value}</div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-base-content/70">[{stat.label}]</div>
                </div>
              </motion.div>
            </Link>
          ))}

          {/* Quick Actions - Row 2 */}
          <motion.div 
            variants={item}
            className="md:col-span-1 bg-base-100 p-6 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] h-full"
          >
            <h3 className="font-mono font-bold uppercase tracking-widest text-base-content mb-6 pb-4 border-b-4 border-base-content flex items-center gap-3">
              <Zap className="w-5 h-5 text-warning fill-warning" /> QUICK_ACTIONS
            </h3>
            <div className="space-y-4">
              {[
                { label: 'NEW_PROJECT', href: '/admin/projects', icon: Plus, color: 'text-base-100', bg: 'bg-primary' },
                { label: 'ADD_SKILL', href: '/admin/skills', icon: Plus, color: 'text-base-100', bg: 'bg-secondary' },
                { label: 'ADD_CERT', href: '/admin/certifications', icon: Plus, color: 'text-base-100', bg: 'bg-accent' },
              ].map((action, idx) => (
                <Link key={action.label} href={action.href} className="block">
                  <motion.div 
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 border-2 border-base-content bg-base-100 shadow-[4px_4px_0_0_currentColor] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 border-2 border-base-content ${action.bg} ${action.color} shadow-[2px_2px_0_0_currentColor]`}>
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-base-content">{action.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-base-content" />
                  </motion.div>
                </Link>
              ))}
              <div className="pt-4 mt-6">
                <Link href="/admin/contact">
                  <motion.div 
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 border-2 border-base-content bg-base-200 hover:bg-primary hover:text-base-100 transition-colors shadow-[4px_4px_0_0_currentColor]"
                  >
                    <span className="font-mono text-xs font-bold uppercase tracking-widest">UPDATE_CONTACT</span>
                    <Mail className="w-4 h-4" />
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Activity Feed - Row 2 */}
          <motion.div 
            variants={item}
            className="md:col-span-3 bg-base-100 p-6 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] h-full"
          >
            <div className="flex items-center justify-between mb-6 border-b-4 border-base-content pb-4">
              <h3 className="font-mono font-bold uppercase tracking-widest text-base-content flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" /> SYSTEM_ACTIVITY
              </h3>
              <div className="px-3 py-1 bg-base-200 border-2 border-base-content text-[10px] font-mono font-bold text-base-content uppercase tracking-widest shadow-[2px_2px_0_0_currentColor]">
                TIMELINE
              </div>
            </div>
            
            {recentActivity.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-4">
                {recentActivity.map((activity, index) => (
                   <motion.div 
                      key={`${activity.type}-${activity.id}-${index}`} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (index * 0.05) }}
                      className="flex items-start group relative pl-4"
                   >
                      {/* Timeline Line */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-base-content group-last:bottom-auto group-last:h-4"></div>
                      
                      <div className="absolute left-0 top-2 w-3 h-3 bg-primary border-2 border-base-content group-hover:bg-secondary transition-colors ml-[-4px]"></div>
                      
                      <div className="flex-1 ml-6 p-4 border-2 border-base-content bg-base-100 shadow-[4px_4px_0_0_currentColor] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                        <div className="flex flex-col gap-2 mb-2">
                           <div className="flex justify-between items-start gap-2">
                             <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-base-content leading-tight">{activity.title}</h4>
                             <span className="text-[10px] font-mono font-bold text-base-content whitespace-nowrap bg-base-200 px-2 py-1 border-2 border-base-content">{getTimeAgo(activity.date)}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-3 h-3 border-2 border-base-content ${
                             activity.type === 'project' ? 'bg-blue-400' :
                             activity.type === 'certification' ? 'bg-purple-400' :
                             activity.type === 'achievement' ? 'bg-yellow-400' :
                             'bg-emerald-400'
                          }`}></span>
                          <p className="text-xs font-mono font-bold uppercase tracking-widest text-base-content/60">{activity.subtitle}</p>
                        </div>
                      </div>
                   </motion.div>
                ))}
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-48 text-base-content/40 bg-base-200 border-4 border-dashed border-base-content">
                  <Activity className="w-8 h-8 mb-4 text-base-content/30" />
                  <p className="text-sm font-mono font-bold uppercase tracking-widest">NO_ACTIVITY_DETECTED</p>
               </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
