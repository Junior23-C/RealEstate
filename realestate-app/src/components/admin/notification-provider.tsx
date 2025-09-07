"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'

interface Notification {
  id: string
  type: 'PAYMENT_REMINDER' | 'RENT_DUE' | 'RENT_OVERDUE' | 'LEASE_EXPIRY' | 'MAINTENANCE_UPDATE' | 'GENERAL'
  title: string
  message: string
  urgent: boolean
  timestamp: string
  metadata?: Record<string, unknown>
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  socket: Socket | null
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  refreshNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [socket, setSocket] = useState<Socket | null>(null)

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      // Optimistically update UI
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))

      // Send to server via socket
      if (socket) {
        socket.emit('mark-notification-read', id)
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' })
      })

      if (response.ok) {
        setUnreadCount(0)
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        )
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  useEffect(() => {
    let socketInstance: Socket | null = null

    // Initialize socket connection (simplified for build compatibility)
    const connectSocket = async () => {
      try {
        socketInstance = io({
          path: '/api/socket',
          autoConnect: false
        })

        socketInstance.on('connect', () => {
          console.log('Connected to notification socket')
          setSocket(socketInstance)
        })

        socketInstance.on('disconnect', () => {
          console.log('Disconnected from notification socket')
          setSocket(null)
        })

        // Listen for new notifications
        socketInstance.on('new-notification', (notification: Notification) => {
          setNotifications(prev => [notification, ...prev])
          setUnreadCount(prev => prev + 1)
          
          // Show toast notification
          toast(notification.title, {
            description: notification.message,
            duration: notification.urgent ? 10000 : 5000,
          })
          
          // Removed browser notifications to avoid security flags
        })

        socketInstance.on('notification-updated', (notificationId: string) => {
          setNotifications(prev => 
            prev.map(notif => 
              notif.id === notificationId ? { ...notif, read: true } : notif
            )
          )
        })

        // Try to connect (will fail gracefully if server not available)
        socketInstance.connect()
      } catch (error) {
        console.log('Socket connection not available:', error)
      }
    }

    // Initial fetch
    fetchNotifications()

    // Connect socket
    connectSocket()

    // Removed automatic notification permission request to avoid security flags

    return () => {
      if (socketInstance) {
        socketInstance.disconnect()
      }
    }
  }, [])

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    socket,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  )
}