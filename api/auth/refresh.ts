import type { AuthMiddlewareRequest } from '../../lib/types/auth';
import { refreshJWT, extractTokenFromHeader, isTokenNearExpiry } from '../../lib/utils/jwt';
import { rateLimitAPI } from '../../lib/middleware/rateLimiter';
import { auditUserAction } from '../../lib/middleware/audit';

/**
 * Refresh JWT token
 * POST /api/auth/refresh
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // Check rate limiting
    const rateLimitResponse = await rateLimitAPI(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const authHeader = request.headers.get('Authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'لم يتم العثور على رمز مميز'
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if token needs refresh
    if (!isTokenNearExpiry(token)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'الرمز المميز ما زال صالحاً'
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Refresh the token
    const newToken = refreshJWT(token);
    if (!newToken) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'فشل في تجديد الرمز المميز'
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log token refresh
    const authRequest = request as AuthMiddlewareRequest;
    await auditUserAction(
      authRequest,
      'تجديد الرمز المميز',
      'تم تجديد رمز الجلسة بنجاح'
    );

    return new Response(
      JSON.stringify({
        success: true,
        token: newToken,
        message: 'تم تجديد الرمز المميز بنجاح'
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': `auth_token=${newToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=1800`
        } 
      }
    );

  } catch (error) {
    console.error('Token refresh error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'حدث خطأ في تجديد الرمز المميز'
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
 * OPTIONS /api/auth/refresh
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