'use client'

import { useState } from 'react'
import { 
  Home, Building2, Users, MessageSquare, Settings, BarChart3, 
  TrendingUp, Bell, Search, Menu, X, ChevronRight,
  DollarSign, Eye, Clock, MapPin, Plus, Filter, Download
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ModernAdminPreview() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  const stats = [
    { label: 'Total Properties', value: '24', change: '+12%', icon: Building2, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Tenants', value: '18', change: '+5%', icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Monthly Revenue', value: '$45,280', change: '+23%', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { label: 'New Inquiries', value: '12', change: '+8%', icon: MessageSquare, color: 'from-orange-500 to-red-500' }
  ]

  const recentActivities = [
    { id: 1, type: 'payment', text: 'Payment received from John Doe', time: '2 minutes ago', icon: DollarSign },
    { id: 2, type: 'inquiry', text: 'New inquiry for Ocean View Villa', time: '15 minutes ago', icon: MessageSquare },
    { id: 3, type: 'tenant', text: 'New tenant registered: Sarah Smith', time: '1 hour ago', icon: Users },
    { id: 4, type: 'property', text: 'Property updated: Sunset Apartments', time: '3 hours ago', icon: Building2 }
  ]

  const properties = [
    { id: 1, name: 'Ocean View Villa', location: 'Miami Beach', price: '$4,500/mo', status: 'Rented', occupancy: 100 },
    { id: 2, name: 'Downtown Loft', location: 'City Center', price: '$2,800/mo', status: 'Available', occupancy: 0 },
    { id: 3, name: 'Suburban House', location: 'Westside', price: '$3,200/mo', status: 'Rented', occupancy: 100 },
    { id: 4, name: 'Luxury Penthouse', location: 'Skyline Tower', price: '$8,000/mo', status: 'Maintenance', occupancy: 0 }
  ]

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Glassmorphic Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-0 top-0 h-full w-72 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/20 z-40"
          >
            <div className="p-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Modern Admin
              </h1>
            </div>

            <nav className="px-4 space-y-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* User Profile Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Admin User</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">admin@realestate.com</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Top Navigation */}
        <header className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search properties, tenants..."
                  className="pl-10 pr-4 py-2 w-96 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25"
              >
                <Plus className="h-4 w-4" />
                Quick Add
              </motion.button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-16 translate-x-16`} />
                
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-4">
                    {stat.label}
                  </h3>
                  
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Properties Table */}
            <div className="lg:col-span-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Properties Overview</h2>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                    <Filter className="h-4 w-4" />
                  </button>
                  <button className="p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {properties.map((property) => (
                  <motion.div
                    key={property.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{property.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold">{property.price}</p>
                        <p className="text-xs text-slate-500">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            property.status === 'Rented' ? 'bg-green-100 text-green-700' :
                            property.status === 'Available' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {property.status}
                          </span>
                        </p>
                      </div>
                      
                      {/* Occupancy Bar */}
                      <div className="w-24">
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                            style={{ width: `${property.occupancy}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{property.occupancy}% occupied</p>
                      </div>

                      <button className="p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 p-6">
              <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                      activity.type === 'inquiry' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'tenant' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm">{activity.text}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-6 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                View All Activity
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}