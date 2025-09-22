import { supabase } from '../lib/supabase';
import { createId } from '../utils/supabaseHelpers';
import { logActivity } from './database';

export async function signInUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Get user profile
    if (data.user) {
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select(`
          *,
          roles(name),
          organizations(name, type)
        `)
        .eq('user_id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('user_id', data.user.id);

      // Log activity
      await logActivity({
        log_id: createId('log_'),
        user_id: data.user.id,
        organization_id: userProfile?.organization_id,
        action: 'تسجيل دخول',
        details: 'تم تسجيل الدخول بنجاح',
        ip_address: null,
        user_agent: navigator.userAgent
      });

      return { user: data.user, profile: userProfile };
    }

    return { user: data.user, profile: null };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signUpUser(email: string, password: string, userData: {
  name: string;
  role_id: string;
  organization_id?: string;
  phone_number?: string;
}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    // Create user profile
    if (data.user) {
      const user_id = data.user.id;
      
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          user_id,
          name: userData.name,
          email,
          role_id: userData.role_id,
          organization_id: userData.organization_id,
          phone_number: userData.phone_number,
          status: 'Active',
          created_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Log activity
      await logActivity({
        log_id: createId('log_'),
        user_id,
        organization_id: userData.organization_id,
        action: 'إنشاء حساب جديد',
        details: `تم إنشاء حساب جديد: ${userData.name}`,
        ip_address: null,
        user_agent: navigator.userAgent
      });
    }

    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Log activity before signing out
      await logActivity({
        log_id: createId('log_'),
        user_id: user.id,
        action: 'تسجيل خروج',
        details: 'تم تسجيل الخروج',
        ip_address: null,
        user_agent: navigator.userAgent
      });
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw error;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  } catch (error) {
    console.error('Password update error:', error);
    throw error;
  }
}

export async function getCurrentUserProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('users')
      .select(`
        *,
        roles(name, description),
        organizations(name, type, status)
      `)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return { user, profile };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}