import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { logActivity } from '../services/database';
import { toast } from 'sonner@2.0.3';

interface SupabaseContextType {
  user: User | null;
  loading: boolean;
  userProfile: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  isConnected: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Test basic connection without checking specific tables
    const testConnection = async () => {
      try {
        // Test basic connection using auth session
        const { data, error } = await supabase.auth.getSession();
        
        if (!error) {
          setIsConnected(true);
          console.log('Supabase basic connection established');
        } else {
          setIsConnected(false);
          console.error('Supabase basic connection failed:', error);
        }
      } catch (error) {
        setIsConnected(false);
        console.error('Supabase connection test failed:', error);
      }
    };

    testConnection();

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
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
        
        // Log authentication events
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            await logActivity({
              log_id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              user_id: session.user.id,
              action: 'تسجيل دخول',
              details: 'تم تسجيل الدخول بنجاح',
              ip_address: null,
              user_agent: navigator.userAgent
            });
          } catch (error) {
            console.error('Failed to log sign in activity:', error);
          }
        }
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

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!isConnected) {
        throw new Error('قاعدة البيانات غير متصلة');
      }

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

      toast.success('تم تسجيل الدخول بنجاح');
    } catch (error: any) {
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      if (!isConnected) {
        throw new Error('قاعدة البيانات غير متصلة');
      }

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
            status: 'active'
          });

        if (profileError) throw profileError;
      }

      toast.success('تم إنشاء الحساب بنجاح');
    } catch (error: any) {
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Log sign out activity before signing out
      if (user) {
        try {
          await logActivity({
            log_id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            user_id: user.id,
            action: 'تسجيل خروج',
            details: 'تم تسجيل الخروج',
            ip_address: null,
            user_agent: navigator.userAgent
          });
        } catch (error) {
          console.error('Failed to log sign out activity:', error);
        }
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUserProfile(null);
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      const errorMessage = handleSupabaseError(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    userProfile,
    signIn,
    signUp,
    signOut,
    isConnected
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Helper function for error handling
function handleSupabaseError(error: any): string {
  if (!error) return '';
  
  const errorMappings: Record<string, string> = {
    'Invalid login credentials': 'بيانات تسجيل الدخول غير صحيحة',
    'Email not confirmed': 'يرجى تأكيد البريد الإلكتروني',
    'User already registered': 'المستخدم مسجل مسبقاً',
    'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    'Unable to validate email address': 'عنوان البريد الإلكتروني غير صالح',
    'signup_disabled': 'التسجيل معطل حالياً',
    'Database connection failed': 'فشل الاتصال بقاعدة البيانات',
    'Permission denied': 'ليس لديك صلاحية للقيام بهذا الإجراء',
    'Row level security': 'ليس لديك صلاحية للوصول لهذه البيانات'
  };

  const errorMessage = error.message || '';
  
  for (const [key, value] of Object.entries(errorMappings)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }
  
  return error.message || 'حدث خطأ غير متوقع';
}