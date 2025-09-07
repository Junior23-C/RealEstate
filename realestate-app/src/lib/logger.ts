// Secure logging utility that sanitizes sensitive data

interface LogContext {
  userId?: string
  ip?: string
  userAgent?: string
  endpoint?: string
  method?: string
  statusCode?: number
  duration?: number
  [key: string]: unknown
}

// Sensitive field patterns to redact
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /key/i,
  /auth/i,
  /credential/i,
  /session/i,
  /cookie/i,
  /authorization/i
]

const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g

function sanitizeValue(key: string, value: unknown): unknown {
  if (typeof value === 'string') {
    // Check if field name suggests sensitive data
    const isSensitiveField = SENSITIVE_PATTERNS.some(pattern => pattern.test(key))
    if (isSensitiveField) {
      return '[REDACTED]'
    }
    
    // Redact email addresses (keep domain for debugging)
    return value.replace(EMAIL_PATTERN, (email) => {
      const [, domain] = email.split('@')
      return `***@${domain}`
    })
  }
  
  if (typeof value === 'object' && value !== null) {
    const sanitized: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      sanitized[k] = sanitizeValue(k, v)
    }
    return sanitized
  }
  
  return value
}

export function sanitizeLogData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = sanitizeValue(key, value)
  }
  
  return sanitized
}

export class SecureLogger {
  private static formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const sanitizedContext = context ? sanitizeLogData(context) : {}
    
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...sanitizedContext
    })
  }
  
  // Enhanced request logging for security monitoring
  static logRequest(method: string, url: string, context?: LogContext): void {
    this.info(`${method} ${url}`, {
      ...context,
      type: 'request'
    })
  }
  
  static logSecurityEvent(event: string, context?: LogContext): void {
    this.security(`Security event: ${event}`, {
      ...context,
      securityEvent: true
    })
  }
  
  static logApiAccess(endpoint: string, userRole?: string, success: boolean = true, context?: LogContext): void {
    this.info(`API access: ${endpoint}`, {
      ...context,
      endpoint,
      userRole,
      success,
      type: 'api_access'
    })
  }
  
  static logAuthEvent(event: string, context?: LogContext): void {
    this.info(`Auth event: ${event}`, {
      ...context,
      type: 'authentication'
    })
  }
  
  static info(message: string, context?: LogContext): void {
    console.log(this.formatMessage('INFO', message, context))
  }
  
  static warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('WARN', message, context))
  }
  
  static error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : String(error)
    }
    
    console.error(this.formatMessage('ERROR', message, errorContext))
  }
  
  static security(message: string, context?: LogContext): void {
    // Security events should always be logged
    console.error(this.formatMessage('SECURITY', message, context))
  }
}

// Security event helpers
export const SecurityEvents = {
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  INVALID_CREDENTIALS: 'Invalid login attempt',
  UNAUTHORIZED_ACCESS: 'Unauthorized access attempt',
  SUSPICIOUS_FILE_UPLOAD: 'Suspicious file upload attempt',
  VALIDATION_FAILED: 'Input validation failed',
  TOKEN_MANIPULATION: 'Possible token manipulation detected'
} as const