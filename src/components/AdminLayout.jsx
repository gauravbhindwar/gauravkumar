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
      <div className="h-screen bg-base-200 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-base-100 border-r-4 border-base-content transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b-4 border-base-content shrink-0 bg-primary">
            <h1 className="text-xl font-mono font-bold uppercase tracking-widest text-primary-content">ADMIN_PANEL</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 border-2 border-base-content bg-base-100 text-base-content hover:bg-base-content hover:text-base-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b-4 border-base-content bg-base-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/60" />
              <input
                type="text"
                placeholder="SEARCH_PAGES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-base-100 border-2 border-base-content rounded-none text-sm font-mono placeholder-base-content/50 focus:outline-none focus:shadow-[4px_4px_0_0_var(--color-primary)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all"
              />
            </div>
            
            {/* Search Results */}
            {searchQuery && (
              <div className="absolute left-4 right-4 top-20 bg-base-100 border-4 border-base-content shadow-[6px_6px_0_0_currentColor] z-10 max-h-64 overflow-y-auto">
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
                        className="flex items-center px-4 py-3 hover:bg-base-content hover:text-base-100 transition-colors border-b-2 border-base-content last:border-b-0 group"
                      >
                        <Icon className="h-4 w-4 text-base-content group-hover:text-base-100 mr-3" />
                        <div>
                          <div className="text-sm font-mono font-bold uppercase">{item.name}</div>
                          <div className="text-[10px] font-mono text-base-content/60 group-hover:text-base-100/70">{item.description}</div>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <div className="px-4 py-3 text-sm font-mono text-base-content/60 uppercase">NO_RESULTS_FOUND</div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6 bg-base-200">
            {sidebarItems.map((section, sectionIndex) => (
              <div key={section.category}>
                <h3 className="inline-block font-mono text-[10px] font-bold text-base-content uppercase tracking-widest mb-3 border-b-2 border-base-content pb-1">
                  [{section.category}]
                </h3>
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-3 py-3 font-mono text-sm border-2 transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-base-100 border-base-content shadow-[4px_4px_0_0_currentColor] -translate-y-1 -translate-x-1'
                            : 'border-transparent text-base-content hover:border-base-content hover:shadow-[4px_4px_0_0_currentColor] hover:-translate-y-1 hover:-translate-x-1 hover:bg-base-100'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${
                          isActive ? 'text-base-100' : 'text-base-content group-hover:text-primary'
                        }`} />
                        <div className="flex-1">
                          <div className={`font-bold uppercase tracking-wider ${isActive ? 'text-base-100' : ''}`}>
                            {item.name}
                          </div>
                          <div className={`text-[10px] uppercase ${
                            isActive ? 'text-base-100/80' : 'text-base-content/60'
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
          <div className="border-t-4 border-base-content bg-base-100 p-4">
            <button
              onClick={handlePortfolioClick}
              className="w-full group flex items-center justify-center px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest border-2 border-base-content text-base-content bg-base-200 hover:bg-base-100 shadow-[4px_4px_0_0_currentColor] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <Eye className="mr-3 h-5 w-5" />
              <span>[VIEW_PORTFOLIO]</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0 flex flex-col h-full bg-base-300">
          {/* Top bar */}
          <div className="bg-base-100 border-b-4 border-base-content shrink-0 relative z-30">
            <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-3 border-2 border-base-content bg-base-100 text-base-content shadow-[4px_4px_0_0_currentColor] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                  <Menu className="h-6 w-6" />
                </button>
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-mono font-bold uppercase tracking-widest text-base-content">
                    {getCurrentPageTitle()}
                  </h2>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Notifications */}
                <button className="p-3 border-2 border-base-content bg-base-100 text-base-content shadow-[4px_4px_0_0_currentColor] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 h-4 w-4 bg-primary border-2 border-base-content flex items-center justify-center"></span>
                </button>

                {/* User Menu */}
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 border-2 border-base-content bg-base-100 shadow-[4px_4px_0_0_currentColor] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    <div className="w-8 h-8 bg-primary border-2 border-base-content flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-content" />
                    </div>
                    <div className="hidden sm:block text-left font-mono">
                      <div className="text-sm font-bold uppercase text-base-content">{session?.user?.username}</div>
                      <div className="text-[10px] uppercase text-base-content/70">{session?.user?.email}</div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-base-content transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-4 w-64 bg-base-100 border-4 border-base-content shadow-[8px_8px_0_0_currentColor] z-50 overflow-hidden">
                      <div className="p-4 bg-base-200 border-b-4 border-base-content">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary border-2 border-base-content flex items-center justify-center shadow-[4px_4px_0_0_currentColor]">
                            <User className="h-6 w-6 text-primary-content" />
                          </div>
                          <div className="font-mono">
                            <div className="text-sm font-bold uppercase text-base-content">{session?.user?.username}</div>
                            <div className="text-[10px] uppercase text-base-content/70">{session?.user?.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3 font-mono">
                        <button
                          onClick={handlePortfolioClick}
                          className="w-full flex items-center px-4 py-3 text-sm font-bold uppercase border-2 border-base-content bg-base-100 hover:bg-base-content hover:text-base-100 transition-colors"
                        >
                          <Eye className="mr-3 h-4 w-4" />
                          [VIEW_PORTFOLIO]
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center px-4 py-3 text-sm font-bold uppercase border-2 border-primary bg-base-100 text-primary hover:bg-primary hover:text-base-100 transition-colors"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          [SIGN_OUT]
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Portfolio Modal */}
        {showPortfolioModal && (
          <div className="fixed inset-0 bg-base-content/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-base-100 border-4 border-base-content p-8 w-full max-w-md shadow-[12px_12px_0_0_currentColor]">
              <div className="text-center font-mono">
                <div className="mx-auto flex items-center justify-center h-16 w-16 border-4 border-base-content bg-primary shadow-[4px_4px_0_0_currentColor] mb-6">
                  <Eye className="h-8 w-8 text-primary-content" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-widest text-base-content mb-2">
                  [VIEW_PORTFOLIO]
                </h3>
                <p className="text-xs uppercase text-base-content/70 mb-8 border-b-2 border-base-content pb-4 inline-block">
                  How would you like to open it?
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => openPortfolio(true)}
                    className="w-full border-2 border-base-content bg-primary text-base-100 py-4 px-4 hover:shadow-none shadow-[6px_6px_0_0_currentColor] hover:translate-x-[6px] hover:translate-y-[6px] transition-all flex items-center justify-center font-bold uppercase tracking-widest"
                  >
                    <ExternalLink className="h-5 w-5 mr-3" />
                    OPEN_IN_NEW_TAB
                  </button>
                  <button
                    onClick={() => openPortfolio(false)}
                    className="w-full border-2 border-base-content bg-base-200 text-base-content py-4 px-4 hover:shadow-none shadow-[6px_6px_0_0_currentColor] hover:translate-x-[6px] hover:translate-y-[6px] transition-all flex items-center justify-center font-bold uppercase tracking-widest"
                  >
                    <Eye className="h-5 w-5 mr-3" />
                    OPEN_IN_CURRENT
                  </button>
                  <button
                    onClick={() => setShowPortfolioModal(false)}
                    className="w-full border-2 border-base-content bg-base-100 text-base-content/80 py-4 px-4 hover:bg-base-200 transition-colors font-bold uppercase tracking-widest"
                  >
                    CANCEL_OPERATION
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
