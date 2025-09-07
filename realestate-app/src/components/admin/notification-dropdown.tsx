"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCheck, Mail, DollarSign, FileText, Wrench, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useNotifications } from './notification-provider'

const typeIcons = {
  GENERAL: Mail,
  RENT_DUE: DollarSign,
  RENT_OVERDUE: DollarSign,
  PAYMENT_REMINDER: DollarSign,
  LEASE_EXPIRY: FileText,
  MAINTENANCE_UPDATE: Wrench,
}

const typeColors = {
  GENERAL: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  RENT_DUE: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  RENT_OVERDUE: 'text-red-600 bg-red-100 dark:bg-red-900/30',
  PAYMENT_REMINDER: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
  LEASE_EXPIRY: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
  MAINTENANCE_UPDATE: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  const recentNotifications = notifications.slice(0, 5)

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/20 shadow-xl z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Njoftime</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <CheckCheck className="h-3 w-3" />
                      Shëno të gjitha si të lexuara
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {recentNotifications.length > 0 ? (
                  <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                    {recentNotifications.map((notification) => {
                      const Icon = typeIcons[notification.type]
                      const colorClass = typeColors[notification.type]
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                            notification.urgent ? 'border-l-2 border-l-red-500' : ''
                          }`}
                          onClick={() => {
                            markAsRead(notification.id)
                            setIsOpen(false)
                          }}
                        >
                          <div className="flex gap-3">
                            {/* Type Icon */}
                            <div className={`p-2 rounded-lg ${colorClass}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium text-sm truncate">
                                  {notification.title}
                                </h4>
                                <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                </span>
                              </div>
                              
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              {notification.urgent && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 mt-2 text-xs font-medium text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                                  <AlertCircle className="h-3 w-3" />
                                  Urgjent
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">Asnjë njoftim i ri</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {recentNotifications.length > 0 && (
                <div className="p-3 border-t border-slate-200/50 dark:border-slate-700/50">
                  <button 
                    className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Shiko të gjitha njoftimet
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}