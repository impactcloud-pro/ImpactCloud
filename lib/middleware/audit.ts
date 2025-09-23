import type { AuthMiddlewareRequest } from '../types/auth';
import { logUserAction } from '../db/auth';

/**
 * Extract client IP address from request
 * @param request - HTTP request object
 * @returns IP address string
 */
function getClientIP(request: Request): string {
  // Try various headers for IP address
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip',
    'cf-connecting-ip', // Cloudflare
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // Take the first IP if multiple are present
      return value.split(',')[0].trim();
    }
  }

  // Fallback to connection remote address (may not be available in all environments)
  return 'unknown';
}

/**
 * Extract user agent from request
 * @param request - HTTP request object
 * @returns User agent string
 */
function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}

/**
 * Log user action with request context
 * @param request - HTTP request object
 * @param action - Action description
 * @param details - Additional details
 * @param userId - User ID (optional, will try to extract from request)
 * @param organizationId - Organization ID (optional)
 */
export async function auditUserAction(
  request: AuthMiddlewareRequest,
  action: string,
  details: string,
  userId?: string,
  organizationId?: string
): Promise<void> {
  try {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);
    
    // Use provided userId or extract from authenticated request
    const effectiveUserId = userId || request.user?.user_id;
    const effectiveOrgId = organizationId || request.user?.organization_id;

    await logUserAction({
      log_id: logId,
      user_id: effectiveUserId,
      organization_id: effectiveOrgId,
      action,
      details,
      ip_address: ipAddress,
      user_agent: userAgent
    });
  } catch (error) {
    console.error('Error in audit logging:', error);
    // Don't throw error to avoid breaking main functionality
  }
}

/**
 * Middleware to automatically audit API requests
 * @param request - HTTP request object
 * @param action - Action being performed
 * @returns Middleware function
 */
export function auditMiddleware(action?: string) {
  return async (request: AuthMiddlewareRequest): Promise<void> => {
    try {
      const method = request.method;
      const url = new URL(request.url);
      const pathname = url.pathname;
      
      const defaultAction = action || `${method} ${pathname}`;
      const details = `تم الوصول إلى ${pathname} باستخدام ${method}`;

      await auditUserAction(request, defaultAction, details);
    } catch (error) {
      console.error('Audit middleware error:', error);
      // Don't throw to avoid breaking request flow
    }
  };
}

/**
 * Audit login attempts (both successful and failed)
 * @param request - HTTP request object
 * @param email - Email used for login attempt
 * @param success - Whether login was successful
 * @param reason - Failure reason (if applicable)
 * @param userId - User ID (if login successful)
 */
export async function auditLoginAttempt(
  request: Request,
  email: string,
  success: boolean,
  reason?: string,
  userId?: string
): Promise<void> {
  try {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);
    
    const action = success ? 'تسجيل دخول ناجح' : 'محاولة دخول فاشلة';
    const details = success 
      ? `تم تسجيل الدخول بنجاح للمستخدم: ${email}`
      : `فشل تسجيل الدخول للمستخدم: ${email}. السبب: ${reason || 'بيانات غير صحيحة'}`;

    await logUserAction({
      log_id: logId,
      user_id: userId,
      action,
      details,
      ip_address: ipAddress,
      user_agent: userAgent
    });
  } catch (error) {
    console.error('Error auditing login attempt:', error);
  }
}

/**
 * Audit logout action
 * @param request - HTTP request object
 * @param userId - User ID
 * @param organizationId - Organization ID (optional)
 */
export async function auditLogout(
  request: Request,
  userId: string,
  organizationId?: string
): Promise<void> {
  try {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);

    await logUserAction({
      log_id: logId,
      user_id: userId,
      organization_id: organizationId,
      action: 'تسجيل خروج',
      details: 'تم تسجيل الخروج من النظام',
      ip_address: ipAddress,
      user_agent: userAgent
    });
  } catch (error) {
    console.error('Error auditing logout:', error);
  }
}

/**
 * Audit password reset requests
 * @param request - HTTP request object
 * @param email - Email for password reset
 * @param success - Whether reset request was successful
 * @param userId - User ID (if found)
 */
export async function auditPasswordReset(
  request: Request,
  email: string,
  success: boolean,
  userId?: string
): Promise<void> {
  try {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);
    
    const action = 'طلب إعادة تعيين كلمة المرور';
    const details = success
      ? `تم إرسال رابط إعادة تعيين كلمة المرور إلى: ${email}`
      : `فشل طلب إعادة تعيين كلمة المرور للبريد: ${email}`;

    await logUserAction({
      log_id: logId,
      user_id: userId,
      action,
      details,
      ip_address: ipAddress,
      user_agent: userAgent
    });
  } catch (error) {
    console.error('Error auditing password reset:', error);
  }
}

/**
 * Audit sensitive actions (user creation, deletion, role changes)
 * @param request - HTTP request object
 * @param action - Action being performed
 * @param targetUserId - ID of user being affected
 * @param details - Additional details about the action
 */
export async function auditSensitiveAction(
  request: AuthMiddlewareRequest,
  action: string,
  targetUserId: string,
  details: string
): Promise<void> {
  try {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);
    
    const performedBy = request.user?.user_id || 'system';
    const enhancedDetails = `${details} | تم بواسطة: ${performedBy} | المستخدم المتأثر: ${targetUserId}`;

    await logUserAction({
      log_id: logId,
      user_id: request.user?.user_id,
      organization_id: request.user?.organization_id,
      action,
      details: enhancedDetails,
      ip_address: ipAddress,
      user_agent: userAgent
    });
  } catch (error) {
    console.error('Error auditing sensitive action:', error);
  }
}

/**
 * Create audit middleware for specific actions
 * @param actionName - Name of the action being audited
 * @returns Middleware function
 */
export function createAuditMiddleware(actionName: string) {
  return async (request: AuthMiddlewareRequest, details?: string): Promise<void> => {
    const defaultDetails = `تم تنفيذ العملية: ${actionName}`;
    await auditUserAction(request, actionName, details || defaultDetails);
  };
}