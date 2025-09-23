import type { AuthMiddlewareRequest } from '../../lib/types/auth';
import { authenticateRequest } from '../../lib/middleware/rbac';
import { auditLogout } from '../../lib/middleware/audit';

/**
 * Handle user logout
 * POST /api/auth/logout
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const authRequest = request as AuthMiddlewareRequest;
    
    // Authenticate the request to get user info
    const user = await authenticateRequest(authRequest);
    
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'غير مصرح - لم يتم العثور على جلسة نشطة'
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log logout activity
    await auditLogout(request, user.user_id, user.organization_id);

    // TODO: Implement token blacklisting if needed
    // For JWT tokens, we rely on expiration, but you might want to maintain
    // a blacklist of revoked tokens for immediate invalidation

    // Clear authentication cookie
    return new Response(
      JSON.stringify({
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': 'auth_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
        } 
      }
    );

  } catch (error) {
    console.error('Logout error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'حدث خطأ في تسجيل الخروج'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

/**
 * Handle preflight requests
 * OPTIONS /api/auth/logout
 */
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}