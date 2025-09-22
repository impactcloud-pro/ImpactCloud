import { supabase } from '../lib/supabase';
import { createId } from '../utils/supabaseHelpers';
import { logActivity } from './database';

export interface SurveyData {
  survey_id: string;
  organization_id: string;
  title: string;
  description?: string;
  impact_domains?: string;
  selected_sectors?: string;
  selected_filters?: string;
  status: 'draft' | 'active' | 'completed';
  start_date?: string;
  end_date?: string;
  settings?: string;
  created_by: string;
}

export interface QuestionData {
  question_id: string;
  survey_id: string;
  question: string;
  type: string;
  domain?: string;
  sector?: string;
  order_num: number;
  phase: 'pre' | 'post';
  required?: boolean;
  options?: string;
}

export async function createSurvey(surveyData: Omit<SurveyData, 'survey_id'>) {
  try {
    const survey_id = createId('survey_');
    
    const { data, error } = await supabase
      .from('surveys')
      .insert({
        survey_id,
        ...surveyData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await logActivity({
      log_id: createId('log_'),
      user_id: surveyData.created_by,
      organization_id: surveyData.organization_id,
      action: 'إنشاء استبيان جديد',
      details: `تم إنشاء استبيان: ${surveyData.title}`,
      ip_address: null,
      user_agent: navigator.userAgent
    });

    return data;
  } catch (error) {
    console.error('Error creating survey:', error);
    throw error;
  }
}

export async function updateSurvey(survey_id: string, updates: Partial<SurveyData>) {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .update(updates)
      .eq('survey_id', survey_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating survey:', error);
    throw error;
  }
}

export async function getSurveysByOrganization(organization_id: string) {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select(`
        *,
        questions(*)
      `)
      .eq('organization_id', organization_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching surveys:', error);
    throw error;
  }
}

export async function addQuestionToSurvey(questionData: Omit<QuestionData, 'question_id'>) {
  try {
    const question_id = createId('q_');
    
    const { data, error } = await supabase
      .from('questions')
      .insert({
        question_id,
        ...questionData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
}

export async function updateQuestion(question_id: string, updates: Partial<QuestionData>) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('question_id', question_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
}

export async function deleteQuestion(question_id: string) {
  try {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('question_id', question_id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
}

export async function getQuestionsBySurvey(survey_id: string) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('survey_id', survey_id)
      .order('order_num', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

export async function publishSurvey(survey_id: string) {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .update({ 
        status: 'active',
        start_date: new Date().toISOString()
      })
      .eq('survey_id', survey_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error publishing survey:', error);
    throw error;
  }
}

export async function deleteSurvey(survey_id: string) {
  try {
    // First delete all questions
    await supabase
      .from('questions')
      .delete()
      .eq('survey_id', survey_id);

    // Then delete all responses
    await supabase
      .from('responses')
      .delete()
      .eq('survey_id', survey_id);

    // Finally delete the survey
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('survey_id', survey_id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting survey:', error);
    throw error;
  }
}