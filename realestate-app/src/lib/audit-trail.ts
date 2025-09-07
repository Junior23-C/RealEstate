import { prisma } from "@/lib/db"
import { AuditAction } from "@prisma/client"
import { NextRequest } from "next/server"
import { SecureLogger } from "./logger"

export interface AuditContext {
  userId: string
  action: AuditAction
  entity: string
  entityId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  success?: boolean
  error?: string
}

export class AuditTrail {
  // Log an audit event
  static async log(context: AuditContext): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: context.userId,
          action: context.action,
          entity: context.entity,
          entityId: context.entityId || null,
          details: context.details ? JSON.stringify(context.details) : null,
          ipAddress: context.ipAddress || null,
          userAgent: context.userAgent?.substring(0, 500) || null, // Limit length
          success: context.success ?? true,
          error: context.error || null,
        }
      })
      
      // Also log to secure logger for immediate visibility
      SecureLogger.info(`Audit: ${context.action} on ${context.entity}`, {
        userId: context.userId,
        entityId: context.entityId,
        success: context.success ?? true,
        type: 'audit_trail'
      })
      
    } catch (error) {
      console.error('Failed to create audit log:', error)
      
      // Fallback to secure logger only
      SecureLogger.error('Audit log creation failed', error, {
        userId: context.userId,
        action: context.action,
        entity: context.entity,
        entityId: context.entityId
      })
    }
  }

  // Log a successful action
  static async logSuccess(
    userId: string,
    action: AuditAction,
    entity: string,
    entityId?: string,
    details?: Record<string, any>,
    request?: NextRequest
  ): Promise<void> {
    await this.log({
      userId,
      action,
      entity,
      entityId,
      details,
      ipAddress: this.getIpFromRequest(request),
      userAgent: request?.headers.get('user-agent') || undefined,
      success: true
    })
  }

  // Log a failed action
  static async logFailure(
    userId: string,
    action: AuditAction,
    entity: string,
    error: string,
    entityId?: string,
    details?: Record<string, any>,
    request?: NextRequest
  ): Promise<void> {
    await this.log({
      userId,
      action,
      entity,
      entityId,
      details,
      ipAddress: this.getIpFromRequest(request),
      userAgent: request?.headers.get('user-agent') || undefined,
      success: false,
      error
    })
  }

  // Convenience methods for common actions
  static async logCreate(
    userId: string,
    entity: string,
    entityId: string,
    details?: Record<string, any>,
    request?: NextRequest
  ): Promise<void> {
    await this.logSuccess(userId, AuditAction.CREATE, entity, entityId, details, request)
  }

  static async logUpdate(
    userId: string,
    entity: string,
    entityId: string,
    details?: Record<string, any>,
    request?: NextRequest
  ): Promise<void> {
    await this.logSuccess(userId, AuditAction.UPDATE, entity, entityId, details, request)
  }

  static async logDelete(
    userId: string,
    entity: string,
    entityId: string,
    details?: Record<string, any>,
    request?: NextRequest
  ): Promise<void> {
    await this.logSuccess(userId, AuditAction.DELETE, entity, entityId, details, request)
  }

  static async logDocumentUpload(
    userId: string,
    documentId: string,
    fileName: string,
    fileSize: number,
    request?: NextRequest
  ): Promise<void> {
    await this.logSuccess(
      userId, 
      AuditAction.DOCUMENT_UPLOAD, 
      'Document', 
      documentId, 
      { fileName, fileSize },
      request
    )
  }

  static async logDocumentView(
    userId: string,
    documentId: string,
    fileName: string,
    request?: NextRequest
  ): Promise<void> {
    await this.logSuccess(
      userId, 
      AuditAction.DOCUMENT_VIEW, 
      'Document', 
      documentId, 
      { fileName },
      request
    )
  }

  static async logLogin(
    userId: string,
    request?: NextRequest
  ): Promise<void> {
    await this.logSuccess(userId, AuditAction.LOGIN, 'User', userId, undefined, request)
  }

  static async logPasswordChange(
    userId: string,
    request?: NextRequest
  ): Promise<void> {
    await this.logSuccess(userId, AuditAction.PASSWORD_CHANGE, 'User', userId, undefined, request)
  }

  static async logSuperAdminAccess(
    userId: string,
    action: string,
    request?: NextRequest
  ): Promise<void> {
    await this.logSuccess(
      userId, 
      AuditAction.SUPER_ADMIN_ACCESS, 
      'System', 
      undefined, 
      { action },
      request
    )
  }

  // Get recent audit logs for a user
  static async getUserAuditLogs(userId: string, limit = 50) {
    return await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })
  }

  // Get audit logs for an entity
  static async getEntityAuditLogs(entity: string, entityId: string, limit = 50) {
    return await prisma.auditLog.findMany({
      where: { entity, entityId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })
  }

  // Get all audit logs with pagination
  static async getAuditLogs(page = 1, pageSize = 50) {
    const skip = (page - 1) * pageSize
    
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              email: true,
              name: true
            }
          }
        }
      }),
      prisma.auditLog.count()
    ])

    return {
      logs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }

  // Helper method to extract IP address from request
  private static getIpFromRequest(request?: NextRequest): string | undefined {
    if (!request) return undefined
    
    return (
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      undefined
    )
  }
}