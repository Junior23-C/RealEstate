'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, Building2, Users, MessageSquare, Settings, BarChart3, 
  Menu, X, ChevronRight, Bell, Search, Plus, LogOut, User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'

interface AdminLayoutProps {
  children: React.ReactNode
  user?: {
    name?: string | null
    email?: string | null
  }
}

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/admin' },
    { id: 'properties', label: 'Pronat', icon: Building2, href: '/admin/properties' },
    { id: 'tenants', label: 'Qiramarrësit', icon: Users, href: '/admin/rentals/tenants' },
    { id: 'inquiries', label: 'Pyetjet', icon: MessageSquare, href: '/admin/inquiries' },
    { id: 'rentals', label: 'Qiratë', icon: BarChart3, href: '/admin/rentals' },
    { id: 'settings', label: 'Cilësimet', icon: Settings, href: '/admin/settings' }
  ]

  const getActiveTab = () => {
    const path = pathname.split('/').filter(Boolean)
    if (path.length === 1 && path[0] === 'admin') return 'dashboard'
    if (pathname.includes('/properties')) return 'properties'
    if (pathname.includes('/tenants')) return 'tenants'
    if (pathname.includes('/inquiries')) return 'inquiries'
    if (pathname.includes('/rentals')) return 'rentals'
    if (pathname.includes('/settings')) return 'settings'
    return 'dashboard'
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Glassmorphic Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 h-full w-72 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/20 z-50"
            >
              <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
              </div>

              <nav className="px-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = getActiveTab() === item.id
                  return (
                    <Link key={item.id} href={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        )}
                      </motion.div>
                    </Link>
                  )
                })}
              </nav>

              {/* User Profile Section */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{user?.name || 'Admin'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Dil
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        {/* Top Navigation */}
        <header className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5 lg:hidden" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Kërko pronat, qiramarrësit..."
                  className="pl-10 pr-4 py-2 w-80 lg:w-96 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              </motion.button>

              {/* Quick Add Button */}
              <Link href="/admin/properties/new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Shto Pronë</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}