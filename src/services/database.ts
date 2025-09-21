import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

// Type aliases for easier use
type Tables = Database['public']['Tables'];
type User = Tables['users']['Row'];
type Organization = Tables['organizations']['Row'];
type Survey = Tables['surveys']['Row'];
type Beneficiary = Tables['beneficiaries']['Row'];
type Response = Tables['responses']['Row'];
type ActivityLog = Tables['activity_log']['Row'];
type Transaction = Tables['transactions']['Row'];
type Request = Tables['requests']['Row'];
type Role = Tables['roles']['Row'];
type SubscriptionPlan = Tables['subscription_plans']['Row'];

// Enhanced authentication functions with better error handling
export async function signInWithEmail(email: string, password: string) {
  try {
    // First try to find user in our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        roles(name, description),
        organizations(name, type)
      `)
      .eq('email', email)
      .single();

    if (userError) {
      console.log('User not found in database, attempting auth sign in');
    }

    // Attempt Supabase auth sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Update last login if user exists in our users table
    if (userData && data.user) {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('user_id', data.user.id);
    }
    
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signUpWithEmail(email: string, password: string, userData: {
  name: string;
  role_id: string;
  organization_id?: string;
  phone_number?: string;
}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    
    // Create user profile in our users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          user_id: data.user.id,
          name: userData.name,
          email: email,
          role_id: userData.role_id,
          organization_id: userData.organization_id,
          phone_number: userData.phone_number,
          status: 'active'
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        throw profileError;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
}

// Enhanced user management functions
export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        roles(name, description),
        organizations(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
}

export async function createUser(userData: Tables['users']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log the activity
    await logActivity({
      log_id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userData.user_id,
      action: 'إنشاء مستخدم جديد',
      details: `تم إنشاء مستخدم جديد: ${userData.name}`,
      ip_address: null,
      user_agent: navigator.userAgent
    });
    
    return data;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

export async function updateUser(userId: string, updates: Tables['users']['Update']) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
}

// Enhanced organization management functions
export async function getOrganizations() {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select(`
        *,
        subscription_plans(package_name, quota_limit)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get organizations error:', error);
    throw error;
  }
}

export async function createOrganization(orgData: Tables['organizations']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .insert(orgData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create organization error:', error);
    throw error;
  }
}

export async function updateOrganization(orgId: string, updates: Tables['organizations']['Update']) {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('organization_id', orgId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update organization error:', error);
    throw error;
  }
}

// Enhanced survey management functions
export async function getSurveys(organizationId?: string) {
  try {
    let query = supabase
      .from('surveys')
      .select(`
        *,
        organizations(name),
        questions(*)
      `)
      .order('created_at', { ascending: false });
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get surveys error:', error);
    throw error;
  }
}

export async function createSurvey(surveyData: Tables['surveys']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .insert(surveyData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log the activity
    await logActivity({
      log_id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: surveyData.created_by,
      organization_id: surveyData.organization_id,
      action: 'إنشاء استبيان جديد',
      details: `تم إنشاء استبيان: ${surveyData.title}`,
      ip_address: null,
      user_agent: navigator.userAgent
    });
    
    return data;
  } catch (error) {
    console.error('Create survey error:', error);
    throw error;
  }
}

export async function updateSurvey(surveyId: string, updates: Tables['surveys']['Update']) {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .update(updates)
      .eq('survey_id', surveyId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update survey error:', error);
    throw error;
  }
}

// Enhanced beneficiary management functions
export async function getBeneficiaries(organizationId?: string) {
  try {
    let query = supabase
      .from('beneficiaries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get beneficiaries error:', error);
    throw error;
  }
}

export async function createBeneficiary(beneficiaryData: Tables['beneficiaries']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('beneficiaries')
      .insert(beneficiaryData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create beneficiary error:', error);
    throw error;
  }
}

