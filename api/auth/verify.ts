import type { AuthMiddlewareRequest } from '../../lib/types/auth';
import { authenticateRequest } from '../../lib/middleware/rbac';
import { rateLimitAPI } from '../../lib/middleware/rateLimiter';

/**
 * Verify JWT token and return user info
 * GET /api/auth/verify
 */
export async function GET(request: Request): Promise<Response> {
  try {
    // Check rate limiting
    const rateLimitResponse = await rateLimitAPI(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const authRequest = request as AuthMiddlewareRequest;
    
    // Authenticate the request
    const user = await authenticateRequest(authRequest);
    
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'الرمز المميز غير صحيح أو منتهي الصلاحية'
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return user info without sensitive data
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
          organization_id: user.organization_id
        },
        message: 'الرمز المميز صحيح'
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Token verification error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'حدث خطأ في التحقق من الرمز المميز'
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
 * OPTIONS /api/auth/verify
 */
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}