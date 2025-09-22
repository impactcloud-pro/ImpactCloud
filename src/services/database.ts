import { supabase } from '../lib/supabase';

// Database service functions

// User management functions
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

export async function createUser(userData: any) {
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

export async function updateUser(userId: string, updates: any) {
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

// Organization management functions
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

export async function createOrganization(orgData: any) {
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

export async function updateOrganization(orgId: string, updates: any) {
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

// Survey management functions
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

export async function createSurvey(surveyData: any) {
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

export async function updateSurvey(surveyId: string, updates: any) {
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

// Beneficiary management functions
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

export async function createBeneficiary(beneficiaryData: any) {
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

export async function updateBeneficiary(beneficiaryId: string, updates: any) {
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

// Response management functions
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

export async function submitSurveyResponse(responseData: any) {
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

// Activity logging functions
export async function logActivity(activityData: any) {
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

// Transaction management functions
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

export async function createTransaction(transactionData: any) {
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
      details: `تم إنشاء معاملة بقيمة ${transactionData.total} ريال`,
      ip_address: null,
      user_agent: navigator.userAgent
    });
    
    return data;
  } catch (error) {
    console.error('Create transaction error:', error);
    throw error;
  }
}

// Request management functions
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

export async function createOrganizationRequest(requestData: any) {
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

export async function updateOrganizationRequest(requestId: string, updates: any) {
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

// Subscription plan functions
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

// Utility functions
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

// Real-time subscriptions
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

// Questions management
export async function createQuestion(questionData: any) {
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

// Roles management
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

// Analytics functions
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

// Export functions for use in components