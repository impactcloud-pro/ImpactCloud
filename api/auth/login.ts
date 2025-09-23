import type { AuthMiddlewareRequest, LoginRequest, LoginResponse } from '../../lib/types/auth';
import { getUserByEmail, isAccountLocked, lockUserAccount } from '../../lib/db/auth';
import { verifyPassword } from '../../lib/utils/password';
import { signJWT } from '../../lib/utils/jwt';
import { rateLimitLogin } from '../../lib/middleware/rateLimiter';
import { auditLoginAttempt } from '../../lib/middleware/audit';

/**
 * Handle user login
 * POST /api/auth/login
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // Parse request body
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'البريد الإلكتروني وكلمة المرور مطلوبان'
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check rate limiting
    const rateLimitResponse = await rateLimitLogin(request, email);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Check if account is locked
    const accountLocked = await isAccountLocked(email);
    if (accountLocked) {
      await auditLoginAttempt(request, email, false, 'الحساب مقفل');
      
      return new Response(
        JSON.stringify({
          success: false,
          message: 'الحساب مقفل بسبب محاولات دخول فاشلة متكررة. يرجى التواصل مع الإدارة'
        }),
        { 
          status: 423, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user from database
    const user = await getUserByEmail(email);
    if (!user) {
      await auditLoginAttempt(request, email, false, 'المستخدم غير موجود');
      
      return new Response(
        JSON.stringify({
          success: false,
          message: 'بيانات تسجيل الدخول غير صحيحة'
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.Password_hash);
    if (!passwordValid) {
      await auditLoginAttempt(request, email, false, 'كلمة مرور خاطئة');
      
      // TODO: Implement logic to lock account after 5 failed attempts
      // This should check failed attempts count and lock if needed
      
      return new Response(
        JSON.stringify({
          success: false,
          message: 'بيانات تسجيل الدخول غير صحيحة'
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check user status
    if (user.Status !== 'Active') {
      await auditLoginAttempt(request, email, false, `حالة المستخدم: ${user.Status}`);
      
      const statusMessages = {
        'Suspended': 'الحساب معلق. يرجى التواصل مع الإدارة',
        'Locked': 'الحساب مقفل. يرجى التواصل مع الإدارة'
      };
      
      return new Response(
        JSON.stringify({
          success: false,
          message: statusMessages[user.Status as keyof typeof statusMessages] || 'الحساب غير نشط'
        }),
        { 
          status: 403, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate JWT token
    const token = signJWT({
      user_id: user.User_id,
      email: user.Email,
      role: user.Role_id,
      organization_id: user.Organization_id
    });

    // Log successful login
    await auditLoginAttempt(request, email, true, undefined, user.User_id);

    // TODO: Update last login timestamp in Users table
    
    const response: LoginResponse = {
      success: true,
      user: {
        user_id: user.User_id,
        name: user.Name,
        email: user.Email,
        role: user.Role_id,
        organization: user.Organization_id
      },
      token,
      message: 'تم تسجيل الدخول بنجاح'
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=1800` // 30 minutes
        } 
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى'
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
 * OPTIONS /api/auth/login
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