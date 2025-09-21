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

// Authentication functions
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string, userData: {
  name: string;
  role_id: string;
  organization_id?: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// User management functions
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      roles(name, description),
      organizations(name)
    `);
  
  if (error) throw error;
  return data;
}

export async function createUser(userData: Tables['users']['Insert']) {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUser(userId: string, updates: Tables['users']['Update']) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteUser(userId: string) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('user_id', userId);
  
  if (error) throw error;
}

// Organization management functions
export async function getOrganizations() {
  const { data, error } = await supabase
    .from('organizations')
    .select(`
      *,
      subscription_plans(package_name, quota_limit)
    `);
  
  if (error) throw error;
  return data;
}

export async function createOrganization(orgData: Tables['organizations']['Insert']) {
  const { data, error } = await supabase
    .from('organizations')
    .insert(orgData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateOrganization(orgId: string, updates: Tables['organizations']['Update']) {
  const { data, error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('organization_id', orgId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Survey management functions
export async function getSurveys(organizationId?: string) {
  let query = supabase
    .from('surveys')
    .select(`
      *,
      organizations(name),
      questions(*)
    `);
  
  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createSurvey(surveyData: Tables['surveys']['Insert']) {
  const { data, error } = await supabase
    .from('surveys')
    .insert(surveyData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateSurvey(surveyId: string, updates: Tables['surveys']['Update']) {
  const { data, error } = await supabase
    .from('surveys')
    .update(updates)
    .eq('survey_id', surveyId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Beneficiary management functions
export async function getBeneficiaries(organizationId?: string) {
  let query = supabase
    .from('beneficiaries')
    .select('*');
  
  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createBeneficiary(beneficiaryData: Tables['beneficiaries']['Insert']) {
  const { data, error } = await supabase
    .from('beneficiaries')
    .insert(beneficiaryData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateBeneficiary(beneficiaryId: string, updates: Tables['beneficiaries']['Update']) {
  const { data, error } = await supabase
    .from('beneficiaries')
    .update(updates)
    .eq('beneficiary_id', beneficiaryId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Response management functions
export async function getSurveyResponses(surveyId: string) {
  const { data, error } = await supabase
    .from('responses')
    .select(`
      *,
      beneficiaries(name, email),
      questions(question_text, question_type)
    `)
    .eq('survey_id', surveyId);
  
  if (error) throw error;
  return data;
}

export async function submitSurveyResponse(responseData: Tables['responses']['Insert']) {
  const { data, error } = await supabase
    .from('responses')
    .insert(responseData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Activity logging functions
export async function logActivity(activityData: Tables['activity_log']['Insert']) {
  const { data, error } = await supabase
    .from('activity_log')
    .insert(activityData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getActivityLogs(organizationId?: string) {
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
}

// Transaction management functions
export async function getTransactions(organizationId?: string) {
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
}

export async function createTransaction(transactionData: Tables['transactions']['Insert']) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Request management functions
export async function getOrganizationRequests() {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('submitted_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createOrganizationRequest(requestData: Tables['requests']['Insert']) {
  const { data, error } = await supabase
    .from('requests')
    .insert(requestData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateOrganizationRequest(requestId: string, updates: Tables['requests']['Update']) {
  const { data, error } = await supabase
    .from('requests')
    .update(updates)
    .eq('request_id', requestId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Subscription plan functions
export async function getSubscriptionPlans() {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true);
  
  if (error) throw error;
  return data;
}

// Utility functions
export async function generateId(prefix: string = ''): Promise<string> {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Real-time subscriptions
export function subscribeToSurveyResponses(surveyId: string, callback: (payload: any) => void) {
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
      callback
    )
    .subscribe();
}

export function subscribeToActivityLogs(organizationId: string, callback: (payload: any) => void) {
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
      callback
    )
    .subscribe();
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