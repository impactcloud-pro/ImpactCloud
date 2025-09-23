import type { AuthMiddlewareRequest, JWTPayload } from '../types/auth';
import { verifyJWT, extractTokenFromHeader } from '../utils/jwt';
import { getUserById } from '../db/auth';

export type UserRole = 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';

/**
 * Role hierarchy for permission inheritance
 * Higher roles inherit permissions from lower roles
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  'super_admin': 4,
  'admin': 3,
  'org_manager': 2,
  'beneficiary': 1
};

/**
 * Page access permissions by role
 */
const PAGE_PERMISSIONS: Record<string, UserRole[]> = {
  '/dashboard': ['super_admin', 'admin', 'org_manager'],
  '/surveys': ['admin', 'org_manager'],
  '/surveys/create': ['admin', 'org_manager'],
  '/surveys/edit': ['admin', 'org_manager'],
  '/surveys/results': ['admin', 'org_manager'],
  '/analysis': ['org_manager'],
  '/admin/users': ['super_admin', 'admin'],
  '/admin/organizations': ['super_admin'],
  '/admin/billing': ['super_admin', 'admin'],
  '/admin/settings': ['admin'],
  '/system/settings': ['super_admin'],
  '/system/activity': ['super_admin'],
  '/system/content': ['super_admin', 'admin'],
  '/beneficiaries': ['super_admin', 'admin', 'org_manager'],
  '/profile': ['org_manager'],
  '/subscription': ['super_admin', 'org_manager']
};

/**
 * API endpoint permissions by role
 */
const API_PERMISSIONS: Record<string, UserRole[]> = {
  'GET /api/users': ['super_admin', 'admin'],
  'POST /api/users': ['super_admin', 'admin'],
  'PUT /api/users': ['super_admin', 'admin'],
  'DELETE /api/users': ['super_admin'],
  'GET /api/organizations': ['super_admin'],
  'POST /api/organizations': ['super_admin'],
  'PUT /api/organizations': ['super_admin'],
  'DELETE /api/organizations': ['super_admin'],
  'GET /api/surveys': ['admin', 'org_manager'],
  'POST /api/surveys': ['admin', 'org_manager'],
  'PUT /api/surveys': ['admin', 'org_manager'],
  'DELETE /api/surveys': ['admin', 'org_manager'],
  'GET /api/beneficiaries': ['super_admin', 'admin', 'org_manager'],
  'POST /api/beneficiaries': ['admin', 'org_manager'],
  'PUT /api/beneficiaries': ['admin', 'org_manager'],
  'DELETE /api/beneficiaries': ['admin', 'org_manager']
};

/**
 * Extract and verify JWT token from request
 * @param request - HTTP request object
 * @returns Decoded JWT payload or null
 */
export async function authenticateRequest(request: AuthMiddlewareRequest): Promise<JWTPayload | null> {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return null;
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return null;
    }

    // Verify user still exists and is active
    const user = await getUserById(payload.user_id);
    if (!user || user.Status !== 'Active') {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Check if user has required role for accessing a resource
 * @param userRole - User's current role
 * @param requiredRoles - Array of roles that can access the resource
 * @returns Boolean indicating access permission
 */
export function hasRolePermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  if (!userRole || !requiredRoles.length) {
    return false;
  }

  // Super admin has access to everything
  if (userRole === 'super_admin') {
    return true;
  }

  // Check if user's role is in the required roles list
  return requiredRoles.includes(userRole);
}

/**
 * Check if user can access a specific page
 * @param userRole - User's current role
 * @param pagePath - Page path to check
 * @returns Boolean indicating access permission
 */
export function canAccessPage(userRole: UserRole, pagePath: string): boolean {
  const requiredRoles = PAGE_PERMISSIONS[pagePath];
  
  if (!requiredRoles) {
    // If no specific permissions defined, allow access
    return true;
  }

  return hasRolePermission(userRole, requiredRoles);
}

/**
 * Check if user can access a specific API endpoint
 * @param userRole - User's current role
 * @param method - HTTP method
 * @param endpoint - API endpoint path
 * @returns Boolean indicating access permission
 */
export function canAccessAPI(userRole: UserRole, method: string, endpoint: string): boolean {
  const permissionKey = `${method.toUpperCase()} ${endpoint}`;
  const requiredRoles = API_PERMISSIONS[permissionKey];
  
  if (!requiredRoles) {
    // If no specific permissions defined, deny access by default for security
    return false;
  }

  return hasRolePermission(userRole, requiredRoles);
}

/**
 * Check if user can perform action on organization data
 * @param userRole - User's current role
 * @param userOrgId - User's organization ID
 * @param targetOrgId - Target organization ID for the action
 * @returns Boolean indicating permission
 */
export function canAccessOrganizationData(
  userRole: UserRole, 
  userOrgId: string | undefined, 
  targetOrgId: string
): boolean {
  // Super admin can access all organization data
  if (userRole === 'super_admin') {
    return true;
  }

  // Admin can access all organization data
  if (userRole === 'admin') {
    return true;
  }

  // Organization managers can only access their own organization data
  if (userRole === 'org_manager') {
    return userOrgId === targetOrgId;
  }

  // Beneficiaries cannot access organization management data
  return false;
}

/**
 * Middleware function to protect routes with RBAC
 * @param requiredRoles - Array of roles that can access the route
 * @returns Middleware function
 */
export function requireRole(requiredRoles: UserRole[]) {
  return async (request: AuthMiddlewareRequest): Promise<Response | null> => {
    try {
      // Authenticate the request
      const user = await authenticateRequest(request);
      
      if (!user) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'غير مصرح - يرجى تسجيل الدخول' 
          }),
          { 
            status: 401, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check role permission
      if (!hasRolePermission(user.role as UserRole, requiredRoles)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'ليس لديك صلاحية للوصول لهذا المورد' 
          }),
          { 
            status: 403, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      }

      // Add user to request object for use in handlers
      request.user = user;
      
      // Continue to next middleware/handler
      return null;
    } catch (error) {
      console.error('RBAC middleware error:', error);
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
 * Middleware to check organization-specific access
 * @param request - HTTP request with user data
 * @param targetOrgId - Organization ID being accessed
 * @returns Boolean indicating permission
 */
export async function checkOrganizationAccess(
  request: AuthMiddlewareRequest, 
  targetOrgId: string
): Promise<boolean> {
  if (!request.user) {
    return false;
  }

  return canAccessOrganizationData(
    request.user.role as UserRole,
    request.user.organization_id,
    targetOrgId
  );
}

/**
 * Get user's effective permissions based on role
 * @param userRole - User's role
 * @returns Array of permission strings
 */
export function getUserPermissions(userRole: UserRole): string[] {
  const permissions: Record<UserRole, string[]> = {
    'super_admin': [
      'manage_system',
      'manage_organizations', 
      'manage_all_users',
      'manage_all_surveys',
      'view_all_analytics',
      'manage_billing',
      'view_activity_logs',
      'manage_content'
    ],
    'admin': [
      'manage_organizations',
      'manage_users',
      'manage_surveys',
      'view_analytics',
      'manage_billing',
      'view_activity_logs'
    ],
    'org_manager': [
      'manage_org_users',
      'create_surveys',
      'manage_org_surveys',
      'view_org_analytics',
      'manage_beneficiaries'
    ],
    'beneficiary': [
      'take_surveys',
      'view_own_responses'
    ]
  };

  return permissions[userRole] || [];
}