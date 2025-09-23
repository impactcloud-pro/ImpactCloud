import type { AuthMiddlewareRequest } from '../types/auth';
import { authenticateRequest, requireRole, type UserRole } from './rbac';
import { auditMiddleware } from './audit';
import { rateLimitAPI } from './rateLimiter';

/**
 * Combined authentication middleware that handles:
 * - Rate limiting
 * - JWT verification
 * - Role-based access control
 * - Audit logging
 */
export function createAuthMiddleware(requiredRoles?: UserRole[], auditAction?: string) {
  return async (request: Request): Promise<Response | null> => {
    try {
      const authRequest = request as AuthMiddlewareRequest;

      // 1. Apply rate limiting
      const rateLimitResponse = await rateLimitAPI(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      // 2. Authenticate request if roles are required
      if (requiredRoles && requiredRoles.length > 0) {
        const rbacResponse = await requireRole(requiredRoles)(authRequest);
        if (rbacResponse) {
          return rbacResponse;
        }
      }

      // 3. Apply audit logging
      if (auditAction) {
        await auditMiddleware(auditAction)(authRequest);
      }

      // Request is authorized, continue to handler
      return null;
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      return new Response(
        JSON.stringify({
          success: false,
          message: 'خطأ في التحقق من الصلاحيات'
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  };
}

/**
 * Middleware for public endpoints (no authentication required)
 */
export function publicEndpoint() {
  return async (request: Request): Promise<Response | null> => {
    try {
      // Apply basic rate limiting even for public endpoints
      const rateLimitResponse = await rateLimitAPI(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      // Log access to public endpoints
      const authRequest = request as AuthMiddlewareRequest;
      await auditMiddleware('وصول عام')(authRequest);

      return null;
    } catch (error) {
      console.error('Public endpoint middleware error:', error);
      return null; // Don't block public endpoints on middleware errors
    }
  };
}

/**
 * Middleware for admin-only endpoints
 */
export function adminOnly() {
  return createAuthMiddleware(['super_admin', 'admin'], 'وصول إداري');
}

/**
 * Middleware for super admin only endpoints
 */
export function superAdminOnly() {
  return createAuthMiddleware(['super_admin'], 'وصول مدير النظام');
}

/**
 * Middleware for organization managers and above
 */
export function orgManagerAndAbove() {
  return createAuthMiddleware(['super_admin', 'admin', 'org_manager'], 'وصول مدير منظمة');
}

/**
 * Middleware for authenticated users (any role)
 */
export function authenticatedOnly() {
  return createAuthMiddleware(['super_admin', 'admin', 'org_manager', 'beneficiary'], 'وصول مصدق');
}

/**
 * HTTPS enforcement middleware
 * @param request - HTTP request object
 * @returns Redirect response if not HTTPS, null otherwise
 */
export function enforceHTTPS(request: Request): Response | null {
  const url = new URL(request.url);
  
  // Skip HTTPS enforcement in development
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  // Check if request is not HTTPS
  if (url.protocol !== 'https:') {
    const httpsUrl = `https://${url.host}${url.pathname}${url.search}`;
    
    return new Response(null, {
      status: 301,
      headers: {
        'Location': httpsUrl,
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
      }
    });
  }

  return null;
}

/**
 * Security headers middleware
 * @param response - Response object to add headers to
 * @returns Response with security headers
 */
export function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  
  // Add security headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Add HSTS header for HTTPS
  if (process.env.NODE_ENV === 'production') {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}