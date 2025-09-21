import { supabase } from '../lib/supabase';
import { generateId } from '../services/database';

// Helper functions for common database operations

/**
 * Generate a unique ID with optional prefix
 */
export function createId(prefix: string = ''): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}${timestamp}_${random}`;
}

/**
 * Validate required environment variables
 */
export function validateEnvironment(): { isValid: boolean; missing: string[] } {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  return {
    isValid: missing.length === 0,
    missing
  };
}

/**
 * Handle Supabase errors with user-friendly messages
 */
export function handleSupabaseError(error: any): string {
  if (!error) return '';
  
  // Common error mappings
  const errorMappings: Record<string, string> = {
    'Invalid login credentials': 'بيانات تسجيل الدخول غير صحيحة',
    'Email not confirmed': 'يرجى تأكيد البريد الإلكتروني',
    'User already registered': 'المستخدم مسجل مسبقاً',
    'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    'Unable to validate email address': 'عنوان البريد الإلكتروني غير صالح',
    'signup_disabled': 'التسجيل معطل حالياً',
    'duplicate key value violates unique constraint': 'هذا العنصر موجود مسبقاً',
    'foreign key constraint': 'لا يمكن حذف هذا العنصر لأنه مرتبط بعناصر أخرى',
    'permission denied': 'ليس لديك صلاحية للقيام بهذا الإجراء',
    'row level security': 'ليس لديك صلاحية للوصول لهذه البيانات',
    'invalid input syntax': 'البيانات المدخلة غير صحيحة',
    'value too long': 'النص المدخل طويل جداً',
    'not null violation': 'يرجى ملء جميع الحقول المطلوبة',
    'check constraint': 'البيانات المدخلة لا تتوافق مع قواعد النظام',
    'connection refused': 'تعذر الاتصال بقاعدة البيانات',
    'timeout': 'انتهت مهلة الاتصال بقاعدة البيانات'
  };

  const errorMessage = error.message || '';
  
  for (const [key, value] of Object.entries(errorMappings)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }
  
  // Return original error message if no mapping found
  return error.message || 'حدث خطأ غير متوقع';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Saudi phone number
 */
export function isValidSaudiPhone(phone: string): boolean {
  const phoneRegex = /^(\+966|966|0)?[5-9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('966')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+966${cleaned.slice(1)}`;
  } else if (cleaned.length === 9) {
    return `+966${cleaned}`;
  }
  
  return phone;
}

/**
 * Calculate quota usage percentage
 */
export function calculateUsagePercentage(consumed: number, quota: number): number {
  if (quota === 0) return 0;
  return Math.round((consumed / quota) * 100);
}

/**
 * Get usage status color based on percentage
 */
export function getUsageStatusColor(percentage: number): string {
  if (percentage >= 90) return 'text-red-600';
  if (percentage >= 70) return 'text-orange-600';
  if (percentage >= 50) return 'text-yellow-600';
  return 'text-green-600';
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'SAR'): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Format date for Arabic locale
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format date and time for Arabic locale
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Check if user has permission for an action
 */
export async function checkUserPermission(userId: string, permission: string): Promise<boolean> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        role_id,
        roles(name)
      `)
      .eq('user_id', userId)
      .single();

    if (error || !user) return false;

    // Super admin has all permissions
    if (user.role_id === 'super_admin') return true;

    // Define role permissions
    const rolePermissions: Record<string, string[]> = {
      'admin': [
        'manage_surveys', 'manage_users', 'view_analytics', 
        'manage_billing', 'manage_organizations', 'view_activity_logs'
      ],
      'org_manager': [
        'create_surveys', 'view_own_analytics', 'manage_org_users',
        'manage_beneficiaries', 'view_own_activity_logs'
      ],
      'beneficiary': ['take_surveys', 'view_own_responses', 'update_own_profile']
    };

    const userPermissions = rolePermissions[user.role_id] || [];
    return userPermissions.includes(permission);
  } catch (error) {
    console.error('Error checking user permission:', error);
    return false;
  }
}

/**
 * Get user's organization data
 */
export async function getUserOrganization(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        organization_id,
        organizations(*)
      `)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.organizations;
  } catch (error) {
    console.error('Error fetching user organization:', error);
    return null;
  }
}

