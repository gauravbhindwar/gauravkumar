'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Code, 
  Award, 
  BookOpen, 
  Mail, 
  LogOut, 
  Menu, 
  X,
  User,
  Settings,
  Users,
  ExternalLink,
  Eye,
  Briefcase,
  Trophy,
  Star,
  Search,
  Bell,
  ChevronDown,
  Shield
} from 'lucide-react'
import AdminProtection from './AdminProtection'

const sidebarItems = [
  {
    category: 'Overview',
    items: [
      {
        name: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
        description: 'Overview and analytics'
      }
    ]
  },
  {
    category: 'Content Management',
    items: [
      {
        name: 'Experiences',
        href: '/admin/experiences',
        icon: Briefcase,
        description: 'Manage work experience'
      },
      {
        name: 'Projects',
        href: '/admin/projects',
        icon: FolderOpen,
        description: 'Manage project portfolio'
      },
      {
        name: 'Skills',
        href: '/admin/skills',
        icon: Code,
        description: 'Technical skills'
      },
      {
        name: 'Education',
        href: '/admin/education',
        icon: BookOpen,
        description: 'Educational background'
      },
      {
        name: 'Courses',
        href: '/admin/courses',
        icon: BookOpen,
        description: 'Course certifications'
      }
    ]
  },
  {
    category: 'Recognition',
    items: [
      {
        name: 'Certifications',
        href: '/admin/certifications',
        icon: Award,
        description: 'Professional certifications'
      },
      {
        name: 'Achievements',
        href: '/admin/achievements',
        icon: Star,
        description: 'Notable achievements'
      },
      {
        name: 'Awards',
        href: '/admin/awards',
        icon: Trophy,
        description: 'Awards and honors'
      }
    ]
  },
  {
    category: 'Settings',
    items: [
      {
        name: 'Contact',
        href: '/admin/contact',
        icon: Mail,
        description: 'Contact information'
      },
      {
        name: 'Admins',
        href: '/admin/admins',
        icon: Users,
        description: 'Admin management'
      }
    ]
  }
]

export default function AdminLayout({ children }) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showPortfolioModal, setShowPortfolioModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Get all items for search
  const allItems = sidebarItems.flatMap(section => section.items)
  
  // Filter items based on search
  const filteredItems = searchQuery 
    ? allItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = allItems.find(item => item.href === pathname)
    return currentItem?.name || 'Admin Dashboard'
  }

  // ESC key handler for closing modals
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (showPortfolioModal) {
          setShowPortfolioModal(false)
        }
        if (showUserMenu) {
          setShowUserMenu(false)
        }
        if (searchQuery) {
          setSearchQuery('')
        }
      }
    }

    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('keydown', handleEscKey)
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showPortfolioModal, showUserMenu, searchQuery])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handlePortfolioClick = () => {
    setShowPortfolioModal(true)
  }

  const openPortfolio = (newTab = false) => {
    const portfolioUrl = '/'
    if (newTab) {
      window.open(portfolioUrl, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = portfolioUrl
    }
    setShowPortfolioModal(false)
  }

  return (
    <AdminProtection>
      <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            {/* Search Results */}
            {searchQuery && (
              <div className="absolute left-4 right-4 top-16 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-64 overflow-y-auto">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setSearchQuery('')
                          setSidebarOpen(false)
                        }}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <Icon className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {sidebarItems.map((section, sectionIndex) => (
              <div key={section.category}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                  {section.category}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 hover:translate-x-1 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className={`mr-3 h-5 w-5 transition-colors ${
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                        }`} />
                        <div className="flex-1">
                          <div className={`font-medium ${isActive ? 'text-white' : ''}`}>
                            {item.name}
                          </div>
                          <div className={`text-xs ${
                            isActive ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-200/50 p-4 space-y-2">
            <button
              onClick={handlePortfolioClick}
              className="w-full group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Eye className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-600" />
              <span>View Portfolio</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0 flex flex-col h-full">
          {/* Top bar */}
          <div className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200 flex-shrink-0 relative z-30">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {getCurrentPageTitle()}
                  </h2>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">{session?.user?.username}</div>
                      <div className="text-xs text-gray-500">{session?.user?.email}</div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{session?.user?.username}</div>
                            <div className="text-xs text-gray-500">{session?.user?.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <button
                          onClick={handlePortfolioClick}
                          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="mr-3 h-4 w-4 text-gray-400" />
                          View Portfolio
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Page content - Scrollable area */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>

        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Portfolio Modal */}
        {showPortfolioModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mb-4">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  View Portfolio
                </h3>
                <p className="text-sm text-gray-600 mb-8">
                  How would you like to open your portfolio?
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => openPortfolio(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center font-medium shadow-lg shadow-blue-500/25"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </button>
                  <button
                    onClick={() => openPortfolio(false)}
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center font-medium"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Open in Current Tab
                  </button>
                  <button
                    onClick={() => setShowPortfolioModal(false)}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtection>
  )
}
