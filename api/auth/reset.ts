import type { ResetPasswordRequest, ResetPasswordResponse } from '../../lib/types/auth';
import { getUserByEmail, storePasswordResetToken, verifyPasswordResetToken, updateUserPassword } from '../../lib/db/auth';
import { hashPassword, validatePasswordStrength } from '../../lib/utils/password';
import { generateResetToken } from '../../lib/utils/jwt';
import { rateLimitPasswordReset } from '../../lib/middleware/rateLimiter';
import { auditPasswordReset } from '../../lib/middleware/audit';

/**
 * Handle password reset request
 * POST /api/auth/reset
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const body: ResetPasswordRequest = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'البريد الإلكتروني مطلوب'
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check rate limiting
    const rateLimitResponse = await rateLimitPasswordReset(request, email);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      // Don't reveal that user doesn't exist for security
      await auditPasswordReset(request, email, false);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'إذا كان البريد الإلكتروني مسجل في النظام، ستتلقى رابط إعادة تعيين كلمة المرور'
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check user status
    if (user.Status !== 'Active') {
      await auditPasswordReset(request, email, false, user.User_id);
      
      return new Response(
        JSON.stringify({
          success: false,
          message: 'لا يمكن إعادة تعيين كلمة المرور لهذا الحساب'
        }),
        { 
          status: 403, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate reset token
    const resetToken = generateResetToken(32);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Store reset token
    const tokenStored = await storePasswordResetToken(email, resetToken, expiresAt);
    if (!tokenStored) {
      throw new Error('Failed to store reset token');
    }

    // TODO: Send email with reset link
    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // await sendPasswordResetEmail(email, resetLink, user.Name);

    // Log successful reset request
    await auditPasswordReset(request, email, true, user.User_id);

    const response: ResetPasswordResponse = {
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Password reset error:', error);
    
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
 * Handle password reset confirmation
 * PUT /api/auth/reset
 */
export async function PUT(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    // Validate input
    if (!token || !newPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'الرمز وكلمة المرور الجديدة مطلوبان'
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'كلمة المرور غير قوية بما فيه الكفاية',
          errors: passwordValidation.errors
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify reset token
    const email = await verifyPasswordResetToken(token);
    if (!email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'رمز إعادة التعيين غير صحيح أو منتهي الصلاحية'
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user
    const user = await getUserByEmail(email);
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'المستخدم غير موجود'
        }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password in database
    const updateSuccess = await updateUserPassword(user.User_id, newPasswordHash);
    if (!updateSuccess) {
      throw new Error('Failed to update password');
    }

    // TODO: Invalidate the reset token
    // TODO: Optionally invalidate all existing sessions for this user

    return new Response(
      JSON.stringify({
        success: true,
        message: 'تم تحديث كلمة المرور بنجاح'
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Password reset confirmation error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'حدث خطأ في تحديث كلمة المرور'
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
 * OPTIONS /api/auth/reset
 */
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}