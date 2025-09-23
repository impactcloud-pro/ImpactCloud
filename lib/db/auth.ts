import { supabase } from '../supabase';
import type { User, UserAction } from '../types/auth';

/**
 * Get user by email address
 * @param email - User's email address
 * @returns User object or null if not found
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select(`
        *,
        Roles(name),
        Organizations(name)
      `)
      .eq('Email', email)
      .eq('Status', 'Active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Failed to fetch user');
  }
}

/**
 * Get user by ID
 * @param userId - User's unique identifier
 * @returns User object or null if not found
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select(`
        *,
        Roles(name),
        Organizations(name)
      `)
      .eq('User_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user');
  }
}

/**
 * Create a new user in the database
 * @param userData - User data to insert
 * @returns Created user object
 */
export async function createUser(userData: Omit<User, 'user_id' | 'created_at' | 'updated_at'>): Promise<User> {
  try {
    // Generate unique user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabase
      .from('Users')
      .insert({
        User_id: userId,
        Role_id: userData.role_id,
        Organization_id: userData.organization_id,
        Name: userData.name,
        Email: userData.email,
        Password_hash: userData.password_hash,
        Phone_number: userData.phone_number,
        Status: userData.status || 'Active'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log user creation activity
    await logUserAction({
      log_id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      organization_id: userData.organization_id,
      action: 'إنشاء مستخدم جديد',
      details: `تم إنشاء مستخدم جديد: ${userData.name} (${userData.email})`,
      ip_address: null, // TODO: Get from request context
      user_agent: null  // TODO: Get from request context
    });

    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

/**
 * Update user password
 * @param userId - User's unique identifier
 * @param newPasswordHash - New bcrypt hashed password
 * @returns Success boolean
 */
export async function updateUserPassword(userId: string, newPasswordHash: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('Users')
      .update({
        Password_hash: newPasswordHash,
        Updated_at: new Date().toISOString()
      })
      .eq('User_id', userId);

    if (error) {
      throw error;
    }

    // Log password update activity
    await logUserAction({
      log_id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      action: 'تحديث كلمة المرور',
      details: 'تم تحديث كلمة المرور بنجاح',
      ip_address: null, // TODO: Get from request context
      user_agent: null  // TODO: Get from request context
    });

    return true;
  } catch (error) {
    console.error('Error updating user password:', error);
    throw new Error('Failed to update password');
  }
}

/**
 * Update user status (Active, Suspended, Locked)
 * @param userId - User's unique identifier
 * @param status - New status
 * @returns Success boolean
 */
export async function updateUserStatus(userId: string, status: 'Active' | 'Suspended' | 'Locked'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('Users')
      .update({
        Status: status,
        Updated_at: new Date().toISOString()
      })
      .eq('User_id', userId);

    if (error) {
      throw error;
    }

    // Log status update activity
    await logUserAction({
      log_id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      action: 'تحديث حالة المستخدم',
      details: `تم تحديث حالة المستخدم إلى: ${status}`,
      ip_address: null, // TODO: Get from request context
      user_agent: null  // TODO: Get from request context
    });

    return true;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw new Error('Failed to update user status');
  }
}

/**
 * Log user action to activity log
 * @param actionData - Action data to log
 * @returns Success boolean
 */
export async function logUserAction(actionData: UserAction): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('Activity_log')
      .insert({
        Log_id: actionData.log_id,
        User_id: actionData.user_id,
        Organization_id: actionData.organization_id,
        Action: actionData.action,
        Details: actionData.details,
        IP_address: actionData.ip_address,
        User_agent: actionData.user_agent,
        Timestamp: actionData.timestamp || new Date().toISOString()
      });

    if (error) {
      console.error('Error logging user action:', error);
      // Don't throw error for logging failures to avoid breaking main functionality
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error logging user action:', error);
    return false;
  }
}

/**
 * Get failed login attempts count for user
 * @param email - User's email address
 * @returns Number of failed attempts in last hour
 */
export async function getFailedLoginAttempts(email: string): Promise<number> {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('Activity_log')
      .select('Log_id')
      .eq('Action', 'محاولة دخول فاشلة')
      .ilike('Details', `%${email}%`)
      .gte('Timestamp', oneHourAgo);

    if (error) {
      throw error;
    }

    return data?.length || 0;
  } catch (error) {
    console.error('Error getting failed login attempts:', error);
    return 0;
  }
}

/**
 * Check if user account is locked due to failed attempts
 * @param email - User's email address
 * @returns Boolean indicating if account is locked
 */
export async function isAccountLocked(email: string): Promise<boolean> {
  try {
    const user = await getUserByEmail(email);
    if (!user) return false;

    // Check if user status is locked
    if (user.Status === 'Locked') {
      return true;
    }

    // Check failed attempts count
    const failedAttempts = await getFailedLoginAttempts(email);
    return failedAttempts >= 5;
  } catch (error) {
    console.error('Error checking account lock status:', error);
    return false;
  }
}

/**
 * Lock user account after too many failed attempts
 * @param email - User's email address
 * @returns Success boolean
 */
export async function lockUserAccount(email: string): Promise<boolean> {
  try {
    const user = await getUserByEmail(email);
    if (!user) return false;

    await updateUserStatus(user.User_id, 'Locked');

    // Log account lock activity
    await logUserAction({
      log_id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: user.User_id,
      organization_id: user.Organization_id,
      action: 'قفل الحساب',
      details: `تم قفل الحساب بسبب محاولات دخول فاشلة متكررة: ${email}`,
      ip_address: null, // TODO: Get from request context
      user_agent: null  // TODO: Get from request context
    });

    return true;
  } catch (error) {
    console.error('Error locking user account:', error);
    return false;
  }
}

/**
 * Store password reset token
 * @param email - User's email address
 * @param token - Reset token
 * @param expiresAt - Token expiration time
 * @returns Success boolean
 */
export async function storePasswordResetToken(email: string, token: string, expiresAt: Date): Promise<boolean> {
  try {
    // TODO: Create password_reset_tokens table or use existing table
    // For now, we'll log it as an activity
    const user = await getUserByEmail(email);
    if (!user) return false;

    await logUserAction({
      log_id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: user.User_id,
      organization_id: user.Organization_id,
      action: 'طلب إعادة تعيين كلمة المرور',
      details: `تم إنشاء رمز إعادة تعيين كلمة المرور. انتهاء الصلاحية: ${expiresAt.toISOString()}`,
      ip_address: null, // TODO: Get from request context
      user_agent: null  // TODO: Get from request context
    });

    // TODO: Store token in secure table with expiration
    // This is a placeholder - implement proper token storage
    console.log(`Password reset token for ${email}: ${token} (expires: ${expiresAt})`);

    return true;
  } catch (error) {
    console.error('Error storing password reset token:', error);
    return false;
  }
}

/**
 * Verify password reset token
 * @param token - Reset token to verify
 * @returns User email if valid, null if invalid/expired
 */
export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  try {
    // TODO: Implement proper token verification from database
    // This is a placeholder implementation
    
    // For now, we'll check activity logs for recent reset requests
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('Activity_log')
      .select('Details, User_id')
      .eq('Action', 'طلب إعادة تعيين كلمة المرور')
      .gte('Timestamp', thirtyMinutesAgo)
      .order('Timestamp', { ascending: false })
      .limit(1);

    if (error || !data?.length) {
      return null;
    }

    // TODO: Implement proper token validation
    // This is a simplified check
    return 'user@example.com'; // Placeholder
  } catch (error) {
    console.error('Error verifying password reset token:', error);
    return null;
  }
}