export async function updateBeneficiary(beneficiaryId: string, updates: Tables['beneficiaries']['Update']) {
  try {
    const { data, error } = await supabase
      .from('beneficiaries')
      .update(updates)
      .eq('beneficiary_id', beneficiaryId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update beneficiary error:', error);
    throw error;
  }
}

// Enhanced response management functions
export async function getSurveyResponses(surveyId: string) {
  try {
    const { data, error } = await supabase
      .from('responses')
      .select(`
        *,
        beneficiaries(name, email),
        questions(question_text, question_type)
      `)
      .eq('survey_id', surveyId)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get survey responses error:', error);
    throw error;
  }
}

export async function submitSurveyResponse(responseData: Tables['responses']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('responses')
      .insert(responseData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Submit survey response error:', error);
    throw error;
  }
}

// Enhanced activity logging functions
export async function logActivity(activityData: Tables['activity_log']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .insert(activityData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Log activity error:', error);
    // Don't throw error for logging failures to avoid breaking main functionality
    return null;
  }
}

export async function getActivityLogs(organizationId?: string) {
  try {
    let query = supabase
      .from('activity_log')
      .select(`
        *,
        users(name, email),
        organizations(name)
      `)
      .order('timestamp', { ascending: false });
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get activity logs error:', error);
    throw error;
  }
}

// Enhanced transaction management functions
export async function getTransactions(organizationId?: string) {
  try {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        organizations(name)
      `)
      .order('created_at', { ascending: false });
    
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get transactions error:', error);
    throw error;
  }
}

export async function createTransaction(transactionData: Tables['transactions']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log the activity
    await logActivity({
      log_id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      organization_id: transactionData.organization_id,
      action: 'إنشاء معاملة مالية',
      details: `تم إنشاء معاملة بقيمة ${transactionData.amount} ${transactionData.currency}`,
      ip_address: null,
      user_agent: navigator.userAgent
    });
    
    return data;
  } catch (error) {
    console.error('Create transaction error:', error);
    throw error;
  }
}

// Enhanced request management functions
export async function getOrganizationRequests() {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get organization requests error:', error);
    throw error;
  }
}

export async function createOrganizationRequest(requestData: Tables['requests']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create organization request error:', error);
    throw error;
  }
}

export async function updateOrganizationRequest(requestId: string, updates: Tables['requests']['Update']) {
  try {
    const { data, error } = await supabase
      .from('requests')
      .update(updates)
      .eq('request_id', requestId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update organization request error:', error);
    throw error;
  }
}

// Enhanced subscription plan functions
export async function getSubscriptionPlans() {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('total_price_monthly', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get subscription plans error:', error);
    throw error;
  }
}

// Enhanced utility functions
export async function generateId(prefix: string = ''): Promise<string> {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Database health check function
export async function checkDatabaseHealth() {
  try {
    const tables = [
      'roles', 'subscription_plans', 'organizations', 'users', 
      'beneficiaries', 'surveys', 'questions', 'responses', 
      'activity_log', 'transactions', 'requests'
    ];
    
    const results = await Promise.all(
      tables.map(async (table) => {
        try {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          
          return {
            table,
            status: error ? 'error' : 'ok',
            count: count || 0,
            error: error?.message
          };
        } catch (err: any) {
          return {
            table,
            status: 'error',
            count: 0,
            error: err.message
          };
        }
      })
    );
    
    return results;
  } catch (error) {
    console.error('Database health check error:', error);
    throw error;
  }
}

// Enhanced real-time subscriptions with error handling
export function subscribeToSurveyResponses(surveyId: string, callback: (payload: any) => void) {
  try {
    return supabase
      .channel(`survey_responses_${surveyId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'responses',
          filter: `survey_id=eq.${surveyId}`
        },
        (payload) => {
          try {
            callback(payload);
          } catch (error) {
            console.error('Real-time callback error:', error);
          }
        }
      )
      .subscribe();
  } catch (error) {
    console.error('Subscribe to survey responses error:', error);
    throw error;
  }
}

export function subscribeToActivityLogs(organizationId: string, callback: (payload: any) => void) {
  try {
    return supabase
      .channel(`activity_logs_${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_log',
          filter: `organization_id=eq.${organizationId}`
        },
        (payload) => {
          try {
            callback(payload);
          } catch (error) {
            console.error('Real-time callback error:', error);
          }
        }
      )
      .subscribe();
  } catch (error) {
    console.error('Subscribe to activity logs error:', error);
    throw error;
  }
}

// New functions for questions management
export async function createQuestion(questionData: Tables['questions']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert(questionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create question error:', error);
    throw error;
  }
}

export async function getQuestionsBySurvey(surveyId: string) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('survey_id', surveyId)
      .order('order_num', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get questions by survey error:', error);
    throw error;
  }
}

// New functions for roles management
export async function getRoles() {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get roles error:', error);
    throw error;
  }
}

// Analytics and reporting functions
export async function getOrganizationStats(organizationId: string) {
  try {
    const [surveysResult, beneficiariesResult, responsesResult] = await Promise.all([
      supabase
        .from('surveys')
        .select('survey_id, status, total_responses')
        .eq('organization_id', organizationId),
      
      supabase
        .from('beneficiaries')
        .select('beneficiary_id')
        .eq('organization_id', organizationId),
      
      supabase
        .from('responses')
        .select('response_id, survey_id')
        .in('survey_id', 
          supabase
            .from('surveys')
            .select('survey_id')
            .eq('organization_id', organizationId)
        )
    ]);

    const surveys = surveysResult.data || [];
    const beneficiaries = beneficiariesResult.data || [];
    const responses = responsesResult.data || [];

    return {
      totalSurveys: surveys.length,
      activeSurveys: surveys.filter(s => s.status === 'active').length,
      completedSurveys: surveys.filter(s => s.status === 'completed').length,
      totalBeneficiaries: beneficiaries.length,
      totalResponses: responses.length,
      averageResponsesPerSurvey: surveys.length > 0 ? Math.round(responses.length / surveys.length) : 0
    };
  } catch (error) {
    console.error('Get organization stats error:', error);
    throw error;
  }
}

// Export types for use in components
export type {
  User,
  Organization,
  Survey,
  Beneficiary,
  Response,
  ActivityLog,
  Transaction,
  Request,
  Role,
  SubscriptionPlan
};