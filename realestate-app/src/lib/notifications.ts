import { prisma } from './db'
import { SecureLogger } from './logger'

interface NotificationData {
  type: 'PAYMENT_REMINDER' | 'RENT_DUE' | 'RENT_OVERDUE' | 'LEASE_EXPIRY' | 'MAINTENANCE_UPDATE' | 'GENERAL'
  title: string
  message: string
  metadata?: Record<string, unknown>
  urgent?: boolean
}

class NotificationService {
  private adminRoom = 'admin-notifications'

  async sendToAdmin(data: NotificationData) {
    try {
      // Store notification in database
      const notification = await prisma.notification.create({
        data: {
          type: data.type,
          title: data.title,
          message: data.message,
          recipientEmail: 'admin', // Will be improved with multiple admins later
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
          status: 'PENDING'
        }
      })

      SecureLogger.info('Notification sent to admin', {
        notificationId: notification.id,
        type: data.type,
        title: data.title
      })

      return notification
    } catch (error) {
      SecureLogger.error('Error sending notification', error)
      throw error
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      return await prisma.notification.count({
        where: { status: 'PENDING' }
      })
    } catch (error) {
      SecureLogger.error('Error getting unread notification count', error)
      return 0
    }
  }

  async getRecentNotifications(limit = 10) {
    try {
      return await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          status: true,
          createdAt: true,
          metadata: true
        }
      })
    } catch (error) {
      SecureLogger.error('Error getting recent notifications', error)
      return []
    }
  }

  async markAllAsRead() {
    try {
      await prisma.notification.updateMany({
        where: { status: 'PENDING' },
        data: { status: 'SENT', sentAt: new Date() }
      })
    } catch (error) {
      SecureLogger.error('Error marking all notifications as read', error)
    }
  }
}

export const notificationService = new NotificationService()

// Helper functions for common notification types
export const NotificationHelpers = {
  newInquiry: async (inquiryData: { name: string, propertyTitle: string, inquiryId: string }) => {
    await notificationService.sendToAdmin({
      type: 'GENERAL',
      title: 'Pyetje e Re',
      message: `${inquiryData.name} ka dërguar një pyetje për "${inquiryData.propertyTitle}"`,
      metadata: { inquiryId: inquiryData.inquiryId },
      urgent: true
    })
  },

  paymentOverdue: async (paymentData: { tenantName: string, amount: number, daysOverdue: number, paymentId: string }) => {
    await notificationService.sendToAdmin({
      type: 'RENT_OVERDUE',
      title: 'Pagesë e Vonuar',
      message: `Pagesa nga ${paymentData.tenantName} (€${paymentData.amount}) është ${paymentData.daysOverdue} ditë e vonuar`,
      metadata: { paymentId: paymentData.paymentId },
      urgent: true
    })
  },

  leaseExpiring: async (leaseData: { tenantName: string, propertyTitle: string, daysUntilExpiry: number, leaseId: string }) => {
    await notificationService.sendToAdmin({
      type: 'LEASE_EXPIRY',
      title: 'Kontrata Po Skadon',
      message: `Kontrata e ${leaseData.tenantName} për "${leaseData.propertyTitle}" skadon në ${leaseData.daysUntilExpiry} ditë`,
      metadata: { leaseId: leaseData.leaseId },
      urgent: leaseData.daysUntilExpiry <= 7
    })
  },

  maintenanceRequest: async (requestData: { tenantName: string, propertyTitle: string, requestType: string, requestId: string }) => {
    await notificationService.sendToAdmin({
      type: 'MAINTENANCE_UPDATE',
      title: 'Kërkesë Mirëmbajtje',
      message: `${requestData.tenantName} ka kërkuar mirëmbajtje (${requestData.requestType}) për "${requestData.propertyTitle}"`,
      metadata: { requestId: requestData.requestId }
    })
  }
}