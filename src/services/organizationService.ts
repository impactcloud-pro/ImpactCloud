import { supabase } from '../lib/supabase';
import { createId } from '../utils/supabaseHelpers';
import { logActivity } from './database';

export interface OrganizationData {
  organization_id: string;
  plan_id?: string;
  name: string;
  type?: string;
  status?: string;
  organization_manager?: string;
  username?: string;
  password?: string;
  number_of_beneficiaries?: number;
  number_of_surveys?: number;
  quota?: number;
  consumed?: number;
  remaining?: number;
  created_by?: string;
}

export interface BeneficiaryData {
  beneficiary_id: string;
  organization_id: string;
  name: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  age_group?: string;
  education_level?: string;
  job_title?: string;
  income_level?: string;
  marital_status?: string;
  region?: string;
}

export async function createOrganization(orgData: Omit<OrganizationData, 'organization_id'>) {
  try {
    const organization_id = createId('org_');
    
    const { data, error } = await supabase
      .from('organizations')
      .insert({
        organization_id,
        ...orgData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Log activity
    if (orgData.created_by) {
      await logActivity({
        log_id: createId('log_'),
        user_id: orgData.created_by,
        organization_id,
        action: 'إنشاء منظمة جديدة',
        details: `تم إنشاء منظمة: ${orgData.name}`,
        ip_address: null,
        user_agent: navigator.userAgent
      });
    }

    return data;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
}

export async function updateOrganization(organization_id: string, updates: Partial<OrganizationData>) {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('organization_id', organization_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
}

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
    return data || [];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
}

export async function createBeneficiary(beneficiaryData: Omit<BeneficiaryData, 'beneficiary_id'>) {
  try {
    const beneficiary_id = createId('ben_');
    
    const { data, error } = await supabase
      .from('beneficiaries')
      .insert({
        beneficiary_id,
        ...beneficiaryData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating beneficiary:', error);
    throw error;
  }
}

export async function updateBeneficiary(beneficiary_id: string, updates: Partial<BeneficiaryData>) {
  try {
    const { data, error } = await supabase
      .from('beneficiaries')
      .update(updates)
      .eq('beneficiary_id', beneficiary_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating beneficiary:', error);
    throw error;
  }
}

export async function getBeneficiariesByOrganization(organization_id: string) {
  try {
    const { data, error } = await supabase
      .from('beneficiaries')
      .select('*')
      .eq('organization_id', organization_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching beneficiaries:', error);
    throw error;
  }
}

export async function deleteBeneficiary(beneficiary_id: string) {
  try {
    // First delete all responses
    await supabase
      .from('responses')
      .delete()
      .eq('beneficiary_id', beneficiary_id);

    // Then delete the beneficiary
    const { error } = await supabase
      .from('beneficiaries')
      .delete()
      .eq('beneficiary_id', beneficiary_id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting beneficiary:', error);
    throw error;
  }
}

export async function getOrganizationStats(organization_id: string) {
  try {
    const [surveysResult, beneficiariesResult, responsesResult] = await Promise.all([
      supabase
        .from('surveys')
        .select('survey_id, status, total_responses')
        .eq('organization_id', organization_id),
      
      supabase
        .from('beneficiaries')
        .select('beneficiary_id')
        .eq('organization_id', organization_id),
      
      supabase
        .from('responses')
        .select('response_id')
        .in('survey_id', (
          await supabase
            .from('surveys')
            .select('survey_id')
            .eq('organization_id', organization_id)
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