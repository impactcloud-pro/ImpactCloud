import { supabase } from '../lib/supabase';
import { createId } from '../utils/supabaseHelpers';

export interface ResponseData {
  response_id: string;
  beneficiary_id: string;
  survey_id: string;
  question_id: string;
  response: string;
  response_data?: string;
  channel?: string;
}

export async function submitSurveyResponse(responseData: Omit<ResponseData, 'response_id'>) {
  try {
    const response_id = createId('resp_');
    
    const { data, error } = await supabase
      .from('responses')
      .insert({
        response_id,
        ...responseData,
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting response:', error);
    throw error;
  }
}

export async function getSurveyResponses(survey_id: string) {
  try {
    const { data, error } = await supabase
      .from('responses')
      .select(`
        *,
        beneficiaries(name, email),
        questions(question, type)
      `)
      .eq('survey_id', survey_id)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching responses:', error);
    throw error;
  }
}

export async function getResponsesByBeneficiary(beneficiary_id: string) {
  try {
    const { data, error } = await supabase
      .from('responses')
      .select(`
        *,
        surveys(title),
        questions(question, type)
      `)
      .eq('beneficiary_id', beneficiary_id)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching beneficiary responses:', error);
    throw error;
  }
}

export async function calculateSurveyAnalytics(survey_id: string) {
  try {
    // Get all responses for the survey
    const { data: responses, error } = await supabase
      .from('responses')
      .select(`
        *,
        questions(question, type, domain, phase)
      `)
      .eq('survey_id', survey_id);

    if (error) throw error;

    if (!responses || responses.length === 0) {
      return {
        totalResponses: 0,
        completionRate: 0,
        averageScore: 0,
        demographics: {},
        impactAnalysis: {}
      };
    }

    // Calculate basic metrics
    const totalResponses = responses.length;
    const uniqueBeneficiaries = new Set(responses.map(r => r.beneficiary_id)).size;
    
    // Group responses by question
    const responsesByQuestion = responses.reduce((acc, response) => {
      if (!acc[response.question_id]) {
        acc[response.question_id] = [];
      }
      acc[response.question_id].push(response);
      return acc;
    }, {} as Record<string, any[]>);

    // Calculate impact analysis (before vs after)
    const impactAnalysis = {};
    const preQuestions = responses.filter(r => r.questions?.phase === 'pre');
    const postQuestions = responses.filter(r => r.questions?.phase === 'post');

    // Group by domain for impact calculation
    const domains = [...new Set(responses.map(r => r.questions?.domain).filter(Boolean))];
    
    for (const domain of domains) {
      const preResponses = preQuestions.filter(r => r.questions?.domain === domain);
      const postResponses = postQuestions.filter(r => r.questions?.domain === domain);
      
      if (preResponses.length > 0 && postResponses.length > 0) {
        const preAvg = preResponses.reduce((sum, r) => sum + (parseFloat(r.response) || 0), 0) / preResponses.length;
        const postAvg = postResponses.reduce((sum, r) => sum + (parseFloat(r.response) || 0), 0) / postResponses.length;
        
        impactAnalysis[domain] = {
          before: preAvg,
          after: postAvg,
          improvement: ((postAvg - preAvg) / preAvg) * 100
        };
      }
    }

    return {
      totalResponses,
      uniqueBeneficiaries,
      completionRate: (uniqueBeneficiaries / totalResponses) * 100,
      responsesByQuestion,
      impactAnalysis
    };
  } catch (error) {
    console.error('Error calculating analytics:', error);
    throw error;
  }
}