import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setError(null);
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setError('فشل في تحميل الجلسة');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          roles(name, description),
          organizations(name, type, status)
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile(null);
        return;
      }
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Update last login
      if (data.user) {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('user_id', data.user.id);
      }

      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            user_id: data.user.id,
            name: userData.name,
            email: userData.email,
            role_id: userData.role_id || 'beneficiary',
            organization_id: userData.organization_id,
            phone_number: userData.phone_number,
            status: 'Active'
          });

        if (profileError) throw profileError;
      }

      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const getErrorMessage = (error: any): string => {
    if (!error) return '';
    
    const errorMappings: Record<string, string> = {
      'Invalid login credentials': 'بيانات تسجيل الدخول غير صحيحة',
      'Email not confirmed': 'يرجى تأكيد البريد الإلكتروني',
      'User already registered': 'المستخدم مسجل مسبقاً',
      'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
      'Unable to validate email address': 'عنوان البريد الإلكتروني غير صالح',
      'signup_disabled': 'التسجيل معطل حالياً'
    };

    const errorMessage = error.message || '';
    
    for (const [key, value] of Object.entries(errorMappings)) {
      if (errorMessage.includes(key)) {
        return value;
      }
    }
    
    return error.message || 'حدث خطأ غير متوقع';
  };

  return {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signOut
  };
}