/**
 * Update organization quota usage
 */
export async function updateOrganizationQuota(organizationId: string, consumed: number) {
  try {
    // Get current organization data
    const { data: org, error: fetchError } = await supabase
      .from('organizations')
      .select('quota')
      .eq('organization_id', organizationId)
      .single();

    if (fetchError) throw fetchError;

    const remaining = (org?.quota || 0) - consumed;

    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        consumed,
        remaining: Math.max(0, remaining)
      })
      .eq('organization_id', organizationId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error updating organization quota:', error);
    throw error;
  }
}

/**
 * Increment survey count for organization
 */
export async function incrementSurveyCount(organizationId: string) {
  try {
    const { data: org, error: fetchError } = await supabase
      .from('organizations')
      .select('number_of_surveys')
      .eq('organization_id', organizationId)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        number_of_surveys: (org?.number_of_surveys || 0) + 1
      })
      .eq('organization_id', organizationId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error incrementing survey count:', error);
    throw error;
  }
}

/**
 * Get survey statistics for an organization
 */
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
        .select('response_id')
        .in('survey_id', (
          await supabase
            .from('surveys')
            .select('survey_id')
            .eq('organization_id', organizationId)
        ).data?.map(s => s.survey_id) || [])
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
    console.error('Error fetching organization stats:', error);
    return {
      totalSurveys: 0,
      activeSurveys: 0,
      completedSurveys: 0,
      totalBeneficiaries: 0,
      totalResponses: 0,
      averageResponsesPerSurvey: 0
    };
  }
}

/**
 * Search across multiple tables
 */
export async function globalSearch(query: string, organizationId?: string) {
  try {
    const searchTerm = `%${query}%`;
    
    const [surveysResult, beneficiariesResult, usersResult] = await Promise.all([
      supabase
        .from('surveys')
        .select('survey_id, title, description, organization_id')
        .ilike('title', searchTerm)
        .limit(10),
      
      supabase
        .from('beneficiaries')
        .select('beneficiary_id, name, email, organization_id')
        .or(`name.ilike.${searchTerm},email.ilike.${searchTerm}`)
        .limit(10),
      
      supabase
        .from('users')
        .select('user_id, name, email, organization_id')
        .or(`name.ilike.${searchTerm},email.ilike.${searchTerm}`)
        .limit(10)
    ]);

    let results = {
      surveys: surveysResult.data || [],
      beneficiaries: beneficiariesResult.data || [],
      users: usersResult.data || []
    };

    // Filter by organization if specified
    if (organizationId) {
      results = {
        surveys: results.surveys.filter(s => s.organization_id === organizationId),
        beneficiaries: results.beneficiaries.filter(b => b.organization_id === organizationId),
        users: results.users.filter(u => u.organization_id === organizationId)
      };
    }

    return results;
  } catch (error) {
    console.error('Error performing global search:', error);
    return {
      surveys: [],
      beneficiaries: [],
      users: []
    };
  }
}

/**
 * Batch operations for better performance
 */
export async function batchCreateBeneficiaries(beneficiaries: any[], organizationId: string) {
  try {
    const beneficiaryData = beneficiaries.map(b => ({
      beneficiary_id: createId('ben_'),
      organization_id: organizationId,
      ...b,
      created_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('beneficiaries')
      .insert(beneficiaryData)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Batch create beneficiaries error:', error);
    throw error;
  }
}

export async function batchCreateQuestions(questions: any[], surveyId: string) {
  try {
    const questionData = questions.map((q, index) => ({
      question_id: createId('q_'),
      survey_id: surveyId,
      order_num: index + 1,
      ...q,
      created_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('questions')
      .insert(questionData)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Batch create questions error:', error);
    throw error;
  }
}

/**
 * Connection monitoring
 */
export async function monitorConnection() {
  try {
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('roles')
      .select('count', { count: 'exact', head: true });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    return {
      isConnected: !error,
      responseTime,
      error: error?.message,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    return {
      isConnected: false,
      responseTime: -1,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}